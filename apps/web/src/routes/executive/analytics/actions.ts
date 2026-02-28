"use server";

import {
	format,
	startOfMonth,
	endOfMonth,
	subDays,
	subMonths,
	subYears,
	differenceInCalendarDays,
	addDays,
	isAfter,
} from "date-fns";
import { getPerformanceTrends, getStationPerformance, getLaborCostAnalysis } from "~/lib/analytics";
import { db } from "~/lib/db";
import { ensureOperationalDataSeeded } from "~/lib/ensure-operational-data";
import { getOperationalNumber } from "~/lib/operational-config";
import {
	performanceCache,
	getPerformanceTrendsCacheKey,
	getStationPerformanceCacheKey,
	getLaborCostAnalysisCacheKey,
} from "~/lib/performance-cache";
import type { AnalyticsDashboardData, LiveFloorData } from "./types";

type AnalyticsTimeRange = "today" | "week" | "month" | "quarter";
export type ComparisonBasis = "previous-period" | "last-year" | "rolling-30d";

function getDateRange(timeRange: AnalyticsTimeRange) {
	const now = new Date();
	let startDate: Date;
	let endDate: Date;

	switch (timeRange) {
		case "week":
			startDate = subDays(now, 6);
			endDate = now;
			break;
		case "month":
			startDate = startOfMonth(now);
			endDate = now;
			break;
		case "quarter":
			startDate = startOfMonth(new Date(now.getFullYear(), now.getMonth() - 2, 1));
			endDate = now;
			break;
		case "today":
		default:
			startDate = new Date(now);
			startDate.setHours(0, 0, 0, 0);
			endDate = new Date(now);
			endDate.setHours(23, 59, 59, 999);
			break;
	}

	return { startDate, endDate };
}

function getComparisonDateRange(
	timeRange: AnalyticsTimeRange,
	basis: ComparisonBasis
): {
	currentStart: Date;
	currentEnd: Date;
	comparisonStart: Date;
	comparisonEnd: Date;
} {
	const { startDate: currentStart, endDate: currentEnd } = getDateRange(timeRange);

	if (basis === "rolling-30d") {
		const rollingEnd = new Date();
		const rollingStart = subDays(rollingEnd, 30);
		return {
			currentStart: rollingStart,
			currentEnd: rollingEnd,
			comparisonStart: subDays(rollingStart, 30),
			comparisonEnd: rollingStart,
		};
	}

	if (basis === "last-year") {
		return {
			currentStart,
			currentEnd,
			comparisonStart: subYears(currentStart, 1),
			comparisonEnd: subYears(currentEnd, 1),
		};
	}

	if (timeRange === "month") {
		const lastMonthStart = startOfMonth(subMonths(currentStart, 1));
		const lastMonthEnd = endOfMonth(lastMonthStart);
		const elapsedDays = Math.max(0, differenceInCalendarDays(currentEnd, currentStart));
		const sameDayLastMonth = addDays(lastMonthStart, elapsedDays);
		return {
			currentStart,
			currentEnd,
			comparisonStart: lastMonthStart,
			comparisonEnd: isAfter(sameDayLastMonth, lastMonthEnd) ? lastMonthEnd : sameDayLastMonth,
		};
	}

	const periodLength = Math.max(1, differenceInCalendarDays(currentEnd, currentStart) + 1);
	const comparisonEnd = subDays(currentStart, 1);
	const comparisonStart = subDays(comparisonEnd, periodLength - 1);

	return {
		currentStart,
		currentEnd,
		comparisonStart,
		comparisonEnd,
	};
}

function average(values: number[]) {
	if (values.length === 0) return 0;
	return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function changePercent(current: number, previous: number) {
	if (previous === 0) return current === 0 ? 0 : 100;
	return ((current - previous) / previous) * 100;
}

function toShiftBucket(date: Date) {
	const hour = date.getHours();
	if (hour >= 6 && hour < 14) return "Morning";
	if (hour >= 14 && hour < 22) return "Afternoon";
	return "Night";
}

function formatStationLabel(value: string) {
	const normalized = value.toLowerCase();
	return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

async function ensureAnalyticsDataReady() {
	const metricCount = await db.performanceMetric.count();
	if (metricCount === 0) {
		await ensureOperationalDataSeeded();
	}
}

/**
 * Period-over-period comparison data used by the executive analytics overview.
 */
export async function getComparativeAnalyticsData(
	timeRange: AnalyticsTimeRange = "month",
	basis: ComparisonBasis = "previous-period"
) {
	await ensureAnalyticsDataReady();
	const { currentStart, currentEnd, comparisonStart, comparisonEnd } = getComparisonDateRange(
		timeRange,
		basis
	);

	const [currentProductivity, comparisonProductivity, currentCost, comparisonCost] =
		await Promise.all([
			getPerformanceTrends(currentStart, currentEnd, "productivity"),
			getPerformanceTrends(comparisonStart, comparisonEnd, "productivity"),
			getPerformanceTrends(currentStart, currentEnd, "cost"),
			getPerformanceTrends(comparisonStart, comparisonEnd, "cost"),
		]);

	const currentProductivityValues = currentProductivity.map((point) => point.value);
	const comparisonProductivityValues = comparisonProductivity.map((point) => point.value);
	const currentCostValues = currentCost.map((point) => point.value);
	const comparisonCostValues = comparisonCost.map((point) => point.value);

	const currentProductivityAvg = average(currentProductivityValues);
	const comparisonProductivityAvg = average(comparisonProductivityValues);
	const currentCostAvg = average(currentCostValues);
	const comparisonCostAvg = average(comparisonCostValues);

	const currentDays = Math.max(currentProductivity.length, currentCost.length, 1);
	const comparisonDays = Math.max(comparisonProductivity.length, comparisonCost.length, 1);

	const labels = currentProductivity.map((point) => format(new Date(point.date), "MMM d"));
	const alignedComparisonProductivity = labels.map(
		(_, index) => comparisonProductivityValues[index] ?? 0
	);
	const alignedComparisonCost = labels.map((_, index) => comparisonCostValues[index] ?? 0);

	return {
		currentWindow: {
			start: currentStart.toISOString(),
			end: currentEnd.toISOString(),
		},
		comparisonWindow: {
			start: comparisonStart.toISOString(),
			end: comparisonEnd.toISOString(),
		},
		summary: {
			productivity: {
				current: Number(currentProductivityAvg.toFixed(2)),
				comparison: Number(comparisonProductivityAvg.toFixed(2)),
				changePercent: Number(
					changePercent(currentProductivityAvg, comparisonProductivityAvg).toFixed(1)
				),
			},
			costPerUnit: {
				current: Number(currentCostAvg.toFixed(2)),
				comparison: Number(comparisonCostAvg.toFixed(2)),
				changePercent: Number(changePercent(currentCostAvg, comparisonCostAvg).toFixed(1)),
			},
			throughput: {
				current: Number((currentProductivityAvg * currentDays).toFixed(1)),
				comparison: Number((comparisonProductivityAvg * comparisonDays).toFixed(1)),
				changePercent: Number(
					changePercent(
						currentProductivityAvg * currentDays,
						comparisonProductivityAvg * comparisonDays
					).toFixed(1)
				),
			},
		},
		charts: {
			productivityComparison: {
				labels,
				datasets: [
					{
						label: "Current",
						data: currentProductivityValues,
						color: "#e07426",
					},
					{
						label: "Comparison",
						data: alignedComparisonProductivity,
						color: "#64748b",
					},
				],
			},
			costComparison: {
				labels,
				datasets: [
					{
						label: "Current",
						data: currentCostValues,
						color: "#ef4444",
					},
					{
						label: "Comparison",
						data: alignedComparisonCost,
						color: "#64748b",
					},
				],
			},
		},
	};
}

/**
 * Get productivity trend data for charts
 */
export async function getProductivityTrendData(timeRange: AnalyticsTimeRange = "week") {
	await ensureAnalyticsDataReady();
	const { startDate, endDate } = getDateRange(timeRange);

	const cacheKey = getPerformanceTrendsCacheKey(startDate, endDate, "productivity");
	const trends = await performanceCache.get(
		cacheKey,
		() => getPerformanceTrends(startDate, endDate, "productivity"),
		15 * 60 * 1000
	);

	return {
		labels: trends.map((t) => format(new Date(t.date), "EEE")),
		datasets: [
			{
				label: "Units per Hour",
				data: trends.map((t) => t.value),
				color: "#3b82f6",
			},
		],
	};
}

/**
 * Get labor cost trend data for charts
 */
export async function getLaborCostTrendData(timeRange: AnalyticsTimeRange = "week") {
	await ensureAnalyticsDataReady();
	const { startDate, endDate } = getDateRange(timeRange);

	const cacheKey = getPerformanceTrendsCacheKey(startDate, endDate, "cost");
	const trends = await performanceCache.get(
		cacheKey,
		() => getPerformanceTrends(startDate, endDate, "cost"),
		15 * 60 * 1000
	);

	return {
		labels: trends.map((t) => format(new Date(t.date), "EEE")),
		datasets: [
			{
				label: "Cost per Unit",
				data: trends.map((t) => t.value),
				color: "#ef4444",
			},
		],
	};
}

/**
 * Get station efficiency comparison data for charts
 */
export async function getStationEfficiencyData(timeRange: AnalyticsTimeRange = "week") {
	await ensureAnalyticsDataReady();
	const { startDate, endDate } = getDateRange(timeRange);

	const cacheKey = getStationPerformanceCacheKey(startDate, endDate);
	const stationData = await performanceCache.get(
		cacheKey,
		() => getStationPerformance(startDate, endDate),
		10 * 60 * 1000
	);

	return {
		labels: stationData.map((s) => s.stationName),
		datasets: [
			{
				label: "Average Units per Hour",
				data: stationData.map((s) => s.avgUnitsPerHour),
				color: "#10b981",
			},
		],
	};
}

/**
 * Get employee productivity ranking data
 */
export async function getEmployeeProductivityRanking(timeRange: AnalyticsTimeRange = "week") {
	await ensureAnalyticsDataReady();
	const { startDate, endDate } = getDateRange(timeRange);

	const grouped = await db.performanceMetric.groupBy({
		by: ["employeeId"],
		where: {
			date: {
				gte: startDate,
				lte: endDate,
			},
		},
		_avg: {
			efficiency: true,
		},
		orderBy: {
			_avg: {
				efficiency: "desc",
			},
		},
		take: 10,
	});

	const employeeIds = grouped.map((item) => item.employeeId);
	const employees = await db.employee.findMany({
		where: { id: { in: employeeIds } },
		include: {
			defaultStation: true,
		},
	});
	const employeesById = new Map(employees.map((employee) => [employee.id, employee]));

	return grouped.map((item) => {
		const employee = employeesById.get(item.employeeId);
		return {
			employee: employee?.name ?? "Unknown",
			value: Number((item._avg.efficiency ?? 0).toFixed(1)),
			station: employee?.defaultStation?.name ?? "UNASSIGNED",
		};
	});
}

/**
 * Get cost breakdown data for pie chart
 */
export async function getCostBreakdownData(timeRange: AnalyticsTimeRange = "week") {
	await ensureAnalyticsDataReady();
	const { startDate, endDate } = getDateRange(timeRange);

	const cacheKey = getLaborCostAnalysisCacheKey(startDate, endDate);
	const costData = await performanceCache.get(
		cacheKey,
		() => getLaborCostAnalysis(startDate, endDate),
		10 * 60 * 1000
	);

	return [
		{
			name: "Regular Hours",
			value: costData.regularCost,
			color: "#3b82f6",
		},
		{
			name: "Overtime",
			value: costData.overtimeCost,
			color: "#f59e0b",
		},
	];
}

/**
 * Get station occupancy data
 */
export async function getStationOccupancyData() {
	await ensureAnalyticsDataReady();
	const stations = await db.station.findMany({
		where: { isActive: true },
		orderBy: { name: "asc" },
	});
	const [activeWorkLogs, activeAssignments] = await Promise.all([
		db.timeLog.findMany({
			where: { type: "WORK", endTime: null, deletedAt: null },
			select: { stationId: true, employeeId: true },
		}),
		db.taskAssignment.findMany({
			where: { endTime: null },
			include: { TaskType: { select: { stationId: true } } },
		}),
	]);

	const occupancyByStation = new Map<string, Set<string>>();
	for (const station of stations) {
		occupancyByStation.set(station.id, new Set());
	}

	for (const log of activeWorkLogs) {
		if (!log.stationId) continue;
		occupancyByStation.get(log.stationId)?.add(log.employeeId);
	}
	for (const assignment of activeAssignments) {
		occupancyByStation.get(assignment.TaskType.stationId)?.add(assignment.employeeId);
	}

	return stations.map((station) => {
		const current = occupancyByStation.get(station.id)?.size ?? 0;
		const capacity = station.capacity ?? Math.max(current, 1);
		const value = Math.min(100, Number(((current / Math.max(capacity, 1)) * 100).toFixed(0)));
		return {
			name: station.name,
			value,
			color:
				station.name === "PICKING"
					? "#3b82f6"
					: station.name === "PACKING"
						? "#10b981"
						: station.name === "FILLING"
							? "#ef4444"
							: station.name === "RECEIVING"
								? "#f59e0b"
								: "#8b5cf6",
		};
	});
}

/**
 * Get shift productivity comparison
 */
export async function getShiftProductivityData(timeRange: AnalyticsTimeRange = "week") {
	await ensureAnalyticsDataReady();
	const { startDate, endDate } = getDateRange(timeRange);
	const assignments = await db.taskAssignment.findMany({
		where: {
			startTime: { gte: startDate, lte: endDate },
			endTime: { not: null },
			unitsCompleted: { not: null },
		},
		select: {
			startTime: true,
			endTime: true,
			unitsCompleted: true,
		},
	});

	const buckets = new Map<string, { units: number; hours: number }>([
		["Morning", { units: 0, hours: 0 }],
		["Afternoon", { units: 0, hours: 0 }],
		["Night", { units: 0, hours: 0 }],
	]);

	for (const assignment of assignments) {
		if (!assignment.endTime || assignment.unitsCompleted === null) continue;
		const bucket = buckets.get(toShiftBucket(new Date(assignment.startTime)));
		if (!bucket) continue;
		const hours =
			(new Date(assignment.endTime).getTime() - new Date(assignment.startTime).getTime()) /
			(1000 * 60 * 60);
		if (hours <= 0) continue;
		bucket.units += assignment.unitsCompleted;
		bucket.hours += hours;
	}

	const labels = ["Morning", "Afternoon", "Night"];
	const data = labels.map((label) => {
		const bucket = buckets.get(label);
		if (!bucket || bucket.hours === 0) return 0;
		return Number((bucket.units / bucket.hours).toFixed(1));
	});

	return {
		labels,
		datasets: [
			{
				label: "Units per Hour",
				data,
				color: "#3b82f6",
			},
		],
	};
}

/**
 * Get task type efficiency data
 */
export async function getTaskTypeEfficiencyData(timeRange: AnalyticsTimeRange = "week") {
	await ensureAnalyticsDataReady();
	const { startDate, endDate } = getDateRange(timeRange);
	const assignments = await db.taskAssignment.findMany({
		where: {
			startTime: { gte: startDate, lte: endDate },
			endTime: { not: null },
			unitsCompleted: { not: null },
		},
		include: {
			TaskType: true,
		},
	});

	const totals = new Map<string, { name: string; units: number; hours: number }>();
	for (const assignment of assignments) {
		if (!assignment.endTime || assignment.unitsCompleted === null) continue;
		const hours =
			(new Date(assignment.endTime).getTime() - new Date(assignment.startTime).getTime()) /
			(1000 * 60 * 60);
		if (hours <= 0) continue;
		const current = totals.get(assignment.taskTypeId) ?? {
			name: assignment.TaskType.name,
			units: 0,
			hours: 0,
		};
		current.units += assignment.unitsCompleted;
		current.hours += hours;
		totals.set(assignment.taskTypeId, current);
	}

	const rows = Array.from(totals.values())
		.map((row) => ({
			name: row.name,
			value: row.hours > 0 ? Number((row.units / row.hours).toFixed(1)) : 0,
		}))
		.sort((a, b) => b.value - a.value)
		.slice(0, 8);

	return {
		labels: rows.map((row) => row.name),
		datasets: [
			{
				label: "Average Units per Hour",
				data: rows.map((row) => row.value),
				color: "#10b981",
			},
		],
	};
}

/**
 * Get benchmark data for performance comparisons
 */
export async function getBenchmarkData(timeRange: AnalyticsTimeRange = "week") {
	await ensureAnalyticsDataReady();
	const { startDate, endDate } = getDateRange(timeRange);
	const [metricsInWindow, productivityTrend, costTrend] = await Promise.all([
		db.performanceMetric.findMany({
			where: { date: { gte: startDate, lte: endDate } },
			select: { efficiency: true, qualityScore: true },
		}),
		getPerformanceTrends(startDate, endDate, "productivity"),
		getPerformanceTrends(startDate, endDate, "cost"),
	]);

	const efficiencies = metricsInWindow
		.map((metric) => metric.efficiency ?? 0)
		.filter((value) => value > 0)
		.sort((a, b) => a - b);
	const qualityScores = metricsInWindow
		.map((metric) => metric.qualityScore ?? 0)
		.filter((value) => value > 0)
		.sort((a, b) => a - b);

	const percentile = (values: number[], p: number) => {
		if (values.length === 0) return 0;
		const index = Math.min(values.length - 1, Math.max(0, Math.floor(values.length * p)));
		return values[index];
	};

	const avgProductivity = average(productivityTrend.map((trend) => trend.value));
	const avgCost = average(costTrend.map((trend) => trend.value));
	const avgQuality = average(qualityScores);

	return {
		productivity: {
			current: Number(avgProductivity.toFixed(1)),
			target: Number((percentile(efficiencies, 0.75) || avgProductivity).toFixed(1)),
			industryAvg: Number((percentile(efficiencies, 0.5) || avgProductivity).toFixed(1)),
			top10Percent: Number((percentile(efficiencies, 0.9) || avgProductivity).toFixed(1)),
		},
		costPerUnit: {
			current: Number(avgCost.toFixed(2)),
			target: Number((avgCost * 0.95).toFixed(2)),
			industryAvg: Number((avgCost * 1.08).toFixed(2)),
			bottom10Percent: Number((avgCost * 0.88).toFixed(2)),
		},
		quality: {
			current: Number(avgQuality.toFixed(1)),
			target: Number((percentile(qualityScores, 0.75) || avgQuality).toFixed(1)),
			industryAvg: Number((percentile(qualityScores, 0.5) || avgQuality).toFixed(1)),
			top10Percent: Number((percentile(qualityScores, 0.9) || avgQuality).toFixed(1)),
		},
	};
}

/**
 * Get anomaly detection data
 */
export interface Anomaly {
	type: string;
	station: string;
	date: string;
	severity: "high" | "medium" | "low";
	description: string;
	impact: number;
	status: string;
}

/**
 * Get anomaly detection data
 */
export async function getAnomalyData(timeRange: AnalyticsTimeRange = "week"): Promise<Anomaly[]> {
	await ensureAnalyticsDataReady();
	const { startDate, endDate } = getDateRange(timeRange);
	const [stationWindow, stationBaseline] = await Promise.all([
		getStationPerformance(startDate, endDate),
		getStationPerformance(subDays(startDate, 30), subDays(startDate, 1)),
	]);

	const baselineByStation = new Map(stationBaseline.map((station) => [station.stationId, station]));
	const anomalies: Anomaly[] = [];

	for (const station of stationWindow) {
		const baseline = baselineByStation.get(station.stationId);
		if (!baseline) continue;

		const productivityDrop = changePercent(station.avgUnitsPerHour, baseline.avgUnitsPerHour);
		if (productivityDrop <= -20) {
			anomalies.push({
				type: "productivity_drop",
				station: station.stationName,
				date: new Date().toISOString().split("T")[0],
				severity: productivityDrop <= -30 ? "high" : "medium",
				description: `${station.stationName} productivity is ${Math.abs(productivityDrop).toFixed(1)}% below recent baseline`,
				impact: Number(productivityDrop.toFixed(1)),
				status: "Open",
			});
		}

		const occupancySpike = station.occupancyRate - baseline.occupancyRate;
		if (occupancySpike >= 20) {
			anomalies.push({
				type: "capacity_spike",
				station: station.stationName,
				date: new Date().toISOString().split("T")[0],
				severity: occupancySpike >= 35 ? "high" : "medium",
				description: `${station.stationName} occupancy is ${occupancySpike.toFixed(1)} points above baseline`,
				impact: Number(occupancySpike.toFixed(1)),
				status: "Investigating",
			});
		}
	}

	return anomalies.slice(0, 10);
}

/**
 * Get capacity utilization data
 */
export async function getCapacityUtilizationData(_timeRange: AnalyticsTimeRange = "week") {
	await ensureAnalyticsDataReady();
	const [optimalUtilization, hourlyRate] = await Promise.all([
		getOperationalNumber("OPTIMAL_UTILIZATION_PERCENT", 80),
		getOperationalNumber("LABOR_HOURLY_RATE", 18.5),
	]);
	const stations = await db.station.findMany({
		where: { isActive: true },
		orderBy: { name: "asc" },
	});
	const [activeWorkLogs, activeAssignments, todayShifts] = await Promise.all([
		db.timeLog.findMany({
			where: { type: "WORK", endTime: null, deletedAt: null },
			select: { stationId: true, employeeId: true },
		}),
		db.taskAssignment.findMany({
			where: { endTime: null },
			include: { TaskType: { select: { stationId: true } } },
		}),
		db.shift.findMany({
			where: {
				startTime: { lte: new Date() },
				endTime: { gte: new Date() },
			},
			select: { stationId: true, requiredHeadcount: true },
		}),
	]);

	const currentByStation = new Map<string, Set<string>>();
	const requiredByStation = new Map<string, number>();
	for (const station of stations) {
		currentByStation.set(station.id, new Set());
		requiredByStation.set(station.id, 0);
	}

	for (const log of activeWorkLogs) {
		if (!log.stationId) continue;
		currentByStation.get(log.stationId)?.add(log.employeeId);
	}
	for (const assignment of activeAssignments) {
		currentByStation.get(assignment.TaskType.stationId)?.add(assignment.employeeId);
	}
	for (const shift of todayShifts) {
		requiredByStation.set(
			shift.stationId,
			(requiredByStation.get(shift.stationId) ?? 0) + shift.requiredHeadcount
		);
	}

	const stationRows = stations.map((station) => {
		const currentStaff = currentByStation.get(station.id)?.size ?? 0;
		const maxCapacity = station.capacity ?? Math.max(currentStaff, 1);
		const requiredStaff =
			requiredByStation.get(station.id) ?? Math.max(1, Math.ceil(maxCapacity * 0.7));
		const utilization = Number(((currentStaff / Math.max(maxCapacity, 1)) * 100).toFixed(0));
		const recommendedStaff = Math.min(
			maxCapacity,
			Math.max(requiredStaff, Math.ceil(maxCapacity * 0.8))
		);

		return {
			name: station.name,
			currentStaff,
			requiredStaff,
			utilization,
			maxCapacity,
			recommendedStaff,
		};
	});

	const totalCurrent = stationRows.reduce((sum, row) => sum + row.currentStaff, 0);
	const totalCapacity = stationRows.reduce((sum, row) => sum + row.maxCapacity, 0);
	const staffShortage = stationRows.reduce(
		(sum, row) => sum + Math.max(0, row.requiredStaff - row.currentStaff),
		0
	);

	return {
		stations: stationRows,
		overall: {
			currentUtilization: Number(((totalCurrent / Math.max(totalCapacity, 1)) * 100).toFixed(1)),
			optimalUtilization,
			staffShortage,
			costImpact: Number((staffShortage * hourlyRate * 8 * 5).toFixed(2)),
		},
	};
}

/**
 * Get trend analysis data
 */
export async function getTrendAnalysisData(timeRange: AnalyticsTimeRange = "week") {
	await ensureAnalyticsDataReady();
	const { startDate, endDate } = getDateRange(timeRange);
	const periodLength = Math.max(1, differenceInCalendarDays(endDate, startDate) + 1);
	const previousEnd = subDays(startDate, 1);
	const previousStart = subDays(previousEnd, periodLength - 1);

	const [currentProductivityTrend, previousProductivityTrend, currentCostTrend, previousCostTrend] =
		await Promise.all([
			getPerformanceTrends(startDate, endDate, "productivity"),
			getPerformanceTrends(previousStart, previousEnd, "productivity"),
			getPerformanceTrends(startDate, endDate, "cost"),
			getPerformanceTrends(previousStart, previousEnd, "cost"),
		]);

	const [currentQuality, previousQuality, assignmentTrends] = await Promise.all([
		db.performanceMetric.aggregate({
			where: { date: { gte: startDate, lte: endDate } },
			_avg: { qualityScore: true },
		}),
		db.performanceMetric.aggregate({
			where: { date: { gte: previousStart, lte: previousEnd } },
			_avg: { qualityScore: true },
		}),
		db.taskAssignment.findMany({
			where: { startTime: { gte: startDate, lte: endDate } },
			select: { startTime: true },
		}),
	]);

	const productivityCurrent = average(currentProductivityTrend.map((point) => point.value));
	const productivityPrevious = average(previousProductivityTrend.map((point) => point.value));
	const costCurrent = average(currentCostTrend.map((point) => point.value));
	const costPrevious = average(previousCostTrend.map((point) => point.value));
	const qualityCurrent = currentQuality._avg.qualityScore ?? 0;
	const qualityPrevious = previousQuality._avg.qualityScore ?? 0;

	const dayCounts = new Map<string, number>();
	const shiftCounts = new Map<string, number>([
		["Morning", 0],
		["Afternoon", 0],
		["Night", 0],
	]);
	for (const assignment of assignmentTrends) {
		const date = new Date(assignment.startTime);
		const weekday = format(date, "EEEE");
		dayCounts.set(weekday, (dayCounts.get(weekday) ?? 0) + 1);
		const shift = toShiftBucket(date);
		shiftCounts.set(shift, (shiftCounts.get(shift) ?? 0) + 1);
	}

	const peakDay =
		Array.from(dayCounts.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] ??
		format(new Date(), "EEEE");
	const peakShift =
		Array.from(shiftCounts.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "Morning";

	const productivityChange = changePercent(productivityCurrent, productivityPrevious);
	const costChange = changePercent(costCurrent, costPrevious);
	const qualityChange = changePercent(qualityCurrent, qualityPrevious);

	return {
		productivity: {
			trend: productivityChange > 0 ? "up" : productivityChange < 0 ? "down" : "neutral",
			changePercent: Number(productivityChange.toFixed(1)),
			forecast: Number((productivityCurrent * 1.02).toFixed(1)),
			confidence: 82,
		},
		costs: {
			trend: costChange > 0 ? "up" : costChange < 0 ? "down" : "neutral",
			changePercent: Number(costChange.toFixed(1)),
			forecast: Number((costCurrent * 0.99).toFixed(2)),
			confidence: 79,
		},
		quality: {
			trend: qualityChange > 0 ? "up" : qualityChange < 0 ? "down" : "neutral",
			changePercent: Number(qualityChange.toFixed(1)),
			forecast: Number((qualityCurrent * 1.005).toFixed(1)),
			confidence: 90,
		},
		seasonal: {
			peakDay,
			peakShift,
			lowDay: "Sunday",
			seasonalFactor: 1,
		},
	};
}

export async function fetchAnalyticsDashboardData(): Promise<AnalyticsDashboardData> {
	await ensureAnalyticsDataReady();
	const [capacityData, stationPerformance, laborCost] = await Promise.all([
		getCapacityUtilizationData("week"),
		getStationPerformance(subDays(new Date(), 6), new Date()),
		getLaborCostAnalysis(subDays(new Date(), 6), new Date()),
	]);

	const performanceByName = new Map(
		stationPerformance.map((station) => [station.stationName, station.avgUnitsPerHour])
	);

	const stations = capacityData.stations.map((station) => ({
		name: station.name,
		efficiency: Number((performanceByName.get(station.name) ?? 0).toFixed(1)),
		occupancy: station.utilization,
		employees: station.currentStaff,
	}));

	const costSummary = {
		regular: Number(laborCost.regularCost.toFixed(2)),
		overtime: Number(laborCost.overtimeCost.toFixed(2)),
		total: Number(laborCost.actualCost.toFixed(2)),
		variance: Number(laborCost.variance.toFixed(2)),
		variancePercent: Number(laborCost.variancePercentage.toFixed(1)),
	};

	return {
		stations,
		costSummary,
	};
}

export async function fetchLiveFloorData(): Promise<LiveFloorData> {
	await ensureAnalyticsDataReady();
	const [capacityData, stationPerformance] = await Promise.all([
		getCapacityUtilizationData("today"),
		getStationPerformance(subDays(new Date(), 6), new Date()),
	]);

	const performanceByName = new Map(
		stationPerformance.map((station) => [station.stationName, station.avgUnitsPerHour])
	);

	const timestamp = new Date().toISOString();
	return {
		zones: capacityData.stations.map((station) => {
			const efficiencyRaw = performanceByName.get(station.name) ?? 0;
			const efficiency = Math.min(100, Math.max(0, Number((efficiencyRaw * 3).toFixed(0))));
			return {
				id: `zone-${station.name.toLowerCase()}`,
				name: formatStationLabel(station.name),
				occupancy: station.utilization,
				efficiency,
				throughputPerHour: Math.round(efficiencyRaw * station.currentStaff),
				updatedAt: timestamp,
			};
		}),
	};
}
