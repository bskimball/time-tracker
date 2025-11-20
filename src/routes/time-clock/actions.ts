"use server";

import {
	ClockActionError,
	clockInEmployee,
	clockOutLog,
	deleteTimeLogEntry,
	endBreakForEmployee,
	pinToggleClockAction,
	startBreakForEmployee,
	updateTimeLogEntry,
} from "../../services/time-clock";
import {
	breakSchema,
	clockInSchema,
	clockOutSchema,
	deleteTimeLogSchema,
	pinToggleClockSchema,
	updateTimeLogSchema,
} from "./schemas";

export type ClockActionState = {
	error?: string;
	success?: boolean;
	message?: string;
} | null;

export async function clockIn(
	_prevState: ClockActionState,
	formData: FormData
): Promise<ClockActionState> {
	const parse = clockInSchema.safeParse(Object.fromEntries(formData));
	if (!parse.success) {
		return { error: parse.error.issues[0].message };
	}

	try {
		await clockInEmployee(parse.data.employeeId, parse.data.stationId);
		return { success: true };
	} catch (error) {
		if (error instanceof ClockActionError) {
			return { error: error.message };
		}
		throw error;
	}
}

export async function clockOut(
	_prevState: ClockActionState,
	formData: FormData
): Promise<ClockActionState> {
	const parse = clockOutSchema.safeParse(Object.fromEntries(formData));
	if (!parse.success) {
		return { error: parse.error.issues[0].message };
	}

	try {
		await clockOutLog(parse.data.logId);
		return { success: true };
	} catch (error) {
		if (error instanceof ClockActionError) {
			return { error: error.message };
		}
		throw error;
	}
}

export async function startBreak(
	_prevState: ClockActionState,
	formData: FormData
): Promise<ClockActionState> {
	const parse = breakSchema.safeParse(Object.fromEntries(formData));
	if (!parse.success) {
		return { error: parse.error.issues[0].message };
	}

	try {
		await startBreakForEmployee(parse.data.employeeId);
		return { success: true };
	} catch (error) {
		if (error instanceof ClockActionError) {
			return { error: error.message };
		}
		throw error;
	}
}

export async function endBreak(
	_prevState: ClockActionState,
	formData: FormData
): Promise<ClockActionState> {
	const parse = breakSchema.safeParse(Object.fromEntries(formData));
	if (!parse.success) {
		return { error: parse.error.issues[0].message };
	}

	try {
		await endBreakForEmployee(parse.data.employeeId);
		return { success: true };
	} catch (error) {
		if (error instanceof ClockActionError) {
			return { error: error.message };
		}
		throw error;
	}
}

export async function updateTimeLog(
	_prevState: ClockActionState,
	formData: FormData
): Promise<ClockActionState> {
	const raw = Object.fromEntries(formData);
	// Handle nullable/optional fields properly for Zod
	if (raw.stationId === "") raw.stationId = null as any;
	if (raw.endTime === "") delete raw.endTime;

	const parse = updateTimeLogSchema.safeParse(raw);
	if (!parse.success) {
		return { error: parse.error.issues[0].message };
	}

	try {
		await updateTimeLogEntry(
			parse.data.logId,
			parse.data.startTime,
			parse.data.endTime || "",
			parse.data.type,
			parse.data.stationId || null,
			parse.data.note || ""
		);
		return { success: true };
	} catch (error) {
		if (error instanceof ClockActionError) {
			return { error: error.message };
		}
		throw error;
	}
}

export async function deleteTimeLog(
	_prevState: ClockActionState,
	formData: FormData
): Promise<ClockActionState> {
	const parse = deleteTimeLogSchema.safeParse(Object.fromEntries(formData));
	if (!parse.success) {
		return { error: parse.error.issues[0].message };
	}

	try {
		await deleteTimeLogEntry(parse.data.logId);
		return { success: true };
	} catch (error) {
		if (error instanceof ClockActionError) {
			return { error: error.message };
		}
		throw error;
	}
}

export async function pinToggleClock(
	_prevState: ClockActionState,
	formData: FormData
): Promise<ClockActionState> {
	const raw = Object.fromEntries(formData);
	if (raw.stationId === "") raw.stationId = null as any;

	const parse = pinToggleClockSchema.safeParse(raw);
	if (!parse.success) {
		return { error: parse.error.issues[0].message };
	}

	try {
		const result = await pinToggleClockAction(parse.data.pin, parse.data.stationId || null);
		return { success: true, message: result.message };
	} catch (error) {
		if (error instanceof ClockActionError) {
			return { error: error.message };
		}
		throw error;
	}
}
