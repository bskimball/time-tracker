"use client";

import { useState } from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { addEmployee, updateEmployeePin, deleteEmployee } from "../actions";
import type { Employee } from "@prisma/client";
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

export function EmployeeManagement({ employees }: { employees: Employee[] }) {
	const [addState, addAction] = useActionState(addEmployee, null);
	const [deleteState, deleteAction] = useActionState(deleteEmployee, null);
	const [updatePinState, updatePinAction] = useActionState(updateEmployeePin, null);
	const [editingPinId, setEditingPinId] = useState<string | null>(null);

	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>Add New Employee</CardTitle>
				</CardHeader>
				<CardBody>
					<form action={addAction} className="space-y-4">
						<div>
							<label className="block text-sm font-medium mb-1">Name</label>
							<SimpleInput
								name="name"
								placeholder="Employee name"
								aria-label="Employee Name"
								required
							/>
						</div>
						<div>
							<label className="block text-sm font-medium mb-1">Email</label>
							<SimpleInput
								name="email"
								type="email"
								placeholder="Employee email"
								aria-label="Employee Email"
								required
							/>
						</div>
						<div>
							<label className="block text-sm font-medium mb-1">PIN (optional)</label>
							<SimpleInput
								name="pin"
								type="text"
								placeholder="4-6 digit PIN (optional)"
								aria-label="PIN"
								pattern="[0-9]{4,6}"
								maxLength={6}
							/>
						</div>
						<div className="flex justify-end">
							<SubmitButton>Add Employee</SubmitButton>
						</div>
					</form>
					{addState?.error && (
						<Alert variant="error" className="relative">
							{addState.error}
						</Alert>
					)}
					{addState?.success && (
						<Alert variant="success" className="relative">
							Employee added successfully!
						</Alert>
					)}
				</CardBody>
			</Card>

			<Card className="relative">
				<CardHeader>
					<CardTitle>Current Employees</CardTitle>
				</CardHeader>
				<CardBody>
					{employees.length === 0 ? (
						<p>No employees found</p>
					) : (
						<div className="space-y-2">
							{employees.map((employee) => (
								<div
									key={employee.id}
									className="panel-shadow shadow-industrial border border-border bg-background p-4"
								>
									<div className="flex justify-between items-center">
										<div>
											<p className="font-industrial text-lg font-semibold uppercase tracking-wide">
												{employee.name}
											</p>
											<p className="text-sm text-muted-foreground">{employee.email}</p>
											<p className="font-mono-industrial text-xs text-muted-foreground mt-1">
												{employee.pinHash ? "✓ PIN SET" : "⚠ NO PIN"}
											</p>
										</div>
										<div className="flex gap-2">
											<Button
												variant="ghost"
												size="sm"
												onPress={() =>
													setEditingPinId(editingPinId === employee.id ? null : employee.id)
												}
											>
												{editingPinId === employee.id ? "Cancel" : "Set PIN"}
											</Button>
											<form action={deleteAction} className="inline">
												<input type="hidden" name="id" value={employee.id} />
												<Button type="submit" variant="error" size="sm">
													Delete
												</Button>
											</form>
										</div>
									</div>
									{editingPinId === employee.id && (
										<form action={updatePinAction} className="mt-4 flex gap-2">
											<input type="hidden" name="id" value={employee.id} />
											<SimpleInput
												name="pin"
												placeholder="Enter 4-6 digit PIN"
												type="text"
												pattern="[0-9]{4,6}"
												maxLength={6}
												className="flex-1"
												aria-label="PIN"
												required
											/>
											<SubmitButton>Update PIN</SubmitButton>
										</form>
									)}
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
							Employee deleted successfully!
						</Alert>
					)}
					{updatePinState?.error && (
						<Alert variant="error" className="relative mt-4">
							{updatePinState.error}
						</Alert>
					)}
					{updatePinState?.success && (
						<Alert variant="success" className="relative mt-4">
							PIN updated successfully!
						</Alert>
					)}
				</CardBody>
			</Card>
		</div>
	);
}
