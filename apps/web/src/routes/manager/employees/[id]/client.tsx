"use client";

import { useState } from "react";
import type React from "react";
import { Link } from "react-router";
import {
	Button,
	Card,
	CardHeader,
	CardTitle,
	CardBody,
	Tabs,
	TabList,
	Tab,
	TabPanel,
	Badge,
} from "@monorepo/design-system";
import { PageHeader } from "~/components/page-header";

type EmployeeDetailProps = {
	employee: {
		id: string;
		name: string;
		email: string;
		pinHash: string | null;
		lastStationId: string | null;
		dailyHoursLimit: number | null;
		weeklyHoursLimit: number | null;
		employeeCode: string | null;
		phoneNumber: string | null;
		hireDate: Date | null;
		status: "ACTIVE" | "INACTIVE" | "ON_LEAVE" | "TERMINATED";
		defaultStationId: string | null;
		createdAt: Date;
		updatedAt: Date;
		defaultStation?: { id: string; name: string } | null;
		lastStation?: { id: string; name: string } | null;
		User?: { id: string; email: string; name: string | null; role: string } | null;
		TimeLog?: Array<{
			id: string;
			startTime: Date;
			endTime: Date | null;
			type: "WORK" | "BREAK";
			note: string | null;
			Station?: { id: string; name: string } | null;
			Task?: { id: string } | null;
		}>;
		TaskAssignment?: Array<{
			id: string;
			startTime: Date;
			endTime: Date | null;
			unitsCompleted: number | null;
			notes: string | null;
			TaskType: {
				id: string;
				name: string;
				description: string | null;
			};
		}>;
	};
};

export function EmployeeDetail({ employee }: EmployeeDetailProps) {
	const [activeTab, setActiveTab] = useState<"overview" | "time-logs" | "tasks" | "performance">(
		"overview"
	);

	const getStatusBadge = (status: string) => {
		const variantByStatus: Record<string, "success" | "secondary" | "primary" | "destructive"> = {
			ACTIVE: "success",
			INACTIVE: "secondary",
			ON_LEAVE: "primary",
			TERMINATED: "destructive",
		};

		return (
			<Badge variant={variantByStatus[status] ?? "secondary"}>{status.replace("_", " ")}</Badge>
		);
	};

	const formatDuration = (start: Date, end: Date | null) => {
		if (!end) return "In progress";
		const diff = end.getTime() - start.getTime();
		const hours = Math.floor(diff / (1000 * 60 * 60));
		const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
		return `${hours}h ${minutes}m`;
	};

	const calculateHoursToday = () => {
		const today = new Date();
		today.setHours(0, 0, 0, 0);

		if (!employee.TimeLog) return 0;

		const todayLogs = employee.TimeLog.filter((log) => new Date(log.startTime) >= today);

		return todayLogs.reduce((total, log) => {
			if (log.endTime) {
				const diff = new Date(log.endTime).getTime() - new Date(log.startTime).getTime();
				return total + diff / (1000 * 60 * 60);
			}
			return total; // Don't count ongoing shifts
		}, 0);
	};

	const toDate = (value: Date | string | null | undefined): Date | null => {
		if (!value) return null;
		const parsed = value instanceof Date ? value : new Date(value);
		return Number.isNaN(parsed.getTime()) ? null : parsed;
	};

	const getStartOfWeek = (now: Date) => {
		const weekStart = new Date(now);
		const day = weekStart.getDay();
		weekStart.setDate(weekStart.getDate() - day);
		weekStart.setHours(0, 0, 0, 0);
		return weekStart;
	};

	const calculateOverlapHours = (start: Date, end: Date, windowStart: Date, windowEnd: Date) => {
		const overlapStart = Math.max(start.getTime(), windowStart.getTime());
		const overlapEnd = Math.min(end.getTime(), windowEnd.getTime());
		if (overlapEnd <= overlapStart) {
			return 0;
		}

		return (overlapEnd - overlapStart) / (1000 * 60 * 60);
	};

	const now = new Date();
	const currentWindowStart = getStartOfWeek(now);
	const currentWindowEnd = now;
	const windowDurationMs = currentWindowEnd.getTime() - currentWindowStart.getTime();
	const previousWindowStart = new Date(currentWindowStart.getTime() - windowDurationMs);
	const previousWindowEnd = currentWindowStart;

	const timeLogs = employee.TimeLog ?? [];
	const taskAssignments = employee.TaskAssignment ?? [];

	const hoursThisWeek = timeLogs.reduce((total, log) => {
		if (log.type !== "WORK") {
			return total;
		}

		const start = toDate(log.startTime);
		if (!start) {
			return total;
		}

		const resolvedEnd = toDate(log.endTime) ?? now;
		return total + calculateOverlapHours(start, resolvedEnd, currentWindowStart, currentWindowEnd);
	}, 0);

	const hoursPreviousWindow = timeLogs.reduce((total, log) => {
		if (log.type !== "WORK") {
			return total;
		}

		const start = toDate(log.startTime);
		if (!start) {
			return total;
		}

		const end = toDate(log.endTime);
		if (!end) {
			return total;
		}

		return total + calculateOverlapHours(start, end, previousWindowStart, previousWindowEnd);
	}, 0);

	const completedTasksThisWindow = taskAssignments.filter((task) => {
		const end = toDate(task.endTime);
		if (!end) {
			return false;
		}

		return end >= currentWindowStart && end <= currentWindowEnd;
	});

	const completedTasksPreviousWindow = taskAssignments.filter((task) => {
		const end = toDate(task.endTime);
		if (!end) {
			return false;
		}

		return end >= previousWindowStart && end < previousWindowEnd;
	});

	const averageTaskDurationMinutes = (() => {
		const durations = completedTasksThisWindow
			.map((task) => {
				const start = toDate(task.startTime);
				const end = toDate(task.endTime);
				if (!start || !end || end.getTime() <= start.getTime()) {
					return null;
				}

				return (end.getTime() - start.getTime()) / (1000 * 60);
			})
			.filter((duration): duration is number => duration !== null);

		if (durations.length === 0) {
			return null;
		}

		return durations.reduce((sum, duration) => sum + duration, 0) / durations.length;
	})();

	const hoursTrend = hoursThisWeek - hoursPreviousWindow;
	const tasksTrend = completedTasksThisWindow.length - completedTasksPreviousWindow.length;

	const formatTrend = (value: number, unit: string) => {
		if (!Number.isFinite(value)) {
			return { label: "Unavailable", className: "text-muted-foreground" };
		}

		if (Math.abs(value) < 0.05) {
			return { label: `No change (${unit})`, className: "text-muted-foreground" };
		}

		const sign = value > 0 ? "+" : "";
		return {
			label: `${sign}${value.toFixed(1)} ${unit}`,
			className: value > 0 ? "text-success" : "text-destructive",
		};
	};

	const hoursTrendDisplay = formatTrend(hoursTrend, "h");
	const tasksTrendDisplay = formatTrend(tasksTrend, "tasks");

	const tabs = [
		{ id: "overview" as const, label: "Overview" },
		{ id: "time-logs" as const, label: "Time Logs" },
		{ id: "tasks" as const, label: "Task History" },
		{ id: "performance" as const, label: "Performance" },
	];

	return (
		<div className="max-w-6xl mx-auto space-y-6">
			<PageHeader
				title={employee.name}
				subtitle={employee.email}
				actions={
					<div className="flex items-center gap-2">
						{getStatusBadge(employee.status)}
						<Link to={`/manager/employees/${employee.id}/edit`}>
							<Button variant="primary">Edit Employee</Button>
						</Link>
					</div>
				}
			/>

			<div className="text-sm text-muted-foreground -mt-4">
				Employee Code:{" "}
				<code className="font-mono tabular-nums">{employee.employeeCode || "-"}</code>
			</div>

			{/* Summary Cards */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<Card>
					<CardBody>
						<h3 className="font-semibold mb-2">Hours Today</h3>
						<p className="text-2xl">{calculateHoursToday().toFixed(2)}h</p>
					</CardBody>
				</Card>
				<Card>
					<CardBody>
						<h3 className="font-semibold mb-2">Default Station</h3>
						<p className="text-lg">{employee.defaultStation?.name || "Unassigned"}</p>
					</CardBody>
				</Card>
				<Card>
					<CardBody>
						<h3 className="font-semibold mb-2">System Role</h3>
						<p className="text-lg capitalize">{employee.User?.role || "No User Account"}</p>
					</CardBody>
				</Card>
			</div>

			{/* Tabs */}
			<Tabs
				selectedKey={activeTab}
				onSelectionChange={(key: React.Key) => setActiveTab(key as typeof activeTab)}
			>
				<TabList aria-label="Employee detail sections">
					{tabs.map((tab) => (
						<Tab key={tab.id} id={tab.id}>
							{tab.label}
						</Tab>
					))}
				</TabList>

				<TabPanel id="overview">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<Card>
							<CardHeader>
								<CardTitle>Basic Information</CardTitle>
							</CardHeader>
							<CardBody className="space-y-4">
								<div>
									<p className="text-sm text-muted-foreground">Employee Code</p>
									<p className="font-medium">{employee.employeeCode}</p>
								</div>
								<div>
									<p className="text-sm text-muted-foreground">Phone Number</p>
									<p className="font-medium">{employee.phoneNumber || "Not provided"}</p>
								</div>
								<div>
									<p className="text-sm text-muted-foreground">Hire Date</p>
									<p className="font-medium">
										{employee.hireDate
											? new Date(employee.hireDate).toLocaleDateString()
											: "Not set"}
									</p>
								</div>
								<div>
									<p className="text-sm text-muted-foreground">Status</p>
									<div className="mt-1">{getStatusBadge(employee.status)}</div>
								</div>
							</CardBody>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Work Settings</CardTitle>
							</CardHeader>
							<CardBody className="space-y-4">
								<div>
									<p className="text-sm text-muted-foreground">Daily Hours Limit</p>
									<p className="font-medium">{employee.dailyHoursLimit || 8} hours</p>
								</div>
								<div>
									<p className="text-sm text-muted-foreground">Weekly Hours Limit</p>
									<p className="font-medium">{employee.weeklyHoursLimit || 40} hours</p>
								</div>
								<div>
									<p className="text-sm text-muted-foreground">Default Station</p>
									<p className="font-medium">{employee.defaultStation?.name || "Unassigned"}</p>
								</div>
								<div>
									<p className="text-sm text-muted-foreground">Last Station</p>
									<p className="font-medium">{employee.lastStation?.name || "None"}</p>
								</div>
							</CardBody>
						</Card>
					</div>
				</TabPanel>

				<TabPanel id="time-logs">
					<Card>
						<CardHeader>
							<CardTitle>Recent Time Logs</CardTitle>
						</CardHeader>
						<CardBody>
							{!employee.TimeLog || employee.TimeLog.length === 0 ? (
								<p className="text-center text-muted-foreground py-6">No time logs found</p>
							) : (
								<div className="overflow-x-auto">
									<table className="w-full">
										<thead>
											<tr className="border-b border-border bg-muted/20 text-xs font-heading uppercase tracking-wider text-muted-foreground">
												<th className="text-left p-4">Date</th>
												<th className="text-left p-4">Type</th>
												<th className="text-left p-4">Station</th>
												<th className="text-left p-4">Duration</th>
												<th className="text-left p-4">Note</th>
											</tr>
										</thead>
										<tbody>
											{employee.TimeLog.map((log) => (
												<tr key={log.id} className="border-b border-border">
													<td className="p-4">
														{new Date(log.startTime).toLocaleDateString()}
														<br />
														<span className="text-sm text-muted-foreground">
															{new Date(log.startTime).toLocaleTimeString()}
														</span>
													</td>
													<td className="p-4">
														<span
															className={`px-2 py-1 text-xs rounded-[2px] ${
																log.type === "WORK"
																	? "bg-accent text-foreground"
																	: "bg-accent text-muted-foreground"
															}`}
														>
															{log.type}
														</span>
													</td>
													<td className="p-4">{log.Station?.name || "None"}</td>
													<td className="p-4">{formatDuration(log.startTime, log.endTime)}</td>
													<td className="p-4 text-sm">{log.note || "-"}</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							)}
						</CardBody>
					</Card>
				</TabPanel>

				<TabPanel id="tasks">
					<Card>
						<CardHeader>
							<CardTitle>Task Assignment History</CardTitle>
						</CardHeader>
						<CardBody>
							{!employee.TaskAssignment || employee.TaskAssignment.length === 0 ? (
								<p className="text-center text-muted-foreground py-6">No task assignments found</p>
							) : (
								<div className="space-y-3">
									{employee.TaskAssignment.map((task) => (
										<div key={task.id} className="border border-border rounded-[2px] p-4">
											<div className="flex justify-between items-start">
												<div>
													<h4 className="font-medium">{task.TaskType.name}</h4>
													<p className="text-sm text-muted-foreground">
														{task.TaskType.description}
													</p>
													<p className="text-xs text-muted-foreground mt-1">
														Started: {new Date(task.startTime).toLocaleString()}
													</p>
													{task.endTime && (
														<p className="text-xs text-muted-foreground">
															Ended: {new Date(task.endTime).toLocaleString()}
														</p>
													)}
													{task.notes && <p className="text-sm mt-2">Notes: {task.notes}</p>}
												</div>
												<div className="text-right">
													{task.unitsCompleted !== null && (
														<p className="font-medium">{task.unitsCompleted} units</p>
													)}
													<Badge variant={task.endTime ? "secondary" : "success"}>
														{task.endTime ? "Completed" : "In Progress"}
													</Badge>
												</div>
											</div>
										</div>
									))}
								</div>
							)}
						</CardBody>
					</Card>
				</TabPanel>

				<TabPanel id="performance">
					<Card>
						<CardHeader>
							<CardTitle>Performance Metrics</CardTitle>
						</CardHeader>
						<CardBody>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<h3 className="font-semibold mb-4">Current Week</h3>
									<div className="space-y-2">
										<div className="flex justify-between">
											<span className="text-muted-foreground">Hours this week:</span>
											<span className="font-medium font-mono tabular-nums">
												{hoursThisWeek.toFixed(1)}h
											</span>
										</div>
										<div className="flex justify-between">
											<span className="text-muted-foreground">Tasks completed:</span>
											<span className="font-medium font-mono tabular-nums">
												{completedTasksThisWindow.length}
											</span>
										</div>
										<div className="flex justify-between">
											<span className="text-muted-foreground">Avg task duration:</span>
											<span className="font-medium font-mono tabular-nums">
												{averageTaskDurationMinutes === null
													? "Unavailable"
													: `${averageTaskDurationMinutes.toFixed(1)} min`}
											</span>
										</div>
										<div className="flex justify-between">
											<span className="text-muted-foreground">Window coverage:</span>
											<span className="font-medium font-mono tabular-nums">
												{(
													(hoursThisWeek / Math.max(windowDurationMs / (1000 * 60 * 60), 1)) *
													100
												).toFixed(1)}
												%
											</span>
										</div>
									</div>
								</div>
								<div>
									<h3 className="font-semibold mb-4">Trend vs Previous Window</h3>
									<div className="space-y-2">
										<div className="flex justify-between">
											<span className="text-muted-foreground">Hours delta:</span>
											<span
												className={`font-medium font-mono tabular-nums ${hoursTrendDisplay.className}`}
											>
												{hoursTrendDisplay.label}
											</span>
										</div>
										<div className="flex justify-between">
											<span className="text-muted-foreground">Completed tasks delta:</span>
											<span
												className={`font-medium font-mono tabular-nums ${tasksTrendDisplay.className}`}
											>
												{tasksTrendDisplay.label}
											</span>
										</div>
										<div className="flex justify-between">
											<span className="text-muted-foreground">Previous window hours:</span>
											<span className="font-medium font-mono tabular-nums">
												{hoursPreviousWindow.toFixed(1)}h
											</span>
										</div>
										<p className="pt-2 text-xs text-muted-foreground">
											Metrics are computed from the last 30 days of loaded time logs and task
											assignments.
										</p>
									</div>
								</div>
							</div>
						</CardBody>
					</Card>
				</TabPanel>
			</Tabs>
		</div>
	);
}
