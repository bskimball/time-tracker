"use client";

import React, { useState } from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useSearchParams } from "react-router";
import {
	addStation,
	deleteStation,
	addEmployee,
	updateEmployeePin,
	deleteEmployee,
} from "./actions";
import type { Employee, Station } from "@prisma/client";
import { Button } from "~/components/ds/button";
import { SimpleInput } from "~/components/ds/input";
import { Alert } from "~/components/ds/alert";
import { Card, CardBody, CardHeader, CardTitle } from "~/components/ds/card";
import { Tabs, TabList, Tab, TabPanel } from "~/components/ds";

function SubmitButton({ children }: { children: React.ReactNode }) {
	const { pending } = useFormStatus();
	return (
		<Button type="submit" disabled={pending}>
			{pending ? "Processing..." : children}
		</Button>
	);
}

function StationManagement({ stations }: { stations: Station[] }) {
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
									<span className="font-industrial text-lg uppercase tracking-wide">{station.name}</span>
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

function EmployeeManagement({ employees }: { employees: Employee[] }) {
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
					{addState?.error && <Alert variant="error">{addState.error}</Alert>}
					{addState?.success && <Alert variant="success">Employee added successfully!</Alert>}
				</CardBody>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Current Employees</CardTitle>
				</CardHeader>
				<CardBody>
					{employees.length === 0 ? (
						<p>No employees found</p>
					) : (
						<div className="space-y-2">
							{employees.map((employee) => (
								<div key={employee.id} className="panel-shadow border-2 border-border bg-muted p-4">
									<div className="flex justify-between items-center">
										<div>
											<p className="font-industrial text-lg font-semibold uppercase tracking-wide">{employee.name}</p>
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
						<Alert variant="error" className="mt-4">
							{deleteState.error}
						</Alert>
					)}
					{deleteState?.success && (
						<Alert variant="success" className="mt-4">
							Employee deleted successfully!
						</Alert>
					)}
					{updatePinState?.error && (
						<Alert variant="error" className="mt-4">
							{updatePinState.error}
						</Alert>
					)}
					{updatePinState?.success && (
						<Alert variant="success" className="mt-4">
							PIN updated successfully!
						</Alert>
					)}
				</CardBody>
			</Card>
		</div>
	);
}

export function SettingsManagement({
	stations,
	employees,
}: {
	stations: Station[];
	employees: Employee[];
}) {
	// Use searchParams as the source of truth - no local state needed!
	const [searchParams, setSearchParams] = useSearchParams();
	const activeTab = searchParams.get("tab") === "employees" ? "employees" : "stations";

	return (
		<div className="space-y-6">
			<Tabs
				selectedKey={activeTab}
				onSelectionChange={(key: React.Key) => {
					const nextTab = key === "employees" ? "employees" : "stations";
					setSearchParams({ tab: nextTab }, { replace: true });
				}}
				variant="pill"
			>
				<TabList aria-label="Settings sections">
					<Tab id="stations">Stations</Tab>
					<Tab id="employees">Employees</Tab>
				</TabList>
				<TabPanel id="stations">
					<div className="mt-4">
						<StationManagement stations={stations} />
					</div>
				</TabPanel>
				<TabPanel id="employees">
					<div className="mt-4">
						<EmployeeManagement employees={employees} />
					</div>
				</TabPanel>
			</Tabs>
		</div>
	);
}
