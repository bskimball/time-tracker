"use client";

import { useActionState, useOptimistic, useState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { addStation, deleteStation } from "../actions";
import type { Station } from "@prisma/client";
import { Button } from "@monorepo/design-system";
import { Alert } from "@monorepo/design-system";
import { Form } from "@monorepo/design-system";
import { Card, CardBody, CardHeader, CardTitle } from "@monorepo/design-system";
import { Select } from "@monorepo/design-system";

function SubmitButton({
	children,
	disabled,
}: {
	children: React.ReactNode;
	disabled?: boolean;
}) {
	const { pending } = useFormStatus();
	return (
		<Button type="submit" disabled={pending || disabled}>
			{pending ? "Processing..." : children}
		</Button>
	);
}

export function StationManagement({
	stations: initialStations,
	availableStationNames,
}: {
	stations: Station[];
	availableStationNames: Station["name"][];
}) {
	const [addState, addAction] = useActionState(addStation, null);
	const [deleteState, deleteAction] = useActionState(deleteStation, null);
	const [newStationName, setNewStationName] = useState("");

	// Track the current stations list in state
	const [stations, setStations] = useState<Station[]>(initialStations);

	// Update stations when either action completes with new data
	useEffect(() => {
		if (addState?.stations) {
			// eslint-disable-next-line react-hooks/set-state-in-effect
			setStations(addState.stations);
		}
		if (addState?.success) {
			// eslint-disable-next-line react-hooks/set-state-in-effect
			setNewStationName("");
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

	const creatableStationNames = availableStationNames.filter(
		(stationName) => !stations.some((station) => station.name === stationName)
	);

	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>Add New Station</CardTitle>
				</CardHeader>
				<CardBody>
					<Form action={addAction} className="flex flex-row gap-2 items-end">
						<Select
							name="name"
							label="Station"
							options={creatableStationNames.map((stationName) => ({
								value: stationName,
								label: stationName,
							}))}
							value={newStationName}
							onChange={(value: string) => setNewStationName(value)}
							placeholder="Choose a station"
							containerClassName="flex-1"
							isDisabled={creatableStationNames.length === 0}
							isRequired
						/>
						<SubmitButton disabled={creatableStationNames.length === 0}>
							{creatableStationNames.length === 0 ? "All Stations Added" : "Add Station"}
						</SubmitButton>
					</Form>
					<p className="mt-2 text-xs text-muted-foreground">
						Station names are restricted to configured operational station types.
					</p>
					{addState?.error && (
						<Alert variant="error" className="relative mt-4">
							{addState.error}
						</Alert>
					)}
					{addState?.success && (
						<Alert variant="success" className="relative mt-4">
							Station added successfully!
						</Alert>
					)}
				</CardBody>
			</Card>

			<Card className="relative">
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
									className="panel-shadow shadow-industrial flex justify-between items-center border border-border bg-background p-4 rounded"
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
							{deleteState.error}
						</Alert>
					)}
					{deleteState?.success && (
						<Alert variant="success" className="relative mt-4">
							Station deleted successfully!
						</Alert>
					)}
				</CardBody>
			</Card>
		</div>
	);
}
