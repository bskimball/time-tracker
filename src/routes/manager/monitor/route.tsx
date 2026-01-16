import { validateRequest } from "~/lib/auth";
import { getStations } from "../employees/actions";
import { getActiveTimeLogs } from "../timesheets/actions";
import { FloorMonitor } from "./client";

export default async function Component() {
	const { user } = await validateRequest();
	if (!user) {
		throw new Error("Not authenticated");
	}

	// Fetch real-time monitoring data
	const [activeLogs, stations] = await Promise.all([getActiveTimeLogs(), getStations()]);

	return <FloorMonitor activeLogs={activeLogs} stations={stations} />;
}
