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
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
				<div>
					<h1 className="text-3xl font-bold text-foreground">Executive Dashboard</h1>
					<p className="text-muted-foreground mt-1">
						Strategic performance insights and workforce analytics
					</p>
				</div>
				<div className="flex items-center gap-2">
					<form action={refreshDashboardCache}>
						<Button variant="outline" size="sm" type="submit">
							Refresh Data
						</Button>
					</form>
				</div>
			</div>

			{/* Date Range Selector */}
			<Card>
				<CardBody>
					<div className="flex flex-wrap gap-2">
						{(["today", "week", "month"] as TimeRange[]).map((range) => (
							<Link key={range} to={`/executive/dashboard?range=${range}`}>
								<Button variant={timeRange === range ? "primary" : "ghost"} size="sm">
									{range.charAt(0).toUpperCase() + range.slice(1)}
								</Button>
							</Link>
						))}
					</div>
					<p className="text-sm text-muted-foreground mt-2">{dateRange.display}</p>
				</CardBody>
			</Card>

			{/* Critical Alerts */}
			{alerts.length > 0 && (
				<div className="space-y-2">
					<h2 className="text-lg font-semibold text-foreground">Critical Alerts</h2>
					{alerts.map((alert) => (
						<Alert key={alert.id} variant={alert.type}>
							<div className="flex justify-between items-start">
								<div>
									<h3 className="font-medium">{alert.title}</h3>
									<p className="text-sm mt-1">{alert.message}</p>
								</div>
								<span
									className={`px-2 py-1 text-xs font-medium rounded-full ${
										alert.priority === "high"
											? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
											: alert.priority === "medium"
												? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
												: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
									}`}
								>
									{alert.priority}
								</span>
							</div>
						</Alert>
					))}
				</div>
			)}

			{/* KPI Cards Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

			{/* Labor Cost Analysis */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
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

			{/* Station Performance Overview */}
			<div>
				<h2 className="text-lg font-semibold text-foreground mb-4">Station Performance</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{stationData.slice(0, 6).map((station) => (
						<Card key={station.stationId} className="border">
							<CardHeader>
								<CardTitle className="text-base">{station.stationName}</CardTitle>
							</CardHeader>
							<CardBody>
								<div className="space-y-2">
									<div className="flex justify-between">
										<span className="text-sm text-muted-foreground">Employees:</span>
										<span className="font-medium">{station.totalEmployees}</span>
									</div>
									<div className="flex justify-between">
										<span className="text-sm text-muted-foreground">Units/Hour:</span>
										<span className="font-medium">{station.avgUnitsPerHour.toFixed(1)}</span>
									</div>
									<div className="flex justify-between">
										<span className="text-sm text-muted-foreground">Occupancy:</span>
										<span
											className={`font-medium ${
												station.occupancyRate > 90
													? "text-red-600"
													: station.occupancyRate > 70
														? "text-yellow-600"
														: "text-green-600"
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
			</div>

			{/* Quick Actions */}
			<Card>
				<CardHeader>
					<CardTitle>Quick Actions</CardTitle>
				</CardHeader>
				<CardBody>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
						<Link to="/executive/analytics?section=productivity">
							<Button variant="outline">Productivity Report</Button>
						</Link>
						<Link to="/executive/analytics?section=labor-cost">
							<Button variant="outline">Cost Analysis</Button>
						</Link>
						<Link to="/executive/analytics?section=trends">
							<Button variant="outline">Trend Analysis</Button>
						</Link>
						<Link to="/executive/analytics?section=capacity">
							<Button variant="outline">Capacity Planning</Button>
						</Link>
					</div>
				</CardBody>
			</Card>
		</div>
	);
}
