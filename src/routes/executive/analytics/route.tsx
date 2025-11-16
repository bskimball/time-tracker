import { Card, CardHeader, CardTitle, CardBody } from "~/components/ds/card";
import { Button } from "~/components/ds/button";
import { Link } from "react-router";
import { LineChart, BarChart, PieChart } from "~/routes/executive/charts";
import { CapacityPlanningTool } from "~/routes/executive/capacity-planning";
import {
	getProductivityTrendData,
	getLaborCostTrendData,
	getStationEfficiencyData,
	getCostBreakdownData,
	getStationOccupancyData,
	getShiftProductivityData,
	getTaskTypeEfficiencyData,
} from "./actions";

export default async function Component({
	searchParams,
}: {
	searchParams?: { section?: string; range?: string };
}) {
	// Middleware ensures ADMIN role

	const section = searchParams?.section || "productivity";
	const range = searchParams?.range || "week";

	// Get chart data
	const [
		productivityTrends,
		laborCostTrends,
		stationEfficiency,
		costBreakdown,
		stationOccupancy,
		shiftProductivity,
		taskTypeEfficiency,
	] = await Promise.all([
		getProductivityTrendData(range as any),
		getLaborCostTrendData(range as any),
		getStationEfficiencyData(range as any),
		getCostBreakdownData(range as any),
		getStationOccupancyData(),
		getShiftProductivityData(range as any),
		getTaskTypeEfficiencyData(range as any),
	]);

	// Placeholder data until we implement full analytics
	const placeholderData = {
		productivity: [
			{ employee: "John Smith", units: 245, hours: 8.2, rate: 29.9, station: "PICKING" },
			{ employee: "Maria Garcia", units: 198, hours: 7.5, rate: 26.4, station: "PACKING" },
			{ employee: "David Chen", units: 312, hours: 8.0, rate: 39.0, station: "FILLING" },
			{ employee: "Sarah Johnson", units: 167, hours: 8.2, rate: 20.4, station: "RECEIVING" },
		],
		costs: {
			regular: 15480.5,
			overtime: 3495.25,
			total: 18975.75,
			budget: 18500.0,
			variance: 475.75,
			variancePercent: 2.6,
		},
		stations: [
			{ name: "PICKING", efficiency: 28.5, occupancy: 78, employees: 12 },
			{ name: "PACKING", efficiency: 24.2, occupancy: 65, employees: 8 },
			{ name: "FILLING", efficiency: 35.1, occupancy: 92, employees: 6 },
			{ name: "RECEIVING", efficiency: 22.3, occupancy: 45, employees: 4 },
		],
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
				<div>
					<h1 className="text-3xl font-bold text-foreground">Analytics & Reporting</h1>
					<p className="text-muted-foreground mt-1">
						Comprehensive workforce productivity and cost analysis
					</p>
				</div>
				<div className="flex items-center gap-2">
					<Button variant="outline" size="sm">
						Export Data
					</Button>
					<Button variant="primary" size="sm">
						Generate Report
					</Button>
				</div>
			</div>

			{/* Section Navigation */}
			<Card>
				<CardBody>
					<div className="flex flex-wrap gap-2">
						{[
							{ id: "productivity", label: "Productivity" },
							{ id: "labor-cost", label: "Labor Costs" },
							{ id: "trends", label: "Trends" },
							{ id: "capacity", label: "Capacity" },
							{ id: "benchmarks", label: "Benchmarks" },
						].map(({ id, label }) => (
							<Link key={id} to={`/executive/analytics?section=${id}`}>
								<Button variant={section === id ? "primary" : "ghost"} size="sm">
									{label}
								</Button>
							</Link>
						))}
					</div>
				</CardBody>
			</Card>

			{/* Time Range Selector */}
			<div className="flex items-center gap-4">
				<span className="text-sm font-medium">Time Range:</span>
				<div className="flex gap-2">
					{["today", "week", "month", "quarter"].map((r) => (
						<Link key={r} to={`/executive/analytics?section=${section}&range=${r}`}>
							<Button variant={range === r ? "primary" : "outline"} size="sm">
								{r.charAt(0).toUpperCase() + r.slice(1)}
							</Button>
						</Link>
					))}
				</div>
			</div>

			{/* Section Content */}
			{section === "productivity" && (
				<div className="space-y-6">
					{/* Productivity Overview Cards */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<Card className="border-2 border-primary bg-primary/10">
							<CardHeader>
								<CardTitle className="text-primary normal-case">Avg Units/Hour</CardTitle>
							</CardHeader>
							<CardBody>
								<div className="font-mono-industrial text-2xl font-bold text-primary">28.1</div>
								<p className="text-sm text-foreground mt-1">+5.2% vs last period</p>
							</CardBody>
						</Card>

						<Card className="border-2 border-secondary bg-secondary/10">
							<CardHeader>
								<CardTitle className="text-secondary normal-case">Top Performer</CardTitle>
							</CardHeader>
							<CardBody>
								<div className="font-mono-industrial text-2xl font-bold text-secondary">39.0 u/h</div>
								<p className="text-sm text-foreground mt-1">David Chen - Filling</p>
							</CardBody>
						</Card>

						<Card className="border-2 border-accent bg-accent/10">
							<CardHeader>
								<CardTitle className="text-accent normal-case">Task Completion</CardTitle>
							</CardHeader>
							<CardBody>
								<div className="font-mono-industrial text-2xl font-bold text-accent">94.7%</div>
								<p className="text-sm text-foreground mt-1">On-time rate</p>
							</CardBody>
						</Card>
					</div>

					{/* Productivity Table */}
					<Card>
						<CardHeader>
							<CardTitle>Employee Productivity</CardTitle>
						</CardHeader>
						<CardBody>
							<div className="overflow-x-auto">
								<table className="min-w-full">
									<thead>
										<tr className="border-b">
											<th className="text-left py-3 px-4">Employee</th>
											<th className="text-right py-3 px-4">Units</th>
											<th className="text-right py-3 px-4">Hours</th>
											<th className="text-right py-3 px-4">Units/Hour</th>
											<th className="text-left py-3 px-4">Station</th>
										</tr>
									</thead>
									<tbody>
										{placeholderData.productivity.map((employee, index) => (
											<tr key={index} className="border-b">
												<td className="py-3 px-4">{employee.employee}</td>
												<td className="text-right py-3 px-4">{employee.units}</td>
												<td className="text-right py-3 px-4">{employee.hours}</td>
												<td className="text-right py-3 px-4 font-medium">{employee.rate}</td>
												<td className="py-3 px-4">
													<span className="px-2 py-1 text-xs font-industrial font-medium bg-secondary/20 text-secondary border border-secondary uppercase">
														{employee.station}
													</span>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</CardBody>
					</Card>

					{/* Station Performance */}
					<div>
						<h2 className="text-lg font-semibold text-foreground mb-4">Station Performance</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
							{placeholderData.stations.map((station) => (
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
												<span className="text-sm text-muted-foreground">Employees:</span>
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
										</div>
									</CardBody>
								</Card>
							))}
						</div>
					</div>
				</div>
			)}

			{section === "labor-cost" && (
				<div className="space-y-6">
					{/* Cost Summary */}
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
								<div className="text-2xl font-bold">${placeholderData.costs.total.toFixed(2)}</div>
								<p className="text-sm text-muted-foreground mt-1">935 hours</p>
							</CardBody>
						</Card>

						<Card
							className={placeholderData.costs.variance > 0 ? "border-2 border-destructive bg-destructive/10" : "border-2 border-primary bg-primary/10"}
						>
							<CardHeader>
								<CardTitle className="text-sm font-medium text-muted-foreground">
									Variance
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

					{/* Charts Section */}
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
						<LineChart
							title="Productivity Trends (Units per Hour)"
							data={productivityTrends}
							height={300}
						/>
						<BarChart title="Station Efficiency Comparison" data={stationEfficiency} height={300} />
					</div>

					{/* Cost Breakdown Charts */}
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
						<PieChart title="Labor Cost Breakdown" data={costBreakdown} height={300} />
						<BarChart
							title="Station Occupancy Levels"
							data={{
								labels: stationOccupancy.map((s) => s.label),
								datasets: [
									{
										label: "Occupancy %",
										data: stationOccupancy.map((s) => s.value),
										color: "#8b5cf6",
									},
								],
							}}
							height={300}
						/>
					</div>

					{/* Cost Analysis Table */}
					<Card>
						<CardHeader>
							<CardTitle>Cost Analysis by Department</CardTitle>
						</CardHeader>
						<CardBody>
							<div className="overflow-x-auto">
								<table className="min-w-full">
									<thead>
										<tr className="border-b">
											<th className="text-left py-3 px-4">Department/Station</th>
											<th className="text-right py-3 px-4">Regular Hours</th>
											<th className="text-right py-3 px-4">Overtime</th>
											<th className="text-right py-3 px-4">Total Hours</th>
											<th className="text-right py-3 px-4">Total Cost</th>
											<th className="text-right py-3 px-4">Cost/Hour</th>
										</tr>
									</thead>
									<tbody>
										{placeholderData.stations.map((station) => (
											<tr key={station.name} className="border-b">
												<td className="py-3 px-4 font-medium">{station.name}</td>
												<td className="text-right py-3 px-4">156.8</td>
												<td className="text-right py-3 px-4">12.5</td>
												<td className="text-right py-3 px-4">169.3</td>
												<td className="text-right py-3 px-4">$3,142.50</td>
												<td className="text-right py-3 px-4">$18.55</td>
											</tr>
										))}
										<tr className="font-bold">
											<td className="py-3 px-4">Total</td>
											<td className="text-right py-3 px-4">840.0</td>
											<td className="text-right py-3 px-4">95.0</td>
											<td className="text-right py-3 px-4">935.0</td>
											<td className="text-right py-3 px-4">$18,975.75</td>
											<td className="text-right py-3 px-4">$20.30</td>
										</tr>
									</tbody>
								</table>
							</div>
						</CardBody>
					</Card>
				</div>
			)}

			{section === "trends" && (
				<div className="space-y-6">
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
						<BarChart title="Shift Productivity Comparison" data={shiftProductivity} height={300} />
						<BarChart title="Task Type Efficiency" data={taskTypeEfficiency} height={300} />
					</div>

					<Card>
						<CardHeader>
							<CardTitle>Trend Analysis Insights</CardTitle>
						</CardHeader>
						<CardBody>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								<div className="panel-shadow border-2 border-secondary bg-secondary/10 p-4">
									<h4 className="font-industrial font-medium uppercase text-secondary mb-2">Productivity Trends</h4>
									<p className="text-sm text-foreground">
										Track hourly, daily, weekly patterns to identify peak performance periods and
										optimize scheduling
									</p>
								</div>
								<div className="panel-shadow border-2 border-primary bg-primary/10 p-4">
									<h4 className="font-industrial font-medium uppercase text-primary mb-2">Cost Projections</h4>
									<p className="text-sm text-foreground">
										Budget forecasting and analysis to control labor costs and optimize resource
										allocation
									</p>
								</div>
								<div className="panel-shadow border-2 border-accent bg-accent/10 p-4">
									<h4 className="font-industrial font-medium uppercase text-accent mb-2">Seasonal Analysis</h4>
									<p className="text-sm text-foreground">
										Identify seasonal patterns and demand fluctuations for proactive workforce
										planning
									</p>
								</div>
							</div>
						</CardBody>
					</Card>
				</div>
			)}

			{section === "capacity" && (
				<div className="space-y-6">
					<CapacityPlanningTool
						timeRange={range as any}
						stationData={placeholderData.stations.map((s) => ({
							name: s.name,
							totalEmployees: s.employees,
							avgUnitsPerHour: s.efficiency,
							occupancyRate: s.occupancy,
						}))}
					/>
				</div>
			)}

			{section === "benchmarks" && (
				<div className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle>Performance Benchmarks</CardTitle>
						</CardHeader>
						<CardBody>
							<div className="text-center py-8">
								<h3 className="text-lg font-medium text-foreground mb-2">
									Benchmarking Analysis Coming Soon
								</h3>
								<p className="text-muted-foreground">
									Comparative analysis, industry standards, and performance scoring will be
									available here
								</p>
								<div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
									<div className="panel-shadow text-center border-2 border-border bg-muted p-4">
										<h4 className="font-industrial font-medium uppercase text-foreground">Station Benchmarks</h4>
										<p className="text-sm text-muted-foreground mt-2">
											Compare performance across stations
										</p>
									</div>
									<div className="panel-shadow text-center border-2 border-border bg-muted p-4">
										<h4 className="font-industrial font-medium uppercase text-foreground">Employee Rankings</h4>
										<p className="text-sm text-muted-foreground mt-2">
											Performance-based evaluations
										</p>
									</div>
									<div className="panel-shadow text-center border-2 border-border bg-muted p-4">
										<h4 className="font-industrial font-medium uppercase text-foreground">Industry Standards</h4>
										<p className="text-sm text-muted-foreground mt-2">
											Compare to industry metrics
										</p>
									</div>
								</div>
							</div>
						</CardBody>
					</Card>
				</div>
			)}
		</div>
	);
}
