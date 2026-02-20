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
	const searchParams = request ? new URL(request.url).searchParams : new URLSearchParams();
	const pageParam = searchParams.get("page");
	const tabParam = searchParams.get("tab") || "logs";
	const parsedPage = pageParam ? parseInt(pageParam, 10) : NaN;
	const page = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;
	const limit = 50;

	const correctionHistoryPromise = getCorrectionHistory();
	const logsDataPromise = getTimeLogsWithCorrections(
		undefined,
		undefined,
		undefined,
		true,
		page,
		limit
	);
	const activeEmployeeDataPromise = getActiveEmployeesForTimesheet();
	const employeesPromise = getEmployeesForCorrection();
	const stationsPromise = getStations();

	// Fetch data in parallel
	const [logsData, activeEmployeeData, employees, stations, correctionHistory] = await Promise.all([
		logsDataPromise,
		activeEmployeeDataPromise,
		employeesPromise,
		stationsPromise,
		correctionHistoryPromise,
	]);

	return (
		<TimesheetManager
			initialTab={tabParam}
			initialLogs={logsData.logs}
			pagination={{
				page,
				limit,
				total: logsData.total,
				totalPages: logsData.totalPages,
			}}
			correctionHistory={correctionHistory}
			clockedInEmployees={activeEmployeeData.clockedInEmployees}
			floorActiveEmployees={activeEmployeeData.floorActiveEmployees}
			employees={employees}
			stations={stations}
		/>
	);
}
