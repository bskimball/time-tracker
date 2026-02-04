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
} from "@monorepo/design-system";
import type { TaskAssignment, TaskType } from "./types";

interface TaskSwitchFormProps {
	assignment: TaskAssignment;
	taskTypes: TaskType[];
	onClose: () => void;
	onSubmit: (formData: FormData) => void;
	onOptimisticSwitch?: (data: {
		employeeId: string;
		newTaskTypeId: string;
		reason?: string;
	}) => void;
	isPending?: boolean;
	state?: { error?: string | null; success?: boolean } | null;
}

export function TaskSwitchForm({
	assignment,
	taskTypes,
	onClose,
	onSubmit,
	onOptimisticSwitch,
	isPending = false,
	state,
}: TaskSwitchFormProps) {
	const [formData, setFormData] = useState<{
		taskTypeId: string;
		reason: string;
	}>({
		taskTypeId: "",
		reason: "",
	});

	useEffect(() => {
		if (!state?.success) return;
		const id = window.setTimeout(() => {
			onClose();
		}, 0);
		return () => window.clearTimeout(id);
	}, [state?.success, onClose]);

	const handleSubmit = () => {
		const fd = new FormData();
		fd.append("employeeId", assignment.employeeId);
		fd.append("newTaskTypeId", formData.taskTypeId);
		if (formData.reason) {
			fd.append("reason", formData.reason);
		}

		onOptimisticSwitch?.({
			employeeId: assignment.employeeId,
			newTaskTypeId: formData.taskTypeId,
			reason: formData.reason,
		});
		onSubmit(fd);
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
			<Card className="relative w-full max-h-[90vh] max-w-lg overflow-y-auto">
				<CardHeader>
					<CardTitle>Switch Task</CardTitle>
				</CardHeader>
				<CardBody>
					<Form onSubmit={handleSubmit} className="space-y-4">
						<div className="text-sm text-muted-foreground mb-4 p-3 bg-muted/20 rounded border border-border/50">
							<p>Employee: <span className="text-foreground font-medium">{assignment.Employee.name}</span></p>
							<p>Current Task: <span className="text-foreground font-medium">{assignment.TaskType.name}</span></p>
							<p className="text-xs mt-1">Switching will complete the current task and start a new one.</p>
						</div>

						<div>
							<label className="block text-sm font-medium mb-1">New Task Type</label>
							<select
								className="w-full px-3 py-2 bg-input-background text-foreground border border-input rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
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
							<Input
								label="Reason / Notes (optional)"
								value={formData.reason}
								onChange={(e) => setFormData((prev) => ({ ...prev, reason: e.target.value }))}
								placeholder="Why is this task being switched?"
							/>
						</div>

						{state?.error && <p className="mt-2 text-sm text-error">{state.error}</p>}

						<div className="flex justify-end space-x-2 border-t pt-4">
							<Button type="button" variant="outline" onClick={onClose}>
								Cancel
							</Button>
							<Button type="submit" variant="primary" disabled={isPending}>
								{isPending ? "Switching..." : "Switch Task"}
							</Button>
						</div>
					</Form>
				</CardBody>
			</Card>
		</div>
	);
}
