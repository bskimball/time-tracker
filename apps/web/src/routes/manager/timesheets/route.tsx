import { validateRequest } from "~/lib/auth";
import { getRequest } from "~/lib/request-context";
import { TimesheetManager } from "./client";
import {
	getActiveEmployeesForTimesheet,
	getCorrectionHistory,
	getEmployeesForCorrection,
	getTimeLogsWithCorrections,
} from "./actions";
import { getStations } from "../employees/actions";

export default async function Component() {
	const { user } = await validateRequest();
	if (!user) {
		throw new Error("Not authenticated");
	}

	const request = getRequest();
	const pageParam = request ? new URL(request.url).searchParams.get("page") : null;
	const parsedPage = pageParam ? parseInt(pageParam, 10) : NaN;
	const page = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;
	const limit = 50;

	// Fetch data in parallel
	const [logsData, corrections, activeEmployeeData, employees, stations] = await Promise.all([
		getTimeLogsWithCorrections(undefined, undefined, undefined, true, page, limit),
		getCorrectionHistory(),
		getActiveEmployeesForTimesheet(),
		getEmployeesForCorrection(),
		getStations(),
	]);

	return (
		<TimesheetManager
			initialLogs={logsData.logs}
			correctionHistory={corrections}
			clockedInEmployees={activeEmployeeData.clockedInEmployees}
			floorActiveEmployees={activeEmployeeData.floorActiveEmployees}
			employees={employees}
			stations={stations}
		/>
	);
}
