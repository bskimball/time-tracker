"use client";

import React, { useState } from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
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
									className="flex justify-between items-center p-4 bg-accent rounded"
								>
									<span className="font-semibold">{station.name}</span>
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
								<div key={employee.id} className="p-4 bg-accent rounded">
									<div className="flex justify-between items-center">
										<div>
											<p className="font-semibold">{employee.name}</p>
											<p className="text-sm text-muted-foreground">{employee.email}</p>
											<p className="text-xs text-muted-foreground mt-1">
												{employee.pinHash ? "PIN set" : "No PIN"}
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
	const urlParams =
		typeof window !== "undefined"
			? new URLSearchParams(window.location.search)
			: new URLSearchParams();
	const initialTab = urlParams.get("tab") === "employees" ? "employees" : "stations";
	const [activeTab, setActiveTab] = useState<"stations" | "employees">(initialTab);

	return (
		<div className="space-y-6">
			<Tabs
				selectedKey={activeTab}
				onSelectionChange={(key: React.Key) => {
					const nextTab = key === "employees" ? "employees" : "stations";
					setActiveTab(nextTab);
					if (typeof window !== "undefined") {
						window.history.replaceState(null, "", `/settings?tab=${nextTab}`);
					}
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
