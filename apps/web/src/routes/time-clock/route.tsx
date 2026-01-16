// Legacy public route kept for compatibility and tests – render the same
// experience as the floor time-clock so unit tests can verify data calls
// without following redirects.
import { Prisma } from "@prisma/client";
import { TimeTracking } from "~/routes/time-clock/client";
import { db } from "~/lib/db";

// Define explicit type using Prisma's generated types
export type TimeLogWithRelations = Prisma.TimeLogGetPayload<{
	include: { Employee: true; Station: true };
}>;

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

	// No more 'as any' casts - type safety is preserved
	return (
		<TimeTracking
			employees={employees}
			stations={stations}
			activeLogs={activeLogs as TimeLogWithRelations[]}
			activeBreaks={activeBreaks as TimeLogWithRelations[]}
			completedLogs={completedLogs as TimeLogWithRelations[]}
		/>
	);
}
