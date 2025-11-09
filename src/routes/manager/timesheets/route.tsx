import { validateRequest } from "~/lib/auth";
import { TimesheetManager } from "./client";
import { getTimeLogsWithCorrections, getEmployeesForCorrection } from "./actions";
import { getStations } from "../employees/actions";

export default async function Component({ searchParams }: { searchParams?: { page?: string } }) {
	const { user } = await validateRequest();
	if (!user) {
		throw new Error("Not authenticated");
	}

	const page = searchParams?.page ? parseInt(searchParams.page) : 1;
	const limit = 50;

	// Fetch data in parallel
	const [logsData, employees, stations] = await Promise.all([
		getTimeLogsWithCorrections(undefined, undefined, undefined, true, page, limit),
		getEmployeesForCorrection(),
		getStations(),
	]);

	return (
		<TimesheetManager
			initialLogs={logsData.logs}
			employees={employees}
			stations={stations}
		/>
	);
}
