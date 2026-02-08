"use client";

import { useState, type ChangeEvent } from "react";
import { Button, Input, Card, CardHeader, CardTitle, CardBody, Badge } from "@monorepo/design-system";
import { PageHeader } from "~/components/page-header";
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
	summaryStats: {
		totalEmployees: number;
		activeEmployees: number;
		totalHoursWorked: number;
		averageHoursPerEmployee: number;
		totalOvertimeHours: number;
		peakDayOccupancy: number;
	};
}

interface ReportsProps {
	initialData: ReportDataType;
}

export function ReportsManager({ initialData }: ReportsProps) {
	const [reportType, setReportType] = useState("productivity");
	const [dateRange, setDateRange] = useState({
		startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
		endDate: new Date().toISOString().split("T")[0],
	});
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState(initialData);

	const reportTypes = [
		{ value: "productivity", label: "Employee Productivity" },
		{ value: "tasks", label: "Task Performance" },
		{ value: "stations", label: "Station Efficiency" },
		{ value: "overtime", label: "Overtime Analysis" },
		{ value: "summary", label: "Executive Summary" },
	];

	const handleRefresh = async () => {
		setLoading(true);
		try {
			// Fetch fresh data based on date range and report type
			const params = new URLSearchParams({
				startDate: dateRange.startDate,
				endDate: dateRange.endDate,
				type: reportType,
			});

			const response = await fetch(`/manager/reports/data?${params.toString()}`);
			const freshData = (await response.json()) as ReportDataType;
			setData(freshData);
		} catch (error) {
			console.error("Failed to refresh reports:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleExport = async (format: "csv" | "excel") => {
		setLoading(true);
		try {
			const params = new URLSearchParams({
				startDate: dateRange.startDate,
				endDate: dateRange.endDate,
				type: reportType,
				format,
			});

			const response = await fetch(`/manager/reports/export?${params.toString()}`);

			if (response.ok) {
				// Download the file
				const blob = await response.blob();
				const url = window.URL.createObjectURL(blob);
				const a = document.createElement("a");
				a.style.display = "none";
				a.href = url;
				a.download = `${reportType}-report-${dateRange.startDate}-${dateRange.endDate}.${format}`;
				document.body.appendChild(a);
				a.click();
				window.URL.revokeObjectURL(url);
			}
		} catch (error) {
			console.error("Export failed:", error);
		} finally {
			setLoading(false);
		}
	};

	const renderProductivityReport = () => (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>Employee Productivity Report</CardTitle>
				</CardHeader>
				<CardBody>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
						<div className="text-center">
							<p className="text-sm text-muted-foreground">Total Hours</p>
							<p className="text-2xl font-bold">{data.summaryStats.totalHoursWorked.toFixed(1)}h</p>
						</div>
						<div className="text-center">
							<p className="text-sm text-muted-foreground">Average Hours/Employee</p>
							<p className="text-2xl font-bold">
								{data.summaryStats.averageHoursPerEmployee.toFixed(1)}h
							</p>
						</div>
						<div className="text-center">
							<p className="text-sm text-muted-foreground">Active Employees</p>
							<p className="text-2xl font-bold">{data.summaryStats.activeEmployees}</p>
						</div>
					</div>

					<div className="overflow-x-auto">
						<table className="w-full">
							<thead>
								<tr className="border-b border-border">
									<th className="text-left p-4">Date</th>
									<th className="text-left p-4">Employee</th>
									<th className="text-left p-4">Station</th>
									<th className="text-left p-4">Hours Worked</th>
									<th className="text-left p-4">Units Processed</th>
									<th className="text-left p-4">Efficiency</th>
									<th className="text-left p-4">Overtime</th>
								</tr>
							</thead>
							<tbody>
								{data.productivityData.map((row, index) => (
									<tr key={index} className="border-b border-border hover:bg-muted/50">
										<td className="p-4">{row.date}</td>
										<td className="p-4 font-medium">{row.employeeName}</td>
										<td className="p-4">{row.stationName || "-"}</td>
										<td className="p-4">{row.hoursWorked.toFixed(2)}h</td>
										<td className="p-4">{row.unitsProcessed || "-"}</td>
										<td className="p-4">
											{row.efficiency ? `${(row.efficiency * 100).toFixed(1)}%` : "-"}
										</td>
										<td className="p-4">
											{row.overtimeHours ? `${row.overtimeHours.toFixed(2)}h` : "-"}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>

					{data.productivityData.length === 0 && (
						<div className="text-center py-6">
							<p className="text-muted-foreground">
								No productivity data found for selected period
							</p>
						</div>
					)}
				</CardBody>
			</Card>
		</div>
	);

	const renderTaskReport = () => (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>Task Performance Report</CardTitle>
				</CardHeader>
				<CardBody>
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead>
								<tr className="border-b border-border">
									<th className="text-left p-4">Date</th>
									<th className="text-left p-4">Task Type</th>
									<th className="text-left p-4">Tasks Completed</th>
									<th className="text-left p-4">Total Units</th>
									<th className="text-left p-4">Avg Units/Task</th>
									<th className="text-left p-4">Total Hours</th>
									<th className="text-left p-4">Hours/Unit</th>
								</tr>
							</thead>
							<tbody>
								{data.taskPerformanceData.map((row, index) => (
									<tr key={index} className="border-b border-border hover:bg-muted/50">
										<td className="p-4">{row.date}</td>
										<td className="p-4 font-medium">{row.taskTypeName}</td>
										<td className="p-4 text-center">{row.taskCount}</td>
										<td className="p-4 text-center">{row.totalUnits}</td>
										<td className="p-4 text-center">{row.averageUnitsPerTask.toFixed(2)}</td>
										<td className="p-4 text-center">{row.totalHours.toFixed(2)}h</td>
										<td className="p-4 text-center">{row.hoursPerUnit.toFixed(3)}h</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</CardBody>
			</Card>
		</div>
	);

	const renderStationReport = () => (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>Station Efficiency Report</CardTitle>
				</CardHeader>
				<CardBody>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{data.stationEfficiencyData.map((station, index) => (
							<div key={index} className="border border-border/50 rounded-[2px] p-4 bg-card/50">
								<h3 className="font-bold font-heading text-sm uppercase tracking-tight mb-3">{station.stationName}</h3>
								<div className="space-y-2 text-sm">
									<div className="flex justify-between items-baseline">
										<span className="text-xs text-muted-foreground font-mono uppercase tracking-tighter">Total Hours:</span>
										<span className="font-bold font-data">{station.totalHours.toFixed(1)}h</span>
									</div>
									<div className="flex justify-between items-baseline">
										<span className="text-xs text-muted-foreground font-mono uppercase tracking-tighter">Employees:</span>
										<span className="font-bold font-data">{station.totalEmployees}</span>
									</div>
									<div className="flex justify-between items-baseline">
										<span className="text-xs text-muted-foreground font-mono uppercase tracking-tighter">Peak Occupancy:</span>
										<span className="font-bold font-data">{station.peakOccupancy}</span>
									</div>
									{station.averageEfficiency && (
										<div className="flex justify-between items-center pt-2 mt-2 border-t border-border/30">
											<span className="text-xs text-muted-foreground font-mono uppercase tracking-tighter">Avg Efficiency:</span>
											<Badge variant={station.averageEfficiency > 0.8 ? "success" : "primary"}>
												{(station.averageEfficiency * 100).toFixed(1)}%
											</Badge>
										</div>
									)}
								</div>
							</div>
						))}
					</div>
				</CardBody>
			</Card>
		</div>
	);

	const renderOvertimeReport = () => (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>Overtime Analysis</CardTitle>
				</CardHeader>
				<CardBody>
					<div className="text-center mb-6">
						<p className="text-lg font-semibold">
							Total Overtime: {data.summaryStats.totalOvertimeHours.toFixed(1)} hours
						</p>
					</div>

					<div className="overflow-x-auto">
						<table className="w-full">
							<thead>
								<tr className="border-b border-border">
									<th className="text-left p-4">Date</th>
									<th className="text-left p-4">Employee</th>
									<th className="text-left p-4">Regular Hours</th>
									<th className="text-left p-4">Overtime Hours</th>
									<th className="text-left p-4">Station</th>
								</tr>
							</thead>
							<tbody>
								{data.overtimeData.map((row, index) => (
									<tr key={index} className="border-b border-border hover:bg-muted/50">
										<td className="p-4">{row.date}</td>
										<td className="p-4 font-medium">{row.employeeName}</td>
										<td className="p-4">{row.regularHoursWorked.toFixed(2)}h</td>
										<td className="p-4 text-orange-600 font-medium">
											{row.overtimeHoursWorked.toFixed(2)}h
										</td>
										<td className="p-4">{row.stationName || "-"}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</CardBody>
			</Card>
		</div>
	);

	const renderSummaryReport = () => (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>Executive Summary</CardTitle>
				</CardHeader>
				<CardBody>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						<div className="text-center">
							<h3 className="text-lg font-medium mb-2">Workforce</h3>
							<div className="space-y-2">
								<p className="text-3xl font-bold text-primary">
									{data.summaryStats.totalEmployees}
								</p>
								<p className="text-sm text-muted-foreground">Total Employees</p>
								<div className="pt-2 border-t border-border">
									<p className="text-xl font-semibold text-green-600">
										{data.summaryStats.activeEmployees}
									</p>
									<p className="text-sm text-muted-foreground">Active This Period</p>
								</div>
							</div>
						</div>

						<div className="text-center">
							<h3 className="text-lg font-medium mb-2">Hours Worked</h3>
							<div className="space-y-2">
								<p className="text-3xl font-bold text-primary">
									{data.summaryStats.totalHoursWorked.toFixed(1)}h
								</p>
								<p className="text-sm text-muted-foreground">Total Hours</p>
								<div className="pt-2 border-t border-border">
									<p className="text-xl font-semibold text-foreground">
										{data.summaryStats.averageHoursPerEmployee.toFixed(1)}h
									</p>
									<p className="text-sm text-muted-foreground">Avg per Employee</p>
								</div>
							</div>
						</div>

						<div className="text-center">
							<h3 className="text-lg font-medium mb-2">Peak Activity</h3>
							<div className="space-y-2">
								<p className="text-3xl font-bold text-orange-600">
									{data.summaryStats.peakDayOccupancy}
								</p>
								<p className="text-sm text-muted-foreground">Peak Daily Count</p>
								<div className="pt-2 border-t border-border">
									<p className="text-xl font-semibold text-red-600">
										{data.summaryStats.totalOvertimeHours.toFixed(1)}h
									</p>
									<p className="text-sm text-muted-foreground">Total Overtime</p>
								</div>
							</div>
						</div>
					</div>
				</CardBody>
			</Card>
		</div>
	);

	return (
		<div className="space-y-6">
			<PageHeader
				title="Reports & Analytics"
				subtitle="Comprehensive workforce and productivity insights"
			/>

			{/* Header and Controls */}
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">

				<div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
					<div className="flex space-x-2">
						<Input
							name="startDate"
							label="Start Date"
							type="date"
							value={dateRange.startDate}
							onChange={(event: ChangeEvent<HTMLInputElement>) =>
								setDateRange((prev) => ({ ...prev, startDate: event.target.value }))
							}
							className="max-w-[150px]"
						/>
						<Input
							name="endDate"
							label="End Date"
							type="date"
							value={dateRange.endDate}
							onChange={(event: ChangeEvent<HTMLInputElement>) =>
								setDateRange((prev) => ({ ...prev, endDate: event.target.value }))
							}
							className="max-w-[150px]"
						/>
					</div>

					<div className="flex space-x-2">
						<Button onClick={handleRefresh} variant="outline" disabled={loading}>
							Refresh
						</Button>
						<Button onClick={() => handleExport("csv")} variant="outline" disabled={loading}>
							Export CSV
						</Button>
						<Button onClick={() => handleExport("excel")} variant="outline" disabled={loading}>
							Export Excel
						</Button>
					</div>
				</div>
			</div>

			{/* Report Type Selector */}
			<Card>
				<CardBody>
					<div className="flex flex-wrap gap-2">
						{reportTypes.map((type) => (
							<Button
								key={type.value}
								onClick={() => setReportType(type.value)}
								variant={reportType === type.value ? "primary" : "outline"}
								size="sm"
							>
								{type.label}
							</Button>
						))}
					</div>
				</CardBody>
			</Card>

			{/* Report Content */}
			{reportType === "productivity" && renderProductivityReport()}
			{reportType === "tasks" && renderTaskReport()}
			{reportType === "stations" && renderStationReport()}
			{reportType === "overtime" && renderOvertimeReport()}
			{reportType === "summary" && renderSummaryReport()}

			{loading && (
				<div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50" aria-live="polite">
					<Card className="max-w-xs w-full shadow-industrial animate-pulse">
						<CardBody className="py-6 text-center">
							<p className="font-industrial font-bold uppercase tracking-widest">Processing_Data…</p>
						</CardBody>
					</Card>
				</div>
			)}
		</div>
	);
}
