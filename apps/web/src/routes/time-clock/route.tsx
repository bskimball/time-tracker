// Legacy public route kept for compatibility and tests – render the same
// experience as the floor time-clock so unit tests can verify data calls
// without following redirects.
import { Prisma } from "@prisma/client";
import { TimeTracking } from "~/routes/time-clock/client";
import { db } from "~/lib/db";
import { getTaskAssignmentMode } from "~/lib/operational-config";
import type { TaskAssignmentMode } from "~/lib/task-assignment-permissions";

// Define explicit type using Prisma's generated types
export type TimeLogWithRelations = Prisma.TimeLogGetPayload<{
	include: { Employee: true; Station: true };
}>;

type ActiveTaskByEmployee = Record<
	string,
	{
		assignmentId: string;
		taskTypeName: string;
		stationName: string | null;
	}
>;

type TaskOption = {
	id: string;
	name: string;
	stationName: string | null;
};

export default async function Component() {
	const completedLogsPromise = db.timeLog.findMany({
		where: { endTime: { not: null }, deletedAt: null },
		include: { Employee: true, Station: true },
		orderBy: { startTime: "desc" },
		take: 50,
	});

	const [
		employees,
		stations,
		activeLogs,
		activeBreaks,
		activeAssignments,
		assignmentMode,
		activeTaskTypes,
	] = await Promise.all([
		db.employee.findMany({ orderBy: { name: "asc" } }),
		db.station.findMany({ orderBy: { name: "asc" } }),
		db.timeLog.findMany({
			where: { endTime: null, type: "WORK", deletedAt: null },
			include: { Employee: true, Station: true },
			orderBy: { startTime: "desc" },
		}),
		db.timeLog.findMany({
			where: { endTime: null, type: "BREAK", deletedAt: null },
			include: { Employee: true, Station: true },
			orderBy: { startTime: "desc" },
		}),
		db.taskAssignment.findMany({
			where: { endTime: null },
			include: {
				TaskType: {
					include: { Station: true },
				},
			},
			orderBy: { startTime: "desc" },
		}),
		getTaskAssignmentMode(),
		db.taskType.findMany({
			where: { isActive: true },
			include: { Station: true },
			orderBy: [{ name: "asc" }],
		}),
	]);

	const taskOptions: TaskOption[] = activeTaskTypes.map((taskType) => ({
		id: taskType.id,
		name: taskType.name,
		stationName: taskType.Station.name,
	}));

	const activeTasksByEmployee = activeAssignments.reduce<ActiveTaskByEmployee>(
		(acc, assignment) => {
			if (acc[assignment.employeeId]) {
				return acc;
			}

			acc[assignment.employeeId] = {
				assignmentId: assignment.id,
				taskTypeName: assignment.TaskType.name,
				stationName: assignment.TaskType.Station.name,
			};

			return acc;
		},
		{}
	);

	// No more 'as any' casts - type safety is preserved
	return (
		<TimeTracking
			employees={employees}
			stations={stations}
			activeLogs={activeLogs as TimeLogWithRelations[]}
			activeBreaks={activeBreaks as TimeLogWithRelations[]}
			completedLogsPromise={completedLogsPromise as Promise<TimeLogWithRelations[]>}
			activeTasksByEmployee={activeTasksByEmployee}
			assignmentMode={assignmentMode as TaskAssignmentMode}
			taskOptions={taskOptions}
		/>
	);
}
