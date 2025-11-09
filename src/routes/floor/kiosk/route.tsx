import { validateRequest } from "~/lib/auth";
import { prisma } from "~/lib/db-optimizer";
import { KioskProvider } from "~/components/kiosk/kiosk-manager";
import { KioskTimeClock } from "~/components/kiosk/kiosk-time-clock";

export async function loader() {
	const { user } = await validateRequest();
	if (!user) {
		throw new Response("Unauthorized", { status: 401 });
	}

	// Check if user has access to time clock
	if (user.role === "WORKER" && user.employeeId) {
		const employee = await prisma.employee.findUnique({
			where: { id: user.employeeId },
			select: { id: true },
		});

		if (!employee) {
			throw new Response("Employee record not found", { status: 404 });
		}
	} else if (user.role === "WORKER") {
		throw new Response("Employee record required", { status: 403 });
	}

	// Get employees and stations
	const [employees, stations, activeLogs, activeBreaks, completedLogs] = await Promise.all([
		prisma.employee.findMany({
			where: { status: "ACTIVE" },
			orderBy: { name: "asc" },
		}),

		prisma.station.findMany({
			where: { isActive: true },
			orderBy: { name: "asc" },
		}),

		prisma.timeLog.findMany({
			where: {
				endTime: null,
				type: "WORK",
				deletedAt: null,
			},
			include: {
				Employee: {
					select: { id: true, name: true },
				},
				Station: {
					select: { id: true, name: true },
				},
			},
			orderBy: { startTime: "desc" },
		}),

		prisma.timeLog.findMany({
			where: {
				endTime: null,
				type: "BREAK",
				deletedAt: null,
			},
			include: {
				Employee: {
					select: { id: true, name: true },
				},
			},
			orderBy: { startTime: "desc" },
		}),

		prisma.timeLog.findMany({
			where: {
				endTime: { not: null },
				deletedAt: null,
			},
			include: {
				Employee: {
					select: { id: true, name: true },
				},
				Station: {
					select: { id: true, name: true },
				},
			},
			orderBy: { startTime: "desc" },
			take: 50,
		}),
	]);

	return {
		employees,
		stations,
		activeLogs,
		activeBreaks,
		completedLogs,
		user,
	};
}

export default function KioskRoute({ loaderData }: { loaderData: any }) {
	return (
		<KioskProvider>
			<KioskTimeClock {...loaderData} />
		</KioskProvider>
	);
}
