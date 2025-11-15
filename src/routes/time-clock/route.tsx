// Legacy public route kept for compatibility and tests – render the same
// experience as the floor time-clock so unit tests can verify data calls
// without following redirects.
import { TimeTracking } from "~/routes/time-clock/client";
import { db } from "~/lib/db";

export default async function Component() {
	const [employees, stations, activeLogs, activeBreaks, completedLogs] = await Promise.all([
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
		db.timeLog.findMany({
			where: { endTime: { not: null }, deletedAt: null },
			include: { Employee: true, Station: true },
			orderBy: { startTime: "desc" },
			take: 50,
		}),
	]);

	return (
		<TimeTracking
			employees={employees as any}
			stations={stations as any}
			activeLogs={activeLogs as any}
			activeBreaks={activeBreaks as any}
			completedLogs={completedLogs as any}
		/>
	);
}
