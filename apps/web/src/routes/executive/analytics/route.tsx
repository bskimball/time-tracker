import { validateRequest } from "~/lib/auth";
import { getRequest } from "~/lib/request-context";
import {
	fetchAnalyticsDashboardData,
	fetchLiveFloorData,
	getAnomalyData,
	getBenchmarkData,
	getCapacityUtilizationData,
	getComparativeAnalyticsData,
	getCostBreakdownData,
	getEmployeeProductivityRanking,
	getLaborCostTrendData,
	getProductivityTrendData,
	getShiftProductivityData,
	getStationEfficiencyData,
	getTaskTypeEfficiencyData,
	getTrendAnalysisData,
} from "./actions";
import { AnalyticsClient } from "./client";
import {
	COMPARISON_COMPATIBILITY,
	DEFAULT_COMPARE,
	type AnalyticsComparison,
	type AnalyticsData,
	type AnalyticsRange,
	type AnalyticsSection,
} from "./model";

const analyticsSections = new Set<AnalyticsSection>([
	"productivity",
	"labor-cost",
	"trends",
	"capacity",
	"benchmarks",
]);

const analyticsRanges = new Set<AnalyticsRange>(["today", "week", "month", "quarter"]);
const analyticsComparisons = new Set<AnalyticsComparison>([
	"previous-period",
	"last-year",
	"rolling-30d",
]);

function parseSection(value: string | null): AnalyticsSection {
	if (value && analyticsSections.has(value as AnalyticsSection)) {
		return value as AnalyticsSection;
	}

	return "productivity";
}

function parseRange(value: string | null): AnalyticsRange {
	if (value && analyticsRanges.has(value as AnalyticsRange)) {
		return value as AnalyticsRange;
	}

	return "week";
}

function parseComparison(value: string | null): AnalyticsComparison {
	if (value && analyticsComparisons.has(value as AnalyticsComparison)) {
		return value as AnalyticsComparison;
	}

	return DEFAULT_COMPARE;
}

export default async function Component() {
	await validateRequest();

	const request = getRequest();
	const searchParams = request ? new URL(request.url).searchParams : new URLSearchParams();

	const section = parseSection(searchParams.get("section"));
	const range = parseRange(searchParams.get("range"));
	const rawCompare = parseComparison(searchParams.get("compare"));
	const validComparisons = COMPARISON_COMPATIBILITY[range];
	const compareBasis = validComparisons.includes(rawCompare) ? rawCompare : DEFAULT_COMPARE;

	let data: AnalyticsData | null = null;
	let errorMessage: string | null = null;

	try {
		const [
			productivityTrends,
			laborCostTrends,
			stationEfficiency,
			costBreakdown,
			shiftProductivity,
			taskTypeEfficiency,
			benchmarkData,
			anomalyData,
			capacityData,
			trendData,
			employeeProductivity,
			dashboardData,
			liveFloorData,
			comparativeData,
		] = await Promise.all([
			getProductivityTrendData(range),
			getLaborCostTrendData(range),
			getStationEfficiencyData(range),
			getCostBreakdownData(range),
			getShiftProductivityData(range),
			getTaskTypeEfficiencyData(range),
			getBenchmarkData(range),
			getAnomalyData(range),
			getCapacityUtilizationData(range),
			getTrendAnalysisData(range),
			getEmployeeProductivityRanking(range),
			fetchAnalyticsDashboardData(),
			fetchLiveFloorData(),
			getComparativeAnalyticsData(range, compareBasis),
		]);

		data = {
			productivityTrends,
			laborCostTrends,
			stationEfficiency,
			costBreakdown,
			shiftProductivity,
			taskTypeEfficiency,
			benchmarkData,
			anomalyData,
			capacityData,
			trendData,
			employeeProductivity,
			dashboardData,
			liveFloorData,
			comparativeData,
		};
	} catch (error) {
		console.error("Failed to load analytics data:", error);
		errorMessage = "Unable to load analytics data from the database right now.";
	}

	return (
		<AnalyticsClient
			section={section}
			validComparisons={validComparisons}
			data={data}
			error={errorMessage}
		/>
	);
}
