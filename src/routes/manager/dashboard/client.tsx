"use client";

import { Link } from "react-router";
import { Card, CardHeader, CardTitle, CardBody, Alert } from "~/components/ds";
import { Button } from "~/components/ds/button";
import type { TimeLog, Employee, Station, User } from "@prisma/client";

type TimeLogWithEmployee = TimeLog & {
	employee: Employee;
	station: Station | null;
};

type AlertData = {
	id: string;
	type: "OVERTIME" | "MISSING_PUNCH" | "PERFORMANCE" | "SYSTEM";
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
	recentLogs,
	alerts = [],
	user,
}: {
	activeTimeLogs: TimeLogWithEmployee[];
	totalEmployees: number;
	recentLogs: TimeLogWithEmployee[];
	alerts: AlertData[];
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
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-3xl font-bold">Manager Dashboard</h1>
					<p className="text-muted-foreground">Welcome back, {user.name || user.email}</p>
				</div>
				<Link to="/manager/monitor">
					<Button variant="primary">View Floor Monitor</Button>
				</Link>
			</div>

			{/* Critical Alerts */}
			{alerts.filter((alert) => alert.severity === "CRITICAL" || alert.severity === "HIGH").length >
				0 && (
				<div className="space-y-3">
					{alerts
						.filter((alert) => alert.severity === "CRITICAL" || alert.severity === "HIGH")
						.map((alert) => (
							<Alert key={alert.id} variant={alert.severity === "CRITICAL" ? "error" : "warning"}>
								<div className="flex justify-between items-start">
									<div>
										<h4 className="font-medium">{alert.title}</h4>
										<p className="text-sm mt-1">{alert.description}</p>
										{alert.actionUrl && (
											<Link to={alert.actionUrl}>
												<Button size="sm" variant="outline" className="mt-2">
													View Details
												</Button>
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
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<Card>
					<CardBody>
						<div className="text-sm font-medium text-muted-foreground">Active Employees</div>
						<div className="text-2xl font-bold">{activeTimeLogs.length}</div>
						<div className="text-xs text-muted-foreground mt-1">Currently working</div>
					</CardBody>
				</Card>
				<Card>
					<CardBody>
						<div className="text-sm font-medium text-muted-foreground">Total Employees</div>
						<div className="text-2xl font-bold">{totalEmployees}</div>
						<div className="text-xs text-muted-foreground mt-1">In system</div>
					</CardBody>
				</Card>
				<Card>
					<CardBody>
						<div className="text-sm font-medium text-muted-foreground">Active Alerts</div>
						<div className="text-2xl font-bold text-orange-600">
							{alerts.filter((a) => a.severity !== "LOW").length}
						</div>
						<div className="text-xs text-muted-foreground mt-1">Require attention</div>
					</CardBody>
				</Card>
				<Card>
					<CardBody>
						<div className="text-sm font-medium text-muted-foreground">Longest Shift</div>
						<div className="text-2xl font-bold">
							{activeTimeLogs.length > 0 ? formatDuration(activeTimeLogs[0].startTime) : "0h 0m"}
						</div>
						<div className="text-xs text-muted-foreground mt-1">Longest current shift</div>
					</CardBody>
				</Card>
			</div>

			{/* Dashboard Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Active Sessions */}
				<Card className="lg:col-span-2">
					<CardHeader>
						<CardTitle>Active Sessions</CardTitle>
					</CardHeader>
					<CardBody>
						{activeTimeLogs.length === 0 ? (
							<p className="text-center text-muted-foreground py-8">No active sessions</p>
						) : (
							<div className="space-y-3">
								{activeTimeLogs.slice(0, 5).map((log) => (
									<div
										key={log.id}
										className="flex justify-between items-center p-3 bg-muted/30 rounded"
									>
										<div>
											<div className="font-medium">{log.employee.name}</div>
											<div className="text-sm text-muted-foreground">
												{log.station?.name || "No station"}
											</div>
										</div>
										<div className="text-right">
											<div className="font-medium">{formatDuration(log.startTime)}</div>
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
												View All Active Sessions
											</Button>
										</Link>
									</div>
								)}
							</div>
						)}
					</CardBody>
				</Card>

				{/* Recent Alerts */}
				<Card>
					<CardHeader>
						<CardTitle>Recent Alerts</CardTitle>
					</CardHeader>
					<CardBody>
						{alerts.filter((alert) => alert.severity !== "LOW").length === 0 ? (
							<div className="text-center text-muted-foreground py-8">
								<div className="text-2xl mb-2">✓</div>
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
			<Card>
				<CardHeader>
					<CardTitle>Quick Actions</CardTitle>
				</CardHeader>
				<CardBody>
					<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
						<Link to="/manager/employees/new">
							<div className="text-center p-4 border rounded hover:bg-muted/50 cursor-pointer transition-colors">
								<div className="text-2xl mb-2">👤</div>
								<h4 className="font-medium">Add Employee</h4>
								<p className="text-xs text-muted-foreground mt-1">Create new employee record</p>
							</div>
						</Link>

						<Link to="/manager/timesheets">
							<div className="text-center p-4 border rounded hover:bg-muted/50 cursor-pointer transition-colors">
								<div className="text-2xl mb-2">🕐</div>
								<h4 className="font-medium">Time Correction</h4>
								<p className="text-xs text-muted-foreground mt-1">Edit time entries</p>
							</div>
						</Link>

						<Link to="/manager/tasks">
							<div className="text-center p-4 border rounded hover:bg-muted/50 cursor-pointer transition-colors">
								<div className="text-2xl mb-2">📋</div>
								<h4 className="font-medium">Assign Tasks</h4>
								<p className="text-xs text-muted-foreground mt-1">Manage tasks</p>
							</div>
						</Link>

						<Link to="/manager/reports">
							<div className="text-center p-4 border rounded hover:bg-muted/50 cursor-pointer transition-colors">
								<div className="text-2xl mb-2">📊</div>
								<h4 className="font-medium">View Reports</h4>
								<p className="text-xs text-muted-foreground mt-1">Analytics & insights</p>
							</div>
						</Link>
					</div>
				</CardBody>
			</Card>

			{/* Recent Activity */}
			<Card>
				<CardHeader>
					<CardTitle>Recent Activity</CardTitle>
				</CardHeader>
				<CardBody>
					{recentLogs.length === 0 ? (
						<p className="text-center text-muted-foreground py-8">No recent activity</p>
					) : (
						<div className="space-y-2">
							{recentLogs.slice(0, 5).map((log) => (
								<div key={log.id} className="flex justify-between items-center py-2 border-b">
									<div>
										<span className="font-medium">{log.employee.name}</span>
										{log.station && (
											<span className="text-sm text-muted-foreground ml-2">
												@ {log.station.name}
											</span>
										)}
									</div>
									<div className="text-sm text-muted-foreground">
										{log.endTime
											? `Worked ${formatDuration(log.startTime)}`
											: `Started at ${new Date(log.startTime).toLocaleTimeString()}`}
									</div>
								</div>
							))}
						</div>
					)}
				</CardBody>
			</Card>
		</div>
	);
}
