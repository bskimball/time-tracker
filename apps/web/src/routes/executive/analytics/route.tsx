import { validateRequest } from "~/lib/auth";
import { getRequest } from "~/lib/request-context";
import { Suspense } from "react";
import { PageHeader } from "~/components/page-header";
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
import { AnalyticsClient } from "./analytics-dashboard";
import { SectionTabs } from "./section-tabs";
import { TimeRangeTabs } from "../time-range-tabs";
import { ComparisonTabs } from "./comparison-tabs";
import {
	COMPARISON_COMPATIBILITY,
	DEFAULT_COMPARE,
	type AnalyticsComparison,
	type AnalyticsData,
	type AnalyticsLoadResult,
	type AnalyticsRange,
	type AnalyticsSection,
	type AnalyticsSectionDisplayPromises,
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

function createSafePromise<T>(
	promise: Promise<T>,
	errorMessage: string
): Promise<AnalyticsLoadResult<T>> {
	return promise
		.then((data) => ({ data, error: null }))
		.catch((error: unknown) => {
			console.error(errorMessage, error);
			return {
				data: null,
				error: "Unable to load analytics data from the database right now.",
			};
		});
}

function buildSectionDisplayPromises({
	section,
	range,
}: {
	section: AnalyticsSection;
	range: AnalyticsRange;
}): AnalyticsSectionDisplayPromises {
	const dashboardDataPromise = fetchAnalyticsDashboardData();
	const benchmarkDataPromise = getBenchmarkData(range);
	const shiftProductivityPromise = getShiftProductivityData(range);

	switch (section) {
		case "productivity": {
			const trendDataPromise = getTrendAnalysisData(range);
			const productivityTrendsPromise = getProductivityTrendData(range);
			const stationEfficiencyPromise = getStationEfficiencyData(range);
			const taskTypeEfficiencyPromise = getTaskTypeEfficiencyData(range);
			const employeeProductivityPromise = getEmployeeProductivityRanking(range);

			return {
				productivity: {
					kpis: createSafePromise(
						Promise.all([benchmarkDataPromise, trendDataPromise]).then(
							([benchmarkData, trendData]) => ({ benchmarkData, trendData })
						),
						"Failed to load productivity KPI data"
					),
					charts: createSafePromise(
						Promise.all([
							productivityTrendsPromise,
							stationEfficiencyPromise,
							taskTypeEfficiencyPromise,
							shiftProductivityPromise,
						]).then(
							([
								productivityTrends,
								stationEfficiency,
								taskTypeEfficiency,
								shiftProductivity,
							]) => ({
								productivityTrends,
								stationEfficiency,
								taskTypeEfficiency,
								shiftProductivity,
							})
						),
						"Failed to load productivity chart data"
					),
					stationCards: createSafePromise(
						dashboardDataPromise.then((dashboardData) => ({
							stationSnapshots: dashboardData.stations,
						})),
						"Failed to load station performance cards"
					),
					employeeTable: createSafePromise(
						Promise.all([employeeProductivityPromise, benchmarkDataPromise]).then(
							([employeeProductivity, benchmarkData]) => ({
								employeeProductivity,
								benchmarkData,
							})
						),
						"Failed to load employee ranking table"
					),
				},
			};
		}
		case "labor-cost": {
			const laborCostTrendsPromise = getLaborCostTrendData(range);
			const costBreakdownPromise = getCostBreakdownData(range);

			return {
				"labor-cost": {
					kpis: createSafePromise(
						dashboardDataPromise.then((dashboardData) => ({
							costSummary: dashboardData.costSummary,
						})),
						"Failed to load labor cost KPI data"
					),
					charts: createSafePromise(
						Promise.all([
							laborCostTrendsPromise,
							shiftProductivityPromise,
							costBreakdownPromise,
						]).then(([laborCostTrends, shiftProductivity, costBreakdown]) => ({
							laborCostTrends,
							shiftProductivity,
							costBreakdown,
						})),
						"Failed to load labor cost chart data"
					),
					stationTable: createSafePromise(
						Promise.all([dashboardDataPromise, benchmarkDataPromise]).then(
							([dashboardData, benchmarkData]) => ({
								stationSnapshots: dashboardData.stations,
								benchmarkData,
							})
						),
						"Failed to load labor cost station table"
					),
				},
			};
		}
		case "trends": {
			const trendDataPromise = getTrendAnalysisData(range);
			const productivityTrendsPromise = getProductivityTrendData(range);
			const laborCostTrendsPromise = getLaborCostTrendData(range);
			const anomalyDataPromise = getAnomalyData(range);

			return {
				trends: {
					kpis: createSafePromise(
						trendDataPromise.then((trendData) => ({ trendData })),
						"Failed to load trend KPI data"
					),
					charts: createSafePromise(
						Promise.all([productivityTrendsPromise, laborCostTrendsPromise]).then(
							([productivityTrends, laborCostTrends]) => ({
								productivityTrends,
								laborCostTrends,
							})
						),
						"Failed to load trend chart data"
					),
					anomalyTable: createSafePromise(
						anomalyDataPromise.then((anomalyData) => ({ anomalyData })),
						"Failed to load anomaly table data"
					),
				},
			};
		}
		case "capacity": {
			const capacityDataPromise = getCapacityUtilizationData(range);
			const liveFloorDataPromise = fetchLiveFloorData();

			return {
				capacity: {
					kpis: createSafePromise(
						capacityDataPromise.then((capacityData) => ({ capacityData })),
						"Failed to load capacity KPI data"
					),
					floor: createSafePromise(
						Promise.all([capacityDataPromise, liveFloorDataPromise]).then(
							([capacityData, liveFloorData]) => ({ capacityData, liveFloorData })
						),
						"Failed to load warehouse floor data"
					),
				},
			};
		}
		case "benchmarks": {
			return {
				benchmarks: {
					kpis: createSafePromise(
						benchmarkDataPromise.then((benchmarkData) => ({ benchmarkData })),
						"Failed to load benchmark KPI data"
					),
					charts: createSafePromise(
						benchmarkDataPromise.then((benchmarkData) => ({ benchmarkData })),
						"Failed to load benchmark chart data"
					),
					stationTable: createSafePromise(
						Promise.all([dashboardDataPromise, benchmarkDataPromise]).then(
							([dashboardData, benchmarkData]) => ({
								stationSnapshots: dashboardData.stations,
								benchmarkData,
							})
						),
						"Failed to load benchmark station table"
					),
				},
			};
		}
	}
}

export default async function Component() {
	const authPromise = validateRequest();

	const request = getRequest();
	const searchParams = request ? new URL(request.url).searchParams : new URLSearchParams();

	const section = parseSection(searchParams.get("section"));
	const range = parseRange(searchParams.get("range"));
	const rawCompare = parseComparison(searchParams.get("compare"));
	const validComparisons = COMPARISON_COMPATIBILITY[range];
	const compareBasis = validComparisons.includes(rawCompare) ? rawCompare : DEFAULT_COMPARE;

	const comparativeDataPromise = getComparativeAnalyticsData(range, compareBasis);
	const displays = buildSectionDisplayPromises({ section, range });

	await authPromise;

	return (
		<div className="space-y-8 pb-12">
			<PageHeader
				title="Analytics & Reporting"
				subtitle="Comprehensive workforce productivity, financial metrics, and operational insights"
			/>

			<div className="-mx-4 mb-6 border-b border-border px-4 pt-2 sm:mx-0 sm:px-0">
				<SectionTabs />

				<div className="flex flex-col gap-4 py-3 lg:flex-row lg:items-center lg:justify-between">
					<div className="flex flex-col gap-4 sm:flex-row sm:items-center">
						<div className="flex items-center gap-3">
							<span className="shrink-0 text-[10px] font-bold font-industrial uppercase tracking-widest text-muted-foreground/60">
								Period
							</span>
							<TimeRangeTabs />
						</div>

						<div className="mx-2 hidden h-4 w-px bg-border/50 sm:block" />

						<div className="flex items-center gap-3">
							<span className="shrink-0 text-[10px] font-bold font-industrial uppercase tracking-widest text-muted-foreground/60">
								Comparison
							</span>
							<ComparisonTabs availableOptions={validComparisons} />
						</div>
					</div>

					<div className="flex items-center justify-end">
						<Suspense fallback={<ComparisonWindowFallback />}>
							<ComparisonWindowStatus comparativeDataPromise={comparativeDataPromise} />
						</Suspense>
					</div>
				</div>
			</div>

			<AnalyticsClient
				section={section}
				range={range}
				compare={compareBasis}
				displays={displays}
			/>
		</div>
	);
}

async function ComparisonWindowStatus({
	comparativeDataPromise,
}: {
	comparativeDataPromise: Promise<AnalyticsData["comparativeData"]>;
}) {
	const comparativeData = await comparativeDataPromise;
	const currentWindowLabel = `${new Date(comparativeData.currentWindow.start).toLocaleDateString()} - ${new Date(comparativeData.currentWindow.end).toLocaleDateString()}`;
	const comparisonWindowLabel = `${new Date(comparativeData.comparisonWindow.start).toLocaleDateString()} - ${new Date(comparativeData.comparisonWindow.end).toLocaleDateString()}`;

	return (
		<div className="flex items-center gap-3 rounded-[2px] border border-border/40 bg-muted/10 px-3 py-1.5">
			<div className="flex items-center gap-2 border-r border-border/40 pr-3">
				<span className="relative flex h-1.5 w-1.5">
					<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
					<span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
				</span>
				<span className="text-[10px] font-bold font-industrial uppercase tracking-widest text-muted-foreground">
					Active
				</span>
			</div>
			<div className="flex flex-col gap-1 text-[10px] font-mono leading-none sm:flex-row sm:items-center sm:gap-2">
				<span className="font-semibold text-foreground">{currentWindowLabel}</span>
				<span className="hidden text-muted-foreground/40 sm:inline">/</span>
				<span className="text-muted-foreground">{comparisonWindowLabel}</span>
			</div>
		</div>
	);
}

function ComparisonWindowFallback() {
	return (
		<div className="flex items-center gap-3 rounded-[2px] border border-border/40 bg-muted/10 px-3 py-1.5">
			<div className="h-2 w-2 animate-pulse rounded-full bg-muted-foreground/60" />
			<div className="h-4 w-48 animate-pulse rounded-[2px] bg-muted/40" />
		</div>
	);
}
