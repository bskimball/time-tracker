"use server";

import { validateRequest } from "~/lib/auth";
import { db } from "~/lib/db";
import {
	getOperationalConfigEntries,
	ensureOperationalConfigSeeded,
	getOperationalConfigDefinition,
	OPERATIONAL_CONFIG_KEYS,
	type OperationalConfigEntry,
} from "~/lib/operational-config";

export type EditableOperationalConfigEntry = OperationalConfigEntry & {
	validation:
		| {
				type: "number";
				min: number;
				max: number;
				step: string;
				unit: string;
		  }
		| {
				type: "enum";
				options: readonly string[];
				defaultValue: string;
				unit: string;
		  };
};

export type OperationalConfigState = {
	error?: string;
	success?: boolean;
	entries?: EditableOperationalConfigEntry[];
} | null;

export async function getEditableOperationalConfigEntries() {
	await ensureOperationalConfigSeeded();
	const entries = await getOperationalConfigEntries();
	return entries.map((entry) => ({
		...entry,
		validation: getOperationalConfigDefinition(entry.key)?.validation ?? {
			type: "number",
			min: -1000000,
			max: 1000000,
			step: "0.1",
			unit: "",
		},
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

	const definition = getOperationalConfigDefinition(key);
	if (!definition) {
		return { error: "Unknown config key" };
	}

	let sanitizedValue = valueRaw;
	if (definition.validation.type === "number") {
		const value = Number.parseFloat(valueRaw);
		if (!Number.isFinite(value)) {
			return { error: "Value must be a valid number" };
		}

		if (value < definition.validation.min || value > definition.validation.max) {
			return {
				error: `Value must be between ${definition.validation.min} and ${definition.validation.max} ${definition.validation.unit}`,
			};
		}

		sanitizedValue = String(value);
	} else {
		if (!definition.validation.options.includes(valueRaw)) {
			return {
				error: `Value must be one of: ${definition.validation.options.join(", ")}`,
			};
		}
	}

	await ensureOperationalConfigSeeded();
	await db.$executeRaw`
		UPDATE operational_config
		SET value = ${sanitizedValue}, updated_at = NOW()
		WHERE key = ${key}
	`;

	const entries = await getEditableOperationalConfigEntries();
	return { success: true, entries };
}
