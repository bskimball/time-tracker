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
} from "~/components/ds";

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
		const styles = {
			ACTIVE: "bg-green-100 text-green-800",
			INACTIVE: "bg-accent text-muted-foreground",
			ON_LEAVE: "bg-yellow-100 text-yellow-800",
			TERMINATED: "bg-red-100 text-red-800",
		};

		return (
			<span
				className={`px-3 py-1 text-sm font-medium rounded-full ${styles[status as keyof typeof styles]}`}
			>
				{status.replace("_", " ")}
			</span>
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

	const tabs = [
		{ id: "overview" as const, label: "Overview" },
		{ id: "time-logs" as const, label: "Time Logs" },
		{ id: "tasks" as const, label: "Task History" },
		{ id: "performance" as const, label: "Performance" },
	];

	return (
		<div className="max-w-6xl mx-auto space-y-6">
			{/* Header */}
			<div className="flex justify-between items-start">
				<div>
					<h1 className="text-2xl font-bold">{employee.name}</h1>
					<p className="text-muted-foreground">{employee.email}</p>
					<div className="flex items-center space-x-2 mt-2">
						{getStatusBadge(employee.status)}
						<span className="text-sm text-muted-foreground">
							Employee Code: <code>{employee.employeeCode}</code>
						</span>
					</div>
				</div>
				<div className="flex space-x-2">
					<Link to={`/manager/employees/${employee.id}/edit`}>
						<Button variant="primary">Edit Employee</Button>
					</Link>
				</div>
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
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
								<p className="text-center text-muted-foreground py-8">No time logs found</p>
							) : (
								<div className="overflow-x-auto">
									<table className="w-full">
										<thead>
											<tr className="border-b">
												<th className="text-left p-4">Date</th>
												<th className="text-left p-4">Type</th>
												<th className="text-left p-4">Station</th>
												<th className="text-left p-4">Duration</th>
												<th className="text-left p-4">Note</th>
											</tr>
										</thead>
										<tbody>
											{employee.TimeLog.map((log) => (
												<tr key={log.id} className="border-b">
													<td className="p-4">
														{new Date(log.startTime).toLocaleDateString()}
														<br />
														<span className="text-sm text-muted-foreground">
															{new Date(log.startTime).toLocaleTimeString()}
														</span>
													</td>
													<td className="p-4">
														<span
															className={`px-2 py-1 text-xs rounded ${
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
								<p className="text-center text-muted-foreground py-8">No task assignments found</p>
							) : (
								<div className="space-y-3">
									{employee.TaskAssignment.map((task) => (
										<div key={task.id} className="border rounded p-4">
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
													<span
														className={`text-xs px-2 py-1 rounded ${
															task.endTime
																? "bg-accent text-muted-foreground"
																: "bg-green-100 text-green-800"
														}`}
													>
														{task.endTime ? "Completed" : "In Progress"}
													</span>
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
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div>
									<h3 className="font-semibold mb-4">Weekly Summary</h3>
									<div className="space-y-2">
										<div className="flex justify-between">
											<span className="text-muted-foreground">Total Hours This Week:</span>
											<span className="font-medium">32.5h</span>
										</div>
										<div className="flex justify-between">
											<span className="text-muted-foreground">Tasks Completed:</span>
											<span className="font-medium">24</span>
										</div>
										<div className="flex justify-between">
											<span className="text-muted-foreground">Average Task Time:</span>
											<span className="font-medium">18.5 min</span>
										</div>
										<div className="flex justify-between">
											<span className="text-muted-foreground">Efficiency:</span>
											<span className="font-medium">92%</span>
										</div>
									</div>
								</div>
								<div>
									<h3 className="font-semibold mb-4">Trends</h3>
									<div className="space-y-2">
										<div className="flex justify-between">
											<span className="text-muted-foreground">Hours vs. Last Week:</span>
											<span className="font-medium text-green-600">+2.3h</span>
										</div>
										<div className="flex justify-between">
											<span className="text-muted-foreground">Efficiency Trend:</span>
											<span className="font-medium text-green-600">+5%</span>
										</div>
										<div className="flex justify-between">
											<span className="text-muted-foreground">Attendance Rate:</span>
											<span className="font-medium">98.5%</span>
										</div>
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
