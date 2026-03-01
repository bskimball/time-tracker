import type { ClockActionState } from "~/routes/time-clock/actions";
import * as timeClockActions from "~/routes/time-clock/actions";
import type { TaskAssignmentMode } from "~/lib/task-assignment-permissions";

export type TaskOption = {
	id: string;
	name: string;
	stationName: string | null;
};

export type ActiveTaskInfo = {
	assignmentId: string;
	taskTypeName: string;
	stationName: string | null;
};

type ServerTaskAction = (
	prevState: ClockActionState,
	formData: FormData
) => Promise<ClockActionState>;

function isServerTaskAction(value: unknown): value is ServerTaskAction {
	return typeof value === "function";
}

function getServerAction(nameCandidates: string[]): ServerTaskAction | null {
	const actionMap = timeClockActions as unknown as Record<string, unknown>;

	for (const name of nameCandidates) {
		const action = actionMap[name];
		if (isServerTaskAction(action)) {
			return action;
		}
	}

	return null;
}

const unavailableAction: ServerTaskAction = async () => ({
	success: false,
	error: "Task controls are not available yet. Please contact a manager.",
});

export const startSelfTaskAction =
	getServerAction([
		"startSelfTask",
		"startSelfTaskAction",
		"startWorkerTask",
		"startWorkerTaskAction",
	]) ?? unavailableAction;

export const switchSelfTaskAction =
	getServerAction([
		"switchSelfTask",
		"switchSelfTaskAction",
		"switchWorkerTask",
		"switchWorkerTaskAction",
	]) ?? unavailableAction;

export const endSelfTaskAction =
	getServerAction(["endSelfTask", "endSelfTaskAction", "endWorkerTask", "endWorkerTaskAction"]) ??
	unavailableAction;

export function canSelfAssign(mode: TaskAssignmentMode) {
	return mode !== "MANAGER_ONLY";
}

export function isSelfAssignRequired(mode: TaskAssignmentMode) {
	return mode === "SELF_ASSIGN_REQUIRED";
}
