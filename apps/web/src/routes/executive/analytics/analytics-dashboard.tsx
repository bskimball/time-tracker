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
import type {
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

function useCachedDisplayState<T>(slot: string, promise: Promise<T>): { data: T; isCached: boolean } {
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

		return withCache(<ProductivitySection displays={displays.productivity} />);
	}

	if (section === "labor-cost") {
		if (!displays["labor-cost"]) {
			return <AnalyticsErrorCard message="No labor cost analytics data available." />;
		}

		return withCache(<LaborCostSection displays={displays["labor-cost"]} />);
	}

	if (section === "trends") {
		if (!displays.trends) {
			return <AnalyticsErrorCard message="No trend analytics data available." />;
		}

		return withCache(<TrendsSection displays={displays.trends} />);
	}

	if (section === "capacity") {
		if (!displays.capacity) {
			return <AnalyticsErrorCard message="No capacity analytics data available." />;
		}

		return withCache(<CapacitySection displays={displays.capacity} />);
	}

	if (!displays.benchmarks) {
		return <AnalyticsErrorCard message="No benchmark analytics data available." />;
	}

	return withCache(<BenchmarksSection displays={displays.benchmarks} />);
}

function ProductivitySection({
	displays,
}: {
	displays: NonNullable<AnalyticsSectionDisplayPromises["productivity"]>;
}) {
	return (
		<div className="space-y-6">
			<Suspense fallback={<ProductivityKpiRowSkeleton />}>
				<ProductivityKpiRow promise={displays.kpis} />
			</Suspense>

			<Suspense fallback={<ProductivityChartsSkeleton />}>
				<ProductivityCharts promise={displays.charts} />
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
}: {
	promise: NonNullable<AnalyticsSectionDisplayPromises["productivity"]>["kpis"];
}) {
	const { data: result, isCached } = useCachedDisplayState("kpis", promise);
	if (result.error || !result.data) {
		return <AnalyticsErrorCard message={result.error ?? "Unable to load productivity KPIs."} />;
	}

	const { benchmarkData, trendData } = result.data;

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
					label: "vs last period",
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
			<Card className="h-full border-l-4 border-l-destructive bg-destructive/5">
				<CardBody className="flex h-full flex-col justify-between p-4">
					<div>
						<div className="mb-1 text-xs font-industrial uppercase tracking-widest text-destructive">
							Bottleneck Alert
						</div>
						<div className="font-data text-2xl font-bold text-foreground">RECEIVING</div>
						<div className="mt-1 text-xs font-mono text-muted-foreground">45% Utilization</div>
					</div>
					<div className="mt-4 border-t border-destructive/20 pt-3">
						<div className="flex items-center gap-2 text-xs font-medium text-destructive">
							<span className="h-1.5 w-1.5 animate-pulse rounded-full bg-destructive" />
							Requires Attention
						</div>
					</div>
				</CardBody>
			</Card>
		</div>
	);
}

function ProductivityCharts({
	promise,
}: {
	promise: NonNullable<AnalyticsSectionDisplayPromises["productivity"]>["charts"];
}) {
	const result = useCachedDisplay("charts", promise);
	if (result.error || !result.data) {
		return <AnalyticsErrorCard message={result.error ?? "Unable to load productivity charts."} />;
	}

	const { productivityTrends, stationEfficiency, taskTypeEfficiency, shiftProductivity } = result.data;

	return (
		<>
			<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
				<LineChart title="Productivity Trends Over Time" data={productivityTrends} height={320} />
				<BarChart title="Station Efficiency Comparison" data={stationEfficiency} height={320} />
			</div>

			<div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mt-6">
				<BarChart title="Task Type Efficiency" data={taskTypeEfficiency} height={320} />
				<BarChart title="Shift Productivity" data={shiftProductivity} height={320} />
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
					<Card key={station.name} className="overflow-hidden">
						<CardHeader className="border-b border-border/50 bg-muted/30 py-2">
							<div className="flex items-center justify-between">
								<CardTitle className="text-xs font-industrial uppercase tracking-widest">
									{station.name}
								</CardTitle>
								<div
									className={`h-2 w-2 rounded-full ${
										station.occupancy > 85
											? "bg-destructive"
											: station.occupancy > 70
												? "bg-primary"
												: "bg-secondary"
									}`}
								/>
							</div>
						</CardHeader>
						<CardBody className="space-y-3 p-4">
							<div className="grid grid-cols-2 gap-2">
								<div>
									<div className="text-[10px] uppercase tracking-wide text-muted-foreground">
										Eff.
									</div>
									<div className="text-lg font-mono font-bold">{station.efficiency}</div>
								</div>
								<div>
									<div className="text-[10px] uppercase tracking-wide text-muted-foreground">
										Occ.
									</div>
									<div className="text-lg font-mono font-bold">{station.occupancy}%</div>
								</div>
							</div>
							<div className="h-1.5 w-full overflow-hidden rounded-full bg-muted/50">
								<div
									className={`h-full rounded-full ${
										station.efficiency > 30
											? "bg-primary"
											: station.efficiency > 20
												? "bg-secondary"
												: "bg-destructive"
									}`}
									style={{ width: `${Math.min(station.efficiency * 2, 100)}%` }}
								/>
							</div>
							<div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
								<span>{station.employees} Staff</span>
								<span>
									{station.occupancy < 60
										? "LOW"
										: station.occupancy > 85
											? "HIGH"
										    : "OK"}
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

	const { employeeProductivity, benchmarkData } = result.data;

	return (
		<Card className="overflow-hidden">
			<CardHeader className="border-b border-border/50 bg-muted/30 py-3">
				<CardTitle className="text-sm font-industrial uppercase tracking-widest text-muted-foreground">
					Employee Productivity Rankings
				</CardTitle>
			</CardHeader>
			<div className="overflow-x-auto">
				<table className="w-full">
					<thead>
						<tr className="border-b border-border/50 bg-muted/10 text-[10px] font-industrial uppercase tracking-widest text-muted-foreground">
							<th className="px-4 py-3 text-left font-medium">Employee</th>
							<th className="px-4 py-3 text-right font-medium">Units</th>
							<th className="px-4 py-3 text-right font-medium">Hours</th>
							<th className="px-4 py-3 text-right font-medium">Rate (u/h)</th>
							<th className="px-4 py-3 text-left font-medium">Station</th>
							<th className="px-4 py-3 text-left font-medium">Performance</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-border/30">
						{employeeProductivity.map((employee, index) => (
							<tr key={index} className="text-xs font-mono transition-colors hover:bg-muted/20">
								<td className="px-4 py-2.5 font-medium">{employee.employee}</td>
								<td className="px-4 py-2.5 text-right text-muted-foreground">-</td>
								<td className="px-4 py-2.5 text-right text-muted-foreground">-</td>
								<td className="px-4 py-2.5 text-right font-bold text-foreground">
									{employee.value}
								</td>
								<td className="px-4 py-2.5">
									<Badge variant="secondary" className="h-5 text-[10px]">
										{employee.station}
									</Badge>
								</td>
								<td className="px-4 py-2.5">
									{employee.value >= benchmarkData.productivity.top10Percent ? (
										<span className="font-bold text-primary">TOP 10%</span>
									) : employee.value >= benchmarkData.productivity.industryAvg ? (
										<span className="text-secondary">ABOVE AVG</span>
									) : (
										<span className="text-muted-foreground">BELOW AVG</span>
									)}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</Card>
	);
}

function LaborCostSection({
	displays,
}: {
	displays: NonNullable<AnalyticsSectionDisplayPromises["labor-cost"]>;
}) {
	return (
		<div className="space-y-6">
			<Suspense fallback={<LaborCostKpiRowSkeleton />}>
				<LaborCostKpiRow promise={displays.kpis} />
			</Suspense>

			<Suspense fallback={<LaborCostChartsSkeleton />}>
				<LaborCostCharts promise={displays.charts} />
			</Suspense>

			<Suspense fallback={<LaborCostStationTableSkeleton />}>
				<LaborCostStationTable promise={displays.stationTable} />
			</Suspense>
		</div>
	);
}

function LaborCostKpiRow({
	promise,
}: {
	promise: NonNullable<AnalyticsSectionDisplayPromises["labor-cost"]>["kpis"];
}) {
	const { data: result, isCached } = useCachedDisplayState("kpis", promise);
	if (result.error || !result.data) {
		return <AnalyticsErrorCard message={result.error ?? "Unable to load labor KPIs."} />;
	}

	const { costSummary } = result.data;

	return (
		<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
			<KPICard
				title="Regular Hours"
				value={`$${costSummary.regular.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
				subtitle="840 Hours Logged"
				icon="clock"
				animateCountUp={!isCached}
			/>
			<KPICard
				title="Overtime Cost"
				value={`$${costSummary.overtime.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
				subtitle="95 Hours Logged"
				icon="dollar"
				animateCountUp={!isCached}
				trend={{ direction: "down", value: "-5%", label: "vs last period" }}
			/>
			<KPICard
				title="Total Cost"
				value={`$${costSummary.total.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
				subtitle="Combined Labor"
				icon="dollar"
				animateCountUp={!isCached}
			/>
			<Card
				className={`h-full border-l-4 ${
					costSummary.variance > 0
						? "border-l-destructive bg-destructive/5"
						: "border-l-primary bg-primary/5"
				}`}
			>
				<CardBody className="flex h-full flex-col justify-between p-4">
					<div>
						<div
							className={`mb-1 text-xs font-industrial uppercase tracking-widest ${
								costSummary.variance > 0 ? "text-destructive" : "text-primary"
							}`}
						>
							Budget Variance
						</div>
						<div className="font-data text-2xl font-bold text-foreground">
							{costSummary.variance > 0 ? "+" : ""}
							{costSummary.variance.toLocaleString(undefined, {
								maximumFractionDigits: 0,
							})}
						</div>
						<div className="mt-1 text-xs font-mono text-muted-foreground">
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
}: {
	promise: NonNullable<AnalyticsSectionDisplayPromises["labor-cost"]>["charts"];
}) {
	const result = useCachedDisplay("charts", promise);
	if (result.error || !result.data) {
		return <AnalyticsErrorCard message={result.error ?? "Unable to load labor charts."} />;
	}

	const { laborCostTrends, shiftProductivity, costBreakdown } = result.data;

	return (
		<>
			<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
				<LineChart title="Labor Cost Trends (Cost per Unit)" data={laborCostTrends} height={320} />
				<BarChart title="Shift Productivity vs Cost" data={shiftProductivity} height={320} />
			</div>

			<div className="grid grid-cols-1 gap-6 lg:grid-cols-3 mt-6">
				<div className="lg:col-span-1">
					<PieChart title="Labor Cost Breakdown" data={costBreakdown} height={300} />
				</div>
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
		<Card className="h-full flex flex-col">
			<CardHeader className="border-b border-border/50 bg-muted/30 py-3">
				<CardTitle className="text-sm font-industrial uppercase tracking-widest text-muted-foreground">
					Cost Analysis by Station
				</CardTitle>
			</CardHeader>
			<div className="flex-1 overflow-x-auto">
				<table className="w-full">
					<thead>
						<tr className="border-b border-border/50 bg-muted/10 text-[10px] font-industrial uppercase tracking-widest text-muted-foreground">
							<th className="px-4 py-2 text-left">Station</th>
							<th className="px-4 py-2 text-right">Total Hours</th>
							<th className="px-4 py-2 text-right">OT Hours</th>
							<th className="px-4 py-2 text-right">Cost/Unit</th>
							<th className="px-4 py-2 text-left">Status</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-border/30">
						{stationSnapshots.map((station) => {
							const regularHours = 156.8;
							const overtimeHours = station.name === "FILLING" ? 25.5 : 12.5;
							const totalHours = regularHours + overtimeHours;
							const totalCost = totalHours * 18.55;
							const costPerUnit = totalCost / ((station.efficiency * totalHours) / 8);

							return (
								<tr
									key={station.name}
									className="text-xs font-mono transition-colors hover:bg-muted/20"
								>
									<td className="px-4 py-2 font-medium">{station.name}</td>
									<td className="px-4 py-2 text-right text-muted-foreground">
										{totalHours.toFixed(1)}
									</td>
									<td
										className={`px-4 py-2 text-right ${
											overtimeHours > 20
												? "font-bold text-destructive"
												: "text-muted-foreground"
										}`}
									>
										{overtimeHours.toFixed(1)}
									</td>
									<td className="px-4 py-2 text-right font-bold">${costPerUnit.toFixed(2)}</td>
									<td className="px-4 py-2">
										{costPerUnit > benchmarkData.costPerUnit.target ? (
											<span className="font-bold text-destructive">OVER</span>
										) : (
											<span className="text-primary">OK</span>
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

function TrendsSection({ displays }: { displays: NonNullable<AnalyticsSectionDisplayPromises["trends"]> }) {
	return (
		<div className="space-y-6">
			<Suspense fallback={<TrendKpisSkeleton />}>
				<TrendKpis promise={displays.kpis} />
			</Suspense>

			<Suspense fallback={<TrendChartsSkeleton />}>
				<TrendCharts promise={displays.charts} />
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
}: {
	promise: NonNullable<AnalyticsSectionDisplayPromises["trends"]>["charts"];
}) {
	const result = useCachedDisplay("charts", promise);
	if (result.error || !result.data) {
		return <AnalyticsErrorCard message={result.error ?? "Unable to load trend charts."} />;
	}

	const { productivityTrends, laborCostTrends } = result.data;

	return (
		<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
			<LineChart title="Productivity Momentum" data={productivityTrends} height={320} />
			<LineChart title="Cost Efficiency" data={laborCostTrends} height={320} />
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

	return (
		<Card className="overflow-hidden">
			<CardHeader className="border-b border-border/50 bg-muted/30 py-3">
				<CardTitle className="text-sm font-industrial uppercase tracking-widest text-muted-foreground">
					Detected Anomalies & Alerts
				</CardTitle>
			</CardHeader>
			<div className="overflow-x-auto">
				<table className="w-full">
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
										variant={
											anomaly.severity === "high"
												? "destructive"
												: "secondary"
										}
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
}: {
	displays: NonNullable<AnalyticsSectionDisplayPromises["capacity"]>;
}) {
	return (
		<div className="space-y-6">
			<p className="text-xs font-mono text-muted-foreground">
				Utilization is calculated as active staff divided by configured station capacity; staff
				shortage compares active staffing against currently scheduled required headcount.
			</p>

			<Suspense fallback={<CapacityKpisSkeleton />}>
				<CapacityKpis promise={displays.kpis} />
			</Suspense>

			<Suspense fallback={<CapacityFloorSkeleton />}>
				<CapacityFloor promise={displays.floor} />
			</Suspense>
		</div>
	);
}

function CapacityKpis({
	promise,
}: {
	promise: NonNullable<AnalyticsSectionDisplayPromises["capacity"]>["kpis"];
}) {
	const { data: result, isCached } = useCachedDisplayState("kpis", promise);
	if (result.error || !result.data) {
		return <AnalyticsErrorCard message={result.error ?? "Unable to load capacity KPIs."} />;
	}

	const { capacityData } = result.data;

	return (
		<div className="grid grid-cols-1 gap-4 md:grid-cols-4">
			<KPICard
				title="Overall Utilization"
				value={`${capacityData.overall.currentUtilization}%`}
				subtitle={`Target: ${capacityData.overall.optimalUtilization}%`}
				icon="industry"
				animateCountUp={!isCached}
			/>
			<KPICard
				title="Staff Shortage"
				value={capacityData.overall.staffShortage}
				subtitle="Positions Needed"
				icon="users"
				animateCountUp={!isCached}
				trend={{ direction: "down", value: "Critical", label: "Impact High" }}
			/>
			<KPICard
				title="Cost Impact"
				value={`$${capacityData.overall.costImpact.toLocaleString()}`}
				subtitle="Weekly Opportunity"
				icon="dollar"
				animateCountUp={!isCached}
			/>
			<KPICard
				title="Bottlenecks"
				value={capacityData.stations.filter((station) => station.utilization < 60).length}
				subtitle="Stations Underutilized"
				icon="chart"
				animateCountUp={!isCached}
			/>
		</div>
	);
}

function CapacityFloor({
	promise,
}: {
	promise: NonNullable<AnalyticsSectionDisplayPromises["capacity"]>["floor"];
}) {
	const result = useCachedDisplay("floor", promise);
	if (result.error || !result.data) {
		return <AnalyticsErrorCard message={result.error ?? "Unable to load warehouse floor."} />;
	}

	const { capacityData, liveFloorData } = result.data;

	return (
		<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
			<div className="lg:col-span-2">
				<WarehouseFloor data={liveFloorData} metric="occupancy" />
			</div>
			<div className="space-y-4 lg:col-span-1">
				{capacityData.stations.slice(0, 3).map((station) => (
					<Card key={station.name} className="overflow-hidden">
						<CardHeader className="border-b border-border/50 bg-muted/30 py-2">
							<div className="flex items-center justify-between">
								<CardTitle className="text-xs font-industrial uppercase tracking-widest">
									{station.name}
								</CardTitle>
								<span
									className={`text-[10px] font-mono font-bold ${
										station.utilization > 90
											? "text-destructive"
											: station.utilization > 70
												? "text-primary"
												: "text-muted-foreground"
									}`}
								>
									{station.utilization}% UTIL
								</span>
							</div>
						</CardHeader>
						<CardBody className="space-y-2 p-3">
							<div className="flex justify-between text-xs font-mono">
								<span className="text-muted-foreground">Staffing:</span>
								<span>
									{station.currentStaff} / {station.requiredStaff}
								</span>
							</div>
							<div className="flex justify-between text-xs font-mono">
								<span className="text-muted-foreground">Rec:</span>
								<span className="font-bold text-primary">
									{station.recommendedStaff} (+
									{station.recommendedStaff - station.currentStaff})
								</span>
							</div>
							<div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted/50">
								<div
									className="h-full bg-primary"
									style={{ width: `${station.utilization}%` }}
								/>
							</div>
						</CardBody>
					</Card>
				))}
			</div>
		</div>
	);
}

function BenchmarksSection({
	displays,
}: {
	displays: NonNullable<AnalyticsSectionDisplayPromises["benchmarks"]>;
}) {
	return (
		<div className="space-y-6">
			<Suspense fallback={<BenchmarkKpisSkeleton />}>
				<BenchmarkKpis promise={displays.kpis} />
			</Suspense>

			<Suspense fallback={<BenchmarkChartsSkeleton />}>
				<BenchmarkCharts promise={displays.charts} />
			</Suspense>

			<Suspense fallback={<BenchmarkStationTableSkeleton />}>
				<BenchmarkStationTable promise={displays.stationTable} />
			</Suspense>
		</div>
	);
}

function BenchmarkKpis({
	promise,
}: {
	promise: NonNullable<AnalyticsSectionDisplayPromises["benchmarks"]>["kpis"];
}) {
	const { data: result, isCached } = useCachedDisplayState("kpis", promise);
	if (result.error || !result.data) {
		return <AnalyticsErrorCard message={result.error ?? "Unable to load benchmark KPIs."} />;
	}

	const { benchmarkData } = result.data;
	const productivityDeltaVsIndustry =
		benchmarkData.productivity.current - benchmarkData.productivity.industryAvg;
	const costDeltaVsIndustry = benchmarkData.costPerUnit.current - benchmarkData.costPerUnit.industryAvg;
	const qualityDeltaVsIndustry = benchmarkData.quality.current - benchmarkData.quality.industryAvg;

	return (
		<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
			<KPICard
				title="Productivity Position"
				value={`${benchmarkData.productivity.current} u/h`}
				subtitle={`Industry: ${benchmarkData.productivity.industryAvg} u/h`}
				icon="chart"
				animateCountUp={!isCached}
				trend={{
					direction: productivityDeltaVsIndustry >= 0 ? "up" : "down",
					value: `${productivityDeltaVsIndustry >= 0 ? "+" : ""}${productivityDeltaVsIndustry.toFixed(1)} u/h`,
					label: "vs industry avg",
				}}
			/>
			<KPICard
				title="Cost Position"
				value={`$${benchmarkData.costPerUnit.current.toFixed(2)}`}
				subtitle={`Target: $${benchmarkData.costPerUnit.target.toFixed(2)}`}
				icon="dollar"
				animateCountUp={!isCached}
				trend={{
					direction: costDeltaVsIndustry <= 0 ? "up" : "down",
					value: `${costDeltaVsIndustry >= 0 ? "+" : ""}${costDeltaVsIndustry.toFixed(2)}`,
					label: "vs industry avg",
				}}
			/>
			<KPICard
				title="Quality Position"
				value={`${benchmarkData.quality.current}%`}
				subtitle={`Top Decile: ${benchmarkData.quality.top10Percent}%`}
				icon="percent"
				animateCountUp={!isCached}
				trend={{
					direction: qualityDeltaVsIndustry >= 0 ? "up" : "down",
					value: `${qualityDeltaVsIndustry >= 0 ? "+" : ""}${qualityDeltaVsIndustry.toFixed(1)} pts`,
					label: "vs industry avg",
				}}
			/>
		</div>
	);
}

function BenchmarkCharts({
	promise,
}: {
	promise: NonNullable<AnalyticsSectionDisplayPromises["benchmarks"]>["charts"];
}) {
	const result = useCachedDisplay("charts", promise);
	if (result.error || !result.data) {
		return <AnalyticsErrorCard message={result.error ?? "Unable to load benchmark charts."} />;
	}

	const { benchmarkData } = result.data;

	const productivityBenchmarkChart = {
		labels: ["Industry Avg", "Current", "Target", "Top 10%"],
		datasets: [
			{
				label: "Units per Hour",
				data: [
					benchmarkData.productivity.industryAvg,
					benchmarkData.productivity.current,
					benchmarkData.productivity.target,
					benchmarkData.productivity.top10Percent,
				],
				color: "#e07426",
			},
		],
	};

	const costBenchmarkChart = {
		labels: ["Bottom 10%", "Target", "Current", "Industry Avg"],
		datasets: [
			{
				label: "Cost per Unit",
				data: [
					benchmarkData.costPerUnit.bottom10Percent,
					benchmarkData.costPerUnit.target,
					benchmarkData.costPerUnit.current,
					benchmarkData.costPerUnit.industryAvg,
				],
				color: "#ef4444",
			},
		],
	};

	return (
		<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
			<BarChart title="Productivity Benchmark Ladder" data={productivityBenchmarkChart} height={300} />
			<BarChart title="Cost Benchmark Ladder (Lower Is Better)" data={costBenchmarkChart} height={300} />
		</div>
	);
}

function BenchmarkStationTable({
	promise,
}: {
	promise: NonNullable<AnalyticsSectionDisplayPromises["benchmarks"]>["stationTable"];
}) {
	const result = useCachedDisplay("station-table", promise);
	if (result.error || !result.data) {
		return <AnalyticsErrorCard message={result.error ?? "Unable to load benchmark table."} />;
	}

	const { stationSnapshots, benchmarkData } = result.data;

	const stationBenchmarkRows = stationSnapshots
		.map((station) => {
			const vsIndustry = station.efficiency - benchmarkData.productivity.industryAvg;
			const vsTarget = station.efficiency - benchmarkData.productivity.target;

			let status: "TOP 10%" | "ABOVE AVG" | "BELOW AVG" = "BELOW AVG";
			if (station.efficiency >= benchmarkData.productivity.top10Percent) {
				status = "TOP 10%";
			} else if (station.efficiency >= benchmarkData.productivity.industryAvg) {
				status = "ABOVE AVG";
			}

			return {
				...station,
				vsIndustry,
				vsTarget,
				status,
			};
		})
		.sort((a, b) => b.efficiency - a.efficiency);

	return (
		<Card className="overflow-hidden">
			<CardHeader className="border-b border-border/50 bg-muted/30 py-3">
				<CardTitle className="text-sm font-industrial uppercase tracking-widest text-muted-foreground">
					Station Benchmark Positioning
				</CardTitle>
			</CardHeader>
			<div className="overflow-x-auto">
				<table className="w-full">
					<thead>
						<tr className="border-b border-border/50 bg-muted/10 text-[10px] font-industrial uppercase tracking-widest text-muted-foreground">
							<th className="px-4 py-3 text-left font-medium">Station</th>
							<th className="px-4 py-3 text-right font-medium">Efficiency</th>
							<th className="px-4 py-3 text-right font-medium">Vs Industry</th>
							<th className="px-4 py-3 text-right font-medium">Vs Target</th>
							<th className="px-4 py-3 text-left font-medium">Tier</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-border/30">
						{stationBenchmarkRows.length > 0 ? (
							stationBenchmarkRows.map((station) => (
								<tr
									key={station.name}
									className="text-xs font-mono transition-colors hover:bg-muted/20"
								>
									<td className="px-4 py-2.5 font-medium">{station.name}</td>
									<td className="px-4 py-2.5 text-right font-bold">
										{station.efficiency.toFixed(1)}
									</td>
									<td
										className={`px-4 py-2.5 text-right ${
											station.vsIndustry >= 0 ? "text-primary" : "text-destructive"
										}`}
									>
										{station.vsIndustry >= 0 ? "+" : ""}
										{station.vsIndustry.toFixed(1)}
									</td>
									<td
										className={`px-4 py-2.5 text-right ${
											station.vsTarget >= 0 ? "text-primary" : "text-muted-foreground"
										}`}
									>
										{station.vsTarget >= 0 ? "+" : ""}
										{station.vsTarget.toFixed(1)}
									</td>
									<td className="px-4 py-2.5">
										{station.status === "TOP 10%" ? (
											<span className="font-bold text-primary">TOP 10%</span>
										) : station.status === "ABOVE AVG" ? (
											<span className="text-secondary">ABOVE AVG</span>
										) : (
											<span className="text-muted-foreground">BELOW AVG</span>
										)}
									</td>
								</tr>
							))
						) : (
							<tr>
								<td colSpan={5} className="px-4 py-6 text-center text-xs font-mono text-muted-foreground">
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
		<Card className="border-destructive/50 bg-destructive/5">
			<CardBody className="p-6">
				<div className="text-xs font-bold font-industrial uppercase tracking-widest text-destructive">
					Data Load Error
				</div>
				<p className="mt-2 text-sm font-mono text-muted-foreground">{message}</p>
			</CardBody>
		</Card>
	);
}
