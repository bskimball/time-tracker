"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { updateUserRole, addUser, deleteUser } from "../actions";
import type { User } from "@prisma/client";
import { Select } from "@monorepo/design-system";
import { Alert } from "@monorepo/design-system";
import { Card, CardBody, CardHeader, CardTitle } from "@monorepo/design-system";
import { Button } from "@monorepo/design-system";
import { Input } from "@monorepo/design-system";

const ROLES = [
	{ value: "ADMIN", label: "Admin" },
	{ value: "EXECUTIVE", label: "Executive" },
	{ value: "MANAGER", label: "Manager" },
];

function SubmitButton() {
	const { pending } = useFormStatus();
	return (
		<Button
			type="submit"
			variant="secondary"
			disabled={pending}
			className="w-full sm:w-auto shrink-0"
		>
			{pending ? "Updating..." : "Update"}
		</Button>
	);
}

function AddUserForm() {
	const [state, action] = useActionState(addUser, null);

	return (
		<Card>
			<CardHeader>
				<CardTitle>Add New User</CardTitle>
			</CardHeader>
			<CardBody>
				<form action={action} className="space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<Input name="email" label="Email" type="email" required />
						<Input name="name" label="Name" />
						<Select name="role" label="Role" options={ROLES} defaultValue="MANAGER" />
					</div>
					<div className="flex justify-end">
						<SubmitButtonAdd />
					</div>
					{state?.error && <Alert variant="error">{state.error}</Alert>}
					{state?.success && <Alert variant="success">User added successfully!</Alert>}
				</form>
			</CardBody>
		</Card>
	);
}

function SubmitButtonAdd() {
	const { pending } = useFormStatus();
	return (
		<Button type="submit" disabled={pending} variant="primary">
			{pending ? "Adding..." : "Add User"}
		</Button>
	);
}

export function UserManagement({ users }: { users: User[] }) {
	const [state, action] = useActionState(updateUserRole, null);
	const [deleteState, deleteAction] = useActionState(deleteUser, null);

	return (
		<div className="space-y-6">
			<AddUserForm />
			<Card>
				<CardHeader>
					<CardTitle>User Management</CardTitle>
				</CardHeader>
				<CardBody>
					{users.length === 0 ? (
						<p>No users found</p>
					) : (
						<div className="space-y-4">
							{users.map((user) => {
								const isManagedRole = ROLES.some((role) => role.value === user.role);

								return (
									<div
										key={user.id}
										className="panel-shadow shadow-industrial border border-border bg-background p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
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
										<div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:gap-4 md:w-auto">
											{isManagedRole ? (
												<form
													action={action}
													className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto"
												>
													<input type="hidden" name="userId" value={user.id} />
													<div className="w-full sm:w-40 shrink-0">
														<Select
															name="role"
															options={ROLES}
															defaultValue={user.role}
															aria-label="User Role"
														/>
													</div>
													<SubmitButton />
												</form>
											) : (
												<div className="flex items-center justify-center sm:justify-start w-full sm:w-auto h-10 px-3 bg-muted/20 border border-border/40 text-xs text-muted-foreground font-mono shrink-0">
													Legacy role (read-only)
												</div>
											)}
											<div className="hidden sm:block w-px h-8 bg-border/40"></div>
											<form action={deleteAction} className="flex w-full sm:w-auto">
												<input type="hidden" name="userId" value={user.id} />
												<Button type="submit" variant="error" className="w-full sm:w-auto shrink-0">
													Delete User
												</Button>
											</form>
										</div>
									</div>
								);
							})}
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
					{deleteState?.error && (
						<Alert variant="error" className="mt-4">
							{deleteState.error}
						</Alert>
					)}
					{deleteState?.success && (
						<Alert variant="success" className="mt-4">
							User deleted successfully!
						</Alert>
					)}
				</CardBody>
			</Card>
		</div>
	);
}
