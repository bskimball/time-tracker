"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { updateUserRole } from "../actions";
import type { User } from "@prisma/client";
import { Select } from "@monorepo/design-system";
import { Alert } from "@monorepo/design-system";
import { Card, CardBody, CardHeader, CardTitle } from "@monorepo/design-system";
import { Button } from "@monorepo/design-system";

const ROLES = [
	{ value: "ADMIN", label: "Admin" },
	{ value: "EXECUTIVE", label: "Executive" },
	{ value: "MANAGER", label: "Manager" },
	{ value: "WORKER", label: "Worker" },
];

function SubmitButton() {
	const { pending } = useFormStatus();
	return (
		<Button type="submit" size="sm" disabled={pending}>
			{pending ? "Updating..." : "Update"}
		</Button>
	);
}

export function UserManagement({ users }: { users: User[] }) {
	const [state, action] = useActionState(updateUserRole, null);

	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>User Management</CardTitle>
				</CardHeader>
				<CardBody>
					{users.length === 0 ? (
						<p>No users found</p>
					) : (
						<div className="space-y-4">
							{users.map((user) => (
								<div
									key={user.id}
									className="panel-shadow border-2 border-border bg-muted p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
								>
									<div>
										<p className="font-industrial text-lg font-semibold">
											{user.name || "Unnamed User"}
										</p>
										<p className="text-sm text-muted-foreground">{user.email}</p>
										<p className="text-xs text-muted-foreground mt-1">
											Role: <span className="font-mono font-bold">{user.role}</span>
										</p>
									</div>
									<form action={action} className="flex items-center gap-2 w-full md:w-auto">
										<input type="hidden" name="userId" value={user.id} />
										<div className="w-40">
											<Select
												name="role"
												options={ROLES}
												defaultValue={user.role}
												aria-label="User Role"
											/>
										</div>
										<SubmitButton />
									</form>
								</div>
							))}
						</div>
					)}
					{state?.error && (
						<Alert variant="error" className="mt-4">
							{state.error}
						</Alert>
					)}
					{state?.success && (
						<Alert variant="success" className="mt-4">
							Role updated successfully!
						</Alert>
					)}
				</CardBody>
			</Card>
		</div>
	);
}
