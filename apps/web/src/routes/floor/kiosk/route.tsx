import { db } from "../../../lib/db";
import { KioskTimeClock } from "./client";
import {
	IndustrialHeader,
	IndustrialPanel,
	SafetyStripes,
} from "@monorepo/design-system";
import { ensureOperationalDataSeeded } from "~/lib/ensure-operational-data";

export default async function Component() {
	await ensureOperationalDataSeeded();

	// Get required data for kiosk
	const rawEmployees = await db.employee.findMany({
		select: {
			id: true,
			name: true,
			email: true,
			pinHash: true,
			lastStationId: true,
			dailyHoursLimit: true,
			weeklyHoursLimit: true,
			createdAt: true,
		},
		orderBy: { name: "asc" },
	});

	const rawStations = await db.station.findMany({
		select: {
			id: true,
			name: true,
			createdAt: true,
		},
		orderBy: { name: "asc" },
	});

	const rawActiveLogs = await db.timeLog.findMany({
		where: {
			endTime: null,
			type: "WORK",
			deletedAt: null,
		},
		select: {
			id: true,
			employeeId: true,
			stationId: true,
			type: true,
			startTime: true,
			endTime: true,
			note: true,
			deletedAt: true,
			createdAt: true,
			updatedAt: true,
			Employee: {
				select: {
					id: true,
					name: true,
					email: true,
					pinHash: true,
					lastStationId: true,
					dailyHoursLimit: true,
					weeklyHoursLimit: true,
					createdAt: true,
				},
			},
			Station: {
				select: {
					id: true,
					name: true,
					createdAt: true,
				},
			},
		},
		orderBy: { startTime: "desc" },
	});

	const activeAssignments = await db.taskAssignment.findMany({
		where: { endTime: null },
		include: {
			Employee: true,
			TaskType: {
				include: { Station: true },
			},
		},
		orderBy: { startTime: "desc" },
	});

	const activeTasksByEmployee = activeAssignments.reduce<
		Record<string, { assignmentId: string; taskTypeName: string; stationName: string | null }>
	>((acc, assignment) => {
		if (acc[assignment.employeeId]) {
			return acc;
		}

		acc[assignment.employeeId] = {
			assignmentId: assignment.id,
			taskTypeName: assignment.TaskType.name,
			stationName: assignment.TaskType.Station.name,
		};

		return acc;
	}, {});

	// Convert Date objects to strings for client component with proper typing
	const employees = rawEmployees.map((emp) => ({
		...emp,
		createdAt: emp.createdAt.toISOString(),
	}));

	const stations = rawStations.map((station) => ({
		...station,
		name: station.name as
			| "PICKING"
			| "PACKING"
			| "FILLING"
			| "RECEIVING"
			| "SHIPPING"
			| "QUALITY"
			| "INVENTORY",
		createdAt: station.createdAt.toISOString(),
	}));

	const activeLogs = rawActiveLogs.map((log) => ({
		...log,
		startTime: log.startTime.toISOString(),
		endTime: log.endTime?.toISOString() || null,
		note: log.note || null,
		deletedAt: log.deletedAt?.toISOString() || null,
		createdAt: log.createdAt.toISOString(),
		updatedAt: log.updatedAt.toISOString(),
		employee: {
			...log.Employee,
			createdAt: log.Employee.createdAt.toISOString(),
		},
		station: log.Station
			? {
					...log.Station,
					name: log.Station.name as
						| "PICKING"
						| "PACKING"
						| "FILLING"
						| "RECEIVING"
						| "SHIPPING"
						| "QUALITY"
						| "INVENTORY",
					createdAt: log.Station.createdAt.toISOString(),
				}
			: null,
	}));

	const isActive = activeLogs.length > 0;

	return (
		<>
			<title>Kiosk Time Clock</title>
			<meta name="description" content="Employee kiosk time tracking" />
			<div className="min-h-screen bg-background bg-grid-pattern-subtle p-4 lg:p-6">
				<div className="container mx-auto max-w-6xl">
					<SafetyStripes position="top" />
					<IndustrialPanel variant="default" className="mt-8">
						<IndustrialHeader title="KIOSK TIME CLOCK" active={isActive} className="py-6" />
						<div className="p-6">
							<KioskTimeClock
								employees={employees}
								stations={stations}
								activeLogs={activeLogs}
								activeTasksByEmployee={activeTasksByEmployee}
							/>
						</div>
					</IndustrialPanel>
					<SafetyStripes position="bottom" className="mt-8" />
				</div>
			</div>
		</>
	);
}
