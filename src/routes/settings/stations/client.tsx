"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { addStation, deleteStation } from "../actions";
import type { Station } from "@prisma/client";
import { Button } from "~/components/ds/button";
import { SimpleInput } from "~/components/ds/input";
import { Alert } from "~/components/ds/alert";
import { Card, CardBody, CardHeader, CardTitle } from "~/components/ds/card";

function SubmitButton({ children }: { children: React.ReactNode }) {
	const { pending } = useFormStatus();
	return (
		<Button type="submit" disabled={pending}>
			{pending ? "Processing..." : children}
		</Button>
	);
}

export function StationManagement({ stations }: { stations: Station[] }) {
	const [addState, addAction] = useActionState(addStation, null);
	const [deleteState, deleteAction] = useActionState(deleteStation, null);

	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>Add New Station</CardTitle>
				</CardHeader>
				<CardBody>
					<form action={addAction} className="flex gap-2">
						<SimpleInput
							name="name"
							placeholder="Station name (e.g., PACKING)"
							className="flex-1"
							aria-label="Station Name"
							required
						/>
						<SubmitButton>Add Station</SubmitButton>
					</form>
					{addState?.error && (
						<Alert variant="error" className="mt-4">
							{addState.error}
						</Alert>
					)}
					{addState?.success && (
						<Alert variant="success" className="mt-4">
							Station added successfully!
						</Alert>
					)}
				</CardBody>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Current Stations</CardTitle>
				</CardHeader>
				<CardBody>
					{stations.length === 0 ? (
						<p>No stations found</p>
					) : (
						<div className="space-y-2">
							{stations.map((station) => (
								<div
									key={station.id}
									className="panel-shadow flex justify-between items-center border-2 border-border bg-muted p-4"
								>
									<span className="font-industrial text-lg uppercase tracking-wide">
										{station.name}
									</span>
									<form action={deleteAction} className="inline">
										<input type="hidden" name="id" value={station.id} />
										<Button type="submit" variant="error" size="sm">
											Delete
										</Button>
									</form>
								</div>
							))}
						</div>
					)}
					{deleteState?.error && (
						<Alert variant="error" className="mt-4">
							{deleteState.error}
						</Alert>
					)}
					{deleteState?.success && (
						<Alert variant="success" className="mt-4">
							Station deleted successfully!
						</Alert>
					)}
				</CardBody>
			</Card>
		</div>
	);
}
