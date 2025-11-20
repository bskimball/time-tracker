"use server";

import { db } from "../../lib/db";
import { redirect } from "react-router";
import bcrypt from "bcryptjs";
import { validateRequest } from "../../lib/auth";

export type SettingsState = {
	error?: string;
	success?: boolean;
} | null;

export async function addStation(
	_prevState: SettingsState,
	formData: FormData
): Promise<SettingsState> {
	const name = formData.get("name") as string;

	if (!name) {
		return { error: "Station name is required" };
	}

	try {
		// Check if station already exists
		const existing = await db.station.findUnique({
			where: { name: name as "PICKING" | "PACKING" | "FILLING" },
		});

		if (existing) {
			return { error: "Station already exists" };
		}

		await db.station.create({
			data: {
				id: crypto.randomUUID(),
				name: name as "PICKING" | "PACKING" | "FILLING",
			},
		});

		redirect("/settings/stations");
		return { success: true };
	} catch (error) {
		console.error("Error adding station:", error);
		return { error: "Failed to add station" };
	}
}

export async function deleteStation(
	_prevState: SettingsState,
	formData: FormData
): Promise<SettingsState> {
	const id = formData.get("id") as string;

	if (!id) {
		return { error: "Station ID is required" };
	}

	try {
		// Check if station is being used in time logs
		const usageCount = await db.timeLog.count({
			where: { stationId: id },
		});

		if (usageCount > 0) {
			return { error: "Cannot delete station that has time logs" };
		}

		await db.station.delete({
			where: { id },
		});

		redirect("/settings/stations");
		return { success: true };
	} catch (error) {
		console.error("Error deleting station:", error);
		return { error: "Failed to delete station" };
	}
}

export async function addEmployee(
	_prevState: SettingsState,
	formData: FormData
): Promise<SettingsState> {
	const name = formData.get("name") as string;
	const email = formData.get("email") as string;
	const pin = formData.get("pin") as string;

	if (!name || !email) {
		return { error: "Name and email are required" };
	}

	if (pin && (pin.length < 4 || pin.length > 6 || !/^\d+$/.test(pin))) {
		return { error: "PIN must be 4-6 digits" };
	}

	try {
		const existing = await db.employee.findUnique({
			where: { email },
		});

		if (existing) {
			return { error: "Employee with this email already exists" };
		}

		const pinHash = pin ? await bcrypt.hash(pin, 10) : null;

		await db.employee.create({
			data: {
				id: crypto.randomUUID(),
				name,
				email,
				pinHash,
			},
		});

		redirect("/settings/employees");
		return { success: true };
	} catch (error) {
		console.error("Error adding employee:", error);
		return { error: "Failed to add employee" };
	}
}

export async function updateEmployeePin(
	_prevState: SettingsState,
	formData: FormData
): Promise<SettingsState> {
	const id = formData.get("id") as string;
	const pin = formData.get("pin") as string;

	if (!id) {
		return { error: "Employee ID is required" };
	}

	if (!pin || pin.length < 4 || pin.length > 6 || !/^\d+$/.test(pin)) {
		return { error: "PIN must be 4-6 digits" };
	}

	try {
		const pinHash = await bcrypt.hash(pin, 10);

		await db.employee.update({
			where: { id },
			data: { pinHash },
		});

		redirect("/settings/employees");
		return { success: true };
	} catch (error) {
		console.error("Error updating PIN:", error);
		return { error: "Failed to update PIN" };
	}
}

export async function deleteEmployee(
	_prevState: SettingsState,
	formData: FormData
): Promise<SettingsState> {
	const id = formData.get("id") as string;

	if (!id) {
		return { error: "Employee ID is required" };
	}

	try {
		const usageCount = await db.timeLog.count({
			where: { employeeId: id },
		});

		if (usageCount > 0) {
			return { error: "Cannot delete employee that has time logs" };
		}

		await db.employee.delete({
			where: { id },
		});

		redirect("/settings/employees");
		return { success: true };
	} catch (error) {
		console.error("Error deleting employee:", error);
		return { error: "Failed to delete employee" };
	}
}

export async function addApiKey(
	_prevState: SettingsState,
	formData: FormData
): Promise<SettingsState> {
	const { user } = await validateRequest();
	if (!user) {
		return { error: "Unauthorized" };
	}

	const name = formData.get("name") as string;

	if (!name) {
		return { error: "Key name is required" };
	}

	// Generate a secure looking key
	const key = `sk_${crypto.randomUUID().replace(/-/g, "")}`;

	try {
		await db.apiKey.create({
			data: {
				name,
				key,
				userId: user.id,
			},
		});

		redirect("/settings/api-keys");
		return { success: true };
	} catch (error) {
		console.error("Error adding API key:", error);
		return { error: "Failed to add API key" };
	}
}

export async function deleteApiKey(
	_prevState: SettingsState,
	formData: FormData
): Promise<SettingsState> {
	const { user } = await validateRequest();
	if (!user) {
		return { error: "Unauthorized" };
	}

	const id = formData.get("id") as string;

	if (!id) {
		return { error: "Key ID is required" };
	}

	try {
		await db.apiKey.delete({
			where: { id, userId: user.id },
		});

		redirect("/settings/api-keys");
		return { success: true };
	} catch (error) {
		console.error("Error deleting API key:", error);
		return { error: "Failed to delete API key" };
	}
}
