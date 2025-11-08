import { db } from "../../../lib/db";
import { ReportsPage } from "./client";
import { Header } from "../../../components/header";
import { Footer } from "../../../components/footer";
import { validateRequest } from "../../../lib/auth";
import { getRequest } from "../../../lib/request-context";

type GroupBy = "daily" | "weekly" | "monthly";

function getDateRange(startDate?: string, endDate?: string) {
	const end = endDate ? new Date(endDate) : new Date();
	end.setHours(23, 59, 59, 999);

	const start = startDate ? new Date(startDate) : new Date();
	if (!startDate) {
		start.setDate(start.getDate() - 30);
	}
	start.setHours(0, 0, 0, 0);

	return { start, end };
}

function calculateDuration(startTime: Date, endTime: Date): number {
	return (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
}

function formatDateKey(date: Date, groupBy: GroupBy): string {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");

	if (groupBy === "daily") {
		return `${year}-${month}-${day}`;
	} else if (groupBy === "weekly") {
		const weekStart = new Date(date);
		weekStart.setDate(date.getDate() - date.getDay());
		const wYear = weekStart.getFullYear();
		const wMonth = String(weekStart.getMonth() + 1).padStart(2, "0");
		const wDay = String(weekStart.getDate()).padStart(2, "0");
		return `${wYear}-${wMonth}-${wDay}`;
	} else {
		return `${year}-${month}`;
	}
}

// Fetch data directly in Server Component instead of using loader
// This is the correct pattern for React Server Components
export default async function Component() {
	// Get authenticated user from middleware
	// Middleware ensures user is authenticated before this component renders
	const { user } = await validateRequest();
	const headerName = user?.name ?? user?.email ?? null;
	const headerRole = user?.role ?? "USER";

	// Parse query params using request context from AsyncLocalStorage
	const request = getRequest();
	const url = request ? new URL(request.url) : new URL("http://localhost");
	const startDate = url.searchParams.get("startDate") || undefined;
	const endDate = url.searchParams.get("endDate") || undefined;
	const groupBy = (url.searchParams.get("groupBy") || "daily") as GroupBy;

	const { start, end } = getDateRange(startDate, endDate);

	const timeLogs = await db.timeLog.findMany({
		where: {
			deletedAt: null,
			endTime: { not: null },
			startTime: { gte: start, lte: end },
		},
		include: {
			Employee: true,
			Station: true,
		},
		orderBy: { startTime: "asc" },
	});

	const employeeHours = new Map<string, { name: string; hours: number }>();
	const stationHours = new Map<string, { name: string; hours: number }>();
	const dailyTotals = new Map<string, number>();

	for (const log of timeLogs) {
		if (!log.endTime) continue;

		const duration = calculateDuration(log.startTime, log.endTime);

		const employeeKey = log.Employee.name;
		const existing = employeeHours.get(employeeKey) || {
			name: employeeKey,
			hours: 0,
		};

		if (log.type === "WORK") {
			existing.hours += duration;
		} else if (log.type === "BREAK") {
			existing.hours -= duration;
		}

		employeeHours.set(employeeKey, existing);

		if (log.type === "WORK" && log.Station) {
			const stationKey = log.Station.name;
			const stationExisting = stationHours.get(stationKey) || {
				name: stationKey,
				hours: 0,
			};
			stationExisting.hours += duration;
			stationHours.set(stationKey, stationExisting);
		}

		if (log.type === "WORK") {
			const dateKey = formatDateKey(log.startTime, groupBy);
			const dayTotal = dailyTotals.get(dateKey) || 0;
			dailyTotals.set(dateKey, dayTotal + duration);
		}
	}

	const employeeData = Array.from(employeeHours.values())
		.filter((e) => e.hours > 0)
		.sort((a, b) => b.hours - a.hours);

	const stationData = Array.from(stationHours.values()).sort((a, b) => b.hours - a.hours);

	const trendData = Array.from(dailyTotals.entries())
		.sort((a, b) => a[0].localeCompare(b[0]))
		.map(([date, hours]) => ({ date, hours }));

	const startDateStr = start.toISOString().split("T")[0];
	const endDateStr = end.toISOString().split("T")[0];

	return (
		<>
			<title>Time Clock Reports</title>
			<meta name="description" content="Time tracking reports and analytics" />

			<Header userName={headerName} userRole={headerRole} />
			<main className="container mx-auto py-8 lg:py-12">
				<div className="mb-6">
					<h1 className="text-4xl font-bold">Time Clock Reports</h1>
				</div>
				<ReportsPage
					employeeData={employeeData}
					stationData={stationData}
					trendData={trendData}
					startDate={startDateStr}
					endDate={endDateStr}
					groupBy={groupBy}
				/>
			</main>
			<Footer />
		</>
	);
}
