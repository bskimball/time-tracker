import { db } from "~/lib/db";
import { validateRequest } from "~/lib/auth";
import { ManagerDashboard } from "./client";
import { getActiveAlerts } from "./actions";

type ActiveTaskByEmployee = Record<
	string,
	{
		assignmentId: string;
		employeeName: string;
		taskTypeName: string;
		stationName: string | null;
		startTime: Date;
	}
>;

async function getActiveTimeLogs() {
	const logs = await db.timeLog.findMany({
		where: {
			deletedAt: null,
			endTime: null,
		},
		include: {
			Employee: true,
			Station: true,
		},
		orderBy: { startTime: "asc" },
	});

	return logs.map((log) => ({
		...log,
		employee: log.Employee,
		station: log.Station,
	}));
}

export default async function Component() {
	const { user } = await validateRequest();
	if (!user) {
		throw new Error("Not authenticated");
	}
	// Middleware ensures MANAGER or ADMIN role
	const snapshotAt = new Date();

	const activeAlertsPromise = getActiveAlerts();
	const todayStart = new Date();
	todayStart.setHours(0, 0, 0, 0);
	const taskEfficiencyRatePromise = db.performanceMetric
		.aggregate({
			where: { date: { gte: todayStart } },
			_avg: { efficiency: true },
		})
		.then((result) => Number(((result._avg.efficiency ?? 0) * 100).toFixed(1)));
	const networkStatusPromise = db.timeLog
		.count({
			where: {
				deletedAt: null,
				clockMethod: "MANUAL",
				note: { contains: "DELETED:" },
				startTime: { gte: todayStart },
			},
		})
		.then((openSystemErrorCount) => (openSystemErrorCount > 0 ? "DEGRADED" : "ONLINE" as const));

	const [activeTimeLogs, totalEmployees, activeAssignments] = await Promise.all([
		getActiveTimeLogs(),
		db.employee.count(),
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
			employeeName: assignment.Employee.name,
			taskTypeName: assignment.TaskType.name,
			stationName: assignment.TaskType.Station.name,
			startTime: assignment.startTime,
		};

		return acc;
	}, {});

	const activeEmployeeIds = new Set<string>();
	for (const log of activeTimeLogs) {
		activeEmployeeIds.add(log.employeeId);
	}
	for (const assignment of activeAssignments) {
		activeEmployeeIds.add(assignment.employeeId);
	}

	const utilizationRate =
		totalEmployees > 0 ? Number(((activeEmployeeIds.size / totalEmployees) * 100).toFixed(1)) : 0;

	return (
		<ManagerDashboard
			activeTimeLogs={activeTimeLogs}
			activeTasksByEmployee={activeTasksByEmployee}
			totalEmployees={totalEmployees}
			utilizationRate={utilizationRate}
			snapshotAt={snapshotAt}
			taskEfficiencyRatePromise={taskEfficiencyRatePromise}
			networkStatusPromise={networkStatusPromise}
			alertsPromise={activeAlertsPromise}
			user={user}
		/>
	);
}
