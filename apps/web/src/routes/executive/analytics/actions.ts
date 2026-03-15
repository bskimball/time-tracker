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

function getComparisonBasisLabel(basis: ComparisonBasis): string {
	switch (basis) {
		case "last-year":
			return "Last Year";
		case "rolling-30d":
			return "Rolling 30 Days";
		case "previous-period":
		default:
			return "Previous Period";
	}
}

async function getReferenceDate() {
	const latestMetric = await db.performanceMetric.aggregate({
		_max: {
			date: true,
		},
	});

	return latestMetric._max.date ?? new Date();
}

async function getDateRange(timeRange: AnalyticsTimeRange) {
	const now = await getReferenceDate();
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

async function getComparisonDateRange(
	timeRange: AnalyticsTimeRange,
	basis: ComparisonBasis
): Promise<{
	currentStart: Date;
	currentEnd: Date;
	comparisonStart: Date;
	comparisonEnd: Date;
}> {
	const { startDate: currentStart, endDate: currentEnd } = await getDateRange(timeRange);

	if (basis === "rolling-30d") {
		const rollingEnd = currentEnd;
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

function alignSeries<T>(labels: string[], values: T[], fallback: T) {
	return labels.map((_, index) => values[index] ?? fallback);
}

function mergeOrderedLabels(primary: string[], secondary: string[]) {
	const seen = new Set<string>();
	const merged: string[] = [];
	for (const label of [...primary, ...secondary]) {
		if (seen.has(label)) continue;
		seen.add(label);
		merged.push(label);
	}
	return merged;
}

function formatChangePercent(current: number, comparison: number) {
	return Number(changePercent(current, comparison).toFixed(1));
}

function buildCostSummary(
	current: Awaited<ReturnType<typeof getLaborCostAnalysis>>,
	comparison: Awaited<ReturnType<typeof getLaborCostAnalysis>>
) {
	return {
		regular: Number(current.regularCost.toFixed(2)),
		comparisonRegular: Number(comparison.regularCost.toFixed(2)),
		regularChangePercent: formatChangePercent(current.regularCost, comparison.regularCost),
		overtime: Number(current.overtimeCost.toFixed(2)),
		comparisonOvertime: Number(comparison.overtimeCost.toFixed(2)),
		overtimeChangePercent: formatChangePercent(current.overtimeCost, comparison.overtimeCost),
		total: Number(current.actualCost.toFixed(2)),
		comparisonTotal: Number(comparison.actualCost.toFixed(2)),
		totalChangePercent: formatChangePercent(current.actualCost, comparison.actualCost),
		variance: Number(current.variance.toFixed(2)),
		variancePercent: Number(current.variancePercentage.toFixed(1)),
	};
}

async function getShiftProductivityBuckets(startDate: Date, endDate: Date) {
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

	return buckets;
}

async function getTaskTypeEfficiencyRows(startDate: Date, endDate: Date) {
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

	return Array.from(totals.values())
		.map((row) => ({
			name: row.name,
			value: row.hours > 0 ? Number((row.units / row.hours).toFixed(1)) : 0,
		}))
		.sort((a, b) => b.value - a.value)
		.slice(0, 8);
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
	const { currentStart, currentEnd, comparisonStart, comparisonEnd } = await getComparisonDateRange(
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
export async function getProductivityTrendData(
	timeRange: AnalyticsTimeRange = "week",
	basis: ComparisonBasis = "previous-period"
) {
	await ensureAnalyticsDataReady();
	const { currentStart, currentEnd, comparisonStart, comparisonEnd } = await getComparisonDateRange(
		timeRange,
		basis
	);

	const [currentTrends, comparisonTrends] = await Promise.all([
		performanceCache.get(
			getPerformanceTrendsCacheKey(currentStart, currentEnd, "productivity"),
			() => getPerformanceTrends(currentStart, currentEnd, "productivity"),
			15 * 60 * 1000
		),
		performanceCache.get(
			getPerformanceTrendsCacheKey(comparisonStart, comparisonEnd, "productivity"),
			() => getPerformanceTrends(comparisonStart, comparisonEnd, "productivity"),
			15 * 60 * 1000
		),
	]);

	const labels = currentTrends.map((trend) => format(new Date(trend.date), "EEE"));
	const comparisonValues = alignSeries(
		labels,
		comparisonTrends.map((trend) => trend.value),
		0
	);

	return {
		labels,
		datasets: [
			{
				label: "Current",
				data: currentTrends.map((trend) => trend.value),
				color: "#3b82f6",
			},
			{
				label: getComparisonBasisLabel(basis),
				data: comparisonValues,
				color: "#94a3b8",
				strokeDasharray: "6 4",
				hideArea: true,
			},
		],
	};
}

/**
 * Get labor cost trend data for charts
 */
export async function getLaborCostTrendData(
	timeRange: AnalyticsTimeRange = "week",
	basis: ComparisonBasis = "previous-period"
) {
	await ensureAnalyticsDataReady();
	const { currentStart, currentEnd, comparisonStart, comparisonEnd } = await getComparisonDateRange(
		timeRange,
		basis
	);

	const [currentTrends, comparisonTrends] = await Promise.all([
		performanceCache.get(
			getPerformanceTrendsCacheKey(currentStart, currentEnd, "cost"),
			() => getPerformanceTrends(currentStart, currentEnd, "cost"),
			15 * 60 * 1000
		),
		performanceCache.get(
			getPerformanceTrendsCacheKey(comparisonStart, comparisonEnd, "cost"),
			() => getPerformanceTrends(comparisonStart, comparisonEnd, "cost"),
			15 * 60 * 1000
		),
	]);

	const labels = currentTrends.map((trend) => format(new Date(trend.date), "EEE"));
	const comparisonValues = alignSeries(
		labels,
		comparisonTrends.map((trend) => trend.value),
		0
	);

	return {
		labels,
		datasets: [
			{
				label: "Current",
				data: currentTrends.map((trend) => trend.value),
				color: "#ef4444",
			},
			{
				label: getComparisonBasisLabel(basis),
				data: comparisonValues,
				color: "#94a3b8",
				strokeDasharray: "6 4",
				hideArea: true,
			},
		],
	};
}

/**
 * Get station efficiency comparison data for charts
 */
export async function getStationEfficiencyData(
	timeRange: AnalyticsTimeRange = "week",
	basis: ComparisonBasis = "previous-period"
) {
	await ensureAnalyticsDataReady();
	const { currentStart, currentEnd, comparisonStart, comparisonEnd } = await getComparisonDateRange(
		timeRange,
		basis
	);

	const [currentStationData, comparisonStationData] = await Promise.all([
		performanceCache.get(
			getStationPerformanceCacheKey(currentStart, currentEnd),
			() => getStationPerformance(currentStart, currentEnd),
			10 * 60 * 1000
		),
		performanceCache.get(
			getStationPerformanceCacheKey(comparisonStart, comparisonEnd),
			() => getStationPerformance(comparisonStart, comparisonEnd),
			10 * 60 * 1000
		),
	]);

	const labels = currentStationData.map((station) => station.stationName);
	const comparisonByStation = new Map(
		comparisonStationData.map((station) => [station.stationName, station.avgUnitsPerHour])
	);

	return {
		labels,
		datasets: [
			{
				label: "Current",
				data: currentStationData.map((station) => station.avgUnitsPerHour),
				color: "#10b981",
			},
			{
				label: getComparisonBasisLabel(basis),
				data: labels.map((label) => comparisonByStation.get(label) ?? 0),
				color: "#cbd5e1",
			},
		],
	};
}

/**
 * Get employee productivity ranking data
 */
export async function getEmployeeProductivityRanking(timeRange: AnalyticsTimeRange = "week") {
	await ensureAnalyticsDataReady();
	const { startDate, endDate } = await getDateRange(timeRange);

	// Get all metrics in the time range
	const rawMetrics = await db.performanceMetric.findMany({
		where: {
			date: {
				gte: startDate,
				lte: endDate,
			},
			stationId: { not: null },
			efficiency: { not: null },
		},
		select: { employeeId: true, stationId: true, efficiency: true, unitsProcessed: true, hoursWorked: true },
	});

	if (rawMetrics.length === 0) return [];

	// Calculate baseline averages for each station
	const stationTotals = new Map<string, { sum: number; count: number }>();
	for (const m of rawMetrics) {
		if (!m.stationId || m.efficiency === null) continue;
		if (!stationTotals.has(m.stationId)) {
			stationTotals.set(m.stationId, { sum: 0, count: 0 });
		}
		const s = stationTotals.get(m.stationId)!;
		s.sum += m.efficiency;
		s.count += 1;
	}

	const stationAverages = new Map<string, number>();
	for (const [stationId, { sum, count }] of stationTotals.entries()) {
		stationAverages.set(stationId, sum / count);
	}

	// Group by employee and calculate their normalized score (100 = average for their station)
	const employeeMetrics = new Map<string, { sumNormalized: number; count: number; primaryStation: string | null; totalUnits: number; totalHours: number }>();
	for (const m of rawMetrics) {
		if (!m.stationId || m.efficiency === null) continue;
		
		if (!employeeMetrics.has(m.employeeId)) {
			employeeMetrics.set(m.employeeId, { sumNormalized: 0, count: 0, primaryStation: m.stationId, totalUnits: 0, totalHours: 0 });
		}
		const e = employeeMetrics.get(m.employeeId)!;
		
		const stationAvg = stationAverages.get(m.stationId);
		if (stationAvg && stationAvg > 0) {
			const normalizedScore = (m.efficiency / stationAvg) * 100;
			e.sumNormalized += normalizedScore;
			e.count += 1;
		}
		
		if (m.unitsProcessed != null) e.totalUnits += m.unitsProcessed;
		if (m.hoursWorked != null) e.totalHours += m.hoursWorked;
	}

	// Calculate final scores and sort
	const rankedIds = Array.from(employeeMetrics.entries())
		.map(([id, data]) => ({
			employeeId: id,
			normalizedScore: data.count > 0 ? data.sumNormalized / data.count : 0,
			primaryStationId: data.primaryStation,
			totalUnits: data.totalUnits,
			totalHours: data.totalHours,
		}))
		.filter((e) => e.normalizedScore > 0)
		.sort((a, b) => b.normalizedScore - a.normalizedScore)
		.slice(0, 10);

	if (rankedIds.length === 0) return [];

	const employeeIds = rankedIds.map((item) => item.employeeId);
	const employees = await db.employee.findMany({
		where: { id: { in: employeeIds } },
		include: {
			defaultStation: true,
		},
	});
	const employeesById = new Map(employees.map((employee) => [employee.id, employee]));

	return rankedIds.map((item) => {
		const employee = employeesById.get(item.employeeId);
		return {
			employee: employee?.name ?? "Unknown",
			// We return their normalized score representing % of their station's average
			value: Number(item.normalizedScore.toFixed(1)),
			station: employee?.defaultStation?.name ?? "UNASSIGNED",
			units: item.totalUnits,
			hours: Number(item.totalHours.toFixed(1)),
			rate: item.totalHours > 0 ? Number((item.totalUnits / item.totalHours).toFixed(1)) : 0,
		};
	});
}

/**
 * Get cost breakdown data for pie chart
 */
export async function getCostBreakdownData(timeRange: AnalyticsTimeRange = "week") {
	await ensureAnalyticsDataReady();
	const { startDate, endDate } = await getDateRange(timeRange);

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
export async function getShiftProductivityData(
	timeRange: AnalyticsTimeRange = "week",
	basis: ComparisonBasis = "previous-period"
) {
	await ensureAnalyticsDataReady();
	const { currentStart, currentEnd, comparisonStart, comparisonEnd } = await getComparisonDateRange(
		timeRange,
		basis
	);

	const [currentBuckets, comparisonBuckets] = await Promise.all([
		getShiftProductivityBuckets(currentStart, currentEnd),
		getShiftProductivityBuckets(comparisonStart, comparisonEnd),
	]);

	const labels = ["Morning", "Afternoon", "Night"];
	const toValues = (buckets: Map<string, { units: number; hours: number }>) =>
		labels.map((label) => {
			const bucket = buckets.get(label);
			if (!bucket || bucket.hours === 0) return 0;
			return Number((bucket.units / bucket.hours).toFixed(1));
		});

	return {
		labels,
		datasets: [
			{
				label: "Current",
				data: toValues(currentBuckets),
				color: "#3b82f6",
			},
			{
				label: getComparisonBasisLabel(basis),
				data: toValues(comparisonBuckets),
				color: "#cbd5e1",
			},
		],
	};
}

/**
 * Get task type efficiency data
 */
export async function getTaskTypeEfficiencyData(
	timeRange: AnalyticsTimeRange = "week",
	basis: ComparisonBasis = "previous-period"
) {
	await ensureAnalyticsDataReady();
	const { currentStart, currentEnd, comparisonStart, comparisonEnd } = await getComparisonDateRange(
		timeRange,
		basis
	);

	const [currentRows, comparisonRows] = await Promise.all([
		getTaskTypeEfficiencyRows(currentStart, currentEnd),
		getTaskTypeEfficiencyRows(comparisonStart, comparisonEnd),
	]);

	const labels = mergeOrderedLabels(
		currentRows.map((row) => row.name),
		comparisonRows.map((row) => row.name)
	);
	const currentByName = new Map(currentRows.map((row) => [row.name, row.value]));
	const comparisonByName = new Map(comparisonRows.map((row) => [row.name, row.value]));

	return {
		labels,
		datasets: [
			{
				label: "Current",
				data: labels.map((label) => currentByName.get(label) ?? 0),
				color: "#10b981",
			},
			{
				label: getComparisonBasisLabel(basis),
				data: labels.map((label) => comparisonByName.get(label) ?? 0),
				color: "#cbd5e1",
			},
		],
	};
}

function percentile(values: number[], p: number) {
	if (values.length === 0) return 0;
	const index = Math.min(values.length - 1, Math.max(0, Math.floor(values.length * p)));
	return values[index];
}

async function getBenchmarkWindowSnapshot(startDate: Date, endDate: Date) {
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
 * Get benchmark data for performance comparisons
 */
export async function getBenchmarkData(
	timeRange: AnalyticsTimeRange = "week",
	basis: ComparisonBasis = "previous-period"
) {
	await ensureAnalyticsDataReady();
	const { currentStart, currentEnd, comparisonStart, comparisonEnd } = await getComparisonDateRange(
		timeRange,
		basis
	);
	const [currentSnapshot, comparisonSnapshot] = await Promise.all([
		getBenchmarkWindowSnapshot(currentStart, currentEnd),
		getBenchmarkWindowSnapshot(comparisonStart, comparisonEnd),
	]);

	return {
		comparisonLabel: getComparisonBasisLabel(basis),
		productivity: {
			current: currentSnapshot.productivity.current,
			comparison: comparisonSnapshot.productivity.current,
			change: Number(
				(currentSnapshot.productivity.current - comparisonSnapshot.productivity.current).toFixed(1)
			),
			target: currentSnapshot.productivity.target,
			industryAvg: currentSnapshot.productivity.industryAvg,
			top10Percent: currentSnapshot.productivity.top10Percent,
		},
		costPerUnit: {
			current: currentSnapshot.costPerUnit.current,
			comparison: comparisonSnapshot.costPerUnit.current,
			change: Number(
				(currentSnapshot.costPerUnit.current - comparisonSnapshot.costPerUnit.current).toFixed(2)
			),
			target: currentSnapshot.costPerUnit.target,
			industryAvg: currentSnapshot.costPerUnit.industryAvg,
			bottom10Percent: currentSnapshot.costPerUnit.bottom10Percent,
		},
		quality: {
			current: currentSnapshot.quality.current,
			comparison: comparisonSnapshot.quality.current,
			change: Number(
				(currentSnapshot.quality.current - comparisonSnapshot.quality.current).toFixed(1)
			),
			target: currentSnapshot.quality.target,
			industryAvg: currentSnapshot.quality.industryAvg,
			top10Percent: currentSnapshot.quality.top10Percent,
		},
	};
}

export async function getStationBenchmarkComparisonData(
	timeRange: AnalyticsTimeRange = "week",
	basis: ComparisonBasis = "previous-period"
) {
	await ensureAnalyticsDataReady();
	const { currentStart, currentEnd, comparisonStart, comparisonEnd } = await getComparisonDateRange(
		timeRange,
		basis
	);

	const [currentStations, comparisonStations] = await Promise.all([
		performanceCache.get(
			getStationPerformanceCacheKey(currentStart, currentEnd),
			() => getStationPerformance(currentStart, currentEnd),
			10 * 60 * 1000
		),
		performanceCache.get(
			getStationPerformanceCacheKey(comparisonStart, comparisonEnd),
			() => getStationPerformance(comparisonStart, comparisonEnd),
			10 * 60 * 1000
		),
	]);

	const labels = mergeOrderedLabels(
		currentStations.map((station) => station.stationName),
		comparisonStations.map((station) => station.stationName)
	);
	const currentByName = new Map(currentStations.map((station) => [station.stationName, station]));
	const comparisonByName = new Map(
		comparisonStations.map((station) => [station.stationName, station])
	);

	return labels.map((label) => {
		const current = currentByName.get(label);
		const comparison = comparisonByName.get(label);
		const currentEfficiency = Number((current?.avgUnitsPerHour ?? 0).toFixed(1));
		const comparisonEfficiency = Number((comparison?.avgUnitsPerHour ?? 0).toFixed(1));

		return {
			name: label,
			efficiency: currentEfficiency,
			comparisonEfficiency,
			delta: Number((currentEfficiency - comparisonEfficiency).toFixed(1)),
		};
	});
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
	const { startDate, endDate } = await getDateRange(timeRange);
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

async function getCapacityWindowSnapshot(startDate: Date, endDate: Date) {
	const [optimalUtilization, hourlyRate, capacityFallback, stations, shifts] = await Promise.all([
		getOperationalNumber("OPTIMAL_UTILIZATION_PERCENT", 80),
		getOperationalNumber("LABOR_HOURLY_RATE", 18.5),
		getOperationalNumber("DEFAULT_STATION_CAPACITY_FALLBACK", 4),
		db.station.findMany({
			where: { isActive: true },
			orderBy: { name: "asc" },
		}),
		db.shift.findMany({
			where: {
				startTime: { lte: endDate },
				endTime: { gte: startDate },
			},
			select: {
				stationId: true,
				requiredHeadcount: true,
				assignments: {
					select: { id: true },
				},
			},
		}),
	]);

	const totalsByStation = new Map<
		string,
		{ shiftCount: number; requiredTotal: number; assignedTotal: number }
	>();
	for (const station of stations) {
		totalsByStation.set(station.id, { shiftCount: 0, requiredTotal: 0, assignedTotal: 0 });
	}

	for (const shift of shifts) {
		const current = totalsByStation.get(shift.stationId) ?? {
			shiftCount: 0,
			requiredTotal: 0,
			assignedTotal: 0,
		};
		current.shiftCount += 1;
		current.requiredTotal += shift.requiredHeadcount;
		current.assignedTotal += shift.assignments.length;
		totalsByStation.set(shift.stationId, current);
	}

	const stationRows = stations.map((station) => {
		const totals = totalsByStation.get(station.id) ?? {
			shiftCount: 0,
			requiredTotal: 0,
			assignedTotal: 0,
		};
		const maxCapacity = station.capacity ?? capacityFallback;
		const averageAssigned = totals.shiftCount > 0 ? totals.assignedTotal / totals.shiftCount : 0;
		const averageRequired =
			totals.shiftCount > 0
				? totals.requiredTotal / totals.shiftCount
				: Math.max(1, Math.ceil(maxCapacity * (optimalUtilization / 100)));
		const uncoveredRoles = Math.max(0, averageRequired - averageAssigned);
		const utilization = Number(((averageAssigned / Math.max(maxCapacity, 1)) * 100).toFixed(1));
		const coverage = Number(((averageAssigned / Math.max(averageRequired, 1)) * 100).toFixed(1));
		const recommendedStaff = Math.min(
			maxCapacity,
			Math.max(Math.ceil(averageRequired), Math.ceil(maxCapacity * (optimalUtilization / 100)))
		);

		return {
			name: station.name,
			currentStaff: Number(averageAssigned.toFixed(1)),
			requiredStaff: Number(averageRequired.toFixed(1)),
			utilization,
			maxCapacity,
			recommendedStaff,
			coverage,
			uncoveredRoles: Number(uncoveredRoles.toFixed(1)),
			totalUncoveredRoles: Math.max(0, totals.requiredTotal - totals.assignedTotal),
		};
	});

	const totalCurrent = stationRows.reduce((sum, row) => sum + row.currentStaff, 0);
	const totalRequired = stationRows.reduce((sum, row) => sum + row.requiredStaff, 0);
	const totalCapacity = stationRows.reduce((sum, row) => sum + row.maxCapacity, 0);
	const totalUncoveredRoles = stationRows.reduce((sum, row) => sum + row.totalUncoveredRoles, 0);

	return {
		stations: stationRows,
		overall: {
			currentUtilization: Number(((totalCurrent / Math.max(totalCapacity, 1)) * 100).toFixed(1)),
			optimalUtilization,
			staffShortage: Number(
				stationRows.reduce((sum, row) => sum + row.uncoveredRoles, 0).toFixed(1)
			),
			coverage: Number(((totalCurrent / Math.max(totalRequired, 1)) * 100).toFixed(1)),
			costImpact: Number((totalUncoveredRoles * 8 * hourlyRate).toFixed(2)),
			bottlenecks: stationRows.filter(
				(station) => station.coverage < 95 || station.utilization < optimalUtilization - 10
			).length,
		},
	};
}

/**
 * Get capacity utilization data
 */
export async function getCapacityUtilizationData(_timeRange: AnalyticsTimeRange = "week") {
	await ensureAnalyticsDataReady();
	const [optimalUtilization, hourlyRate, capacityFallback] = await Promise.all([
		getOperationalNumber("OPTIMAL_UTILIZATION_PERCENT", 80),
		getOperationalNumber("LABOR_HOURLY_RATE", 18.5),
		getOperationalNumber("DEFAULT_STATION_CAPACITY_FALLBACK", 4),
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
		const maxCapacity = station.capacity ?? Math.max(currentStaff, capacityFallback);
		const scheduledRequired = requiredByStation.get(station.id) ?? 0;
		const requiredStaff =
			scheduledRequired > 0
				? scheduledRequired
				: Math.max(1, Math.ceil(maxCapacity * (optimalUtilization / 100)));
		const utilization = Number(((currentStaff / Math.max(maxCapacity, 1)) * 100).toFixed(0));
		const recommendedStaff = Math.min(
			maxCapacity,
			Math.max(requiredStaff, Math.ceil(maxCapacity * (optimalUtilization / 100)))
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

export async function getCapacityComparisonData(
	timeRange: AnalyticsTimeRange = "week",
	basis: ComparisonBasis = "previous-period"
) {
	await ensureAnalyticsDataReady();
	const { currentStart, currentEnd, comparisonStart, comparisonEnd } = await getComparisonDateRange(
		timeRange,
		basis
	);
	const [currentWindow, comparisonWindow] = await Promise.all([
		getCapacityWindowSnapshot(currentStart, currentEnd),
		getCapacityWindowSnapshot(comparisonStart, comparisonEnd),
	]);

	const labels = mergeOrderedLabels(
		currentWindow.stations.map((station) => station.name),
		comparisonWindow.stations.map((station) => station.name)
	);
	const currentByName = new Map(currentWindow.stations.map((station) => [station.name, station]));
	const comparisonByName = new Map(
		comparisonWindow.stations.map((station) => [station.name, station])
	);

	return {
		overall: {
			currentUtilization: currentWindow.overall.currentUtilization,
			comparisonUtilization: comparisonWindow.overall.currentUtilization,
			utilizationDelta: Number(
				(
					currentWindow.overall.currentUtilization - comparisonWindow.overall.currentUtilization
				).toFixed(1)
			),
			currentCoverage: currentWindow.overall.coverage,
			comparisonCoverage: comparisonWindow.overall.coverage,
			coverageDelta: Number(
				(currentWindow.overall.coverage - comparisonWindow.overall.coverage).toFixed(1)
			),
			currentStaffShortage: currentWindow.overall.staffShortage,
			comparisonStaffShortage: comparisonWindow.overall.staffShortage,
			staffShortageDelta: Number(
				(currentWindow.overall.staffShortage - comparisonWindow.overall.staffShortage).toFixed(1)
			),
			currentCostImpact: currentWindow.overall.costImpact,
			comparisonCostImpact: comparisonWindow.overall.costImpact,
			costImpactDelta: Number(
				(currentWindow.overall.costImpact - comparisonWindow.overall.costImpact).toFixed(2)
			),
			currentBottlenecks: currentWindow.overall.bottlenecks,
			comparisonBottlenecks: comparisonWindow.overall.bottlenecks,
			bottleneckDelta: currentWindow.overall.bottlenecks - comparisonWindow.overall.bottlenecks,
			optimalUtilization: currentWindow.overall.optimalUtilization,
		},
		stations: labels.map((label) => {
			const current = currentByName.get(label);
			const comparison = comparisonByName.get(label);
			const currentUtilization = current?.utilization ?? 0;
			const comparisonUtilization = comparison?.utilization ?? 0;
			const currentCoverage = current?.coverage ?? 0;
			const comparisonCoverage = comparison?.coverage ?? 0;
			const currentGap = current?.uncoveredRoles ?? 0;
			const comparisonGap = comparison?.uncoveredRoles ?? 0;

			return {
				name: label,
				currentUtilization: Number(currentUtilization.toFixed(1)),
				comparisonUtilization: Number(comparisonUtilization.toFixed(1)),
				utilizationDelta: Number((currentUtilization - comparisonUtilization).toFixed(1)),
				currentCoverage: Number(currentCoverage.toFixed(1)),
				comparisonCoverage: Number(comparisonCoverage.toFixed(1)),
				coverageDelta: Number((currentCoverage - comparisonCoverage).toFixed(1)),
				currentGap: Number(currentGap.toFixed(1)),
				comparisonGap: Number(comparisonGap.toFixed(1)),
				gapDelta: Number((currentGap - comparisonGap).toFixed(1)),
				currentStaff: current?.currentStaff ?? 0,
				requiredStaff: current?.requiredStaff ?? 0,
				recommendedStaff: current?.recommendedStaff ?? comparison?.recommendedStaff ?? 0,
			};
		}),
	};
}

/**
 * Get trend analysis data
 */
export async function getTrendAnalysisData(
	timeRange: AnalyticsTimeRange = "week",
	basis: ComparisonBasis = "previous-period"
) {
	await ensureAnalyticsDataReady();
	const { currentStart, currentEnd, comparisonStart, comparisonEnd } = await getComparisonDateRange(
		timeRange,
		basis
	);

	const [currentProductivityTrend, previousProductivityTrend, currentCostTrend, previousCostTrend] =
		await Promise.all([
			getPerformanceTrends(currentStart, currentEnd, "productivity"),
			getPerformanceTrends(comparisonStart, comparisonEnd, "productivity"),
			getPerformanceTrends(currentStart, currentEnd, "cost"),
			getPerformanceTrends(comparisonStart, comparisonEnd, "cost"),
		]);

	const [currentQuality, previousQuality, assignmentTrends] = await Promise.all([
		db.performanceMetric.aggregate({
			where: { date: { gte: currentStart, lte: currentEnd } },
			_avg: { qualityScore: true },
		}),
		db.performanceMetric.aggregate({
			where: { date: { gte: comparisonStart, lte: comparisonEnd } },
			_avg: { qualityScore: true },
		}),
		db.taskAssignment.findMany({
			where: { startTime: { gte: currentStart, lte: currentEnd } },
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

export async function fetchAnalyticsDashboardData(
	timeRange: AnalyticsTimeRange = "week",
	basis: ComparisonBasis = "previous-period"
): Promise<AnalyticsDashboardData> {
	await ensureAnalyticsDataReady();
	const { currentStart, currentEnd, comparisonStart, comparisonEnd } = await getComparisonDateRange(
		timeRange,
		basis
	);
	const [capacityData, stationPerformance, currentLaborCost, comparisonLaborCost] =
		await Promise.all([
			getCapacityUtilizationData(timeRange),
			getStationPerformance(currentStart, currentEnd),
			getLaborCostAnalysis(currentStart, currentEnd),
			getLaborCostAnalysis(comparisonStart, comparisonEnd),
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

	const costSummary = buildCostSummary(currentLaborCost, comparisonLaborCost);

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
