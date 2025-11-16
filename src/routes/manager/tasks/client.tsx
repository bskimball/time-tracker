"use client";

import { useActionState, useOptimistic, useState } from "react";
import type React from "react";
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
import type { TaskType, TaskAssignment, Employee, Station } from "./types";
import { TaskAssignmentForm } from "./task-assignment-form";
import { TaskTypeForm } from "./task-type-form";

interface TaskManagerProps {
	taskTypes: TaskType[];
	activeAssignments: TaskAssignment[];
	employees: Employee[];
	stations: Station[];
	assignTaskAction: (
		prevState: { error?: string | null; success?: boolean } | null,
		formData: FormData
	) => Promise<{
		assignment?: any;
		activeAssignments?: TaskAssignment[];
		error?: string | null;
		success?: boolean;
	}>;
}

export function TaskManager({
	taskTypes,
	activeAssignments,
	employees,
	stations,
	assignTaskAction,
}: TaskManagerProps) {
	const [activeTab, setActiveTab] = useState<"assignments" | "history" | "types">("assignments");
	const [showAssignForm, setShowAssignForm] = useState(false);
	const [showTaskTypeForm, setShowTaskTypeForm] = useState(false);
	const [assignState, assignAction, isAssignPending] = useActionState(assignTaskAction, null);
	const [createTypeState, createTypeAction, isCreateTypePending] = useActionState(
		async (
			_prev: { error?: string | null; success?: boolean } | null,
			formData: FormData
		) => {
			const { createTaskTypeAction } = await import("./actions");
			return createTaskTypeAction(_prev, formData);
		},
		null
	);
	const [optimisticAssignments, addOptimisticAssignment] = useOptimistic<
		TaskAssignment[],
		{
			employeeId: string;
			taskTypeId: string;
			priority: "LOW" | "MEDIUM" | "HIGH";
			notes?: string;
		}
	>(activeAssignments, (current, update) => {
		const employee = employees.find((e) => e.id === update.employeeId);
		const taskType = taskTypes.find((t) => t.id === update.taskTypeId);

		if (!employee || !taskType) return current;

		const optimisticAssignment: TaskAssignment = {
			id: `optimistic-${Date.now()}`,
			employeeId: employee.id,
			taskTypeId: taskType.id,
			notes: update.notes ?? null,
			startTime: new Date().toISOString() as any,
			endTime: null,
			unitsCompleted: null,
			Employee: employee,
			TaskType: taskType,
		};

		return [optimisticAssignment, ...current];
	});

	const formatDuration = (startTime: Date, endTime: Date | null): string => {
		if (!endTime) {
			const now = new Date();
			const diff = now.getTime() - new Date(startTime).getTime();
			const hours = Math.floor(diff / (1000 * 60 * 60));
			const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
			return `${hours}h ${minutes}m`;
		}
		const diff = new Date(endTime).getTime() - new Date(startTime).getTime();
		const hours = Math.floor(diff / (1000 * 60 * 60));
		const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
		return `${hours}h ${minutes}m`;
	};

	const getTaskEfficiencyColor = (efficiency: number): string => {
		if (efficiency > 1.0) return "text-green-600";
		if (efficiency > 0.8) return "text-yellow-600";
		return "text-red-600";
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-2xl font-bold">Task Management</h1>
					<p className="text-muted-foreground">Assign and track employee tasks</p>
				</div>
				<div className="flex space-x-2">
					<Button onClick={() => setShowAssignForm(true)} variant="primary">
						Assign Task
					</Button>
					<Button onClick={() => setShowTaskTypeForm(true)} variant="outline">
						Create Task Type
					</Button>
				</div>
			</div>

			{/* Summary Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<Card>
					<CardBody>
						<h3 className="font-semibold mb-2">Active Tasks</h3>
						<p className="text-2xl">{optimisticAssignments.filter((a) => !a.endTime).length}</p>
						<p className="text-sm text-muted-foreground">In progress</p>
					</CardBody>
				</Card>

				<Card>
					<CardBody>
						<h3 className="font-semibold mb-2">Task Types</h3>
						<p className="text-2xl">{taskTypes.length}</p>
						<p className="text-sm text-muted-foreground">Available</p>
					</CardBody>
				</Card>

				<Card>
					<CardBody>
						<h3 className="font-semibold mb-2">Avg Duration</h3>
						<p className="text-2xl">
							{optimisticAssignments.length > 0
								? Math.round(
									optimisticAssignments
										.filter((a) => a.endTime)
										.reduce((total, a) => {
											const duration =
												new Date(a.endTime!).getTime() - new Date(a.startTime).getTime();
											return total + duration;
										}, 0) /
									(1000 * 60 * 60 * optimisticAssignments.filter((a) => a.endTime).length)
								)
								: 0}
							h
						</p>
						<p className="text-sm text-muted-foreground">Average task time</p>
					</CardBody>
				</Card>

				<Card>
					<CardBody>
						<h3 className="font-semibold mb-2">Completion Rate</h3>
						<p className="text-2xl">
							{optimisticAssignments.length > 0
								? Math.round(
									(optimisticAssignments.filter((a) => a.endTime).length / optimisticAssignments.length) *
									100
								)
								: 0}
							%
						</p>
						<p className="text-sm text-muted-foreground">Tasks completed</p>
					</CardBody>
				</Card>
			</div>

			{/* Tabs */}
			<Tabs
				selectedKey={activeTab}
				onSelectionChange={(key: React.Key) => setActiveTab(key as typeof activeTab)}
			>
				<TabList aria-label="Task manager sections">
					<Tab id="assignments">Active Assignments</Tab>
					<Tab id="history">Task History</Tab>
					<Tab id="types">Task Types</Tab>
				</TabList>

				<TabPanel id="assignments">
					<Card>
						<CardHeader>
							<CardTitle>Active Task Assignments</CardTitle>
						</CardHeader>
						<CardBody>
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
								{optimisticAssignments.map((assignment: TaskAssignment) => (
									<div key={assignment.id} className="border rounded-lg p-4">
										<div className="flex justify-between items-start mb-3">
											<div>
												<h4 className="font-medium">{assignment.TaskType.name}</h4>
												<p className="text-sm text-muted-foreground">{assignment.Employee.name}</p>
											</div>
											{!assignment.endTime && (
												<span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
													Active
												</span>
											)}
										</div>

										<div className="space-y-2 text-sm text-muted-foreground">
											<p>Station: {assignment.TaskType.Station.name}</p>
											<p>Started: {new Date(assignment.startTime).toLocaleTimeString()}</p>
											<p>Duration: {formatDuration(assignment.startTime, assignment.endTime)}</p>
											{assignment.unitsCompleted !== null && (
												<p>Units: {assignment.unitsCompleted}</p>
											)}
										</div>

										<div className="mt-3 flex space-x-2">
											{!assignment.endTime && (
												<>
													<Button size="sm" variant="outline">
														Switch Task
													</Button>
													<Button size="sm" variant="primary">
														Complete
													</Button>
												</>
											)}
										</div>
									</div>
								))}
							</div>

							{optimisticAssignments.length === 0 && (
								<div className="text-center py-8">
									<p className="text-muted-foreground">No active task assignments</p>
									<Button
										onClick={() => setShowAssignForm(true)}
										variant="primary"
										className="mt-4"
									>
										Assign First Task
									</Button>
								</div>
							)}
						</CardBody>
					</Card>
				</TabPanel>

				<TabPanel id="history">
					<Card>
						<CardHeader>
							<CardTitle>Task History</CardTitle>
						</CardHeader>
						<CardBody>
							<div className="overflow-x-auto">
								<table className="w-full">
									<thead>
										<tr className="border-b">
											<th className="text-left p-4">Employee</th>
											<th className="text-left p-4">Task</th>
											<th className="text-left p-4">Station</th>
											<th className="text-left p-4">Start Time</th>
											<th className="text-left p-4">Duration</th>
											<th className="text-left p-4">Units</th>
											<th className="text-left p-4">Efficiency</th>
										</tr>
									</thead>
									<tbody>
										{optimisticAssignments
											.filter((a: TaskAssignment) => a.endTime)
											.map((assignment: TaskAssignment) => {
												const duration =
													(new Date(assignment.endTime!).getTime() -
														new Date(assignment.startTime).getTime()) /
													(1000 * 60);
												const efficiency =
													assignment.unitsCompleted && duration > 0
														? assignment.unitsCompleted / (duration / 60)
														: 0;

												return (
													<tr key={assignment.id} className="border-b hover:bg-muted/50">
														<td className="p-4">{assignment.Employee.name}</td>
														<td className="p-4">{assignment.TaskType.name}</td>
														<td className="p-4">{assignment.TaskType.Station.name}</td>
														<td className="p-4">
															{new Date(assignment.startTime).toLocaleString()}
														</td>
														<td className="p-4">
															{formatDuration(assignment.startTime, assignment.endTime)}
														</td>
														<td className="p-4 text-center">{assignment.unitsCompleted || "-"}</td>
														<td className="p-4 text-center">
															{efficiency > 0 && (
																<span className={getTaskEfficiencyColor(efficiency)}>
																	{efficiency.toFixed(2)}/hr
																</span>
															)}
														</td>
													</tr>
												);
											})}
									</tbody>
								</table>
							</div>

							{optimisticAssignments.filter((a: TaskAssignment) => a.endTime).length === 0 && (
								<div className="text-center py-8">
									<p className="text-muted-foreground">No completed tasks found</p>
								</div>
							)}
						</CardBody>
					</Card>
				</TabPanel>

				<TabPanel id="types">
					<Card>
						<CardHeader>
							<CardTitle>Task Types</CardTitle>
						</CardHeader>
						<CardBody>
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
								{taskTypes.map((taskType) => (
									<div key={taskType.id} className="border rounded-lg p-4">
										<div className="flex justify-between items-start">
											<div>
												<h4 className="font-medium">{taskType.name}</h4>
												<p className="text-sm text-muted-foreground">{taskType.Station.name}</p>
											</div>
											<div className="flex space-x-1">
												<span
													className={`px-2 py-1 text-xs rounded ${taskType.isActive
														? "bg-green-100 text-green-800"
														: "bg-accent text-muted-foreground"
														}`}
												>
													{taskType.isActive ? "Active" : "Inactive"}
												</span>
											</div>
										</div>

										{taskType.description && (
											<p className="text-sm text-muted-foreground mt-2">{taskType.description}</p>
										)}

										{taskType.estimatedMinutesPerUnit && (
											<div className="mt-2 text-sm">
												<span className="text-muted-foreground">Est. time/unit: </span>
												<span className="font-medium">{taskType.estimatedMinutesPerUnit}m</span>
											</div>
										)}

										<div className="mt-3 flex space-x-2">
											<Button size="sm" variant="outline">
												Edit
											</Button>
										</div>
									</div>
								))}
							</div>
						</CardBody>
					</Card>
				</TabPanel>
			</Tabs>

			{/* Task Assignment Form Modal */}
			{showAssignForm && (
				<TaskAssignmentForm
					employees={employees}
					taskTypes={taskTypes}
					activeAssignments={optimisticAssignments}
					onClose={() => setShowAssignForm(false)}
					onSubmit={assignAction}
					onOptimisticAssign={(data) => addOptimisticAssignment(data)}
					isPending={isAssignPending}
					state={assignState}
				/>
			)}

			{/* Task Type Form Modal */}
			{showTaskTypeForm && (
				<TaskTypeForm
					stations={stations}
					onClose={() => setShowTaskTypeForm(false)}
					onSubmit={createTypeAction}
					isPending={isCreateTypePending}
					state={createTypeState}
				/>
			)}
		</div>
	);
}
// Note: active assignments are provided via props to the TaskManager component.
