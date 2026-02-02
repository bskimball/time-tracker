"use client";

import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Button, Input, Card, CardBody, Alert, Select } from "@monorepo/design-system";

type EmployeeStatus = "ACTIVE" | "INACTIVE" | "ON_LEAVE" | "TERMINATED";

interface EmployeeFormData {
	name: string;
	email: string;
	phoneNumber: string;
	pin: string;
	defaultStationId: string;
	dailyHoursLimit: number;
	weeklyHoursLimit: number;
	status: EmployeeStatus;
	employeeCode: string;
}

interface EmployeeFormProps {
	employee: EmployeeFormData;
	stations: Array<{ id: string; name: string }>;
	isEdit: boolean;
	employeeId?: string;
}

export function EmployeeForm({
	employee: initialEmployee,
	stations,
	isEdit,
	employeeId,
}: EmployeeFormProps) {
	const navigate = useNavigate();

	const [employee, setEmployee] = useState(initialEmployee);
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [success, setSuccess] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const statusOptions: { value: EmployeeStatus; label: string }[] = [
		{ value: "ACTIVE", label: "Active" },
		{ value: "INACTIVE", label: "Inactive" },
		{ value: "ON_LEAVE", label: "On Leave" },
		{ value: "TERMINATED", label: "Terminated" },
	];

	const validateForm = (): boolean => {
		const newErrors: Record<string, string> = {};

		if (!employee.name.trim()) {
			newErrors.name = "Name is required";
		}

		if (!employee.email.trim()) {
			newErrors.email = "Email is required";
		} else if (!/\S+@\S+\.\S+/.test(employee.email)) {
			newErrors.email = "Please enter a valid email";
		}

		if (employee.pin && employee.pin.length < 4) {
			newErrors.pin = "PIN must be at least 4 digits";
		}

		if (employee.dailyHoursLimit < 0) {
			newErrors.dailyHoursLimit = "Daily hours limit must be positive";
		}

		if (employee.weeklyHoursLimit < 0) {
			newErrors.weeklyHoursLimit = "Weekly hours limit must be positive";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) return;

		setIsSubmitting(true);
		setErrors({});

		try {
			const formData = new FormData();
			formData.append("name", employee.name);
			formData.append("email", employee.email);
			formData.append("phoneNumber", employee.phoneNumber);
			if (employee.pin) {
				formData.append("pin", employee.pin);
			}
			formData.append("defaultStationId", employee.defaultStationId);
			formData.append("dailyHoursLimit", employee.dailyHoursLimit.toString());
			formData.append("weeklyHoursLimit", employee.weeklyHoursLimit.toString());
			formData.append("status", employee.status);

			const url = isEdit ? `/manager/employees/${employeeId}/edit` : `/manager/employees/new`;

			const method = isEdit ? "PUT" : "POST";

			const response = await fetch(url, {
				method,
				body: formData,
			});

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(errorText || "Failed to save employee");
			}

			setSuccess(true);

			// Redirect to employee detail page after successful save
			global.setTimeout(() => {
				navigate(isEdit ? `/manager/employees/${employeeId}` : "/manager/employees");
			}, 1500);
		} catch (error) {
			console.error("Error saving employee:", error);
			setErrors({
				submit: error instanceof Error ? error.message : "An unknown error occurred",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	const updateEmployee = (field: keyof EmployeeFormData, value: string | number) => {
		setEmployee((prev) => ({ ...prev, [field]: value }));
		// Clear error for this field when user makes changes
		if (errors[field]) {
			setErrors((prev) => ({ ...prev, [field]: "" }));
		}
	};

	return (
		<div className="max-w-2xl mx-auto">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-2xl font-bold">{isEdit ? "Edit Employee" : "Create New Employee"}</h1>
				<Link to="/manager/employees">
					<Button variant="outline">Cancel</Button>
				</Link>
			</div>

			{errors.submit && (
				<Alert variant="error" className="mb-4">
					{errors.submit}
				</Alert>
			)}

			{success && (
				<Alert variant="success" className="mb-4">
					Employee {isEdit ? "updated" : "created"} successfully! Redirecting...
				</Alert>
			)}

			<Card>
				<CardBody>
					<form onSubmit={handleSubmit} className="space-y-6">
						{/* Basic Information */}
						<div className="space-y-4">
							<h3 className="text-lg font-semibold">Basic Information</h3>

							<div>
								<Input
									label="Name"
									value={employee.name}
									onChange={(e) => updateEmployee("name", e.target.value)}
									error={errors.name}
									required
								/>
							</div>

							<div>
								<Input
									label="Email"
									type="email"
									value={employee.email}
									onChange={(e) => updateEmployee("email", e.target.value)}
									error={errors.email}
									required
								/>
							</div>

							<div>
								<Input
									label="Phone Number"
									type="tel"
									value={employee.phoneNumber}
									onChange={(e) => updateEmployee("phoneNumber", e.target.value)}
									placeholder="(555) 123-4567"
								/>
							</div>

							<div>
								<Input
									label="PIN"
									type="password"
									value={employee.pin}
									onChange={(e) => updateEmployee("pin", e.target.value)}
									error={errors.pin}
									placeholder="Leave empty to remove PIN"
								/>
								<p className="text-xs text-muted-foreground mt-1">
									4+ digit PIN for floor kiosk access. Leave empty for no PIN access.
								</p>
							</div>

							<div>
								<Select
									label="Status"
									options={statusOptions}
									value={employee.status}
									onChange={(value: string) => updateEmployee("status", value as EmployeeStatus)}
								/>
							</div>
						</div>

						{/* Work Settings */}
						<div className="space-y-4">
							<h3 className="text-lg font-semibold">Work Settings</h3>

							<div>
								<Select
									label="Default Station"
									placeholder="Select a station"
									options={stations.map((s) => ({ value: s.id, label: s.name }))}
									value={employee.defaultStationId}
									onChange={(value: string) => updateEmployee("defaultStationId", value)}
								/>
							</div>

							<div>
								<Input
									label="Daily Hours Limit"
									type="number"
									step="0.5"
									min="0"
									max="24"
									value={employee.dailyHoursLimit}
									onChange={(e) =>
										updateEmployee("dailyHoursLimit", parseFloat(e.target.value) || 0)
									}
									error={errors.dailyHoursLimit}
								/>
							</div>

							<div>
								<Input
									label="Weekly Hours Limit"
									type="number"
									step="0.5"
									min="0"
									max="168"
									value={employee.weeklyHoursLimit}
									onChange={(e) =>
										updateEmployee("weeklyHoursLimit", parseFloat(e.target.value) || 0)
									}
									error={errors.weeklyHoursLimit}
								/>
							</div>
						</div>

						{/* Form Actions */}
						<div className="flex justify-between items-center pt-6 border-t border-border">
							<Link to="/manager/employees">
								<Button variant="outline" type="button">
									Cancel
								</Button>
							</Link>
							<Button type="submit" variant="primary" disabled={isSubmitting}>
								{isSubmitting ? "Saving..." : isEdit ? "Update Employee" : "Create Employee"}
							</Button>
						</div>
					</form>
				</CardBody>
			</Card>
		</div>
	);
}
