import { validateRequest } from "~/lib/auth";
import { db } from "~/lib/db";
import { getStations } from "../employees/actions";
import { FloorMonitor } from "./client";

type ActiveTaskByEmployee = Record<
	string,
	{
		assignmentId: string;
		taskTypeName: string;
		employeeName: string;
		startTime: Date;
		stationId: string;
		stationName: string | null;
	}
>;

export default async function Component() {
	const { user } = await validateRequest();
	if (!user) {
		throw new Error("Not authenticated");
	}

	// Fetch real-time monitoring data
	const [activeLogs, stations, activeAssignments] = await Promise.all([
		db.timeLog.findMany({
			where: {
				endTime: null,
				deletedAt: null,
			},
			include: {
				Employee: {
					include: {
						defaultStation: true,
					},
				},
				Station: true,
			},
			orderBy: { startTime: "desc" },
		}),
		getStations(),
		db.taskAssignment.findMany({
			where: { endTime: null },
			include: {
				Employee: true,
				TaskType: {
					include: { Station: true },
				},
			},
			orderBy: { startTime: "desc" },
		}),
	]);

	const activeTasksByEmployee = activeAssignments.reduce<ActiveTaskByEmployee>((acc, assignment) => {
		if (acc[assignment.employeeId]) {
			return acc;
		}

		acc[assignment.employeeId] = {
			assignmentId: assignment.id,
			taskTypeName: assignment.TaskType.name,
			employeeName: assignment.Employee.name,
			startTime: assignment.startTime,
			stationId: assignment.TaskType.stationId,
			stationName: assignment.TaskType.Station.name,
		};

		return acc;
	}, {});

	return (
		<FloorMonitor
			activeLogs={activeLogs}
			stations={stations}
			activeTasksByEmployee={activeTasksByEmployee}
		/>
	);
}
