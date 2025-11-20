import { db } from "~/lib/db";
import { TimeTracking } from "~/routes/time-clock/client";
import { KioskRedirect } from "~/routes/time-clock/kiosk-redirect";
import type { Employee, Station, TimeLog } from "@prisma/client";
import bcrypt from "bcryptjs";

type TimeLogWithRelations = TimeLog & {
	Employee: Employee;
	Station: Station | null;
};

export default async function Component() {
	// Mobile redirect is now handled in entry.rsc.tsx

	let employees: Employee[] = [];
	let stations: Station[] = [];
	let activeLogs: TimeLogWithRelations[] = [];
	let activeBreaks: TimeLogWithRelations[] = [];
	let completedLogs: TimeLogWithRelations[] = [];

	// Initialize demo data if needed
	const stationCount = await db.station.count();
	if (stationCount === 0) {
		await db.station.createMany({
			data: [
				{ id: crypto.randomUUID(), name: "PICKING" },
				{ id: crypto.randomUUID(), name: "PACKING" },
				{ id: crypto.randomUUID(), name: "FILLING" },
			],
		});
	}

	const employeeCount = await db.employee.count();
	if (employeeCount === 0) {
		const alicePinHash = await bcrypt.hash("1234", 10);

		await db.employee.createMany({
			data: [
				{
					id: crypto.randomUUID(),
					name: "Alice Johnson",
					email: "alice@example.com",
					pinHash: alicePinHash,
				},
				{ id: crypto.randomUUID(), name: "Bob Smith", email: "bob@example.com" },
				{ id: crypto.randomUUID(), name: "Charlie Brown", email: "charlie@example.com" },
				{ id: crypto.randomUUID(), name: "Diana Prince", email: "diana@example.com" },
			],
		});
	}

	employees = await db.employee.findMany({ orderBy: { name: "asc" } });
	stations = await db.station.findMany({ orderBy: { name: "asc" } });

	activeLogs = await db.timeLog.findMany({
		where: {
			endTime: null,
			type: "WORK",
			deletedAt: null,
		},
		include: { Employee: true, Station: true },
		orderBy: { startTime: "desc" },
	});

	activeBreaks = await db.timeLog.findMany({
		where: {
			endTime: null,
			type: "BREAK",
			deletedAt: null,
		},
		include: { Employee: true, Station: true },
		orderBy: { startTime: "desc" },
	});

	const thirtyDaysAgo = new Date();
	thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

	completedLogs = await db.timeLog.findMany({
		where: {
			endTime: { not: null },
			startTime: { gte: thirtyDaysAgo },
			deletedAt: null,
		},
		include: { Employee: true, Station: true },
		orderBy: { startTime: "desc" },
	});

	return (
		<>
			<title>Floor Time Clock</title>
			<meta name="description" content="Employee floor time tracking system" />

			<KioskRedirect />

			<main className="container mx-auto py-8 lg:py-12">
				<h1 className="text-4xl font-bold mb-8">Floor Time Clock</h1>
				<TimeTracking
					employees={employees}
					stations={stations}
					activeLogs={activeLogs as TimeLogWithRelations[]}
					activeBreaks={activeBreaks as TimeLogWithRelations[]}
					completedLogs={completedLogs as TimeLogWithRelations[]}
				/>
			</main>
		</>
	);
}
