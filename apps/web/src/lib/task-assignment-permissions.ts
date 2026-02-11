import type { User } from "@prisma/client";

export const TASK_ASSIGNMENT_MODES = [
	"MANAGER_ONLY",
	"SELF_ASSIGN_ALLOWED",
	"SELF_ASSIGN_REQUIRED",
] as const;

export type TaskAssignmentMode = (typeof TASK_ASSIGNMENT_MODES)[number];

export const DEFAULT_TASK_ASSIGNMENT_MODE: TaskAssignmentMode = "MANAGER_ONLY";

export function isTaskAssignmentMode(value: string): value is TaskAssignmentMode {
	return TASK_ASSIGNMENT_MODES.includes(value as TaskAssignmentMode);
}

export function parseTaskAssignmentMode(value: string | null | undefined): TaskAssignmentMode {
	if (!value) {
		return DEFAULT_TASK_ASSIGNMENT_MODE;
	}

	return isTaskAssignmentMode(value) ? value : DEFAULT_TASK_ASSIGNMENT_MODE;
}

export function canWorkerSelfAssign(mode: TaskAssignmentMode) {
	return mode !== "MANAGER_ONLY";
}

export function isWorkerSelfAssignmentRequired(mode: TaskAssignmentMode) {
	return mode === "SELF_ASSIGN_REQUIRED";
}

export const MANAGER_TASK_ASSIGNER_ROLES = ["MANAGER", "ADMIN", "EXECUTIVE"] as const;

export function canUserManageTaskAssignments(user: Pick<User, "role"> | null) {
	if (!user) {
		return false;
	}

	return MANAGER_TASK_ASSIGNER_ROLES.includes(
		user.role as (typeof MANAGER_TASK_ASSIGNER_ROLES)[number]
	);
}

export type ManagerTaskAssignmentAccessResult =
	| { ok: true; userId: string }
	| { ok: false; error: string };

export function getManagerTaskAssignmentAccess(
	user: Pick<User, "id" | "role"> | null
): ManagerTaskAssignmentAccessResult {
	if (!user) {
		return { ok: false, error: "Unauthorized" };
	}

	if (!canUserManageTaskAssignments(user)) {
		return { ok: false, error: "Only manager roles can assign tasks" };
	}

	return { ok: true, userId: user.id };
}

export type WorkerSelfAssignmentAccessResult =
	| { ok: true; employeeId: string }
	| { ok: false; error: string };

export function getWorkerSelfAssignmentAccess(
	user: Pick<User, "role" | "employeeId"> | null,
	mode: TaskAssignmentMode
): WorkerSelfAssignmentAccessResult {
	if (!canWorkerSelfAssign(mode)) {
		return { ok: false, error: "Worker self-assignment is disabled" };
	}

	if (!user) {
		return { ok: false, error: "Unauthorized" };
	}

	if (user.role !== "WORKER") {
		return { ok: false, error: "Only WORKER users can self-assign tasks" };
	}

	if (!user.employeeId) {
		return { ok: false, error: "Worker account is not linked to an employee" };
	}

	return { ok: true, employeeId: user.employeeId };
}
