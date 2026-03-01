"use client";

import { Suspense, use, useState, useTransition, type ReactNode } from "react";
import { useNavigate } from "react-router";
import {
	Button,
	SimpleInput,
	Card,
	CardHeader,
	CardTitle,
	CardBody,
	Badge,
	Tab,
	TabList,
	Tabs,
	Alert,
} from "@monorepo/design-system";
import { PageHeader } from "~/components/page-header";
import { cn } from "~/lib/cn";
import {
	LiaFileAltSolid,
	LiaDownloadSolid,
	LiaSyncSolid,
	LiaCalendarAltSolid,
	LiaChartBarSolid,
	LiaIndustrySolid,
	LiaClipboardListSolid,
	LiaClockSolid,
} from "react-icons/lia";
import { parseAsString, parseAsStringEnum, useQueryState } from "nuqs";
import {
	ProductivityTrendChart,
	StationPerformanceChart,
} from "~/components/charts/executive-charts";
import type { TrendDataPoint, StationBarData } from "~/components/charts/executive-charts";
import type {
	ProductivityData,
	TaskPerformanceData,
	StationEfficiencyData,
	OvertimeData,
} from "./actions";

interface ReportDataType {
	productivityData: ProductivityData[];
	taskPerformanceData: TaskPerformanceData[];
	stationEfficiencyData: StationEfficiencyData[];
	overtimeData: OvertimeData[];
	summaryStats: SummaryStats;
}

type SummaryStats = {
	totalEmployees: number;
	activeEmployees: number;
	totalHoursWorked: number;
	averageHoursPerEmployee: number;
	totalOvertimeHours: number;
	peakDayOccupancy: number;
};

interface ReportsProps {
	initialStartDate: string;
	initialEndDate: string;
	hideHeader?: boolean;
	initialData?: ReportDataType;
	productivityDataPromise?: Promise<ProductivityData[]>;
	taskPerformanceDataPromise?: Promise<TaskPerformanceData[]>;
	stationEfficiencyDataPromise?: Promise<StationEfficiencyData[]>;
	overtimeDataPromise?: Promise<OvertimeData[]>;
	summaryStatsPromise?: Promise<SummaryStats>;
}

// KPI Card Component matching Dashboard style
const KpiCard = ({
	label,
	value,
	subValue,
	icon: Icon,
	variant = "default",
}: {
	label: string;
	value: string | number;
	subValue?: string;
	icon?: React.ComponentType<{ className?: string }>;
	variant?: "default" | "success" | "warning" | "destructive";
}) => {
	const colors = {
		default: "text-foreground",
		success: "text-success",
		warning: "text-warning",
		destructive: "text-destructive",
	};

	return (
		<div className="bg-card p-4 md:p-6 flex flex-col justify-between border border-border rounded-xs shadow-sm group hover:border-primary/50 transition-colors">
			<div className="flex items-center gap-2 text-muted-foreground mb-4">
				{Icon && <Icon className="w-5 h-5" />}
				<span className="text-xs font-heading uppercase tracking-wider font-semibold">{label}</span>
			</div>
			<div className="flex items-baseline gap-2">
				<span
					className={cn(
						"text-3xl font-data font-medium tracking-tight transition-colors",
						colors[variant]
					)}
				>
					{value}
				</span>
				{subValue && <span className="text-sm text-muted-foreground font-data">{subValue}</span>}
			</div>
		</div>
	);
};

export function ReportsManager({
	initialData,
	initialStartDate,
	initialEndDate,
	hideHeader = false,
	productivityDataPromise,
	taskPerformanceDataPromise,
	stationEfficiencyDataPromise,
	overtimeDataPromise,
	summaryStatsPromise,
}: ReportsProps) {
	const reportTypeValues = ["productivity", "tasks", "stations", "overtime", "summary"] as const;
	type ReportType = (typeof reportTypeValues)[number];

	const reportTypes = [
		{ value: "productivity", label: "Productivity", icon: LiaChartBarSolid },
		{ value: "tasks", label: "Task Performance", icon: LiaClipboardListSolid },
		{ value: "stations", label: "Station Efficiency", icon: LiaIndustrySolid },
		{ value: "overtime", label: "Overtime Analysis", icon: LiaClockSolid },
		{ value: "summary", label: "Executive Summary", icon: LiaFileAltSolid },
	] as const;

	const [reportType, setReportType] = useQueryState(
		"tab",
		parseAsStringEnum([...reportTypeValues]).withDefault("productivity")
	);

	const [startDate, setStartDate] = useQueryState(
		"startDate",
		parseAsString.withDefault(initialStartDate)
	);
	const [endDate, setEndDate] = useQueryState("endDate", parseAsString.withDefault(initialEndDate));
	const navigate = useNavigate();
	const [isNavigating, startNavigation] = useTransition();
	const [isExporting, setIsExporting] = useState(false);
	const loading = isNavigating || isExporting;

	const handleRefresh = async () => {
		const params = new URLSearchParams({
			startDate,
			endDate,
			tab: reportType,
		});

		startNavigation(() => {
			navigate(`/manager/reports?${params.toString()}`);
		});
	};

	const shouldUseDeferredData = !initialData;
	const resolvedInitialData: ReportDataType = initialData ?? {
		productivityData: [],
		taskPerformanceData: [],
		stationEfficiencyData: [],
		overtimeData: [],
		summaryStats: {
			totalEmployees: 0,
			activeEmployees: 0,
			totalHoursWorked: 0,
			averageHoursPerEmployee: 0,
			totalOvertimeHours: 0,
			peakDayOccupancy: 0,
		},
	};

	const handleExport = async () => {
		setIsExporting(true);
		try {
			const formData = new FormData();
			formData.set("startDate", startDate);
			formData.set("endDate", endDate);
			formData.set("type", reportType);

			const response = await fetch("/manager/reports", {
				method: "POST",
				body: formData,
			});

			if (!response.ok) {
				throw new Error(`Export failed with status ${response.status}`);
			}

			const blob = await response.blob();
			const url = window.URL.createObjectURL(blob);
			const contentDisposition = response.headers.get("Content-Disposition");
			const filenameMatch = contentDisposition?.match(/filename="([^"]+)"/);
			const filename = filenameMatch?.[1] ?? `${reportType}-report-${startDate}-${endDate}.csv`;

			const anchor = document.createElement("a");
			anchor.style.display = "none";
			anchor.href = url;
			anchor.download = filename;
			document.body.appendChild(anchor);
			anchor.click();
			window.URL.revokeObjectURL(url);
			anchor.remove();
		} catch (error) {
			console.error("Export failed:", error);
		} finally {
			setIsExporting(false);
		}
	};

	const renderSummaryReport = (reportData: ReportDataType) => {
		const data = reportData;
		const activeRatio =
			data.summaryStats.totalEmployees > 0
				? data.summaryStats.activeEmployees / data.summaryStats.totalEmployees
				: null;
		const overtimeRatio =
			data.summaryStats.totalHoursWorked > 0
				? data.summaryStats.totalOvertimeHours / data.summaryStats.totalHoursWorked
				: null;
		const efficiencyIndex =
			activeRatio === null
				? null
				: Math.max(0, Math.min(100, activeRatio * 100 - (overtimeRatio ?? 0) * 20));

		return (
			<div className="space-y-6">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
					<KpiCard
						label="Workforce Total"
						value={data.summaryStats.totalEmployees}
						subValue={`${data.summaryStats.activeEmployees} Active`}
						icon={LiaChartBarSolid}
					/>
					<KpiCard
						label="Total Hours"
						value={data.summaryStats.totalHoursWorked.toFixed(1)}
						subValue="Cumulative"
						variant="success"
						icon={LiaClockSolid}
					/>
					<KpiCard
						label="Peak Occupancy"
						value={data.summaryStats.peakDayOccupancy}
						subValue="Max Daily"
						icon={LiaIndustrySolid}
					/>
					<KpiCard
						label="Overtime Impact"
						value={data.summaryStats.totalOvertimeHours.toFixed(1)}
						subValue="Total Hours"
						variant={data.summaryStats.totalOvertimeHours > 0 ? "destructive" : "default"}
						icon={LiaClockSolid}
					/>
				</div>

				<Card>
					<CardHeader>
						<CardTitle className="uppercase tracking-wider">System Overview</CardTitle>
					</CardHeader>
					<CardBody>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
							<div className="space-y-6">
								<h3 className="font-heading font-bold uppercase text-muted-foreground text-xs tracking-wider">
									Performance Metrics
								</h3>
								<div className="space-y-4">
									<div className="flex justify-between items-center p-3 bg-muted/20 border border-border/50 rounded-xs">
										<span className="text-sm">Avg Hours / Employee</span>
										<span className="font-data font-bold text-lg">
											{data.summaryStats.averageHoursPerEmployee.toFixed(1)}h
										</span>
									</div>
									<div className="flex justify-between items-center p-3 bg-muted/20 border border-border/50 rounded-xs">
										<span className="text-sm">Active Ratio</span>
										<span className="font-data font-bold text-lg">
											{data.summaryStats.totalEmployees > 0
												? `${Math.round((data.summaryStats.activeEmployees / data.summaryStats.totalEmployees) * 100)}%`
												: "0%"}
										</span>
									</div>
								</div>
							</div>

							<div className="flex items-center justify-center border border-dashed border-border rounded-xs bg-muted/5 min-h-50">
								<div className="text-center space-y-2">
									<p className="font-heading uppercase text-xs text-muted-foreground tracking-widest">
										Coverage Index
									</p>
									{efficiencyIndex === null ? (
										<>
											<p className="font-data text-2xl font-bold text-muted-foreground">
												Unavailable
											</p>
											<p className="text-xs text-muted-foreground">
												No workforce activity in selected range
											</p>
										</>
									) : (
										<>
											<p className="font-data text-4xl font-bold text-primary">
												{efficiencyIndex.toFixed(1)}
											</p>
											<p className="text-xs text-muted-foreground">
												Derived from active ratio and overtime share
											</p>
										</>
									)}
								</div>
							</div>
						</div>
					</CardBody>
				</Card>
			</div>
		);
	};

	const renderProductivityReport = (reportData: ReportDataType) => {
		const data = reportData;

		// Aggregate daily efficiency index for trend chart
		const dailyMap = new Map<string, { totalEfficiency: number; count: number }>();
		data.productivityData.forEach((item) => {
			const current = dailyMap.get(item.date) || { totalEfficiency: 0, count: 0 };
			const efficiencyIndex = item.efficiency ?? 0;

			dailyMap.set(item.date, {
				totalEfficiency: current.totalEfficiency + efficiencyIndex,
				count: current.count + 1,
			});
		});

		const trendData: TrendDataPoint[] = Array.from(dailyMap.entries())
			.map(([date, stats]) => ({
				date,
				value: stats.count > 0 ? (stats.totalEfficiency / stats.count) * 100 : 0,
			}))
			.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

		return (
			<div className="space-y-6">
				{trendData.length > 0 && (
					<Card>
						<CardHeader>
							<CardTitle className="uppercase tracking-wider">Productivity Trend</CardTitle>
						</CardHeader>
						<CardBody>
							<ProductivityTrendChart
								data={trendData}
								thresholdMedium={8} // Example threshold
								thresholdHigh={12} // Example threshold
							/>
						</CardBody>
					</Card>
				)}

				<Card>
					<CardHeader>
						<div className="flex justify-between items-center">
							<CardTitle className="uppercase tracking-wider">Employee Productivity</CardTitle>
							<span className="text-xs text-muted-foreground font-mono">
								{data.productivityData.length} RECORDS
							</span>
						</div>
					</CardHeader>
					<CardBody className="p-0">
						<div className="overflow-x-auto">
							<table className="w-full text-sm">
								<thead>
									<tr className="bg-muted/50 border-b border-border">
										<th className="text-left p-4 font-heading uppercase text-xs tracking-wider text-muted-foreground font-medium">
											Date
										</th>
										<th className="text-left p-4 font-heading uppercase text-xs tracking-wider text-muted-foreground font-medium">
											Employee
										</th>
										<th className="text-left p-4 font-heading uppercase text-xs tracking-wider text-muted-foreground font-medium">
											Station
										</th>
										<th className="text-right p-4 font-heading uppercase text-xs tracking-wider text-muted-foreground font-medium">
											Hours
										</th>
										<th className="text-right p-4 font-heading uppercase text-xs tracking-wider text-muted-foreground font-medium">
											Units
										</th>
										<th className="text-right p-4 font-heading uppercase text-xs tracking-wider text-muted-foreground font-medium">
											Efficiency Index
										</th>
										<th className="text-right p-4 font-heading uppercase text-xs tracking-wider text-muted-foreground font-medium">
											Overtime
										</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-border/50">
									{data.productivityData.map((row, index) => (
										<tr key={index} className="hover:bg-muted/30 transition-colors">
											<td className="p-4 font-data text-xs">{row.date}</td>
											<td className="p-4 font-medium">{row.employeeName}</td>
											<td className="p-4 text-xs text-muted-foreground">
												{row.stationName || "—"}
											</td>
											<td className="p-4 font-data text-right">{row.hoursWorked.toFixed(2)}</td>
											<td className="p-4 font-data text-right">{row.unitsProcessed || "—"}</td>
											<td className="p-4 font-data text-right">
												{row.efficiency ? (
													<span
														className={cn(row.efficiency >= 1.0 ? "text-success" : "text-warning")}
													>
														{(row.efficiency * 100).toFixed(1)}%
													</span>
												) : (
													"—"
												)}
											</td>
											<td className="p-4 font-data text-right">
												{row.overtimeHours ? (
													<span className="text-destructive font-bold">
														{row.overtimeHours.toFixed(2)}
													</span>
												) : (
													"—"
												)}
											</td>
										</tr>
									))}
									{data.productivityData.length === 0 && (
										<tr>
											<td
												colSpan={7}
												className="p-12 text-center text-muted-foreground font-heading text-sm"
											>
												No data found for the selected period.
											</td>
										</tr>
									)}
								</tbody>
							</table>
						</div>
					</CardBody>
				</Card>
			</div>
		);
	};

	const renderTaskReport = (reportData: ReportDataType) => {
		const data = reportData;

		return (
			<div className="space-y-6">
				<Card>
					<CardHeader>
						<div className="flex justify-between items-center">
							<CardTitle className="uppercase tracking-wider">Task Performance</CardTitle>
							<span className="text-xs text-muted-foreground font-mono">
								{data.taskPerformanceData.length} RECORDS
							</span>
						</div>
					</CardHeader>
					<CardBody className="p-0">
						<div className="overflow-x-auto">
							<table className="w-full text-sm">
								<thead>
									<tr className="bg-muted/50 border-b border-border">
										<th className="text-left p-4 font-heading uppercase text-xs tracking-wider text-muted-foreground font-medium">
											Date
										</th>
										<th className="text-left p-4 font-heading uppercase text-xs tracking-wider text-muted-foreground font-medium">
											Task Type
										</th>
										<th className="text-right p-4 font-heading uppercase text-xs tracking-wider text-muted-foreground font-medium">
											Count
										</th>
										<th className="text-right p-4 font-heading uppercase text-xs tracking-wider text-muted-foreground font-medium">
											Units
										</th>
										<th className="text-right p-4 font-heading uppercase text-xs tracking-wider text-muted-foreground font-medium">
											Avg/Task
										</th>
										<th className="text-right p-4 font-heading uppercase text-xs tracking-wider text-muted-foreground font-medium">
											Total Hours
										</th>
										<th className="text-right p-4 font-heading uppercase text-xs tracking-wider text-muted-foreground font-medium">
											Hrs/Unit
										</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-border/50">
									{data.taskPerformanceData.map((row, index) => (
										<tr key={index} className="hover:bg-muted/30 transition-colors">
											<td className="p-4 font-data text-xs">{row.date}</td>
											<td className="p-4 font-medium">{row.taskTypeName}</td>
											<td className="p-4 font-data text-right">{row.taskCount}</td>
											<td className="p-4 font-data text-right">{row.totalUnits}</td>
											<td className="p-4 font-data text-right">
												{row.averageUnitsPerTask.toFixed(2)}
											</td>
											<td className="p-4 font-data text-right">{row.totalHours.toFixed(2)}</td>
											<td className="p-4 font-data text-right text-muted-foreground">
												{row.hoursPerUnit.toFixed(3)}
											</td>
										</tr>
									))}
									{data.taskPerformanceData.length === 0 && (
										<tr>
											<td
												colSpan={7}
												className="p-12 text-center text-muted-foreground font-heading text-sm"
											>
												No task data found.
											</td>
										</tr>
									)}
								</tbody>
							</table>
						</div>
					</CardBody>
				</Card>
			</div>
		);
	};

	const renderStationReport = (reportData: ReportDataType) => {
		const data = reportData;

		const stationChartData: StationBarData[] = data.stationEfficiencyData.slice(0, 8).map((s) => ({
			name: s.stationName,
			productivity: s.averageEfficiency ? s.averageEfficiency * 100 : 0,
			occupancy: s.peakOccupancy ? Math.min(100, (s.peakOccupancy / 10) * 100) : 0, // Rough estimate if capacity unknown, or just use raw if chart supports it.
			// Actually StationPerformanceChart expects occupancy to be 0-100.
			// Let's assume peakOccupancy is raw count. Without capacity, we can't calculate %.
			// But we can map it for visualization. Let's just use 0 for now or try to infer.
		}));

		return (
			<div className="space-y-6">
				{stationChartData.length > 0 && (
					<Card>
						<CardHeader>
							<CardTitle className="uppercase tracking-wider">
								Station Performance Overview
							</CardTitle>
						</CardHeader>
						<CardBody>
							<StationPerformanceChart data={stationChartData} />
						</CardBody>
					</Card>
				)}

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{data.stationEfficiencyData.map((station, index) => (
						<Card key={index} className="group hover:border-primary/50 transition-colors">
							<CardHeader className="pb-2 border-b border-border/50">
								<CardTitle className="uppercase tracking-tight text-sm flex justify-between">
									{station.stationName}
									<Badge variant="outline" className="font-mono text-[10px]">
										#{index + 1}
									</Badge>
								</CardTitle>
							</CardHeader>
							<CardBody className="space-y-4 pt-4">
								<div className="grid grid-cols-2 gap-4">
									<div>
										<p className="text-[10px] text-muted-foreground uppercase font-heading tracking-wider mb-1">
											Total Hours
										</p>
										<p className="font-data font-bold text-lg">{station.totalHours.toFixed(1)}h</p>
									</div>
									<div>
										<p className="text-[10px] text-muted-foreground uppercase font-heading tracking-wider mb-1">
											Peak Occupancy
										</p>
										<p className="font-data font-bold text-lg">{station.peakOccupancy}</p>
									</div>
								</div>

								{station.averageEfficiency !== null && (
									<div className="space-y-2 pt-2 border-t border-border/30">
										<div className="flex justify-between text-xs">
											<span className="text-muted-foreground uppercase font-heading tracking-wider">
												Efficiency
											</span>
											<span className="font-data font-bold">
												{(station.averageEfficiency * 100).toFixed(1)}%
											</span>
										</div>
										<div className="h-1.5 w-full bg-muted overflow-hidden rounded-[1px]">
											<div
												className={cn(
													"h-full transition-all duration-500",
													station.averageEfficiency >= 0.9
														? "bg-success"
														: station.averageEfficiency >= 0.7
															? "bg-primary"
															: "bg-warning"
												)}
												style={{ width: `${Math.min(station.averageEfficiency * 100, 100)}%` }}
											/>
										</div>
									</div>
								)}
							</CardBody>
						</Card>
					))}
					{data.stationEfficiencyData.length === 0 && (
						<div className="col-span-full p-12 border border-dashed border-border rounded-xs text-center">
							<p className="font-heading uppercase tracking-widest text-muted-foreground text-sm">
								No Station Data Available
							</p>
						</div>
					)}
				</div>
			</div>
		);
	};

	const renderOvertimeReport = (reportData: ReportDataType) => {
		const data = reportData;

		return (
			<div className="space-y-6">
				{data.summaryStats.totalOvertimeHours > 0 && (
					<Alert variant="error" className="flex items-center space-x-4">
						<div className="p-2 bg-destructive/10 rounded-full text-destructive">
							<LiaClockSolid className="w-5 h-5" />
						</div>
						<div>
							<p className="font-heading uppercase text-xs tracking-wider font-bold">
								Overtime Alert
							</p>
							<p className="text-sm">
								Total accumulated overtime:{" "}
								<span className="font-data font-bold">
									{data.summaryStats.totalOvertimeHours.toFixed(1)}h
								</span>
							</p>
						</div>
					</Alert>
				)}

				<Card>
					<CardHeader>
						<CardTitle className="uppercase tracking-wider">Overtime Records</CardTitle>
					</CardHeader>
					<CardBody className="p-0">
						<div className="overflow-x-auto">
							<table className="w-full text-sm">
								<thead>
									<tr className="bg-muted/50 border-b border-border">
										<th className="text-left p-4 font-heading uppercase text-xs tracking-wider text-muted-foreground font-medium">
											Date
										</th>
										<th className="text-left p-4 font-heading uppercase text-xs tracking-wider text-muted-foreground font-medium">
											Employee
										</th>
										<th className="text-left p-4 font-heading uppercase text-xs tracking-wider text-muted-foreground font-medium">
											Station
										</th>
										<th className="text-right p-4 font-heading uppercase text-xs tracking-wider text-muted-foreground font-medium">
											Reg. Hours
										</th>
										<th className="text-right p-4 font-heading uppercase text-xs tracking-wider text-muted-foreground font-medium">
											O.T. Hours
										</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-border/50">
									{data.overtimeData.map((row, index) => (
										<tr key={index} className="hover:bg-muted/30 transition-colors">
											<td className="p-4 font-data text-xs">{row.date}</td>
											<td className="p-4 font-medium">{row.employeeName}</td>
											<td className="p-4 text-xs text-muted-foreground">
												{row.stationName || "—"}
											</td>
											<td className="p-4 font-data text-right">
												{row.regularHoursWorked.toFixed(2)}
											</td>
											<td className="p-4 font-data text-right text-destructive font-bold">
												{row.overtimeHoursWorked.toFixed(2)}
											</td>
										</tr>
									))}
									{data.overtimeData.length === 0 && (
										<tr>
											<td
												colSpan={5}
												className="p-12 text-center text-muted-foreground font-heading text-sm"
											>
												No overtime recorded for this period.
											</td>
										</tr>
									)}
								</tbody>
							</table>
						</div>
					</CardBody>
				</Card>
			</div>
		);
	};

	return (
		<div className="space-y-6 pb-12">
			{!hideHeader && (
				<PageHeader
					title="Reports & Analytics"
					subtitle="Operational intelligence and workforce metrics"
					actions={
						<div className="flex items-center gap-2">
							<Button
								onClick={handleRefresh}
								variant="outline"
								disabled={loading}
								className="gap-2"
							>
								<LiaSyncSolid className={cn(loading && "animate-spin")} />
								{loading ? "Syncing..." : "Refresh"}
							</Button>
							<Button onClick={handleExport} variant="outline" disabled={loading} className="gap-2">
								<LiaDownloadSolid />
								Export CSV
							</Button>
						</div>
					}
				/>
			)}

			{/* Filter & Controls Card */}
			<div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
				{/* Report Type Selector */}
				<Tabs
					selectedKey={reportType}
					onSelectionChange={(k) => void setReportType(k.toString() as ReportType)}
				>
					<TabList
						className={cn(
							"inline-flex w-auto justify-start gap-1 rounded-xs p-0.5 bg-card border border-border/40",
							"flex-wrap" // Handle wrapping if needed for small screens
						)}
					>
						{reportTypes.map((type) => (
							<Tab
								id={type.value}
								key={type.value}
								className={({ isSelected }) =>
									cn(
										"h-7 px-3 text-xs uppercase tracking-widest font-bold transition-all rounded-xs flex items-center justify-center gap-2 outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-pointer",
										isSelected
											? "bg-primary text-primary-foreground shadow-sm"
											: "text-muted-foreground hover:text-foreground hover:bg-muted/50"
									)
								}
							>
								{type.icon && <type.icon className="w-3.5 h-3.5" />}
								{type.label}
							</Tab>
						))}
					</TabList>
				</Tabs>

				{/* Date Range Picker */}
				<div className="flex items-center gap-3 bg-muted/30 p-2 rounded-xs border border-border/50">
					<LiaCalendarAltSolid className="text-muted-foreground ml-2" />
					<div className="flex items-center gap-2">
						<SimpleInput
							name="startDate"
							type="date"
							value={startDate}
							onChange={(e) => void setStartDate(e.target.value)}
							className="h-8 w-auto text-xs font-mono border-0 bg-transparent focus:ring-0 px-1 shadow-none"
						/>
						<span className="text-muted-foreground text-xs">—</span>
						<SimpleInput
							name="endDate"
							type="date"
							value={endDate}
							onChange={(e) => void setEndDate(e.target.value)}
							className="h-8 w-auto text-xs font-mono border-0 bg-transparent focus:ring-0 px-1 shadow-none"
						/>
					</div>
				</div>
			</div>

			{/* Main Content Area */}
			<div
				className={cn(
					"transition-opacity duration-200",
					loading ? "opacity-60 pointer-events-none" : "opacity-100"
				)}
			>
				{shouldUseDeferredData ? (
					<Suspense fallback={<ReportSectionFallback />}>
						<DeferredReportsSection
							reportType={reportType}
							productivityDataPromise={productivityDataPromise}
							taskPerformanceDataPromise={taskPerformanceDataPromise}
							stationEfficiencyDataPromise={stationEfficiencyDataPromise}
							overtimeDataPromise={overtimeDataPromise}
							summaryStatsPromise={summaryStatsPromise}
							renderSummaryReport={renderSummaryReport}
							renderProductivityReport={renderProductivityReport}
							renderTaskReport={renderTaskReport}
							renderStationReport={renderStationReport}
							renderOvertimeReport={renderOvertimeReport}
						/>
					</Suspense>
				) : (
					<>
						{reportType === "summary" && renderSummaryReport(resolvedInitialData)}
						{reportType === "productivity" && renderProductivityReport(resolvedInitialData)}
						{reportType === "tasks" && renderTaskReport(resolvedInitialData)}
						{reportType === "stations" && renderStationReport(resolvedInitialData)}
						{reportType === "overtime" && renderOvertimeReport(resolvedInitialData)}
					</>
				)}
			</div>
		</div>
	);
}

function DeferredReportsSection({
	reportType,
	productivityDataPromise,
	taskPerformanceDataPromise,
	stationEfficiencyDataPromise,
	overtimeDataPromise,
	summaryStatsPromise,
	renderSummaryReport,
	renderProductivityReport,
	renderTaskReport,
	renderStationReport,
	renderOvertimeReport,
}: {
	reportType: "productivity" | "tasks" | "stations" | "overtime" | "summary";
	productivityDataPromise?: Promise<ProductivityData[]>;
	taskPerformanceDataPromise?: Promise<TaskPerformanceData[]>;
	stationEfficiencyDataPromise?: Promise<StationEfficiencyData[]>;
	overtimeDataPromise?: Promise<OvertimeData[]>;
	summaryStatsPromise?: Promise<SummaryStats>;
	renderSummaryReport: (data: ReportDataType) => ReactNode;
	renderProductivityReport: (data: ReportDataType) => ReactNode;
	renderTaskReport: (data: ReportDataType) => ReactNode;
	renderStationReport: (data: ReportDataType) => ReactNode;
	renderOvertimeReport: (data: ReportDataType) => ReactNode;
}) {
	const reportData = {
		productivityData: productivityDataPromise ? use(productivityDataPromise) : [],
		taskPerformanceData: taskPerformanceDataPromise ? use(taskPerformanceDataPromise) : [],
		stationEfficiencyData: stationEfficiencyDataPromise ? use(stationEfficiencyDataPromise) : [],
		overtimeData: overtimeDataPromise ? use(overtimeDataPromise) : [],
		summaryStats: summaryStatsPromise
			? use(summaryStatsPromise)
			: {
					totalEmployees: 0,
					activeEmployees: 0,
					totalHoursWorked: 0,
					averageHoursPerEmployee: 0,
					totalOvertimeHours: 0,
					peakDayOccupancy: 0,
				},
	};

	if (reportType === "summary") return renderSummaryReport(reportData);
	if (reportType === "productivity") return renderProductivityReport(reportData);
	if (reportType === "tasks") return renderTaskReport(reportData);
	if (reportType === "stations") return renderStationReport(reportData);
	return renderOvertimeReport(reportData);
}

function ReportSectionFallback() {
	return (
		<div className="rounded-xs border border-border bg-card/60 p-6">
			<div className="flex items-center gap-3 text-xs font-industrial uppercase tracking-widest text-muted-foreground">
				<LiaSyncSolid className="h-4 w-4 animate-spin" />
				Loading report module
			</div>
			<div className="mt-4 h-64 rounded-xs border border-border bg-muted/20 animate-pulse" />
		</div>
	);
}
