"use client";

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
import WarehouseFloor from "./components/WarehouseFloor";
import { KPICard } from "~/routes/executive/kpi-card";
import type { AnalyticsStationOverview } from "./types";
import { LiaDownloadSolid, LiaFileAltSolid } from "react-icons/lia";
import type { AnalyticsComparison, AnalyticsData, AnalyticsSection } from "./model";

function toMetricTrendDirection(value: string): "up" | "down" | "neutral" {
	if (value === "up" || value === "down" || value === "neutral") {
		return value;
	}

	return "neutral";
}

interface AnalyticsClientProps {
	section: AnalyticsSection;
	validComparisons: AnalyticsComparison[];
	data: AnalyticsData | null;
	error: string | null;
}

export function AnalyticsClient({ section, validComparisons, data, error }: AnalyticsClientProps) {

	const {
		productivityTrends = { labels: [], datasets: [] },
		laborCostTrends = { labels: [], datasets: [] },
		stationEfficiency = { labels: [], datasets: [] },
		costBreakdown = [],
		shiftProductivity = { labels: [], datasets: [] },
		taskTypeEfficiency = { labels: [], datasets: [] },
		benchmarkData = {
			productivity: { current: 0, target: 0, top10Percent: 0, industryAvg: 0 },
			costPerUnit: { current: 0, target: 0, industryAvg: 0, bottom10Percent: 0 },
			quality: { current: 0, target: 0, industryAvg: 0, top10Percent: 0 },
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
			currentWindow: { start: "", end: "" },
			comparisonWindow: { start: "", end: "" },
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
	const currentWindowLabel = data
		? `${new Date(comparativeData.currentWindow.start).toLocaleDateString()} - ${new Date(comparativeData.currentWindow.end).toLocaleDateString()}`
		: "--";
	const comparisonWindowLabel = data
		? `${new Date(comparativeData.comparisonWindow.start).toLocaleDateString()} - ${new Date(comparativeData.comparisonWindow.end).toLocaleDateString()}`
		: "--";
	const productivityDeltaVsIndustry =
		benchmarkData.productivity.current - benchmarkData.productivity.industryAvg;
	const costDeltaVsIndustry = benchmarkData.costPerUnit.current - benchmarkData.costPerUnit.industryAvg;
	const qualityDeltaVsIndustry = benchmarkData.quality.current - benchmarkData.quality.industryAvg;

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
			<div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm pt-2 border-b border-border -mx-4 px-4 sm:mx-0 sm:px-0 mb-6">
				<SectionTabs />

				<div className="py-3 flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
					{/* Left: Inputs */}
					<div className="flex flex-col sm:flex-row gap-4 sm:items-center">
						{/* Time Range */}
						<div className="flex items-center gap-3">
							<span className="text-[10px] font-industrial uppercase tracking-widest text-muted-foreground/60 font-bold shrink-0">
								Period
							</span>
							<TimeRangeTabs />
						</div>

						<div className="hidden sm:block h-4 w-px bg-border/50 mx-2" />

						{/* Comparison */}
						<div className="flex items-center gap-3">
							<span className="text-[10px] font-industrial uppercase tracking-widest text-muted-foreground/60 font-bold shrink-0">
								Comparison
							</span>
							<ComparisonTabs availableOptions={validComparisons} />
						</div>
					</div>

					{/* Right: Readout */}
					<div className="flex items-center justify-end">
						<div className="flex items-center gap-3 px-3 py-1.5 bg-muted/10 rounded-[2px] border border-border/40">
							<div className="flex items-center gap-2 border-r border-border/40 pr-3">
								<span className="relative flex h-1.5 w-1.5">
									<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
									<span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary"></span>
								</span>
								<span className="text-[10px] font-industrial uppercase tracking-widest text-muted-foreground font-bold">
									Active
								</span>
							</div>
							<div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-[10px] font-mono leading-none">
								<span className="text-foreground font-semibold">{currentWindowLabel}</span>
								<span className="hidden sm:inline text-muted-foreground/40">/</span>
								<span className="text-muted-foreground">{comparisonWindowLabel}</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			{error ? (
				<Card className="border-destructive/50 bg-destructive/5">
					<CardBody className="p-6">
						<div className="text-xs font-industrial uppercase tracking-widest text-destructive font-bold">
							Data Load Error
						</div>
						<p className="mt-2 text-sm font-mono text-muted-foreground">{error}</p>
					</CardBody>
				</Card>
			) : !data ? (
				<Card className="border-border/50">
					<CardBody className="p-6">
						<p className="text-sm font-mono text-muted-foreground">
							No analytics data available for the selected range.
						</p>
					</CardBody>
				</Card>
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
								trendDirection={toMetricTrendDirection(trendData.productivity.trend)}
								className="bg-card border border-border rounded-lg p-6"
							/>
							<Metric
								label="Cost Trend"
								value={`${trendData.costs.changePercent > 0 ? "+" : ""}${trendData.costs.changePercent}%`}
								trendDirection={toMetricTrendDirection(trendData.costs.trend)}
								className="bg-card border border-border rounded-lg p-6"
							/>
							<Metric
								label="Quality Trend"
								value={`${trendData.quality.changePercent > 0 ? "+" : ""}${trendData.quality.changePercent}%`}
								trendDirection={toMetricTrendDirection(trendData.quality.trend)}
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
							<p className="text-xs font-mono text-muted-foreground">
								Utilization is calculated as active staff divided by configured station capacity;
								staff shortage compares active staffing against currently scheduled required headcount.
							</p>
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
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
								<KPICard
									title="Productivity Position"
									value={`${benchmarkData.productivity.current} u/h`}
									subtitle={`Industry: ${benchmarkData.productivity.industryAvg} u/h`}
									icon="chart"
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
									trend={{
										direction: qualityDeltaVsIndustry >= 0 ? "up" : "down",
										value: `${qualityDeltaVsIndustry >= 0 ? "+" : ""}${qualityDeltaVsIndustry.toFixed(1)} pts`,
										label: "vs industry avg",
									}}
								/>
							</div>

							<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
								<BarChart
									title="Productivity Benchmark Ladder"
									data={productivityBenchmarkChart}
									height={300}
								/>
								<BarChart
									title="Cost Benchmark Ladder (Lower Is Better)"
									data={costBenchmarkChart}
									height={300}
								/>
							</div>

							<Card className="overflow-hidden">
								<CardHeader className="bg-muted/30 border-b border-border/50 py-3">
									<CardTitle className="uppercase tracking-widest font-industrial text-sm text-muted-foreground">
										Station Benchmark Positioning
									</CardTitle>
								</CardHeader>
								<div className="overflow-x-auto">
									<table className="w-full">
										<thead>
											<tr className="border-b border-border/50 bg-muted/10 text-[10px] font-industrial uppercase tracking-widest text-muted-foreground">
												<th className="text-left py-3 px-4 font-medium">Station</th>
												<th className="text-right py-3 px-4 font-medium">Efficiency</th>
												<th className="text-right py-3 px-4 font-medium">Vs Industry</th>
												<th className="text-right py-3 px-4 font-medium">Vs Target</th>
												<th className="text-left py-3 px-4 font-medium">Tier</th>
											</tr>
										</thead>
										<tbody className="divide-y divide-border/30">
											{stationBenchmarkRows.length > 0 ? (
												stationBenchmarkRows.map((station) => (
													<tr
														key={station.name}
														className="text-xs font-mono hover:bg-muted/20 transition-colors"
													>
														<td className="py-2.5 px-4 font-medium">{station.name}</td>
														<td className="text-right py-2.5 px-4 font-bold">
															{station.efficiency.toFixed(1)}
														</td>
														<td
															className={`text-right py-2.5 px-4 ${
																station.vsIndustry >= 0 ? "text-primary" : "text-destructive"
															}`}
														>
															{station.vsIndustry >= 0 ? "+" : ""}
															{station.vsIndustry.toFixed(1)}
														</td>
														<td
															className={`text-right py-2.5 px-4 ${
																station.vsTarget >= 0 ? "text-primary" : "text-muted-foreground"
															}`}
														>
															{station.vsTarget >= 0 ? "+" : ""}
															{station.vsTarget.toFixed(1)}
														</td>
														<td className="py-2.5 px-4">
															{station.status === "TOP 10%" ? (
																<span className="text-primary font-bold">TOP 10%</span>
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
													<td colSpan={5} className="py-6 px-4 text-center text-xs font-mono text-muted-foreground">
														No station benchmark data available for the selected window.
													</td>
												</tr>
											)}
										</tbody>
									</table>
								</div>
							</Card>
						</div>
					)}
				</>
			)}
		</div>
	);
}
