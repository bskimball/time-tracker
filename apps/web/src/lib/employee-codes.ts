import { db } from "~/lib/db";

const LEGACY_EMPLOYEE_CODE_PATTERN = /^EMP\d+$/i;

export function getEmployeeCodePrefix(name: string) {
	const parts = name
		.toUpperCase()
		.split(/[^A-Z0-9]+/)
		.filter(Boolean);

	if (parts.length === 0) {
		return "EMP";
	}

	const source = parts.length === 1 ? parts[0] : `${parts[0][0] ?? ""}${parts.at(-1) ?? ""}`;

	return source.slice(0, 3).padEnd(3, "X");
}

export function formatEmployeeCode(prefix: string, sequence: number) {
	return `${prefix}${String(sequence).padStart(3, "0")}`;
}

export async function generateUniqueEmployeeCode(name: string, excludeEmployeeId?: string) {
	const prefix = getEmployeeCodePrefix(name);
	const codePattern = new RegExp(`^${prefix}(\\d+)$`);
	const existingCodes = await db.employee.findMany({
		where: {
			employeeCode: { startsWith: prefix },
			...(excludeEmployeeId ? { NOT: { id: excludeEmployeeId } } : {}),
		},
		select: {
			employeeCode: true,
		},
	});

	const usedSequences = new Set(
		existingCodes
			.map(({ employeeCode }) => {
				const match = employeeCode?.match(codePattern);
				return match ? Number.parseInt(match[1] ?? "", 10) : null;
			})
			.filter((sequence): sequence is number => Number.isInteger(sequence))
	);

	let nextSequence = 1;
	while (usedSequences.has(nextSequence)) {
		nextSequence += 1;
	}

	return formatEmployeeCode(prefix, nextSequence);
}

export async function backfillLegacyEmployeeCodes() {
	const employeesNeedingCodes = await db.employee.findMany({
		where: {
			OR: [{ employeeCode: null }, { employeeCode: { startsWith: "EMP" } }],
		},
		orderBy: { name: "asc" },
		select: {
			id: true,
			name: true,
			employeeCode: true,
		},
	});

	for (const employee of employeesNeedingCodes) {
		if (employee.employeeCode && !LEGACY_EMPLOYEE_CODE_PATTERN.test(employee.employeeCode)) {
			continue;
		}

		const nextCode = await generateUniqueEmployeeCode(employee.name, employee.id);
		if (employee.employeeCode === nextCode) {
			continue;
		}

		await db.employee.update({
			where: { id: employee.id },
			data: { employeeCode: nextCode },
		});
	}
}
