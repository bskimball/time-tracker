"use client";

import { useState } from "react";
import { Button, Input, Card, CardHeader, CardTitle, CardBody, Form } from "~/components/ds";

interface Station {
	id: string;
	name: string;
}

interface TaskTypeFormProps {
	stations: Station[];
	onClose: () => void;
	onSubmit: (data: any) => Promise<void>;
}

export function TaskTypeForm({ stations, onClose, onSubmit }: TaskTypeFormProps) {
	const [formData, setFormData] = useState({
		name: "",
		stationId: "",
		description: "",
		estimatedMinutesPerUnit: "",
	});
	const handleSubmit = async () => {
		try {
			await onSubmit({
				...formData,
				estimatedMinutesPerUnit: formData.estimatedMinutesPerUnit
					? parseFloat(formData.estimatedMinutesPerUnit)
					: null,
			});
		} catch (error) {
			console.error("Error creating task type:", error);
		}
	};

	return (
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
			<Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
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
							<Button type="submit" variant="primary">
								Create Task Type
							</Button>
						</div>
					</Form>
				</CardBody>
			</Card>
		</div>
	);
}
