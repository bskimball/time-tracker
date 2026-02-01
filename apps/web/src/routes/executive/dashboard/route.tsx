import {
	Card,
	CardBody,
	CardHeader,
	CardTitle,
	Badge,
	Alert,
	Metric,
} from "@monorepo/design-system";
import { PageHeader } from "~/components/page-header";
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
import { RefreshButton } from "./refresh-button";
import { TimeRangeTabs } from "./time-range-tabs";
import {
	LiaChartBarSolid,
	LiaDollarSignSolid,
	LiaChartLineSolid,
	LiaCalendarAltSolid,
} from "react-icons/lia";

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

	// Helper to determine KPI trends
	const getKPIConfig = (value: number, type: string) => {
		switch (type) {
			case "productivity":
				if (value > 20) return { direction: "up" as const };
				if (value > 15) return { direction: "neutral" as const };
				return { direction: "down" as const };
			case "overtime":
				if (value > 15) return { direction: "up" as const };
				if (value > 10) return { direction: "neutral" as const };
				return { direction: "down" as const };
			case "occupancy":
				if (value > 85) return { direction: "up" as const };
				if (value > 70) return { direction: "neutral" as const };
				return { direction: "down" as const };
			case "variance":
				if (Math.abs(value) > 10) return { direction: "up" as const };
				if (Math.abs(value) > 5) return { direction: "neutral" as const };
				return { direction: "down" as const };
			default:
				return { direction: "neutral" as const };
		}
	};

	const productivityConfig = getKPIConfig(kpis.productivityRate, "productivity");
	const overtimeConfig = getKPIConfig(kpis.overtimePercentage, "overtime");
	const occupancyConfig = getKPIConfig(kpis.occupancyLevel, "occupancy");
	const varianceConfig = getKPIConfig(laborCost.variancePercentage, "variance");

	return (
		<div className="space-y-8 pb-8">
			<PageHeader
				title="Executive Dashboard"
				subtitle="Overview of key performance indicators, workforce analytics, and strategic insights"
				actions={<RefreshButton action={refreshDashboardCache} />}
			/>

			{/* Time Range Selector */}
			<div className="flex justify-center">
				<TimeRangeTabs />
			</div>

			<div className="flex items-center justify-between px-1">
				<p className="text-sm font-medium text-muted-foreground font-mono">
					DATA_RANGE: <span className="text-foreground">{dateRange.display}</span>
				</p>
			</div>

			{/* Critical Alerts */}
			{alerts.length > 0 && (
				<div className="space-y-4">
					<h2 className="text-sm font-industrial font-bold text-foreground flex items-center gap-2 tracking-widest uppercase">
						<span className="relative flex h-2 w-2">
							<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
							<span className="relative inline-flex rounded-full h-2 w-2 bg-destructive"></span>
						</span>
						Critical Attention Needed
					</h2>
					<div className="grid gap-3">
						{alerts.map((alert) => (
							<Alert
								key={alert.id}
								variant={alert.type}
							>
								<div className="flex justify-between items-start">
									<div>
										<h3 className="font-bold text-base font-heading tracking-tight">{alert.title}</h3>
										<p className="text-sm mt-1 opacity-90 font-mono text-xs">{alert.message}</p>
									</div>
									<Badge
										variant={
											alert.priority === "high"
												? "destructive"
												: alert.priority === "medium"
													? "primary"
													: "secondary"
										}
									>
										{alert.priority}
									</Badge>
								</div>
							</Alert>
						))}
					</div>
				</div>
			)}

			{/* Main KPI Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
				<KPICard
					title="Active Employees"
					value={kpis.totalActiveEmployees}
					subtitle="Current workforce"
					icon="users"
					trend={{ direction: "neutral", value: "Stable", label: "vs last week" }}
				/>

				<KPICard
					title="Productivity Rate"
					value={`${kpis.productivityRate} u/hr`}
					subtitle={`${format(new Date(), "EEEE")}'s average`}
					icon="chart"
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
					icon="clock"
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
					icon="industry"
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
			<div className="relative">
				<h2 className="text-sm font-industrial font-bold text-muted-foreground mb-4 uppercase tracking-widest">
					Financial Overview
				</h2>
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					<KPICard
						title="Labor Cost Per Unit"
						value={`$${kpis.laborCostPerUnit}`}
						subtitle="Average cost analysis"
						icon="dollar"
					/>

					<KPICard
						title="Cost Variance"
						value={`${laborCost.variancePercentage > 0 ? "+" : ""}${laborCost.variancePercentage}%`}
						subtitle={`${laborCost.variance > 0 ? "Over" : "Under"} budget`}
						icon="percent"
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
						icon="award"
						trend={{ direction: "up", value: "+2%", label: "vs target" }}
					/>
				</div>
			</div>

			{/* Station Performance Overview */}
			<div className="relative">
				<Card className="overflow-visible border-border/60">
					<CardHeader className="bg-muted/30 border-b border-border/50">
						<div className="flex items-center justify-between">
							<CardTitle className="uppercase tracking-widest font-industrial text-sm">
								Station Performance
							</CardTitle>
							<Link to="/executive/analytics" className="text-xs font-mono text-primary hover:underline">
								VIEW_ALL &rarr;
							</Link>
						</div>
					</CardHeader>
					<CardBody className="p-6">
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							{stationData.slice(0, 6).map((station) => (
								<div
									key={station.stationId}
									className="group border border-border/50 rounded-[2px] p-4 bg-card hover:border-primary/50 transition-all duration-200"
								>
									<div className="flex justify-between items-center mb-4">
										<h3 className="font-bold font-heading text-sm">{station.stationName}</h3>
										<div
											className={`w-1.5 h-1.5 rounded-full ${
												station.occupancyRate > 90
													? "bg-destructive animate-pulse"
													: station.occupancyRate > 70
														? "bg-chart-3"
														: "bg-chart-1"
											}`}
										/>
									</div>
									<div className="grid grid-cols-3 gap-4 text-center">
										<Metric
											label="Staff"
											value={station.totalEmployees}
											className="items-center text-center"
										/>
										<Metric
											label="U/Hr"
											value={station.avgUnitsPerHour.toFixed(1)}
											className="items-center text-center"
										/>
										<Metric
											label="Occ"
											value={`${station.occupancyRate.toFixed(0)}%`}
											className="items-center text-center"
											trendDirection={
												station.occupancyRate > 90
													? "down"
													: station.occupancyRate > 70
														? "up"
														: "neutral"
											}
										/>
									</div>
								</div>
							))}
						</div>
					</CardBody>
				</Card>
			</div>

			{/* Quick Actions */}
			<div className="relative">
				<h2 className="text-sm font-industrial font-bold text-muted-foreground mb-4 uppercase tracking-widest">
					Quick Actions
				</h2>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
					{[
						{
							title: "Productivity Report",
							desc: "Detailed efficiency metrics",
							href: "/executive/analytics?section=productivity",
							icon: LiaChartBarSolid,
						},
						{
							title: "Cost Analysis",
							desc: "Labor & operational costs",
							href: "/executive/analytics?section=labor-cost",
							icon: LiaDollarSignSolid,
						},
						{
							title: "Trend Analysis",
							desc: "Historical performance",
							href: "/executive/analytics?section=trends",
							icon: LiaChartLineSolid,
						},
						{
							title: "Capacity Planning",
							desc: "Future resource allocation",
							href: "/executive/analytics?section=capacity",
							icon: LiaCalendarAltSolid,
						},
					].map((action) => (
						<Link key={action.title} to={action.href}>
							<Card className="h-full hover:border-primary/50 transition-colors duration-200">
								<CardBody className="p-6 flex flex-col items-center text-center gap-3 group">
									<div className="p-3 rounded-[2px] bg-muted/30 text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-all duration-200">
										<action.icon className="w-5 h-5" aria-hidden="true" />
									</div>
									<div>
										<h3 className="font-bold text-foreground font-heading uppercase tracking-tight text-sm">
											{action.title}
										</h3>
										<p className="text-xs text-muted-foreground mt-1 font-mono tracking-tight">
											{action.desc}
										</p>
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

