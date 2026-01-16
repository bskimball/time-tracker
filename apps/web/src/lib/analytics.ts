import { addDays, startOfDay, endOfDay } from "date-fns";
import { db } from "./db";

export interface PerformanceKPIs {
	totalActiveEmployees: number;
	productivityRate: number; // units per hour average
	overtimePercentage: number;
	laborCostPerUnit: number;
	occupancyLevel: number; // percentage of stations occupied
	efficiencyRatio: number; // actual vs expected productivity
}

export interface LaborCostAnalysis {
	actualCost: number;
	budgetedCost: number;
	variance: number;
	variancePercentage: number;
	hourlyCost: number;
	overtimeCost: number;
	regularCost: number;
}

export interface ProductivityAnalytics {
	unitsPerHour: number;
	employeeId?: string;
	stationId?: string;
	shift?: string;
	taskType?: string;
	date: Date;
}

export interface StationPerformance {
	stationId: string;
	stationName: string;
	totalEmployees: number;
	unitsProcessed: number;
	avgUnitsPerHour: number;
	occupancyRate: number;
	efficiencyScore: number;
}

/**
 * Calculate daily performance metrics for all employees
 */
export async function calculateDailyperformanceMetrics(date: Date = new Date()) {
	const dayStart = startOfDay(date);
	const dayEnd = endOfDay(date);

	try {
		// Get all active employees
		const employees = await db.employee.findMany({
			where: { status: "ACTIVE" },
			include: {
				TimeLog: {
					where: {
						startTime: {
							gte: dayStart,
							lte: dayEnd,
						},
						endTime: { not: null },
					},
					include: {
						Task: {
							include: {
								TaskType: true,
							},
						},
					},
				},
			},
		});

		for (const employee of employees) {
			await calculateEmployeeperformanceMetrics(employee, date);
		}

		console.log(
			`Calculated performance metrics for ${employees.length} employees on ${date.toISOString().split("T")[0]}`
		);
	} catch (error) {
		console.error("Error calculating daily performance metrics:", error);
		throw error;
	}
}

/**
 * Calculate performance metrics for a specific employee on a given date
 */
type EmployeeWithTimeLogs = {
	id: string;
	TimeLog: Array<{
		type: string;
		startTime: Date | string;
		endTime: Date | string | null;
		stationId: string | null;
		Task?: { unitsCompleted?: number | null } | null;
	}>;
};

async function calculateEmployeeperformanceMetrics(employee: EmployeeWithTimeLogs, date: Date) {
	const workLogs = employee.TimeLog.filter((log) => log.type === "WORK");

	if (workLogs.length === 0) return;

	// Calculate total hours worked
	let totalHours = 0;
	let overtimeHours = 0;
	const stationMetrics = new Map<string, { hours: number; units: number }>();

	for (const log of workLogs) {
		const startTime = new Date(log.startTime);
		const endTime = new Date(log.endTime!);
		const hours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);

		totalHours += hours;

		// Calculate overtime (over 8 hours daily)
		const dailyOvertime = Math.max(0, totalHours - 8);
		overtimeHours = dailyOvertime;

		// Track by station
		const stationId = log.stationId || "unassigned";
		if (!stationMetrics.has(stationId)) {
			stationMetrics.set(stationId, { hours: 0, units: 0 });
		}
		const station = stationMetrics.get(stationId)!;
		station.hours += hours;

		// Count units from tasks
		if (log.Task?.unitsCompleted) {
			station.units += log.Task.unitsCompleted;
		}
	}

	// Store metrics for each station
	for (const [stationId, metrics] of stationMetrics) {
		const efficiency = metrics.hours > 0 ? metrics.units / metrics.hours : 0;

		await db.performanceMetric.upsert({
			where: {
				employeeId_date_stationId: {
					employeeId: employee.id,
					date: date,
					stationId,
				},
			},
			update: {
				hoursWorked: metrics.hours,
				unitsProcessed: metrics.units,
				efficiency,
				overtimeHours: stationId === stationMetrics.keys().next().value ? overtimeHours : 0,
			},
			create: {
				id: `perf_${employee.id}_${date.toISOString().split("T")[0]}_${stationId}`,
				employeeId: employee.id,
				date,
				stationId,
				hoursWorked: metrics.hours,
				unitsProcessed: metrics.units,
				efficiency,
				overtimeHours: stationId === stationMetrics.keys().next().value ? overtimeHours : 0,
			},
		});
	}
}

/**
 * Get executive KPIs for a given date range
 */
export async function getExecutiveKPIs(startDate: Date, endDate: Date): Promise<PerformanceKPIs> {
	const activeEmployees = await db.employee.count({
		where: { status: "ACTIVE" },
	});

	const performanceData = await db.performanceMetric.aggregate({
		where: {
			date: {
				gte: startOfDay(startDate),
				lte: endOfDay(endDate),
			},
		},
		_sum: {
			hoursWorked: true,
			unitsProcessed: true,
			overtimeHours: true,
		},
		_avg: {
			efficiency: true,
		},
	});

	const totalHours = performanceData._sum.hoursWorked || 0;
	const totalUnits = performanceData._sum.unitsProcessed || 0;
	const totalOvertime = performanceData._sum.overtimeHours || 0;
	const avgEfficiency = performanceData._avg.efficiency || 0;

	const productivityRate = totalHours > 0 ? totalUnits / totalHours : 0;
	const overtimePercentage = totalHours > 0 ? (totalOvertime / totalHours) * 100 : 0;
	const laborCostPerUnit = await calculateLaborCostPerUnit(startDate, endDate);

	// Current occupancy (from today's active sessions)
	const currentOccupancy = await getCurrentOccupancy();

	return {
		totalActiveEmployees: activeEmployees,
		productivityRate: Math.round(productivityRate * 100) / 100,
		overtimePercentage: Math.round(overtimePercentage * 10) / 10,
		laborCostPerUnit: Math.round(laborCostPerUnit * 100) / 100,
		occupancyLevel: currentOccupancy,
		efficiencyRatio: Math.round(avgEfficiency * 100) / 100,
	};
}

/**
 * Get labor cost analysis for executive reporting
 */
export async function getLaborCostAnalysis(
	startDate: Date,
	endDate: Date
): Promise<LaborCostAnalysis> {
	const performanceData = await db.performanceMetric.aggregate({
		where: {
			date: {
				gte: startOfDay(startDate),
				lte: endOfDay(endDate),
			},
		},
		_sum: {
			hoursWorked: true,
			overtimeHours: true,
		},
	});

	const totalHours = performanceData._sum.hoursWorked || 0;
	const overtimeHours = performanceData._sum.overtimeHours || 0;
	const regularHours = totalHours - overtimeHours;

	// Average hourly rate (could be enhanced with actual employee rates)
	const hourlyRate = 18.5; // This should come from employee data
	const overtimeRate = hourlyRate * 1.5;

	const regularCost = regularHours * hourlyRate;
	const overtimeCost = overtimeHours * overtimeRate;
	const actualCost = regularCost + overtimeCost;

	// Budget calculation (could be enhanced with actual budget data)
	const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
	const budgetedHours = 100 * days; // Assume 100 employees * 8 hours
	const budgetedCost = budgetedHours * hourlyRate;

	const variance = actualCost - budgetedCost;
	const variancePercentage = budgetedCost > 0 ? (variance / budgetedCost) * 100 : 0;

	return {
		actualCost,
		budgetedCost,
		variance,
		variancePercentage: Math.round(variancePercentage * 10) / 10,
		hourlyCost: hourlyRate,
		overtimeCost,
		regularCost,
	};
}

/**
 * Get productivity analytics filtered by various dimensions
 */
export async function getProductivityAnalytics(
	startDate: Date,
	endDate: Date,
	filters: {
		employeeId?: string;
		stationId?: string;
		taskType?: string;
	} = {}
): Promise<ProductivityAnalytics[]> {
	const whereClause: {
		date: { gte: Date; lte: Date };
		employeeId?: string;
		stationId?: string;
		taskType?: string;
	} = {
		date: {
			gte: startOfDay(startDate),
			lte: endOfDay(endDate),
		},
		...filters,
	};

	const metrics = await db.performanceMetric.findMany({
		where: whereClause,
		orderBy: { date: "asc" },
	});

	return metrics.map((metric) => ({
		unitsPerHour: metric.efficiency || 0,
		employeeId: metric.employeeId,
		stationId: metric.stationId || undefined,
		date: metric.date,
	}));
}

/**
 * Get station performance metrics
 */
export async function getStationPerformance(
	startDate: Date,
	endDate: Date
): Promise<StationPerformance[]> {
	const stationPerformance = await db.performanceMetric.groupBy({
		by: ["stationId"],
		where: {
			date: {
				gte: startOfDay(startDate),
				lte: endOfDay(endDate),
			},
			stationId: { not: null },
		},
		_count: {
			employeeId: true,
		},
		_sum: {
			hoursWorked: true,
			unitsProcessed: true,
		},
		_avg: {
			efficiency: true,
		},
	});

	const stations = await db.station.findMany({
		where: { isActive: true },
	});

	return stationPerformance.map((perf) => {
		const station = stations.find((s) => s.id === perf.stationId);
		return {
			stationId: perf.stationId!,
			stationName: station?.name || "Unknown",
			totalEmployees: perf._count.employeeId,
			unitsProcessed: perf._sum.unitsProcessed || 0,
			avgUnitsPerHour: perf._avg.efficiency || 0,
			occupancyRate: station?.capacity ? (perf._count.employeeId / station.capacity) * 100 : 0,
			efficiencyScore: Math.round((perf._avg.efficiency || 0) * 100) / 100,
		};
	});
}

/**
 * Get current occupancy level
 */
async function getCurrentOccupancy(): Promise<number> {
	const activeSessions = await db.timeLog.count({
		where: {
			endTime: null,
			type: "WORK",
		},
	});

	const totalStations = await db.station.count({
		where: { isActive: true },
	});

	const totalCapacity = await db.station.aggregate({
		where: { isActive: true },
		_sum: { capacity: true },
	});

	const capacity = totalCapacity._sum.capacity || totalStations * 2; // Default to 2 per station
	return capacity > 0 ? (activeSessions / capacity) * 100 : 0;
}

/**
 * Calculate labor cost per unit
 */
async function calculateLaborCostPerUnit(startDate: Date, endDate: Date): Promise<number> {
	const performanceData = await db.performanceMetric.aggregate({
		where: {
			date: {
				gte: startOfDay(startDate),
				lte: endOfDay(endDate),
			},
		},
		_sum: {
			hoursWorked: true,
			unitsProcessed: true,
		},
	});

	const totalHours = performanceData._sum.hoursWorked || 0;
	const totalUnits = performanceData._sum.unitsProcessed || 0;

	if (totalUnits === 0) return 0;

	const hourlyRate = 18.5; // Average hourly rate
	const totalLaborCost = totalHours * hourlyRate;

	return totalLaborCost / totalUnits;
}

/**
 * Get trend data for executive dashboard
 */
export async function getPerformanceTrends(
	startDate: Date,
	endDate: Date,
	metric: "productivity" | "cost" | "occupancy" = "productivity"
) {
	const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
	const trends = [];

	for (let i = 0; i < days; i++) {
		const date = addDays(startDate, i);
		const dayEnd = endOfDay(date);

		const dayMetrics = await db.performanceMetric.aggregate({
			where: {
				date: {
					gte: startOfDay(date),
					lte: dayEnd,
				},
			},
			_sum: {
				hoursWorked: true,
				unitsProcessed: true,
				overtimeHours: true,
			},
			_avg: {
				efficiency: true,
			},
		});

		let value = 0;
		switch (metric) {
			case "productivity":
				value = dayMetrics._avg.efficiency || 0;
				break;
			case "cost": {
				const hours = dayMetrics._sum.hoursWorked || 0;
				const units = dayMetrics._sum.unitsProcessed || 0;
				value = units > 0 ? (hours * 18.5) / units : 0;
				break;
			}
			case "occupancy":
				value = await getCurrentOccupancy();
				break;
		}

		trends.push({
			date: date,
			value: Math.round(value * 100) / 100,
		});
	}

	return trends;
}
