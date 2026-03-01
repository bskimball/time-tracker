import { db } from "../../../lib/db";
import { KioskTimeClock } from "./client";
import { IndustrialHeader, IndustrialPanel, SafetyStripes } from "@monorepo/design-system";
import { ensureOperationalDataSeeded } from "~/lib/ensure-operational-data";

export default async function Component() {
	await ensureOperationalDataSeeded();

	const [rawEmployees, rawStations] = await Promise.all([
		db.employee.findMany({
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
		}),
		db.station.findMany({
			select: {
				id: true,
				name: true,
				createdAt: true,
			},
			orderBy: { name: "asc" },
		}),
	]);

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

	return (
		<>
			<title>Kiosk Time Clock</title>
			<meta name="description" content="Employee kiosk time tracking" />
			<div className="min-h-screen bg-background bg-grid-pattern-subtle p-4 lg:p-6">
				<div className="container mx-auto max-w-2xl">
					<SafetyStripes position="top" />
					<IndustrialPanel variant="default" className="mt-8">
						<IndustrialHeader title="KIOSK TIME CLOCK" className="py-6" />
						<div className="p-6">
							<KioskTimeClock employees={employees} stations={stations} />
						</div>
					</IndustrialPanel>
					<SafetyStripes position="bottom" className="mt-8" />
				</div>
			</div>
		</>
	);
}
