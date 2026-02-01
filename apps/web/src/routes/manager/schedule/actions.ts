"use server";

import { addDays, startOfWeek } from "date-fns";
import { db } from "~/lib/db";
import { validateRequest } from "~/lib/auth";

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

const mockEmployees = [
	{ id: "emp-1", name: "Alex Rivera" },
	{ id: "emp-2", name: "Jamie Patel" },
	{ id: "emp-3", name: "Morgan Chen" },
	{ id: "emp-4", name: "Taylor Brooks" },
	{ id: "emp-5", name: "Quinn Harper" },
];

const mockStations = [
	{ id: "station-1", name: "Picking" },
	{ id: "station-2", name: "Packing" },
	{ id: "station-3", name: "Shipping" },
	{ id: "station-4", name: "Receiving" },
	{ id: "station-5", name: "Quality" },
];

const shiftTemplates: Record<ShiftType, { start: string; end: string }> = {
	MORNING: { start: "06:00", end: "14:00" },
	SWING: { start: "14:00", end: "22:00" },
	NIGHT: { start: "22:00", end: "06:00" },
};

function createMockSchedule(): ScheduleData {
	const weekStart = startOfWeek(new Date(), { weekStartsOn: 0 });
	const days: ScheduleDay[] = [];

	for (let i = 0; i < 7; i++) {
		const date = addDays(weekStart, i);
		const dateStr = date.toISOString();

		const entries: ScheduleEntry[] = mockEmployees.map((employee, index) => {
			const station = mockStations[(index + i) % mockStations.length];
			const shiftTypes: ShiftType[] = ["MORNING", "SWING", "NIGHT"];
			const shiftType = shiftTypes[(index + i) % shiftTypes.length];
			const template = shiftTemplates[shiftType];

			return {
				id: `${dateStr}-${employee.id}`,
				employeeId: employee.id,
				employeeName: employee.name,
				role: index % 5 === 0 ? "LEAD" : index % 3 === 0 ? "SUPPORT" : "ASSOCIATE",
				stationId: station.id,
				stationName: station.name,
				shiftType,
				startTime: `${dateStr.split("T")[0]}T${template.start}:00.000Z`,
				endTime: `${dateStr.split("T")[0]}T${template.end}:00.000Z`,
				status: index % 4 === 0 ? "PENDING" : "CONFIRMED",
				notes: index % 4 === 0 ? "Awaiting acknowledgment" : undefined,
			};
		});

		days.push({
			date: dateStr,
			entries,
		});
	}

	return {
		weekStart: weekStart.toISOString(),
		weekEnd: addDays(weekStart, 6).toISOString(),
		days,
	};
}

let cachedSchedule: ScheduleData | null = null;

export async function getScheduleData(): Promise<ScheduleData> {
	if (!cachedSchedule) {
		cachedSchedule = createMockSchedule();
	}

	return cachedSchedule;
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
