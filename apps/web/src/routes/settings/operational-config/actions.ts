"use server";

import { validateRequest } from "~/lib/auth";
import { db } from "~/lib/db";
import {
	getOperationalConfigEntries,
	ensureOperationalConfigSeeded,
	OPERATIONAL_CONFIG_KEYS,
	type OperationalConfigEntry,
} from "~/lib/operational-config";

const CONFIG_BOUNDS: Record<string, { min: number; max: number; step: string; unit: string }> = {
	LABOR_HOURLY_RATE: { min: 0, max: 200, step: "0.1", unit: "USD/hour" },
	OVERTIME_MULTIPLIER: { min: 1, max: 5, step: "0.01", unit: "x" },
	BUDGETED_HOURS_PER_DAY: { min: 0, max: 20000, step: "1", unit: "hours/day" },
	DEFAULT_STATION_CAPACITY_FALLBACK: { min: 1, max: 500, step: "1", unit: "workers/station" },
	OPTIMAL_UTILIZATION_PERCENT: { min: 1, max: 100, step: "0.1", unit: "%" },
	KPI_PRODUCTIVITY_HIGH_THRESHOLD: { min: 0, max: 1000, step: "0.1", unit: "units/hour" },
	KPI_PRODUCTIVITY_MEDIUM_THRESHOLD: { min: 0, max: 1000, step: "0.1", unit: "units/hour" },
	KPI_OVERTIME_HIGH_THRESHOLD: { min: 0, max: 100, step: "0.1", unit: "%" },
	KPI_OVERTIME_MEDIUM_THRESHOLD: { min: 0, max: 100, step: "0.1", unit: "%" },
	KPI_OCCUPANCY_HIGH_THRESHOLD: { min: 0, max: 100, step: "0.1", unit: "%" },
	KPI_OCCUPANCY_MEDIUM_THRESHOLD: { min: 0, max: 100, step: "0.1", unit: "%" },
	KPI_VARIANCE_HIGH_THRESHOLD: { min: 0, max: 100, step: "0.1", unit: "%" },
	KPI_VARIANCE_MEDIUM_THRESHOLD: { min: 0, max: 100, step: "0.1", unit: "%" },
};

export type OperationalConfigState = {
	error?: string;
	success?: boolean;
	entries?: OperationalConfigEntry[];
} | null;

export async function getEditableOperationalConfigEntries() {
	await ensureOperationalConfigSeeded();
	const entries = await getOperationalConfigEntries();
	return entries.map((entry) => ({
		...entry,
		bounds: CONFIG_BOUNDS[entry.key] ?? { min: -1000000, max: 1000000, step: "0.1", unit: "" },
	}));
}

export async function updateOperationalConfig(
	_prevState: OperationalConfigState,
	formData: FormData
): Promise<OperationalConfigState> {
	const { user } = await validateRequest();
	if (!user) {
		return { error: "Unauthorized" };
	}

	if (user.role !== "ADMIN" && user.role !== "EXECUTIVE") {
		return { error: "Only ADMIN or EXECUTIVE users can update operational config" };
	}

	const key = String(formData.get("key") || "");
	const valueRaw = String(formData.get("value") || "").trim();

	if (!key || !valueRaw) {
		return { error: "Config key and value are required" };
	}

	if (!OPERATIONAL_CONFIG_KEYS.includes(key)) {
		return { error: "Unknown config key" };
	}

	const value = Number.parseFloat(valueRaw);
	if (!Number.isFinite(value)) {
		return { error: "Value must be a valid number" };
	}

	const bounds = CONFIG_BOUNDS[key];
	if (bounds && (value < bounds.min || value > bounds.max)) {
		return { error: `Value must be between ${bounds.min} and ${bounds.max} ${bounds.unit}` };
	}

	await ensureOperationalConfigSeeded();
	await db.$executeRaw`
		UPDATE operational_config
		SET value = ${String(value)}, updated_at = NOW()
		WHERE key = ${key}
	`;

	const entries = await getOperationalConfigEntries();
	return { success: true, entries };
}
