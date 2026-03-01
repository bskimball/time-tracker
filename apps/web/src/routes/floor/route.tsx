import { db } from "~/lib/db";
import { TimeTracking } from "~/routes/time-clock/client";
import { KioskRedirect } from "~/routes/time-clock/kiosk-redirect";
import type { Employee, Station, TimeLog } from "@prisma/client";
import { ensureOperationalDataSeeded } from "~/lib/ensure-operational-data";
import { getTaskAssignmentMode } from "~/lib/operational-config";
import { validateRequest } from "~/lib/auth";

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

	const [
		employees,
		stations,
		activeLogs,
		activeBreaks,
		auth,
		assignmentMode,
		activeTaskTypes,
		activeAssignments,
	] = await Promise.all([
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
		validateRequest(),
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

	const workerEmployeeId = auth.user?.role === "WORKER" ? auth.user.employeeId : null;

	return (
		<>
			<title>Floor Control Center</title>
			<meta name="description" content="Employee floor time tracking system" />

			<KioskRedirect />

			<div className="bg-background/50 font-sans">
				<main className="container mx-auto px-4 sm:px-6 py-8 max-w-7xl">
					<div className="mb-8 flex flex-col md:flex-row items-start md:items-end justify-between border-b border-border pb-6 gap-4">
						<div>
							<h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground mb-1">
								Floor Control
							</h1>
							<p className="text-muted-foreground text-sm">Operations Dashboard</p>
						</div>

						<div className="flex flex-col items-start md:items-end gap-1 text-xs text-muted-foreground bg-muted/50 px-3 py-2 rounded-md border border-border/50">
							<div className="flex gap-4">
								<span className="flex items-center gap-1.5">
									Status:
									<span className="text-emerald-600 font-medium">Nominal</span>
								</span>
								<span className="flex items-center gap-1.5">
									Network:
									<span className="text-primary font-medium">Online</span>
								</span>
							</div>
						</div>
					</div>

					<div className="mt-8 px-1 md:px-2">
						<TimeTracking
							employees={employees}
							stations={stations}
							activeLogs={activeLogs as TimeLogWithRelations[]}
							activeBreaks={activeBreaks as TimeLogWithRelations[]}
							completedLogsPromise={completedLogsPromise as Promise<TimeLogWithRelations[]>}
							activeTasksByEmployee={activeTasksByEmployee}
							assignmentMode={assignmentMode}
							taskOptions={taskOptions}
							workerEmployeeId={workerEmployeeId}
						/>
					</div>
				</main>
			</div>
		</>
	);
}
