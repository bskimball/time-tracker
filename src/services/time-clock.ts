import { db } from "../lib/db";
import bcrypt from "bcryptjs";

// Helper function for generating IDs - can be mocked in tests
export const generateId = () => crypto.randomUUID();

export class ClockActionError extends Error {}

export type ClockActionResult = {
	message?: string;
};

function assert(condition: unknown, message: string): asserts condition {
	if (!condition) {
		throw new ClockActionError(message);
	}
}

export async function clockInEmployee(
	employeeId: string | null,
	stationId: string | null
): Promise<ClockActionResult> {
	assert(employeeId, "Employee is required");
	assert(stationId, "Station is required");

	const activeLog = await db.timeLog.findFirst({
		where: {
			employeeId,
			endTime: null,
			type: "WORK",
			deletedAt: null,
		},
	});

	if (activeLog) {
		throw new ClockActionError("Employee is already clocked in at another station");
	}

	await db.$transaction(async (tx) => {
		await tx.timeLog.create({
			data: {
				id: generateId(),
				employeeId: employeeId!,
				stationId: stationId!,
				type: "WORK",
				updatedAt: new Date(),
			},
		});

		await tx.employee.update({
			where: { id: employeeId! },
			data: { lastStationId: stationId! },
		});
	});

	return { message: "Clocked in successfully" };
}

export async function clockOutLog(logId: string | null): Promise<ClockActionResult> {
	assert(logId, "Log ID is required");

	await db.timeLog.update({
		where: { id: logId! },
		data: { endTime: new Date() },
	});

	return { message: "Clocked out successfully" };
}

export async function startBreakForEmployee(employeeId: string | null): Promise<ClockActionResult> {
	assert(employeeId, "Employee ID is required");

	const activeWork = await db.timeLog.findFirst({
		where: {
			employeeId,
			type: "WORK",
			endTime: null,
			deletedAt: null,
		},
	});

	if (!activeWork) {
		throw new ClockActionError("Employee must be clocked in to start a break");
	}

	const activeBreak = await db.timeLog.findFirst({
		where: {
			employeeId,
			type: "BREAK",
			endTime: null,
			deletedAt: null,
		},
	});

	if (activeBreak) {
		throw new ClockActionError("Employee is already on break");
	}

	await db.timeLog.create({
		data: {
			id: generateId(),
			employeeId: employeeId!,
			stationId: activeWork.stationId,
			type: "BREAK",
			updatedAt: new Date(),
		},
	});

	return { message: "Break started" };
}

export async function endBreakForEmployee(employeeId: string | null): Promise<ClockActionResult> {
	assert(employeeId, "Employee ID is required");

	const activeBreak = await db.timeLog.findFirst({
		where: {
			employeeId,
			type: "BREAK",
			endTime: null,
			deletedAt: null,
		},
	});

	if (!activeBreak) {
		throw new ClockActionError("No active break found");
	}

	await db.timeLog.update({
		where: { id: activeBreak.id },
		data: { endTime: new Date() },
	});

	return { message: "Break ended" };
}

export async function updateTimeLogEntry(
	logId: string | null,
	startTime: string | null,
	endTime: string | null,
	type: "WORK" | "BREAK",
	stationId: string | null,
	note: string | null
): Promise<ClockActionResult> {
	assert(logId, "Log ID is required");
	assert(startTime, "Start time is required");

	const start = new Date(startTime!);
	const end = endTime ? new Date(endTime) : null;

	if (end && end < start) {
		throw new ClockActionError("End time must be after start time");
	}

	const log = await db.timeLog.findUnique({
		where: { id: logId! },
		select: { employeeId: true },
	});

	if (!log) {
		throw new ClockActionError("Time log not found");
	}

	if (type === "WORK") {
		const overlapping = await db.timeLog.findFirst({
			where: {
				employeeId: log.employeeId,
				type: "WORK",
				id: { not: logId! },
				deletedAt: null,
				OR: [
					{
						startTime: { lte: start },
						endTime: { gte: start },
					},
					{
						startTime: { lte: end || new Date() },
						endTime: { gte: end || new Date() },
					},
				],
			},
		});

		if (overlapping) {
			throw new ClockActionError("Time range overlaps with another work session");
		}
	}

	await db.timeLog.update({
		where: { id: logId! },
		data: {
			startTime: start,
			endTime: end,
			type,
			stationId: stationId || undefined,
			note: note || null,
		},
	});

	return { message: "Time log updated" };
}

export async function deleteTimeLogEntry(logId: string | null): Promise<ClockActionResult> {
	assert(logId, "Log ID is required");

	await db.timeLog.update({
		where: { id: logId! },
		data: { deletedAt: new Date() },
	});

	return { message: "Time log deleted" };
}

export async function pinToggleClockAction(
	pin: string | null,
	stationId: string | null
): Promise<ClockActionResult> {
	assert(pin, "PIN is required");
	if (pin!.length < 4 || pin!.length > 6) {
		throw new ClockActionError("PIN must be 4-6 digits");
	}

	const employees = await db.employee.findMany({
		where: { pinHash: { not: null } },
	});

	let matchedEmployee: (typeof employees)[number] | null = null;
	for (const employee of employees) {
		if (!employee.pinHash) continue;
		const isMatch = await bcrypt.compare(pin!, employee.pinHash);
		if (isMatch) {
			matchedEmployee = employee;
			break;
		}
	}

	if (!matchedEmployee) {
		throw new ClockActionError("Invalid PIN");
	}

	const activeLog = await db.timeLog.findFirst({
		where: {
			employeeId: matchedEmployee.id,
			endTime: null,
			type: "WORK",
			deletedAt: null,
		},
	});

	if (activeLog) {
		await db.timeLog.update({
			where: { id: activeLog.id },
			data: { endTime: new Date() },
		});

		return {
			message: `${matchedEmployee.name} clocked out successfully`,
		};
	}

	const clockInStationId = stationId || matchedEmployee.lastStationId;

	if (!clockInStationId) {
		throw new ClockActionError("Please select a station to clock in");
	}

	await db.$transaction(async (tx) => {
		await tx.timeLog.create({
			data: {
				id: generateId(),
				employeeId: matchedEmployee!.id,
				stationId: clockInStationId,
				type: "WORK",
				updatedAt: new Date(),
			},
		});

		await tx.employee.update({
			where: { id: matchedEmployee!.id },
			data: { lastStationId: clockInStationId },
		});
	});

	return {
		message: `${matchedEmployee.name} clocked in successfully`,
	};
}
