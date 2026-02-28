"use server";

import bcrypt from "bcryptjs";
import { db } from "~/lib/db";
import { ensureOperationalDataSeeded } from "~/lib/ensure-operational-data";
import { validateRequest } from "~/lib/auth";
import { getTaskAssignmentMode } from "~/lib/operational-config";
import { getWorkerSelfAssignmentAccess } from "~/lib/task-assignment-permissions";
import { publishManagerRealtimeEvent } from "~/lib/manager-realtime";

export type ClockActionState = {
	error?: string;
	success?: boolean;
	message?: string;
} | null;

type WorkerSelfTaskContext = { ok: true; employeeId: string } | { ok: false; error: string };

async function getWorkerSelfTaskContext(): Promise<WorkerSelfTaskContext> {
	const { user } = await validateRequest();
	const mode = await getTaskAssignmentMode();
	const access = getWorkerSelfAssignmentAccess(user, mode);

	if (!access.ok) {
		return { ok: false, error: access.error };
	}

	const employee = await db.employee.findUnique({
		where: { id: access.employeeId },
		select: { id: true, status: true },
	});

	if (!employee || employee.status !== "ACTIVE") {
		return { ok: false, error: "Linked employee is not active" };
	}

	return { ok: true, employeeId: employee.id };
}

async function hasActiveWorkLog(employeeId: string) {
	const activeWorkLog = await db.timeLog.findFirst({
		where: { employeeId, type: "WORK", endTime: null, deletedAt: null },
		select: { id: true },
	});

	return Boolean(activeWorkLog);
}

async function getActiveAssignments(employeeId: string) {
	return db.taskAssignment.findMany({
		where: { employeeId, endTime: null },
		orderBy: { startTime: "desc" },
		select: { id: true, taskTypeId: true },
	});
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

	const [taskType, activeWorkLog, activeAssignments] = await Promise.all([
		db.taskType.findUnique({
			where: { id: taskTypeId },
			select: { id: true, isActive: true, name: true },
		}),
		hasActiveWorkLog(context.employeeId),
		getActiveAssignments(context.employeeId),
	]);

	if (!taskType || !taskType.isActive) {
		return { success: false, error: "Task type is not available" };
	}

	if (!activeWorkLog) {
		return { success: false, error: "Clock in before starting a task" };
	}

	if (activeAssignments.length > 0) {
		return { success: false, error: "End or switch your active task before starting a new one" };
	}

	await db.taskAssignment.create({
		data: {
			employeeId: context.employeeId,
			taskTypeId,
			source: "WORKER",
			notes,
			startTime: new Date(),
		},
	});

	publishManagerRealtimeEvent("task_assignment_changed", "tasks", {
		reason: "worker_started_task",
		employeeId: context.employeeId,
	});
	publishManagerRealtimeEvent("worker_status_changed", "monitor", {
		reason: "worker_task_started",
		employeeId: context.employeeId,
	});

	return { success: true, message: `Started task: ${taskType.name}` };
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

	const [taskType, activeWorkLog, activeAssignments] = await Promise.all([
		db.taskType.findUnique({
			where: { id: taskTypeId },
			select: { id: true, isActive: true, name: true },
		}),
		hasActiveWorkLog(context.employeeId),
		getActiveAssignments(context.employeeId),
	]);

	if (!taskType || !taskType.isActive) {
		return { success: false, error: "Task type is not available" };
	}

	if (!activeWorkLog) {
		return { success: false, error: "Clock in before switching tasks" };
	}

	if (activeAssignments.length === 0) {
		return { success: false, error: "No active task to switch" };
	}

	if (activeAssignments.length > 1) {
		return {
			success: false,
			error: "Multiple active task assignments found; manager intervention required",
		};
	}

	const [currentAssignment] = activeAssignments;
	if (currentAssignment.taskTypeId === taskTypeId) {
		return { success: false, error: "You are already assigned to this task" };
	}

	await db.$transaction(async (tx) => {
		await tx.taskAssignment.update({
			where: { id: currentAssignment.id },
			data: { endTime: new Date() },
		});

		await tx.taskAssignment.create({
			data: {
				employeeId: context.employeeId,
				taskTypeId,
				source: "WORKER",
				notes: reason,
				startTime: new Date(),
			},
		});
	});

	publishManagerRealtimeEvent("task_assignment_changed", "tasks", {
		reason: "worker_switched_task",
		employeeId: context.employeeId,
	});
	publishManagerRealtimeEvent("worker_status_changed", "monitor", {
		reason: "worker_task_switched",
		employeeId: context.employeeId,
	});

	return { success: true, message: `Switched to task: ${taskType.name}` };
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

	const activeAssignments = await db.taskAssignment.findMany({
		where: { employeeId: context.employeeId, endTime: null },
		orderBy: { startTime: "desc" },
		include: {
			TaskType: {
				select: { name: true },
			},
		},
	});

	if (activeAssignments.length === 0) {
		return { success: false, error: "No active task to end" };
	}

	if (activeAssignments.length > 1) {
		return {
			success: false,
			error: "Multiple active task assignments found; manager intervention required",
		};
	}

	const [activeAssignment] = activeAssignments;

	await db.taskAssignment.update({
		where: { id: activeAssignment.id },
		data: {
			endTime: new Date(),
			notes: notes
				? `${activeAssignment.notes || ""}\nWorker end note: ${notes}`.trim()
				: activeAssignment.notes,
		},
	});

	publishManagerRealtimeEvent("task_assignment_changed", "tasks", {
		reason: "worker_ended_task",
		employeeId: context.employeeId,
		taskAssignmentId: activeAssignment.id,
	});
	publishManagerRealtimeEvent("worker_status_changed", "monitor", {
		reason: "worker_task_ended",
		employeeId: context.employeeId,
	});

	return { success: true, message: `Ended task: ${activeAssignment.TaskType.name}` };
}

export async function clockIn(
	_prevState: ClockActionState,
	formData: FormData
): Promise<ClockActionState> {
	const employeeId = String(formData.get("employeeId") || "");
	const stationId = String(formData.get("stationId") || "");

	if (!employeeId || !stationId) {
		return { success: false, error: "Employee and station are required" };
	}

	await ensureOperationalDataSeeded();

	const [employee, station, activeWorkLog] = await Promise.all([
		db.employee.findUnique({ where: { id: employeeId } }),
		db.station.findUnique({ where: { id: stationId } }),
		db.timeLog.findFirst({
			where: { employeeId, type: "WORK", endTime: null, deletedAt: null },
		}),
	]);

	if (!employee || employee.status !== "ACTIVE") {
		return { success: false, error: "Employee is not active" };
	}

	if (!station || !station.isActive) {
		return { success: false, error: "Station is not available" };
	}

	if (activeWorkLog) {
		return { success: false, error: `${employee.name} is already clocked in` };
	}

	await db.timeLog.create({
		data: {
			employeeId,
			stationId,
			type: "WORK",
			startTime: new Date(),
			clockMethod: "MANUAL",
			updatedAt: new Date(),
		},
	});

	await db.employee.update({ where: { id: employeeId }, data: { lastStationId: stationId } });

	publishManagerRealtimeEvent("time_log_changed", "monitor", {
		reason: "clock_in",
		employeeId,
	});
	publishManagerRealtimeEvent("worker_status_changed", "monitor", {
		reason: "clock_in",
		employeeId,
	});

	return { success: true, message: `${employee.name} clocked in at ${station.name}` };
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
	const employeeId = String(formData.get("employeeId") || "");
	if (!employeeId) {
		return { success: false, error: "Employee is required" };
	}

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
	const employeeId = String(formData.get("employeeId") || "");
	if (!employeeId) {
		return { success: false, error: "Employee is required" };
	}

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

export async function pinToggleClock(
	_prevState: ClockActionState,
	formData: FormData
): Promise<ClockActionState> {
	const pin = String(formData.get("pin") || "").trim();
	const selectedStationId = String(formData.get("stationId") || "").trim();

	if (!/^\d{4,6}$/.test(pin)) {
		return { success: false, error: "PIN must be 4-6 digits" };
	}

	await ensureOperationalDataSeeded();

	const employees = await db.employee.findMany({
		where: {
			status: "ACTIVE",
			pinHash: { not: null },
		},
		include: {
			lastStation: true,
			defaultStation: true,
		},
	});

	let matchedEmployee: (typeof employees)[number] | null = null;
	for (const employee of employees) {
		if (!employee.pinHash) {
			continue;
		}
		const isMatch = await bcrypt.compare(pin, employee.pinHash);
		if (isMatch) {
			matchedEmployee = employee;
			break;
		}
	}

	if (!matchedEmployee) {
		return { success: false, error: "Invalid PIN" };
	}

	const activeWorkLog = await db.timeLog.findFirst({
		where: {
			employeeId: matchedEmployee.id,
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
					employeeId: matchedEmployee!.id,
					type: "BREAK",
					endTime: null,
					deletedAt: null,
				},
				data: { endTime: new Date(), updatedAt: new Date() },
			});
		});

		publishManagerRealtimeEvent("time_log_changed", "monitor", {
			reason: "pin_clock_out",
			employeeId: matchedEmployee.id,
			timeLogId: activeWorkLog.id,
		});
		publishManagerRealtimeEvent("break_changed", "monitor", {
			reason: "pin_clock_out_closed_breaks",
			employeeId: matchedEmployee.id,
		});
		publishManagerRealtimeEvent("worker_status_changed", "monitor", {
			reason: "pin_clock_out",
			employeeId: matchedEmployee.id,
		});

		return { success: true, message: `${matchedEmployee.name} clocked out` };
	}

	const stationId =
		selectedStationId || matchedEmployee.lastStationId || matchedEmployee.defaultStationId || null;

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
				employeeId: matchedEmployee!.id,
				stationId,
				type: "WORK",
				startTime: new Date(),
				clockMethod: "PIN",
				updatedAt: new Date(),
			},
		});

		await tx.employee.update({
			where: { id: matchedEmployee!.id },
			data: { lastStationId: stationId },
		});
	});

	publishManagerRealtimeEvent("time_log_changed", "monitor", {
		reason: "pin_clock_in",
		employeeId: matchedEmployee.id,
	});
	publishManagerRealtimeEvent("worker_status_changed", "monitor", {
		reason: "pin_clock_in",
		employeeId: matchedEmployee.id,
	});

	return { success: true, message: `${matchedEmployee.name} clocked in at ${station.name}` };
}
