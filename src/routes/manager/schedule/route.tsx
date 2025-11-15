import { ScheduleView } from "./client";
import { getScheduleData } from "./actions";
import { getStations } from "../employees/actions";
import { getActiveTimeLogs } from "../timesheets/actions";
import { validateRequest } from "~/lib/auth";

export default async function Component() {
	const { user } = await validateRequest();
	if (!user) {
		throw new Error("Not authenticated");
	}
	// Manager middleware on the parent route ensures only MANAGER/ADMIN can access.
	const [schedule, stations, activeLogs] = await Promise.all([
		getScheduleData(),
		getStations(),
		getActiveTimeLogs(),
	]);

	return <ScheduleView schedule={schedule} stations={stations} activeEmployees={activeLogs} />;
}
