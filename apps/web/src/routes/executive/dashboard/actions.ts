"use server";

import { subDays } from "date-fns";
import {
	getExecutiveKPIs,
	getLaborCostAnalysis,
	getStationPerformance,
	getPerformanceTrends,
	type PerformanceKPIs,
	type LaborCostAnalysis,
	type StationPerformance,
} from "~/lib/analytics";
import {
	performanceCache,
	getExecutiveKPIsCacheKey,
	getLaborCostAnalysisCacheKey,
	getStationPerformanceCacheKey,
	getPerformanceTrendsCacheKey,
} from "~/lib/performance-cache";

/**
 * Get executive dashboard KPIs with caching
 */
export async function getExecutiveDashboardKPIs(
	timeRange: "today" | "week" | "month" = "today"
): Promise<{
	kpis: PerformanceKPIs;
	laborCost: LaborCostAnalysis;
}> {
	const now = new Date();
	let startDate: Date;
	let endDate: Date;

	switch (timeRange) {
		case "week":
			startDate = subDays(now, 6);
			endDate = now;
			break;
		case "month":
			startDate = subDays(now, 29);
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

	const kpiCacheKey = getExecutiveKPIsCacheKey(startDate, endDate);
	const costCacheKey = getLaborCostAnalysisCacheKey(startDate, endDate);

	const [kpis, laborCost] = await Promise.all([
		performanceCache.get(kpiCacheKey, () => getExecutiveKPIs(startDate, endDate), 5 * 60 * 1000), // 5 min cache
		performanceCache.get(
			costCacheKey,
			() => getLaborCostAnalysis(startDate, endDate),
			5 * 60 * 1000
		),
	]);

	return { kpis, laborCost };
}

/**
 * Get station performance data for dashboard cards
 */
export async function getStationPerformanceData(
	timeRange: "today" | "week" | "month" = "today"
): Promise<StationPerformance[]> {
	const now = new Date();
	let startDate: Date;
	let endDate: Date;

	switch (timeRange) {
		case "week":
			startDate = subDays(now, 6);
			endDate = now;
			break;
		case "month":
			startDate = subDays(now, 29);
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

	const cacheKey = getStationPerformanceCacheKey(startDate, endDate);
	return performanceCache.get(
		cacheKey,
		() => getStationPerformance(startDate, endDate),
		10 * 60 * 1000
	); // 10 min cache
}

/**
 * Get performance trend data for charts.
 * Uses the same time windows as the selected dashboard range.
 */
export async function getPerformanceTrendData(
	metric: "productivity" | "cost" | "occupancy" = "productivity",
	timeRange: "today" | "week" | "month" = "week"
) {
	const now = new Date();
	let startDate: Date;

	switch (timeRange) {
		case "today":
			startDate = new Date(now);
			startDate.setHours(0, 0, 0, 0);
			break;
		case "month":
			startDate = subDays(now, 29);
			break;
		case "week":
		default:
			startDate = subDays(now, 6);
			break;
	}

	const endDate = now;

	const cacheKey = getPerformanceTrendsCacheKey(startDate, endDate, metric);
	return performanceCache.get(
		cacheKey,
		() => getPerformanceTrends(startDate, endDate, metric),
		15 * 60 * 1000
	); // 15 min cache
}

/**
 * Get critical alerts for executive dashboard
 */
export async function getExecutiveAlerts() {
	// Alert generation based on current KPI thresholds.
	const alerts = [];

	try {
		const todayKPIs = await getExecutiveDashboardKPIs("today");

		// High overtime alert
		if (todayKPIs.kpis.overtimePercentage > 15) {
			alerts.push({
				id: "high-overtime",
				type: "warning" as const,
				title: "High Overtime Detected",
				message: `Overtime rate is ${todayKPIs.kpis.overtimePercentage}% today`,
				priority: "medium" as const,
				timestamp: new Date(),
			});
		}

		// Low productivity alert
		if (todayKPIs.kpis.productivityRate < 10) {
			alerts.push({
				id: "low-productivity",
				type: "error" as const,
				title: "Low Productivity Alert",
				message: `Productivity rate is ${todayKPIs.kpis.productivityRate} units/hour`,
				priority: "high" as const,
				timestamp: new Date(),
			});
		}

		// High occupancy alert
		if (todayKPIs.kpis.occupancyLevel > 90) {
			alerts.push({
				id: "high-occupancy",
				type: "warning" as const,
				title: "High Occupancy Level",
				message: `${todayKPIs.kpis.occupancyLevel.toFixed(1)}% of capacity is in use`,
				priority: "medium" as const,
				timestamp: new Date(),
			});
		}

		// Cost variance alert
		if (Math.abs(todayKPIs.laborCost.variancePercentage) > 10) {
			alerts.push({
				id: "cost-variance",
				type: "info" as const,
				title: "Cost Variance Alert",
				message: `Labor cost is ${todayKPIs.laborCost.variancePercentage > 0 ? "over" : "under"} budget by ${Math.abs(todayKPIs.laborCost.variancePercentage)}%`,
				priority: "low" as const,
				timestamp: new Date(),
			});
		}
	} catch (error) {
		console.error("Error generating executive alerts:", error);
		// Return a default alert if calculation fails
		alerts.push({
			id: "data-error",
			type: "error" as const,
			title: "Data Calculation Error",
			message: "Unable to calculate some performance metrics",
			priority: "high" as const,
			timestamp: new Date(),
		});
	}

	return alerts.sort((a, b) => {
		const priorityOrder = { high: 3, medium: 2, low: 1 };
		return priorityOrder[b.priority] - priorityOrder[a.priority];
	});
}

/**
 * Force refresh dashboard cache
 */
export async function refreshDashboardCache(_formData: FormData) {
	"use server";
	const timeRanges = ["today", "week", "month"] as const;
	const metrics = ["productivity", "cost", "occupancy"] as const;

	// Invalidate all possible cache keys
	for (const timeRange of timeRanges) {
		await getExecutiveDashboardKPIs(timeRange);
		// These will refresh the cache through the get calls

		await getStationPerformanceData(timeRange);
	}

	for (const metric of metrics) {
		await getPerformanceTrendData(metric);
	}

	// Don't return anything for form actions
}
