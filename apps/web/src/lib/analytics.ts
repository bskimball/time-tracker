import { addDays, startOfDay, endOfDay, differenceInCalendarDays } from "date-fns";
import { db } from "./db";
import { getOperationalNumber } from "~/lib/operational-config";

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
	const hourlyRate = await getOperationalNumber("LABOR_HOURLY_RATE", 18.5);
	const overtimeMultiplier = await getOperationalNumber("OVERTIME_MULTIPLIER", 1.5);
	const overtimeRate = hourlyRate * overtimeMultiplier;

	const regularCost = regularHours * hourlyRate;
	const overtimeCost = overtimeHours * overtimeRate;
	const actualCost = regularCost + overtimeCost;

	// Budget calculation (could be enhanced with actual budget data)
	const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
	const budgetedHoursPerDay = await getOperationalNumber("BUDGETED_HOURS_PER_DAY", 100);
	const budgetedHours = budgetedHoursPerDay * days;
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
	const activeWorkLogs = await db.timeLog.findMany({
		where: {
			endTime: null,
			type: "WORK",
			deletedAt: null,
		},
		select: { employeeId: true },
	});

	const activeAssignments = await db.taskAssignment.findMany({
		where: { endTime: null },
		select: { employeeId: true },
	});

	const totalStations = await db.station.count({
		where: { isActive: true },
	});

	const totalCapacity = await db.station.aggregate({
		where: { isActive: true },
		_sum: { capacity: true },
	});

	const activeEmployeeIds = new Set<string>();
	for (const log of activeWorkLogs) {
		activeEmployeeIds.add(log.employeeId);
	}
	for (const assignment of activeAssignments) {
		activeEmployeeIds.add(assignment.employeeId);
	}

	const capacityFallback = await getOperationalNumber("DEFAULT_STATION_CAPACITY_FALLBACK", 2);
	const capacity = totalCapacity._sum.capacity || totalStations * capacityFallback;
	return capacity > 0 ? (activeEmployeeIds.size / capacity) * 100 : 0;
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

	const hourlyRate = await getOperationalNumber("LABOR_HOURLY_RATE", 18.5);
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
	const days = Math.max(1, differenceInCalendarDays(endDate, startDate) + 1);
	const trends = [];
	const hourlyRateForCost =
		metric === "cost" ? await getOperationalNumber("LABOR_HOURLY_RATE", 18.5) : 0;

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
				value = units > 0 ? (hours * hourlyRateForCost) / units : 0;
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
