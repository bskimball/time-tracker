"use server";

import { db } from "~/lib/db";
import { validateRequest } from "~/lib/auth";

import type { TaskAssignment, TaskType } from "./types";
import type { Prisma } from "@prisma/client";

export async function getTaskTypes() {
	return await db.taskType.findMany({
		where: { isActive: true },
		include: {
			Station: true,
		},
		orderBy: { name: "asc" },
	});
}

export async function getActiveTaskAssignments() {
	return await db.taskAssignment.findMany({
		where: {
			endTime: null,
		},
		include: {
			Employee: true,
			TaskType: {
				include: { Station: true },
			},
		},
		orderBy: { startTime: "desc" },
	});
}

export async function getEmployees() {
	return await db.employee.findMany({
		where: { status: "ACTIVE" },
		include: {
			defaultStation: true,
		},
		orderBy: { name: "asc" },
	});
}

export async function getStations() {
	return await db.station.findMany({
		where: { isActive: true },
		orderBy: { name: "asc" },
	});
}

export async function assignTask(data: {
	employeeId: string;
	taskTypeId: string;
	priority: "LOW" | "MEDIUM" | "HIGH";
	notes?: string;
}) {
	const { user } = await validateRequest();
	if (!user) {
		throw new Error("Unauthorized");
	}

	// Check if employee has an active task
	const existingAssignment = await db.taskAssignment.findFirst({
		where: {
			employeeId: data.employeeId,
			endTime: null,
		},
	});

	if (existingAssignment) {
		throw new Error("Employee already has an active task assignment");
	}

	// Create new task assignment
	const assignment = await db.taskAssignment.create({
		data: {
			employeeId: data.employeeId,
			taskTypeId: data.taskTypeId,
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

	return assignment;
}

export async function assignTaskAction(
	_prevState: { error?: string | null; success?: boolean } | null,
	formData: FormData
): Promise<{
	assignment?: TaskAssignment;
	activeAssignments?: TaskAssignment[];
	error?: string | null;
	success?: boolean;
}> {
	try {
		const employeeId = String(formData.get("employeeId") || "");
		const taskTypeId = String(formData.get("taskTypeId") || "");
		const priority = (String(formData.get("priority") || "MEDIUM") || "MEDIUM") as
			| "LOW"
			| "MEDIUM"
			| "HIGH";
		const notesValue = formData.get("notes");
		const notes = notesValue ? String(notesValue) : undefined;

		if (!employeeId || !taskTypeId) {
			return { error: "Employee and task type are required", success: false };
		}

		const assignment = await assignTask({
			employeeId,
			taskTypeId,
			priority,
			notes,
		});

		// Re-fetch active assignments so the client can update without a full reload
		const activeAssignments = await getActiveTaskAssignments();

		return { assignment, activeAssignments, success: true };
	} catch (error: unknown) {
		return {
			error: error instanceof Error ? error.message : "Failed to assign task",
			success: false,
		};
	}
}

export async function completeTask(taskId: string, unitsCompleted?: number, notes?: string) {
	const { user } = await validateRequest();
	if (!user) {
		throw new Error("Unauthorized");
	}

	// First get the current assignment to access its notes
	const currentAssignment = await db.taskAssignment.findUnique({
		where: { id: taskId },
	});

	if (!currentAssignment) {
		throw new Error("Task assignment not found");
	}

	// End the task assignment
	const assignment = await db.taskAssignment.update({
		where: { id: taskId },
		data: {
			endTime: new Date(),
			unitsCompleted: unitsCompleted,
			notes: notes
				? `${currentAssignment.notes || ""}\nCompletion: ${notes}`
				: currentAssignment.notes,
		},
		include: {
			Employee: true,
			TaskType: {
				include: { Station: true },
			},
		},
	});

	return assignment;
}

export async function switchTask(employeeId: string, newTaskTypeId: string, reason?: string) {
	const { user } = await validateRequest();
	if (!user) {
		throw new Error("Unauthorized");
	}

	const [currentAssignment, employee] = await Promise.all([
		db.taskAssignment.findFirst({
			where: {
				employeeId: employeeId,
				endTime: null,
			},
		}),
		db.employee.findUnique({
			where: { id: employeeId },
		}),
	]);

	if (!employee) {
		throw new Error("Employee not found");
	}

	if (!currentAssignment) {
		// No existing task, just assign new one
		return await assignTask({
			employeeId,
			taskTypeId: newTaskTypeId,
			priority: "MEDIUM",
			notes: reason,
		});
	}

	// Complete current task and assign new one
	await Promise.all([
		db.taskAssignment.update({
			where: { id: currentAssignment.id },
			data: {
				endTime: new Date(),
				notes: `Switched to new task. Reason: ${reason || "Manager override"}. ${currentAssignment.notes || ""}`,
			},
		}),
	]);

	// Create new assignment
	return await db.taskAssignment.create({
		data: {
			employeeId: employeeId,
			taskTypeId: newTaskTypeId,
			startTime: new Date(),
			notes: reason,
		},
		include: {
			Employee: true,
			TaskType: {
				include: { Station: true },
			},
		},
	});
}

export async function createTaskType(data: {
	name: string;
	stationId: string;
	description?: string;
	estimatedMinutesPerUnit?: number;
}) {
	const { user } = await validateRequest();
	if (!user) {
		throw new Error("Unauthorized");
	}

	const taskType = await db.taskType.create({
		data: {
			name: data.name,
			stationId: data.stationId,
			description: data.description,
			estimatedMinutesPerUnit: data.estimatedMinutesPerUnit,
		},
		include: {
			Station: true,
		},
	});

	return taskType;
}

export async function createTaskTypeAction(
	_prevState: { error?: string | null; success?: boolean } | null,
	formData: FormData
): Promise<{
	TaskType?: TaskType;
	error?: string | null;
	success?: boolean;
}> {
	try {
		const name = String(formData.get("name") || "").trim();
		const stationId = String(formData.get("stationId") || "");
		const descriptionValue = formData.get("description");
		const estimatedMinutesValue = formData.get("estimatedMinutesPerUnit");
		const description = descriptionValue ? String(descriptionValue).trim() : undefined;
		const estimatedMinutesPerUnit = estimatedMinutesValue
			? Number.parseFloat(String(estimatedMinutesValue))
			: undefined;

		if (!name || !stationId) {
			return { error: "Name and station are required", success: false };
		}

		const TaskType = await createTaskType({
			name,
			stationId,
			description,
			estimatedMinutesPerUnit,
		});

		return { TaskType, success: true };
	} catch (error: unknown) {
		return {
			error: error instanceof Error ? error.message : "Failed to create task type",
			success: false,
		};
	}
}

export async function updateTaskType(
	id: string,
	data: {
		name?: string;
		description?: string;
		estimatedMinutesPerUnit?: number;
		isActive?: boolean;
	}
) {
	const { user } = await validateRequest();
	if (!user) {
		throw new Error("Unauthorized");
	}

	const taskType = await db.taskType.update({
		where: { id },
		data,
		include: {
			Station: true,
		},
	});

	return taskType;
}

export async function getTaskHistory(
	startDate?: Date,
	endDate?: Date,
	employeeId?: string,
	taskTypeId?: string
) {
	const whereClause: Prisma.TaskAssignmentWhereInput = {};

	if (startDate || endDate) {
		whereClause.startTime = {};
		if (startDate) whereClause.startTime.gte = startDate;
		if (endDate) whereClause.startTime.lte = endDate;
	}

	if (employeeId) {
		whereClause.employeeId = employeeId;
	}

	if (taskTypeId) {
		whereClause.taskTypeId = taskTypeId;
	}

	const history = await db.taskAssignment.findMany({
		where: whereClause,
		include: {
			Employee: true,
			TaskType: {
				include: { Station: true },
			},
		},
		orderBy: { startTime: "desc" },
		take: 100, // Limit for performance
	});

	return history;
}

export async function getProductivityMetrics(
	employeeId?: string,
	taskTypeId?: string,
	startDate?: Date,
	endDate?: Date
) {
	const whereClause: Prisma.TaskAssignmentWhereInput = {};

	if (startDate || endDate) {
		whereClause.startTime = {};
		if (startDate) whereClause.startTime.gte = startDate;
		if (endDate) whereClause.startTime.lte = endDate;
	}

	if (employeeId) {
		whereClause.employeeId = employeeId;
	}

	if (taskTypeId) {
		whereClause.taskTypeId = taskTypeId;
	}

	const assignments = await db.taskAssignment.findMany({
		where: whereClause,
		include: {
			Employee: true,
			TaskType: true,
		},
	});

	// Calculate productivity metrics
	const metrics = assignments.map((assignment) => {
		const duration = assignment.endTime
			? (new Date(assignment.endTime).getTime() - new Date(assignment.startTime).getTime()) /
				(1000 * 60)
			: 0; // Convert to minutes

		return {
			employee: assignment.Employee.name,
			taskType: assignment.TaskType.name,
			duration: duration,
			unitsCompleted: assignment.unitsCompleted || 0,
			efficiency:
				assignment.unitsCompleted && duration > 0
					? assignment.unitsCompleted / (duration * 60) // units per hour
					: 0,
			date: new Date(assignment.startTime).toISOString().split("T")[0],
		};
	});

	return metrics;
}
