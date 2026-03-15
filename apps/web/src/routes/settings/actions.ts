"use server";

import { db } from "../../lib/db";
import { validateRequest } from "../../lib/auth";
import {
	createEmployee as createManagedEmployee,
	updateEmployee as updateManagedEmployee,
} from "../manager/employees/actions";

import type { Station } from "@prisma/client";
import { redirect } from "react-router";

export type SettingsState = {
	error?: string;
	success?: boolean;
	stations?: Station[];
} | null;

const SETTINGS_MANAGED_USER_ROLES = ["ADMIN", "MANAGER", "EXECUTIVE"] as const;
type SettingsManagedUserRole = (typeof SETTINGS_MANAGED_USER_ROLES)[number];

function isSettingsManagedUserRole(role: string): role is SettingsManagedUserRole {
	return SETTINGS_MANAGED_USER_ROLES.includes(role as SettingsManagedUserRole);
}

async function requireAdminSettingsAccess() {
	const { user } = await validateRequest();
	if (!user) {
		return { error: "Unauthorized" } as const;
	}

	if (user.role !== "ADMIN") {
		return { error: "Unauthorized: Admin access required" } as const;
	}

	return { user } as const;
}

export async function addStation(
	_prevState: SettingsState,
	formData: FormData
): Promise<SettingsState> {
	const auth = await requireAdminSettingsAccess();
	if ("error" in auth) {
		return auth;
	}

	const nameValue = String(formData.get("name") || "").trim();

	if (!nameValue) {
		return { error: "Station name is required" };
	}

	const name = nameValue;

	try {
		const existing = await db.station.findFirst({
			where: {
				name: {
					equals: name,
					mode: "insensitive",
				},
			},
		});

		if (existing) {
			return { error: "Station already exists" };
		}

		await db.station.create({
			data: {
				id: crypto.randomUUID(),
				name,
			},
		});

		// Return updated stations list
		const stations = await db.station.findMany({ orderBy: { name: "asc" } });
		return { success: true, stations };
	} catch (error) {
		console.error("Error adding station:", error);
		return { error: "Failed to add station" };
	}
}

export async function deleteStation(
	_prevState: SettingsState,
	formData: FormData
): Promise<SettingsState> {
	const auth = await requireAdminSettingsAccess();
	if ("error" in auth) {
		return auth;
	}

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

		// Return updated stations list
		const stations = await db.station.findMany({ orderBy: { name: "asc" } });
		return { success: true, stations };
	} catch (error) {
		console.error("Error deleting station:", error);
		return { error: "Failed to delete station" };
	}
}

export async function addEmployee(
	_prevState: SettingsState,
	formData: FormData
): Promise<SettingsState> {
	const auth = await requireAdminSettingsAccess();
	if ("error" in auth) {
		return auth;
	}

	const name = String(formData.get("name") || "").trim();
	const email = String(formData.get("email") || "").trim();
	const pin = String(formData.get("pin") || "").trim();

	if (!name || !email) {
		return { error: "Name and email are required" };
	}

	try {
		await createManagedEmployee({
			name,
			email,
			pin: pin || undefined,
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
	const auth = await requireAdminSettingsAccess();
	if ("error" in auth) {
		return auth;
	}

	const id = formData.get("id") as string;
	const pin = String(formData.get("pin") || "").trim();

	if (!id) {
		return { error: "Employee ID is required" };
	}

	try {
		await updateManagedEmployee(id, {
			pin,
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
	const auth = await requireAdminSettingsAccess();
	if ("error" in auth) {
		return auth;
	}

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
	const auth = await requireAdminSettingsAccess();
	if ("error" in auth) {
		return auth;
	}
	const { user } = auth;

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
	const auth = await requireAdminSettingsAccess();
	if ("error" in auth) {
		return auth;
	}
	const { user } = auth;

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

export async function updateUserRole(
	_prevState: SettingsState,
	formData: FormData
): Promise<SettingsState> {
	const auth = await requireAdminSettingsAccess();
	if ("error" in auth) {
		return auth;
	}
	const { user } = auth;

	const userId = formData.get("userId") as string;
	const role = formData.get("role") as string;

	if (!userId || !role) {
		return { error: "User ID and role are required" };
	}

	if (!isSettingsManagedUserRole(role)) {
		return { error: "Invalid role" };
	}

	try {
		// Prevent changing own role to avoid locking oneself out
		if (userId === user.id) {
			return { error: "Cannot change your own role" };
		}

		await db.user.update({
			where: { id: userId },
			data: { role },
		});

		redirect("/settings/users");
		return { success: true };
	} catch (error) {
		console.error("Error updating user role:", error);
		return { error: "Failed to update user role" };
	}
}

export async function addUser(
	_prevState: SettingsState,
	formData: FormData
): Promise<SettingsState> {
	const auth = await requireAdminSettingsAccess();
	if ("error" in auth) {
		return auth;
	}

	const email = formData.get("email") as string;
	const name = formData.get("name") as string;
	const role = formData.get("role") as string;

	if (!email) {
		return { error: "Email is required" };
	}

	if (!isSettingsManagedUserRole(role)) {
		return { error: "Invalid role" };
	}

	try {
		const existing = await db.user.findUnique({
			where: { email },
		});

		if (existing) {
			return { error: "User with this email already exists" };
		}

		await db.user.create({
			data: {
				id: crypto.randomUUID(),
				email,
				name: name || null,
				role,
				updatedAt: new Date(),
			},
		});

		redirect("/settings/users");
		return { success: true };
	} catch (error) {
		console.error("Error adding user:", error);
		return { error: "Failed to add user" };
	}
}

export async function deleteUser(
	_prevState: SettingsState,
	formData: FormData
): Promise<SettingsState> {
	const auth = await requireAdminSettingsAccess();
	if ("error" in auth) {
		return auth;
	}
	const { user } = auth;

	const userId = String(formData.get("userId") || "");
	if (!userId) {
		return { error: "User ID is required" };
	}

	if (userId === user.id) {
		return { error: "Cannot delete your own account" };
	}

	try {
		await db.user.delete({
			where: { id: userId },
		});

		redirect("/settings/users");
		return { success: true };
	} catch (error) {
		console.error("Error deleting user:", error);
		return { error: "Failed to delete user" };
	}
}
