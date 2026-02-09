import { db } from "~/lib/db";

type ConfigRow = {
	key: string;
	value: string;
	description: string | null;
};

export type OperationalConfigEntry = {
	key: string;
	value: string;
	description: string;
};

const DEFAULT_CONFIG: Array<{ key: string; value: string; description: string }> = [
	{
		key: "LABOR_HOURLY_RATE",
		value: "24",
		description: "Base hourly labor rate used for labor cost and opportunity impact calculations.",
	},
	{
		key: "OVERTIME_MULTIPLIER",
		value: "1.5",
		description: "Multiplier applied to hourly rate when calculating overtime labor cost.",
	},
	{
		key: "BUDGETED_HOURS_PER_DAY",
		value: "64",
		description: "Planned labor hours per day used to compute budget variance in executive views.",
	},
	{
		key: "DEFAULT_STATION_CAPACITY_FALLBACK",
		value: "6",
		description: "Fallback capacity per station when no station capacity is configured.",
	},
	{
		key: "OPTIMAL_UTILIZATION_PERCENT",
		value: "82",
		description: "Target utilization percentage used for capacity planning benchmarks.",
	},
	{
		key: "KPI_PRODUCTIVITY_HIGH_THRESHOLD",
		value: "30",
		description: "Executive productivity KPI high threshold (units/hour).",
	},
	{
		key: "KPI_PRODUCTIVITY_MEDIUM_THRESHOLD",
		value: "24",
		description: "Executive productivity KPI medium threshold (units/hour).",
	},
	{
		key: "KPI_OVERTIME_HIGH_THRESHOLD",
		value: "12",
		description: "Executive overtime KPI high threshold (percent).",
	},
	{
		key: "KPI_OVERTIME_MEDIUM_THRESHOLD",
		value: "6",
		description: "Executive overtime KPI medium threshold (percent).",
	},
	{
		key: "KPI_OCCUPANCY_HIGH_THRESHOLD",
		value: "90",
		description: "Executive occupancy KPI high threshold (percent).",
	},
	{
		key: "KPI_OCCUPANCY_MEDIUM_THRESHOLD",
		value: "75",
		description: "Executive occupancy KPI medium threshold (percent).",
	},
	{
		key: "KPI_VARIANCE_HIGH_THRESHOLD",
		value: "8",
		description: "Executive cost variance high threshold (absolute percent).",
	},
	{
		key: "KPI_VARIANCE_MEDIUM_THRESHOLD",
		value: "3",
		description: "Executive cost variance medium threshold (absolute percent).",
	},
];

export const OPERATIONAL_CONFIG_KEYS = DEFAULT_CONFIG.map((item) => item.key);

let ensurePromise: Promise<void> | null = null;

export async function ensureOperationalConfigSeeded() {
	if (!ensurePromise) {
		ensurePromise = seedOperationalConfig().finally(() => {
			ensurePromise = null;
		});
	}

	await ensurePromise;
}

async function seedOperationalConfig() {
	await db.$executeRawUnsafe(
		`CREATE TABLE IF NOT EXISTS operational_config (
			key TEXT PRIMARY KEY,
			value TEXT NOT NULL,
			description TEXT,
			updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
		)`
	);

	for (const item of DEFAULT_CONFIG) {
		await db.$executeRaw`
			INSERT INTO operational_config (key, value, description)
			VALUES (${item.key}, ${item.value}, ${item.description})
			ON CONFLICT (key) DO UPDATE SET description = EXCLUDED.description
		`;
	}

	// One-time default upgrades for legacy values introduced during early bootstrap.
	// These updates are conservative and only apply when a value still matches the prior default.
	const legacyToCurrent: Array<{ key: string; legacy: string; next: string }> = [
		{ key: "LABOR_HOURLY_RATE", legacy: "18.5", next: "24" },
		{ key: "BUDGETED_HOURS_PER_DAY", legacy: "100", next: "64" },
		{ key: "DEFAULT_STATION_CAPACITY_FALLBACK", legacy: "2", next: "6" },
		{ key: "OPTIMAL_UTILIZATION_PERCENT", legacy: "80", next: "82" },
		{ key: "KPI_PRODUCTIVITY_HIGH_THRESHOLD", legacy: "20", next: "30" },
		{ key: "KPI_PRODUCTIVITY_MEDIUM_THRESHOLD", legacy: "15", next: "24" },
		{ key: "KPI_OVERTIME_HIGH_THRESHOLD", legacy: "15", next: "12" },
		{ key: "KPI_OVERTIME_MEDIUM_THRESHOLD", legacy: "10", next: "6" },
		{ key: "KPI_OCCUPANCY_HIGH_THRESHOLD", legacy: "85", next: "90" },
		{ key: "KPI_OCCUPANCY_MEDIUM_THRESHOLD", legacy: "70", next: "75" },
		{ key: "KPI_VARIANCE_HIGH_THRESHOLD", legacy: "10", next: "8" },
		{ key: "KPI_VARIANCE_MEDIUM_THRESHOLD", legacy: "5", next: "3" },
	];

	for (const item of legacyToCurrent) {
		await db.$executeRaw`
			UPDATE operational_config
			SET value = ${item.next}, updated_at = NOW()
			WHERE key = ${item.key} AND value = ${item.legacy}
		`;
	}
}

export async function getOperationalConfigMap() {
	await ensureOperationalConfigSeeded();

	const rows = await db.$queryRaw<ConfigRow[]>`
		SELECT key, value, description
		FROM operational_config
	`;

	const map = new Map<string, ConfigRow>();
	for (const row of rows) {
		map.set(row.key, row);
	}

	return map;
}

export async function getOperationalConfigEntries(): Promise<OperationalConfigEntry[]> {
	const map = await getOperationalConfigMap();
	return DEFAULT_CONFIG.map((item) => ({
		key: item.key,
		value: map.get(item.key)?.value ?? item.value,
		description: map.get(item.key)?.description ?? item.description,
	}));
}

export async function getOperationalNumber(key: string, fallback: number) {
	const map = await getOperationalConfigMap();
	const value = Number.parseFloat(map.get(key)?.value ?? "");
	return Number.isFinite(value) ? value : fallback;
}

export async function getExecutiveKpiThresholds() {
	const [
		productivityHigh,
		productivityMedium,
		overtimeHigh,
		overtimeMedium,
		occupancyHigh,
		occupancyMedium,
		varianceHigh,
		varianceMedium,
	] = await Promise.all([
		getOperationalNumber("KPI_PRODUCTIVITY_HIGH_THRESHOLD", 20),
		getOperationalNumber("KPI_PRODUCTIVITY_MEDIUM_THRESHOLD", 15),
		getOperationalNumber("KPI_OVERTIME_HIGH_THRESHOLD", 15),
		getOperationalNumber("KPI_OVERTIME_MEDIUM_THRESHOLD", 10),
		getOperationalNumber("KPI_OCCUPANCY_HIGH_THRESHOLD", 85),
		getOperationalNumber("KPI_OCCUPANCY_MEDIUM_THRESHOLD", 70),
		getOperationalNumber("KPI_VARIANCE_HIGH_THRESHOLD", 10),
		getOperationalNumber("KPI_VARIANCE_MEDIUM_THRESHOLD", 5),
	]);

	return {
		productivityHigh,
		productivityMedium,
		overtimeHigh,
		overtimeMedium,
		occupancyHigh,
		occupancyMedium,
		varianceHigh,
		varianceMedium,
	};
}
