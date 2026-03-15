import { validateRequest } from "~/lib/auth";
import { getRequest } from "~/lib/request-context";
import { Suspense } from "react";
import { PageHeader } from "~/components/page-header";
import {
	fetchAnalyticsDashboardData,
	fetchLiveFloorData,
	getAnomalyData,
	getBenchmarkData,
	getCapacityComparisonData,
	getCapacityUtilizationData,
	getComparativeAnalyticsData,
	getStationBenchmarkComparisonData,
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
	getAnalyticsComparisonLabel,
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
	compare,
}: {
	section: AnalyticsSection;
	range: AnalyticsRange;
	compare: AnalyticsComparison;
}): AnalyticsSectionDisplayPromises {
	const dashboardDataPromise = fetchAnalyticsDashboardData(range, compare);
	const benchmarkDataPromise = getBenchmarkData(range, compare);
	const shiftProductivityPromise = getShiftProductivityData(range, compare);

	switch (section) {
		case "productivity": {
			const trendDataPromise = getTrendAnalysisData(range, compare);
			const productivityTrendsPromise = getProductivityTrendData(range, compare);
			const stationEfficiencyPromise = getStationEfficiencyData(range, compare);
			const taskTypeEfficiencyPromise = getTaskTypeEfficiencyData(range, compare);
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
							([productivityTrends, stationEfficiency, taskTypeEfficiency, shiftProductivity]) => ({
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
			const laborCostTrendsPromise = getLaborCostTrendData(range, compare);
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
			const trendDataPromise = getTrendAnalysisData(range, compare);
			const productivityTrendsPromise = getProductivityTrendData(range, compare);
			const laborCostTrendsPromise = getLaborCostTrendData(range, compare);
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
			const capacityComparisonDataPromise = getCapacityComparisonData(range, compare);
			const liveFloorDataPromise = fetchLiveFloorData();

			return {
				capacity: {
					kpis: createSafePromise(
						capacityComparisonDataPromise.then((capacityComparisonData) => ({
							capacityComparisonData,
						})),
						"Failed to load capacity KPI data"
					),
					floor: createSafePromise(
						Promise.all([
							capacityDataPromise,
							capacityComparisonDataPromise,
							liveFloorDataPromise,
						]).then(([capacityData, capacityComparisonData, liveFloorData]) => ({
							capacityData,
							capacityComparisonData,
							liveFloorData,
						})),
						"Failed to load warehouse floor data"
					),
				},
			};
		}
		case "benchmarks": {
			const stationBenchmarkComparisonPromise = getStationBenchmarkComparisonData(range, compare);

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
						Promise.all([benchmarkDataPromise, stationBenchmarkComparisonPromise]).then(
							([benchmarkData, stationBenchmarkComparison]) => ({
								stationBenchmarkComparison,
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
	const sectionLabels = {
		productivity: "Productivity",
		"labor-cost": "Labor Costs",
		trends: "Trends",
		capacity: "Capacity",
		benchmarks: "Benchmarks",
	} satisfies Record<AnalyticsSection, string>;
	const activeSectionLabel = sectionLabels[section];

	const comparativeDataPromise = getComparativeAnalyticsData(range, compareBasis);
	const displays = buildSectionDisplayPromises({ section, range, compare: compareBasis });

	await authPromise;

	return (
		<div className="space-y-8 pb-12">
			<PageHeader
				title="Analytics & Reporting"
				subtitle="Comprehensive workforce productivity, financial metrics, and operational insights"
			/>

			<div className="-mx-4 mb-8 px-4 pt-2 sm:mx-0 sm:px-0">
				<div className="overflow-hidden rounded-[2px] border border-border/60 bg-card/80 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.1)]">
					<div className="relative border-b border-border/50 bg-muted/20 px-4 py-4 sm:px-5">
						<div className="absolute left-0 top-0 h-0.5 w-full bg-gradient-to-r from-primary/50 via-primary/10 to-transparent" />
						<div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
							<div className="flex items-center gap-4">
								<div className="flex items-center gap-2.5">
									<div className="grid grid-cols-2 gap-[2px] opacity-40">
										<div className="h-1 w-1 bg-foreground" />
										<div className="h-1 w-1 bg-foreground" />
										<div className="h-1 w-1 bg-foreground" />
										<div className="h-1 w-1 bg-foreground" />
									</div>
									<div className="text-[10px] font-bold font-industrial uppercase tracking-[0.25em] text-foreground/80">
										Navigation Matrix
									</div>
								</div>
								<div className="hidden h-3 w-px bg-border/80 sm:block" />
								<div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
									Mode Select
								</div>
							</div>
						</div>
						<SectionTabs />
					</div>

					<div className="grid gap-3 p-4 sm:p-4 xl:grid-cols-[minmax(0,0.85fr)_minmax(0,0.85fr)_minmax(0,1.3fr)]">
						<div className="rounded-[2px] border border-border/50 bg-background/80 p-3">
							<div className="mb-2 flex items-center justify-between gap-3">
								<div className="text-[10px] font-bold font-industrial uppercase tracking-[0.18em] text-foreground/60 dark:text-muted-foreground">
									Period Window
								</div>
								<div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
									Range
								</div>
							</div>
							<TimeRangeTabs className="w-full" />
						</div>

						<div className="rounded-[2px] border border-border/50 bg-background/80 p-3">
							<div className="mb-2 flex items-center justify-between gap-3">
								<div className="text-[10px] font-bold font-industrial uppercase tracking-[0.18em] text-foreground/60 dark:text-muted-foreground">
									Baseline Selector
								</div>
								<div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
									Compare
								</div>
							</div>
							<ComparisonTabs availableOptions={validComparisons} className="w-full" />
						</div>

						<Suspense fallback={<ComparisonWindowFallback />}>
							<ComparisonSummaryBand
								compareBasis={compareBasis}
								comparativeDataPromise={comparativeDataPromise}
							/>
						</Suspense>
					</div>
				</div>
			</div>

			<div
				id={`analytics-section-${section}`}
				role="tabpanel"
				aria-label={`${activeSectionLabel} analytics`}
			>
				<AnalyticsClient
					section={section}
					range={range}
					compare={compareBasis}
					displays={displays}
				/>
			</div>
		</div>
	);
}

async function ComparisonSummaryBand({
	compareBasis,
	comparativeDataPromise,
}: {
	compareBasis: AnalyticsComparison;
	comparativeDataPromise: Promise<AnalyticsData["comparativeData"]>;
}) {
	const comparativeData = await comparativeDataPromise;
	const formatter = new Intl.DateTimeFormat(undefined, {
		month: "short",
		day: "numeric",
		year: "numeric",
	});
	const currentWindowLabel = `${formatter.format(new Date(comparativeData.currentWindow.start))} - ${formatter.format(new Date(comparativeData.currentWindow.end))}`;
	const comparisonWindowLabel = `${formatter.format(new Date(comparativeData.comparisonWindow.start))} - ${formatter.format(new Date(comparativeData.comparisonWindow.end))}`;
	const summaryItems = [
		{
			label: "Productivity",
			value: `${comparativeData.summary.productivity.changePercent > 0 ? "+" : ""}${comparativeData.summary.productivity.changePercent}%`,
			positive: comparativeData.summary.productivity.changePercent >= 0,
		},
		{
			label: "Cost / Unit",
			value: `${comparativeData.summary.costPerUnit.changePercent > 0 ? "+" : ""}${comparativeData.summary.costPerUnit.changePercent}%`,
			positive: comparativeData.summary.costPerUnit.changePercent <= 0,
		},
		{
			label: "Throughput",
			value: `${comparativeData.summary.throughput.changePercent > 0 ? "+" : ""}${comparativeData.summary.throughput.changePercent}%`,
			positive: comparativeData.summary.throughput.changePercent >= 0,
		},
	];

	return (
		<div className="group relative overflow-hidden rounded-[2px] border border-border/60 bg-card/80 p-3 shadow-[0_4px_12px_-6px_rgba(0,0,0,0.1)] transition-all duration-300 hover:shadow-[0_6px_16px_-6px_rgba(0,0,0,0.15)]">
			<div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-border/50 via-border/10 to-transparent" />
			<div className="flex flex-wrap items-start justify-between gap-3">
				<div className="min-w-0">
					<div className="flex flex-wrap items-center gap-2">
						<span className="inline-flex items-center gap-2 rounded-sm border border-border/60 bg-background/40 px-2.5 py-1 text-[10px] font-bold font-industrial uppercase tracking-[0.18em] text-foreground/80 shadow-[inset_0_1px_4px_rgba(0,0,0,0.05)]">
							<span className="relative flex h-1.5 w-1.5 items-center justify-center">
								<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
								<span className="relative inline-flex h-1 w-1 rounded-full bg-primary" />
							</span>
							{getAnalyticsComparisonLabel(compareBasis)}
						</span>
						<span className="text-xs font-bold font-industrial uppercase tracking-[0.15em] text-foreground">
							Comparison Summary
						</span>
					</div>
					<div className="mt-3 flex items-center gap-3 text-[10px] font-mono text-muted-foreground">
						<div className="flex items-center gap-1.5">
							<div className="h-1 w-1 rounded-full bg-primary" />
							<span className="text-foreground">Current</span> {currentWindowLabel}
						</div>
						<div className="h-3 w-px bg-border/60" />
						<div className="flex items-center gap-1.5">
							<div className="h-1 w-1 rounded-full bg-muted-foreground/50" />
							<span className="text-foreground">Baseline</span> {comparisonWindowLabel}
						</div>
					</div>
				</div>
				<div className="flex flex-col items-end">
					<div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
						Core Deltas
					</div>
					<div className="mt-2 flex gap-[2px] opacity-20 group-hover:opacity-40 transition-opacity">
						<div className="h-1 w-1 rounded-full bg-foreground" />
						<div className="h-1 w-1 rounded-full bg-foreground" />
						<div className="h-1 w-1 rounded-full bg-foreground" />
					</div>
				</div>
			</div>

			<div className="relative mt-4 grid grid-cols-1 gap-2 rounded-[2px] bg-background/50 p-2 shadow-[inset_0_2px_12px_rgba(0,0,0,0.15)] ring-1 ring-inset ring-border/40 sm:grid-cols-3">
				<div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/20 pointer-events-none" />
				{summaryItems.map((item, index) => (
					<div
						key={item.label}
						className={`relative z-10 flex flex-col justify-between rounded-[2px] border border-border/40 bg-card/60 p-3 transition-colors duration-300 hover:bg-card/90 hover:border-border/60 ${
							index > 0 ? "sm:border-l sm:border-l-border/30" : ""
						}`}
					>
						<div className="text-[9px] font-bold font-industrial uppercase tracking-[0.2em] text-muted-foreground">
							{item.label}
						</div>
						<div
							className={`mt-2 text-lg font-mono font-bold tracking-tight drop-shadow-sm ${
								item.positive ? "text-primary" : "text-destructive"
							}`}
						>
							{item.value}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

function ComparisonWindowFallback() {
	return <div className="h-20 animate-pulse rounded-[2px] border border-border/40 bg-muted/20" />;
}
