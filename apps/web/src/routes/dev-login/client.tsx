"use client";

import { useFormState, useFormStatus } from "react-dom";
import { createAdminUser, type DevLoginState } from "./actions";
import { Alert } from "@monorepo/design-system";
import { Button } from "@monorepo/design-system";
import { SimpleInput } from "@monorepo/design-system";

export function CreateAdminForm() {
	const [state, formAction] = useFormState<DevLoginState, FormData>(
		// Type assertion needed because server actions can return Response for redirects,
		// but useFormState types don't reflect this capability yet
		createAdminUser as (state: DevLoginState, payload: FormData) => Promise<DevLoginState>,
		{}
	);

	return (
		<div className="space-y-4">
			<h2 className="text-xl font-bold font-industrial uppercase tracking-wide">
				Create Admin User
			</h2>
			<form action={formAction} className="space-y-4">
				<div>
					<label className="block text-sm font-medium mb-1">Name</label>
					<SimpleInput type="text" name="name" placeholder="Admin Name" required />
				</div>
				<div>
					<label className="block text-sm font-medium mb-1">Email</label>
					<SimpleInput type="email" name="email" placeholder="admin@example.com" required />
				</div>
				{state.error && <Alert variant="error">{state.error}</Alert>}
				<SubmitButton />
			</form>
		</div>
	);
}

function SubmitButton() {
	const { pending } = useFormStatus();
	return (
		<Button type="submit" disabled={pending}>
			{pending ? "Creating..." : "Create Admin"}
		</Button>
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
