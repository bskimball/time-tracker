import { validateRequest } from "~/lib/auth";
import { TaskManager } from "./client";
import {
	getTaskTypes,
	getActiveTaskAssignments,
	getTaskHistory,
	getEmployees,
	getStations,
	assignTask,
	assignTaskAction,
	completeTaskAction,
	switchTaskAction,
} from "./actions";

export default async function Component() {
	const HISTORY_WINDOW_DAYS = 30;
	const historyStartDate = new Date();
	historyStartDate.setDate(historyStartDate.getDate() - HISTORY_WINDOW_DAYS);

	const authPromise = validateRequest();

	const taskHistoryPromise = getTaskHistory(historyStartDate);
	const taskTypesPromise = getTaskTypes();
	const activeAssignmentsPromise = getActiveTaskAssignments();
	const employeesPromise = getEmployees();
	const stationsPromise = getStations();

	const { user } = await authPromise;
	if (!user) {
		throw new Error("Not authenticated");
	}

	// Fetch all necessary data
	const [taskTypes, activeAssignments, employees, stations] = await Promise.all([
		taskTypesPromise,
		activeAssignmentsPromise,
		employeesPromise,
		stationsPromise,
	]);

	return (
		<TaskManager
			taskTypes={taskTypes}
			activeAssignments={activeAssignments}
			employees={employees}
			stations={stations}
			assignTaskAction={assignTaskAction}
			completeTaskAction={completeTaskAction}
			switchTaskAction={switchTaskAction}
			taskHistoryPromise={taskHistoryPromise}
			historyWindowDays={HISTORY_WINDOW_DAYS}
		/>
	);
}

export async function action({ request }: { request: Request }) {
	const { user } = await validateRequest();
	if (!user) {
		return new Response("Unauthorized", { status: 401 });
	}

	const formData = await request.formData();
	const employeeId = formData.get("employeeId") as string;
	const taskTypeId = formData.get("taskTypeId") as string;
	const priorityValue = (formData.get("priority") as string) || "MEDIUM";
	const priority =
		priorityValue === "LOW" || priorityValue === "MEDIUM" || priorityValue === "HIGH"
			? priorityValue
			: "MEDIUM";
	const notes = (formData.get("notes") as string) || undefined;

	try {
		const assignment = await assignTask({
			employeeId,
			taskTypeId,
			priority,
			notes,
		});
		return new Response(JSON.stringify(assignment), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		});
	} catch (err: unknown) {
		return new Response(
			JSON.stringify({ error: err instanceof Error ? err.message : String(err) }),
			{
				status: 400,
				headers: { "Content-Type": "application/json" },
			}
		);
	}
}
