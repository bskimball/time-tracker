"use client";

import { Link } from "react-router";
import { Card, CardHeader, CardTitle, CardBody, Alert } from "@monorepo/design-system";
import { Button } from "@monorepo/design-system";
import { IndustrialPanel, LedIndicator } from "@monorepo/design-system";
import { PageHeader } from "~/components/page-header";
import {
	LiaUserClockSolid,
	LiaExclamationTriangleSolid,
	LiaStopwatchSolid,
	LiaChartPieSolid,
	LiaArrowRightSolid,
	LiaUserPlusSolid,
	LiaHistorySolid,
	LiaTasksSolid,
	LiaFileAltSolid,
} from "react-icons/lia";
import type { TimeLog, Employee, Station, User } from "@prisma/client";
import { cn } from "~/lib/cn";

type TimeLogWithEmployee = TimeLog & {
	employee: Employee;
	station: Station | null;
};

type AlertData = {
	id: string;
	type: "OVERTIME" | "MISSING_PUNCH" | "PERFORMANCE" | "SYSTEM" | "COMPLIANCE";
	severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
	title: string;
	description: string;
	employeeId?: string;
	employeeName?: string;
	stationName?: string;
	createdAt: Date;
	requiresAction: boolean;
	actionUrl?: string;
};

type ActiveTaskByEmployee = Record<
	string,
	{
		assignmentId: string;
		employeeName: string;
		taskTypeName: string;
		stationName: string | null;
		startTime: Date;
	}
>;

export function ManagerDashboard({
	activeTimeLogs,
	activeTasksByEmployee,
	totalEmployees,
	alerts = [],
	user,
}: {
	activeTimeLogs: TimeLogWithEmployee[];
	activeTasksByEmployee: ActiveTaskByEmployee;
	totalEmployees: number;
	alerts?: AlertData[];
	user: User;
}) {
	const formatDuration = (startTime: Date): string => {
		const now = new Date();
		const diff = now.getTime() - new Date(startTime).getTime();
		const hours = Math.floor(diff / (1000 * 60 * 60));
		const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
		return `${hours}h ${minutes}m`;
	};

	const criticalAlerts = alerts.filter(
		(a) => a.severity === "CRITICAL" || a.severity === "HIGH",
	);
	const warningAlerts = alerts.filter((a) => a.severity === "MEDIUM");
	const activeAlertCount = alerts.filter((a) => a.severity !== "LOW").length;
	const assignmentRows = Object.values(activeTasksByEmployee);
	const activeSessionCount = assignmentRows.length > 0 ? assignmentRows.length : activeTimeLogs.length;
	const longestSessionStart =
		assignmentRows.length > 0
			? assignmentRows.reduce(
					(earliest, row) =>
						new Date(row.startTime).getTime() < new Date(earliest).getTime()
							? row.startTime
							: earliest,
					assignmentRows[0].startTime,
				)
			: activeTimeLogs.length > 0
				? activeTimeLogs[0].startTime
				: null;

	// Utilization calc (mock logic preserved from original, but structured)
	const utilizationRate = 85;

	return (
		<div className="space-y-8 animate-in fade-in duration-500 motion-reduce:animate-none pb-10">
			<PageHeader
				title="Manager Dashboard"
				subtitle={`Overview for ${user.name || user.email} • ${new Date().toLocaleDateString(undefined, {
					weekday: "long",
					month: "long",
					day: "numeric",
				})}`}
				actions={
					<Link to="/manager/monitor">
						<Button variant="outline" className="gap-2">
							<LiaStopwatchSolid />
							Floor Monitor
						</Button>
					</Link>
				}
			/>

			{/* KPI Control Panel - Industrial Grid Layout */}
			<section aria-label="Key Metrics" className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-border border border-border rounded-[2px] overflow-hidden shadow-industrial">
				<div className="bg-card p-4 md:p-6 flex flex-col justify-between group hover:bg-muted/5 transition-colors">
					<div className="flex items-center gap-2 text-muted-foreground mb-4">
						<LiaUserClockSolid className="w-5 h-5" />
						<span className="text-xs font-heading uppercase tracking-wider font-semibold">Active Staff</span>
					</div>
					<div className="flex items-baseline gap-2">
						<span className="text-3xl font-data font-medium tracking-tight text-foreground group-hover:text-primary transition-colors">
							{activeSessionCount}
						</span>
						<span className="text-sm text-muted-foreground font-data">/ {totalEmployees}</span>
					</div>
				</div>

				<div className="bg-card p-4 md:p-6 flex flex-col justify-between group hover:bg-muted/5 transition-colors">
					<div className="flex items-center gap-2 text-muted-foreground mb-4">
						<LiaExclamationTriangleSolid className="w-5 h-5" />
						<span className="text-xs font-heading uppercase tracking-wider font-semibold">Active Alerts</span>
					</div>
					<div className="flex items-baseline gap-2">
						<span
							className={cn(
								"text-3xl font-data font-medium tracking-tight transition-colors",
								activeAlertCount > 0 ? "text-orange-600" : "text-emerald-600",
							)}
						>
							{activeAlertCount}
						</span>
						<span className="text-sm text-muted-foreground font-data">Requires Action</span>
					</div>
				</div>

				<div className="bg-card p-4 md:p-6 flex flex-col justify-between group hover:bg-muted/5 transition-colors">
					<div className="flex items-center gap-2 text-muted-foreground mb-4">
						<LiaStopwatchSolid className="w-5 h-5" />
						<span className="text-xs font-heading uppercase tracking-wider font-semibold">Longest Shift</span>
					</div>
					<div className="flex items-baseline gap-2">
						<span className="text-3xl font-data font-medium tracking-tight text-foreground group-hover:text-primary transition-colors">
							{longestSessionStart ? formatDuration(longestSessionStart) : "--"}
						</span>
					</div>
				</div>

				<div className="bg-card p-4 md:p-6 flex flex-col justify-between group hover:bg-muted/5 transition-colors">
					<div className="flex items-center gap-2 text-muted-foreground mb-4">
						<LiaChartPieSolid className="w-5 h-5" />
						<span className="text-xs font-heading uppercase tracking-wider font-semibold">Utilization</span>
					</div>
					<div className="flex items-baseline gap-2">
						<span className="text-3xl font-data font-medium tracking-tight text-foreground group-hover:text-primary transition-colors">
							{utilizationRate}%
						</span>
						<span className="text-sm text-muted-foreground font-data">Efficiency</span>
					</div>
				</div>
			</section>

			<div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
				{/* Primary Column: Live Operations */}
				<div className="xl:col-span-2 space-y-6">
					{/* Critical Alerts Banner (Only shows if critical) */}
					{criticalAlerts.length > 0 && (
						<div className="space-y-2">
							{criticalAlerts.map((alert) => (
								<Alert
									key={alert.id}
									variant="error"
									className="border-l-4 border-l-red-600 shadow-sm animate-pulse-slow"
								>
									<div className="flex justify-between items-start gap-4">
										<div>
											<h4 className="font-heading font-bold text-red-900 dark:text-red-100 flex items-center gap-2">
												<LiaExclamationTriangleSolid /> {alert.title}
											</h4>
											<p className="mt-1 text-sm font-medium opacity-90">{alert.description}</p>
										</div>
										{alert.actionUrl && (
											<Link to={alert.actionUrl}>
												<Button size="xs" variant="outline" className="bg-background/50 hover:bg-background border-red-200 text-red-900">
													Resolve
												</Button>
											</Link>
										)}
									</div>
								</Alert>
							))}
						</div>
					)}

					<IndustrialPanel>
						<div className="p-4 border-b border-border flex justify-between items-center bg-muted/20">
							<h3 className="font-heading text-lg font-bold uppercase tracking-wide">
								Active Sessions
							</h3>
							<span className="text-xs font-data text-muted-foreground tabular-nums">
								LIVE UPDATE • {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
							</span>
						</div>
						<div className="divide-y divide-border">
							{assignmentRows.length === 0 ? (
								<div className="p-12 text-center text-muted-foreground">
									<LiaUserClockSolid className="w-12 h-12 mx-auto mb-4 opacity-20" />
									<p className="font-heading">No active task sessions detected.</p>
								</div>
							) : (
								<div className="bg-card">
									<div className="grid grid-cols-12 gap-4 px-4 py-2 border-b border-border bg-muted/30 text-xs font-heading uppercase tracking-wider text-muted-foreground font-semibold">
										<div className="col-span-4">Employee</div>
										<div className="col-span-3">Station</div>
										<div className="col-span-3">Current Task</div>
										<div className="col-span-2 text-right">Task Duration</div>
									</div>
									{assignmentRows.map((assignment) => {
										return (
											<div
												key={assignment.assignmentId}
												className="grid grid-cols-12 gap-4 px-4 py-3 items-center hover:bg-muted/10 transition-colors group"
											>
												<div className="col-span-4 flex items-center gap-3">
													<LedIndicator active={true} className="w-2 h-2" />
													<div>
														<div className="font-medium font-heading text-sm group-hover:text-primary transition-colors">
															{assignment.employeeName}
														</div>
													</div>
												</div>
												<div className="col-span-3 text-sm text-muted-foreground truncate">
													{assignment.stationName || <span className="opacity-50 italic">Unassigned</span>}
												</div>
												<div className="col-span-3 text-sm">
													<span className="inline-flex items-center px-2 py-0.5 rounded-sm bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 text-xs font-medium border border-blue-200 dark:border-blue-900">
														{assignment.taskTypeName}
													</span>
												</div>
												<div className="col-span-2 text-right font-data text-sm tabular-nums">
													{formatDuration(assignment.startTime)}
												</div>
											</div>
										);
									})}
									<div className="p-2 border-t border-border text-center">
										<Link
											to="/manager/monitor"
											className="text-xs font-heading text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
										>
											Open floor monitor <LiaArrowRightSolid />
										</Link>
									</div>
								</div>
							)}
						</div>
					</IndustrialPanel>

					{/* Quick Actions Grid */}
					<div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
						<Link to="/manager/employees/new" className="group flex flex-col items-center justify-center p-6 border border-border bg-card hover:border-primary/50 hover:shadow-industrial rounded-[2px] transition-colors duration-200">
								<div className="p-3 rounded-[2px] bg-muted group-hover:bg-primary/10 text-muted-foreground group-hover:text-primary transition-colors mb-3">
									<LiaUserPlusSolid className="w-6 h-6" />
								</div>
								<span className="text-sm font-heading font-medium">Add Employee</span>
						</Link>
						<Link to="/manager/timesheets" className="group flex flex-col items-center justify-center p-6 border border-border bg-card hover:border-primary/50 hover:shadow-industrial rounded-[2px] transition-colors duration-200">
								<div className="p-3 rounded-[2px] bg-muted group-hover:bg-primary/10 text-muted-foreground group-hover:text-primary transition-colors mb-3">
									<LiaHistorySolid className="w-6 h-6" />
								</div>
								<span className="text-sm font-heading font-medium">Time Correction</span>
						</Link>
						<Link to="/manager/tasks" className="group flex flex-col items-center justify-center p-6 border border-border bg-card hover:border-primary/50 hover:shadow-industrial rounded-[2px] transition-colors duration-200">
								<div className="p-3 rounded-[2px] bg-muted group-hover:bg-primary/10 text-muted-foreground group-hover:text-primary transition-colors mb-3">
									<LiaTasksSolid className="w-6 h-6" />
								</div>
								<span className="text-sm font-heading font-medium">Assign Tasks</span>
						</Link>
						<Link to="/manager/reports" className="group flex flex-col items-center justify-center p-6 border border-border bg-card hover:border-primary/50 hover:shadow-industrial rounded-[2px] transition-colors duration-200">
								<div className="p-3 rounded-[2px] bg-muted group-hover:bg-primary/10 text-muted-foreground group-hover:text-primary transition-colors mb-3">
									<LiaFileAltSolid className="w-6 h-6" />
								</div>
								<span className="text-sm font-heading font-medium">Reports</span>
						</Link>
					</div>
				</div>

				{/* Sidebar Column: Feed & Secondary Metrics */}
				<div className="space-y-6">
					<Card className="border-t-4 border-t-orange-500 shadow-sm">
						<CardHeader className="pb-3 border-b border-border/50">
							<div className="flex justify-between items-center">
								<CardTitle className="text-base uppercase tracking-wider text-orange-700 dark:text-orange-400">
									Operational Feed
								</CardTitle>
								<span className="text-xs font-data bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-400 px-1.5 py-0.5 rounded-sm">
									{activeAlertCount} ISSUES
								</span>
							</div>
						</CardHeader>
						<CardBody className="p-0">
							{warningAlerts.length === 0 && criticalAlerts.length === 0 ? (
								<div className="p-6 text-center text-muted-foreground">
									<div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 mb-2">
										<LiaStopwatchSolid />
									</div>
									<p className="text-sm">All systems nominal.</p>
								</div>
							) : (
								<div className="divide-y divide-border/50 max-h-[400px] overflow-y-auto">
									{[...criticalAlerts, ...warningAlerts].map((alert) => (
										<div key={alert.id} className="p-4 hover:bg-muted/10 transition-colors">
											<div className="flex justify-between items-start mb-1">
												<span
													className={cn(
														"text-[10px] font-heading font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-sm border",
														alert.severity === "HIGH" || alert.severity === "CRITICAL"
															? "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-300 dark:border-red-900"
															: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/30 dark:text-orange-300 dark:border-orange-900",
													)}
												>
													{alert.type.replace("_", " ")}
												</span>
												<span className="text-[10px] text-muted-foreground font-data">
													{new Date(alert.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
												</span>
											</div>
											<h5 className="text-sm font-medium mt-2 leading-tight">{alert.title}</h5>
											<p className="text-xs text-muted-foreground mt-1 line-clamp-2">
												{alert.description}
											</p>
											{alert.actionUrl && (
												<Link
													to={alert.actionUrl}
													className="inline-flex items-center text-xs font-medium text-primary mt-2 hover:underline"
												>
													Review <LiaArrowRightSolid className="ml-1" />
												</Link>
											)}
										</div>
									))}
								</div>
							)}
							<div className="p-3 border-t border-border/50 bg-muted/20 text-center">
								<Link to="/manager/reports" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
									View Full Alert History
								</Link>
							</div>
						</CardBody>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle className="text-sm uppercase tracking-wider">System Status</CardTitle>
						</CardHeader>
						<CardBody className="space-y-4">
							<div>
								<div className="flex justify-between text-xs mb-1.5">
									<span className="text-muted-foreground">Floor Capacity</span>
									<span className="font-data font-medium">85%</span>
								</div>
								<div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
									<div className="h-full bg-emerald-500 w-[85%] rounded-full" />
								</div>
							</div>
							<div>
								<div className="flex justify-between text-xs mb-1.5">
									<span className="text-muted-foreground">Task Efficiency</span>
									<span className="font-data font-medium">92%</span>
								</div>
								<div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
									<div className="h-full bg-primary w-[92%] rounded-full" />
								</div>
							</div>
							<div>
								<div className="flex justify-between text-xs mb-1.5">
									<span className="text-muted-foreground">Network Status</span>
									<span className="font-data font-medium text-emerald-600">ONLINE</span>
								</div>
							</div>
						</CardBody>
					</Card>
				</div>
			</div>
		</div>
	);
}
