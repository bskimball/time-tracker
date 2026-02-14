import { validateRequest } from "~/lib/auth";
import { db } from "~/lib/db";
import { getStations } from "../employees/actions";
import { FloorMonitor } from "./client";
import { Suspense } from "react";

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

type FloorMonitorProps = Parameters<typeof FloorMonitor>[0];

export default async function Component() {
	const snapshotAt = new Date();
	const authPromise = validateRequest();

	const activeTasksByEmployeePromise = db.taskAssignment
		.findMany({
			where: { endTime: null },
			include: {
				Employee: true,
				TaskType: {
					include: { Station: true },
				},
			},
			orderBy: { startTime: "desc" },
		})
		.then((activeAssignments) =>
			activeAssignments.reduce<ActiveTaskByEmployee>((acc, assignment) => {
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
			}, {})
		);

	const activeLogsPromise = db.timeLog.findMany({
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
		});
	const stationsPromise = getStations();

	const { user } = await authPromise;
	if (!user) {
		throw new Error("Not authenticated");
	}

	// Fetch real-time monitoring data
	const [activeLogs, stations] = await Promise.all([activeLogsPromise, stationsPromise]);

	return (
		<Suspense
			fallback={
				<FloorMonitor
					activeLogs={activeLogs}
					stations={stations}
					activeTasksByEmployee={{}}
					snapshotAt={snapshotAt}
				/>
			}
		>
			<FloorMonitorWithTasks
				activeLogs={activeLogs}
				stations={stations}
				activeTasksByEmployeePromise={activeTasksByEmployeePromise}
				snapshotAt={snapshotAt}
			/>
		</Suspense>
	);
}

async function FloorMonitorWithTasks({
	activeLogs,
	stations,
	activeTasksByEmployeePromise,
	snapshotAt,
}: {
	activeLogs: FloorMonitorProps["activeLogs"];
	stations: FloorMonitorProps["stations"];
	activeTasksByEmployeePromise: Promise<ActiveTaskByEmployee>;
	snapshotAt: Date;
}) {
	const activeTasksByEmployee = await activeTasksByEmployeePromise;

	return (
		<FloorMonitor
			activeLogs={activeLogs}
			stations={stations}
			activeTasksByEmployee={activeTasksByEmployee}
			snapshotAt={snapshotAt}
		/>
	);
}
