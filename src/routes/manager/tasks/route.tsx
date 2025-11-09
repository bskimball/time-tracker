import { validateRequest } from "~/lib/auth";
import { TaskManager } from "./client";
import { getTaskTypes, getActiveTaskAssignments, getEmployees, getStations } from "./actions";

export default async function Component() {
	const { user } = await validateRequest();
	if (!user) {
		throw new Error("Not authenticated");
	}

	// Fetch all necessary data
	const [taskTypes, activeAssignments, employees, stations] = await Promise.all([
		getTaskTypes(),
		getActiveTaskAssignments(),
		getEmployees(),
		getStations(),
	]);

	return (
		<TaskManager
			taskTypes={taskTypes}
			activeAssignments={activeAssignments}
			employees={employees}
			stations={stations}
		/>
	);
}
