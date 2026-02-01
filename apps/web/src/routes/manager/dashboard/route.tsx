import { db } from "~/lib/db";
import { validateRequest } from "~/lib/auth";
import { ManagerDashboard } from "./client";
import { getActiveAlerts } from "./actions";

async function getTimeLogs(take?: number) {
	const logs = await db.timeLog.findMany({
		where: {
			deletedAt: null,
		},
		include: {
			Employee: true,
			Station: true,
		},
		orderBy: { startTime: "desc" },
		take,
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
	const [allTimeLogs, totalEmployees, activeAlerts] = await Promise.all([
		getTimeLogs(50),
		db.employee.count(),
		getActiveAlerts(),
	]);

	// Filter for active employees
	const activeTimeLogs = allTimeLogs.filter((log) => log.endTime === null && log.type === "WORK");

	return (
		<ManagerDashboard
			activeTimeLogs={activeTimeLogs}
			totalEmployees={totalEmployees}
			alerts={activeAlerts.slice(0, 5)} // Show top 5 alerts
			user={user}
		/>
	);
}
