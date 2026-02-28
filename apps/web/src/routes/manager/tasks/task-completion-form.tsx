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
import type { TaskAssignment } from "./types";

interface TaskCompletionFormProps {
	assignment: TaskAssignment;
	onClose: () => void;
	onSubmit: (formData: FormData) => void;
	onOptimisticComplete?: (data: {
		assignmentId: string;
		unitsCompleted?: number;
		notes?: string;
	}) => void;
	isPending?: boolean;
	state?: { error?: string | null; success?: boolean } | null;
}

export function TaskCompletionForm({
	assignment,
	onClose,
	onSubmit,
	onOptimisticComplete,
	isPending = false,
	state,
}: TaskCompletionFormProps) {
	const [formData, setFormData] = useState<{
		unitsCompleted: string;
		notes: string;
	}>({
		unitsCompleted: "",
		notes: "",
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
		fd.append("taskId", assignment.id);
		if (formData.unitsCompleted) {
			fd.append("unitsCompleted", formData.unitsCompleted);
		}
		if (formData.notes) {
			fd.append("notes", formData.notes);
		}

		onOptimisticComplete?.({
			assignmentId: assignment.id,
			unitsCompleted: formData.unitsCompleted ? Number(formData.unitsCompleted) : undefined,
			notes: formData.notes,
		});
		onSubmit(fd);
	};

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
			aria-live="polite"
		>
			<Card className="relative w-full max-h-[90vh] max-w-lg overflow-y-auto">
				<CardHeader>
					<CardTitle>Complete Task: {assignment.TaskType.name}</CardTitle>
				</CardHeader>
				<CardBody>
					<Form onSubmit={handleSubmit} className="space-y-4">
						<div className="text-sm text-muted-foreground mb-4">
							<p>
								Employee:{" "}
								<span className="text-foreground font-medium">{assignment.Employee.name}</span>
							</p>
							<p>
								Started:{" "}
								<span className="text-foreground font-medium">
									{new Date(assignment.startTime).toLocaleTimeString()}
								</span>
							</p>
						</div>

						<div>
							<Input
								label="Units Completed"
								type="number"
								min="0"
								value={formData.unitsCompleted}
								onChange={(e) =>
									setFormData((prev) => ({ ...prev, unitsCompleted: e.target.value }))
								}
								placeholder="0"
							/>
							{assignment.TaskType.estimatedMinutesPerUnit && (
								<p className="text-xs text-muted-foreground mt-1">
									Est. time per unit: {assignment.TaskType.estimatedMinutesPerUnit}m
								</p>
							)}
						</div>

						<div>
							<Input
								label="Notes (optional)"
								value={formData.notes}
								onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
								placeholder="Any comments on the task completion…"
							/>
						</div>

						{state?.error && <p className="mt-2 text-sm text-error">{state.error}</p>}

						<div className="flex justify-end space-x-2 border-t pt-4">
							<Button type="button" variant="outline" onClick={onClose}>
								Cancel
							</Button>
							<Button type="submit" variant="primary" disabled={isPending}>
								{isPending ? "Completing…" : "Complete Task"}
							</Button>
						</div>
					</Form>
				</CardBody>
			</Card>
		</div>
	);
}
