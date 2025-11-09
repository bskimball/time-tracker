import { db } from "../../lib/db";
import { TimeTracking } from "./client";
import { KioskRedirect } from "./kiosk-redirect";
import type { Employee, Station, TimeLog } from "@prisma/client";
import bcrypt from "bcryptjs";
import { Header } from "../../components/header";
import { Footer } from "../../components/footer";

type TimeLogWithRelations = TimeLog & {
	Employee: Employee;
	Station: Station | null;
};

// Fetch data directly in Server Component instead of using loader
// This is the correct pattern for React Server Components
export default async function Component() {
	// Public page (no auth). Provide explicit nulls for header props to avoid TS issues.
	const headerName: string | null = null;
	const headerRole: string | null = null;

	let employees: Employee[] = [];
	let stations: Station[] = [];
	let activeLogs: TimeLogWithRelations[] = [];
	let activeBreaks: TimeLogWithRelations[] = [];
	let completedLogs: TimeLogWithRelations[] = [];

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
			<title>Time Clock</title>
			<meta name="description" content="Employee time tracking system" />

			<KioskRedirect />

			<Header userName={headerName} userRole={headerRole} />
			<main className="container mx-auto py-8 lg:py-12">
				<h1 className="text-4xl font-bold mb-8">Time Clock</h1>
				<TimeTracking
					employees={employees}
					stations={stations}
					activeLogs={activeLogs as any}
					activeBreaks={activeBreaks as any}
					completedLogs={completedLogs as any}
				/>
			</main>
			<Footer />
		</>
	);
}
