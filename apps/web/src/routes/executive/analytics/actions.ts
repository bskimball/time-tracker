"use server";

import {
	format,
	startOfWeek,
	endOfWeek,
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
			startDate = startOfWeek(now);
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

/**
 * Period-over-period comparison data used by the executive analytics overview.
 */
export async function getComparativeAnalyticsData(
	timeRange: AnalyticsTimeRange = "month",
	basis: ComparisonBasis = "previous-period"
) {
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
	const { startDate, endDate } = getDateRange(timeRange);

	const cacheKey = getPerformanceTrendsCacheKey(startDate, endDate, "productivity");
	const trends = await performanceCache.get(
		cacheKey,
		() => getPerformanceTrends(startDate, endDate, "productivity"),
		15 * 60 * 1000
	);

	// Ensure we have valid data, fallback to sample data if needed
	const validTrends =
		trends && trends.length > 0 && trends.every((t) => !isNaN(t.value))
			? trends
			: [
					{ date: new Date().toISOString(), value: 28.1 },
					{ date: new Date(Date.now() - 86400000).toISOString(), value: 27.8 },
					{ date: new Date(Date.now() - 172800000).toISOString(), value: 29.2 },
					{ date: new Date(Date.now() - 259200000).toISOString(), value: 26.9 },
					{ date: new Date(Date.now() - 345600000).toISOString(), value: 30.1 },
					{ date: new Date(Date.now() - 432000000).toISOString(), value: 28.7 },
					{ date: new Date(Date.now() - 518400000).toISOString(), value: 29.5 },
				];

	return {
		labels: validTrends.map((t) => format(new Date(t.date), "EEE")),
		datasets: [
			{
				label: "Units per Hour",
				data: validTrends.map((t) => t.value),
				color: "#3b82f6",
			},
		],
	};
}

/**
 * Get labor cost trend data for charts
 */
export async function getLaborCostTrendData(timeRange: AnalyticsTimeRange = "week") {
	const { startDate, endDate } = getDateRange(timeRange);

	const cacheKey = getPerformanceTrendsCacheKey(startDate, endDate, "cost");
	const trends = await performanceCache.get(
		cacheKey,
		() => getPerformanceTrends(startDate, endDate, "cost"),
		15 * 60 * 1000
	);

	// Ensure we have valid data, fallback to sample data if needed
	const validTrends =
		trends && trends.length > 0 && trends.every((t) => !isNaN(t.value))
			? trends
			: [
					{ date: new Date().toISOString(), value: 18.55 },
					{ date: new Date(Date.now() - 86400000).toISOString(), value: 18.72 },
					{ date: new Date(Date.now() - 172800000).toISOString(), value: 18.34 },
					{ date: new Date(Date.now() - 259200000).toISOString(), value: 18.89 },
					{ date: new Date(Date.now() - 345600000).toISOString(), value: 18.12 },
					{ date: new Date(Date.now() - 432000000).toISOString(), value: 18.67 },
					{ date: new Date(Date.now() - 518400000).toISOString(), value: 18.43 },
				];

	return {
		labels: validTrends.map((t) => format(new Date(t.date), "EEE")),
		datasets: [
			{
				label: "Cost per Unit",
				data: validTrends.map((t) => t.value),
				color: "#ef4444",
			},
		],
	};
}

/**
 * Get station efficiency comparison data for charts
 */
export async function getStationEfficiencyData(timeRange: AnalyticsTimeRange = "week") {
	const { startDate, endDate } = getDateRange(timeRange);

	const cacheKey = getStationPerformanceCacheKey(startDate, endDate);
	const stationData = await performanceCache.get(
		cacheKey,
		() => getStationPerformance(startDate, endDate),
		10 * 60 * 1000
	);

	// Ensure we have valid data, fallback to sample data if needed
	const validStationData =
		stationData && stationData.length > 0 && stationData.every((s) => !isNaN(s.avgUnitsPerHour))
			? stationData
			: [
					{ stationName: "PICKING", avgUnitsPerHour: 28.5 },
					{ stationName: "PACKING", avgUnitsPerHour: 24.2 },
					{ stationName: "FILLING", avgUnitsPerHour: 35.1 },
					{ stationName: "RECEIVING", avgUnitsPerHour: 22.3 },
				];

	return {
		labels: validStationData.map((s) => s.stationName),
		datasets: [
			{
				label: "Average Units per Hour",
				data: validStationData.map((s) => s.avgUnitsPerHour),
				color: "#10b981",
			},
		],
	};
}

/**
 * Get employee productivity ranking data
 */
export async function getEmployeeProductivityRanking(timeRange: AnalyticsTimeRange = "week") {
	void timeRange;

	// This would be expanded to include actual employee data
	// For now, return placeholder top performers
	return [
		{
			employee: "David Chen",
			value: 39.0,
			station: "FILLING",
		},
		{
			employee: "John Smith",
			value: 29.9,
			station: "PICKING",
		},
		{
			employee: "Maria Garcia",
			value: 26.4,
			station: "PACKING",
		},
		{
			employee: "Sarah Johnson",
			value: 20.4,
			station: "RECEIVING",
		},
		{
			employee: "Michael Brown",
			value: 18.7,
			station: "SHIPPING",
		},
	];
}

/**
 * Get cost breakdown data for pie chart
 */
export async function getCostBreakdownData(timeRange: AnalyticsTimeRange = "week") {
	const now = new Date();
	let startDate: Date;
	let endDate: Date;

	switch (timeRange) {
		case "week":
			startDate = startOfWeek(now);
			endDate = endOfWeek(now);
			break;
		case "month":
			startDate = startOfMonth(now);
			endDate = endOfMonth(now);
			break;
		case "today":
		default:
			startDate = new Date(now);
			startDate.setHours(0, 0, 0, 0);
			endDate = new Date(now);
			endDate.setHours(23, 59, 59, 999);
			break;
	}

	const cacheKey = getLaborCostAnalysisCacheKey(startDate, endDate);
	const costData = await performanceCache.get(
		cacheKey,
		() => getLaborCostAnalysis(startDate, endDate),
		10 * 60 * 1000
	);

	// Ensure we have valid data, fallback to sample data if needed
	const validCostData =
		costData && !isNaN(costData.regularCost) && !isNaN(costData.overtimeCost)
			? costData
			: { regularCost: 15480.5, overtimeCost: 3495.25 };

	return [
		{
			name: "Regular Hours",
			value: validCostData.regularCost,
			color: "#3b82f6",
		},
		{
			name: "Overtime",
			value: validCostData.overtimeCost,
			color: "#f59e0b",
		},
	];
}

/**
 * Get station occupancy data
 */
export async function getStationOccupancyData() {
	// This would get current occupancy from real-time data
	// For now, return placeholder data
	const data = [
		{ name: "PICKING", value: 78 },
		{ name: "PACKING", value: 65 },
		{ name: "FILLING", value: 92 },
		{ name: "RECEIVING", value: 45 },
		{ name: "SHIPPING", value: 38 },
	];

	// Ensure data is valid (no NaN values)
	const validData = data.every((d) => !isNaN(d.value))
		? data
		: [
				{ name: "PICKING", value: 75 },
				{ name: "PACKING", value: 70 },
				{ name: "FILLING", value: 85 },
				{ name: "RECEIVING", value: 50 },
				{ name: "SHIPPING", value: 40 },
			];

	return validData.map((item) => ({
		...item,
		color:
			item.name === "PICKING"
				? "#3b82f6"
				: item.name === "PACKING"
					? "#10b981"
					: item.name === "FILLING"
						? "#ef4444"
						: item.name === "RECEIVING"
							? "#f59e0b"
							: "#8b5cf6",
	}));
}

/**
 * Get shift productivity comparison
 */
export async function getShiftProductivityData(_timeRange: AnalyticsTimeRange = "week") {
	// This would be expanded to include actual shift data
	// Ensure data is valid (no NaN values)
	const data = [28.5, 24.2, 31.8];
	const validData = data.every((d) => !isNaN(d)) ? data : [28.0, 25.0, 30.0];

	return {
		labels: ["Morning", "Afternoon", "Night"],
		datasets: [
			{
				label: "Units per Hour",
				data: validData,
				color: "#3b82f6",
			},
		],
	};
}

/**
 * Get task type efficiency data
 */
export async function getTaskTypeEfficiencyData(_timeRange: AnalyticsTimeRange = "week") {
	// This would be expanded to include actual task type data
	// Ensure data is valid (no NaN values)
	const data = [28.5, 24.2, 35.1, 22.3, 26.8];
	const validData = data.every((d) => !isNaN(d)) ? data : [28.0, 24.0, 35.0, 22.0, 27.0];

	return {
		labels: ["Picking", "Packing", "Filling", "Receiving", "Shipping"],
		datasets: [
			{
				label: "Average Units per Hour",
				data: validData,
				color: "#10b981",
			},
		],
	};
}

/**
 * Get benchmark data for performance comparisons
 */
export async function getBenchmarkData(_timeRange: AnalyticsTimeRange = "week") {
	// This would compare against industry standards and internal targets
	return {
		productivity: {
			current: 28.1,
			target: 30.0,
			industryAvg: 25.5,
			top10Percent: 35.2,
		},
		costPerUnit: {
			current: 18.55,
			target: 17.5,
			industryAvg: 20.25,
			bottom10Percent: 15.8,
		},
		quality: {
			current: 94.7,
			target: 95.0,
			industryAvg: 92.3,
			top10Percent: 97.8,
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
export async function getAnomalyData(_timeRange: AnalyticsTimeRange = "week"): Promise<Anomaly[]> {
	// This would detect unusual patterns in performance data
	return [
		{
			type: "productivity_drop",
			station: "PACKING",
			date: "2024-12-15",
			severity: "high",
			description: "Productivity dropped 35% below average",
			impact: -12.5,
			status: "Open",
		},
		{
			type: "cost_spike",
			station: "FILLING",
			date: "2024-12-14",
			severity: "medium",
			description: "Overtime costs increased by 45%",
			impact: 8.2,
			status: "Investigating",
		},
		{
			type: "quality_decline",
			station: "RECEIVING",
			date: "2024-12-13",
			severity: "low",
			description: "Error rate increased by 15%",
			impact: -2.1,
			status: "Resolved",
		},
	];
}

/**
 * Get capacity utilization data
 */
export async function getCapacityUtilizationData(_timeRange: AnalyticsTimeRange = "week") {
	// This would provide staffing and capacity insights
	return {
		stations: [
			{
				name: "PICKING",
				currentStaff: 12,
				requiredStaff: 10,
				utilization: 78,
				maxCapacity: 15,
				recommendedStaff: 11,
			},
			{
				name: "PACKING",
				currentStaff: 8,
				requiredStaff: 9,
				utilization: 65,
				maxCapacity: 12,
				recommendedStaff: 9,
			},
			{
				name: "FILLING",
				currentStaff: 6,
				requiredStaff: 7,
				utilization: 92,
				maxCapacity: 8,
				recommendedStaff: 7,
			},
			{
				name: "RECEIVING",
				currentStaff: 4,
				requiredStaff: 5,
				utilization: 45,
				maxCapacity: 6,
				recommendedStaff: 5,
			},
		],
		overall: {
			currentUtilization: 72,
			optimalUtilization: 80,
			staffShortage: 3,
			costImpact: 1250.5,
		},
	};
}

/**
 * Get trend analysis data
 */
export async function getTrendAnalysisData(_timeRange: AnalyticsTimeRange = "week") {
	// This would provide trend insights and forecasting
	return {
		productivity: {
			trend: "up",
			changePercent: 5.2,
			forecast: 29.8,
			confidence: 85,
		},
		costs: {
			trend: "down",
			changePercent: -3.1,
			forecast: 17.95,
			confidence: 78,
		},
		quality: {
			trend: "stable",
			changePercent: 0.8,
			forecast: 95.2,
			confidence: 92,
		},
		seasonal: {
			peakDay: "Wednesday",
			peakShift: "Morning",
			lowDay: "Sunday",
			seasonalFactor: 1.15,
		},
	};
}

export async function fetchAnalyticsDashboardData(): Promise<AnalyticsDashboardData> {
	const stations = [
		{ name: "PICKING", efficiency: 28.5, occupancy: 85, employees: 12 },
		{ name: "PACKING", efficiency: 32.1, occupancy: 78, employees: 8 },
		{ name: "FILLING", efficiency: 25.8, occupancy: 92, employees: 15 },
		{ name: "RECEIVING", efficiency: 18.2, occupancy: 45, employees: 6 },
	];

	const costSummary = {
		regular: 15000,
		overtime: 2500,
		total: 17500,
		variance: -500,
		variancePercent: -2.8,
	};

	return {
		stations,
		costSummary,
	};
}

export async function fetchLiveFloorData(): Promise<LiveFloorData> {
	const timestamp = new Date().toISOString();
	return {
		zones: [
			{
				id: "zone-picking",
				name: "Picking",
				occupancy: 82,
				efficiency: 74,
				throughputPerHour: 720,
				updatedAt: timestamp,
			},
			{
				id: "zone-packing",
				name: "Packing",
				occupancy: 75,
				efficiency: 69,
				throughputPerHour: 610,
				updatedAt: timestamp,
			},
			{
				id: "zone-filling",
				name: "Filling",
				occupancy: 91,
				efficiency: 58,
				throughputPerHour: 530,
				updatedAt: timestamp,
			},
			{
				id: "zone-receiving",
				name: "Receiving",
				occupancy: 49,
				efficiency: 44,
				throughputPerHour: 310,
				updatedAt: timestamp,
			},
			{
				id: "zone-shipping",
				name: "Shipping",
				occupancy: 38,
				efficiency: 63,
				throughputPerHour: 420,
				updatedAt: timestamp,
			},
		],
	};
}
