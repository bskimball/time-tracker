import type { Prisma, PrismaClient, TimeLog_type } from "@prisma/client";

type DbClient = PrismaClient | Prisma.TransactionClient;

export interface TimeLogFilters {
	employeeId?: string;
	stationId?: string;
	startDate?: Date;
	endDate?: Date;
	includeDeleted?: boolean;
	types?: TimeLog_type[];
}

export async function getActiveWorkLog(db: DbClient, employeeId: string) {
	return db.timeLog.findFirst({
		where: {
			employeeId,
			endTime: null,
			type: "WORK",
			deletedAt: null,
		},
	});
}

export async function getActiveBreakLog(db: DbClient, employeeId: string) {
	return db.timeLog.findFirst({
		where: {
			employeeId,
			endTime: null,
			type: "BREAK",
			deletedAt: null,
		},
	});
}

export async function listTimeLogs(db: DbClient, filters: TimeLogFilters = {}) {
	const where: Prisma.TimeLogWhereInput = {};

	if (filters.employeeId) {
		where.employeeId = filters.employeeId;
	}

	if (filters.stationId) {
		where.stationId = filters.stationId;
	}

	if (!filters.includeDeleted) {
		where.deletedAt = null;
	}

	if (filters.types && filters.types.length > 0) {
		where.type = { in: filters.types };
	}

	if (filters.startDate || filters.endDate) {
		where.startTime = {};
		if (filters.startDate) {
			where.startTime.gte = filters.startDate;
		}
		if (filters.endDate) {
			where.startTime.lte = filters.endDate;
		}
	}

	return db.timeLog.findMany({
		where,
		select: {
			id: true,
			employeeId: true,
			stationId: true,
			type: true,
			startTime: true,
			endTime: true,
			note: true,
			deletedAt: true,
			createdAt: true,
			updatedAt: true,
		},
		orderBy: { startTime: "desc" },
	});
}

export async function listTimeLogsForRange(
	db: DbClient,
	employeeId: string,
	startDate: Date,
	endDate: Date
) {
	return db.timeLog.findMany({
		where: {
			employeeId,
			startTime: {
				gte: startDate,
				lte: endDate,
			},
			deletedAt: null,
		},
		orderBy: { startTime: "desc" },
	});
}

export async function createWorkLog(
	db: DbClient,
	data: {
		employeeId: string;
		stationId: string;
		clockMethod?: Prisma.TimeLogCreateInput["clockMethod"];
	}
) {
	return db.timeLog.create({
		data: {
			employeeId: data.employeeId,
			stationId: data.stationId,
			type: "WORK",
			clockMethod: data.clockMethod ?? "PIN",
			createdAt: new Date(),
			updatedAt: new Date(),
		},
	});
}

export async function createBreakLog(
	db: DbClient,
	data: { employeeId: string; stationId?: string | null }
) {
	return db.timeLog.create({
		data: {
			employeeId: data.employeeId,
			stationId: data.stationId || undefined,
			type: "BREAK",
			createdAt: new Date(),
			updatedAt: new Date(),
		},
	});
}

export async function stopLog(db: DbClient, logId: string) {
	return db.timeLog.update({
		where: { id: logId },
		data: { endTime: new Date() },
	});
}

export async function softDeleteLog(db: DbClient, logId: string) {
	return db.timeLog.update({
		where: { id: logId },
		data: { deletedAt: new Date() },
	});
}

export async function updateTimeLog(
	db: DbClient,
	logId: string,
	data: {
		startTime: Date;
		endTime?: Date | null;
		type: TimeLog_type;
		stationId?: string | null;
		note?: string | null;
	}
) {
	return db.timeLog.update({
		where: { id: logId },
		data: {
			startTime: data.startTime,
			endTime: data.endTime,
			type: data.type,
			stationId: data.stationId || undefined,
			note: data.note ?? null,
		},
	});
}
