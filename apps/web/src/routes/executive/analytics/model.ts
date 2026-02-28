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
	employeeProductivity: Awaited<
		ReturnType<typeof import("./actions").getEmployeeProductivityRanking>
	>;
	dashboardData: AnalyticsDashboardData;
	liveFloorData: LiveFloorData;
	comparativeData: Awaited<ReturnType<typeof import("./actions").getComparativeAnalyticsData>>;
};

export type AnalyticsLoadResult<T> = {
	data: T | null;
	error: string | null;
};

type ProductivityDisplays = {
	kpis: Promise<
		AnalyticsLoadResult<{
			benchmarkData: AnalyticsData["benchmarkData"];
			trendData: AnalyticsData["trendData"];
		}>
	>;
	charts: Promise<
		AnalyticsLoadResult<{
			productivityTrends: AnalyticsData["productivityTrends"];
			stationEfficiency: AnalyticsData["stationEfficiency"];
			taskTypeEfficiency: AnalyticsData["taskTypeEfficiency"];
			shiftProductivity: AnalyticsData["shiftProductivity"];
		}>
	>;
	stationCards: Promise<
		AnalyticsLoadResult<{ stationSnapshots: AnalyticsData["dashboardData"]["stations"] }>
	>;
	employeeTable: Promise<
		AnalyticsLoadResult<{
			employeeProductivity: AnalyticsData["employeeProductivity"];
			benchmarkData: AnalyticsData["benchmarkData"];
		}>
	>;
};

type LaborCostDisplays = {
	kpis: Promise<
		AnalyticsLoadResult<{
			costSummary: AnalyticsData["dashboardData"]["costSummary"];
		}>
	>;
	charts: Promise<
		AnalyticsLoadResult<{
			laborCostTrends: AnalyticsData["laborCostTrends"];
			shiftProductivity: AnalyticsData["shiftProductivity"];
			costBreakdown: AnalyticsData["costBreakdown"];
		}>
	>;
	stationTable: Promise<
		AnalyticsLoadResult<{
			stationSnapshots: AnalyticsData["dashboardData"]["stations"];
			benchmarkData: AnalyticsData["benchmarkData"];
		}>
	>;
};

type TrendsDisplays = {
	kpis: Promise<AnalyticsLoadResult<{ trendData: AnalyticsData["trendData"] }>>;
	charts: Promise<
		AnalyticsLoadResult<{
			productivityTrends: AnalyticsData["productivityTrends"];
			laborCostTrends: AnalyticsData["laborCostTrends"];
		}>
	>;
	anomalyTable: Promise<AnalyticsLoadResult<{ anomalyData: AnalyticsData["anomalyData"] }>>;
};

type CapacityDisplays = {
	kpis: Promise<AnalyticsLoadResult<{ capacityData: AnalyticsData["capacityData"] }>>;
	floor: Promise<
		AnalyticsLoadResult<{
			capacityData: AnalyticsData["capacityData"];
			liveFloorData: AnalyticsData["liveFloorData"];
		}>
	>;
};

type BenchmarkDisplays = {
	kpis: Promise<AnalyticsLoadResult<{ benchmarkData: AnalyticsData["benchmarkData"] }>>;
	charts: Promise<AnalyticsLoadResult<{ benchmarkData: AnalyticsData["benchmarkData"] }>>;
	stationTable: Promise<
		AnalyticsLoadResult<{
			stationSnapshots: AnalyticsData["dashboardData"]["stations"];
			benchmarkData: AnalyticsData["benchmarkData"];
		}>
	>;
};

export type AnalyticsSectionDisplayPromises = {
	productivity?: ProductivityDisplays;
	"labor-cost"?: LaborCostDisplays;
	trends?: TrendsDisplays;
	capacity?: CapacityDisplays;
	benchmarks?: BenchmarkDisplays;
};
