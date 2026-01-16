"use server";

import { db } from "~/lib/db";
import { validateRequest } from "~/lib/auth";

export interface ProductivityData {
	date: string;
	employeeId: string;
	employeeName: string;
	stationName: string | null;
	hoursWorked: number;
	unitsProcessed: number | null;
	efficiency: number | null;
	qualityScore: number | null;
	overtimeHours: number | null;
}

export interface TaskPerformanceData {
	date: string;
	taskTypeName: string;
	taskCount: number;
	totalUnits: number;
	averageUnitsPerTask: number;
	totalHours: number;
	hoursPerUnit: number;
}

export interface StationEfficiencyData {
	stationName: string;
	totalHours: number;
	totalUnits: number | null;
	efficiencyUnits: number | null;
	averageEfficiency: number | null;
	totalEmployees: number;
	peakOccupancy: number;
}

export interface OvertimeData {
	date: string;
	employeeId: string;
	employeeName: string;
	regularHoursWorked: number;
	overtimeHoursWorked: number;
	stationName: string | null;
}

export async function getProductivityReport(
	startDate: Date,
	endDate: Date,
	employeeId?: string,
	stationId?: string
): Promise<ProductivityData[]> {
	const { user } = await validateRequest();
	if (!user) {
		throw new Error("Unauthorized");
	}

	const whereClause: any = {
		startTime: {
			gte: startDate,
			lte: endDate,
		},
		type: "WORK",
		deletedAt: null,
	};

	if (employeeId) {
		whereClause.employeeId = employeeId;
	}

	if (stationId) {
		whereClause.stationId = stationId;
	}

	// Get time logs and calculate productivity metrics
	const timeLogs = await db.timeLog.findMany({
		where: whereClause,
		include: {
			Employee: true,
			Station: true,
		},
		orderBy: { startTime: "asc" },
	});

	// Group by employee and date
	const productivityMap = new Map<string, ProductivityData>();

	timeLogs.forEach((log) => {
		const dateStr = new Date(log.startTime).toISOString().split("T")[0];
		const key = `${log.employeeId}-${dateStr}`;

		let duration = 0;
		if (log.endTime) {
			duration =
				(new Date(log.endTime).getTime() - new Date(log.startTime).getTime()) / (1000 * 60 * 60);
		}

		const existing = productivityMap.get(key);
		if (existing) {
			existing.hoursWorked += duration;
		} else {
			productivityMap.set(key, {
				date: dateStr,
				employeeId: log.employeeId,
				employeeName: log.Employee.name,
				stationName: log.Station?.name || null,
				hoursWorked: duration,
				unitsProcessed: 0,
				efficiency: 0,
				qualityScore: null,
				overtimeHours: 0,
			});
		}
	});

	// Enhance with performance metrics
	const performanceMetrics = await db.performanceMetric.findMany({
		where: {
			date: { gte: startDate, lte: endDate },
			...(employeeId && { employeeId }),
		},
	});

	performanceMetrics.forEach((metric) => {
		const dateStr = metric.date.toISOString().split("T")[0];
		const key = `${metric.employeeId}-${dateStr}`;
		const timeData = productivityMap.get(key);
		if (timeData) {
			timeData.unitsProcessed = metric.unitsProcessed;
			timeData.efficiency = metric.efficiency;
			timeData.qualityScore = metric.qualityScore;
			timeData.overtimeHours = metric.overtimeHours;
		}
	});

	return Array.from(productivityMap.values());
}

export async function getTaskPerformanceReport(
	startDate: Date,
	endDate: Date,
	taskTypeId?: string
): Promise<TaskPerformanceData[]> {
	const { user } = await validateRequest();
	if (!user) {
		throw new Error("Unauthorized");
	}

	const whereClause: any = {
		startTime: {
			gte: startDate,
			lte: endDate,
		},
		...(taskTypeId && { taskTypeId }),
	};

	const taskAssignments = await db.taskAssignment.findMany({
		where: whereClause,
		include: {
			TaskType: true,
			Employee: true,
			TimeLogs: true,
		},
	});

	// Group by task type and date
	const taskMap = new Map<string, TaskPerformanceData>();

	taskAssignments.forEach((task) => {
		const dateStr = new Date(task.startTime).toISOString().split("T")[0];
		const key = `${task.taskTypeId}-${dateStr}`;

		const duration =
			(task.endTime ? new Date(task.endTime).getTime() - new Date(task.startTime).getTime() : 0) /
			(1000 * 60 * 60);

		const existing = taskMap.get(key);
		if (existing) {
			existing.taskCount += 1;
			existing.totalUnits += task.unitsCompleted || 0;
			existing.totalHours += duration;
		} else {
			taskMap.set(key, {
				date: dateStr,
				taskTypeName: task.TaskType.name,
				taskCount: 1,
				totalUnits: task.unitsCompleted || 0,
				averageUnitsPerTask: task.unitsCompleted || 0,
				totalHours: duration,
				hoursPerUnit: duration / (task.unitsCompleted || 1),
			});
		}
	});

	// Calculate averages
	taskMap.forEach((data) => {
		if (data.taskCount > 0) {
			data.averageUnitsPerTask = data.totalUnits / data.taskCount;
		}
		if (data.totalUnits > 0) {
			data.hoursPerUnit = data.totalHours / data.totalUnits;
		}
	});

	return Array.from(taskMap.values());
}

export async function getStationEfficiencyReport(
	startDate: Date,
	endDate: Date
): Promise<StationEfficiencyData[]> {
	const { user } = await validateRequest();
	if (!user) {
		throw new Error("Unauthorized");
	}

	const timeLogs = await db.timeLog.findMany({
		where: {
			startTime: { gte: startDate, lte: endDate },
			type: "WORK",
			deletedAt: null,
		},
		include: {
			Employee: true,
			Station: true,
		},
	});

	const stationMap = new Map<string, StationEfficiencyData>();

	timeLogs.forEach((log) => {
		if (!log.Station) return;

		const duration = log.endTime
			? (new Date(log.endTime).getTime() - new Date(log.startTime).getTime()) / (1000 * 60 * 60)
			: 0;

		const existing = stationMap.get(log.Station.id);
		if (existing) {
			existing.totalHours += duration;
			existing.peakOccupancy = Math.max(
				existing.peakOccupancy,
				// This would need more complex logic for actual peak calculation
				1 // Placeholder
			);
		} else {
			stationMap.set(log.Station.id, {
				stationName: log.Station.name,
				totalHours: duration,
				totalUnits: 0,
				efficiencyUnits: 0,
				averageEfficiency: 0,
				totalEmployees: 0,
				peakOccupancy: 1,
			});
		}
	});

	// Count unique employees per station
	const stations = await db.station.findMany();
	stations.forEach((station) => {
		const data = stationMap.get(station.id);
		if (data) {
			const uniqueEmployeeIds = new Set(
				timeLogs.filter((log) => log.Station?.id === station.id).map((log) => log.employeeId)
			);
			data.totalEmployees = uniqueEmployeeIds.size;
		}
	});

	return Array.from(stationMap.values());
}

export async function getOvertimeReport(startDate: Date, endDate: Date): Promise<OvertimeData[]> {
	const { user } = await validateRequest();
	if (!user) {
		throw new Error("Unauthorized");
	}

	// Get weekly overtime data
	const performanceMetrics = await db.performanceMetric.findMany({
		where: {
			date: { gte: startDate, lte: endDate },
			overtimeHours: { gt: 0 },
		},
		include: {
			Employee: true,
		},
	});

	const overtimeData: OvertimeData[] = performanceMetrics.map((metric) => ({
		date: metric.date.toISOString().split("T")[0],
		employeeId: metric.employeeId,
		employeeName: metric.Employee.name,
		regularHoursWorked: metric.hoursWorked - (metric.overtimeHours || 0),
		overtimeHoursWorked: metric.overtimeHours || 0,
		stationName: null, // This would need to be populated based on primary station that day
	}));

	return overtimeData;
}

export async function getEmployeeSummaryStats(
	startDate: Date,
	endDate: Date
): Promise<{
	totalEmployees: number;
	activeEmployees: number;
	totalHoursWorked: number;
	averageHoursPerEmployee: number;
	totalOvertimeHours: number;
	peakDayOccupancy: number;
}> {
	const { user } = await validateRequest();
	if (!user) {
		throw new Error("Unauthorized");
	}

	const [totalCount, performanceMetrics, timeLogs] = await Promise.all([
		db.employee.count({
			where: { status: "ACTIVE" },
		}),
		db.performanceMetric.findMany({
			where: { date: { gte: startDate, lte: endDate } },
		}),
		db.timeLog.findMany({
			where: {
				startTime: { gte: startDate, lte: endDate },
				type: "WORK",
				deletedAt: null,
			},
		}),
	]);

	const activeEmployees = new Set(timeLogs.map((log) => log.employeeId)).size;
	const totalHoursWorked = performanceMetrics.reduce((sum, m) => sum + m.hoursWorked, 0);
	const totalOvertimeHours = performanceMetrics.reduce((sum, m) => sum + (m.overtimeHours || 0), 0);

	// Calculate peak day occupancy
	const dailyOccupancy = new Map<string, number>();
	timeLogs.forEach((log) => {
		const dateStr = new Date(log.startTime).toISOString().split("T")[0];
		dailyOccupancy.set(dateStr, (dailyOccupancy.get(dateStr) || 0) + 1);
	});
	const peakDayOccupancy = Math.max(...dailyOccupancy.values(), 0);

	return {
		totalEmployees: totalCount,
		activeEmployees,
		totalHoursWorked,
		averageHoursPerEmployee: activeEmployees > 0 ? totalHoursWorked / activeEmployees : 0,
		totalOvertimeHours,
		peakDayOccupancy,
	};
}

export async function exportToCSV(
	data: any[],
	_filename: string,
	headers: { key: string; label: string }[]
): Promise<string> {
	// Create CSV header row
	const headerRow = headers.map((h) => h.label).join(",");

	// Create data rows
	const dataRows = data.map((row) =>
		headers
			.map((h) => {
				const value = h.key.split(".").reduce((obj, k) => obj?.[k], row);
				return typeof value === "string" ? `"${value.replace(/"/g, '""')}"` : value || "";
			})
			.join(",")
	);

	return [headerRow, ...dataRows].join("\n");
}

export async function generateExcelDownload(data: any[], filename: string): Promise<Response> {
	// In a real implementation, you'd use a library like xlsx or exceljs
	// For now, we'll return CSV as a fallback
	const csv = convertToCSV(data);

	return new Response(csv, {
		headers: {
			"Content-Type": "text/csv",
			"Content-Disposition": `attachment; filename="${filename}.csv"`,
		},
	});
}

function convertToCSV(data: any[]): string {
	if (!data.length) return "";

	const headers = Object.keys(data[0]);
	const csvHeaders = headers.join(",");
	const csvData = data.map((row) =>
		headers
			.map((header) => {
				const value = row[header];
				return typeof value === "string" ? `"${value.replace(/"/g, '""')}"` : value || "";
			})
			.join(",")
	);

	return [csvHeaders, ...csvData].join("\n");
}
