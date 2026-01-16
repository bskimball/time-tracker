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

export type ClockActionState = {
	error?: string;
	success?: boolean;
	message?: string;
} | null;

export async function clockIn(
	_prevState: ClockActionState,
	formData: FormData
): Promise<ClockActionState> {
	const employeeId = formData.get("employeeId") as string;
	const stationId = formData.get("stationId") as string;

	try {
		await clockInEmployee(employeeId, stationId);
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
	const logId = formData.get("logId") as string;

	try {
		await clockOutLog(logId);
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
	const employeeId = formData.get("employeeId") as string;

	try {
		await startBreakForEmployee(employeeId);
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
	const employeeId = formData.get("employeeId") as string;

	try {
		await endBreakForEmployee(employeeId);
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
	const logId = formData.get("logId") as string;
	const startTime = formData.get("startTime") as string;
	const endTime = formData.get("endTime") as string;
	const type = formData.get("type") as "WORK" | "BREAK";
	const stationId = formData.get("stationId") as string | null;
	const note = formData.get("note") as string;

	try {
		await updateTimeLogEntry(logId, startTime, endTime, type, stationId, note);
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
	const logId = formData.get("logId") as string;

	try {
		await deleteTimeLogEntry(logId);
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
	const pin = formData.get("pin") as string;
	const stationId = formData.get("stationId") as string | null;

	try {
		const result = await pinToggleClockAction(pin, stationId);
		return { success: true, message: result.message };
	} catch (error) {
		if (error instanceof ClockActionError) {
			return { error: error.message };
		}
		throw error;
	}
}
