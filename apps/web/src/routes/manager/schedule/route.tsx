import { ScheduleView } from "./client";
import { getScheduleData } from "./actions";
import { getStations } from "../employees/actions";
import { getActiveTimeLogs } from "../timesheets/actions";
import { validateRequest } from "~/lib/auth";
import { getRequest } from "~/lib/request-context";

export default async function Component() {
	const { user } = await validateRequest();
	if (!user) {
		throw new Error("Not authenticated");
	}
	const request = getRequest();
	const weekStart = request ? new URL(request.url).searchParams.get("week") ?? undefined : undefined;
	// Manager middleware on the parent route ensures only MANAGER/ADMIN can access.
	const [schedule, stations, activeLogs] = await Promise.all([
		getScheduleData(weekStart),
		getStations(),
		getActiveTimeLogs(),
	]);

	return <ScheduleView schedule={schedule} stations={stations} activeEmployees={activeLogs} />;
}
