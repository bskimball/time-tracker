import { Card, CardHeader, CardTitle, CardBody } from "~/components/ds/card";
import { Alert } from "~/components/ds/alert";
import { Button } from "~/components/ds/button";
import { KPICard } from "~/routes/executive/kpi-card";
import { Link } from "react-router";
import { validateRequest } from "~/lib/auth";
import {
	getExecutiveDashboardKPIs,
	getStationPerformanceData,
	getExecutiveAlerts,
	refreshDashboardCache,
} from "./actions";
import { getDateRange } from "~/lib/date-utils";
import { format } from "date-fns";
import { cn } from "~/lib/cn";

type TimeRange = "today" | "week" | "month";

export default async function Component({
	searchParams,
}: {
	searchParams?: { range?: TimeRange };
}) {
	await validateRequest();
	// Middleware ensures ADMIN role

	const timeRange = searchParams?.range || "today";

	// Get all dashboard data
	const [{ kpis, laborCost }, stationData, alerts] = await Promise.all([
		getExecutiveDashboardKPIs(timeRange),
		getStationPerformanceData(timeRange),
		getExecutiveAlerts(),
	]);

	const dateRange = getDateRange(timeRange);

	// Helper to determine KPI colors and trends
	const getKPIConfig = (value: number, type: string) => {
		switch (type) {
			case "productivity":
				if (value > 20) return { color: "green" as const, direction: "up" as const };
				if (value > 15) return { color: "yellow" as const, direction: "neutral" as const };
				return { color: "red" as const, direction: "down" as const };
			case "overtime":
				if (value > 15) return { color: "red" as const, direction: "up" as const };
				if (value > 10) return { color: "yellow" as const, direction: "neutral" as const };
				return { color: "green" as const, direction: "down" as const };
			case "occupancy":
				if (value > 85) return { color: "red" as const, direction: "up" as const };
				if (value > 70) return { color: "yellow" as const, direction: "neutral" as const };
				return { color: "green" as const, direction: "down" as const };
			case "variance":
				if (Math.abs(value) > 10) return { color: "red" as const, direction: "up" as const };
				if (Math.abs(value) > 5) return { color: "yellow" as const, direction: "neutral" as const };
				return { color: "green" as const, direction: "down" as const };
			default:
				return { color: "blue" as const, direction: "neutral" as const };
		}
	};

	const productivityConfig = getKPIConfig(kpis.productivityRate, "productivity");
	const overtimeConfig = getKPIConfig(kpis.overtimePercentage, "overtime");
	const occupancyConfig = getKPIConfig(kpis.occupancyLevel, "occupancy");
	const varianceConfig = getKPIConfig(laborCost.variancePercentage, "variance");

	return (
		<div className="space-y-8 p-2 sm:p-4 animate-in fade-in duration-500">
			{/* Header */}
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-border/50 pb-6">
				<div>
					<h1 className="text-4xl font-bold tracking-tight text-foreground">Executive Dashboard</h1>
					<p className="text-muted-foreground mt-2 text-lg font-light">
						Strategic performance insights and workforce analytics
					</p>
				</div>
				<div className="flex items-center gap-3">
					<Card className="flex-row items-center p-1 gap-1 border-dashed shadow-none bg-accent/20">
						{(["today", "week", "month"] as TimeRange[]).map((range) => (
							<Link key={range} to={`/executive/dashboard?range=${range}`}>
								<Button
									variant={timeRange === range ? "primary" : "ghost"}
									size="sm"
									className={cn("h-8 rounded-sm", timeRange === range && "shadow-sm")}
								>
									{range.charAt(0).toUpperCase() + range.slice(1)}
								</Button>
							</Link>
						))}
					</Card>

					<form action={refreshDashboardCache}>
						<Button variant="outline" size="sm" type="submit" className="h-10">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
								className="mr-2"
							>
								<path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
								<path d="M3 3v5h5" />
								<path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
								<path d="M16 21h5v-5" />
							</svg>
							Refresh
						</Button>
					</form>
				</div>
			</div>

			<div className="flex items-center justify-between text-sm text-muted-foreground">
				<p>
					Data period: <span className="font-medium text-foreground">{dateRange.display}</span>
				</p>
			</div>

			{/* Critical Alerts */}
			{alerts.length > 0 && (
				<div className="space-y-3">
					<h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
						<span className="relative flex h-3 w-3">
							<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
							<span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
						</span>
						Critical Alerts
					</h2>
					<div className="grid gap-3">
						{alerts.map((alert) => (
							<Alert key={alert.id} variant={alert.type} className="shadow-sm border-l-4">
								<div className="flex justify-between items-start">
									<div>
										<h3 className="font-medium">{alert.title}</h3>
										<p className="text-sm mt-1 opacity-90">{alert.message}</p>
									</div>
									<span
										className={`px-2.5 py-0.5 text-xs font-semibold rounded-full uppercase tracking-wide ${
											alert.priority === "high"
												? "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300"
												: alert.priority === "medium"
													? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300"
													: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300"
										}`}
									>
										{alert.priority}
									</span>
								</div>
							</Alert>
						))}
					</div>
				</div>
			)}

			{/* KPI Cards Grid */}
			<section className="space-y-4">
				<h3 className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
					Performance Overview
				</h3>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					<KPICard
						title="Active Employees"
						value={kpis.totalActiveEmployees}
						subtitle="Current workforce"
						color="blue"
					/>

					<KPICard
						title="Productivity Rate"
						value={`${kpis.productivityRate} units/hr`}
						subtitle={`${format(new Date(), "EEEE")}`}
						color={productivityConfig.color}
						trend={{
							direction: productivityConfig.direction,
							value:
								productivityConfig.direction === "up"
									? "+8%"
									: productivityConfig.direction === "down"
										? "-5%"
										: "0%",
							label: "vs yesterday",
						}}
					/>

					<KPICard
						title="Overtime Percentage"
						value={`${kpis.overtimePercentage}%`}
						subtitle="Of total hours"
						color={overtimeConfig.color}
						trend={{
							direction: overtimeConfig.direction,
							value:
								overtimeConfig.direction === "up"
									? "+2.3%"
									: overtimeConfig.direction === "down"
										? "-1.2%"
										: "0%",
							label: "vs last week",
						}}
					/>

					<KPICard
						title="Occupancy Level"
						value={`${kpis.occupancyLevel.toFixed(1)}%`}
						subtitle="Station utilization"
						color={occupancyConfig.color}
						trend={{
							direction: occupancyConfig.direction,
							value:
								occupancyConfig.direction === "up"
									? "+15%"
									: occupancyConfig.direction === "down"
										? "-8%"
										: "0%",
							label: "vs average",
						}}
					/>
				</div>
			</section>

			{/* Labor Cost Analysis */}
			<section className="space-y-4">
				<h3 className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
					Financial Metrics
				</h3>
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					<KPICard
						title="Labor Cost Per Unit"
						value={`$${kpis.laborCostPerUnit}`}
						subtitle="Average cost analysis"
						color={laborCost.variancePercentage > 0 ? "red" : "green"}
					/>

					<KPICard
						title="Cost Variance"
						value={`${laborCost.variancePercentage > 0 ? "+" : ""}${laborCost.variancePercentage}%`}
						subtitle={`${laborCost.variance > 0 ? "Over" : "Under"} budget`}
						color={varianceConfig.color}
						trend={{
							direction: varianceConfig.direction,
							value: `$${Math.abs(laborCost.variance).toFixed(0)}`,
							label: "vs $" + laborCost.budgetedCost.toFixed(0),
						}}
					/>

					<KPICard
						title="Efficiency Ratio"
						value={`${(kpis.efficiencyRatio * 100).toFixed(0)}%`}
						subtitle="Performance score"
						color="blue"
					/>
				</div>
			</section>

			{/* Station Performance Overview */}
			<section className="space-y-4">
				<div className="flex items-center justify-between">
					<h3 className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
						Station Performance
					</h3>
					<Link to="/executive/analytics?section=stations" className="text-sm text-primary hover:underline">
						View All Stations &rarr;
					</Link>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{stationData.slice(0, 6).map((station) => (
						<Card
							key={station.stationId}
							className="border-0 shadow-sm hover:shadow-md transition-all duration-200 group rounded-xl bg-card/50 backdrop-blur-sm"
						>
							<CardHeader className="pb-3">
								<CardTitle className="text-base flex justify-between items-center">
									{station.stationName}
									<div
										className={`h-2 w-2 rounded-full ${
											station.occupancyRate > 90
												? "bg-red-500"
												: station.occupancyRate > 70
													? "bg-yellow-500"
													: "bg-green-500"
										}`}
									/>
								</CardTitle>
							</CardHeader>
							<CardBody>
								<div className="space-y-3">
									<div className="flex justify-between items-center p-2 rounded-md bg-accent/30 group-hover:bg-accent/50 transition-colors">
										<span className="text-sm text-muted-foreground">Employees</span>
										<span className="font-semibold">{station.totalEmployees}</span>
									</div>
									<div className="flex justify-between items-center p-2 rounded-md bg-accent/30 group-hover:bg-accent/50 transition-colors">
										<span className="text-sm text-muted-foreground">Units/Hour</span>
										<span className="font-semibold">{station.avgUnitsPerHour.toFixed(1)}</span>
									</div>
									<div className="flex justify-between items-center p-2 rounded-md bg-accent/30 group-hover:bg-accent/50 transition-colors">
										<span className="text-sm text-muted-foreground">Occupancy</span>
										<span
											className={`font-bold ${
												station.occupancyRate > 90
													? "text-red-600 dark:text-red-400"
													: station.occupancyRate > 70
														? "text-yellow-600 dark:text-yellow-400"
														: "text-green-600 dark:text-green-400"
											}`}
										>
											{station.occupancyRate.toFixed(0)}%
										</span>
									</div>
								</div>
							</CardBody>
						</Card>
					))}
				</div>
			</section>

			{/* Quick Actions */}
			<section>
				<h3 className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-4">
					Quick Actions
				</h3>
				<Card className="bg-gradient-to-r from-background to-accent/10 border-dashed">
					<CardBody>
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
							<Link to="/executive/analytics?section=productivity">
								<Button variant="outline" className="w-full justify-start h-auto py-4 hover:border-primary hover:bg-primary/5 group">
									<div className="text-left">
										<div className="font-semibold group-hover:text-primary transition-colors">Productivity Report</div>
										<div className="text-xs text-muted-foreground font-normal">Detailed breakdown of output</div>
									</div>
								</Button>
							</Link>
							<Link to="/executive/analytics?section=labor-cost">
								<Button variant="outline" className="w-full justify-start h-auto py-4 hover:border-primary hover:bg-primary/5 group">
									<div className="text-left">
										<div className="font-semibold group-hover:text-primary transition-colors">Cost Analysis</div>
										<div className="text-xs text-muted-foreground font-normal">Labor spend vs budget</div>
									</div>
								</Button>
							</Link>
							<Link to="/executive/analytics?section=trends">
								<Button variant="outline" className="w-full justify-start h-auto py-4 hover:border-primary hover:bg-primary/5 group">
									<div className="text-left">
										<div className="font-semibold group-hover:text-primary transition-colors">Trend Analysis</div>
										<div className="text-xs text-muted-foreground font-normal">Historical performance data</div>
									</div>
								</Button>
							</Link>
							<Link to="/executive/analytics?section=capacity">
								<Button variant="outline" className="w-full justify-start h-auto py-4 hover:border-primary hover:bg-primary/5 group">
									<div className="text-left">
										<div className="font-semibold group-hover:text-primary transition-colors">Capacity Planning</div>
										<div className="text-xs text-muted-foreground font-normal">Future resource allocation</div>
									</div>
								</Button>
							</Link>
						</div>
					</CardBody>
				</Card>
			</section>
		</div>
	);
}
