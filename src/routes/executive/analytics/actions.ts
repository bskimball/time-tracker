"use server";

import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";
import { getPerformanceTrends, getStationPerformance, getLaborCostAnalysis } from "~/lib/analytics";
import {
	performanceCache,
	getPerformanceTrendsCacheKey,
	getStationPerformanceCacheKey,
	getLaborCostAnalysisCacheKey,
} from "~/lib/performance-cache";

/**
 * Get productivity trend data for charts
 */
export async function getProductivityTrendData(timeRange: "today" | "week" | "month" = "week") {
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
export async function getLaborCostTrendData(timeRange: "today" | "week" | "month" = "week") {
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
export async function getStationEfficiencyData(timeRange: "today" | "week" | "month" = "week") {
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
export async function getEmployeeProductivityRanking(
	timeRange: "today" | "week" | "month" = "week"
) {
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
export async function getCostBreakdownData(timeRange: "today" | "week" | "month" = "week") {
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

	return [
		{
			label: "Regular Hours",
			value: costData.regularCost,
			color: "#3b82f6",
		},
		{
			label: "Overtime",
			value: costData.overtimeCost,
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
	return [
		{
			label: "PICKING",
			value: 78,
			color: "#3b82f6",
		},
		{
			label: "PACKING",
			value: 65,
			color: "#10b981",
		},
		{
			label: "FILLING",
			value: 92,
			color: "#ef4444",
		},
		{
			label: "RECEIVING",
			value: 45,
			color: "#f59e0b",
		},
		{
			label: "SHIPPING",
			value: 38,
			color: "#8b5cf6",
		},
	];
}

/**
 * Get shift productivity comparison
 */
export async function getShiftProductivityData(_timeRange: "today" | "week" | "month" = "week") {
	// This would be expanded to include actual shift data
	return {
		labels: ["Morning", "Afternoon", "Night"],
		datasets: [
			{
				label: "Units per Hour",
				data: [28.5, 24.2, 31.8],
				color: "#3b82f6",
			},
		],
	};
}

/**
 * Get task type efficiency data
 */
export async function getTaskTypeEfficiencyData(_timeRange: "today" | "week" | "month" = "week") {
	// This would be expanded to include actual task type data
	return {
		labels: ["Picking", "Packing", "Filling", "Receiving", "Shipping"],
		datasets: [
			{
				label: "Average Units per Hour",
				data: [28.5, 24.2, 35.1, 22.3, 26.8],
				color: "#10b981",
			},
		],
	};
}
