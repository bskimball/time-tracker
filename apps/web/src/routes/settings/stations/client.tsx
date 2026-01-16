"use client";

import { useActionState, useOptimistic, useState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { addStation, deleteStation } from "../actions";
import type { Station } from "@prisma/client";
import { Button } from "@monorepo/design-system";
import { SimpleInput } from "@monorepo/design-system";
import { Alert } from "@monorepo/design-system";
import { Form } from "@monorepo/design-system";
import { Card, CardBody, CardHeader, CardTitle } from "@monorepo/design-system";

function SubmitButton({ children }: { children: React.ReactNode }) {
	const { pending } = useFormStatus();
	return (
		<Button type="submit" disabled={pending}>
			{pending ? "Processing..." : children}
		</Button>
	);
}

export function StationManagement({ stations: initialStations }: { stations: Station[] }) {
	const [addState, addAction] = useActionState(addStation, null);
	const [deleteState, deleteAction] = useActionState(deleteStation, null);

	// Track the current stations list in state
	const [stations, setStations] = useState<Station[]>(initialStations);

	// Update stations when either action completes with new data
	useEffect(() => {
		if (addState?.stations) {
			// eslint-disable-next-line react-hooks/set-state-in-effect
			setStations(addState.stations);
		}
	}, [addState]);

	useEffect(() => {
		if (deleteState?.stations) {
			// eslint-disable-next-line react-hooks/set-state-in-effect
			setStations(deleteState.stations);
		}
	}, [deleteState]);

	// Optimistic state for deleting stations
	const [optimisticStations, deleteOptimistically] = useOptimistic(
		stations,
		(state, stationId: string) => state.filter((station) => station.id !== stationId)
	);

	// Wrap delete action to include optimistic update
	async function handleDelete(formData: FormData) {
		const stationId = formData.get("id") as string;
		deleteOptimistically(stationId);
		deleteAction(formData);
	}

	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>Add New Station</CardTitle>
				</CardHeader>
				<CardBody>
					<Form action={addAction} className="flex flex-row gap-2">
						<SimpleInput
							name="name"
							placeholder="Station name (e.g., PACKING)"
							className="flex-1"
							aria-label="Station Name"
							required
						/>
						<SubmitButton>Add Station</SubmitButton>
					</Form>
					{addState?.error && (
						<Alert variant="error" className="relative mt-4">
							<div className="corner-card-tl corner-accent-sm corner-destructive" />
							<div className="corner-card-tr corner-accent-sm corner-destructive" />
							{addState.error}
						</Alert>
					)}
					{addState?.success && (
						<Alert variant="success" className="relative mt-4">
							<div className="corner-card-tl corner-accent-sm corner-success" />
							<div className="corner-card-tr corner-accent-sm corner-success" />
							Station added successfully!
						</Alert>
					)}
				</CardBody>
			</Card>

			<Card className="relative">
				<div className="corner-panel-tl corner-accent-sm corner-muted" />
				<CardHeader>
					<CardTitle>Current Stations</CardTitle>
				</CardHeader>
				<CardBody>
					{optimisticStations.length === 0 ? (
						<p>No stations found</p>
					) : (
						<div className="space-y-2">
							{optimisticStations.map((station) => (
								<div
									key={station.id}
									className="panel-shadow flex justify-between items-center border-2 border-border bg-muted p-4 rounded"
								>
									<span className="font-industrial text-lg uppercase tracking-wide">
										{station.name}
									</span>
									<Form action={handleDelete} className="inline">
										<input type="hidden" name="id" value={station.id} />
										<Button type="submit" variant="error" size="sm">
											Delete
										</Button>
									</Form>
								</div>
							))}
						</div>
					)}
					{deleteState?.error && (
						<Alert variant="error" className="relative mt-4">
							<div className="corner-card-tl corner-accent-sm corner-destructive" />
							<div className="corner-card-tr corner-accent-sm corner-destructive" />
							{deleteState.error}
						</Alert>
					)}
					{deleteState?.success && (
						<Alert variant="success" className="relative mt-4">
							<div className="corner-card-tl corner-accent-sm corner-success" />
							<div className="corner-card-tr corner-accent-sm corner-success" />
							Station deleted successfully!
						</Alert>
					)}
				</CardBody>
			</Card>
		</div>
	);
}
