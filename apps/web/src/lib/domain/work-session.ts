import type { Prisma, PrismaClient } from "@prisma/client";
import { publishManagerRealtimeEvent } from "~/lib/manager-realtime";

type DbClient = PrismaClient | Prisma.TransactionClient;

type WorkSessionResult<T = undefined> =
	| ({ success: true; message: string } & (T extends undefined ? object : T))
	| { success: false; error: string };

export async function hasActiveWorkLog(db: DbClient, employeeId: string) {
	const activeWorkLog = await db.timeLog.findFirst({
		where: { employeeId, type: "WORK", endTime: null, deletedAt: null },
		select: { id: true },
	});

	return Boolean(activeWorkLog);
}

export async function getActiveTaskAssignments(db: DbClient, employeeId: string) {
	return db.taskAssignment.findMany({
		where: { employeeId, endTime: null },
		orderBy: { startTime: "desc" },
		select: { id: true, taskTypeId: true },
	});
}

export async function startWorkerTask(
	db: PrismaClient,
	data: { employeeId: string; taskTypeId: string; notes: string | null }
): Promise<WorkSessionResult> {
	const [taskType, activeWorkLog, activeAssignments] = await Promise.all([
		db.taskType.findUnique({
			where: { id: data.taskTypeId },
			select: { id: true, isActive: true, name: true },
		}),
		hasActiveWorkLog(db, data.employeeId),
		getActiveTaskAssignments(db, data.employeeId),
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
			employeeId: data.employeeId,
			taskTypeId: data.taskTypeId,
			source: "WORKER",
			notes: data.notes,
			startTime: new Date(),
		},
	});

	publishManagerRealtimeEvent("task_assignment_changed", "tasks", {
		reason: "worker_started_task",
		employeeId: data.employeeId,
	});
	publishManagerRealtimeEvent("worker_status_changed", "monitor", {
		reason: "worker_task_started",
		employeeId: data.employeeId,
	});

	return { success: true, message: `Started task: ${taskType.name}` };
}

export async function switchWorkerTask(
	db: PrismaClient,
	data: { employeeId: string; taskTypeId: string; reason: string | null }
): Promise<WorkSessionResult> {
	const [taskType, activeWorkLog, activeAssignments] = await Promise.all([
		db.taskType.findUnique({
			where: { id: data.taskTypeId },
			select: { id: true, isActive: true, name: true },
		}),
		hasActiveWorkLog(db, data.employeeId),
		getActiveTaskAssignments(db, data.employeeId),
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
	if (currentAssignment.taskTypeId === data.taskTypeId) {
		return { success: false, error: "You are already assigned to this task" };
	}

	await db.$transaction(async (tx) => {
		await tx.taskAssignment.update({
			where: { id: currentAssignment.id },
			data: { endTime: new Date() },
		});

		await tx.taskAssignment.create({
			data: {
				employeeId: data.employeeId,
				taskTypeId: data.taskTypeId,
				source: "WORKER",
				notes: data.reason,
				startTime: new Date(),
			},
		});
	});

	publishManagerRealtimeEvent("task_assignment_changed", "tasks", {
		reason: "worker_switched_task",
		employeeId: data.employeeId,
	});
	publishManagerRealtimeEvent("worker_status_changed", "monitor", {
		reason: "worker_task_switched",
		employeeId: data.employeeId,
	});

	return { success: true, message: `Switched to task: ${taskType.name}` };
}

export async function endWorkerTask(
	db: PrismaClient,
	data: { employeeId: string; notes: string }
): Promise<WorkSessionResult> {
	const activeAssignments = await db.taskAssignment.findMany({
		where: { employeeId: data.employeeId, endTime: null },
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
			notes: data.notes
				? `${activeAssignment.notes || ""}\nWorker end note: ${data.notes}`.trim()
				: activeAssignment.notes,
		},
	});

	publishManagerRealtimeEvent("task_assignment_changed", "tasks", {
		reason: "worker_ended_task",
		employeeId: data.employeeId,
		taskAssignmentId: activeAssignment.id,
	});
	publishManagerRealtimeEvent("worker_status_changed", "monitor", {
		reason: "worker_task_ended",
		employeeId: data.employeeId,
	});

	return { success: true, message: `Ended task: ${activeAssignment.TaskType.name}` };
}

export async function clockInWorkSession(
	db: PrismaClient,
	data: { employeeId: string; stationId: string; clockMethod: "MANUAL" | "PIN" }
): Promise<WorkSessionResult> {
	const [employee, station, activeWorkLog] = await Promise.all([
		db.employee.findUnique({ where: { id: data.employeeId } }),
		db.station.findUnique({ where: { id: data.stationId } }),
		db.timeLog.findFirst({
			where: { employeeId: data.employeeId, type: "WORK", endTime: null, deletedAt: null },
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
			employeeId: data.employeeId,
			stationId: data.stationId,
			type: "WORK",
			startTime: new Date(),
			clockMethod: data.clockMethod,
			updatedAt: new Date(),
		},
	});

	await db.employee.update({
		where: { id: data.employeeId },
		data: { lastStationId: data.stationId },
	});

	publishManagerRealtimeEvent("time_log_changed", "monitor", {
		reason: data.clockMethod === "PIN" ? "pin_clock_in" : "clock_in",
		employeeId: data.employeeId,
	});
	publishManagerRealtimeEvent("worker_status_changed", "monitor", {
		reason: data.clockMethod === "PIN" ? "pin_clock_in" : "clock_in",
		employeeId: data.employeeId,
	});

	return { success: true, message: `${employee.name} clocked in at ${station.name}` };
}

export async function assignManagerTask(
	db: PrismaClient,
	data: {
		employeeId: string;
		taskTypeId: string;
		assignedByUserId: string;
		notes?: string;
	}
) {
	const assignment = await db.$transaction(async (tx) => {
		const existingAssignment = await tx.taskAssignment.findFirst({
			where: {
				employeeId: data.employeeId,
				endTime: null,
			},
		});

		if (existingAssignment) {
			throw new Error("Employee already has an active task assignment");
		}

		return tx.taskAssignment.create({
			data: {
				employeeId: data.employeeId,
				taskTypeId: data.taskTypeId,
				source: "MANAGER",
				assignedByUserId: data.assignedByUserId,
				startTime: new Date(),
				notes: data.notes,
			},
			include: {
				Employee: true,
				TaskType: {
					include: { Station: true },
				},
			},
		});
	});

	publishManagerRealtimeEvent("task_assignment_changed", "tasks", {
		reason: "assigned",
		employeeId: data.employeeId,
		taskAssignmentId: assignment.id,
	});
	publishManagerRealtimeEvent("worker_status_changed", "monitor", {
		reason: "task_assigned",
		employeeId: data.employeeId,
	});

	return assignment;
}

export async function completeManagerTask(
	db: PrismaClient,
	data: { taskId: string; unitsCompleted?: number; notes?: string }
) {
	const currentAssignment = await db.taskAssignment.findUnique({
		where: { id: data.taskId },
	});

	if (!currentAssignment) {
		throw new Error("Task assignment not found");
	}

	const assignment = await db.taskAssignment.update({
		where: { id: data.taskId },
		data: {
			endTime: new Date(),
			unitsCompleted: data.unitsCompleted,
			notes: data.notes
				? `${currentAssignment.notes || ""}\nCompletion: ${data.notes}`
				: currentAssignment.notes,
		},
		include: {
			Employee: true,
			TaskType: {
				include: { Station: true },
			},
		},
	});

	publishManagerRealtimeEvent("task_assignment_changed", "tasks", {
		reason: "completed",
		employeeId: assignment.employeeId,
		taskAssignmentId: assignment.id,
	});
	publishManagerRealtimeEvent("worker_status_changed", "monitor", {
		reason: "task_completed",
		employeeId: assignment.employeeId,
	});

	return assignment;
}

export async function switchManagerTask(
	db: PrismaClient,
	data: { employeeId: string; newTaskTypeId: string; assignedByUserId: string; reason?: string }
) {
	const nextAssignment = await db.$transaction(async (tx) => {
		const [currentAssignment, employee] = await Promise.all([
			tx.taskAssignment.findFirst({
				where: {
					employeeId: data.employeeId,
					endTime: null,
				},
			}),
			tx.employee.findUnique({
				where: { id: data.employeeId },
			}),
		]);

		if (!employee) {
			throw new Error("Employee not found");
		}

		if (currentAssignment) {
			await tx.taskAssignment.update({
				where: { id: currentAssignment.id },
				data: {
					endTime: new Date(),
					notes: `Switched to new task. Reason: ${data.reason || "Manager override"}. ${currentAssignment.notes || ""}`,
				},
			});
		}

		return tx.taskAssignment.create({
			data: {
				employeeId: data.employeeId,
				taskTypeId: data.newTaskTypeId,
				source: "MANAGER",
				assignedByUserId: data.assignedByUserId,
				startTime: new Date(),
				notes: data.reason,
			},
			include: {
				Employee: true,
				TaskType: {
					include: { Station: true },
				},
			},
		});
	});

	publishManagerRealtimeEvent("task_assignment_changed", "tasks", {
		reason: "switched",
		employeeId: data.employeeId,
		taskAssignmentId: nextAssignment.id,
	});
	publishManagerRealtimeEvent("worker_status_changed", "monitor", {
		reason: "task_switched",
		employeeId: data.employeeId,
	});

	return nextAssignment;
}
