"use server";

import bcrypt from "bcryptjs";
import { db } from "~/lib/db";
import { ensureOperationalDataSeeded } from "~/lib/ensure-operational-data";
import { validateRequest } from "~/lib/auth";
import { getTaskAssignmentMode } from "~/lib/operational-config";
import { publishManagerRealtimeEvent } from "~/lib/manager-realtime";
import {
	getActiveEmployeeByCode,
	getWorkerSelfTaskContext as resolveWorkerSelfTaskContext,
	normalizeEmployeeCode,
	resolveFloorEmployeeId,
} from "~/lib/domain/employee-work-eligibility";
import {
	clockInWorkSession,
	endWorkerTask,
	startWorkerTask,
	switchWorkerTask,
} from "~/lib/domain/work-session";

export type ClockActionState = {
	error?: string;
	success?: boolean;
	message?: string;
} | null;

async function resolveScopedEmployeeId(requestedEmployeeId: string) {
	const { user } = await validateRequest();
	return resolveFloorEmployeeId(user, requestedEmployeeId);
}

async function getWorkerSelfTaskContext() {
	const { user } = await validateRequest();
	const mode = await getTaskAssignmentMode();
	return resolveWorkerSelfTaskContext(db, user, mode);
}

export async function startSelfTaskAction(
	_prevState: ClockActionState,
	formData: FormData
): Promise<ClockActionState> {
	const context = await getWorkerSelfTaskContext();
	if (!context.ok) {
		return { success: false, error: context.error };
	}

	const taskTypeId = String(formData.get("taskTypeId") || "").trim();
	const notesRaw = formData.get("notes");
	const notes = notesRaw ? String(notesRaw).trim() : null;

	if (!taskTypeId) {
		return { success: false, error: "Task type is required" };
	}

	return startWorkerTask(db, { employeeId: context.employeeId, taskTypeId, notes });
}

export async function switchSelfTaskAction(
	_prevState: ClockActionState,
	formData: FormData
): Promise<ClockActionState> {
	const context = await getWorkerSelfTaskContext();
	if (!context.ok) {
		return { success: false, error: context.error };
	}

	const taskTypeId = String(
		formData.get("newTaskTypeId") || formData.get("taskTypeId") || ""
	).trim();
	const reasonRaw = formData.get("reason");
	const reason = reasonRaw ? String(reasonRaw).trim() : null;

	if (!taskTypeId) {
		return { success: false, error: "New task type is required" };
	}

	return switchWorkerTask(db, { employeeId: context.employeeId, taskTypeId, reason });
}

export async function endSelfTaskAction(
	_prevState: ClockActionState,
	formData: FormData
): Promise<ClockActionState> {
	const context = await getWorkerSelfTaskContext();
	if (!context.ok) {
		return { success: false, error: context.error };
	}

	const notesRaw = formData.get("notes");
	const notes = notesRaw ? String(notesRaw).trim() : "";

	return endWorkerTask(db, { employeeId: context.employeeId, notes });
}

export async function clockIn(
	_prevState: ClockActionState,
	formData: FormData
): Promise<ClockActionState> {
	const requestedEmployeeId = String(formData.get("employeeId") || "");
	const stationId = String(formData.get("stationId") || "");
	const scopedEmployee = await resolveScopedEmployeeId(requestedEmployeeId);
	if (!scopedEmployee.ok) {
		return { success: false, error: scopedEmployee.error };
	}
	const employeeId = scopedEmployee.employeeId;

	if (!employeeId || !stationId) {
		return { success: false, error: "Employee and station are required" };
	}

	await ensureOperationalDataSeeded();

	return clockInWorkSession(db, { employeeId, stationId, clockMethod: "MANUAL" });
}

export async function clockOut(
	_prevState: ClockActionState,
	formData: FormData
): Promise<ClockActionState> {
	const logId = String(formData.get("logId") || "");
	if (!logId) {
		return { success: false, error: "Time log ID is required" };
	}

	const log = await db.timeLog.findUnique({ where: { id: logId }, include: { Employee: true } });
	if (!log || log.type !== "WORK" || log.endTime || log.deletedAt) {
		return { success: false, error: "Active work log not found" };
	}

	const { user } = await validateRequest();
	if (user?.role === "WORKER") {
		if (!user.employeeId || user.employeeId !== log.employeeId) {
			return {
				success: false,
				error: "Workers can only perform floor actions for themselves",
			};
		}
	}

	await db.$transaction(async (tx) => {
		await tx.timeLog.update({
			where: { id: logId },
			data: { endTime: new Date(), updatedAt: new Date() },
		});

		await tx.timeLog.updateMany({
			where: {
				employeeId: log.employeeId,
				type: "BREAK",
				endTime: null,
				deletedAt: null,
			},
			data: { endTime: new Date(), updatedAt: new Date() },
		});
	});

	publishManagerRealtimeEvent("time_log_changed", "monitor", {
		reason: "clock_out",
		employeeId: log.employeeId,
		timeLogId: log.id,
	});
	publishManagerRealtimeEvent("break_changed", "monitor", {
		reason: "clock_out_closed_breaks",
		employeeId: log.employeeId,
	});
	publishManagerRealtimeEvent("worker_status_changed", "monitor", {
		reason: "clock_out",
		employeeId: log.employeeId,
	});

	return { success: true, message: `${log.Employee.name} clocked out` };
}

export async function startBreak(
	_prevState: ClockActionState,
	formData: FormData
): Promise<ClockActionState> {
	const requestedEmployeeId = String(formData.get("employeeId") || "");
	const scopedEmployee = await resolveScopedEmployeeId(requestedEmployeeId);
	if (!scopedEmployee.ok) {
		return { success: false, error: scopedEmployee.error };
	}
	const employeeId = scopedEmployee.employeeId;

	const [activeWorkLog, activeBreakLog] = await Promise.all([
		db.timeLog.findFirst({
			where: { employeeId, type: "WORK", endTime: null, deletedAt: null },
		}),
		db.timeLog.findFirst({
			where: { employeeId, type: "BREAK", endTime: null, deletedAt: null },
		}),
	]);

	if (!activeWorkLog) {
		return { success: false, error: "Employee must be clocked in before starting a break" };
	}

	if (activeBreakLog) {
		return { success: false, error: "Employee is already on break" };
	}

	await db.timeLog.create({
		data: {
			employeeId,
			stationId: activeWorkLog.stationId,
			type: "BREAK",
			startTime: new Date(),
			clockMethod: activeWorkLog.clockMethod,
			updatedAt: new Date(),
		},
	});

	publishManagerRealtimeEvent("break_changed", "monitor", {
		reason: "break_start",
		employeeId,
	});

	return { success: true, message: "Break started" };
}

export async function endBreak(
	_prevState: ClockActionState,
	formData: FormData
): Promise<ClockActionState> {
	const requestedEmployeeId = String(formData.get("employeeId") || "");
	const scopedEmployee = await resolveScopedEmployeeId(requestedEmployeeId);
	if (!scopedEmployee.ok) {
		return { success: false, error: scopedEmployee.error };
	}
	const employeeId = scopedEmployee.employeeId;

	const activeBreakLog = await db.timeLog.findFirst({
		where: { employeeId, type: "BREAK", endTime: null, deletedAt: null },
		orderBy: { startTime: "desc" },
	});

	if (!activeBreakLog) {
		return { success: false, error: "No active break found" };
	}

	await db.timeLog.update({
		where: { id: activeBreakLog.id },
		data: { endTime: new Date(), updatedAt: new Date() },
	});

	publishManagerRealtimeEvent("break_changed", "monitor", {
		reason: "break_end",
		employeeId,
		timeLogId: activeBreakLog.id,
	});

	return { success: true, message: "Break ended" };
}

export async function updateTimeLog(
	_prevState: ClockActionState,
	formData: FormData
): Promise<ClockActionState> {
	const logId = String(formData.get("logId") || "");
	if (!logId) {
		return { success: false, error: "Time log ID is required" };
	}

	const startTimeRaw = String(formData.get("startTime") || "");
	const endTimeRaw = String(formData.get("endTime") || "");
	const typeRaw = String(formData.get("type") || "WORK");
	const stationIdRaw = String(formData.get("stationId") || "");
	const note = String(formData.get("note") || "").trim();

	const startTime = startTimeRaw ? new Date(startTimeRaw) : null;
	const endTime = endTimeRaw ? new Date(endTimeRaw) : null;
	if (!startTime || Number.isNaN(startTime.getTime())) {
		return { success: false, error: "Valid start time is required" };
	}
	if (endTime && Number.isNaN(endTime.getTime())) {
		return { success: false, error: "End time is invalid" };
	}
	if (endTime && endTime <= startTime) {
		return { success: false, error: "End time must be after start time" };
	}

	const type = typeRaw === "BREAK" ? "BREAK" : "WORK";

	await db.timeLog.update({
		where: { id: logId },
		data: {
			startTime,
			endTime,
			type,
			stationId: stationIdRaw || null,
			note: note || null,
			clockMethod: "MANUAL",
			updatedAt: new Date(),
		},
	});

	publishManagerRealtimeEvent("time_log_changed", "monitor", {
		reason: "time_log_updated",
		timeLogId: logId,
	});
	publishManagerRealtimeEvent("worker_status_changed", "monitor", {
		reason: "time_log_updated",
	});

	return { success: true, message: "Time log updated" };
}

export async function deleteTimeLog(
	_prevState: ClockActionState,
	formData: FormData
): Promise<ClockActionState> {
	const logId = String(formData.get("logId") || "");
	if (!logId) {
		return { success: false, error: "Time log ID is required" };
	}

	await db.timeLog.update({
		where: { id: logId },
		data: {
			deletedAt: new Date(),
			updatedAt: new Date(),
			note: "Deleted from time clock UI",
			clockMethod: "MANUAL",
		},
	});

	publishManagerRealtimeEvent("time_log_changed", "monitor", {
		reason: "time_log_deleted",
		timeLogId: logId,
	});
	publishManagerRealtimeEvent("worker_status_changed", "monitor", {
		reason: "time_log_deleted",
	});

	return { success: true, message: "Time log deleted" };
}

export async function checkPinStatus(_prevState: ClockActionState, formData: FormData) {
	const { user } = await validateRequest();
	if (user?.role === "WORKER") {
		return {
			success: false,
			error: "Use your personal worker controls instead of kiosk PIN mode",
		};
	}

	const employeeCode = normalizeEmployeeCode(formData.get("employeeCode"));
	const pin = String(formData.get("pin") || "").trim();

	if (!employeeCode) {
		return { success: false, error: "Employee code is required" };
	}

	if (!/^\d{4,6}$/.test(pin)) {
		return { success: false, error: "PIN must be 4-6 digits" };
	}

	await ensureOperationalDataSeeded();

	const employee = await getActiveEmployeeByCode(db, employeeCode);

	if (!employee?.pinHash) {
		return { success: false, error: "Invalid employee code or PIN" };
	}

	const isMatch = await bcrypt.compare(pin, employee.pinHash);
	if (!isMatch) {
		return { success: false, error: "Invalid employee code or PIN" };
	}

	const activeWorkLog = await db.timeLog.findFirst({
		where: {
			employeeId: employee.id,
			type: "WORK",
			endTime: null,
			deletedAt: null,
		},
		select: { id: true, stationId: true },
	});

	return {
		success: true,
		employeeId: employee.id,
		employeeName: employee.name,
		isClockedIn: !!activeWorkLog,
		lastStationId: employee.lastStationId,
		defaultStationId: employee.defaultStationId,
		employeeCode,
		pin, // Send pin back to include in the final form
	};
}

export async function pinToggleClock(
	_prevState: ClockActionState,
	formData: FormData
): Promise<ClockActionState> {
	const { user } = await validateRequest();
	if (user?.role === "WORKER") {
		return {
			success: false,
			error: "Use your personal worker controls instead of kiosk PIN mode",
		};
	}

	const employeeCode = normalizeEmployeeCode(formData.get("employeeCode"));
	const pin = String(formData.get("pin") || "").trim();
	const selectedStationId = String(formData.get("stationId") || "").trim();

	if (!employeeCode) {
		return { success: false, error: "Employee code is required" };
	}

	if (!/^\d{4,6}$/.test(pin)) {
		return { success: false, error: "PIN must be 4-6 digits" };
	}

	await ensureOperationalDataSeeded();

	const employee = await db.employee.findFirst({
		where: {
			employeeCode,
			status: "ACTIVE",
			pinHash: { not: null },
		},
		include: {
			lastStation: true,
			defaultStation: true,
		},
	});

	if (!employee?.pinHash) {
		return { success: false, error: "Invalid employee code or PIN" };
	}

	const isMatch = await bcrypt.compare(pin, employee.pinHash);
	if (!isMatch) {
		return { success: false, error: "Invalid employee code or PIN" };
	}

	const activeWorkLog = await db.timeLog.findFirst({
		where: {
			employeeId: employee.id,
			type: "WORK",
			endTime: null,
			deletedAt: null,
		},
		orderBy: { startTime: "desc" },
	});

	if (activeWorkLog) {
		await db.$transaction(async (tx) => {
			await tx.timeLog.update({
				where: { id: activeWorkLog.id },
				data: { endTime: new Date(), updatedAt: new Date() },
			});

			await tx.timeLog.updateMany({
				where: {
					employeeId: employee.id,
					type: "BREAK",
					endTime: null,
					deletedAt: null,
				},
				data: { endTime: new Date(), updatedAt: new Date() },
			});
		});

		publishManagerRealtimeEvent("time_log_changed", "monitor", {
			reason: "pin_clock_out",
			employeeId: employee.id,
			timeLogId: activeWorkLog.id,
		});
		publishManagerRealtimeEvent("break_changed", "monitor", {
			reason: "pin_clock_out_closed_breaks",
			employeeId: employee.id,
		});
		publishManagerRealtimeEvent("worker_status_changed", "monitor", {
			reason: "pin_clock_out",
			employeeId: employee.id,
		});

		return { success: true, message: `${employee.name} clocked out` };
	}

	const stationId =
		selectedStationId || employee.lastStationId || employee.defaultStationId || null;

	if (!stationId) {
		return {
			success: false,
			error: "No station available. Select a station before clocking in.",
		};
	}

	const station = await db.station.findUnique({ where: { id: stationId } });
	if (!station || !station.isActive) {
		return { success: false, error: "Selected station is not available" };
	}

	await db.$transaction(async (tx) => {
		await tx.timeLog.create({
			data: {
				employeeId: employee.id,
				stationId,
				type: "WORK",
				startTime: new Date(),
				clockMethod: "PIN",
				updatedAt: new Date(),
			},
		});

		await tx.employee.update({
			where: { id: employee.id },
			data: { lastStationId: stationId },
		});
	});

	publishManagerRealtimeEvent("time_log_changed", "monitor", {
		reason: "pin_clock_in",
		employeeId: employee.id,
	});
	publishManagerRealtimeEvent("worker_status_changed", "monitor", {
		reason: "pin_clock_in",
		employeeId: employee.id,
	});

	return { success: true, message: `${employee.name} clocked in at ${station.name}` };
}
