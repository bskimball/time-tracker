import type { Anomaly, ComparisonBasis } from "./actions";
import type { AnalyticsDashboardData, LiveFloorData } from "./types";

export type AnalyticsSection = "productivity" | "labor-cost" | "trends" | "capacity" | "benchmarks";
export type AnalyticsRange = "today" | "week" | "month" | "quarter";
export type AnalyticsComparison = ComparisonBasis;

export const DEFAULT_COMPARE: AnalyticsComparison = "previous-period";

export const COMPARISON_COMPATIBILITY: Record<AnalyticsRange, AnalyticsComparison[]> = {
	today: ["previous-period", "last-year"],
	week: ["previous-period", "last-year"],
	month: ["previous-period", "last-year", "rolling-30d"],
	quarter: ["previous-period", "last-year"],
};

export type AnalyticsData = {
	productivityTrends: Awaited<ReturnType<typeof import("./actions").getProductivityTrendData>>;
	laborCostTrends: Awaited<ReturnType<typeof import("./actions").getLaborCostTrendData>>;
	stationEfficiency: Awaited<ReturnType<typeof import("./actions").getStationEfficiencyData>>;
	costBreakdown: Awaited<ReturnType<typeof import("./actions").getCostBreakdownData>>;
	shiftProductivity: Awaited<ReturnType<typeof import("./actions").getShiftProductivityData>>;
	taskTypeEfficiency: Awaited<ReturnType<typeof import("./actions").getTaskTypeEfficiencyData>>;
	benchmarkData: Awaited<ReturnType<typeof import("./actions").getBenchmarkData>>;
	anomalyData: Anomaly[];
	capacityData: Awaited<ReturnType<typeof import("./actions").getCapacityUtilizationData>>;
	trendData: Awaited<ReturnType<typeof import("./actions").getTrendAnalysisData>>;
	employeeProductivity: Awaited<ReturnType<typeof import("./actions").getEmployeeProductivityRanking>>;
	dashboardData: AnalyticsDashboardData;
	liveFloorData: LiveFloorData;
	comparativeData: Awaited<ReturnType<typeof import("./actions").getComparativeAnalyticsData>>;
};
