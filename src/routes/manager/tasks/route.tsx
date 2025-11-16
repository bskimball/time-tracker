import { validateRequest } from "~/lib/auth";
import { TaskManager } from "./client";
import {
	getTaskTypes,
	getActiveTaskAssignments,
	getEmployees,
	getStations,
	assignTask,
	assignTaskAction,
} from "./actions";

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
			assignTaskAction={assignTaskAction}
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
	const priority = (formData.get("priority") as string) || "MEDIUM";
	const notes = (formData.get("notes") as string) || undefined;

	try {
		const assignment = await assignTask({ employeeId, taskTypeId, priority: priority as any, notes });
		return new Response(JSON.stringify(assignment), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		});
	} catch (err: any) {
		return new Response(JSON.stringify({ error: err?.message || String(err) }), {
			status: 400,
			headers: { "Content-Type": "application/json" },
		});
	}
}
