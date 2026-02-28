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

interface Station {
	id: string;
	name: string;
}

interface TaskTypeFormProps {
	stations: Station[];
	onClose: () => void;
	onSubmit: (formData: FormData) => void;
	isPending?: boolean;
	state?: { error?: string | null; success?: boolean } | null;
}

export function TaskTypeForm({
	stations,
	onClose,
	onSubmit,
	isPending = false,
	state,
}: TaskTypeFormProps) {
	const [formData, setFormData] = useState({
		name: "",
		stationId: "",
		description: "",
		estimatedMinutesPerUnit: "",
	});

	useEffect(() => {
		if (!state?.success) return;
		// Defer clear + close to avoid synchronous setState inside the effect body
		const id = window.setTimeout(() => {
			setFormData({
				name: "",
				stationId: "",
				description: "",
				estimatedMinutesPerUnit: "",
			});
			onClose();
		}, 0);
		return () => window.clearTimeout(id);
	}, [state?.success, onClose]);

	const handleSubmit = () => {
		const fd = new FormData();
		fd.append("name", formData.name);
		fd.append("stationId", formData.stationId);
		if (formData.description) {
			fd.append("description", formData.description);
		}
		if (formData.estimatedMinutesPerUnit) {
			fd.append("estimatedMinutesPerUnit", formData.estimatedMinutesPerUnit);
		}
		onSubmit(fd);
	};

	return (
		<div
			className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
			aria-live="polite"
		>
			<Card className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto">
				<CardHeader>
					<CardTitle>Task Type</CardTitle>
				</CardHeader>
				<CardBody>
					<Form onSubmit={handleSubmit} className="space-y-4">
						<div>
							<Input
								label="Task Name"
								value={formData.name}
								onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
								placeholder="e.g., Pick Small Items"
								required
							/>
						</div>

						<SimpleSelect
							label="Station"
							value={formData.stationId}
							onChange={(value) => setFormData((prev) => ({ ...prev, stationId: value ?? "" }))}
							options={stations.map((station) => ({ value: station.id, label: station.name }))}
							placeholder="Select a station…"
							isRequired
						/>

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

						{state?.error && <p className="text-sm text-error mt-2">{state.error}</p>}

						<div className="flex justify-end space-x-2 pt-4 border-t">
							<Button type="button" variant="outline" onClick={onClose}>
								Cancel
							</Button>
							<Button type="submit" variant="primary" disabled={isPending}>
								{isPending ? "Creating…" : "Create Task Type"}
							</Button>
						</div>
					</Form>
				</CardBody>
			</Card>
		</div>
	);
}
