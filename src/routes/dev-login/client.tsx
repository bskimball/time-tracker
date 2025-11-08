"use client";

import { useFormState, useFormStatus } from "react-dom";
import { createAdminUser, type DevLoginState } from "./actions";
import { Card, CardBody, CardHeader, CardTitle } from "~/components/ds/card";
import { Alert } from "~/components/ds/alert";
import { Button } from "~/components/ds/button";
import { SimpleInput } from "~/components/ds/input";

function SubmitButton() {
	const { pending } = useFormStatus();
	return (
		<Button type="submit" disabled={pending}>
			{pending ? "Creating..." : "Create Admin"}
		</Button>
	);
}

export function CreateAdminForm() {
	const [state, formAction] = useFormState<DevLoginState, FormData>(
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		createAdminUser as any,
		{}
	);

	return (
		<Card>
			<CardHeader>
				<CardTitle>Create Admin User</CardTitle>
			</CardHeader>
			<CardBody>
				<form action={formAction} className="space-y-4">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
						<SimpleInput type="text" name="name" placeholder="Admin Name" required />
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
						<SimpleInput type="email" name="email" placeholder="admin@example.com" required />
					</div>
					{state.error && <Alert variant="error">{state.error}</Alert>}
					<SubmitButton />
				</form>
			</CardBody>
		</Card>
	);
}

export function LoginSubmitButton() {
	const { pending } = useFormStatus();
	return (
		<Button type="submit" size="sm" disabled={pending}>
			{pending ? "Logging in..." : "Login as User"}
		</Button>
	);
}
