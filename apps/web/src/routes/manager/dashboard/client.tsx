"use client";

import { Link } from "react-router";
import { Card, CardHeader, CardTitle, CardBody, Alert } from "@monorepo/design-system";
import { Button } from "@monorepo/design-system";
import { IndustrialPanel, LedIndicator } from "@monorepo/design-system";
import { PageHeader } from "~/components/page-header";
import {
	LiaUserPlusSolid,
	LiaHistorySolid,
	LiaTasksSolid,
	LiaChartBarSolid,
	LiaCheckCircleSolid,
} from "react-icons/lia";
import type { TimeLog, Employee, Station, User } from "@prisma/client";

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

export function ManagerDashboard({
   activeTimeLogs,
   totalEmployees,
   alerts = [],
   user,
}: {
   activeTimeLogs: TimeLogWithEmployee[];
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

	return (
		<div className="space-y-6">
			<PageHeader
				title="Manager Dashboard"
				subtitle={`Welcome back, ${user.name || user.email}`}
				actions={
					<Link
						to="/manager/monitor"
						className="inline-flex items-center justify-center font-medium rounded-sm transition-all duration-150 ease-out focus:outline-none focus:ring-2 ring-ring focus:ring-offset-2 ring-offset-background active:scale-[0.98] font-heading tracking-tight shadow-sm bg-primary border border-primary text-primary-foreground hover:bg-primary-hover active:bg-primary-active aria-disabled:bg-muted aria-disabled:cursor-not-allowed h-10 px-4 text-base"
					>
						Floor Monitor
					</Link>
				}
			/>

			{/* Critical Alerts */}
			{alerts.filter((alert) => alert.severity === "CRITICAL" || alert.severity === "HIGH").length >
				0 && (
				<div className="space-y-3">
					{alerts
						.filter((alert) => alert.severity === "CRITICAL" || alert.severity === "HIGH")
						.map((alert) => (
							<Alert
								key={alert.id}
								variant={alert.severity === "CRITICAL" ? "error" : "warning"}
								className="relative"
								aria-live="polite"
							>
								<div className={`corner-card-tl corner-accent-sm ${alert.severity === "CRITICAL" ? "corner-destructive" : "corner-warning"}`} />
								<div className={`corner-card-tr corner-accent-sm ${alert.severity === "CRITICAL" ? "corner-destructive" : "corner-warning"}`} />
								<div className="flex justify-between items-start">
									<div>
										<h4 className="font-medium">{alert.title}</h4>
										<p className="text-sm mt-1">{alert.description}</p>
										{alert.actionUrl && (
											<Link
												to={alert.actionUrl}
												className="inline-flex items-center justify-center font-medium rounded-sm transition-all duration-150 ease-out focus:outline-none focus:ring-2 ring-ring focus:ring-offset-2 ring-offset-background active:scale-[0.98] font-heading tracking-tight border border-border bg-background text-foreground hover:bg-accent active:bg-accent/80 aria-disabled:border-muted aria-disabled:text-muted-foreground aria-disabled:cursor-not-allowed h-9 px-3 text-sm mt-2"
											>
												View Details
											</Link>
										)}
									</div>
									<span className="text-xs text-muted-foreground">
										{new Date(alert.createdAt).toLocaleTimeString()}
									</span>
								</div>
							</Alert>
						))}
				</div>
			)}

			{/* Summary Cards */}
			<div className="grid grid-cols-1 md:grid-cols-5 gap-4">
				<Card>
					<CardBody>
						<div className="text-sm font-medium text-muted-foreground font-heading">
							Active Employees
						</div>
						<div className="text-2xl font-bold font-data">{activeTimeLogs.length}</div>
						<div className="text-xs text-muted-foreground mt-1">Currently working</div>
					</CardBody>
				</Card>
				<Card>
					<CardBody>
						<div className="text-sm font-medium text-muted-foreground font-heading">
							Total Employees
						</div>
						<div className="text-2xl font-bold font-data">{totalEmployees}</div>
						<div className="text-xs text-muted-foreground mt-1">In system</div>
					</CardBody>
				</Card>
				<Card>
					<CardBody>
						<div className="text-sm font-medium text-muted-foreground font-heading">
							Active Alerts
						</div>
						<div className="text-2xl font-bold text-orange-600 font-data">
							{alerts.filter((a) => a.severity !== "LOW").length}
						</div>
						<div className="text-xs text-muted-foreground mt-1">Require attention</div>
					</CardBody>
				</Card>
				<Card>
					<CardBody>
						<div className="text-sm font-medium text-muted-foreground font-heading">
							Longest Shift
						</div>
						<div className="text-2xl font-bold font-data">
							{activeTimeLogs.length > 0 ? formatDuration(activeTimeLogs[0].startTime) : "0h 0m"}
						</div>
						<div className="text-xs text-muted-foreground mt-1">Longest current shift</div>
					</CardBody>
				</Card>
				<Card>
					<CardBody>
						<div className="text-sm font-medium text-muted-foreground font-heading">
							Utilization
						</div>
						<div className="text-2xl font-bold font-data">85%</div>
						<div className="text-xs text-muted-foreground mt-1">
							Floor Utilization
						</div>
					</CardBody>
				</Card>
			</div>

			{/* Dashboard Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Active Sessions */}
				<IndustrialPanel className="relative lg:col-span-2">
					<div className="corner-panel-tl corner-accent-sm corner-muted" />
					<div className="p-6 border-b border-border">
						<h3 className="font-heading text-lg font-bold uppercase tracking-wide">
							Active Sessions
						</h3>
					</div>
					<div className="p-6">
						{activeTimeLogs.length === 0 ? (
							<p className="text-center text-muted-foreground py-8">No active sessions</p>
						) : (
							<div className="space-y-3">
								{activeTimeLogs.slice(0, 5).map((log) => (
									<div
										key={log.id}
										className="flex justify-between items-center p-3 bg-muted/30 rounded-sm border border-border"
									>
										<div className="flex items-center gap-3">
											<LedIndicator active={true} className="w-4 h-4" />
											<div>
												<div className="font-medium font-heading">{log.employee.name}</div>
												<div className="text-sm text-muted-foreground">
													{log.station?.name || "No station"}
												</div>
											</div>
										</div>
										<div className="text-right">
											<div className="font-data font-medium">{formatDuration(log.startTime)}</div>
											<div className="text-xs text-muted-foreground">
												Started: {new Date(log.startTime).toLocaleTimeString()}
											</div>
										</div>
									</div>
								))}
								{activeTimeLogs.length > 5 && (
									<div className="text-center pt-3">
										<Link to="/manager/monitor">
											<Button variant="outline" size="sm">
												View All
											</Button>
										</Link>
									</div>
								)}
							</div>
						)}
					</div>
				</IndustrialPanel>

				{/* Recent Alerts */}
				<Card>
					<CardHeader>
						<CardTitle>Recent Alerts</CardTitle>
					</CardHeader>
					<CardBody>
						{alerts.filter((alert) => alert.severity !== "LOW").length === 0 ? (
							<div className="text-center text-muted-foreground py-8">
								<div className="text-3xl mb-2 text-emerald-500">
									<LiaCheckCircleSolid className="mx-auto" />
								</div>
								<p>All systems normal</p>
							</div>
						) : (
							<div className="space-y-3">
								{alerts
									.filter((alert) => alert.severity !== "LOW")
									.slice(0, 4)
									.map((alert) => (
										<div key={alert.id} className="border-l-4 border-l-orange-500 pl-3 py-2">
											<h4 className="font-medium text-sm">{alert.title}</h4>
											<p className="text-xs text-muted-foreground mt-1">{alert.description}</p>
											<div className="text-xs text-muted-foreground mt-2">
												{new Date(alert.createdAt).toLocaleTimeString()}
											</div>
										</div>
									))}
								{alerts.filter((alert) => alert.severity !== "LOW").length > 4 && (
									<div className="text-center pt-3">
										<Link to="/manager/reports">
											<Button variant="outline" size="sm">
												View All Alerts
											</Button>
										</Link>
									</div>
								)}
							</div>
						)}
					</CardBody>
				</Card>
			</div>

			{/* Quick Actions */}
			<Card className="relative">
				<div className="corner-panel-tl corner-accent-sm corner-muted" />
				<CardHeader>
					<CardTitle className="uppercase tracking-wide">Quick Actions</CardTitle>
				</CardHeader>
				<CardBody>
					<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
						<Link to="/manager/employees/new">
							<div className="text-center p-4 border border-border rounded-sm hover:border-primary/20 cursor-pointer transition-colors duration-200 group">
								<div className="text-3xl mb-2 text-primary group-hover:scale-110 transition-transform duration-200">
									<LiaUserPlusSolid className="mx-auto" />
								</div>
								<h4 className="font-medium font-heading">Add Employee</h4>
								<p className="text-xs text-muted-foreground mt-1">Create new record</p>
							</div>
						</Link>

						<Link to="/manager/timesheets">
							<div className="text-center p-4 border border-border rounded-sm hover:border-primary/20 cursor-pointer transition-colors duration-200 group">
								<div className="text-3xl mb-2 text-primary group-hover:scale-110 transition-transform duration-200">
									<LiaHistorySolid className="mx-auto" />
								</div>
								<h4 className="font-medium font-heading">Time Correction</h4>
								<p className="text-xs text-muted-foreground mt-1">Edit entries</p>
							</div>
						</Link>

						<Link to="/manager/tasks">
							<div className="text-center p-4 border border-border rounded-sm hover:border-primary/20 cursor-pointer transition-colors duration-200 group">
								<div className="text-3xl mb-2 text-primary group-hover:scale-110 transition-transform duration-200">
									<LiaTasksSolid className="mx-auto" />
								</div>
								<h4 className="font-medium font-heading">Assign Tasks</h4>
								<p className="text-xs text-muted-foreground mt-1">Manage tasks</p>
							</div>
						</Link>

						<Link to="/manager/reports">
							<div className="text-center p-4 border border-border rounded-sm hover:border-primary/20 cursor-pointer transition-colors duration-200 group">
								<div className="text-3xl mb-2 text-primary group-hover:scale-110 transition-transform duration-200">
									<LiaChartBarSolid className="mx-auto" />
								</div>
								<h4 className="font-medium font-heading">View Reports</h4>
								<p className="text-xs text-muted-foreground mt-1">Analytics</p>
							</div>
						</Link>
					</div>
				</CardBody>
			</Card>

			{/* Exceptions Feed */}
			<Card>
				<CardHeader>
					<CardTitle>Exceptions Feed</CardTitle>
				</CardHeader>
				<CardBody>
					<div className="space-y-2">
						{['Late Arrivals', 'Break Violations', 'Maintenance Issues'].map((item) => (
							<div key={item} className="border-b last:border-none py-2">
								<span className="font-medium">{item}</span>
							</div>
						))}
					</div>
				</CardBody>
			</Card>
		</div>
	);
}
