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
		<div className="space-y-8 pb-8">
			{/* Header Section */}
			<div className="relative overflow-hidden rounded bg-white p-8 border border-border shadow">
				<div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
					<div>
						<h1 className="text-4xl font-bold tracking-tight text-foreground">Executive Dashboard</h1>
						<p className="text-muted-foreground mt-2 text-lg max-w-2xl">
							Overview of key performance indicators, workforce analytics, and strategic insights.
						</p>
					</div>
					<div className="flex flex-col sm:flex-row items-center gap-3">
						<div className="bg-background/50 backdrop-blur-sm p-1 rounded-lg border border-border shadow-sm">
							{(["today", "week", "month"] as TimeRange[]).map((range) => (
								<Link key={range} to={`/executive/dashboard?range=${range}`}>
									<Button
										variant={timeRange === range ? "primary" : "ghost"}
										size="sm"
										className={timeRange === range ? "shadow-sm" : ""}
									>
										{range.charAt(0).toUpperCase() + range.slice(1)}
									</Button>
								</Link>
							))}
						</div>
						<form action={refreshDashboardCache}>
							<Button variant="outline" size="sm" type="submit" className="h-9">
								<svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
								</svg>
								Refresh
							</Button>
						</form>
					</div>
				</div>
				<div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
				<div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-64 h-64 bg-secondary/5 rounded-full blur-3xl"></div>
			</div>

			<div className="flex items-center justify-between px-1">
				<p className="text-sm font-medium text-muted-foreground">
					Showing data for: <span className="text-foreground">{dateRange.display}</span>
				</p>
			</div>

			{/* Critical Alerts */}
			{alerts.length > 0 && (
				<div className="space-y-3">
					<h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
						<span className="relative flex h-3 w-3">
							<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
							<span className="relative inline-flex rounded-full h-3 w-3 bg-destructive"></span>
						</span>
						Critical Attention Needed
					</h2>
					<div className="grid gap-3">
						{alerts.map((alert) => (
							<Alert key={alert.id} variant={alert.type} className="shadow-sm border border-destructive/20 bg-destructive/5">
								<div className="flex justify-between items-start">
									<div>
										<h3 className="font-semibold text-base">{alert.title}</h3>
										<p className="text-sm mt-1 opacity-90">{alert.message}</p>
									</div>
									<span
										className={`px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-full ${alert.priority === "high"
											? "bg-destructive text-destructive-foreground"
											: alert.priority === "medium"
												? "bg-amber-500 text-white"
												: "bg-blue-500 text-white"
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

			{/* Main KPI Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				<KPICard
					title="Active Employees"
					value={kpis.totalActiveEmployees}
					subtitle="Current workforce"
					color="blue"
					trend={{ direction: "neutral", value: "Stable", label: "vs last week" }}
				/>

				<KPICard
					title="Productivity Rate"
					value={`${kpis.productivityRate} u/hr`}
					subtitle={`${format(new Date(), "EEEE")}'s average`}
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
					title="Overtime %"
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

			{/* Financial Overview */}
			<div>
				<h2 className="text-xl font-bold text-foreground mb-4">Financial Overview</h2>
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
						color="purple"
						trend={{ direction: "up", value: "+2%", label: "vs target" }}
					/>
				</div>
			</div>

			{/* Station Performance Overview */}
			<div>
				<div className="flex items-center justify-between mb-4">
					<h2 className="text-xl font-bold text-foreground">Station Performance</h2>
					<Link to="/executive/analytics" className="text-sm text-primary hover:underline">
						View All Stations &rarr;
					</Link>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{stationData.slice(0, 6).map((station) => (
						<Card key={station.stationId} className="group hover:shadow-md transition-all duration-200 border border-border">
							<CardHeader className="pb-2 border-b border-border">
								<div className="flex justify-between items-center">
									<CardTitle className="text-base font-semibold">{station.stationName}</CardTitle>
									<div className={`w-2 h-2 rounded-full ${station.occupancyRate > 90 ? 'bg-red-500' : station.occupancyRate > 70 ? 'bg-green-500' : 'bg-yellow-500'}`} />
								</div>
							</CardHeader>
							<CardBody className="pt-4">
								<div className="grid grid-cols-3 gap-2 text-center">
									<div className="bg-muted/30 rounded-lg p-2">
										<div className="text-xs text-muted-foreground uppercase tracking-wider">Staff</div>
										<div className="font-bold text-lg">{station.totalEmployees}</div>
									</div>
									<div className="bg-muted/30 rounded-lg p-2">
										<div className="text-xs text-muted-foreground uppercase tracking-wider">U/Hr</div>
										<div className="font-bold text-lg">{station.avgUnitsPerHour.toFixed(1)}</div>
									</div>
									<div className="bg-muted/30 rounded-lg p-2">
										<div className="text-xs text-muted-foreground uppercase tracking-wider">Occ</div>
										<div className={`font-bold text-lg ${station.occupancyRate > 90
											? "text-destructive"
											: station.occupancyRate > 70
												? "text-emerald-600 dark:text-emerald-400"
												: "text-amber-600 dark:text-amber-400"
											}`}>
											{station.occupancyRate.toFixed(0)}%
										</div>
									</div>
								</div>
							</CardBody>
						</Card>
					))}
				</div>
			</div>

			{/* Quick Actions */}
			<div>
				<h2 className="text-xl font-bold text-foreground mb-4">Quick Actions</h2>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
					{[
						{ title: "Productivity Report", desc: "Detailed efficiency metrics", href: "/executive/analytics?section=productivity", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
						{ title: "Cost Analysis", desc: "Labor & operational costs", href: "/executive/analytics?section=labor-cost", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
						{ title: "Trend Analysis", desc: "Historical performance", href: "/executive/analytics?section=trends", icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" },
						{ title: "Capacity Planning", desc: "Future resource allocation", href: "/executive/analytics?section=capacity", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
					].map((action) => (
						<Link key={action.title} to={action.href} className="group">
							<Card className="h-full hover:border-primary/50 hover:shadow-md transition-all duration-200 border border-border">
								<CardBody className="p-6 flex flex-col items-center text-center gap-3">
									<div className="p-3 rounded-full bg-primary/5 text-primary group-hover:bg-primary/10 transition-colors">
										<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={action.icon} />
										</svg>
									</div>
									<div>
										<h3 className="font-semibold text-foreground">{action.title}</h3>
										<p className="text-sm text-muted-foreground mt-1">{action.desc}</p>
									</div>
								</CardBody>
							</Card>
						</Link>
					))}
				</div>
			</div>
		</div>
	);
}
