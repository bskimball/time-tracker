import { db } from "../../../../lib/db";
import { getRequest } from "../../../../lib/request-context";

function escapeCSV(value: string): string {
	if (/^[=+\-@]/.test(value)) {
		value = "'" + value;
	}

	if (value.includes('"') || value.includes(",") || value.includes("\n")) {
		return `"${value.replace(/"/g, '""')}"`;
	}

	return value;
}

function calculateDuration(startTime: Date, endTime: Date): number {
	return (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
}

// In RSC Data Mode, this route returns a Response instead of rendering a component
export default async function Component(): Promise<never> {
	const request = getRequest();

	if (!request) {
		throw new Response("Request not available", { status: 500 });
	}

	const url = new URL(request.url);
	const startDate = url.searchParams.get("startDate");
	const endDate = url.searchParams.get("endDate");

	const end = endDate ? new Date(endDate) : new Date();
	end.setHours(23, 59, 59, 999);

	const start = startDate ? new Date(startDate) : new Date();
	if (!startDate) {
		start.setDate(start.getDate() - 30);
	}
	start.setHours(0, 0, 0, 0);

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

	const employeeNetHours = new Map<string, number>();

	for (const log of timeLogs) {
		if (!log.endTime) continue;

		const duration = calculateDuration(log.startTime, log.endTime);
		const employeeId = log.employeeId;
		const current = employeeNetHours.get(employeeId) || 0;

		if (log.type === "WORK") {
			employeeNetHours.set(employeeId, current + duration);
		} else if (log.type === "BREAK") {
			employeeNetHours.set(employeeId, current - duration);
		}
	}

	const headers = [
		"Date",
		"Employee",
		"Station",
		"Type",
		"Start",
		"End",
		"Duration (hrs)",
		"Net Duration (hrs)",
	];

	const rows = timeLogs.map((log) => {
		const duration = log.endTime ? calculateDuration(log.startTime, log.endTime) : 0;

		const netDuration = employeeNetHours.get(log.employeeId) || 0;

		return [
			log.startTime.toISOString().split("T")[0],
			escapeCSV(log.Employee.name),
			log.Station ? escapeCSV(log.Station.name) : "",
			log.type,
			log.startTime.toISOString(),
			log.endTime ? log.endTime.toISOString() : "",
			duration.toFixed(2),
			netDuration.toFixed(2),
		].join(",");
	});

	const csv = [headers.join(","), ...rows].join("\n");

	throw new Response(csv, {
		headers: {
			"Content-Type": "text/csv",
			"Content-Disposition": `attachment; filename="time-logs-${start.toISOString().split("T")[0]}-to-${end.toISOString().split("T")[0]}.csv"`,
		},
	});
}
