"use client";

import { useEffect, useState } from "react";
import {
	Button,
	Input,
	Card,
	CardHeader,
	CardTitle,
	CardBody,
	Form,
	SimpleSelect,
} from "@monorepo/design-system";
import type { Employee, TaskType, TaskAssignment } from "./types";

interface TaskAssignmentFormProps {
	employees: Employee[];
	taskTypes: TaskType[];
	activeAssignments: TaskAssignment[];
	onClose: () => void;
	onSubmit: (formData: FormData) => void;
	onOptimisticAssign?: (data: {
		employeeId: string;
		taskTypeId: string;
		priority: "LOW" | "MEDIUM" | "HIGH";
		notes?: string;
	}) => void;
	isPending?: boolean;
	state?: { error?: string | null; success?: boolean; activeAssignments?: TaskAssignment[] } | null;
}

export function TaskAssignmentForm({
	employees,
	taskTypes,
	activeAssignments,
	onClose,
	onSubmit,
	onOptimisticAssign,
	isPending = false,
	state,
}: TaskAssignmentFormProps) {
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
	useEffect(() => {
		if (!state?.success) return;
		// Schedule reset and close after paint to avoid synchronous setState inside effect
		const id = window.setTimeout(() => {
			setFormData({
				employeeId: "",
				taskTypeId: "",
				priority: "MEDIUM",
				notes: "",
			});
			onClose();
		}, 0);
		return () => window.clearTimeout(id);
	}, [state?.success, onClose]);

	const handleSubmit = () => {
		const fd = new FormData();
		fd.append("employeeId", formData.employeeId);
		fd.append("taskTypeId", formData.taskTypeId);
		fd.append("priority", formData.priority);
		if (formData.notes) {
			fd.append("notes", formData.notes);
		}
		onOptimisticAssign?.({
			employeeId: formData.employeeId,
			taskTypeId: formData.taskTypeId,
			priority: formData.priority,
			notes: formData.notes || undefined,
		});
		onSubmit(fd);
	};

	return (
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" aria-live="polite">
			<Card className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto">
				<CardHeader>
					<CardTitle>Assign Task</CardTitle>
				</CardHeader>
				<CardBody>
					<Form onSubmit={handleSubmit} className="space-y-4">
						<SimpleSelect
							label="Employee"
							value={formData.employeeId}
							onChange={(value) => setFormData((prev) => ({ ...prev, employeeId: value ?? "" }))}
							options={employees
								.filter((emp) => !activeAssignments.some((a) => a.employeeId === emp.id && !a.endTime))
								.map((employee) => ({ value: employee.id, label: employee.name }))}
							placeholder="Select an employee…"
							isRequired
						/>

						<SimpleSelect
							label="Task Type"
							value={formData.taskTypeId}
							onChange={(value) => setFormData((prev) => ({ ...prev, taskTypeId: value ?? "" }))}
							options={taskTypes.map((taskType) => ({
								value: taskType.id,
								label: `${taskType.name} - ${taskType.Station.name}`,
							}))}
							placeholder="Select a task type…"
							isRequired
						/>

						<SimpleSelect
							label="Priority"
							value={formData.priority}
							onChange={(value) =>
								setFormData((prev) => ({
									...prev,
									priority: (value as "LOW" | "MEDIUM" | "HIGH") ?? "MEDIUM",
								}))
							}
							options={[
								{ value: "LOW", label: "Low" },
								{ value: "MEDIUM", label: "Medium" },
								{ value: "HIGH", label: "High" },
							]}
						/>

						<div>
							<Input
								label="Notes (optional)"
								value={formData.notes}
								onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
								placeholder="Additional instructions or context"
							/>
						</div>

						{state?.error && <p className="text-sm text-error mt-2">{state.error}</p>}

						<div className="flex justify-end space-x-2 pt-4 border-t">
							<Button type="button" variant="outline" onClick={onClose}>
								Cancel
							</Button>
							<Button type="submit" variant="primary" disabled={isPending}>
								{isPending ? "Assigning…" : "Assign Task"}
							</Button>
						</div>
					</Form>
				</CardBody>
			</Card>
		</div>
	);
}
