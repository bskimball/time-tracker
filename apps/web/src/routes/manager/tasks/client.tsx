"use client";

import { useEffect, useState, useActionState, useOptimistic } from "react";
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
	Badge,
} from "@monorepo/design-system";
import { PageHeader } from "~/components/page-header";
import type { TaskType, TaskAssignment, Employee, Station } from "./types";
import { TaskAssignmentForm } from "./task-assignment-form";
import { TaskCompletionForm } from "./task-completion-form";
import { TaskSwitchForm } from "./task-switch-form";
import { TaskTypeForm } from "./task-type-form";

interface TaskManagerProps {
	taskTypes: TaskType[];
	activeAssignments: TaskAssignment[];
	employees: Employee[];
	stations: Station[];
	taskHistory: TaskAssignment[];
	assignTaskAction: (
		prevState: { error?: string | null; success?: boolean } | null,
		formData: FormData
	) => Promise<{
		assignment?: TaskAssignment;
		activeAssignments?: TaskAssignment[];
		error?: string | null;
		success?: boolean;
	}>;
	completeTaskAction: (
		prevState: { error?: string | null; success?: boolean } | null,
		formData: FormData
	) => Promise<{
		assignment?: TaskAssignment;
		activeAssignments?: TaskAssignment[];
		error?: string | null;
		success?: boolean;
	}>;
	switchTaskAction: (
		prevState: { error?: string | null; success?: boolean } | null,
		formData: FormData
	) => Promise<{
		assignment?: TaskAssignment;
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
	completeTaskAction,
	switchTaskAction,
	taskHistory,
}: TaskManagerProps) {
	const [activeTab, setActiveTab] = useState<"assignments" | "history" | "types">("assignments");
	const [showAssignForm, setShowAssignForm] = useState(false);
	const [showTaskTypeForm, setShowTaskTypeForm] = useState(false);
	
	// State for Complete/Switch Modals
	const [selectedAssignment, setSelectedAssignment] = useState<TaskAssignment | null>(null);
	const [activeModal, setActiveModal] = useState<"none" | "complete" | "switch">("none");

	const [assignState, assignAction, isAssignPending] = useActionState(assignTaskAction, null);
	
	const [completeState, completeAction, isCompletePending] = useActionState(completeTaskAction, null);
	const [switchState, switchAction, isSwitchPending] = useActionState(switchTaskAction, null);

	const [createTypeState, createTypeAction, isCreateTypePending] = useActionState(
		async (_prev: { error?: string | null; success?: boolean } | null, formData: FormData) => {
			const { createTaskTypeAction } = await import("./actions");
			return createTaskTypeAction(_prev, formData);
		},
		null
	);

	// Local state to maintain the list of assignments across server actions
	// This ensures updates "stick" after the optimistic period ends but before a full page reload
	const [localAssignments, setLocalAssignments] = useState(activeAssignments);

	// Sync with props if they change (e.g. from parent revalidation)
	useEffect(() => {
		setLocalAssignments(activeAssignments);
	}, [activeAssignments]);

	// Sync with action results
	useEffect(() => {
		if (assignState?.success && assignState.activeAssignments) {
			setLocalAssignments(assignState.activeAssignments);
		}
	}, [assignState]);

	useEffect(() => {
		if (completeState?.success && completeState.activeAssignments) {
			setLocalAssignments(completeState.activeAssignments);
		}
	}, [completeState]);

	useEffect(() => {
		if (switchState?.success && switchState.activeAssignments) {
			setLocalAssignments(switchState.activeAssignments);
		}
	}, [switchState]);
	
	const [optimisticAssignments, addOptimisticAssignment] = useOptimistic<
		TaskAssignment[],
		| { type: "add"; data: { employeeId: string; taskTypeId: string; notes?: string } }
		| { type: "complete"; data: { assignmentId: string } }
		| { type: "switch"; data: { employeeId: string; newTaskTypeId: string } }
	>(localAssignments, (current, action) => {
		if (action.type === "add") {
			const employee = employees.find((e) => e.id === action.data.employeeId);
			const taskType = taskTypes.find((t) => t.id === action.data.taskTypeId);

			if (!employee || !taskType) return current;

			const optimisticAssignment: TaskAssignment = {
				id: `optimistic-${Math.random().toString(36).slice(2, 9)}`,
				employeeId: employee.id,
				taskTypeId: taskType.id,
				notes: action.data.notes ?? null,
				startTime: new Date(),
				endTime: null,
				unitsCompleted: null,
				Employee: employee,
				TaskType: taskType,
			};

			return [optimisticAssignment, ...current];
		}

		if (action.type === "complete") {
			// Optimistically remove the completed assignment from the active list
			return current.filter(a => a.id !== action.data.assignmentId);
		}

		if (action.type === "switch") {
			// Remove old assignment for this employee
			// We MUST filter out the assignment by employeeId because the user might have clicked "Switch" 
			// on an assignment that was already optimistically updated (so ID matches) OR from server data (so ID matches)
			// But critically, a switch REPLACES the active task for that employee.
			// So we should remove ANY active task for this employee before adding the new one.
			const filtered = current.filter(a => a.employeeId !== action.data.employeeId);
			
			const employee = employees.find((e) => e.id === action.data.employeeId);
			const taskType = taskTypes.find((t) => t.id === action.data.newTaskTypeId);

			if (!employee || !taskType) return current;

			const optimisticAssignment: TaskAssignment = {
				id: `optimistic-switch-${Math.random().toString(36).slice(2, 9)}`,
				employeeId: employee.id,
				taskTypeId: taskType.id,
				notes: null,
				startTime: new Date(),
				endTime: null,
				unitsCompleted: null,
				Employee: employee,
				TaskType: taskType,
			};
			
			return [optimisticAssignment, ...filtered];
		}

		return current;
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
			<PageHeader
				title="Task Management"
				subtitle="Assign and track employee tasks"
				actions={
					<div className="flex space-x-2">
						<Button onClick={() => setShowAssignForm(true)} variant="primary">
							Assign Task
						</Button>
						<Button onClick={() => setShowTaskTypeForm(true)} variant="outline">
							Create Task Type
						</Button>
					</div>
				}
			/>

			{/* Summary Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<Card>
					<CardBody>
						<h3 className="font-heading text-xs uppercase tracking-wider text-muted-foreground mb-2">Active Tasks</h3>
						<p className="text-2xl font-mono tabular-nums">{optimisticAssignments.filter((a) => !a.endTime).length}</p>
						<p className="text-sm text-muted-foreground">In progress</p>
					</CardBody>
				</Card>

				<Card>
					<CardBody>
						<h3 className="font-heading text-xs uppercase tracking-wider text-muted-foreground mb-2">Task Types</h3>
						<p className="text-2xl font-mono tabular-nums">{taskTypes.length}</p>
						<p className="text-sm text-muted-foreground">Available</p>
					</CardBody>
				</Card>

				<Card>
					<CardBody>
						<h3 className="font-heading text-xs uppercase tracking-wider text-muted-foreground mb-2">Avg Duration</h3>
						<p className="text-2xl font-mono tabular-nums">
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
						<h3 className="font-heading text-xs uppercase tracking-wider text-muted-foreground mb-2">Completion Rate</h3>
						<p className="text-2xl font-mono tabular-nums">
							{optimisticAssignments.length > 0
								? Math.round(
										(optimisticAssignments.filter((a) => a.endTime).length /
											optimisticAssignments.length) *
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
						<CardHeader className="flex flex-row items-center justify-between">
							<CardTitle>Active Task Assignments</CardTitle>
							{optimisticAssignments.length > 0 && (
								<Button size="sm" onClick={() => setShowAssignForm(true)} variant="primary">
									Assign Task
								</Button>
							)}
						</CardHeader>
						<CardBody>
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
								{optimisticAssignments.map((assignment: TaskAssignment) => (
									<div
										key={assignment.id}
										className="group relative flex flex-col justify-between rounded-[2px] border border-border bg-card p-4 transition-all hover:border-primary/50"
									>
										{/* Header */}
										<div className="mb-4 flex items-start justify-between">
											<div className="space-y-1">
												<div className="flex items-center gap-2">
													<h4 className="font-heading text-sm font-bold uppercase tracking-tight text-foreground">
														{assignment.TaskType.name}
													</h4>
													{!assignment.endTime && (
														<span className="relative flex h-2 w-2">
															<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
															<span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
														</span>
													)}
												</div>
												<div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
													<span className="font-bold text-foreground">
														{assignment.Employee.name}
													</span>
													<span className="text-border">|</span>
													<span>{assignment.TaskType.Station.name}</span>
												</div>
											</div>
											{!assignment.endTime && (
												<Badge variant="success" className="font-mono text-[10px] uppercase">
													Active
												</Badge>
											)}
										</div>

										{/* Data Grid */}
										<div className="mb-4 grid grid-cols-2 gap-y-3 gap-x-2 border-y border-border/40 py-3 bg-muted/20 px-2 -mx-2">
											<div>
												<span className="block text-[10px] uppercase text-muted-foreground font-mono tracking-wider">
													Started
												</span>
												<span className="font-mono text-sm tabular-nums text-foreground">
													{new Date(assignment.startTime).toLocaleTimeString([], {
														hour: "2-digit",
														minute: "2-digit",
													})}
												</span>
											</div>
											<div>
												<span className="block text-[10px] uppercase text-muted-foreground font-mono tracking-wider">
													Duration
												</span>
												<span className="font-mono text-sm tabular-nums text-foreground">
													{formatDuration(assignment.startTime, assignment.endTime)}
												</span>
											</div>
											{assignment.unitsCompleted !== null && (
												<div className="col-span-2 pt-1 border-t border-border/40">
													<span className="block text-[10px] uppercase text-muted-foreground font-mono tracking-wider">
														Units Completed
													</span>
													<span className="font-mono text-sm tabular-nums text-foreground">
														{assignment.unitsCompleted}
													</span>
												</div>
											)}
										</div>

										{/* Actions */}
										<div className="mt-auto grid grid-cols-2 gap-2">
											{!assignment.endTime && (
												<>
													<Button
														size="sm"
														variant="outline"
														className="w-full text-xs"
														onClick={() => {
															setSelectedAssignment(assignment);
															setActiveModal("switch");
														}}
													>
														Switch
													</Button>
													<Button
														size="sm"
														variant="primary"
														className="w-full text-xs"
														onClick={() => {
															setSelectedAssignment(assignment);
															setActiveModal("complete");
														}}
													>
														Complete
													</Button>
												</>
											)}
										</div>
									</div>
								))}

							</div>

							{optimisticAssignments.length === 0 && (
								<div className="flex flex-col items-center justify-center rounded-[2px] border border-dashed border-border bg-muted/5 py-12 text-center">
									<div className="mb-3 rounded-full bg-muted/50 p-4">
										<div className="h-6 w-6 rounded-sm bg-foreground/20" />
									</div>
									<h3 className="mb-1 font-heading text-lg font-bold uppercase tracking-tight">
										No Active Tasks
									</h3>
									<p className="mb-6 font-mono text-sm text-muted-foreground">
										All stations are currently idle.
									</p>
									<Button onClick={() => setShowAssignForm(true)} variant="primary">
										Assign New Task
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
									<tr className="border-b border-border bg-muted/20 text-xs font-heading uppercase tracking-wider text-muted-foreground">
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
										{taskHistory.map((assignment: TaskAssignment) => {
												const duration =
													((assignment.endTime
														? new Date(assignment.endTime).getTime()
														: new Date().getTime()) -
														new Date(assignment.startTime).getTime()) /
													(1000 * 60);
												const efficiency =
													assignment.unitsCompleted && duration > 0
														? assignment.unitsCompleted / (duration / 60)
														: 0;

												return (
													<tr key={assignment.id} className="border-b border-border hover:bg-muted/50">
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

							{taskHistory.length === 0 && (
								<div className="text-center py-6">
									<p className="text-muted-foreground">No task history found</p>
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
									<div
										key={taskType.id}
										className="group relative flex flex-col justify-between rounded-[2px] border border-border bg-card p-4 transition-all hover:border-primary/50"
									>
										{/* Header */}
										<div className="mb-4 flex items-start justify-between">
											<div className="space-y-1">
												<h4 className="font-heading text-sm font-bold uppercase tracking-tight text-foreground">
													{taskType.name}
												</h4>
												<div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
													<span>Station:</span>
													<span className="font-bold text-foreground">
														{taskType.Station.name}
													</span>
												</div>
											</div>
											<Badge
												variant={taskType.isActive ? "success" : "secondary"}
												className="font-mono text-[10px] uppercase"
											>
												{taskType.isActive ? "Active" : "Inactive"}
											</Badge>
										</div>

										{/* Data/Details */}
										<div className="mb-4 min-h-[3rem] space-y-3 border-y border-border/40 bg-muted/20 py-3 px-2 -mx-2">
											{taskType.description ? (
												<p className="line-clamp-2 text-xs text-muted-foreground">
													{taskType.description}
												</p>
											) : (
												<p className="text-xs text-muted-foreground/50 italic">
													No description provided.
												</p>
											)}
											
											{taskType.estimatedMinutesPerUnit && (
												<div className="flex items-center justify-between border-t border-border/40 pt-2">
													<span className="text-[10px] uppercase text-muted-foreground font-mono tracking-wider">
														Est. Time / Unit
													</span>
													<span className="font-mono text-sm tabular-nums text-foreground">
														{taskType.estimatedMinutesPerUnit}m
													</span>
												</div>
											)}
										</div>

										{/* Actions */}
										<div className="mt-auto">
											<Button size="sm" variant="outline" className="w-full text-xs">
												Edit Configuration
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
					onOptimisticAssign={(data) => addOptimisticAssignment({ type: "add", data })}
					isPending={isAssignPending}
					state={assignState}
				/>
			)}

			{/* Task Completion Form Modal */}
			{activeModal === "complete" && selectedAssignment && (
				<TaskCompletionForm
					assignment={selectedAssignment}
					onClose={() => {
						setActiveModal("none");
						setSelectedAssignment(null);
					}}
					onSubmit={completeAction}
					onOptimisticComplete={(data) => addOptimisticAssignment({ type: "complete", data })}
					isPending={isCompletePending}
					state={completeState}
				/>
			)}

			{/* Task Switch Form Modal */}
			{activeModal === "switch" && selectedAssignment && (
				<TaskSwitchForm
					assignment={selectedAssignment}
					taskTypes={taskTypes}
					onClose={() => {
						setActiveModal("none");
						setSelectedAssignment(null);
					}}
					onSubmit={switchAction}
					onOptimisticSwitch={(data) => addOptimisticAssignment({ type: "switch", data })}
					isPending={isSwitchPending}
					state={switchState}
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
