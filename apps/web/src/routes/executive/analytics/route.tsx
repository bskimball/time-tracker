"use client";

import { useSearchParams } from "react-router";
import { Card, CardHeader, CardTitle, CardBody } from "@monorepo/design-system";
import { Button } from "@monorepo/design-system";
import { LineChart, BarChart, PieChart } from "~/routes/executive/charts";
import { SectionTabs } from "./section-tabs";
import { AnalyticsTimeRangeTabs } from "./time-range-tabs";
import { PageHeader } from "~/components/page-header";
import { useEffect, useState } from "react";
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
	type Anomaly,
} from "./actions";

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
};

export default function Component() {
	const searchParams = useSearchParams()[0];
	const section = (searchParams.get("section") as any) || "productivity";
	const range = (searchParams.get("range") as any) || "week";

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
				});
			} catch (error) {
				console.error("Failed to load analytics data:", error);
			} finally {
				setLoading(false);
			}
		}

		loadData();
	}, [section, range]);

	/* Loading check moved to render phase */

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
	} = data || {}; // Safe destructure for initial render

	// Placeholder data until we implement full analytics
	const placeholderData = {
		productivity: [
			{ employee: "John Smith", units: 245, hours: 8.2, rate: 29.9, station: "PICKING" },
		],
		costs: {
			regular: 15000,
			overtime: 2500,
			total: 17500,
			variance: -500,
			variancePercent: -2.8,
		},
		stations: [
			{ name: "PICKING", efficiency: 28.5, occupancy: 85, employees: 12 },
			{ name: "PACKING", efficiency: 32.1, occupancy: 78, employees: 8 },
			{ name: "FILLING", efficiency: 25.8, occupancy: 92, employees: 15 },
			{ name: "RECEIVING", efficiency: 18.2, occupancy: 45, employees: 6 },
		],
	};

	return (
		<div className="space-y-6">
			<PageHeader
				title="Analytics & Reporting"
				subtitle="Comprehensive workforce productivity and cost analysis"
				actions={
					<>
						<Button variant="outline" size="sm">
							Export Data
						</Button>
						<Button variant="primary" size="sm">
							Generate Report
						</Button>
					</>
				}
			/>

			{/* Section Navigation */}
			<Card>
				<CardBody>
					<SectionTabs />
				</CardBody>
			</Card>

			{/* Time Range Selector */}
			<div className="flex items-center gap-4">
				<span className="text-sm font-medium">Time Range:</span>
				<AnalyticsTimeRangeTabs />
			</div>

			{loading || !data ? (
				<div className="flex items-center justify-center py-12">
					<div className="text-muted-foreground">Loading…</div>
				</div>
			) : (
				<>
					{/* Section Content */}
					{section === "productivity" && (
						<div className="space-y-6">
							{/* Productivity Overview Cards */}
							<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
								<Card className="border-2 border-primary bg-primary/10">
									<CardHeader>
										<CardTitle className="text-primary">Avg Units/Hour</CardTitle>
									</CardHeader>
									<CardBody>
										<div className="font-mono-industrial text-2xl font-bold text-primary font-data">
											{benchmarkData.productivity.current}
										</div>
										<p className="text-sm text-foreground mt-1">
											{trendData.productivity.changePercent > 0 ? "+" : ""}
											{trendData.productivity.changePercent}% vs last period
										</p>
									</CardBody>
								</Card>

								<Card className="border-2 border-secondary bg-secondary/10">
									<CardHeader>
										<CardTitle className="text-secondary">Top Performer</CardTitle>
									</CardHeader>
									<CardBody>
										<div className="font-mono-industrial text-2xl font-bold text-secondary font-data">
											{benchmarkData.productivity.top10Percent} u/h
										</div>
										<p className="text-sm text-foreground mt-1">Industry top 10%</p>
									</CardBody>
								</Card>

								<Card className="border-2 border-accent bg-accent/10">
									<CardHeader>
										<CardTitle className="text-accent">Task Completion</CardTitle>
									</CardHeader>
									<CardBody>
										<div className="font-mono-industrial text-2xl font-bold text-accent font-data">
											{benchmarkData.quality.current}%
										</div>
										<p className="text-sm text-foreground mt-1">On-time rate</p>
									</CardBody>
								</Card>

								<Card className="border-2 border-destructive bg-destructive/10">
									<CardHeader>
										<CardTitle className="text-destructive">Bottleneck Alert</CardTitle>
									</CardHeader>
									<CardBody>
										<div className="font-mono-industrial text-2xl font-bold text-destructive font-data">
											RECEIVING
										</div>
										<p className="text-sm text-foreground mt-1 font-data">45% utilization</p>
									</CardBody>
								</Card>
							</div>

							{/* Charts Section */}
							<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
								<LineChart
									title="Productivity Trends Over Time"
									data={productivityTrends}
									height={300}
								/>
								<BarChart
									title="Station Efficiency Comparison"
									data={stationEfficiency}
									height={300}
								/>
							</div>

							{/* Employee Productivity Table */}
							<Card>
								<CardHeader>
									<CardTitle>Employee Productivity Rankings</CardTitle>
								</CardHeader>
								<CardBody>
									<div className="overflow-x-auto">
										<table className="min-w-full">
											<thead>
												<tr className="border-b">
													<th className="text-left py-3 px-4">Employee</th>
													<th className="text-right py-3 px-4">Units</th>
													<th className="text-right py-3 px-4">Hours</th>
													<th className="text-right py-3 px-4">Rate (u/h)</th>
													<th className="text-left py-3 px-4">Station</th>
													<th className="text-left py-3 px-4">Performance</th>
												</tr>
											</thead>
											<tbody>
												{employeeProductivity.map((employee, index) => (
													<tr key={index} className="border-b">
														<td className="py-3 px-4 font-medium">{employee.employee}</td>
														<td className="text-right py-3 px-4 font-data">-</td>
														<td className="text-right py-3 px-4 font-data">-</td>
														<td className="text-right py-3 px-4 font-medium font-data">{employee.value}</td>
														<td className="py-3 px-4">
															<span className="px-2 py-1 text-xs font-industrial font-medium bg-secondary/20 text-secondary border border-secondary uppercase">
																{employee.station}
															</span>
														</td>
														<td className="py-3 px-4">
															{employee.value >= benchmarkData.productivity.top10Percent ? (
																<span className="px-2 py-1 text-xs font-industrial font-medium bg-primary/20 text-primary border border-primary uppercase">
																	Top 10%
																</span>
															) : employee.value >= benchmarkData.productivity.industryAvg ? (
																<span className="px-2 py-1 text-xs font-industrial font-medium bg-secondary/20 text-secondary border border-secondary uppercase">
																	Above Avg
																</span>
															) : (
																<span className="px-2 py-1 text-xs font-industrial font-medium bg-muted text-muted-foreground border border-muted uppercase">
																	Below Avg
																</span>
															)}
														</td>
													</tr>
												))}
											</tbody>
										</table>
									</div>
								</CardBody>
							</Card>

							{/* Station Performance Grid */}
							<div>
								<h2 className="text-lg font-semibold text-foreground mb-4">
									Station Performance & Capacity
								</h2>
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
									{placeholderData.stations.map((station: any) => (
										<Card key={station.name} className="border">
											<CardHeader>
												<CardTitle className="text-base">{station.name}</CardTitle>
											</CardHeader>
											<CardBody>
												<div className="space-y-3">
													<div className="flex justify-between items-center">
														<span className="text-sm text-muted-foreground">Efficiency:</span>
														<span className="font-medium">{station.efficiency} u/h</span>
													</div>
													<div className="flex justify-between items-center">
														<span className="text-sm text-muted-foreground">Occupancy:</span>
														<span
															className={`font-mono-industrial font-bold ${
																station.occupancy > 85
																	? "text-destructive"
																	: station.occupancy > 70
																		? "text-primary"
																		: "text-secondary"
															}`}
														>
															{station.occupancy}%
														</span>
													</div>
													<div className="flex justify-between items-center">
														<span className="text-sm text-muted-foreground">Staff:</span>
														<span className="font-medium">{station.employees}</span>
													</div>
													<div className="w-full bg-muted h-2">
														<div
															className={`h-2 ${
																station.efficiency > 30
																	? "bg-primary"
																	: station.efficiency > 20
																		? "bg-secondary"
																		: "bg-destructive"
															}`}
															style={{ width: `${Math.min(station.efficiency * 2, 100)}%` }}
														></div>
													</div>
													<div className="text-xs text-muted-foreground">
														{station.occupancy < 60
															? "Underutilized"
															: station.occupancy > 85
																? "Overloaded"
																: "Optimal"}
													</div>
												</div>
											</CardBody>
										</Card>
									))}
								</div>
							</div>

							{/* Performance Insights */}
							<Card>
								<CardHeader>
									<CardTitle>Performance Insights</CardTitle>
								</CardHeader>
								<CardBody>
									<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
										<div className="panel-shadow border-2 border-primary bg-primary/10 p-4">
											<h4 className="font-industrial font-medium uppercase text-primary mb-2">
												Peak Performance
											</h4>
											<p className="text-sm text-foreground">
												{trendData.seasonal.peakShift} shifts on {trendData.seasonal.peakDay}s show{" "}
												{trendData.seasonal.seasonalFactor}x higher productivity
											</p>
										</div>
										<div className="panel-shadow border-2 border-secondary bg-secondary/10 p-4">
											<h4 className="font-industrial font-medium uppercase text-secondary mb-2">
												Improvement Areas
											</h4>
											<p className="text-sm text-foreground">
												RECEIVING station operating at 45% capacity. Consider cross-training or
												additional staffing.
											</p>
										</div>
										<div className="panel-shadow border-2 border-accent bg-accent/10 p-4">
											<h4 className="font-industrial font-medium uppercase text-accent mb-2">
												Quality Impact
											</h4>
											<p className="text-sm text-foreground">
												High-performing stations maintain 97%+ quality rates. Monitor PACKING for
												recent declines.
											</p>
										</div>
									</div>
								</CardBody>
							</Card>
						</div>
					)}

					{section === "labor-cost" && (
						<div className="space-y-6">
							{/* Cost Summary Cards */}
							<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
								<Card>
									<CardHeader>
										<CardTitle className="text-sm font-medium text-muted-foreground">
											Regular Hours
										</CardTitle>
									</CardHeader>
									<CardBody>
										<div className="text-2xl font-bold">
											${placeholderData.costs.regular.toFixed(2)}
										</div>
										<p className="text-sm text-muted-foreground mt-1">840 hours</p>
									</CardBody>
								</Card>

								<Card>
									<CardHeader>
										<CardTitle className="text-sm font-medium text-muted-foreground">
											Overtime
										</CardTitle>
									</CardHeader>
									<CardBody>
										<div className="text-2xl font-bold text-orange-600">
											${placeholderData.costs.overtime.toFixed(2)}
										</div>
										<p className="text-sm text-muted-foreground mt-1">95 hours</p>
									</CardBody>
								</Card>

								<Card>
									<CardHeader>
										<CardTitle className="text-sm font-medium text-muted-foreground">
											Total Cost
										</CardTitle>
									</CardHeader>
									<CardBody>
										<div className="text-2xl font-bold">
											${placeholderData.costs.total.toFixed(2)}
										</div>
										<p className="text-sm text-muted-foreground mt-1">935 hours</p>
									</CardBody>
								</Card>

								<Card
									className={
										placeholderData.costs.variance > 0
											? "border-2 border-destructive bg-destructive/10"
											: "border-2 border-primary bg-primary/10"
									}
								>
									<CardHeader>
										<CardTitle className="text-sm font-medium text-muted-foreground">
											Budget Variance
										</CardTitle>
									</CardHeader>
									<CardBody>
										<div
											className={`font-mono-industrial text-2xl font-bold ${placeholderData.costs.variance > 0 ? "text-destructive" : "text-primary"}`}
										>
											{placeholderData.costs.variance > 0 ? "+" : ""}
											{placeholderData.costs.variance.toFixed(2)}
										</div>
										<p className="text-sm text-muted-foreground mt-1">
											{placeholderData.costs.variancePercent}% vs budget
										</p>
									</CardBody>
								</Card>
							</div>

							{/* Cost Trend Charts */}
							<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
								<LineChart
									title="Labor Cost Trends (Cost per Unit)"
									data={laborCostTrends}
									height={300}
								/>
								<BarChart
									title="Shift Productivity vs Cost"
									data={shiftProductivity}
									height={300}
								/>
							</div>

							{/* Cost Breakdown */}
							<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
								<PieChart title="Labor Cost Breakdown" data={costBreakdown} height={300} />
								<Card>
									<CardHeader>
										<CardTitle>Cost Efficiency Metrics</CardTitle>
									</CardHeader>
									<CardBody>
										<div className="space-y-4">
											<div className="flex justify-between items-center">
												<span className="text-sm text-muted-foreground">Current Cost/Unit:</span>
												<span className="font-mono-industrial font-bold">
													${benchmarkData.costPerUnit.current.toFixed(2)}
												</span>
											</div>
											<div className="flex justify-between items-center">
												<span className="text-sm text-muted-foreground">Target Cost/Unit:</span>
												<span className="font-mono-industrial font-bold text-primary">
													${benchmarkData.costPerUnit.target.toFixed(2)}
												</span>
											</div>
											<div className="flex justify-between items-center">
												<span className="text-sm text-muted-foreground">Industry Average:</span>
												<span className="font-mono-industrial font-bold text-secondary">
													${benchmarkData.costPerUnit.industryAvg.toFixed(2)}
												</span>
											</div>
											<div className="flex justify-between items-center">
												<span className="text-sm text-muted-foreground">Best in Class:</span>
												<span className="font-mono-industrial font-bold text-accent">
													${benchmarkData.costPerUnit.bottom10Percent.toFixed(2)}
												</span>
											</div>
											<div className="pt-2 border-t">
												<div className="flex justify-between items-center">
													<span className="text-sm font-medium">Efficiency Rating:</span>
													<span
														className={`px-2 py-1 text-xs font-industrial font-medium uppercase ${
															benchmarkData.costPerUnit.current <=
															benchmarkData.costPerUnit.bottom10Percent
																? "bg-primary/20 text-primary border border-primary"
																: benchmarkData.costPerUnit.current <=
																	  benchmarkData.costPerUnit.target
																	? "bg-secondary/20 text-secondary border border-secondary"
																	: "bg-destructive/20 text-destructive border border-destructive"
														}`}
													>
														{benchmarkData.costPerUnit.current <=
														benchmarkData.costPerUnit.bottom10Percent
															? "Top 10%"
															: benchmarkData.costPerUnit.current <=
																  benchmarkData.costPerUnit.target
																? "On Target"
																: "Over Budget"}
													</span>
												</div>
											</div>
										</div>
									</CardBody>
								</Card>
							</div>

							{/* Cost Analysis Table */}
							<Card>
								<CardHeader>
									<CardTitle>Cost Analysis by Station</CardTitle>
								</CardHeader>
								<CardBody>
									<div className="overflow-x-auto">
										<table className="min-w-full">
											<thead>
												<tr className="border-b">
													<th className="text-left py-3 px-4">Station</th>
													<th className="text-right py-3 px-4">Regular Hours</th>
													<th className="text-right py-3 px-4">Overtime Hours</th>
													<th className="text-right py-3 px-4">Total Hours</th>
													<th className="text-right py-3 px-4">Total Cost</th>
													<th className="text-right py-3 px-4">Cost/Hour</th>
													<th className="text-right py-3 px-4">Cost/Unit</th>
													<th className="text-left py-3 px-4">Status</th>
												</tr>
											</thead>
											<tbody>
												{placeholderData.stations.map((station) => {
													const regularHours = 156.8;
													const overtimeHours = station.name === "FILLING" ? 25.5 : 12.5;
													const totalHours = regularHours + overtimeHours;
													const totalCost = totalHours * 18.55;
													const costPerUnit = totalCost / ((station.efficiency * totalHours) / 8); // Rough estimate

													return (
														<tr key={station.name} className="border-b">
															<td className="py-3 px-4 font-medium">{station.name}</td>
															<td className="text-right py-3 px-4">{regularHours.toFixed(1)}</td>
															<td className="text-right py-3 px-4 text-orange-600 font-medium">
																{overtimeHours.toFixed(1)}
															</td>
															<td className="text-right py-3 px-4">{totalHours.toFixed(1)}</td>
															<td className="text-right py-3 px-4">${totalCost.toFixed(2)}</td>
															<td className="text-right py-3 px-4">$18.55</td>
															<td className="text-right py-3 px-4">${costPerUnit.toFixed(2)}</td>
															<td className="py-3 px-4">
																{overtimeHours > 20 ? (
																	<span className="px-2 py-1 text-xs font-industrial font-medium bg-destructive/20 text-destructive border border-destructive uppercase">
																		High OT
																	</span>
																) : costPerUnit > benchmarkData.costPerUnit.target ? (
																	<span className="px-2 py-1 text-xs font-industrial font-medium bg-orange-500/20 text-orange-600 border border-orange-500 uppercase">
																		Over Target
																	</span>
																) : (
																	<span className="px-2 py-1 text-xs font-industrial font-medium bg-primary/20 text-primary border border-primary uppercase">
																		On Target
																	</span>
																)}
															</td>
														</tr>
													);
												})}
												<tr className="font-bold border-t-2">
													<td className="py-3 px-4">Total</td>
													<td className="text-right py-3 px-4">840.0</td>
													<td className="text-right py-3 px-4 text-orange-600">95.0</td>
													<td className="text-right py-3 px-4">935.0</td>
													<td className="text-right py-3 px-4">$18,975.75</td>
													<td className="text-right py-3 px-4">$20.30</td>
													<td className="text-right py-3 px-4">
														${benchmarkData.costPerUnit.current.toFixed(2)}
													</td>
													<td className="py-3 px-4">
														<span className="px-2 py-1 text-xs font-industrial font-medium bg-secondary/20 text-secondary border border-secondary uppercase">
															{trendData.costs.changePercent > 0 ? "+" : ""}
															{trendData.costs.changePercent}%
														</span>
													</td>
												</tr>
											</tbody>
										</table>
									</div>
								</CardBody>
							</Card>

							{/* Cost Optimization Insights */}
							<Card>
								<CardHeader>
									<CardTitle>Cost Optimization Opportunities</CardTitle>
								</CardHeader>
								<CardBody>
									<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
										<div className="panel-shadow border-2 border-destructive bg-destructive/10 p-4">
											<h4 className="font-industrial font-medium uppercase text-destructive mb-2">
												Overtime Reduction
											</h4>
											<p className="text-sm text-foreground">
												FILLING station has 25.5 overtime hours this period. Consider additional
												staffing or workload balancing.
											</p>
											<div className="mt-2 text-xs text-muted-foreground">
												Potential savings: $1,250/week
											</div>
										</div>
										<div className="panel-shadow border-2 border-primary bg-primary/10 p-4">
											<h4 className="font-industrial font-medium uppercase text-primary mb-2">
												Efficiency Gains
											</h4>
											<p className="text-sm text-foreground">
												{trendData.costs.trend === "down"
													? "Cost per unit trending down"
													: "Cost per unit stable"}{" "}
												at ${benchmarkData.costPerUnit.current.toFixed(2)}. Maintain current
												efficiency initiatives.
											</p>
											<div className="mt-2 text-xs text-muted-foreground">
												{trendData.costs.changePercent > 0 ? "Increase" : "Decrease"} of{" "}
												{Math.abs(trendData.costs.changePercent)}% vs last period
											</div>
										</div>
										<div className="panel-shadow border-2 border-accent bg-accent/10 p-4">
											<h4 className="font-industrial font-medium uppercase text-accent mb-2">
												Budget Forecast
											</h4>
											<p className="text-sm text-foreground">
												Projected cost per unit: ${trendData.costs.forecast.toFixed(2)} by end of{" "}
												{range}.
												{capacityData.overall.costImpact > 0
													? `Staffing shortage adding $${capacityData.overall.costImpact.toFixed(2)}/week.`
													: "No additional staffing costs projected."}
											</p>
											<div className="mt-2 text-xs text-muted-foreground">
												Confidence: {trendData.costs.confidence}%
											</div>
										</div>
									</div>
								</CardBody>
							</Card>
						</div>
					)}

					{section === "trends" && (
						<div className="space-y-6">
							{/* Trend Overview Cards */}
							<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
								<Card
									className={`border-2 ${
										trendData.productivity.trend === "up"
											? "border-primary bg-primary/10"
											: trendData.productivity.trend === "down"
												? "border-destructive bg-destructive/10"
												: "border-secondary bg-secondary/10"
									}`}
								>
									<CardHeader>
										<CardTitle
											className={
												trendData.productivity.trend === "up"
													? "text-primary"
													: trendData.productivity.trend === "down"
														? "text-destructive"
														: "text-secondary"
											}
										>
											Productivity
										</CardTitle>
									</CardHeader>
									<CardBody>
										<div
											className={`font-mono-industrial text-2xl font-bold ${
												trendData.productivity.trend === "up"
													? "text-primary"
													: trendData.productivity.trend === "down"
														? "text-destructive"
														: "text-secondary"
											}`}
										>
											{trendData.productivity.changePercent > 0 ? "+" : ""}
											{trendData.productivity.changePercent}%
										</div>
										<p className="text-sm text-foreground mt-1">
											{trendData.productivity.trend === "up"
												? "Improving"
												: trendData.productivity.trend === "down"
													? "Declining"
													: "Stable"}
										</p>
									</CardBody>
								</Card>

								<Card
									className={`border-2 ${
										trendData.costs.trend === "down"
											? "border-primary bg-primary/10"
											: trendData.costs.trend === "up"
												? "border-destructive bg-destructive/10"
												: "border-secondary bg-secondary/10"
									}`}
								>
									<CardHeader>
										<CardTitle
											className={
												trendData.costs.trend === "down"
													? "text-primary"
													: trendData.costs.trend === "up"
														? "text-destructive"
														: "text-secondary"
											}
										>
											Costs
										</CardTitle>
									</CardHeader>
									<CardBody>
										<div
											className={`font-mono-industrial text-2xl font-bold ${
												trendData.costs.trend === "down"
													? "text-primary"
													: trendData.costs.trend === "up"
														? "text-destructive"
														: "text-secondary"
											}`}
										>
											{trendData.costs.changePercent > 0 ? "+" : ""}
											{trendData.costs.changePercent}%
										</div>
										<p className="text-sm text-foreground mt-1">
											{trendData.costs.trend === "down"
												? "Decreasing"
												: trendData.costs.trend === "up"
													? "Increasing"
													: "Stable"}
										</p>
									</CardBody>
								</Card>

								<Card
									className={`border-2 ${
										trendData.quality.trend === "up"
											? "border-primary bg-primary/10"
											: trendData.quality.trend === "down"
												? "border-destructive bg-destructive/10"
												: "border-secondary bg-secondary/10"
									}`}
								>
									<CardHeader>
										<CardTitle
											className={
												trendData.quality.trend === "up"
													? "text-primary"
													: trendData.quality.trend === "down"
														? "text-destructive"
														: "text-secondary"
											}
										>
											Quality
										</CardTitle>
									</CardHeader>
									<CardBody>
										<div
											className={`font-mono-industrial text-2xl font-bold ${
												trendData.quality.trend === "up"
													? "text-primary"
													: trendData.quality.trend === "down"
														? "text-destructive"
														: "text-secondary"
											}`}
										>
											{trendData.quality.changePercent > 0 ? "+" : ""}
											{trendData.quality.changePercent}%
										</div>
										<p className="text-sm text-foreground mt-1">
											{trendData.quality.trend === "up"
												? "Improving"
												: trendData.quality.trend === "down"
													? "Declining"
													: "Stable"}
										</p>
									</CardBody>
								</Card>

								<Card className="border-2 border-accent bg-accent/10">
									<CardHeader>
										<CardTitle className="text-accent">Anomalies</CardTitle>
									</CardHeader>
									<CardBody>
										<div className="font-mono-industrial text-2xl font-bold text-accent">
											{anomalyData.length}
										</div>
										<p className="text-sm text-foreground mt-1">Detected this period</p>
									</CardBody>
								</Card>
							</div>

							{/* Trend Charts */}
							<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
								<LineChart
									title="Productivity Trends Over Time"
									data={productivityTrends}
									height={350}
								/>
								<LineChart
									title="Labor Cost Trends (Cost per Unit)"
									data={laborCostTrends}
									height={350}
								/>
							</div>

							<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
								<BarChart
									title="Shift Productivity Comparison"
									data={shiftProductivity}
									height={300}
								/>
								<BarChart
									title="Task Type Efficiency Trends"
									data={taskTypeEfficiency}
									height={300}
								/>
							</div>

							{/* Anomalies Table */}
							<Card>
								<CardHeader>
									<CardTitle>Detected Anomalies</CardTitle>
								</CardHeader>
								<CardBody>
									<div className="overflow-x-auto">
										<table className="min-w-full">
											<thead>
												<tr className="border-b">
													<th className="text-left py-3 px-4">Type</th>
													<th className="text-left py-3 px-4">Description</th>
													<th className="text-right py-3 px-4">Impact</th>
													<th className="text-left py-3 px-4">Status</th>
													<th className="text-left py-3 px-4">Action</th>
												</tr>
											</thead>
											<tbody>
												{anomalyData.map((anomaly: Anomaly, index: number) => (
													<tr key={index} className="border-b">
														<td className="py-3 px-4">
															<span
																className={`px-2 py-1 text-xs font-industrial font-medium uppercase ${
																	anomaly.severity === "high"
																		? "bg-destructive/20 text-destructive border border-destructive"
																		: anomaly.severity === "medium"
																			? "bg-orange-500/20 text-orange-600 border border-orange-500"
																			: "bg-secondary/20 text-secondary border border-secondary"
																}`}
															>
																{anomaly.type}
															</span>
														</td>
														<td className="py-3 px-4 text-sm">{anomaly.description}</td>
														<td className="text-right py-3 px-4">{anomaly.impact}</td>
														<td className="py-3 px-4">
															<span className="text-sm text-muted-foreground">
																{anomaly.status}
															</span>
														</td>
														<td className="py-3 px-4">
															<Button variant="ghost" size="sm">
																Investigate
															</Button>
														</td>
													</tr>
												))}
											</tbody>
										</table>
									</div>
								</CardBody>
							</Card>

							{/* Insights */}
							<Card>
								<CardHeader>
									<CardTitle>AI Insights</CardTitle>
								</CardHeader>
								<CardBody>
									<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
										<div className="panel-shadow border-2 border-primary bg-primary/10 p-4">
											<h4 className="font-industrial font-medium uppercase text-primary mb-2">
												Pattern Detected
											</h4>
											<p className="text-sm text-foreground">
												Productivity consistently drops 15% during shift handovers. Implementing
												overlap periods could recover {trendData.seasonal.seasonalFactor * 10}%
												efficiency.
											</p>
										</div>
										<div className="panel-shadow border-2 border-accent bg-accent/10 p-4">
											<h4 className="font-industrial font-medium uppercase text-accent mb-2">
												Opportunities
											</h4>
											<p className="text-sm text-foreground">
												{
													placeholderData.stations.filter(
														(s) => s.efficiency < benchmarkData.productivity.industryAvg
													).length
												}{" "}
												stations below industry average. Focus improvement efforts on RECEIVING
												station (45% below target).
											</p>
											<div className="mt-2 text-xs text-muted-foreground">
												Potential: 15-25% productivity improvement
											</div>
										</div>
										<div className="panel-shadow border-2 border-secondary bg-secondary/10 p-4">
											<h4 className="font-industrial font-medium uppercase text-secondary mb-2">
												Industry Position
											</h4>
											<p className="text-sm text-foreground">
												Current performance places you in the{" "}
												{benchmarkData.productivity.current >=
												benchmarkData.productivity.industryAvg
													? "upper"
													: "middle"}{" "}
												quartile of industry peers.
												{benchmarkData.productivity.current >= benchmarkData.productivity.target
													? " On track"
													: " Room for improvement"}{" "}
												to reach target metrics.
											</p>
											<div className="mt-2 text-xs text-muted-foreground">
												Next milestone: {benchmarkData.productivity.target} u/h target
											</div>
										</div>
									</div>
								</CardBody>
							</Card>
						</div>
					)}

					{section === "capacity" && (
						<div className="space-y-6">
							{/* Capacity Overview Cards */}
							<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
								<Card className="border-2 border-primary bg-primary/10">
									<CardHeader>
										<CardTitle className="text-primary">Overall Utilization</CardTitle>
									</CardHeader>
									<CardBody>
										<div className="font-mono-industrial text-2xl font-bold text-primary">
											{capacityData.overall.currentUtilization}%
										</div>
										<p className="text-sm text-foreground mt-1">
											Target: {capacityData.overall.optimalUtilization}%
										</p>
									</CardBody>
								</Card>

								<Card className="border-2 border-secondary bg-secondary/10">
									<CardHeader>
										<CardTitle className="text-secondary">Staff Shortage</CardTitle>
									</CardHeader>
									<CardBody>
										<div className="font-mono-industrial text-2xl font-bold text-secondary">
											{capacityData.overall.staffShortage}
										</div>
										<p className="text-sm text-foreground mt-1">Positions needed</p>
									</CardBody>
								</Card>

								<Card className="border-2 border-accent bg-accent/10">
									<CardHeader>
										<CardTitle className="text-accent">Cost Impact</CardTitle>
									</CardHeader>
									<CardBody>
										<div className="font-mono-industrial text-2xl font-bold text-accent">
											${capacityData.overall.costImpact.toFixed(0)}
										</div>
										<p className="text-sm text-foreground mt-1">Weekly cost</p>
									</CardBody>
								</Card>

								<Card className="border-2 border-destructive bg-destructive/10">
									<CardHeader>
										<CardTitle className="text-destructive">Bottleneck Alert</CardTitle>
									</CardHeader>
									<CardBody>
										<div className="font-mono-industrial text-2xl font-bold text-destructive">
											{capacityData.stations.filter((s) => s.utilization < 60).length}
										</div>
										<p className="text-sm text-foreground mt-1">Stations underutilized</p>
									</CardBody>
								</Card>
							</div>

							{/* Station Capacity Grid */}
							<Card>
								<CardHeader>
									<CardTitle>Station Capacity & Staffing</CardTitle>
								</CardHeader>
								<CardBody>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										{capacityData.stations.map((station) => (
											<div key={station.name} className="border rounded-lg p-4">
												<div className="flex justify-between items-center mb-3">
													<h4 className="font-industrial font-medium">{station.name}</h4>
													<span
														className={`px-2 py-1 text-xs font-industrial font-medium uppercase ${
															station.utilization >= 80
																? "bg-destructive/20 text-destructive border border-destructive"
																: station.utilization >= 60
																	? "bg-primary/20 text-primary border border-primary"
																	: "bg-secondary/20 text-secondary border border-secondary"
														}`}
													>
														{station.utilization}% utilized
													</span>
												</div>

												<div className="space-y-2">
													<div className="flex justify-between text-sm">
														<span className="text-muted-foreground">Current Staff:</span>
														<span className="font-medium">{station.currentStaff}</span>
													</div>
													<div className="flex justify-between text-sm">
														<span className="text-muted-foreground">Required Staff:</span>
														<span className="font-medium">{station.requiredStaff}</span>
													</div>
													<div className="flex justify-between text-sm">
														<span className="text-muted-foreground">Recommended:</span>
														<span className="font-medium">{station.recommendedStaff}</span>
													</div>
													<div className="flex justify-between text-sm">
														<span className="text-muted-foreground">Max Capacity:</span>
														<span className="font-medium">{station.maxCapacity}</span>
													</div>
												</div>

												<div className="mt-3">
													<div className="w-full bg-muted h-2 rounded">
														<div
															className={`h-2 rounded ${
																station.utilization >= 90
																	? "bg-destructive"
																	: station.utilization >= 70
																		? "bg-primary"
																		: "bg-secondary"
															}`}
															style={{ width: `${Math.min(station.utilization, 100)}%` }}
														></div>
													</div>
													<div className="text-xs text-muted-foreground mt-1">
														{station.utilization < 60
															? "Underutilized - Consider reducing staff"
															: station.utilization > 90
																? "Overloaded - Needs more staff"
																: "Optimal utilization"}
													</div>
												</div>
											</div>
										))}
									</div>
								</CardBody>
							</Card>

							{/* Capacity Optimization Insights */}
							<Card>
								<CardHeader>
									<CardTitle>Capacity Optimization Recommendations</CardTitle>
								</CardHeader>
								<CardBody>
									<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
										<div className="panel-shadow border-2 border-primary bg-primary/10 p-4">
											<h4 className="font-industrial font-medium uppercase text-primary mb-2">
												Staffing Adjustments
											</h4>
											<p className="text-sm text-foreground">
												{
													capacityData.stations.filter((s) => s.currentStaff !== s.recommendedStaff)
														.length
												}{" "}
												stations need staffing adjustments. Consider cross-training to balance
												workload.
											</p>
										</div>
										<div className="panel-shadow border-2 border-secondary bg-secondary/10 p-4">
											<h4 className="font-industrial font-medium uppercase text-secondary mb-2">
												Capacity Planning
											</h4>
											<p className="text-sm text-foreground">
												Overall utilization at {capacityData.overall.currentUtilization}%. Target
												utilization of {capacityData.overall.optimalUtilization}% would increase
												throughput by ~15%.
											</p>
										</div>
										<div className="panel-shadow border-2 border-accent bg-accent/10 p-4">
											<h4 className="font-industrial font-medium uppercase text-accent mb-2">
												Cost Optimization
											</h4>
											<p className="text-sm text-foreground">
												Addressing staff shortages could reduce weekly costs by $
												{capacityData.overall.costImpact.toFixed(0)} through better utilization and
												reduced overtime.
											</p>
										</div>
									</div>
								</CardBody>
							</Card>
						</div>
					)}

					{section === "benchmarks" && (
						<div className="space-y-6">
							{/* Benchmark Overview Cards */}
							<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
								<Card className="border-2 border-primary bg-primary/10">
									<CardHeader>
										<CardTitle className="text-primary">Productivity Score</CardTitle>
									</CardHeader>
									<CardBody>
										<div className="font-mono-industrial text-2xl font-bold text-primary">
											{benchmarkData.productivity.current}
										</div>
										<p className="text-sm text-foreground mt-1">
											Target: {benchmarkData.productivity.target} u/h
										</p>
									</CardBody>
								</Card>

								<Card className="border-2 border-secondary bg-secondary/10">
									<CardHeader>
										<CardTitle className="text-secondary">Industry Position</CardTitle>
									</CardHeader>
									<CardBody>
										<div className="font-mono-industrial text-2xl font-bold text-secondary">
											{benchmarkData.productivity.current >= benchmarkData.productivity.industryAvg
												? "Above"
												: "Below"}
										</div>
										<p className="text-sm text-foreground mt-1">
											Industry average: {benchmarkData.productivity.industryAvg} u/h
										</p>
									</CardBody>
								</Card>

								<Card className="border-2 border-accent bg-accent/10">
									<CardHeader>
										<CardTitle className="text-accent">Quality Rate</CardTitle>
									</CardHeader>
									<CardBody>
										<div className="font-mono-industrial text-2xl font-bold text-accent">
											{benchmarkData.quality.current}%
										</div>
										<p className="text-sm text-foreground mt-1">
											Target: {benchmarkData.quality.target}%
										</p>
									</CardBody>
								</Card>

								<Card className="border-2 border-destructive bg-destructive/10">
									<CardHeader>
										<CardTitle className="text-destructive">Cost Efficiency</CardTitle>
									</CardHeader>
									<CardBody>
										<div className="font-mono-industrial text-2xl font-bold text-destructive">
											${benchmarkData.costPerUnit.current.toFixed(2)}
										</div>
										<p className="text-sm text-foreground mt-1">
											Target: ${benchmarkData.costPerUnit.target.toFixed(2)}
										</p>
									</CardBody>
								</Card>
							</div>

							{/* Benchmark Comparison Tables */}
							<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
								<Card>
									<CardHeader>
										<CardTitle>Productivity Benchmarks</CardTitle>
									</CardHeader>
									<CardBody>
										<div className="space-y-4">
											<div className="flex justify-between items-center py-2 border-b">
												<span className="font-medium">Current Performance</span>
												<span className="font-mono-industrial font-bold">
													{benchmarkData.productivity.current} u/h
												</span>
											</div>
											<div className="flex justify-between items-center py-2 border-b">
												<span className="text-muted-foreground">Internal Target</span>
												<span className="font-mono-industrial">
													{benchmarkData.productivity.target} u/h
												</span>
											</div>
											<div className="flex justify-between items-center py-2 border-b">
												<span className="text-muted-foreground">Industry Average</span>
												<span className="font-mono-industrial">
													{benchmarkData.productivity.industryAvg} u/h
												</span>
											</div>
											<div className="flex justify-between items-center py-2 border-b">
												<span className="text-muted-foreground">Top 10% Performers</span>
												<span className="font-mono-industrial">
													{benchmarkData.productivity.top10Percent} u/h
												</span>
											</div>
											<div className="flex justify-between items-center py-2">
												<span className="font-medium">Performance Rating</span>
												<span
													className={`px-2 py-1 text-xs font-industrial font-medium uppercase ${
														benchmarkData.productivity.current >=
														benchmarkData.productivity.top10Percent
															? "bg-primary/20 text-primary border border-primary"
															: benchmarkData.productivity.current >=
																  benchmarkData.productivity.target
																? "bg-secondary/20 text-secondary border border-secondary"
																: "bg-destructive/20 text-destructive border border-destructive"
													}`}
												>
													{benchmarkData.productivity.current >=
													benchmarkData.productivity.top10Percent
														? "Top 10%"
														: benchmarkData.productivity.current >=
															  benchmarkData.productivity.target
															? "On Target"
															: "Below Target"}
												</span>
											</div>
										</div>
									</CardBody>
								</Card>

								<Card>
									<CardHeader>
										<CardTitle>Cost Efficiency Benchmarks</CardTitle>
									</CardHeader>
									<CardBody>
										<div className="space-y-4">
											<div className="flex justify-between items-center py-2 border-b">
												<span className="font-medium">Current Cost/Unit</span>
												<span className="font-mono-industrial font-bold">
													${benchmarkData.costPerUnit.current.toFixed(2)}
												</span>
											</div>
											<div className="flex justify-between items-center py-2 border-b">
												<span className="text-muted-foreground">Internal Target</span>
												<span className="font-mono-industrial">
													${benchmarkData.costPerUnit.target.toFixed(2)}
												</span>
											</div>
											<div className="flex justify-between items-center py-2 border-b">
												<span className="text-muted-foreground">Industry Average</span>
												<span className="font-mono-industrial">
													${benchmarkData.costPerUnit.industryAvg.toFixed(2)}
												</span>
											</div>
											<div className="flex justify-between items-center py-2 border-b">
												<span className="text-muted-foreground">Best in Class (Top 10%)</span>
												<span className="font-mono-industrial">
													${benchmarkData.costPerUnit.bottom10Percent.toFixed(2)}
												</span>
											</div>
											<div className="flex justify-between items-center py-2">
												<span className="font-medium">Efficiency Rating</span>
												<span
													className={`px-2 py-1 text-xs font-industrial font-medium uppercase ${
														benchmarkData.costPerUnit.current <=
														benchmarkData.costPerUnit.bottom10Percent
															? "bg-primary/20 text-primary border border-primary"
															: benchmarkData.costPerUnit.current <=
																  benchmarkData.costPerUnit.target
																? "bg-secondary/20 text-secondary border border-secondary"
																: "bg-destructive/20 text-destructive border border-destructive"
													}`}
												>
													{benchmarkData.costPerUnit.current <=
													benchmarkData.costPerUnit.bottom10Percent
														? "Top 10%"
														: benchmarkData.costPerUnit.current <= benchmarkData.costPerUnit.target
															? "On Target"
															: "Over Budget"}
												</span>
											</div>
										</div>
									</CardBody>
								</Card>
							</div>

							{/* Quality Benchmarks */}
							<Card>
								<CardHeader>
									<CardTitle>Quality Benchmarks</CardTitle>
								</CardHeader>
								<CardBody>
									<div className="space-y-4">
										<div className="flex justify-between items-center py-2 border-b">
											<span className="font-medium">Current Quality Rate</span>
											<span className="font-mono-industrial font-bold">
												{benchmarkData.quality.current}%
											</span>
										</div>
										<div className="flex justify-between items-center py-2 border-b">
											<span className="text-muted-foreground">Internal Target</span>
											<span className="font-mono-industrial">{benchmarkData.quality.target}%</span>
										</div>
										<div className="flex justify-between items-center py-2 border-b">
											<span className="text-muted-foreground">Industry Average</span>
											<span className="font-mono-industrial">
												{benchmarkData.quality.industryAvg}%
											</span>
										</div>
										<div className="flex justify-between items-center py-2">
											<span className="text-muted-foreground">Top 10% Performers</span>
											<span className="font-mono-industrial">
												{benchmarkData.quality.top10Percent}%
											</span>
										</div>
									</div>
								</CardBody>
							</Card>

							{/* Benchmark Insights */}
							<Card>
								<CardHeader>
									<CardTitle>Performance Insights & Recommendations</CardTitle>
								</CardHeader>
								<CardBody>
									<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
										<div className="panel-shadow border-2 border-primary bg-primary/10 p-4">
											<h4 className="font-industrial font-medium uppercase text-primary mb-2">
												Productivity Gap
											</h4>
											<p className="text-sm text-foreground">
												Current productivity is{" "}
												{(
													(benchmarkData.productivity.current / benchmarkData.productivity.target) *
													100
												).toFixed(1)}
												% of target. Focus on training and process optimization to close the{" "}
												{(
													((benchmarkData.productivity.target -
														benchmarkData.productivity.current) /
														benchmarkData.productivity.current) *
													100
												).toFixed(1)}
												% gap.
											</p>
										</div>
										<div className="panel-shadow border-2 border-secondary bg-secondary/10 p-4">
											<h4 className="font-industrial font-medium uppercase text-secondary mb-2">
												Cost Optimization
											</h4>
											<p className="text-sm text-foreground">
												Cost per unit is{" "}
												{benchmarkData.costPerUnit.current > benchmarkData.costPerUnit.target
													? "above"
													: "below"}{" "}
												target by $
												{Math.abs(
													benchmarkData.costPerUnit.current - benchmarkData.costPerUnit.target
												).toFixed(2)}
												.
												{benchmarkData.costPerUnit.current > benchmarkData.costPerUnit.target
													? "Implement efficiency measures to reduce costs."
													: "Excellent cost control - maintain current practices."}
											</p>
										</div>
										<div className="panel-shadow border-2 border-accent bg-accent/10 p-4">
											<h4 className="font-industrial font-medium uppercase text-accent mb-2">
												Industry Position
											</h4>
											<p className="text-sm text-foreground">
												Performance places you in the{" "}
												{benchmarkData.productivity.current >=
												benchmarkData.productivity.industryAvg
													? "upper"
													: "middle"}{" "}
												quartile of industry peers. Quality rates exceed industry average by{" "}
												{(
													benchmarkData.quality.current - benchmarkData.quality.industryAvg
												).toFixed(1)}
												%.
											</p>
										</div>
									</div>
								</CardBody>
							</Card>
						</div>
					)}
				</>
			)}
		</div>
	);
}
