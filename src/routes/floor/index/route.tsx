import { db } from "~/lib/db";
import { TimeTracking } from "./client";
import { getRequest } from "~/lib/request-context";

async function getTimeLogsWithRelations(where?: any) {
	const logs = await db.timeLog.findMany({
		where,
		include: {
			Employee: true,
			Station: true,
		},
		orderBy: { startTime: "desc" },
	});

	return logs.map((log) => ({
		...log,
		employee: log.Employee,
		station: log.Station,
	}));
}

function isMobileDevice(): boolean {
	if (typeof window !== "undefined") {
		return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
			navigator.userAgent
		);
	}

	// Server-side detection from User-Agent header
	try {
		const request = getRequest();
		const userAgent = request?.headers.get("user-agent") || "";
		return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
	} catch {
		return false;
	}
}

export default async function Component() {
	// Check if mobile device and redirect to mobile experience
	if (isMobileDevice()) {
		throw new Response("", {
			status: 302,
			headers: {
				Location: "/floor/time-clock/mobile",
			},
		});
	}

	// Fetch data for the floor experience from existing time-clock functionality
	const employees = await db.employee.findMany({
		where: { pinHash: { not: null } },
		orderBy: { name: "asc" },
	});

	const stations = await db.station.findMany({
		orderBy: { name: "asc" },
	});

	// Get active time logs
	const activeLogs = await getTimeLogsWithRelations({
		endTime: null,
		type: "WORK",
		deletedAt: null,
	});

	// Get active breaks
	const activeBreaks = await getTimeLogsWithRelations({
		endTime: null,
		type: "BREAK",
		deletedAt: null,
	});

	// Get completed time logs (limit for performance)
	const completedLogs = await getTimeLogsWithRelations({
		endTime: { not: null },
		deletedAt: null,
	}).then((logs) => logs.slice(0, 50));

	return (
		<TimeTracking
			employees={employees}
			stations={stations}
			activeLogs={activeLogs}
			activeBreaks={activeBreaks}
			completedLogs={completedLogs}
		/>
	);
}
