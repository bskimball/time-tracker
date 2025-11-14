"use client";

import { useState } from "react";
import {
	Button,
	Input,
	Card,
	CardHeader,
	CardTitle,
	CardBody,
	Tabs,
	TabList,
	Tab,
} from "~/components/ds";

type TaskType = {
	id: string;
	name: string;
	stationId: string;
	description: string | null;
	estimatedMinutesPerUnit: number | null;
	isActive: boolean;
	Station: { id: string; name: string };
};

type TaskAssignment = {
	id: string;
	employeeId: string;
	taskTypeId: string;
	startTime: Date;
	endTime: Date | null;
	unitsCompleted: number | null;
	notes: string | null;
	Employee: {
		id: string;
		name: string;
		email: string;
		defaultStation?: { id: string; name: string } | null;
	};
	TaskType: TaskType;
};

type Employee = {
	id: string;
	name: string;
	email: string;
	defaultStation?: { id: string; name: string } | null;
};

type Station = {
	id: string;
	name: string;
};

interface TaskManagerProps {
	taskTypes: TaskType[];
	activeAssignments: TaskAssignment[];
	employees: Employee[];
	stations: Station[];
}

export function TaskManager({
	taskTypes,
	activeAssignments,
	employees,
	stations,
}: TaskManagerProps) {
	const [activeTab, setActiveTab] = useState("assignments");
	const [showAssignForm, setShowAssignForm] = useState(false);
	const [showTaskTypeForm, setShowTaskTypeForm] = useState(false);

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
						<p className="text-2xl">{activeAssignments.filter((a) => !a.endTime).length}</p>
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
							{activeAssignments.length > 0
								? Math.round(
										activeAssignments
											.filter((a) => a.endTime)
											.reduce((total, a) => {
												const duration =
													new Date(a.endTime!).getTime() - new Date(a.startTime).getTime();
												return total + duration;
											}, 0) /
											(1000 * 60 * 60 * activeAssignments.filter((a) => a.endTime).length)
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
							{activeAssignments.length > 0
								? Math.round(
										(activeAssignments.filter((a) => a.endTime).length / activeAssignments.length) *
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
			<Tabs>
				<TabList>
					<Tab isActive={activeTab === "assignments"} onClick={() => setActiveTab("assignments")}>
						Active Assignments
					</Tab>
					<Tab isActive={activeTab === "history"} onClick={() => setActiveTab("history")}>
						Task History
					</Tab>
					<Tab isActive={activeTab === "types"} onClick={() => setActiveTab("types")}>
						Task Types
					</Tab>
				</TabList>
			</Tabs>

			{/* Active Assignments Tab */}
			{activeTab === "assignments" && (
				<Card>
					<CardHeader>
						<CardTitle>Active Task Assignments</CardTitle>
					</CardHeader>
					<CardBody>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							{activeAssignments.map((assignment) => (
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

						{activeAssignments.length === 0 && (
							<div className="text-center py-8">
								<p className="text-muted-foreground">No active task assignments</p>
								<Button onClick={() => setShowAssignForm(true)} variant="primary" className="mt-4">
									Assign First Task
								</Button>
							</div>
						)}
					</CardBody>
				</Card>
			)}

			{/* Task Types Tab */}
			{activeTab === "types" && (
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
												className={`px-2 py-1 text-xs rounded ${
													taskType.isActive
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
			)}

			{/* Task History Tab */}
			{activeTab === "history" && (
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
									{activeAssignments
										.filter((a) => a.endTime)
										.map((assignment) => {
											const duration =
												(new Date(assignment.endTime!).getTime() -
													new Date(assignment.startTime).getTime()) /
												(1000 * 60);
											const efficiency =
												assignment.unitsCompleted && duration > 0
													? assignment.unitsCompleted / (duration / 60) // units per hour
													: 0;

											return (
												<tr key={assignment.id} className="border-b hover:bg-muted/50">
													<td className="p-4">{assignment.Employee.name}</td>
													<td className="p-4">{assignment.TaskType.name}</td>
													<td className="p-4">{assignment.TaskType.Station.name}</td>
													<td className="p-4">{new Date(assignment.startTime).toLocaleString()}</td>
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

						{activeAssignments.filter((a) => a.endTime).length === 0 && (
							<div className="text-center py-8">
								<p className="text-muted-foreground">No completed tasks found</p>
							</div>
						)}
					</CardBody>
				</Card>
			)}

			{/* Task Assignment Form Modal */}
			{showAssignForm && (
				<TaskAssignmentForm
					employees={employees}
					taskTypes={taskTypes}
					onClose={() => setShowAssignForm(false)}
					onSubmit={async (data) => {
						// Handle task assignment
						console.log("Assigning task:", data);
						setShowAssignForm(false);
					}}
				/>
			)}

			{/* Task Type Form Modal */}
			{showTaskTypeForm && (
				<TaskTypeForm
					stations={stations}
					onClose={() => setShowTaskTypeForm(false)}
					onSubmit={async (data) => {
						// Handle task type creation
						console.log("Creating task type:", data);
						setShowTaskTypeForm(false);
					}}
				/>
			)}
		</div>
	);
}

// Task Assignment Form Component
function TaskAssignmentForm({
	employees,
	taskTypes,
	onClose,
	onSubmit,
}: {
	employees: Employee[];
	taskTypes: TaskType[];
	onClose: () => void;
	onSubmit: (data: any) => Promise<void>;
}) {
	const [formData, setFormData] = useState<{
		employeeId: string;
		taskTypeId: string;
		priority: "LOW" | "MEDIUM" | "HIGH";
		notes: string;
	}>({
		employeeId: "",
		taskTypeId: "",
		priority: "MEDIUM",
		notes: "",
	});
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			await onSubmit(formData);
		} catch (error) {
			console.error("Error assigning task:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
			<Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
				<CardHeader>
					<CardTitle>Assign Task</CardTitle>
				</CardHeader>
				<CardBody>
					<form onSubmit={handleSubmit} className="space-y-4">
						<div>
							<label className="block text-sm font-medium mb-1">Employee</label>
							<select
								className="w-full px-3 py-2 bg-background text-foreground border rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
								value={formData.employeeId}
								onChange={(e) => setFormData((prev) => ({ ...prev, employeeId: e.target.value }))}
								required
							>
								<option value="">Select an employee</option>
								{employees
									.filter(
										(emp) => !activeAssignments.some((a) => a.employeeId === emp.id && !a.endTime)
									)
									.map((employee) => (
										<option key={employee.id} value={employee.id}>
											{employee.name}
										</option>
									))}
							</select>
						</div>

						<div>
							<label className="block text-sm font-medium mb-1">Task Type</label>
							<select
								className="w-full px-3 py-2 bg-background text-foreground border rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
								value={formData.taskTypeId}
								onChange={(e) => setFormData((prev) => ({ ...prev, taskTypeId: e.target.value }))}
								required
							>
								<option value="">Select a task type</option>
								{taskTypes.map((taskType) => (
									<option key={taskType.id} value={taskType.id}>
										{taskType.name} - {taskType.Station.name}
									</option>
								))}
							</select>
						</div>

						<div>
							<label className="block text-sm font-medium mb-1">Priority</label>
							<select
								className="w-full px-3 py-2 bg-background text-foreground border rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
								value={formData.priority}
								onChange={(e) =>
									setFormData((prev) => ({
										...prev,
										priority: e.target.value as "LOW" | "MEDIUM" | "HIGH",
									}))
								}
							>
								<option value="LOW">Low</option>
								<option value="MEDIUM">Medium</option>
								<option value="HIGH">High</option>
							</select>
						</div>

						<div>
							<Input
								label="Notes (optional)"
								value={formData.notes}
								onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
								placeholder="Additional instructions or context"
							/>
						</div>

						<div className="flex justify-end space-x-2 pt-4 border-t">
							<Button type="button" variant="outline" onClick={onClose}>
								Cancel
							</Button>
							<Button type="submit" variant="primary" disabled={isSubmitting}>
								{isSubmitting ? "Assigning..." : "Assign Task"}
							</Button>
						</div>
					</form>
				</CardBody>
			</Card>
		</div>
	);
}

// Task Type Form Component
function TaskTypeForm({
	stations,
	onClose,
	onSubmit,
}: {
	stations: Station[];
	onClose: () => void;
	onSubmit: (data: any) => Promise<void>;
}) {
	const [formData, setFormData] = useState({
		name: "",
		stationId: "",
		description: "",
		estimatedMinutesPerUnit: "",
	});
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			await onSubmit({
				...formData,
				estimatedMinutesPerUnit: formData.estimatedMinutesPerUnit
					? parseFloat(formData.estimatedMinutesPerUnit)
					: null,
			});
		} catch (error) {
			console.error("Error creating task type:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
			<Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
				<CardHeader>
					<CardTitle>Task Type</CardTitle>
				</CardHeader>
				<CardBody>
					<form onSubmit={handleSubmit} className="space-y-4">
						<div>
							<Input
								label="Task Name"
								value={formData.name}
								onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
								placeholder="e.g., Pick Small Items"
								required
							/>
						</div>

						<div>
							<label className="block text-sm font-medium mb-1">Station</label>
							<select
								className="w-full px-3 py-2 bg-background text-foreground border rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
								value={formData.stationId}
								onChange={(e) => setFormData((prev) => ({ ...prev, stationId: e.target.value }))}
								required
							>
								<option value="">Select a station</option>
								{stations.map((station) => (
									<option key={station.id} value={station.id}>
										{station.name}
									</option>
								))}
							</select>
						</div>

						<div>
							<Input
								label="Description"
								value={formData.description}
								onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
								placeholder="Details about this task type"
							/>
						</div>

						<div>
							<Input
								label="Estimated Minutes Per Unit"
								type="number"
								step="0.1"
								min="0"
								value={formData.estimatedMinutesPerUnit}
								onChange={(e) =>
									setFormData((prev) => ({ ...prev, estimatedMinutesPerUnit: e.target.value }))
								}
								placeholder="e.g., 2.5"
							/>
							<p className="text-xs text-muted-foreground mt-1">
								For productivity calculations (optional)
							</p>
						</div>

						<div className="flex justify-end space-x-2 pt-4 border-t">
							<Button type="button" variant="outline" onClick={onClose}>
								Cancel
							</Button>
							<Button type="submit" variant="primary" disabled={isSubmitting}>
								{isSubmitting ? "Creating..." : "Create Task Type"}
							</Button>
						</div>
					</form>
				</CardBody>
			</Card>
		</div>
	);
}

// Helper to check active assignments (in real implementation, this would be managed through state)
const activeAssignments: TaskAssignment[] = [];
