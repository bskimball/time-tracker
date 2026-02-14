import { db } from "~/lib/db";
import { TimeTracking } from "~/routes/time-clock/client";
import { KioskRedirect } from "~/routes/time-clock/kiosk-redirect";
import { PageHeader } from "~/components/page-header";
import type { Employee, Station, TimeLog } from "@prisma/client";
import { ensureOperationalDataSeeded } from "~/lib/ensure-operational-data";
import { getTaskAssignmentMode } from "~/lib/operational-config";

type TimeLogWithRelations = TimeLog & {
	Employee: Employee;
	Station: Station | null;
};

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
	// Mobile redirect is now handled in entry.rsc.tsx

	await ensureOperationalDataSeeded();

	const thirtyDaysAgo = new Date();
	thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

	const completedLogsPromise = db.timeLog.findMany({
		where: {
			endTime: { not: null },
			startTime: { gte: thirtyDaysAgo },
			deletedAt: null,
		},
		include: { Employee: true, Station: true },
		orderBy: { startTime: "desc" },
	});

	const [employees, stations, activeLogs, activeBreaks, assignmentMode, activeTaskTypes, activeAssignments] = await Promise.all([
		db.employee.findMany({ orderBy: { name: "asc" } }),
		db.station.findMany({ orderBy: { name: "asc" } }),
		db.timeLog.findMany({
		where: {
			endTime: null,
			type: "WORK",
			deletedAt: null,
		},
		include: { Employee: true, Station: true },
		orderBy: { startTime: "desc" },
		}),
		db.timeLog.findMany({
		where: {
			endTime: null,
			type: "BREAK",
			deletedAt: null,
		},
		include: { Employee: true, Station: true },
		orderBy: { startTime: "desc" },
		}),
		getTaskAssignmentMode(),
		db.taskType.findMany({
			where: { isActive: true },
			include: { Station: true },
			orderBy: [{ name: "asc" }],
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
	]);

	const taskOptions: TaskOption[] = activeTaskTypes.map((taskType) => ({
		id: taskType.id,
		name: taskType.name,
		stationName: taskType.Station.name,
	}));

	const activeTasksByEmployee = activeAssignments.reduce<ActiveTaskByEmployee>((acc, assignment) => {
		if (acc[assignment.employeeId]) {
			return acc;
		}

		acc[assignment.employeeId] = {
			assignmentId: assignment.id,
			taskTypeName: assignment.TaskType.name,
			stationName: assignment.TaskType.Station.name,
		};

		return acc;
	}, {});

	return (
		<>
			<title>Floor Time Clock</title>
			<meta name="description" content="Employee floor time tracking system" />

			<KioskRedirect />

			<main className="container mx-auto py-6 lg:py-12">
				<PageHeader title="Floor Time Clock" subtitle="Employee floor time tracking system" />
				<TimeTracking
					employees={employees}
					stations={stations}
					activeLogs={activeLogs as TimeLogWithRelations[]}
					activeBreaks={activeBreaks as TimeLogWithRelations[]}
					completedLogsPromise={completedLogsPromise as Promise<TimeLogWithRelations[]>}
					activeTasksByEmployee={activeTasksByEmployee}
					assignmentMode={assignmentMode}
					taskOptions={taskOptions}
				/>
			</main>
		</>
	);
}
