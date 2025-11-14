import type { PrismaClient } from "@prisma/client";

export interface TaskAssignmentFilters {
	employeeId?: string;
	taskTypeId?: string;
	startDate?: Date;
	endDate?: Date;
	activeOnly?: boolean;
	includeRelations?: boolean;
	limit?: number;
}

export async function listTaskAssignments(db: PrismaClient, filters: TaskAssignmentFilters = {}) {
	const where: any = {};

	if (filters.employeeId) where.employeeId = filters.employeeId;
	if (filters.taskTypeId) where.taskTypeId = filters.taskTypeId;
	if (filters.activeOnly) where.endTime = null;

	if (filters.startDate || filters.endDate) {
		where.startTime = {};
		if (filters.startDate) where.startTime.gte = filters.startDate;
		if (filters.endDate) where.startTime.lte = filters.endDate;
	}

	return db.taskAssignment.findMany({
		where,
		include: filters.includeRelations
			? {
					Employee: true,
					TaskType: { include: { Station: true } },
				}
			: undefined,
		orderBy: { startTime: "desc" },
		take: filters.limit,
	});
}

export async function getTaskAssignment(db: PrismaClient, id: string) {
	return db.taskAssignment.findUnique({
		where: { id },
		include: {
			Employee: true,
			TaskType: { include: { Station: true } },
		},
	});
}

export async function createTaskAssignment(
	db: PrismaClient,
	data: { employeeId: string; taskTypeId: string; notes?: string }
) {
	return db.taskAssignment.create({
		data: {
			employeeId: data.employeeId,
			taskTypeId: data.taskTypeId,
			startTime: new Date(),
			notes: data.notes,
		},
		include: {
			Employee: true,
			TaskType: true,
		},
	});
}

export async function completeTaskAssignment(
	db: PrismaClient,
	id: string,
	data: { unitsCompleted?: number; notes?: string }
) {
	return db.taskAssignment.update({
		where: { id },
		data: {
			endTime: new Date(),
			unitsCompleted: data.unitsCompleted,
			notes: data.notes,
		},
		include: {
			Employee: true,
			TaskType: true,
		},
	});
}

export async function switchTaskAssignment(
	db: PrismaClient,
	employeeId: string,
	newTaskTypeId: string,
	reason?: string
) {
	const current = await db.taskAssignment.findFirst({
		where: { employeeId, endTime: null },
	});

	if (current) {
		await db.taskAssignment.update({
			where: { id: current.id },
			data: {
				endTime: new Date(),
				notes: `Switched task: ${reason || "Manager override"}. ${current.notes || ""}`,
			},
		});
	}

	return createTaskAssignment(db, {
		employeeId,
		taskTypeId: newTaskTypeId,
		notes: reason,
	});
}

export async function listTaskTypes(db: PrismaClient) {
	return db.taskType.findMany({
		where: { isActive: true },
		include: { Station: true },
		orderBy: { name: "asc" },
	});
}

export async function createTaskType(
	db: PrismaClient,
	data: { name: string; stationId: string; description?: string; estimatedMinutesPerUnit?: number }
) {
	return db.taskType.create({
		data,
		include: { Station: true },
	});
}

export async function updateTaskType(
	db: PrismaClient,
	id: string,
	data: {
		name?: string;
		description?: string;
		estimatedMinutesPerUnit?: number;
		isActive?: boolean;
	}
) {
	return db.taskType.update({
		where: { id },
		data,
		include: { Station: true },
	});
}

export interface TaskProductivitySummary {
	assignmentId: string;
	employeeId: string;
	unitsCompleted: number;
	durationMinutes: number;
	efficiency: number;
	date: string;
}

export function calculateProductivity(
	assignments: {
		id: string;
		employeeId: string;
		startTime: Date;
		endTime: Date | null;
		unitsCompleted: number | null;
	}[]
): TaskProductivitySummary[] {
	return assignments
		.filter((assignment) => assignment.unitsCompleted && assignment.endTime)
		.map((assignment) => {
			const durationMinutes =
				(new Date(assignment.endTime!).getTime() - new Date(assignment.startTime).getTime()) /
				(1000 * 60);

			const efficiency =
				assignment.unitsCompleted && durationMinutes > 0
					? assignment.unitsCompleted / (durationMinutes / 60)
					: 0;

			return {
				assignmentId: assignment.id,
				employeeId: assignment.employeeId,
				unitsCompleted: assignment.unitsCompleted ?? 0,
				durationMinutes,
				efficiency,
				date: assignment.startTime.toISOString().split("T")[0],
			};
		});
}
