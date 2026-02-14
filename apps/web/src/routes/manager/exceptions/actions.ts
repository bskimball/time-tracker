"use server";

import { validateRequest } from "~/lib/auth";
import { db } from "~/lib/db";

export type ExceptionType = "MISSING_PUNCH" | "OVERTIME_RISK" | "STAFFING_GAP";
export type ExceptionSeverity = "CRITICAL" | "HIGH" | "MEDIUM";

export interface ExceptionQuickLink {
	label: string;
	href: string;
}

export interface ManagerExceptionItem {
	id: string;
	type: ExceptionType;
	severity: ExceptionSeverity;
	employeeId: string | null;
	employeeName: string | null;
	stationId: string | null;
	stationName: string | null;
	detectedAt: string;
	dueAt: string;
	ownerName: string | null;
	recommendedAction: string;
	contextLabel: string;
	quickLinks: ExceptionQuickLink[];
}

export interface ExceptionQueueData {
	generatedAt: string;
	items: ManagerExceptionItem[];
	stations: Array<{ id: string; name: string }>;
}

const HOURS_IN_MS = 1000 * 60 * 60;

function hoursBetween(start: Date, end: Date) {
	return Math.max(0, end.getTime() - start.getTime()) / HOURS_IN_MS;
}

function startOfToday(date: Date) {
	const today = new Date(date);
	today.setHours(0, 0, 0, 0);
	return today;
}

function endOfToday(date: Date) {
	const end = new Date(date);
	end.setHours(23, 59, 59, 999);
	return end;
}

function startOfWeek(date: Date) {
	const weekStart = startOfToday(date);
	weekStart.setDate(weekStart.getDate() - weekStart.getDay());
	return weekStart;
}

function severityRank(severity: ExceptionSeverity) {
	if (severity === "CRITICAL") return 0;
	if (severity === "HIGH") return 1;
	return 2;
}

export async function getManagerExceptionQueue(): Promise<ExceptionQueueData> {
	const { user } = await validateRequest();
	if (!user) {
		throw new Error("Unauthorized");
	}

	const now = new Date();
	const dayStart = startOfToday(now);
	const dayEnd = endOfToday(now);
	const weekStart = startOfWeek(now);

	const [activeEmployees, activeStations, activeTimeLogs, weeklyWorkLogs, activeAssignments, shiftsToday] =
		await Promise.all([
			db.employee.findMany({
				where: { status: "ACTIVE" },
				select: {
					id: true,
					name: true,
					dailyHoursLimit: true,
					weeklyHoursLimit: true,
					defaultStationId: true,
					defaultStation: {
						select: { id: true, name: true },
					},
				},
				orderBy: { name: "asc" },
			}),
			db.station.findMany({
				where: { isActive: true },
				select: { id: true, name: true },
				orderBy: { name: "asc" },
			}),
			db.timeLog.findMany({
				where: {
					endTime: null,
					deletedAt: null,
				},
				include: {
					Employee: {
						select: {
							id: true,
							name: true,
							status: true,
							dailyHoursLimit: true,
							weeklyHoursLimit: true,
							defaultStation: { select: { id: true, name: true } },
						},
					},
					Station: {
						select: {
							id: true,
							name: true,
						},
					},
				},
				orderBy: { startTime: "asc" },
			}),
			db.timeLog.findMany({
				where: {
					type: "WORK",
					deletedAt: null,
					startTime: { gte: weekStart },
				},
				include: {
					Employee: {
						select: {
							id: true,
							name: true,
							dailyHoursLimit: true,
							weeklyHoursLimit: true,
							defaultStation: { select: { id: true, name: true } },
						},
					},
					Station: {
						select: {
							id: true,
							name: true,
						},
					},
				},
			}),
			db.taskAssignment.findMany({
				where: { endTime: null },
				include: {
					Employee: {
						select: {
							id: true,
							name: true,
							status: true,
							dailyHoursLimit: true,
							weeklyHoursLimit: true,
							defaultStation: { select: { id: true, name: true } },
						},
					},
					TaskType: {
						select: {
							id: true,
							name: true,
							stationId: true,
							Station: {
								select: {
									id: true,
									name: true,
								},
							},
						},
					},
					AssignedByUser: {
						select: {
							name: true,
							email: true,
						},
					},
				},
			}),
			db.shift.findMany({
				where: {
					startTime: { lte: dayEnd },
					endTime: { gte: dayStart },
				},
				include: {
					station: {
						select: {
							id: true,
							name: true,
						},
					},
					assignments: {
						select: {
							employeeId: true,
							status: true,
						},
					},
				},
			}),
		]);

	const employeeById = new Map(activeEmployees.map((employee) => [employee.id, employee]));
	const activeLogsByEmployee = new Map<string, (typeof activeTimeLogs)[number][]>();
	const activeWorkLogByEmployee = new Map<string, (typeof activeTimeLogs)[number]>();
	const activeBreakLogByEmployee = new Map<string, (typeof activeTimeLogs)[number]>();

	for (const log of activeTimeLogs) {
		const existing = activeLogsByEmployee.get(log.employeeId) ?? [];
		existing.push(log);
		activeLogsByEmployee.set(log.employeeId, existing);

		if (log.type === "WORK" && !activeWorkLogByEmployee.has(log.employeeId)) {
			activeWorkLogByEmployee.set(log.employeeId, log);
		}

		if (log.type === "BREAK" && !activeBreakLogByEmployee.has(log.employeeId)) {
			activeBreakLogByEmployee.set(log.employeeId, log);
		}
	}

	const activeAssignmentByEmployee = new Map<string, (typeof activeAssignments)[number]>();
	for (const assignment of activeAssignments) {
		if (!activeAssignmentByEmployee.has(assignment.employeeId)) {
			activeAssignmentByEmployee.set(assignment.employeeId, assignment);
		}
	}

	const items: ManagerExceptionItem[] = [];
	const missingPunchEmployeeIds = new Set<string>();

	for (const [employeeId, logs] of activeLogsByEmployee.entries()) {
		if (logs.length < 2) {
			continue;
		}

		const employeeName = logs[0]?.Employee.name ?? employeeById.get(employeeId)?.name ?? null;
		const stationName = logs[0]?.Station?.name ?? null;
		const assignment = activeAssignmentByEmployee.get(employeeId);

		items.push({
			id: `missing-punch-overlap-${employeeId}`,
			type: "MISSING_PUNCH",
			severity: "CRITICAL",
			employeeId,
			employeeName,
			stationId: logs[0]?.Station?.id ?? null,
			stationName,
			detectedAt: logs[0]?.startTime.toISOString() ?? now.toISOString(),
			dueAt: new Date(now.getTime() + 15 * 60 * 1000).toISOString(),
			ownerName: assignment?.AssignedByUser?.name ?? null,
			recommendedAction: "Close duplicate open punches and confirm the correct active state.",
			contextLabel: `${logs.length} concurrent open logs`,
			quickLinks: [
				{ label: "Review Timesheets", href: "/manager/timesheets?tab=active" },
				{ label: "Check Tasks", href: "/manager/tasks" },
			],
		});

		missingPunchEmployeeIds.add(employeeId);
	}

	for (const assignment of activeAssignments) {
		if (missingPunchEmployeeIds.has(assignment.employeeId)) {
			continue;
		}

		if (activeWorkLogByEmployee.has(assignment.employeeId)) {
			continue;
		}

		items.push({
			id: `missing-punch-assignment-${assignment.employeeId}`,
			type: "MISSING_PUNCH",
			severity: "HIGH",
			employeeId: assignment.employeeId,
			employeeName: assignment.Employee.name,
			stationId: assignment.TaskType.stationId,
			stationName: assignment.TaskType.Station.name,
			detectedAt: assignment.startTime.toISOString(),
			dueAt: new Date(now.getTime() + 30 * 60 * 1000).toISOString(),
			ownerName: assignment.AssignedByUser?.name ?? null,
			recommendedAction: "Backfill a work punch or release the employee from active task assignment.",
			contextLabel: `Active task: ${assignment.TaskType.name}`,
			quickLinks: [
				{ label: "Open Timesheets", href: "/manager/timesheets?tab=active" },
				{ label: "Open Tasks", href: "/manager/tasks" },
			],
		});

		missingPunchEmployeeIds.add(assignment.employeeId);
	}

	for (const [employeeId, breakLog] of activeBreakLogByEmployee.entries()) {
		if (missingPunchEmployeeIds.has(employeeId)) {
			continue;
		}

		if (activeWorkLogByEmployee.has(employeeId)) {
			continue;
		}

		const breakHours = hoursBetween(breakLog.startTime, now);
		if (breakHours < 0.75) {
			continue;
		}

		items.push({
			id: `missing-punch-break-${employeeId}`,
			type: "MISSING_PUNCH",
			severity: breakHours >= 1.5 ? "CRITICAL" : "HIGH",
			employeeId,
			employeeName: breakLog.Employee.name,
			stationId: breakLog.Station?.id ?? null,
			stationName: breakLog.Station?.name ?? null,
			detectedAt: breakLog.startTime.toISOString(),
			dueAt: new Date(breakLog.startTime.getTime() + 60 * 60 * 1000).toISOString(),
			ownerName: null,
			recommendedAction: "Verify return-from-break punch and close stale break log if needed.",
			contextLabel: `Break open for ${(breakHours * 60).toFixed(0)} minutes`,
			quickLinks: [{ label: "Review Timesheets", href: "/manager/timesheets?tab=active" }],
		});
	}

	const weeklyHoursByEmployee = new Map<string, number>();
	const dailyHoursByEmployee = new Map<string, number>();

	for (const log of weeklyWorkLogs) {
		const start = new Date(log.startTime);
		const end = log.endTime ? new Date(log.endTime) : now;
		const duration = hoursBetween(start, end);
		weeklyHoursByEmployee.set(log.employeeId, (weeklyHoursByEmployee.get(log.employeeId) ?? 0) + duration);

		if (start >= dayStart) {
			dailyHoursByEmployee.set(log.employeeId, (dailyHoursByEmployee.get(log.employeeId) ?? 0) + duration);
		}
	}

	for (const employee of activeEmployees) {
		const dailyLimit = employee.dailyHoursLimit ?? 8;
		const weeklyLimit = employee.weeklyHoursLimit ?? 40;
		const dailyHours = dailyHoursByEmployee.get(employee.id) ?? 0;
		const weeklyHours = weeklyHoursByEmployee.get(employee.id) ?? 0;
		const dailyRatio = dailyLimit > 0 ? dailyHours / dailyLimit : 0;
		const weeklyRatio = weeklyLimit > 0 ? weeklyHours / weeklyLimit : 0;

		const exceededDaily = dailyHours >= dailyLimit;
		const exceededWeekly = weeklyHours >= weeklyLimit;
		const nearingLimit = dailyRatio >= 0.9 || weeklyRatio >= 0.9;

		if (!exceededDaily && !exceededWeekly && !nearingLimit) {
			continue;
		}

		const assignment = activeAssignmentByEmployee.get(employee.id);
		const workLog = activeWorkLogByEmployee.get(employee.id);
		const stationId =
			workLog?.Station?.id ??
			assignment?.TaskType.stationId ??
			employee.defaultStation?.id ??
			null;
		const stationName =
			workLog?.Station?.name ??
			assignment?.TaskType.Station.name ??
			employee.defaultStation?.name ??
			null;

		const severity: ExceptionSeverity = exceededDaily || exceededWeekly ? "CRITICAL" : "HIGH";
		const riskLabel = `${dailyHours.toFixed(1)}h today / ${weeklyHours.toFixed(1)}h week`;

		items.push({
			id: `overtime-risk-${employee.id}`,
			type: "OVERTIME_RISK",
			severity,
			employeeId: employee.id,
			employeeName: employee.name,
			stationId,
			stationName,
			detectedAt: now.toISOString(),
			dueAt: (severity === "CRITICAL" ? new Date(now.getTime() + 60 * 60 * 1000) : dayEnd).toISOString(),
			ownerName: assignment?.AssignedByUser?.name ?? null,
			recommendedAction:
				severity === "CRITICAL"
					? "Rebalance workload now or close shift if limits are already exceeded."
					: "Plan reallocation before end of shift to avoid overtime breach.",
			contextLabel: riskLabel,
			quickLinks: [
				{ label: "Open Timesheets", href: "/manager/timesheets" },
				{ label: "Adjust Schedule", href: "/manager/schedule" },
			],
		});
	}

	const activeOccupancyByStation = new Map<string, Set<string>>();
	for (const log of activeTimeLogs) {
		if (!log.stationId || log.type !== "WORK") {
			continue;
		}

		const stationSet = activeOccupancyByStation.get(log.stationId) ?? new Set<string>();
		stationSet.add(log.employeeId);
		activeOccupancyByStation.set(log.stationId, stationSet);
	}

	for (const assignment of activeAssignments) {
		const stationSet =
			activeOccupancyByStation.get(assignment.TaskType.stationId) ?? new Set<string>();
		stationSet.add(assignment.employeeId);
		activeOccupancyByStation.set(assignment.TaskType.stationId, stationSet);
	}

	const shiftDemandByStation = new Map<string, { demand: number; staffed: number; stationName: string }>();
	for (const shift of shiftsToday) {
		if (shift.startTime > now || shift.endTime <= now) {
			continue;
		}

		const current = shiftDemandByStation.get(shift.stationId) ?? {
			demand: 0,
			staffed: 0,
			stationName: shift.station.name,
		};

		const staffedForShift = shift.assignments.filter((assignment) => {
			const normalized = assignment.status.toUpperCase();
			return normalized === "CONFIRMED" || normalized === "PENDING";
		}).length;

		current.demand += shift.requiredHeadcount;
		current.staffed += staffedForShift;
		shiftDemandByStation.set(shift.stationId, current);
	}

	for (const station of activeStations) {
		const shiftDemand = shiftDemandByStation.get(station.id);
		if (!shiftDemand || shiftDemand.demand <= 0) {
			continue;
		}

		const occupied = activeOccupancyByStation.get(station.id)?.size ?? 0;
		const gap = shiftDemand.demand - occupied;
		if (gap <= 0) {
			continue;
		}

		const severity: ExceptionSeverity = gap >= 2 ? "CRITICAL" : "HIGH";
		const hasScheduleGap = shiftDemand.staffed < shiftDemand.demand;

		items.push({
			id: `staffing-gap-${station.id}`,
			type: "STAFFING_GAP",
			severity,
			employeeId: null,
			employeeName: null,
			stationId: station.id,
			stationName: shiftDemand.stationName,
			detectedAt: now.toISOString(),
			dueAt: new Date(now.getTime() + 60 * 60 * 1000).toISOString(),
			ownerName: null,
			recommendedAction: hasScheduleGap
				? "Fill open shift coverage or move reserve capacity to this station."
				: "Reassign active operators to this station until coverage returns to demand.",
			contextLabel: `Demand ${shiftDemand.demand} vs active ${occupied}`,
			quickLinks: [
				{ label: "Open Schedule", href: "/manager/schedule" },
				{ label: "Reassign Tasks", href: "/manager/tasks" },
			],
		});
	}

	items.sort((a, b) => {
		const severityDiff = severityRank(a.severity) - severityRank(b.severity);
		if (severityDiff !== 0) {
			return severityDiff;
		}

		return new Date(a.detectedAt).getTime() - new Date(b.detectedAt).getTime();
	});

	return {
		generatedAt: now.toISOString(),
		items,
		stations: activeStations,
	};
}
