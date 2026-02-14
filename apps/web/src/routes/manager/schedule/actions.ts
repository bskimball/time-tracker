"use server";

import { addDays, endOfWeek, isValid, parseISO, startOfWeek } from "date-fns";
import { db } from "~/lib/db";
import { validateRequest } from "~/lib/auth";
import { ensureOperationalDataSeeded } from "~/lib/ensure-operational-data";

type ShiftType = "MORNING" | "SWING" | "NIGHT";

export interface ScheduleEntry {
	id: string;
	employeeId: string;
	employeeName: string;
	role: "LEAD" | "ASSOCIATE" | "SUPPORT";
	stationId: string;
	stationName: string;
	shiftType: ShiftType;
	startTime: string;
	endTime: string;
	status: "CONFIRMED" | "PENDING" | "OPEN";
	notes?: string;
}

export interface ScheduleDay {
	date: string;
	entries: ScheduleEntry[];
}

export interface ScheduleData {
	weekStart: string;
	weekEnd: string;
	days: ScheduleDay[];
}

export async function getScheduleData(weekStartInput?: string): Promise<ScheduleData> {
	const parsedWeekStart = weekStartInput ? parseISO(weekStartInput) : null;
	const baseDate = parsedWeekStart && isValid(parsedWeekStart) ? parsedWeekStart : new Date();
	const weekStart = startOfWeek(baseDate, { weekStartsOn: 0 });
	const weekEnd = endOfWeek(weekStart, { weekStartsOn: 0 });

	const loadScheduleRows = async () => {
		return db.shiftAssignment.findMany({
			where: {
				shift: {
					startTime: {
						gte: weekStart,
						lte: weekEnd,
					},
				},
			},
			include: {
				employee: true,
				shift: {
					include: {
						station: true,
					},
				},
			},
			orderBy: [
				{ shift: { startTime: "asc" } },
				{ employee: { name: "asc" } },
			],
		});
	};

	let assignments = await loadScheduleRows();
	if (assignments.length === 0) {
		await ensureOperationalDataSeeded();
		assignments = await loadScheduleRows();
	}

	const days: ScheduleDay[] = Array.from({ length: 7 }, (_, index) => {
		const date = addDays(weekStart, index);
		const dateKey = date.toISOString().split("T")[0];

		const entries: ScheduleEntry[] = assignments
			.filter((assignment) => assignment.shift.startTime.toISOString().startsWith(dateKey))
			.map((assignment) => {
				const shiftTypeRaw = assignment.shift.shiftType.toUpperCase();
				const shiftType =
					shiftTypeRaw === "MORNING" || shiftTypeRaw === "SWING" || shiftTypeRaw === "NIGHT"
						? (shiftTypeRaw as ShiftType)
						: "MORNING";

				const roleRaw = assignment.role.toUpperCase();
				const role =
					roleRaw === "LEAD" || roleRaw === "SUPPORT" || roleRaw === "ASSOCIATE"
						? (roleRaw as ScheduleEntry["role"])
						: "ASSOCIATE";

				const statusRaw = assignment.status.toUpperCase();
				const status =
					statusRaw === "CONFIRMED" || statusRaw === "PENDING" || statusRaw === "OPEN"
						? (statusRaw as ScheduleEntry["status"])
						: "CONFIRMED";

				return {
					id: assignment.id,
					employeeId: assignment.employeeId,
					employeeName: assignment.employee.name,
					role,
					stationId: assignment.shift.stationId,
					stationName: assignment.shift.station.name,
					shiftType,
					startTime: assignment.shift.startTime.toISOString(),
					endTime: assignment.shift.endTime.toISOString(),
					status,
					notes: assignment.notes ?? undefined,
				};
			});

		return {
			date: date.toISOString(),
			entries,
		};
	});

	return {
		weekStart: weekStart.toISOString(),
		weekEnd: weekEnd.toISOString(),
		days,
	};
}

export async function bulkReassignShiftAssignments(params: {
	assignmentIds: string[];
	newStationId?: string;
	newEmployeeId?: string;
}) {
	const { user } = await validateRequest();
	if (!user) {
		throw new Error("Unauthorized");
	}

	if (!params.assignmentIds?.length) {
		throw new Error("No shift assignments selected");
	}

	if (!params.newStationId && !params.newEmployeeId) {
		throw new Error("New station or employee is required");
	}

	type ShiftAssignmentUpdater = {
		shiftAssignment: {
			update: (args: {
				where: { id: string };
				data: { employeeId?: string; stationId?: string };
			}) => Promise<unknown>;
		};
	};

	const updates = await db.$transaction((tx) =>
		Promise.all(
			params.assignmentIds.map((assignmentId) =>
				(tx as unknown as ShiftAssignmentUpdater).shiftAssignment.update({
					where: { id: assignmentId },
					data: {
						...(params.newEmployeeId ? { employeeId: params.newEmployeeId } : {}),
						...(params.newStationId ? { stationId: params.newStationId } : {}),
					},
				})
			)
		)
	);

	return updates;
}
