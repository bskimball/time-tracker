import {
	Card,
	CardBody,
	CardHeader,
	CardTitle,
	Badge,
	LedIndicator,
	Metric,
} from "@monorepo/design-system";
import { PageHeader } from "~/components/page-header";
import { KPICard } from "~/routes/executive/kpi-card";
import { Link } from "react-router";
import { validateRequest } from "~/lib/auth";
import { getRequest } from "~/lib/request-context";
import {
	getExecutiveDashboardKPIs,
	getStationPerformanceData,
	getExecutiveAlerts,
	getPerformanceTrendData,
	refreshDashboardCache,
} from "./actions";
import { getExecutiveKpiThresholds } from "~/lib/operational-config";
import { format } from "date-fns";
import { RefreshButton } from "./refresh-button";
import { TimeRangeTabs } from "../time-range-tabs";
import { AlertsPopover } from "./alerts-popover";
import {
	ProductivityTrendChart,
	StationPerformanceChart,
	CostComparisonChart,
} from "./dashboard-charts";
import type { TrendDataPoint, StationBarData, CostBarData } from "./dashboard-charts";
import {
	LiaChartBarSolid,
	LiaDollarSignSolid,
	LiaChartLineSolid,
	LiaCalendarAltSolid,
} from "react-icons/lia";
import { Suspense } from "react";

// ── Section heading with numbered anchor ─────────────────────────────────────

function SectionHeading({ index, label }: { index: string; label: string }) {
	return (
		<div className="flex items-center gap-3 mb-4">
			<span className="font-mono text-[10px] text-primary/60 tabular-nums">{index}</span>
			<div className="flex-1 h-px bg-border/40" />
			<h2 className="text-[10px] font-industrial font-bold text-muted-foreground uppercase tracking-widest">
				{label}
			</h2>
		</div>
	);
}

type TimeRange = "today" | "week" | "month";

function getTimeRangeFromRequest(): TimeRange {
	const request = getRequest();
	if (!request) return "today";

	const range = new URL(request.url).searchParams.get("range");
	if (range === "today" || range === "week" || range === "month") {
		return range;
	}

	return "today";
}

export default async function Component() {
	const authPromise = validateRequest();
	const timeRange = getTimeRangeFromRequest();
	const alertsPromise = getExecutiveAlerts();

	// Fetch prev-period trend data for delta calculation (always "week" lookback)
	const prevTimeRange: TimeRange = timeRange === "today" ? "today" : timeRange === "month" ? "week" : "today";

	const [
		,
		{ kpis, laborCost },
		stationData,
		trendData,
		prevTrendData,
		kpiThresholds,
	] = await Promise.all([
		authPromise,
		getExecutiveDashboardKPIs(timeRange),
		getStationPerformanceData(timeRange),
		getPerformanceTrendData("productivity", timeRange),
		getPerformanceTrendData("productivity", prevTimeRange),
		getExecutiveKpiThresholds(),
	]);

	// ── Last-synced timestamp ────────────────────────────────────────────────
	const lastSyncedAt = new Date().toISOString();

	// ── Derived chart data ───────────────────────────────────────────────────

	const trendDateFormat = timeRange === "month" ? "MMM d" : "EEE";
	const trendRangeLabel =
		timeRange === "today" ? "TODAY" : timeRange === "month" ? "LAST 30 DAYS" : "WEEK TO DATE";

	const trendChartData: TrendDataPoint[] = trendData.map((point) => ({
		date: format(new Date(point.date), trendDateFormat),
		value: point.value,
	}));

	// ── Trend delta vs prev period ────────────────────────────────────────────
	const currentAvg =
		trendData.length > 0
			? trendData.reduce((sum, p) => sum + p.value, 0) / trendData.length
			: null;
	const prevAvg =
		prevTrendData.length > 0
			? prevTrendData.reduce((sum, p) => sum + p.value, 0) / prevTrendData.length
			: null;
	const trendDelta =
		currentAvg !== null && prevAvg !== null && prevAvg > 0
			? ((currentAvg - prevAvg) / prevAvg) * 100
			: null;

	const stationChartData: StationBarData[] = stationData.slice(0, 6).map((s) => ({
		name: s.stationName.length > 12 ? s.stationName.slice(0, 12) + "\u2026" : s.stationName,
		productivity: Number(s.avgUnitsPerHour.toFixed(1)),
		occupancy: Number(s.occupancyRate.toFixed(0)),
	}));

	const costChartData: CostBarData[] = [
		{
			label: "Budgeted",
			value: Math.round(laborCost.budgetedCost),
			fill: "var(--color-chart-5)",
		},
		{
			label: "Actual",
			value: Math.round(laborCost.actualCost),
			fill: laborCost.variance > 0 ? "var(--color-destructive)" : "var(--color-chart-3)",
		},
		{
			label: "Regular",
			value: Math.round(laborCost.regularCost),
			fill: "var(--color-primary)",
		},
		{
			label: "Overtime",
			value: Math.round(laborCost.overtimeCost),
			fill: "var(--color-warning)",
		},
	];

	// ── KPI trend helpers ────────────────────────────────────────────────────

	const getKPIConfig = (value: number, type: string) => {
		switch (type) {
			case "productivity":
				if (value > kpiThresholds.productivityHigh) return { direction: "up" as const };
				if (value > kpiThresholds.productivityMedium) return { direction: "neutral" as const };
				return { direction: "down" as const };
			case "overtime":
				if (value > kpiThresholds.overtimeHigh) return { direction: "up" as const };
				if (value > kpiThresholds.overtimeMedium) return { direction: "neutral" as const };
				return { direction: "down" as const };
			case "occupancy":
				if (value > kpiThresholds.occupancyHigh) return { direction: "up" as const };
				if (value > kpiThresholds.occupancyMedium) return { direction: "neutral" as const };
				return { direction: "down" as const };
			case "variance":
				if (Math.abs(value) > kpiThresholds.varianceHigh) return { direction: "up" as const };
				if (Math.abs(value) > kpiThresholds.varianceMedium)
					return { direction: "neutral" as const };
				return { direction: "down" as const };
			default:
				return { direction: "neutral" as const };
		}
	};

	const productivityConfig = getKPIConfig(kpis.productivityRate, "productivity");
	const overtimeConfig = getKPIConfig(kpis.overtimePercentage, "overtime");
	const occupancyConfig = getKPIConfig(kpis.occupancyLevel, "occupancy");
	const varianceConfig = getKPIConfig(laborCost.variancePercentage, "variance");

	// ── Dominant KPI: whichever is furthest from "neutral" ───────────────────
	// We pick the first non-neutral status to highlight. Productivity is preferred anchor.
	const dominantKPI =
		productivityConfig.direction !== "neutral"
			? "productivity"
			: overtimeConfig.direction !== "neutral"
				? "overtime"
				: occupancyConfig.direction !== "neutral"
					? "occupancy"
					: "active-employees";

	// ── Financial health status helpers ─────────────────────────────────────
	function financialStatusDot(direction: "up" | "down" | "neutral") {
		if (direction === "down") return "bg-chart-3"; // on-target = green
		if (direction === "neutral") return "bg-warning"; // near threshold = amber
		return "bg-destructive"; // over threshold = red
	}

	const costUnitStatus = financialStatusDot(
		kpis.laborCostPerUnit <= 5 ? "down" : kpis.laborCostPerUnit <= 10 ? "neutral" : "up"
	);
	const varianceDotStatus = financialStatusDot(varianceConfig.direction);
	const efficiencyStatus = financialStatusDot(
		kpis.efficiencyRatio >= 0.85 ? "down" : kpis.efficiencyRatio >= 0.7 ? "neutral" : "up"
	);

	// ── Quick action micro-stats ─────────────────────────────────────────────
	const costVarianceSign = laborCost.variance > 0 ? "+" : "";
	const costVarianceMicroStat = `$${costVarianceSign}${Math.abs(laborCost.variance).toLocaleString(undefined, { maximumFractionDigits: 0 })} ${laborCost.variance > 0 ? "over" : "under"}`;
	const quickActionStats: Record<string, string> = {
		"Productivity Report": `${kpis.productivityRate} u/hr avg`,
		"Cost Analysis": costVarianceMicroStat,
		"Trend Analysis": trendDelta !== null ? `${trendDelta > 0 ? "+" : ""}${trendDelta.toFixed(1)}% vs prior` : "—",
		"Capacity Planning": `${kpis.occupancyLevel.toFixed(0)}% utilized`,
	};

	return (
		<div className="space-y-8 pb-8">
			{/* ── Header ──────────────────────────────────────────────────── */}
			<div>
				<PageHeader
					title="Executive Dashboard"
					subtitle="Overview of key performance indicators, workforce analytics, and strategic insights"
					actions={
						<div className="flex items-center gap-4">
							<Suspense fallback={<AlertsPopoverFallback />}>
								<ExecutiveAlertsPopover alertsPromise={alertsPromise} />
							</Suspense>
							<RefreshButton action={refreshDashboardCache} lastSyncedAt={lastSyncedAt} />
						</div>
					}
				/>
			</div>

			{/* ── Time Range ──────────────────────────────────────────────── */}
			<div>
				<TimeRangeTabs ranges={["today", "week", "month"]} defaultRange="today" />
			</div>

			{/* ── Hero: Productivity Trend ─────────────────────────────────── */}
			<section>
				<Card className="overflow-hidden">
					<CardHeader className="bg-muted/30 border-b border-border/50">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3">
								<LedIndicator active />
								<CardTitle className="uppercase tracking-widest font-industrial text-sm">
									Productivity Trend
								</CardTitle>
								<Badge variant="secondary">{trendRangeLabel}</Badge>
								{trendDelta !== null && (
									<span
										className={`text-[10px] font-mono px-1.5 py-0.5 rounded-[1px] tabular-nums ${
											trendDelta > 0
												? "text-chart-3 bg-chart-3/10"
												: trendDelta < 0
													? "text-destructive bg-destructive/10"
													: "text-muted-foreground bg-muted"
										}`}
									>
										{trendDelta > 0 ? "+" : ""}
										{trendDelta.toFixed(1)}% vs prior
									</span>
								)}
							</div>
							<Link
								to="/executive/analytics?section=trends"
								className="text-xs font-mono text-primary hover:underline"
							>
								FULL_ANALYSIS &rarr;
							</Link>
						</div>
					</CardHeader>
					<CardBody className="p-5">
						{trendChartData.length > 0 ? (
							<ProductivityTrendChart
								data={trendChartData}
								thresholdMedium={kpiThresholds.productivityMedium}
								thresholdHigh={kpiThresholds.productivityHigh}
							/>
						) : (
							<div className="h-[260px] flex items-center justify-center text-muted-foreground font-mono text-sm">
								No trend data available for the selected period
							</div>
						)}
					</CardBody>
				</Card>
			</section>

			{/* ── KPI Row ─────────────────────────────────────────────────── */}
			<section>
				<SectionHeading index="01" label="Key Performance Indicators" />
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
					<KPICard
						title="Active Employees"
						value={kpis.totalActiveEmployees}
						subtitle="Current workforce"
						icon="users"
						animationCacheKey={`dashboard:${timeRange}:active-employees`}
						dominant={dominantKPI === "active-employees"}
						trend={{ direction: "neutral", value: "Stable", label: "vs last week" }}
					/>
					<KPICard
						title="Productivity Rate"
						value={`${kpis.productivityRate} u/hr`}
						subtitle={`${format(new Date(), "EEEE")}'s average`}
						icon="chart"
						animationCacheKey={`dashboard:${timeRange}:productivity-rate`}
						dominant={dominantKPI === "productivity"}
						trend={{
							direction: productivityConfig.direction,
							value:
								productivityConfig.direction === "up"
									? "Above threshold"
									: productivityConfig.direction === "down"
										? "Below threshold"
										: "On threshold",
							label: "Based on configured KPI bands",
						}}
					/>
					<KPICard
						title="Overtime %"
						value={`${kpis.overtimePercentage}%`}
						subtitle="Of total hours"
						icon="clock"
						animationCacheKey={`dashboard:${timeRange}:overtime`}
						dominant={dominantKPI === "overtime"}
						trend={{
							direction: overtimeConfig.direction,
							value:
								overtimeConfig.direction === "up"
									? "Above guardrail"
									: overtimeConfig.direction === "down"
										? "Within guardrail"
										: "Near guardrail",
							label: "Based on overtime policy thresholds",
						}}
					/>
					<KPICard
						title="Occupancy Level"
						value={`${kpis.occupancyLevel.toFixed(1)}%`}
						subtitle="Station utilization"
						icon="industry"
						animationCacheKey={`dashboard:${timeRange}:occupancy`}
						dominant={dominantKPI === "occupancy"}
						trend={{
							direction: occupancyConfig.direction,
							value:
								occupancyConfig.direction === "up"
									? "High load"
									: occupancyConfig.direction === "down"
										? "Low load"
										: "Balanced",
							label: "Active staffing vs station capacity",
						}}
					/>
				</div>
			</section>

			{/* ── Operations: Station Performance + Financial Health ────── */}
			<section>
				<SectionHeading index="02" label="Operations Overview" />

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					{/* ── Station Performance ────────────────────────────── */}
					<div>
						<Card className="h-full flex flex-col overflow-hidden">
							<CardHeader className="bg-muted/30 border-b border-border/50">
								<div className="flex items-center justify-between">
									<CardTitle className="uppercase tracking-widest font-industrial text-sm">
										Station Performance
									</CardTitle>
									<Link
										to="/executive/analytics"
										className="text-xs font-mono text-primary hover:underline"
									>
										VIEW_ALL &rarr;
									</Link>
								</div>
							</CardHeader>
							<CardBody className="p-4 flex-1">
								{stationChartData.length > 0 ? (
									<StationPerformanceChart data={stationChartData} />
								) : (
									<div className="h-[240px] flex items-center justify-center text-muted-foreground font-mono text-sm">
										No station data available
									</div>
								)}
							</CardBody>
							{/* Station exception panel: top performer + critical station */}
							{stationData.length > 0 && (() => {
								const sorted = [...stationData].sort(
									(a, b) => b.avgUnitsPerHour - a.avgUnitsPerHour
								);
								const top = sorted[0];
								const critical = [...stationData].sort(
									(a, b) => b.occupancyRate - a.occupancyRate
								)[0];
								const hasCritical = critical && critical.occupancyRate > 80;
								return (
									<div className="border-t border-border/50 bg-muted/10 px-4 py-2 flex gap-3">
										{top && (
											<div className="flex-1 flex items-center gap-2 min-w-0">
												<Badge variant="secondary" className="text-[9px] shrink-0">
													TOP
												</Badge>
												<span className="font-mono text-xs font-bold truncate">{top.stationName}</span>
												<span className="font-mono text-xs text-chart-3 shrink-0 tabular-nums">
													{top.avgUnitsPerHour.toFixed(1)} u/hr
												</span>
											</div>
										)}
										{hasCritical && (
											<div className="flex-1 flex items-center gap-2 min-w-0 border-l border-border/40 pl-3">
												<Badge variant="destructive" className="text-[9px] shrink-0">
													LOAD
												</Badge>
												<span className="font-mono text-xs truncate">{critical.stationName}</span>
												<span className="font-mono text-xs text-destructive shrink-0 tabular-nums">
													{critical.occupancyRate.toFixed(0)}%
												</span>
											</div>
										)}
									</div>
								);
							})()}
						</Card>
					</div>

					{/* ── Financial Health ────────────────────────────────── */}
					<div>
						<Card className="h-full flex flex-col overflow-hidden">
							<CardHeader className="bg-muted/30 border-b border-border/50">
								<div className="flex items-center justify-between">
									<CardTitle className="uppercase tracking-widest font-industrial text-sm">
										Financial Health
									</CardTitle>
									<Link
										to="/executive/analytics?section=labor-cost"
										className="text-xs font-mono text-primary hover:underline"
									>
										DETAILS &rarr;
									</Link>
								</div>
							</CardHeader>

							{/* Key financial metrics with status dots */}
							<div className="grid grid-cols-3 divide-x divide-border/50 border-b border-border/50">
								<div className="p-4 relative">
									<div className={`absolute top-3 right-3 w-1.5 h-1.5 rounded-full ${costUnitStatus}`} />
									<Metric
										label="Cost/Unit"
										value={`$${kpis.laborCostPerUnit}`}
										className="items-center text-center"
									/>
								</div>
								<div className="p-4 relative">
									<div className={`absolute top-3 right-3 w-1.5 h-1.5 rounded-full ${varianceDotStatus}`} />
									<Metric
										label="Variance"
										value={`${laborCost.variancePercentage > 0 ? "+" : ""}${laborCost.variancePercentage}%`}
										trendDirection={varianceConfig.direction}
										className="items-center text-center"
									/>
								</div>
								<div className="p-4 relative">
									<div className={`absolute top-3 right-3 w-1.5 h-1.5 rounded-full ${efficiencyStatus}`} />
									<Metric
										label="Efficiency"
										value={`${(kpis.efficiencyRatio * 100).toFixed(0)}%`}
										trendDirection="up"
										className="items-center text-center"
									/>
								</div>
							</div>

							{/* Cost breakdown chart */}
							<CardBody className="p-4 flex-1">
								<p className="text-[10px] font-industrial text-muted-foreground uppercase tracking-widest mb-3">
									Cost Breakdown
								</p>
								<CostComparisonChart data={costChartData} />
							</CardBody>

							{/* Budget summary footer */}
							<div className="border-t border-border/50 bg-muted/10 px-4 py-3 flex items-center justify-between text-xs font-mono">
								<span className="text-muted-foreground">
									Budget: $
									{laborCost.budgetedCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}
								</span>
								<span
									className={
										laborCost.variance > 0 ? "text-destructive font-bold" : "text-chart-3 font-bold"
									}
								>
									{laborCost.variance > 0 ? "+" : ""}$
									{Math.abs(laborCost.variance).toLocaleString(undefined, {
										maximumFractionDigits: 0,
									})}{" "}
									{laborCost.variance > 0 ? "over" : "under"}
								</span>
							</div>
						</Card>
					</div>
				</div>
			</section>

			{/* ── Quick Actions ───────────────────────────────────────────── */}
			<section>
				<SectionHeading index="03" label="Quick Actions" />
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 stagger-children">
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
							<Card className="h-full group hover:border-primary/50 transition-colors duration-200">
								<CardBody className="p-5 flex items-center gap-4">
									<div className="p-3 rounded-[2px] bg-muted/30 text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-all duration-200 flex-shrink-0">
										<action.icon className="w-5 h-5" aria-hidden="true" />
									</div>
									<div className="flex-1 min-w-0">
										<h3 className="font-bold text-foreground font-heading uppercase tracking-tight text-sm">
											{action.title}
										</h3>
										<p className="text-xs text-muted-foreground mt-0.5 font-mono tracking-tight">
											{action.desc}
										</p>
									</div>
									{quickActionStats[action.title] && (
										<div className="text-right shrink-0">
											<span className="font-mono text-xs font-bold text-primary tabular-nums">
												{quickActionStats[action.title]}
											</span>
										</div>
									)}
								</CardBody>
							</Card>
						</Link>
					))}
				</div>
			</section>
		</div>
	);
}

async function ExecutiveAlertsPopover({
	alertsPromise,
}: {
	alertsPromise: Promise<Awaited<ReturnType<typeof getExecutiveAlerts>>>;
}) {
	const alerts = await alertsPromise;
	return <AlertsPopover alerts={alerts} />;
}

function AlertsPopoverFallback() {
	return (
		<div className="flex items-center gap-2 px-3 py-1.5 rounded-[2px] border border-border bg-muted/20 text-xs font-mono text-muted-foreground uppercase tracking-wide">
			<span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-pulse" />
			Analyzing alerts
		</div>
	);
}
