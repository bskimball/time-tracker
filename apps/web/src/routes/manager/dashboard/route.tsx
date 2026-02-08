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

	// Fetch all data in parallel
	const [activeTimeLogs, totalEmployees, activeAlerts, activeAssignments] = await Promise.all([
		getActiveTimeLogs(),
		db.employee.count(),
		getActiveAlerts(),
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

	return (
		<ManagerDashboard
			activeTimeLogs={activeTimeLogs}
			activeTasksByEmployee={activeTasksByEmployee}
			totalEmployees={totalEmployees}
			alerts={activeAlerts.slice(0, 5)} // Show top 5 alerts
			user={user}
		/>
	);
}
