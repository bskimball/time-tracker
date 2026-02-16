"use client";

import { useEffect, useState } from "react";
import {
	Badge,
	Button,
	Card,
	CardBody,
	CardHeader,
	CardTitle,
	Form,
	Input,
} from "@monorepo/design-system";
import type { TaskType } from "./types";

interface TaskTypeEditFormProps {
	taskType: TaskType;
	onClose: () => void;
	onSubmit: (formData: FormData) => void;
	isPending?: boolean;
	state?: { error?: string | null; success?: boolean } | null;
}

export function TaskTypeEditForm({
	taskType,
	onClose,
	onSubmit,
	isPending = false,
	state,
}: TaskTypeEditFormProps) {
	const [formData, setFormData] = useState({
		name: taskType.name,
		description: taskType.description ?? "",
		estimatedMinutesPerUnit: taskType.estimatedMinutesPerUnit
			? String(taskType.estimatedMinutesPerUnit)
			: "",
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
		fd.append("taskTypeId", taskType.id);
		fd.append("name", formData.name);
		fd.append("description", formData.description);
		fd.append("estimatedMinutesPerUnit", formData.estimatedMinutesPerUnit);
		onSubmit(fd);
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" aria-live="polite">
			<Card className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto">
				<CardHeader>
					<div className="flex items-center justify-between gap-2">
						<CardTitle>Edit Task Type</CardTitle>
						<Badge variant={taskType.isActive ? "success" : "secondary"} className="uppercase">
							{taskType.isActive ? "Active" : "Inactive"}
						</Badge>
					</div>
				</CardHeader>
				<CardBody>
					<Form onSubmit={handleSubmit} className="space-y-4">
						<div className="rounded-[2px] border border-border/60 bg-muted/10 px-3 py-2 text-xs">
							<p className="font-mono uppercase tracking-wide text-muted-foreground">Station</p>
							<p className="font-medium text-foreground">{taskType.Station.name}</p>
						</div>

						<Input
							label="Task Name"
							value={formData.name}
							onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
							required
						/>

						<Input
							label="Description"
							value={formData.description}
							onChange={(e) =>
								setFormData((prev) => ({ ...prev, description: e.target.value }))
							}
							placeholder="Optional description"
						/>

						<div>
							<Input
							label="Estimated Minutes Per Unit"
							type="number"
							step="0.1"
							min="0.1"
								value={formData.estimatedMinutesPerUnit}
								onChange={(e) =>
									setFormData((prev) => ({
										...prev,
										estimatedMinutesPerUnit: e.target.value,
									}))
								}
								placeholder="Optional"
							/>
							<p className="mt-1 text-xs text-muted-foreground">
								Used for productivity estimates and planning.
							</p>
						</div>

						{state?.error && <p className="text-sm text-error">{state.error}</p>}

						<div className="flex justify-end space-x-2 border-t pt-4">
							<Button type="button" variant="outline" onClick={onClose}>
								Cancel
							</Button>
							<Button type="submit" variant="primary" disabled={isPending}>
								{isPending ? "Saving..." : "Save Changes"}
							</Button>
						</div>
					</Form>
				</CardBody>
			</Card>
		</div>
	);
}
