"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { addApiKey, deleteApiKey } from "../actions";
import type { ApiKey } from "@prisma/client";
import { Button } from "@monorepo/design-system";
import { SimpleInput } from "@monorepo/design-system";
import { Alert } from "@monorepo/design-system";
import { Card, CardBody, CardHeader, CardTitle } from "@monorepo/design-system";

function SubmitButton({ children }: { children: React.ReactNode }) {
	const { pending } = useFormStatus();
	return (
		<Button type="submit" disabled={pending}>
			{pending ? "Processing..." : children}
		</Button>
	);
}

export function ApiKeyManagement({ apiKeys }: { apiKeys: ApiKey[] }) {
	const [addState, addAction] = useActionState(addApiKey, null);
	const [deleteState, deleteAction] = useActionState(deleteApiKey, null);

	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>Create New API Key</CardTitle>
				</CardHeader>
				<CardBody>
					<form action={addAction} className="flex gap-2">
						<SimpleInput
							name="name"
							placeholder="Key name (e.g., Integration X)"
							className="flex-1"
							aria-label="Key Name"
							required
						/>
						<SubmitButton>Generate Key</SubmitButton>
					</form>
					{addState?.error && (
						<Alert variant="error" className="relative mt-4">
							{addState.error}
						</Alert>
					)}
					{addState?.success && (
						<Alert variant="success" className="relative mt-4">
							API Key generated successfully!
						</Alert>
					)}
				</CardBody>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Your API Keys</CardTitle>
				</CardHeader>
				<CardBody>
					{apiKeys.length === 0 ? (
						<p>No API keys found</p>
					) : (
						<div className="space-y-4">
							{apiKeys.map((key) => (
								<div key={key.id} className="panel-shadow border-2 border-border bg-muted p-4">
									<div className="flex justify-between items-start">
										<div className="space-y-1 overflow-hidden">
											<p className="font-industrial text-lg font-semibold uppercase tracking-wide">
												{key.name}
											</p>
											<div className="bg-background p-2 border border-border rounded font-mono text-sm break-all">
												{key.key}
											</div>
											<p className="text-xs text-muted-foreground">
												Created: {new Date(key.createdAt).toLocaleDateString()}
											</p>
										</div>
										<form action={deleteAction} className="ml-4 shrink-0">
											<input type="hidden" name="id" value={key.id} />
											<Button type="submit" variant="error" size="sm">
												Revoke
											</Button>
										</form>
									</div>
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
							API Key revoked successfully!
						</Alert>
					)}
				</CardBody>
			</Card>
		</div>
	);
}
