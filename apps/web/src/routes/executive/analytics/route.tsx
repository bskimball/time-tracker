"use client";

import { useSearchParams } from "react-router";
import {
	Card,
	CardHeader,
	CardTitle,
	CardBody,
	Badge,
	Button,
	Metric,
} from "@monorepo/design-system";
import { LineChart, BarChart, PieChart } from "~/routes/executive/charts";
import { SectionTabs } from "./section-tabs";
import { TimeRangeTabs } from "../time-range-tabs";
import { ComparisonTabs } from "./comparison-tabs";
import { PageHeader } from "~/components/page-header";
import { useEffect, useState } from "react";
import WarehouseFloor from "./components/WarehouseFloor";
import { KPICard } from "~/routes/executive/kpi-card";
import {
	getProductivityTrendData,
	getLaborCostTrendData,
	getStationEfficiencyData,
	getCostBreakdownData,
	getShiftProductivityData,
	getTaskTypeEfficiencyData,
	getBenchmarkData,
	getAnomalyData,
	getCapacityUtilizationData,
	getTrendAnalysisData,
	getEmployeeProductivityRanking,
	getComparativeAnalyticsData,
	type ComparisonBasis,
	fetchAnalyticsDashboardData,
	fetchLiveFloorData,
	type Anomaly,
} from "./actions";
import type { AnalyticsDashboardData, AnalyticsStationOverview, LiveFloorData } from "./types";
import {
	LiaChartBarSolid,
	LiaDownloadSolid,
	LiaFileAltSolid,
} from "react-icons/lia";

type AnalyticsSection = "productivity" | "labor-cost" | "trends" | "capacity" | "benchmarks";
type AnalyticsRange = "today" | "week" | "month" | "quarter";
type AnalyticsComparison = ComparisonBasis;

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

function isAnalyticsSection(value: string | null): value is AnalyticsSection {
	return value !== null && analyticsSections.has(value as AnalyticsSection);
}

function isAnalyticsRange(value: string | null): value is AnalyticsRange {
	return value !== null && analyticsRanges.has(value as AnalyticsRange);
}

function isAnalyticsComparison(value: string | null): value is AnalyticsComparison {
	return value !== null && analyticsComparisons.has(value as AnalyticsComparison);
}

type AnalyticsData = {
	productivityTrends: Awaited<ReturnType<typeof getProductivityTrendData>>;
	laborCostTrends: Awaited<ReturnType<typeof getLaborCostTrendData>>;
	stationEfficiency: Awaited<ReturnType<typeof getStationEfficiencyData>>;
	costBreakdown: Awaited<ReturnType<typeof getCostBreakdownData>>;
	shiftProductivity: Awaited<ReturnType<typeof getShiftProductivityData>>;
	taskTypeEfficiency: Awaited<ReturnType<typeof getTaskTypeEfficiencyData>>;
	benchmarkData: Awaited<ReturnType<typeof getBenchmarkData>>;
	anomalyData: Anomaly[];
	capacityData: Awaited<ReturnType<typeof getCapacityUtilizationData>>;
	trendData: Awaited<ReturnType<typeof getTrendAnalysisData>>;
	employeeProductivity: Awaited<ReturnType<typeof getEmployeeProductivityRanking>>;
	dashboardData: AnalyticsDashboardData;
	liveFloorData: LiveFloorData;
	comparativeData: Awaited<ReturnType<typeof getComparativeAnalyticsData>>;
};

export default function Component() {
	const searchParams = useSearchParams()[0];
	const sectionParam = searchParams.get("section");
	const rangeParam = searchParams.get("range");
	const compareParam = searchParams.get("compare");
	const section = isAnalyticsSection(sectionParam) ? sectionParam : "productivity";
	const range = isAnalyticsRange(rangeParam) ? rangeParam : "week";
	const compareBasis = isAnalyticsComparison(compareParam) ? compareParam : "previous-period";

	const [data, setData] = useState<AnalyticsData | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function loadData() {
			setLoading(true);
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

				setData({
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
				});
			} catch (error) {
				console.error("Failed to load analytics data:", error);
			} finally {
				setLoading(false);
			}
		}

		loadData();
	}, [section, range, compareBasis]);

	const {
		productivityTrends = { labels: [], datasets: [] },
		laborCostTrends = { labels: [], datasets: [] },
		stationEfficiency = { labels: [], datasets: [] },
		costBreakdown = [],
		shiftProductivity = { labels: [], datasets: [] },
		taskTypeEfficiency = { labels: [], datasets: [] },
		benchmarkData = {
			productivity: { current: 28.5, target: 30.0, top10Percent: 35.0, industryAvg: 25.0 },
			costPerUnit: { current: 18.5, target: 17.0, industryAvg: 19.0, bottom10Percent: 15.0 },
			quality: { current: 96.5, target: 95.0, industryAvg: 92.3, top10Percent: 97.8 },
		},
		anomalyData = [],
		capacityData = {
			stations: [],
			overall: {
				currentUtilization: 0,
				optimalUtilization: 80,
				staffShortage: 0,
				costImpact: 0,
			},
		},
		trendData = {
			productivity: { changePercent: 5.2, trend: "up" },
			costs: { changePercent: -2.1, trend: "down", forecast: 18.2, confidence: 85 },
			quality: { changePercent: 1.8, trend: "up" },
			seasonal: { peakShift: "morning", peakDay: "Wednesday", seasonalFactor: 1.15 },
		},
		employeeProductivity = [],
		dashboardData = {
			stations: [],
			costSummary: {
				regular: 0,
				overtime: 0,
				total: 0,
				variance: 0,
				variancePercent: 0,
			},
		},
		liveFloorData = { zones: [] },
		comparativeData = {
			currentWindow: { start: new Date().toISOString(), end: new Date().toISOString() },
			comparisonWindow: { start: new Date().toISOString(), end: new Date().toISOString() },
			summary: {
				productivity: { current: 0, comparison: 0, changePercent: 0 },
				costPerUnit: { current: 0, comparison: 0, changePercent: 0 },
				throughput: { current: 0, comparison: 0, changePercent: 0 },
			},
			charts: {
				productivityComparison: { labels: [], datasets: [] },
				costComparison: { labels: [], datasets: [] },
			},
		},
	} = data || {};

	const { costSummary, stations: stationSnapshots } = dashboardData;
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const currentWindowLabel = `${new Date(comparativeData.currentWindow.start).toLocaleDateString()} - ${new Date(comparativeData.currentWindow.end).toLocaleDateString()}`;
	const comparisonWindowLabel = `${new Date(comparativeData.comparisonWindow.start).toLocaleDateString()} - ${new Date(comparativeData.comparisonWindow.end).toLocaleDateString()}`;

	return (
		<div className="space-y-8 pb-12">
			{/* ── Header ──────────────────────────────────────────────────────── */}
			<div className="animate-fade-in">
				<PageHeader
					title="Analytics & Reporting"
					subtitle="Comprehensive workforce productivity, financial metrics, and operational insights"
					actions={
						<div className="flex items-center gap-2">
							<Button variant="outline" size="sm" className="gap-2">
								<LiaDownloadSolid className="w-4 h-4" />
								Export Data
							</Button>
							<Button variant="primary" size="sm" className="gap-2">
								<LiaFileAltSolid className="w-4 h-4" />
								Generate Report
							</Button>
						</div>
					}
				/>
			</div>

			{/* ── Controls ────────────────────────────────────────────────────── */}
			<div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm pb-4 pt-2 border-b border-border/40 -mx-4 px-4 sm:mx-0 sm:px-0 sm:border-0 sm:bg-transparent sm:backdrop-blur-none sm:static sm:pb-0 sm:pt-0">
				<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
					<SectionTabs />
					<div className="flex flex-col items-end gap-1">
						<div className="flex flex-col sm:flex-row sm:items-center gap-4">
							<div className="flex items-center gap-2">
								<span className="text-[10px] font-industrial uppercase tracking-widest text-muted-foreground hidden sm:inline-block">
									Range
								</span>
								<TimeRangeTabs defaultRange="week" />
							</div>
							<div className="flex items-center gap-2">
								<span className="text-[10px] font-industrial uppercase tracking-widest text-muted-foreground hidden sm:inline-block">
									Compare
								</span>
								<ComparisonTabs />
							</div>
						</div>
						{compareParam && (
							<div className="text-[10px] font-mono text-muted-foreground text-right hidden sm:block">
								{currentWindowLabel} vs {comparisonWindowLabel}
							</div>
						)}
					</div>
				</div>
			</div>

			{loading || !data ? (
				<div className="flex flex-col items-center justify-center py-24 space-y-4">
					<div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
					<div className="text-sm font-mono text-muted-foreground animate-pulse">
						LOADING_ANALYTICS_DATA...
					</div>
				</div>
			) : (
				<>
					{/* ── Productivity Section ────────────────────────────────────────── */}
					{section === "productivity" && (
						<div className="space-y-6 animate-fade-in-up">
							{/* KPIs */}
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
								<KPICard
									title="Avg Units/Hour"
									value={benchmarkData.productivity.current}
									subtitle="Current Period Average"
									icon="chart"
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
									trend={{
										direction: "up",
										value: "Top 10%",
										label: "Industry Benchmark",
									}}
								/>
								<KPICard
									title="Task Completion"
									value={`${benchmarkData.quality.current}%`}
									subtitle="On-Time Rate"
									icon="percent"
									trend={{
										direction: "neutral",
										value: "95%",
										label: "Target",
									}}
								/>
								<Card className="h-full border-l-4 border-l-destructive bg-destructive/5">
									<CardBody className="p-4 flex flex-col justify-between h-full">
										<div>
											<div className="text-xs font-industrial uppercase tracking-widest text-destructive mb-1">
												Bottleneck Alert
											</div>
											<div className="text-2xl font-bold font-data text-foreground">
												RECEIVING
											</div>
											<div className="text-xs text-muted-foreground font-mono mt-1">
												45% Utilization
											</div>
										</div>
										<div className="mt-4 pt-3 border-t border-destructive/20">
											<div className="flex items-center gap-2 text-xs text-destructive font-medium">
												<span className="w-1.5 h-1.5 rounded-full bg-destructive animate-pulse" />
												Requires Attention
											</div>
										</div>
									</CardBody>
								</Card>
							</div>

							{/* Main Charts */}
							<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
								<LineChart
									title="Productivity Trends Over Time"
									data={productivityTrends}
									height={320}
								/>
								<BarChart
									title="Station Efficiency Comparison"
									data={stationEfficiency}
									height={320}
								/>
							</div>

							<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
								<BarChart
									title="Task Type Efficiency"
									data={taskTypeEfficiency}
									height={320}
								/>
								<BarChart
									title="Shift Productivity"
									data={shiftProductivity}
									height={320}
								/>
							</div>

							{/* Station Performance Grid */}
							<div>
								<h3 className="text-sm font-industrial font-bold text-muted-foreground mb-4 uppercase tracking-widest">
									Station Performance Breakdown
								</h3>
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
									{stationSnapshots.map((station: AnalyticsStationOverview) => (
										<Card key={station.name} className="overflow-hidden">
											<CardHeader className="bg-muted/30 border-b border-border/50 py-2">
												<div className="flex items-center justify-between">
													<CardTitle className="uppercase tracking-widest font-industrial text-xs">
														{station.name}
													</CardTitle>
													<div
														className={`w-2 h-2 rounded-full ${
															station.occupancy > 85
																? "bg-destructive"
																: station.occupancy > 70
																	? "bg-primary"
																	: "bg-secondary"
														}`}
													/>
												</div>
											</CardHeader>
											<CardBody className="p-4 space-y-3">
												<div className="grid grid-cols-2 gap-2">
													<div>
														<div className="text-[10px] text-muted-foreground uppercase tracking-wide">
															Eff.
														</div>
														<div className="font-mono font-bold text-lg">
															{station.efficiency}
														</div>
													</div>
													<div>
														<div className="text-[10px] text-muted-foreground uppercase tracking-wide">
															Occ.
														</div>
														<div className="font-mono font-bold text-lg">
															{station.occupancy}%
														</div>
													</div>
												</div>
												<div className="w-full bg-muted/50 h-1.5 rounded-full overflow-hidden">
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
												<div className="flex justify-between items-center text-xs text-muted-foreground font-mono">
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

							{/* Employee Ranking Table */}
							<Card className="overflow-hidden">
								<CardHeader className="bg-muted/30 border-b border-border/50 py-3">
									<CardTitle className="uppercase tracking-widest font-industrial text-sm text-muted-foreground">
										Employee Productivity Rankings
									</CardTitle>
								</CardHeader>
								<div className="overflow-x-auto">
									<table className="w-full">
										<thead>
											<tr className="border-b border-border/50 bg-muted/10 text-[10px] font-industrial uppercase tracking-widest text-muted-foreground">
												<th className="text-left py-3 px-4 font-medium">Employee</th>
												<th className="text-right py-3 px-4 font-medium">Units</th>
												<th className="text-right py-3 px-4 font-medium">Hours</th>
												<th className="text-right py-3 px-4 font-medium">Rate (u/h)</th>
												<th className="text-left py-3 px-4 font-medium">Station</th>
												<th className="text-left py-3 px-4 font-medium">Performance</th>
											</tr>
										</thead>
										<tbody className="divide-y divide-border/30">
											{employeeProductivity.map((employee, index) => (
												<tr key={index} className="text-xs font-mono hover:bg-muted/20 transition-colors">
													<td className="py-2.5 px-4 font-medium">{employee.employee}</td>
													<td className="text-right py-2.5 px-4 text-muted-foreground">-</td>
													<td className="text-right py-2.5 px-4 text-muted-foreground">-</td>
													<td className="text-right py-2.5 px-4 font-bold text-foreground">
														{employee.value}
													</td>
													<td className="py-2.5 px-4">
														<Badge variant="secondary" className="text-[10px] h-5">
															{employee.station}
														</Badge>
													</td>
													<td className="py-2.5 px-4">
														{employee.value >= benchmarkData.productivity.top10Percent ? (
															<span className="text-primary font-bold">TOP 10%</span>
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
						</div>
					)}

					{/* ── Labor Cost Section ────────────────────────────────────────── */}
					{section === "labor-cost" && (
						<div className="space-y-6 animate-fade-in-up">
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
								<KPICard
									title="Regular Hours"
									value={`$${costSummary.regular.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
									subtitle="840 Hours Logged"
									icon="clock"
								/>
								<KPICard
									title="Overtime Cost"
									value={`$${costSummary.overtime.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
									subtitle="95 Hours Logged"
									icon="dollar"
									trend={{
										direction: "down",
										value: "-5%",
										label: "vs last period",
									}}
								/>
								<KPICard
									title="Total Cost"
									value={`$${costSummary.total.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
									subtitle="Combined Labor"
									icon="dollar"
								/>
								<Card
									className={`h-full border-l-4 ${costSummary.variance > 0 ? "border-l-destructive bg-destructive/5" : "border-l-primary bg-primary/5"}`}
								>
									<CardBody className="p-4 flex flex-col justify-between h-full">
										<div>
											<div
												className={`text-xs font-industrial uppercase tracking-widest mb-1 ${costSummary.variance > 0 ? "text-destructive" : "text-primary"}`}
											>
												Budget Variance
											</div>
											<div className="text-2xl font-bold font-data text-foreground">
												{costSummary.variance > 0 ? "+" : ""}
												{costSummary.variance.toLocaleString(undefined, {
													maximumFractionDigits: 0,
												})}
											</div>
											<div className="text-xs text-muted-foreground font-mono mt-1">
												{costSummary.variancePercent}% vs budget
											</div>
										</div>
									</CardBody>
								</Card>
							</div>

							<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
								<LineChart
									title="Labor Cost Trends (Cost per Unit)"
									data={laborCostTrends}
									height={320}
								/>
								<BarChart
									title="Shift Productivity vs Cost"
									data={shiftProductivity}
									height={320}
								/>
							</div>

							<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
								<div className="lg:col-span-1">
									<PieChart title="Labor Cost Breakdown" data={costBreakdown} height={300} />
								</div>
								<div className="lg:col-span-2">
									<Card className="h-full flex flex-col">
										<CardHeader className="bg-muted/30 border-b border-border/50 py-3">
											<CardTitle className="uppercase tracking-widest font-industrial text-sm text-muted-foreground">
												Cost Analysis by Station
											</CardTitle>
										</CardHeader>
										<div className="overflow-x-auto flex-1">
											<table className="w-full">
												<thead>
													<tr className="border-b border-border/50 bg-muted/10 text-[10px] font-industrial uppercase tracking-widest text-muted-foreground">
														<th className="text-left py-2 px-4">Station</th>
														<th className="text-right py-2 px-4">Total Hours</th>
														<th className="text-right py-2 px-4">OT Hours</th>
														<th className="text-right py-2 px-4">Cost/Unit</th>
														<th className="text-left py-2 px-4">Status</th>
													</tr>
												</thead>
												<tbody className="divide-y divide-border/30">
													{stationSnapshots.map((station) => {
														const regularHours = 156.8;
														const overtimeHours = station.name === "FILLING" ? 25.5 : 12.5;
														const totalHours = regularHours + overtimeHours;
														const totalCost = totalHours * 18.55;
														const costPerUnit =
															totalCost / ((station.efficiency * totalHours) / 8);

														return (
															<tr
																key={station.name}
																className="text-xs font-mono hover:bg-muted/20 transition-colors"
															>
																<td className="py-2 px-4 font-medium">{station.name}</td>
																<td className="text-right py-2 px-4 text-muted-foreground">
																	{totalHours.toFixed(1)}
																</td>
																<td
																	className={`text-right py-2 px-4 ${overtimeHours > 20 ? "text-destructive font-bold" : "text-muted-foreground"}`}
																>
																	{overtimeHours.toFixed(1)}
																</td>
																<td className="text-right py-2 px-4 font-bold">
																	${costPerUnit.toFixed(2)}
																</td>
																<td className="py-2 px-4">
																	{costPerUnit > benchmarkData.costPerUnit.target ? (
																		<span className="text-destructive font-bold">OVER</span>
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
								</div>
							</div>
						</div>
					)}

					{/* ── Trends Section ────────────────────────────────────────────── */}
					{section === "trends" && (
						<div className="space-y-6 animate-fade-in-up">
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								<Metric
									label="Productivity Trend"
									value={`${trendData.productivity.changePercent > 0 ? "+" : ""}${trendData.productivity.changePercent}%`}
									trendDirection={trendData.productivity.trend as any}
									className="bg-card border border-border rounded-lg p-6"
								/>
								<Metric
									label="Cost Trend"
									value={`${trendData.costs.changePercent > 0 ? "+" : ""}${trendData.costs.changePercent}%`}
									trendDirection={trendData.costs.trend as any}
									className="bg-card border border-border rounded-lg p-6"
								/>
								<Metric
									label="Quality Trend"
									value={`${trendData.quality.changePercent > 0 ? "+" : ""}${trendData.quality.changePercent}%`}
									trendDirection={trendData.quality.trend as any}
									className="bg-card border border-border rounded-lg p-6"
								/>
							</div>

							<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
								<LineChart
									title="Productivity Momentum"
									data={productivityTrends}
									height={320}
								/>
								<LineChart title="Cost Efficiency" data={laborCostTrends} height={320} />
							</div>

							<Card className="overflow-hidden">
								<CardHeader className="bg-muted/30 border-b border-border/50 py-3">
									<CardTitle className="uppercase tracking-widest font-industrial text-sm text-muted-foreground">
										Detected Anomalies & Alerts
									</CardTitle>
								</CardHeader>
								<div className="overflow-x-auto">
									<table className="w-full">
										<thead>
											<tr className="border-b border-border/50 bg-muted/10 text-[10px] font-industrial uppercase tracking-widest text-muted-foreground">
												<th className="text-left py-3 px-4">Severity</th>
												<th className="text-left py-3 px-4">Type</th>
												<th className="text-left py-3 px-4">Description</th>
												<th className="text-right py-3 px-4">Impact</th>
												<th className="text-right py-3 px-4">Action</th>
											</tr>
										</thead>
										<tbody className="divide-y divide-border/30">
											{anomalyData.map((anomaly, index) => (
												<tr key={index} className="text-xs font-mono hover:bg-muted/20">
													<td className="py-2.5 px-4">
														<Badge
															variant={
																anomaly.severity === "high"
																	? "destructive"
																	: anomaly.severity === "medium"
																		? "secondary" // Was warning, mapped to secondary
																		: "secondary"
															}
															className={`uppercase text-[10px] h-5 ${
																anomaly.severity === "medium"
																	? "bg-warning/20 text-warning border-warning"
																	: ""
															}`}
														>
															{anomaly.severity}
														</Badge>
													</td>
													<td className="py-2.5 px-4 uppercase text-muted-foreground">
														{anomaly.type}
													</td>
													<td className="py-2.5 px-4 font-medium">{anomaly.description}</td>
													<td className="text-right py-2.5 px-4">{anomaly.impact}</td>
													<td className="text-right py-2.5 px-4">
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
						</div>
					)}

					{/* ── Capacity Section ──────────────────────────────────────────── */}
					{section === "capacity" && (
						<div className="space-y-6 animate-fade-in-up">
							<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
								<KPICard
									title="Overall Utilization"
									value={`${capacityData.overall.currentUtilization}%`}
									subtitle={`Target: ${capacityData.overall.optimalUtilization}%`}
									icon="industry"
								/>
								<KPICard
									title="Staff Shortage"
									value={capacityData.overall.staffShortage}
									subtitle="Positions Needed"
									icon="users"
									trend={{
										direction: "down",
										value: "Critical",
										label: "Impact High",
									}}
								/>
								<KPICard
									title="Cost Impact"
									value={`$${capacityData.overall.costImpact.toLocaleString()}`}
									subtitle="Weekly Opportunity"
									icon="dollar"
								/>
								<KPICard
									title="Bottlenecks"
									value={capacityData.stations.filter((s) => s.utilization < 60).length}
									subtitle="Stations Underutilized"
									icon="chart"
								/>
							</div>

							<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
								<div className="lg:col-span-2">
									<WarehouseFloor data={liveFloorData} metric="occupancy" />
								</div>
								<div className="lg:col-span-1 space-y-4">
									{capacityData.stations.slice(0, 3).map((station) => (
										<Card key={station.name} className="overflow-hidden">
											<CardHeader className="bg-muted/30 border-b border-border/50 py-2">
												<div className="flex justify-between items-center">
													<CardTitle className="text-xs font-industrial uppercase tracking-widest">
														{station.name}
													</CardTitle>
													<span
														className={`text-[10px] font-bold font-mono ${
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
											<CardBody className="p-3 space-y-2">
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
												<div className="w-full bg-muted/50 h-1.5 rounded-full overflow-hidden mt-1">
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
						</div>
					)}

					{/* ── Benchmarks Section ────────────────────────────────────────── */}
					{section === "benchmarks" && (
						<div className="space-y-6 animate-fade-in-up">
							<Card className="bg-muted/10 border-dashed border-2">
								<CardBody className="p-8 text-center">
									<LiaChartBarSolid className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
									<h3 className="font-industrial uppercase tracking-widest text-lg font-bold text-muted-foreground">
										Industry Benchmarks
									</h3>
									<p className="text-sm text-muted-foreground max-w-md mx-auto mt-2 font-mono">
										Advanced industry comparison data is currently being aggregated. Check back
										for peer comparisons and sector analysis.
									</p>
								</CardBody>
							</Card>
						</div>
					)}
				</>
			)}
		</div>
	);
}
