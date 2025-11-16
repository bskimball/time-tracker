"use client";

import { useState } from "react";
import { Button, Input, Card, CardHeader, CardTitle, CardBody, Form } from "~/components/ds";
import type { Employee, TaskType, TaskAssignment } from "./types";

interface TaskAssignmentFormProps {
	employees: Employee[];
	taskTypes: TaskType[];
	activeAssignments: TaskAssignment[];
	onClose: () => void;
	onSubmit: (data: any) => Promise<void>;
}

export function TaskAssignmentForm({
	employees,
	taskTypes,
	activeAssignments,
	onClose,
	onSubmit,
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
	const handleSubmit = async () => {
		try {
			await onSubmit(formData);
		} catch (error) {
			console.error("Error assigning task:", error);
		}
	};

	return (
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
			<Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
				<CardHeader>
					<CardTitle>Assign Task</CardTitle>
				</CardHeader>
				<CardBody>
					<Form onSubmit={handleSubmit} className="space-y-4">
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
									.filter((emp) => !activeAssignments.some((a) => a.employeeId === emp.id && !a.endTime))
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
							<Button type="submit" variant="primary">
								Assign Task
							</Button>
						</div>
					</Form>
				</CardBody>
			</Card>
		</div>
	);
}
