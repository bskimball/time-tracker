"use client";

import {
	Badge,
	Button,
	Card,
	CardBody,
	CardHeader,
	CardTitle,
	Metric,
} from "@monorepo/design-system";
import { createContext, Suspense, use, useContext, useMemo } from "react";
import type { ReactNode } from "react";
import {
	ProductivityKpiRowSkeleton,
	ProductivityChartsSkeleton,
	ProductivityStationCardsSkeleton,
	ProductivityEmployeeTableSkeleton,
	LaborCostKpiRowSkeleton,
	LaborCostChartsSkeleton,
	LaborCostStationTableSkeleton,
	TrendKpisSkeleton,
	TrendChartsSkeleton,
	TrendAnomalyTableSkeleton,
	CapacityKpisSkeleton,
	CapacityFloorSkeleton,
	BenchmarkKpisSkeleton,
	BenchmarkChartsSkeleton,
	BenchmarkStationTableSkeleton,
} from "./skeletons";
import { KPICard } from "~/routes/executive/kpi-card";
import { BarChart, LineChart, PieChart } from "~/routes/executive/charts";
import WarehouseFloor from "./components/WarehouseFloor";
import type { AnalyticsStationOverview } from "./types";
import { getAnalyticsComparisonLabel } from "./model";
import type {
	AnalyticsData,
	AnalyticsComparison,
	AnalyticsRange,
	AnalyticsSection,
	AnalyticsSectionDisplayPromises,
} from "./model";

type AnalyticsDisplayCacheStore = Map<string, unknown>;

function createAnalyticsDisplayCacheStore(_scope: string): AnalyticsDisplayCacheStore {
	return new Map();
}

type AnalyticsDisplayCacheContextValue = {
	cacheStore: AnalyticsDisplayCacheStore;
	sectionCacheKey: string;
};

const AnalyticsDisplayCacheContext = createContext<AnalyticsDisplayCacheContextValue | null>(null);

function useCachedDisplay<T>(slot: string, promise: Promise<T>): T {
	const context = useContext(AnalyticsDisplayCacheContext);

	if (!context) {
		throw new Error("Analytics display cache context is missing.");
	}

	const key = `${context.sectionCacheKey}:${slot}`;
	if (context.cacheStore.has(key)) {
		return context.cacheStore.get(key) as T;
	}

	const resolved = use(promise);
	context.cacheStore.set(key, resolved);

	return resolved;
}

function useCachedDisplayState<T>(
	slot: string,
	promise: Promise<T>
): { data: T; isCached: boolean } {
	const context = useContext(AnalyticsDisplayCacheContext);

	if (!context) {
		throw new Error("Analytics display cache context is missing.");
	}

	const key = `${context.sectionCacheKey}:${slot}`;
	if (context.cacheStore.has(key)) {
		return { data: context.cacheStore.get(key) as T, isCached: true };
	}

	const resolved = use(promise);
	context.cacheStore.set(key, resolved);

	return { data: resolved, isCached: false };
}

function toMetricTrendDirection(value: string): "up" | "down" | "neutral" {
	if (value === "up" || value === "down" || value === "neutral") {
		return value;
	}

	return "neutral";
}

function getComparisonTrendLabel(compare: AnalyticsComparison) {
	return `vs ${getAnalyticsComparisonLabel(compare).toLowerCase()}`;
}

function getCostTrendDirection(changePercent: number): "up" | "down" | "neutral" {
	if (changePercent === 0) return "neutral";
	return changePercent < 0 ? "up" : "down";
}

const wholeCurrencyFormatter = new Intl.NumberFormat(undefined, {
	style: "currency",
	currency: "USD",
	maximumFractionDigits: 0,
});

const preciseCurrencyFormatter = new Intl.NumberFormat(undefined, {
	style: "currency",
	currency: "USD",
	minimumFractionDigits: 2,
	maximumFractionDigits: 2,
});

const compactNumberFormatter = new Intl.NumberFormat(undefined, {
	minimumFractionDigits: 0,
	maximumFractionDigits: 1,
});

function formatSignedNumber(value: number, suffix = "", fractionDigits = 1) {
	const formatter = new Intl.NumberFormat(undefined, {
		minimumFractionDigits: fractionDigits,
		maximumFractionDigits: fractionDigits,
	});
	const absolute = formatter.format(Math.abs(value));
	const sign = value > 0 ? "+" : value < 0 ? "-" : "";
	return `${sign}${absolute}${suffix}`;
}

function formatSignedCurrency(value: number, precise = false) {
	const formatter = precise ? preciseCurrencyFormatter : wholeCurrencyFormatter;
	const sign = value > 0 ? "+" : value < 0 ? "-" : "";
	return `${sign}${formatter.format(Math.abs(value))}`;
}

function getPositiveDirection(delta: number): "up" | "down" | "neutral" {
	if (delta === 0) return "neutral";
	return delta > 0 ? "up" : "down";
}

function getInverseDirection(delta: number): "up" | "down" | "neutral" {
	if (delta === 0) return "neutral";
	return delta < 0 ? "up" : "down";
}

export function getStaffShortageTrend(staffShortage: number): {
	direction: "up" | "down" | "neutral";
	value: string;
	label: string;
} {
	if (staffShortage <= 0) {
		return { direction: "neutral", value: "On Target", label: "No shortage" };
	}

	if (staffShortage <= 2) {
		return { direction: "neutral", value: "Watch", label: "Minor gap" };
	}

	return { direction: "down", value: "Critical", label: "Impact High" };
}

export function HardwareCardHeader({
	title,
	subtitle,
	rightElement,
}: {
	title: ReactNode;
	subtitle?: ReactNode;
	rightElement?: ReactNode;
}) {
	return (
		<CardHeader className="relative border-b-2 border-border/80 bg-muted/20 py-3 px-4 z-10">
			<div className="absolute inset-0 bg-noise opacity-[0.25] pointer-events-none mix-blend-overlay" />
			<div className="flex items-start justify-between gap-3 relative z-10">
				<div>
					<div className="flex items-center gap-3">
						<div className="grid grid-cols-2 gap-[2px] opacity-30 mt-0.5">
							<div className="h-[3px] w-[3px] bg-foreground rounded-none" />
							<div className="h-[3px] w-[3px] bg-foreground rounded-none" />
							<div className="h-[3px] w-[3px] bg-foreground rounded-none" />
							<div className="h-[3px] w-[3px] bg-foreground rounded-none" />
						</div>
						<CardTitle className="uppercase tracking-[0.18em] font-mono text-[10px] text-muted-foreground font-bold">
							{title}
						</CardTitle>
					</div>
					{subtitle && (
						<div className="mt-1 ml-6 text-[10px] font-mono tracking-wide text-muted-foreground">
							{subtitle}
						</div>
					)}
				</div>
				{rightElement ? (
					rightElement
				) : (
					<div className="flex gap-1 opacity-20 mt-1">
						<div className="h-[2px] w-4 bg-foreground" />
						<div className="h-[2px] w-2 bg-foreground" />
					</div>
				)}
			</div>
		</CardHeader>
	);
}

interface AnalyticsClientProps {
	section: AnalyticsSection;
	range: AnalyticsRange;
	compare: AnalyticsComparison;
	displays: AnalyticsSectionDisplayPromises;
}

export function AnalyticsClient({ section, range, compare, displays }: AnalyticsClientProps) {
	const cacheScope = `${range}:${compare}`;
	const cacheStore = useMemo<AnalyticsDisplayCacheStore>(
		() => createAnalyticsDisplayCacheStore(cacheScope),
		[cacheScope]
	);

	const sectionCacheKey = `${cacheScope}:${section}`;
	const providerValue = useMemo(
		() => ({ cacheStore, sectionCacheKey }),
		[cacheStore, sectionCacheKey]
	);
	const withCache = (content: ReactNode) => (
		<AnalyticsDisplayCacheContext.Provider value={providerValue}>
			{content}
		</AnalyticsDisplayCacheContext.Provider>
	);

	if (section === "productivity") {
		if (!displays.productivity) {
			return <AnalyticsErrorCard message="No productivity analytics data available." />;
		}

		return withCache(<ProductivitySection displays={displays.productivity} compare={compare} />);
	}

	if (section === "labor-cost") {
		if (!displays["labor-cost"]) {
			return <AnalyticsErrorCard message="No labor cost analytics data available." />;
		}

		return withCache(<LaborCostSection displays={displays["labor-cost"]} compare={compare} />);
	}

	if (section === "trends") {
		if (!displays.trends) {
			return <AnalyticsErrorCard message="No trend analytics data available." />;
		}

		return withCache(<TrendsSection displays={displays.trends} compare={compare} />);
	}

	if (section === "capacity") {
		if (!displays.capacity) {
			return <AnalyticsErrorCard message="No capacity analytics data available." />;
		}

		return withCache(<CapacitySection displays={displays.capacity} compare={compare} />);
	}

	if (!displays.benchmarks) {
		return <AnalyticsErrorCard message="No benchmark analytics data available." />;
	}

	return withCache(<BenchmarksSection displays={displays.benchmarks} compare={compare} />);
}

function ProductivitySection({
	displays,
	compare,
}: {
	displays: NonNullable<AnalyticsSectionDisplayPromises["productivity"]>;
	compare: AnalyticsComparison;
}) {
	return (
		<div className="space-y-6">
			<Suspense fallback={<ProductivityKpiRowSkeleton />}>
				<ProductivityKpiRow promise={displays.kpis} compare={compare} />
			</Suspense>

			<Suspense fallback={<ProductivityChartsSkeleton />}>
				<ProductivityCharts promise={displays.charts} compare={compare} />
			</Suspense>

			<Suspense fallback={<ProductivityStationCardsSkeleton />}>
				<ProductivityStationCards promise={displays.stationCards} />
			</Suspense>

			<Suspense fallback={<ProductivityEmployeeTableSkeleton />}>
				<ProductivityEmployeeTable promise={displays.employeeTable} />
			</Suspense>
		</div>
	);
}

function ProductivityKpiRow({
	promise,
	compare,
}: {
	promise: NonNullable<AnalyticsSectionDisplayPromises["productivity"]>["kpis"];
	compare: AnalyticsComparison;
}) {
	const { data: result, isCached } = useCachedDisplayState("kpis", promise);
	if (result.error || !result.data) {
		return <AnalyticsErrorCard message={result.error ?? "Unable to load productivity KPIs."} />;
	}

	const { benchmarkData, trendData } = result.data;
	const comparisonTrendLabel = getComparisonTrendLabel(compare);

	return (
		<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
			<KPICard
				title="Avg Units/Hour"
				value={benchmarkData.productivity.current}
				subtitle="Current Period Average"
				icon="chart"
				animateCountUp={!isCached}
				trend={{
					direction:
						trendData.productivity.changePercent > 0
							? "up"
							: trendData.productivity.changePercent < 0
								? "down"
								: "neutral",
					value: `${trendData.productivity.changePercent > 0 ? "+" : ""}${trendData.productivity.changePercent}%`,
					label: comparisonTrendLabel,
				}}
			/>
			<KPICard
				title="Top Performer"
				value={`${benchmarkData.productivity.top10Percent} u/h`}
				subtitle="98th Percentile"
				icon="award"
				animateCountUp={!isCached}
				trend={{ direction: "up", value: "Top 10%", label: "Industry Benchmark" }}
			/>
			<KPICard
				title="Task Completion"
				value={`${benchmarkData.quality.current}%`}
				subtitle="On-Time Rate"
				icon="percent"
				animateCountUp={!isCached}
				trend={{ direction: "neutral", value: "95%", label: "Target" }}
			/>
			<Card className="h-full border-2 border-destructive bg-card overflow-hidden relative">
				<div className="absolute inset-0 bg-noise opacity-[0.25] pointer-events-none mix-blend-overlay z-0" />
				<div className="absolute top-0 right-0 p-2 z-10">
					<div className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
				</div>
				<CardBody className="flex h-full flex-col justify-between p-5 relative z-10">
					<div>
						<div className="mb-2 text-[10px] font-mono font-bold uppercase tracking-widest text-destructive">
							Bottleneck Alert
						</div>
						<div className="font-display text-3xl font-black tracking-tight text-foreground uppercase">
							RECEIVING
						</div>
						<div className="mt-1 text-xs font-mono font-bold text-muted-foreground uppercase tracking-wider">
							45% Utilization
						</div>
					</div>
					<div className="mt-4 border-t-2 border-border/80 pt-3 flex items-center justify-between">
						<div className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-widest text-destructive">
							<span className="h-1 w-4 bg-destructive" />
							Action Required
						</div>
					</div>
				</CardBody>
			</Card>
		</div>
	);
}

function ProductivityCharts({
	promise,
	compare,
}: {
	promise: NonNullable<AnalyticsSectionDisplayPromises["productivity"]>["charts"];
	compare: AnalyticsComparison;
}) {
	const result = useCachedDisplay("charts", promise);
	if (result.error || !result.data) {
		return <AnalyticsErrorCard message={result.error ?? "Unable to load productivity charts."} />;
	}

	const { productivityTrends, stationEfficiency, taskTypeEfficiency, shiftProductivity } =
		result.data;
	const comparisonLabel = getAnalyticsComparisonLabel(compare);

	return (
		<>
			<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
				<LineChart
					title={`Productivity Trend vs ${comparisonLabel}`}
					data={productivityTrends}
					height={320}
				/>
				<BarChart
					title={`Station Efficiency vs ${comparisonLabel}`}
					data={stationEfficiency}
					height={320}
				/>
			</div>

			<div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
				<BarChart
					title={`Task Type Efficiency vs ${comparisonLabel}`}
					data={taskTypeEfficiency}
					height={320}
				/>
				<BarChart
					title={`Shift Productivity vs ${comparisonLabel}`}
					data={shiftProductivity}
					height={320}
				/>
			</div>
		</>
	);
}

function ProductivityStationCards({
	promise,
}: {
	promise: NonNullable<AnalyticsSectionDisplayPromises["productivity"]>["stationCards"];
}) {
	const result = useCachedDisplay("station-cards", promise);
	if (result.error || !result.data) {
		return <AnalyticsErrorCard message={result.error ?? "Unable to load station cards."} />;
	}

	const { stationSnapshots } = result.data;

	return (
		<div>
			<h3 className="mb-4 text-sm font-bold font-industrial uppercase tracking-widest text-muted-foreground">
				Station Performance Breakdown
			</h3>
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
				{stationSnapshots.map((station: AnalyticsStationOverview) => (
					<Card
						key={station.name}
						className="overflow-hidden bg-card/80 shadow-[0_4px_12px_-6px_rgba(0,0,0,0.1)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_6px_16px_-6px_rgba(0,0,0,0.15)] ring-1 ring-inset ring-border/40"
					>
						<CardHeader className="relative border-b border-border/50 bg-muted/20 py-2.5 px-3">
							<div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-border/40 to-transparent" />
							<div className="flex items-center justify-between">
								<CardTitle className="text-xs font-bold font-industrial uppercase tracking-[0.15em] text-muted-foreground/90">
									{station.name}
								</CardTitle>
								<div className="flex items-center gap-2">
									<div className="grid grid-cols-2 gap-[2px] opacity-20">
										<div className="h-[2px] w-[2px] bg-foreground" />
										<div className="h-[2px] w-[2px] bg-foreground" />
										<div className="h-[2px] w-[2px] bg-foreground" />
										<div className="h-[2px] w-[2px] bg-foreground" />
									</div>
									<div
										className={`h-2 w-2 ${
											station.occupancy > 85
												? "bg-destructive animate-pulse"
												: station.occupancy > 70
													? "bg-primary"
													: "bg-secondary"
										}`}
									/>
								</div>
							</div>
						</CardHeader>
						<CardBody className="relative space-y-3 p-4">
							<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-background/15 to-transparent pointer-events-none" />
							<div className="relative z-10 grid grid-cols-2 gap-2">
								<div className="border border-primary/20 bg-background/50 p-2">
									<div className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
										Eff.
									</div>
									<div className="mt-1 text-lg font-mono font-bold text-foreground/90">
										{station.efficiency}
									</div>
								</div>
								<div className="border border-primary/20 bg-background/50 p-2">
									<div className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
										Occ.
									</div>
									<div className="mt-1 text-lg font-mono font-bold text-foreground/90">
										{station.occupancy}%
									</div>
								</div>
							</div>
							<div className="relative z-10 h-2 w-full overflow-hidden border border-primary/30 bg-background/50">
								<div
									className={`h-full ${
										station.efficiency > 30
											? "bg-primary"
											: station.efficiency > 20
												? "bg-secondary"
												: "bg-destructive animate-pulse"
									}`}
									style={{ width: `${Math.min(station.efficiency * 2, 100)}%` }}
								/>
							</div>
							<div className="relative z-10 flex items-center justify-between text-[10px] font-mono font-medium text-muted-foreground">
								<span className="flex items-center gap-1.5 font-bold">
									<span className="h-1 w-1 bg-muted-foreground/50" />
									{station.employees} Staff
								</span>
								<span
									className={`inline-flex items-center px-1.5 py-0.5 border text-[9px] font-bold uppercase tracking-wider ${
										station.occupancy < 60
											? "border-warning/50 text-warning bg-warning/10"
											: station.occupancy > 85
												? "border-destructive text-destructive bg-destructive/10 animate-pulse"
												: "border-primary/50 text-primary bg-primary/10"
									}`}
								>
									{station.occupancy < 60 ? "LOW" : station.occupancy > 85 ? "HIGH" : "OK"}
								</span>
							</div>
						</CardBody>
					</Card>
				))}
			</div>
		</div>
	);
}

function ProductivityEmployeeTable({
	promise,
}: {
	promise: NonNullable<AnalyticsSectionDisplayPromises["productivity"]>["employeeTable"];
}) {
	const result = useCachedDisplay("employee-table", promise);
	if (result.error || !result.data) {
		return <AnalyticsErrorCard message={result.error ?? "Unable to load employee rankings."} />;
	}

	const { employeeProductivity } = result.data;

	return <ProductivityEmployeeTableContent employeeProductivity={employeeProductivity} />;
}

export function ProductivityEmployeeTableContent({
	employeeProductivity,
}: {
	employeeProductivity: AnalyticsData["employeeProductivity"];
}) {
	return (
		<Card className="overflow-hidden bg-card/80 shadow-[0_4px_12px_-6px_rgba(0,0,0,0.1)] ring-1 ring-inset ring-border/40">
			<HardwareCardHeader title="Employee Productivity Rankings" />
			<div className="overflow-x-auto">
				<table className="w-full">
					<thead>
						<tr className="border-b border-border/50 bg-muted/10 text-[10px] font-industrial uppercase tracking-widest text-muted-foreground">
							<th className="px-4 py-3 text-left font-bold">Employee</th>
							<th className="px-4 py-3 text-left font-bold">Station</th>
							<th className="px-4 py-3 text-right font-bold">Units</th>
							<th className="px-4 py-3 text-right font-bold">Hours</th>
							<th className="px-4 py-3 text-right font-bold">Rate (U/H)</th>
							<th className="px-4 py-3 text-right font-bold">Vs Station Avg</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-border/30">
						{employeeProductivity.length > 0 ? (
							employeeProductivity.map((employee, index) => (
								<tr key={index} className="text-xs font-mono transition-colors hover:bg-muted/20">
									<td className="px-4 py-2.5 font-bold text-foreground/90">{employee.employee}</td>
									<td className="px-4 py-2.5">
										<span className="inline-flex items-center px-2 py-0.5 border border-primary/20 text-[10px] font-bold text-foreground uppercase tracking-wider bg-background/50">
											{employee.station}
										</span>
									</td>
									<td className="px-4 py-2.5 text-right font-bold">{employee.units}</td>
									<td className="px-4 py-2.5 text-right text-muted-foreground">{employee.hours}</td>
									<td className="px-4 py-2.5 text-right font-bold">{employee.rate}</td>
									<td className="px-4 py-2.5 text-right">
										<div className="flex justify-end gap-2">
											{employee.value >= 105 ? (
												<span className="inline-flex items-center px-2 py-0.5 border-2 border-primary text-[10px] font-bold text-primary uppercase tracking-wider bg-primary/10">
													Top Performer
												</span>
											) : employee.value >= 100 ? (
												<span className="inline-flex items-center px-2 py-0.5 border border-success/50 text-[10px] font-bold text-success uppercase tracking-wider bg-success/10">
													Above Avg
												</span>
											) : (
												<span className="inline-flex items-center px-2 py-0.5 border border-muted-foreground/30 text-[10px] font-bold text-muted-foreground uppercase tracking-wider bg-muted/10">
													Below Avg
												</span>
											)}
										</div>
									</td>
								</tr>
							))
						) : (
							<tr>
								<td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
									No productivity ranking data available for this period.
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
			<p className="border-t border-border/40 px-4 py-2 text-[11px] font-mono text-muted-foreground">
				Rankings based on individual performance vs specific station averages.
			</p>
		</Card>
	);
}

function LaborCostSection({
	displays,
	compare,
}: {
	displays: NonNullable<AnalyticsSectionDisplayPromises["labor-cost"]>;
	compare: AnalyticsComparison;
}) {
	return (
		<div className="space-y-6">
			<Suspense fallback={<LaborCostKpiRowSkeleton />}>
				<LaborCostKpiRow promise={displays.kpis} compare={compare} />
			</Suspense>

			<Suspense fallback={<LaborCostChartsSkeleton />}>
				<LaborCostCharts promise={displays.charts} compare={compare} />
			</Suspense>

			<Suspense fallback={<LaborCostStationTableSkeleton />}>
				<LaborCostStationTable promise={displays.stationTable} />
			</Suspense>
		</div>
	);
}

function LaborCostKpiRow({
	promise,
	compare,
}: {
	promise: NonNullable<AnalyticsSectionDisplayPromises["labor-cost"]>["kpis"];
	compare: AnalyticsComparison;
}) {
	const { data: result, isCached } = useCachedDisplayState("kpis", promise);
	if (result.error || !result.data) {
		return <AnalyticsErrorCard message={result.error ?? "Unable to load labor KPIs."} />;
	}

	const { costSummary } = result.data;
	const comparisonTrendLabel = getComparisonTrendLabel(compare);

	return (
		<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
			<KPICard
				title="Regular Cost"
				value={`$${costSummary.regular.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
				subtitle={`Baseline $${costSummary.comparisonRegular.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
				icon="clock"
				animateCountUp={!isCached}
				trend={{
					direction: getCostTrendDirection(costSummary.regularChangePercent),
					value: `${costSummary.regularChangePercent > 0 ? "+" : ""}${costSummary.regularChangePercent}%`,
					label: comparisonTrendLabel,
				}}
			/>
			<KPICard
				title="Overtime Cost"
				value={`$${costSummary.overtime.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
				subtitle={`Baseline $${costSummary.comparisonOvertime.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
				icon="dollar"
				animateCountUp={!isCached}
				trend={{
					direction: getCostTrendDirection(costSummary.overtimeChangePercent),
					value: `${costSummary.overtimeChangePercent > 0 ? "+" : ""}${costSummary.overtimeChangePercent}%`,
					label: comparisonTrendLabel,
				}}
			/>
			<KPICard
				title="Total Labor Cost"
				value={`$${costSummary.total.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
				subtitle={`Baseline $${costSummary.comparisonTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
				icon="dollar"
				animateCountUp={!isCached}
				trend={{
					direction: getCostTrendDirection(costSummary.totalChangePercent),
					value: `${costSummary.totalChangePercent > 0 ? "+" : ""}${costSummary.totalChangePercent}%`,
					label: comparisonTrendLabel,
				}}
			/>
			<Card
				className={`h-full border-2 ${
					costSummary.variance > 0 ? "border-destructive" : "border-primary"
				} bg-card overflow-hidden relative`}
			>
				<div className="absolute inset-0 bg-noise opacity-[0.25] pointer-events-none mix-blend-overlay z-0" />
				{costSummary.variance > 0 && (
					<div className="absolute top-0 right-0 p-2 z-10">
						<div className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
					</div>
				)}
				<CardBody className="flex h-full flex-col justify-between p-5 relative z-10">
					<div>
						<div
							className={`mb-2 text-[10px] font-mono font-bold uppercase tracking-widest ${
								costSummary.variance > 0 ? "text-destructive" : "text-primary"
							}`}
						>
							Budget Variance
						</div>
						<div className="font-display text-3xl font-black tracking-tight text-foreground uppercase">
							{costSummary.variance > 0 ? "+" : ""}
							{costSummary.variance.toLocaleString(undefined, {
								maximumFractionDigits: 0,
							})}
						</div>
						<div className="mt-1 text-xs font-mono font-bold text-muted-foreground uppercase tracking-wider">
							{costSummary.variancePercent}% vs budget
						</div>
					</div>
				</CardBody>
			</Card>
		</div>
	);
}

function LaborCostCharts({
	promise,
	compare,
}: {
	promise: NonNullable<AnalyticsSectionDisplayPromises["labor-cost"]>["charts"];
	compare: AnalyticsComparison;
}) {
	const result = useCachedDisplay("charts", promise);
	if (result.error || !result.data) {
		return <AnalyticsErrorCard message={result.error ?? "Unable to load labor charts."} />;
	}

	const { laborCostTrends, shiftProductivity, costBreakdown } = result.data;
	const comparisonLabel = getAnalyticsComparisonLabel(compare);
	const totalCost = costBreakdown.reduce((sum, item) => sum + item.value, 0);
	const overtimeCost = costBreakdown.find((item) => item.name === "Overtime")?.value ?? 0;
	const regularCost = costBreakdown.find((item) => item.name === "Regular Hours")?.value ?? 0;
	const overtimeShare = totalCost > 0 ? (overtimeCost / totalCost) * 100 : 0;
	const regularShare = totalCost > 0 ? (regularCost / totalCost) * 100 : 0;

	return (
		<>
			<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
				<LineChart
					title={`Labor Cost Trend vs ${comparisonLabel}`}
					data={laborCostTrends}
					height={320}
				/>
				<BarChart
					title={`Shift Productivity vs ${comparisonLabel}`}
					data={shiftProductivity}
					height={320}
				/>
			</div>

			<div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
				<PieChart title="Labor Cost Breakdown" data={costBreakdown} height={300} />
				<Card className="overflow-hidden bg-card/80 shadow-[0_4px_12px_-6px_rgba(0,0,0,0.1)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_6px_16px_-6px_rgba(0,0,0,0.15)] ring-1 ring-inset ring-border/40">
					<HardwareCardHeader
						title="Cost Composition Brief"
						subtitle="Use the spend mix to determine whether variance is driven by staffing depth or overtime pressure."
						rightElement={
							<div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground bg-background/50 px-2 py-1 border border-primary/20">
								Updated with current window
							</div>
						}
					/>
					<CardBody className="space-y-4 p-4 relative bg-background/30">
						<div className="relative z-10 grid grid-cols-1 gap-3 sm:grid-cols-2">
							<div className="border border-primary/20 bg-background/50 p-3">
								<div className="text-[10px] font-bold font-industrial uppercase tracking-[0.18em] text-muted-foreground">
									Regular Share
								</div>
								<div className="mt-2 text-2xl font-mono font-semibold text-foreground/90">
									{regularShare.toFixed(1)}%
								</div>
								<div className="mt-3 h-2 overflow-hidden border border-primary/30 bg-background/50">
									<div className="h-full bg-primary" style={{ width: `${regularShare}%` }} />
								</div>
							</div>
							<div className="border border-primary/20 bg-background/50 p-3">
								<div className="text-[10px] font-bold font-industrial uppercase tracking-[0.18em] text-muted-foreground">
									Overtime Share
								</div>
								<div className="mt-2 text-2xl font-mono font-semibold text-foreground/90">
									{overtimeShare.toFixed(1)}%
								</div>
								<div className="mt-3 h-2 overflow-hidden border border-warning/30 bg-background/50">
									<div
										className="h-full bg-warning animate-pulse"
										style={{ width: `${overtimeShare}%` }}
									/>
								</div>
							</div>
						</div>

						<div className="grid gap-3 border border-primary/20 bg-background/50 p-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
							<div>
								<div className="text-[10px] font-bold font-industrial uppercase tracking-[0.18em] text-primary">
									Interpretation
								</div>
								<p className="mt-2 text-sm text-muted-foreground font-mono">
									{overtimeShare > 12
										? "> ALERT: Overtime is becoming a visible share of total spend. Schedule stabilization recommended."
										: "> STATUS: Most labor spend is still regular-hour based. Staffing coverage is carrying the current load."}
								</p>
							</div>
							<div className="text-right">
								<div className="text-[10px] font-bold font-industrial uppercase tracking-[0.18em] text-muted-foreground">
									Total Spend
								</div>
								<div className="mt-2 text-2xl font-mono font-semibold text-foreground/90">
									${totalCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}
								</div>
							</div>
						</div>
					</CardBody>
				</Card>
			</div>
		</>
	);
}

function LaborCostStationTable({
	promise,
}: {
	promise: NonNullable<AnalyticsSectionDisplayPromises["labor-cost"]>["stationTable"];
}) {
	const result = useCachedDisplay("station-table", promise);
	if (result.error || !result.data) {
		return <AnalyticsErrorCard message={result.error ?? "Unable to load labor station table."} />;
	}

	const { stationSnapshots, benchmarkData } = result.data;

	return (
		<Card className="h-full flex flex-col bg-card/80 shadow-[0_4px_12px_-6px_rgba(0,0,0,0.1)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_6px_16px_-6px_rgba(0,0,0,0.15)] ring-1 ring-inset ring-border/40">
			<HardwareCardHeader title="Cost Analysis by Station" />
			<div className="flex-1 overflow-x-auto relative bg-background/50">
				<table className="w-full relative z-10">
					<thead>
						<tr className="border-b border-border/50 bg-muted/10 text-[10px] font-industrial uppercase tracking-widest text-muted-foreground">
							<th className="px-4 py-2 text-left font-bold">Station</th>
							<th className="px-4 py-2 text-right font-bold">Total Hours</th>
							<th className="px-4 py-2 text-right font-bold">OT Hours</th>
							<th className="px-4 py-2 text-right font-bold">Cost/Unit</th>
							<th className="px-4 py-2 text-left font-bold">Status</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-border/30">
						{stationSnapshots.map((station) => {
							const regularHours = 156.8;
							const overtimeHours = station.name === "FILLING" ? 25.5 : 12.5;
							const totalHours = regularHours + overtimeHours;
							const totalCost = totalHours * 18.55;
							const estimatedUnits = (station.efficiency * totalHours) / 8;
							const costPerUnit =
								estimatedUnits > 0 ? Number((totalCost / estimatedUnits).toFixed(2)) : null;

							return (
								<tr
									key={station.name}
									className="text-xs font-mono transition-colors hover:bg-muted/20"
								>
									<td className="px-4 py-2 font-bold text-foreground/90">{station.name}</td>
									<td className="px-4 py-2 text-right text-muted-foreground">
										{totalHours.toFixed(1)}
									</td>
									<td
										className={`px-4 py-2 text-right ${
											overtimeHours > 20 ? "font-bold text-destructive" : "text-muted-foreground"
										}`}
									>
										{overtimeHours.toFixed(1)}
									</td>
									<td className="px-4 py-2 text-right font-bold">
										{costPerUnit === null ? (
											<span className="text-muted-foreground">N/A</span>
										) : (
											`$${costPerUnit.toFixed(2)}`
										)}
									</td>
									<td className="px-4 py-2">
										{costPerUnit === null ? (
											<span className="inline-flex items-center px-1.5 py-0.5 border border-muted-foreground/30 text-[9px] font-bold text-muted-foreground uppercase tracking-wider bg-muted/10">
												NO OUTPUT
											</span>
										) : costPerUnit > benchmarkData.costPerUnit.target ? (
											<span className="inline-flex items-center px-1.5 py-0.5 border-2 border-destructive text-[9px] font-bold text-destructive uppercase tracking-wider bg-destructive/10 animate-pulse">
												OVER
											</span>
										) : (
											<span className="inline-flex items-center px-1.5 py-0.5 border border-primary/50 text-[9px] font-bold text-primary uppercase tracking-wider bg-primary/10">
												OK
											</span>
										)}
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		</Card>
	);
}

function TrendsSection({
	displays,
	compare,
}: {
	displays: NonNullable<AnalyticsSectionDisplayPromises["trends"]>;
	compare: AnalyticsComparison;
}) {
	return (
		<div className="space-y-6">
			<Suspense fallback={<TrendKpisSkeleton />}>
				<TrendKpis promise={displays.kpis} />
			</Suspense>

			<Suspense fallback={<TrendChartsSkeleton />}>
				<TrendCharts promise={displays.charts} compare={compare} />
			</Suspense>

			<Suspense fallback={<TrendAnomalyTableSkeleton />}>
				<TrendAnomalyTable promise={displays.anomalyTable} />
			</Suspense>
		</div>
	);
}

function TrendKpis({
	promise,
}: {
	promise: NonNullable<AnalyticsSectionDisplayPromises["trends"]>["kpis"];
}) {
	const result = useCachedDisplay("kpis", promise);
	if (result.error || !result.data) {
		return <AnalyticsErrorCard message={result.error ?? "Unable to load trend KPIs."} />;
	}

	const { trendData } = result.data;

	return (
		<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
			<Metric
				label="Productivity Trend"
				value={`${trendData.productivity.changePercent > 0 ? "+" : ""}${trendData.productivity.changePercent}%`}
				trendDirection={toMetricTrendDirection(trendData.productivity.trend)}
				className="rounded-[2px] border border-border bg-card p-6"
			/>
			<Metric
				label="Cost Trend"
				value={`${trendData.costs.changePercent > 0 ? "+" : ""}${trendData.costs.changePercent}%`}
				trendDirection={toMetricTrendDirection(trendData.costs.trend)}
				className="rounded-[2px] border border-border bg-card p-6"
			/>
			<Metric
				label="Quality Trend"
				value={`${trendData.quality.changePercent > 0 ? "+" : ""}${trendData.quality.changePercent}%`}
				trendDirection={toMetricTrendDirection(trendData.quality.trend)}
				className="rounded-[2px] border border-border bg-card p-6"
			/>
		</div>
	);
}

function TrendCharts({
	promise,
	compare,
}: {
	promise: NonNullable<AnalyticsSectionDisplayPromises["trends"]>["charts"];
	compare: AnalyticsComparison;
}) {
	const result = useCachedDisplay("charts", promise);
	if (result.error || !result.data) {
		return <AnalyticsErrorCard message={result.error ?? "Unable to load trend charts."} />;
	}

	const { productivityTrends, laborCostTrends } = result.data;
	const comparisonLabel = getAnalyticsComparisonLabel(compare);

	return (
		<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
			<LineChart
				title={`Productivity Momentum vs ${comparisonLabel}`}
				data={productivityTrends}
				height={320}
			/>
			<LineChart
				title={`Cost Efficiency vs ${comparisonLabel}`}
				data={laborCostTrends}
				height={320}
			/>
		</div>
	);
}

function TrendAnomalyTable({
	promise,
}: {
	promise: NonNullable<AnalyticsSectionDisplayPromises["trends"]>["anomalyTable"];
}) {
	const result = useCachedDisplay("anomaly-table", promise);
	if (result.error || !result.data) {
		return <AnalyticsErrorCard message={result.error ?? "Unable to load anomaly alerts."} />;
	}

	const { anomalyData } = result.data;

	if (anomalyData.length === 0) {
		return (
			<Card className="overflow-hidden bg-card/80 shadow-[0_4px_12px_-6px_rgba(0,0,0,0.1)] ring-1 ring-inset ring-border/40">
				<HardwareCardHeader title="Detected Anomalies & Alerts" />
				<CardBody className="p-8 text-center relative bg-background/50">
					<div className="relative z-10">
						<div className="text-xs font-bold font-industrial uppercase tracking-widest text-primary">
							No Active Anomalies
						</div>
						<p className="mt-2 text-sm font-mono text-muted-foreground">
							No anomalies were detected for the selected comparison window.
						</p>
					</div>
				</CardBody>
			</Card>
		);
	}

	return (
		<Card className="overflow-hidden bg-card/80 shadow-[0_4px_12px_-6px_rgba(0,0,0,0.1)] transition-all duration-300 hover:shadow-[0_6px_16px_-6px_rgba(0,0,0,0.15)]">
			<HardwareCardHeader title="Detected Anomalies & Alerts" />
			<div className="overflow-x-auto relative">
				<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-background/20 to-transparent pointer-events-none" />
				<table className="w-full relative z-10">
					<thead>
						<tr className="border-b border-border/50 bg-muted/10 text-[10px] font-industrial uppercase tracking-widest text-muted-foreground">
							<th className="px-4 py-3 text-left">Severity</th>
							<th className="px-4 py-3 text-left">Type</th>
							<th className="px-4 py-3 text-left">Description</th>
							<th className="px-4 py-3 text-right">Impact</th>
							<th className="px-4 py-3 text-right">Action</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-border/30">
						{anomalyData.map((anomaly, index) => (
							<tr key={index} className="text-xs font-mono hover:bg-muted/20">
								<td className="px-4 py-2.5">
									<Badge
										variant={anomaly.severity === "high" ? "destructive" : "secondary"}
										className={`h-5 text-[10px] uppercase ${
											anomaly.severity === "medium"
												? "border-warning bg-warning/20 text-warning"
												: ""
										}`}
									>
										{anomaly.severity}
									</Badge>
								</td>
								<td className="px-4 py-2.5 uppercase text-muted-foreground">{anomaly.type}</td>
								<td className="px-4 py-2.5 font-medium">{anomaly.description}</td>
								<td className="px-4 py-2.5 text-right">{anomaly.impact}</td>
								<td className="px-4 py-2.5 text-right">
									<Button variant="ghost" size="sm" className="h-6 text-[10px]">
										INVESTIGATE
									</Button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</Card>
	);
}

function CapacitySection({
	displays,
	compare,
}: {
	displays: NonNullable<AnalyticsSectionDisplayPromises["capacity"]>;
	compare: AnalyticsComparison;
}) {
	return (
		<div className="space-y-6">
			<p className="text-xs font-mono text-muted-foreground">
				Windowed capacity planning is now compared against{" "}
				{getAnalyticsComparisonLabel(compare).toLowerCase()}; the floor map remains a live
				operational snapshot.
			</p>

			<Suspense fallback={<CapacityKpisSkeleton />}>
				<CapacityKpis promise={displays.kpis} compare={compare} />
			</Suspense>

			<Suspense fallback={<CapacityFloorSkeleton />}>
				<CapacityFloor promise={displays.floor} compare={compare} />
			</Suspense>
		</div>
	);
}

function CapacityKpis({
	promise,
	compare,
}: {
	promise: NonNullable<AnalyticsSectionDisplayPromises["capacity"]>["kpis"];
	compare: AnalyticsComparison;
}) {
	const { data: result, isCached } = useCachedDisplayState("kpis", promise);
	if (result.error || !result.data) {
		return <AnalyticsErrorCard message={result.error ?? "Unable to load capacity KPIs."} />;
	}

	const { capacityComparisonData } = result.data;
	const comparisonTrendLabel = getComparisonTrendLabel(compare);
	const { overall } = capacityComparisonData;

	return (
		<div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
			<KPICard
				title="Overall Utilization"
				value={`${overall.currentUtilization}%`}
				subtitle={`Target: ${overall.optimalUtilization}%`}
				icon="industry"
				animateCountUp={!isCached}
				trend={{
					direction: getPositiveDirection(overall.utilizationDelta),
					value: formatSignedNumber(overall.utilizationDelta, " pts"),
					label: comparisonTrendLabel,
				}}
			/>
			<KPICard
				title="Staffing Coverage"
				value={`${overall.currentCoverage}%`}
				subtitle={`${compactNumberFormatter.format(overall.currentStaffShortage)} roles uncovered`}
				icon="users"
				animateCountUp={!isCached}
				trend={{
					direction: getPositiveDirection(overall.coverageDelta),
					value: formatSignedNumber(overall.coverageDelta, " pts"),
					label: comparisonTrendLabel,
				}}
			/>
			<KPICard
				title="Opportunity Cost"
				value={wholeCurrencyFormatter.format(overall.currentCostImpact)}
				subtitle={`Baseline ${wholeCurrencyFormatter.format(overall.comparisonCostImpact)}`}
				icon="dollar"
				animateCountUp={!isCached}
				trend={{
					direction: getInverseDirection(overall.costImpactDelta),
					value: formatSignedCurrency(overall.costImpactDelta),
					label: comparisonTrendLabel,
				}}
			/>
			<KPICard
				title="Pressure Stations"
				value={overall.currentBottlenecks}
				subtitle="Coverage or utilization below target"
				icon="chart"
				animateCountUp={!isCached}
				trend={{
					direction: getInverseDirection(overall.bottleneckDelta),
					value: `${overall.bottleneckDelta > 0 ? "+" : ""}${overall.bottleneckDelta}`,
					label: comparisonTrendLabel,
				}}
			/>
		</div>
	);
}

function CapacityFloor({
	promise,
	compare,
}: {
	promise: NonNullable<AnalyticsSectionDisplayPromises["capacity"]>["floor"];
	compare: AnalyticsComparison;
}) {
	const result = useCachedDisplay("floor", promise);
	if (result.error || !result.data) {
		return <AnalyticsErrorCard message={result.error ?? "Unable to load warehouse floor."} />;
	}

	const { capacityData, capacityComparisonData, liveFloorData } = result.data;
	const comparisonLabel = getAnalyticsComparisonLabel(compare);
	const liveByName = new Map(capacityData.stations.map((station) => [station.name, station]));
	const rankedStations = [...capacityComparisonData.stations].sort(
		(a, b) => b.currentGap - a.currentGap || a.coverageDelta - b.coverageDelta
	);
	const utilizationComparisonChart = {
		labels: rankedStations.map((station) => station.name),
		datasets: [
			{
				label: "Current",
				data: rankedStations.map((station) => station.currentUtilization),
				color: "#e07426",
			},
			{
				label: comparisonLabel,
				data: rankedStations.map((station) => station.comparisonUtilization),
				color: "#cbd5e1",
			},
		],
	};

	return (
		<div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
			<div className="space-y-6">
				<WarehouseFloor data={liveFloorData} metric="occupancy" />
				<BarChart
					title={`Station Utilization vs ${comparisonLabel}`}
					data={utilizationComparisonChart}
					height={300}
				/>
			</div>
			<Card className="overflow-hidden bg-card/80 shadow-[0_4px_12px_-6px_rgba(0,0,0,0.1)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_6px_16px_-6px_rgba(0,0,0,0.15)] ring-1 ring-inset ring-border/40">
				<HardwareCardHeader
					title="Coverage Pressure Board"
					subtitle={`Selected window vs ${comparisonLabel.toLowerCase()} by station.`}
					rightElement={
						<div className="text-[10px] font-mono font-bold uppercase tracking-widest text-muted-foreground border border-primary/20 bg-background/50 px-2 py-0.5 mt-1">
							Delta View
						</div>
					}
				/>
				<CardBody className="space-y-3 p-3 relative bg-background/30">
					<div className="relative z-10 space-y-3">
						{rankedStations.slice(0, 6).map((station) => {
							const liveStation = liveByName.get(station.name);
							const status =
								station.currentGap > 0.5
									? { label: "Critical", variant: "destructive" as const }
									: station.coverageDelta < 0
										? { label: "Watch", variant: "warning" as const }
										: { label: "Stable", variant: "primary" as const };

							return (
								<div key={station.name} className="border border-primary/20 bg-background/50 p-3">
									<div className="flex items-start justify-between gap-3">
										<div className="min-w-0">
											<div className="text-xs font-bold font-industrial uppercase tracking-[0.16em] text-foreground/90">
												{station.name}
											</div>
											<div className="mt-1 text-[10px] font-mono text-muted-foreground">
												Live {liveStation?.currentStaff ?? 0} /{" "}
												{liveStation?.requiredStaff ?? station.recommendedStaff} · target{" "}
												{station.recommendedStaff}
											</div>
										</div>
										<span
											className={`inline-flex items-center px-1.5 py-0.5 border text-[9px] font-bold uppercase tracking-wider ${
												status.variant === "destructive"
													? "border-destructive text-destructive bg-destructive/10 animate-pulse"
													: status.variant === "warning"
														? "border-warning text-warning bg-warning/10"
														: "border-primary/50 text-primary bg-primary/10"
											}`}
										>
											{status.label}
										</span>
									</div>
									<div className="mt-3 grid grid-cols-3 gap-3 text-[11px] font-mono font-bold">
										<div>
											<div className="text-muted-foreground text-[9px] uppercase tracking-widest">
												Coverage
											</div>
											<div className="mt-1 text-foreground/90">{station.currentCoverage}%</div>
										</div>
										<div>
											<div className="text-muted-foreground text-[9px] uppercase tracking-widest">
												Baseline
											</div>
											<div className="mt-1 text-foreground/90">{station.comparisonCoverage}%</div>
										</div>
										<div>
											<div className="text-muted-foreground text-[9px] uppercase tracking-widest">
												Gap
											</div>
											<div
												className={`mt-1 ${station.currentGap > 0 ? "text-destructive" : "text-primary"}`}
											>
												{compactNumberFormatter.format(station.currentGap)}
											</div>
										</div>
									</div>
									<div className="mt-3 h-2 w-full overflow-hidden border border-primary/30 bg-background/50">
										<div
											className={`h-full ${station.currentCoverage >= station.comparisonCoverage ? "bg-primary" : "bg-destructive animate-pulse"}`}
											style={{ width: `${Math.max(6, Math.min(100, station.currentCoverage))}%` }}
										/>
									</div>
									<div className="mt-2 flex items-center justify-between text-[10px] font-mono font-bold uppercase tracking-widest text-muted-foreground">
										<span>Δ {formatSignedNumber(station.coverageDelta, " pts")}</span>
										<span>
											Util {station.currentUtilization}% / {station.comparisonUtilization}%
										</span>
									</div>
								</div>
							);
						})}
					</div>
				</CardBody>
			</Card>
		</div>
	);
}

function BenchmarksSection({
	displays,
	compare,
}: {
	displays: NonNullable<AnalyticsSectionDisplayPromises["benchmarks"]>;
	compare: AnalyticsComparison;
}) {
	return (
		<div className="space-y-6">
			<p className="text-xs font-mono text-muted-foreground">
				Benchmark ladders now show how the selected window moved against{" "}
				{getAnalyticsComparisonLabel(compare).toLowerCase()} while staying anchored to industry and
				target bands.
			</p>

			<Suspense fallback={<BenchmarkKpisSkeleton />}>
				<BenchmarkKpis promise={displays.kpis} compare={compare} />
			</Suspense>

			<Suspense fallback={<BenchmarkChartsSkeleton />}>
				<BenchmarkCharts promise={displays.charts} compare={compare} />
			</Suspense>

			<Suspense fallback={<BenchmarkStationTableSkeleton />}>
				<BenchmarkStationTable promise={displays.stationTable} compare={compare} />
			</Suspense>
		</div>
	);
}

function BenchmarkKpis({
	promise,
	compare,
}: {
	promise: NonNullable<AnalyticsSectionDisplayPromises["benchmarks"]>["kpis"];
	compare: AnalyticsComparison;
}) {
	const { data: result, isCached } = useCachedDisplayState("kpis", promise);
	if (result.error || !result.data) {
		return <AnalyticsErrorCard message={result.error ?? "Unable to load benchmark KPIs."} />;
	}

	const { benchmarkData } = result.data;
	const comparisonTrendLabel = getComparisonTrendLabel(compare);

	return (
		<div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
			<KPICard
				title="Productivity Position"
				value={`${benchmarkData.productivity.current} u/h`}
				subtitle={`Industry: ${benchmarkData.productivity.industryAvg} u/h`}
				icon="chart"
				animateCountUp={!isCached}
				trend={{
					direction: getPositiveDirection(benchmarkData.productivity.change),
					value: formatSignedNumber(benchmarkData.productivity.change, " u/h"),
					label: comparisonTrendLabel,
				}}
			/>
			<KPICard
				title="Cost Position"
				value={preciseCurrencyFormatter.format(benchmarkData.costPerUnit.current)}
				subtitle={`Target: ${preciseCurrencyFormatter.format(benchmarkData.costPerUnit.target)}`}
				icon="dollar"
				animateCountUp={!isCached}
				trend={{
					direction: getInverseDirection(benchmarkData.costPerUnit.change),
					value: formatSignedCurrency(benchmarkData.costPerUnit.change, true),
					label: comparisonTrendLabel,
				}}
			/>
			<KPICard
				title="Quality Position"
				value={`${benchmarkData.quality.current}%`}
				subtitle={`Top Decile: ${benchmarkData.quality.top10Percent}%`}
				icon="percent"
				animateCountUp={!isCached}
				trend={{
					direction: getPositiveDirection(benchmarkData.quality.change),
					value: formatSignedNumber(benchmarkData.quality.change, " pts"),
					label: comparisonTrendLabel,
				}}
			/>
		</div>
	);
}

function BenchmarkLadderCard({
	title,
	metrics,
	lowerIsBetter = false,
	formatValue = (v: number) => String(v),
}: {
	title: string;
	metrics: Array<{
		label: string;
		value: number;
		type: "current" | "baseline" | "target" | "industry" | "top";
	}>;
	lowerIsBetter?: boolean;
	formatValue?: (v: number) => string;
}) {
	const sortedMetrics = [...metrics].sort((a, b) =>
		lowerIsBetter ? a.value - b.value : b.value - a.value
	);

	return (
		<Card className="group relative flex h-full flex-col overflow-hidden bg-card/40 backdrop-blur-sm transition-all duration-500 hover:bg-card/60 ring-1 ring-inset ring-border/40">
			<div className="absolute inset-0 bg-primary/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
			<CardHeader className="relative border-b border-border/40 bg-muted/20 py-4 px-5">
				<div className="flex items-center justify-between">
					<CardTitle className="text-xs font-bold font-industrial uppercase tracking-[0.2em] text-foreground/80 group-hover:text-primary transition-colors duration-300">
						{title}
					</CardTitle>
					{lowerIsBetter && (
						<div className="border border-primary/20 bg-background/50 px-2 py-1 text-[9px] font-mono font-bold uppercase tracking-widest text-muted-foreground">
							Lower is Better
						</div>
					)}
				</div>
			</CardHeader>
			<CardBody className="relative flex-1 p-5">
				<div className="relative flex h-full flex-col justify-center space-y-3">
					{/* Vertical track line for the ladder effect */}
					<div className="absolute left-[31px] top-4 bottom-4 w-0.5 bg-primary/20" />

					{sortedMetrics.map((m, i) => {
						const isCurrent = m.type === "current";
						const isBaseline = m.type === "baseline";
						const isTop = m.type === "top";
						const isTarget = m.type === "target";

						return (
							<div
								key={m.label}
								className={`relative z-10 flex items-center justify-between border p-3 transition-all duration-300 ${
									isCurrent
										? "border-2 border-primary bg-primary/10 shadow-[4px_4px_0px_0px_rgba(var(--primary),0.2)]"
										: isBaseline
											? "border-muted-foreground/30 bg-muted/10 opacity-70"
											: "border-primary/20 bg-background/50 hover:bg-primary/5 hover:border-primary/40"
								}`}
							>
								<div className="flex items-center gap-4">
									<div className="flex w-6 justify-center">
										<div
											className={`text-[10px] font-mono font-bold ${isCurrent ? "text-primary" : "text-muted-foreground"}`}
										>
											{String(i + 1).padStart(2, "0")}
										</div>
									</div>
									<div className="relative flex h-3 w-3 items-center justify-center bg-background/80">
										{isCurrent && (
											<span className="absolute inline-flex h-full w-full animate-ping bg-primary opacity-40" />
										)}
										<div
											className={`h-2 w-2 ${
												isCurrent
													? "bg-primary animate-pulse"
													: isTop
														? "bg-chart-2"
														: isTarget
															? "bg-foreground"
															: isBaseline
																? "bg-muted-foreground/50"
																: "bg-primary/50"
											}`}
										/>
									</div>
									<span
										className={`text-[11px] font-bold font-industrial uppercase tracking-widest ${
											isCurrent ? "text-foreground" : "text-muted-foreground"
										}`}
									>
										{m.label}
									</span>
								</div>
								<div
									className={`text-sm font-mono tracking-tight font-bold ${
										isCurrent
											? "text-primary text-base"
											: isBaseline
												? "text-muted-foreground line-through decoration-muted-foreground/30"
												: "text-foreground/90"
									}`}
								>
									{formatValue(m.value)}
								</div>
							</div>
						);
					})}
				</div>
			</CardBody>
		</Card>
	);
}

function BenchmarkCharts({
	promise,
	compare,
}: {
	promise: NonNullable<AnalyticsSectionDisplayPromises["benchmarks"]>["charts"];
	compare: AnalyticsComparison;
}) {
	const result = useCachedDisplay("charts", promise);
	if (result.error || !result.data) {
		return <AnalyticsErrorCard message={result.error ?? "Unable to load benchmark charts."} />;
	}

	const { benchmarkData } = result.data;
	const comparisonLabel = getAnalyticsComparisonLabel(compare);

	return (
		<div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
			<BenchmarkLadderCard
				title={`Productivity vs ${comparisonLabel}`}
				metrics={[
					{
						label: comparisonLabel,
						value: benchmarkData.productivity.comparison,
						type: "baseline",
					},
					{ label: "Current", value: benchmarkData.productivity.current, type: "current" },
					{
						label: "Industry Avg",
						value: benchmarkData.productivity.industryAvg,
						type: "industry",
					},
					{ label: "Target", value: benchmarkData.productivity.target, type: "target" },
					{ label: "Top 10%", value: benchmarkData.productivity.top10Percent, type: "top" },
				]}
				formatValue={(v) => `${v.toFixed(1)} u/h`}
			/>
			<BenchmarkLadderCard
				title={`Cost vs ${comparisonLabel}`}
				lowerIsBetter={true}
				metrics={[
					{ label: "Bottom 10%", value: benchmarkData.costPerUnit.bottom10Percent, type: "top" },
					{ label: "Target", value: benchmarkData.costPerUnit.target, type: "target" },
					{ label: comparisonLabel, value: benchmarkData.costPerUnit.comparison, type: "baseline" },
					{ label: "Current", value: benchmarkData.costPerUnit.current, type: "current" },
					{ label: "Industry Avg", value: benchmarkData.costPerUnit.industryAvg, type: "industry" },
				]}
				formatValue={(v) => preciseCurrencyFormatter.format(v)}
			/>
			<BenchmarkLadderCard
				title={`Quality vs ${comparisonLabel}`}
				metrics={[
					{ label: comparisonLabel, value: benchmarkData.quality.comparison, type: "baseline" },
					{ label: "Current", value: benchmarkData.quality.current, type: "current" },
					{ label: "Industry Avg", value: benchmarkData.quality.industryAvg, type: "industry" },
					{ label: "Target", value: benchmarkData.quality.target, type: "target" },
					{ label: "Top 10%", value: benchmarkData.quality.top10Percent, type: "top" },
				]}
				formatValue={(v) => `${v.toFixed(1)}%`}
			/>
		</div>
	);
}

function BenchmarkStationTable({
	promise,
	compare,
}: {
	promise: NonNullable<AnalyticsSectionDisplayPromises["benchmarks"]>["stationTable"];
	compare: AnalyticsComparison;
}) {
	const result = useCachedDisplay("station-table", promise);
	if (result.error || !result.data) {
		return <AnalyticsErrorCard message={result.error ?? "Unable to load benchmark table."} />;
	}

	const { stationBenchmarkComparison, benchmarkData } = result.data;
	const comparisonLabel = getAnalyticsComparisonLabel(compare);

	const stationBenchmarkRows = stationBenchmarkComparison
		.map((station) => {
			const vsIndustry = station.efficiency - benchmarkData.productivity.industryAvg;

			let status: "TOP 10%" | "ABOVE AVG" | "BELOW AVG" = "BELOW AVG";
			if (station.efficiency >= benchmarkData.productivity.top10Percent) {
				status = "TOP 10%";
			} else if (station.efficiency >= benchmarkData.productivity.industryAvg) {
				status = "ABOVE AVG";
			}

			return {
				...station,
				vsIndustry,
				status,
			};
		})
		.sort((a, b) => b.efficiency - a.efficiency);

	return (
		<Card className="overflow-hidden bg-card/80 shadow-[0_4px_12px_-6px_rgba(0,0,0,0.1)] ring-1 ring-inset ring-border/40">
			<HardwareCardHeader title={`Station Positioning vs ${comparisonLabel}`} />
			<div className="overflow-x-auto relative">
				<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-background/20 to-transparent pointer-events-none" />
				<table className="w-full relative z-10">
					<thead>
						<tr className="border-b border-border/50 bg-muted/10 text-[10px] font-industrial uppercase tracking-widest text-muted-foreground">
							<th className="px-4 py-3 text-left font-bold">Station</th>
							<th className="px-4 py-3 text-right font-bold">Current</th>
							<th className="px-4 py-3 text-right font-bold">Baseline</th>
							<th className="px-4 py-3 text-right font-bold">Δ vs Base</th>
							<th className="px-4 py-3 text-right font-bold">Vs Industry</th>
							<th className="px-4 py-3 text-left font-bold">Tier</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-border/30">
						{stationBenchmarkRows.length > 0 ? (
							stationBenchmarkRows.map((station) => (
								<tr
									key={station.name}
									className="text-xs font-mono transition-colors hover:bg-muted/20"
								>
									<td className="px-4 py-2.5 font-bold text-foreground/90">{station.name}</td>
									<td className="px-4 py-2.5 text-right font-bold">
										{station.efficiency.toFixed(1)}
									</td>
									<td className="px-4 py-2.5 text-right text-muted-foreground">
										{station.comparisonEfficiency.toFixed(1)}
									</td>
									<td
										className={`px-4 py-2.5 text-right font-bold ${
											station.delta >= 0 ? "text-primary" : "text-destructive"
										}`}
									>
										{station.delta >= 0 ? "+" : ""}
										{station.delta.toFixed(1)}
									</td>
									<td
										className={`px-4 py-2.5 text-right font-bold ${
											station.vsIndustry >= 0 ? "text-primary" : "text-destructive"
										}`}
									>
										{station.vsIndustry >= 0 ? "+" : ""}
										{station.vsIndustry.toFixed(1)}
									</td>
									<td className="px-4 py-2.5">
										{station.status === "TOP 10%" ? (
											<span className="inline-flex items-center px-1.5 py-0.5 border-2 border-primary text-[9px] font-bold text-primary uppercase tracking-wider bg-primary/10 shadow-[2px_2px_0px_0px_rgba(var(--primary),0.3)]">
												TOP 10%
											</span>
										) : station.status === "ABOVE AVG" ? (
											<span className="inline-flex items-center px-1.5 py-0.5 border border-success/50 text-[9px] font-bold text-success uppercase tracking-wider bg-success/10">
												ABOVE AVG
											</span>
										) : (
											<span className="inline-flex items-center px-1.5 py-0.5 border border-muted-foreground/30 text-[9px] font-bold text-muted-foreground uppercase tracking-wider bg-muted/10">
												BELOW AVG
											</span>
										)}
									</td>
								</tr>
							))
						) : (
							<tr>
								<td
									colSpan={6}
									className="px-4 py-6 text-center text-xs font-mono text-muted-foreground"
								>
									No station benchmark data available for the selected window.
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</Card>
	);
}

function AnalyticsErrorCard({ message }: { message: string }) {
	return (
		<Card className="border-2 border-destructive bg-destructive/10 rounded-none shadow-[4px_4px_0px_0px_rgba(var(--destructive),0.3)] bg-noise">
			<CardBody className="p-6 relative">
				<div className="absolute top-0 left-0 w-full h-1 bg-destructive animate-pulse" />
				<div className="text-xs font-bold font-industrial uppercase tracking-widest text-destructive">
					[!] Data Load Error
				</div>
				<p className="mt-2 text-sm font-mono text-muted-foreground">{message}</p>
			</CardBody>
		</Card>
	);
}
