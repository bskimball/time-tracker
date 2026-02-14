"use server";

import {
	addDays,
	endOfDay,
	endOfWeek,
	isValid,
	parseISO,
	startOfDay,
	startOfWeek,
} from "date-fns";
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
	staffing: StaffingInsights;
}

export interface StaffingRecommendation {
	employeeId: string;
	employeeName: string;
	currentStationName: string;
	reason: string;
	dailyHoursWorked: number;
	weeklyHoursWorked: number;
	wouldExceedDailyLimit: boolean;
	wouldExceedWeeklyLimit: boolean;
}

export interface StationGapInsight {
	stationId: string;
	stationName: string;
	plannedHeadcount: number;
	weekPlannedHeadcount: number;
	actualHeadcount: number;
	gap: number;
	severity: "ok" | "watch" | "critical";
	recommendations: StaffingRecommendation[];
}

export interface StaffingInsights {
	selectedDate: string;
	plannedTotal: number;
	actualTotal: number;
	totalGap: number;
	stationGaps: StationGapInsight[];
}

type ActiveStaffSource = "TASK_ASSIGNMENT" | "TIME_LOG";

type ActiveStaffMember = {
	employeeId: string;
	employeeName: string;
	currentStationId: string | null;
	currentStationName: string;
	defaultStationId: string | null;
	defaultStationName: string;
	dailyHoursLimit: number;
	weeklyHoursLimit: number;
	source: ActiveStaffSource;
};

const DEFAULT_DAILY_LIMIT_HOURS = 8;
const DEFAULT_WEEKLY_LIMIT_HOURS = 40;

function hoursInRange(
	startTime: Date,
	endTime: Date | null,
	rangeStart: Date,
	rangeEnd: Date,
	now: Date
) {
	const effectiveEnd = endTime ?? now;
	const boundedStart = new Date(Math.max(startTime.getTime(), rangeStart.getTime()));
	const boundedEnd = new Date(Math.min(effectiveEnd.getTime(), rangeEnd.getTime()));

	if (boundedEnd.getTime() <= boundedStart.getTime()) {
		return 0;
	}

	return (boundedEnd.getTime() - boundedStart.getTime()) / (1000 * 60 * 60);
}

function getGapSeverity(gap: number, plannedHeadcount: number): StationGapInsight["severity"] {
	if (gap <= 0) {
		return "ok";
	}

	if (gap >= 2 || (plannedHeadcount > 0 && gap / plannedHeadcount >= 0.5)) {
		return "critical";
	}

	return "watch";
}

export async function getScheduleData(
	weekStartInput?: string,
	selectedDayInput?: string
): Promise<ScheduleData> {
	const parsedWeekStart = weekStartInput ? parseISO(weekStartInput) : null;
	const baseDate = parsedWeekStart && isValid(parsedWeekStart) ? parsedWeekStart : new Date();
	const weekStart = startOfWeek(baseDate, { weekStartsOn: 0 });
	const weekEnd = endOfWeek(weekStart, { weekStartsOn: 0 });
	const selectedDateParsed = selectedDayInput ? parseISO(selectedDayInput) : null;
	const selectedDate =
		selectedDateParsed && isValid(selectedDateParsed) ? startOfDay(selectedDateParsed) : weekStart;
	const selectedDayStart = startOfDay(selectedDate);
	const selectedDayEnd = endOfDay(selectedDate);
	const now = new Date();

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

	const [activeTimeLogs, activeTaskAssignments, stations] = await Promise.all([
		db.timeLog.findMany({
			where: {
				endTime: null,
				deletedAt: null,
				type: "WORK",
			},
			include: {
				Employee: {
					select: {
						id: true,
						name: true,
						dailyHoursLimit: true,
						weeklyHoursLimit: true,
						defaultStation: {
							select: {
								id: true,
								name: true,
							},
						},
					},
				},
				Station: {
					select: {
						id: true,
						name: true,
					},
				},
			},
			orderBy: { startTime: "desc" },
		}),
		db.taskAssignment.findMany({
			where: {
				endTime: null,
			},
			include: {
				Employee: {
					select: {
						id: true,
						name: true,
						dailyHoursLimit: true,
						weeklyHoursLimit: true,
						defaultStation: {
							select: {
								id: true,
								name: true,
							},
						},
					},
				},
				TaskType: {
					select: {
						Station: {
							select: {
								id: true,
								name: true,
							},
						},
					},
				},
			},
			orderBy: { startTime: "desc" },
		}),
		db.station.findMany({
			where: { isActive: true },
			select: { id: true, name: true },
			orderBy: { name: "asc" },
		}),
	]);

	const activeByEmployee = new Map<string, ActiveStaffMember>();

	for (const assignment of activeTaskAssignments) {
		activeByEmployee.set(assignment.employeeId, {
			employeeId: assignment.employeeId,
			employeeName: assignment.Employee.name,
			currentStationId: assignment.TaskType.Station.id,
			currentStationName: assignment.TaskType.Station.name,
			defaultStationId: assignment.Employee.defaultStation?.id ?? null,
			defaultStationName: assignment.Employee.defaultStation?.name ?? "No default station",
			dailyHoursLimit: assignment.Employee.dailyHoursLimit ?? DEFAULT_DAILY_LIMIT_HOURS,
			weeklyHoursLimit: assignment.Employee.weeklyHoursLimit ?? DEFAULT_WEEKLY_LIMIT_HOURS,
			source: "TASK_ASSIGNMENT",
		});
	}

	for (const log of activeTimeLogs) {
		if (activeByEmployee.has(log.employeeId)) {
			continue;
		}

		activeByEmployee.set(log.employeeId, {
			employeeId: log.employeeId,
			employeeName: log.Employee.name,
			currentStationId: log.Station?.id ?? null,
			currentStationName: log.Station?.name ?? "Unassigned",
			defaultStationId: log.Employee.defaultStation?.id ?? null,
			defaultStationName: log.Employee.defaultStation?.name ?? "No default station",
			dailyHoursLimit: log.Employee.dailyHoursLimit ?? DEFAULT_DAILY_LIMIT_HOURS,
			weeklyHoursLimit: log.Employee.weeklyHoursLimit ?? DEFAULT_WEEKLY_LIMIT_HOURS,
			source: "TIME_LOG",
		});
	}

	const activeEmployeeIds = Array.from(activeByEmployee.keys());
	const timeLogsForLimits =
		activeEmployeeIds.length > 0
			? await db.timeLog.findMany({
					where: {
						employeeId: { in: activeEmployeeIds },
						deletedAt: null,
						startTime: {
							lte: weekEnd,
						},
						OR: [{ endTime: null }, { endTime: { gte: weekStart } }],
					},
					select: {
						employeeId: true,
						startTime: true,
						endTime: true,
					},
			  })
			: [];

	const dayHoursByEmployee = new Map<string, number>();
	const weekHoursByEmployee = new Map<string, number>();

	for (const log of timeLogsForLimits) {
		const dayHours = hoursInRange(log.startTime, log.endTime, selectedDayStart, selectedDayEnd, now);
		const weekHours = hoursInRange(log.startTime, log.endTime, weekStart, weekEnd, now);
		if (dayHours > 0) {
			dayHoursByEmployee.set(log.employeeId, (dayHoursByEmployee.get(log.employeeId) ?? 0) + dayHours);
		}
		if (weekHours > 0) {
			weekHoursByEmployee.set(log.employeeId, (weekHoursByEmployee.get(log.employeeId) ?? 0) + weekHours);
		}
	}

	const selectedDateKey = selectedDayStart.toISOString().slice(0, 10);
	const selectedDayEntries = days.find((day) => day.date.startsWith(selectedDateKey))?.entries ?? [];

	const stationNameById = new Map<string, string>(
		stations.map((station) => [station.id, String(station.name)])
	);
	for (const entry of selectedDayEntries) {
		if (!stationNameById.has(entry.stationId)) {
			stationNameById.set(entry.stationId, entry.stationName);
		}
	}
	for (const active of activeByEmployee.values()) {
		if (active.currentStationId && !stationNameById.has(active.currentStationId)) {
			stationNameById.set(active.currentStationId, active.currentStationName);
		}
	}

	const stationIds = Array.from(stationNameById.keys());
	const plannedByStation = new Map<string, number>();
	const weekPlannedByStation = new Map<string, number>();
	const actualByStation = new Map<string, number>();

	for (const stationId of stationIds) {
		plannedByStation.set(stationId, 0);
		weekPlannedByStation.set(stationId, 0);
		actualByStation.set(stationId, 0);
	}

	for (const entry of selectedDayEntries) {
		plannedByStation.set(entry.stationId, (plannedByStation.get(entry.stationId) ?? 0) + 1);
	}

	for (const day of days) {
		for (const entry of day.entries) {
			weekPlannedByStation.set(entry.stationId, (weekPlannedByStation.get(entry.stationId) ?? 0) + 1);
		}
	}

	for (const active of activeByEmployee.values()) {
		if (!active.currentStationId) {
			continue;
		}
		actualByStation.set(active.currentStationId, (actualByStation.get(active.currentStationId) ?? 0) + 1);
	}

	const stationGaps: StationGapInsight[] = stationIds
		.map((stationId) => {
			const plannedHeadcount = plannedByStation.get(stationId) ?? 0;
			const actualHeadcount = actualByStation.get(stationId) ?? 0;
			const gap = plannedHeadcount - actualHeadcount;

			const recommendations =
				gap > 0
					? Array.from(activeByEmployee.values())
							.filter((active) => active.currentStationId !== stationId)
							.map((active) => {
								const dailyHoursWorked = dayHoursByEmployee.get(active.employeeId) ?? 0;
								const weeklyHoursWorked = weekHoursByEmployee.get(active.employeeId) ?? 0;
								const wouldExceedDailyLimit = dailyHoursWorked >= active.dailyHoursLimit;
								const wouldExceedWeeklyLimit = weeklyHoursWorked >= active.weeklyHoursLimit;

								let reason = `Active at ${active.currentStationName}`;
								if (!active.currentStationId) {
									reason = "Clocked in and currently unassigned";
								} else if (active.defaultStationId === stationId) {
									reason = `Default station is ${stationNameById.get(stationId) ?? "target station"}`;
								}

								if (!wouldExceedDailyLimit && !wouldExceedWeeklyLimit) {
									reason += "; within hour limits";
								} else {
									reason += "; overtime threshold reached";
								}

								return {
									employeeId: active.employeeId,
									employeeName: active.employeeName,
									currentStationName: active.currentStationName,
									reason,
									dailyHoursWorked,
									weeklyHoursWorked,
									wouldExceedDailyLimit,
									wouldExceedWeeklyLimit,
								};
							})
							.sort((a, b) => {
								const aOverLimit = a.wouldExceedDailyLimit || a.wouldExceedWeeklyLimit;
								const bOverLimit = b.wouldExceedDailyLimit || b.wouldExceedWeeklyLimit;
								if (aOverLimit !== bOverLimit) {
									return aOverLimit ? 1 : -1;
								}
								if (a.currentStationName === "Unassigned" && b.currentStationName !== "Unassigned") {
									return -1;
								}
								if (a.currentStationName !== "Unassigned" && b.currentStationName === "Unassigned") {
									return 1;
								}
								return a.weeklyHoursWorked - b.weeklyHoursWorked;
							})
							.slice(0, 5)
					: [];

			return {
				stationId,
				stationName: stationNameById.get(stationId) ?? "Unknown Station",
				plannedHeadcount,
				weekPlannedHeadcount: weekPlannedByStation.get(stationId) ?? 0,
				actualHeadcount,
				gap,
				severity: getGapSeverity(gap, plannedHeadcount),
				recommendations,
			};
		})
		.filter((station) => station.plannedHeadcount > 0 || station.actualHeadcount > 0)
		.sort((a, b) => {
			if (a.gap !== b.gap) {
				return b.gap - a.gap;
			}
			return a.stationName.localeCompare(b.stationName);
		});

	const plannedTotal = stationGaps.reduce((sum, station) => sum + station.plannedHeadcount, 0);
	const actualTotal = stationGaps.reduce((sum, station) => sum + station.actualHeadcount, 0);
	const totalGap = plannedTotal - actualTotal;

	return {
		weekStart: weekStart.toISOString(),
		weekEnd: weekEnd.toISOString(),
		days,
		staffing: {
			selectedDate: selectedDayStart.toISOString(),
			plannedTotal,
			actualTotal,
			totalGap,
			stationGaps,
		},
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
