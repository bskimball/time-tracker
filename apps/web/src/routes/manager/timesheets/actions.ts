"use server";

import { db } from "~/lib/db";
import type { Prisma } from "@prisma/client";
import { validateRequest } from "~/lib/auth";

export async function getTimeLogsWithCorrections(
	employeeId?: string,
	startDate?: Date,
	endDate?: Date,
	includeCorrections = true,
	page = 1,
	limit = 50
) {
	const skip = (page - 1) * limit;
	const where: Prisma.TimeLogWhereInput = {};

	if (employeeId) {
		where.employeeId = employeeId;
	}

	if (startDate && endDate) {
		where.startTime = {
			gte: startDate,
			lte: endDate,
		};
	} else if (startDate) {
		where.startTime = {
			gte: startDate,
		};
	} else if (endDate) {
		where.startTime = {
			lte: endDate,
		};
	}

	// Include both normal logs and corrections (deleted ones)
	const logs = await db.timeLog.findMany({
		where: {
			...where,
			...(includeCorrections ? {} : { deletedAt: null }),
		},
		include: {
			Employee: true,
			Station: true,
		},
		orderBy: { startTime: "desc" },
		skip,
		take: limit,
	});

	const total = await db.timeLog.count({ where });

	return { logs, total, totalPages: Math.ceil(total / limit) };
}

export async function createTimeCorrection(data: {
	employeeId: string;
	startTime: Date;
	endTime?: Date;
	stationId?: string;
	type: "WORK" | "BREAK";
	note?: string;
	reason: string;
	isAddition?: boolean;
}) {
	const { user } = await validateRequest();
	if (!user) {
		throw new Error("Unauthorized");
	}

	// Validate no overlapping time entries for this employee
	const overlapCheck = await db.timeLog.findFirst({
		where: {
			employeeId: data.employeeId,
			startTime: {
				lt: data.endTime || data.startTime,
			},
			OR: data.endTime
				? [{ endTime: { gt: data.startTime } }, { endTime: null }]
				: [{ endTime: null }],
			deletedAt: null,
		},
	});

	if (overlapCheck && !data.isAddition) {
		throw new Error("Time entry overlaps with existing record");
	}

	const timeLog = await db.timeLog.create({
		data: {
			employeeId: data.employeeId,
			stationId: data.stationId,
			type: data.type,
			startTime: data.startTime,
			endTime: data.endTime,
			note: data.reason + (data.note ? `\n\nManager note: ${data.note}` : ""),
			clockMethod: "MANUAL",
			correctedBy: user.id,
			updatedAt: new Date(),
		},
		include: {
			Employee: true,
			Station: true,
		},
	});

	return timeLog;
}

export async function editTimeCorrection(
	id: string,
	data: {
		startTime?: Date;
		endTime?: Date;
		stationId?: string;
		type?: "WORK" | "BREAK";
		note?: string;
		reason?: string;
	}
) {
	const { user } = await validateRequest();
	if (!user) {
		throw new Error("Unauthorized");
	}

	// Check if time log exists
	const existingLog = await db.timeLog.findUnique({
		where: { id },
	});

	if (!existingLog) {
		throw new Error("Time log not found");
	}

	// Validate no overlapping entries if changing times
	if (data.startTime || data.endTime) {
		const overlapCheck = await db.timeLog.findFirst({
			where: {
				id: { not: id },
				employeeId: existingLog.employeeId,
				startTime: {
					lt: data.endTime || existingLog.endTime || data.startTime,
				},
				OR: [{ endTime: { gt: data.startTime || existingLog.startTime } }, { endTime: null }],
				deletedAt: null,
			},
		});

		if (overlapCheck) {
			throw new Error("Edited time would overlap with existing record");
		}
	}

	const updatedLog = await db.timeLog.update({
		where: { id },
		data: {
			...data,
			note: data.reason || data.note,
			correctedBy: user.id,
		},
		include: {
			Employee: true,
			Station: true,
		},
	});

	return updatedLog;
}

export async function deleteTimeCorrection(id: string, reason: string) {
	const { user } = await validateRequest();
	if (!user) {
		throw new Error("Unauthorized");
	}

	// Soft delete by marking as deleted
	const deletedLog = await db.timeLog.update({
		where: { id },
		data: {
			deletedAt: new Date(),
			correctedBy: user.id,
			note: `DELETED: ${reason}`,
		},
		include: {
			Employee: true,
			Station: true,
		},
	});

	return deletedLog;
}

export async function approveCorrection(id: string) {
	const { user } = await validateRequest();
	if (!user) {
		throw new Error("Unauthorized");
	}

	// For now, manual corrections are automatically "approved"
	// when created by managers
	// In a more complex system, you might have an approval workflow table

	const log = await db.timeLog.findUnique({
		where: { id },
		include: { Employee: true, Station: true },
	});

	if (!log) {
		throw new Error("Time log not found");
	}

	return log;
}

export async function getCorrectionHistory(employeeId?: string, limit = 100) {
	const where: Prisma.TimeLogWhereInput = {
		clockMethod: "MANUAL",
	};

	if (employeeId) {
		where.employeeId = employeeId;
	}

	const corrections = await db.timeLog.findMany({
		where,
		include: {
			Employee: true,
			Station: true,
		},
		orderBy: { createdAt: "desc" },
		take: limit,
	});

	return corrections;
}

export async function bulkCreateCorrections(
	corrections: Array<{
		employeeId: string;
		startTime: Date;
		endTime?: Date;
		stationId?: string;
		type: "WORK" | "BREAK";
		note?: string;
		reason: string;
	}>
) {
	const { user } = await validateRequest();
	if (!user) {
		throw new Error("Unauthorized");
	}

	// Create all corrections in a transaction
	const createdCorrections = await db.$transaction(async (tx) => {
		const results = [];

		for (const correction of corrections) {
			// Check for overlaps
			const overlapCheck = await tx.timeLog.findFirst({
				where: {
					employeeId: correction.employeeId,
					startTime: {
						lt: correction.endTime || correction.startTime,
					},
					OR: correction.endTime
						? [{ endTime: { gt: correction.startTime } }, { endTime: null }]
						: [{ endTime: null }],
					deletedAt: null,
				},
			});

			if (overlapCheck) {
				throw new Error(`Overlapping time entry for ${correction.employeeId}`);
			}

			const timeLog = await tx.timeLog.create({
				data: {
					employeeId: correction.employeeId,
					stationId: correction.stationId,
					type: correction.type,
					startTime: correction.startTime,
					endTime: correction.endTime,
					note: `BULK CORRECTION: ${correction.reason}`,
					clockMethod: "MANUAL",
					correctedBy: user.id,
					updatedAt: new Date(),
				},
				include: {
					Employee: true,
					Station: true,
				},
			});

			results.push(timeLog);
		}

		return results;
	});

	return createdCorrections;
}

export async function getEmployeesForCorrection() {
	return await db.employee.findMany({
		where: {
			status: "ACTIVE",
		},
		include: {
			defaultStation: true,
		},
		orderBy: { name: "asc" },
	});
}

export async function getActiveTimeLogs() {
	return await db.timeLog.findMany({
		where: {
			endTime: null,
			deletedAt: null,
		},
		include: {
			Employee: true,
			Station: true,
		},
		orderBy: { startTime: "desc" },
	});
}

export async function getActiveEmployeesForTimesheet() {
	const [activeLogs, activeAssignments] = await Promise.all([
		db.timeLog.findMany({
			where: {
				endTime: null,
				deletedAt: null,
			},
			include: {
				Employee: true,
				Station: true,
			},
			orderBy: { startTime: "desc" },
		}),
		db.taskAssignment.findMany({
			where: { endTime: null },
			select: {
				employeeId: true,
				startTime: true,
				Employee: {
					select: {
						name: true,
						email: true,
					},
				},
				TaskType: {
					select: {
						name: true,
						Station: true,
					},
				},
			},
			orderBy: { startTime: "desc" },
		}),
	]);

	type ActiveEmployeeEntry = {
		employeeId: string;
		employeeName: string;
		employeeEmail: string;
		startTime: Date;
		stationName: string | null;
		type: "WORK" | "BREAK" | "TASK";
		source: "TIME_LOG" | "TASK_ASSIGNMENT";
		assignmentSource: "MANAGER" | "WORKER" | null;
		clockMethod: "PIN" | "CARD" | "BIOMETRIC" | "MANUAL" | null;
		timeLogId: string | null;
		taskTypeName: string | null;
	};

	const clockedInByEmployee = new Map<string, ActiveEmployeeEntry>();
	const floorActiveByEmployee = new Map<string, ActiveEmployeeEntry>();

	for (const log of activeLogs) {
		if (!clockedInByEmployee.has(log.employeeId)) {
			clockedInByEmployee.set(log.employeeId, {
				employeeId: log.employeeId,
				employeeName: log.Employee.name,
				employeeEmail: log.Employee.email,
				startTime: log.startTime,
				stationName: log.Station?.name ?? null,
				type: log.type,
				source: "TIME_LOG",
				assignmentSource: null,
				clockMethod: log.clockMethod,
				timeLogId: log.id,
				taskTypeName: null,
			});
		}

		if (log.type !== "WORK" || floorActiveByEmployee.has(log.employeeId)) {
			continue;
		}

		floorActiveByEmployee.set(log.employeeId, {
			employeeId: log.employeeId,
			employeeName: log.Employee.name,
			employeeEmail: log.Employee.email,
			startTime: log.startTime,
			stationName: log.Station?.name ?? null,
			type: log.type,
			source: "TIME_LOG",
			assignmentSource: null,
			clockMethod: log.clockMethod,
			timeLogId: log.id,
			taskTypeName: null,
		});
	}

	for (const assignment of activeAssignments) {
		if (floorActiveByEmployee.has(assignment.employeeId)) {
			continue;
		}

		floorActiveByEmployee.set(assignment.employeeId, {
			employeeId: assignment.employeeId,
			employeeName: assignment.Employee.name,
			employeeEmail: assignment.Employee.email,
			startTime: assignment.startTime,
			stationName: assignment.TaskType.Station.name,
			type: "TASK",
			source: "TASK_ASSIGNMENT",
			assignmentSource: null,
			clockMethod: null,
			timeLogId: null,
			taskTypeName: assignment.TaskType.name,
		});
	}

	const sortByStartDesc = (a: ActiveEmployeeEntry, b: ActiveEmployeeEntry) =>
		b.startTime.getTime() - a.startTime.getTime();

	return {
		clockedInEmployees: Array.from(clockedInByEmployee.values()).sort(sortByStartDesc),
		floorActiveEmployees: Array.from(floorActiveByEmployee.values()).sort(sortByStartDesc),
	};
}

export async function closeTimeLog(id: string, endTime: Date = new Date()) {
	const { user } = await validateRequest();
	if (!user) {
		throw new Error("Unauthorized");
	}

	const updatedLog = await db.timeLog.update({
		where: { id },
		data: {
			endTime,
			correctedBy: user.id,
		},
		include: {
			Employee: true,
			Station: true,
		},
	});

	return updatedLog;
}
