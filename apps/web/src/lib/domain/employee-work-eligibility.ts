import type { PrismaClient, User } from "@prisma/client";
import type { TaskAssignmentMode } from "~/lib/task-assignment-permissions";
import { getWorkerSelfAssignmentAccess } from "~/lib/task-assignment-permissions";

type DbClient = PrismaClient;

export type FloorScopeResult = { ok: true; employeeId: string } | { ok: false; error: string };

export type WorkerSelfTaskContext = { ok: true; employeeId: string } | { ok: false; error: string };

export function normalizeEmployeeCode(value: unknown): string {
	return String(value || "")
		.trim()
		.toUpperCase();
}

export function resolveFloorEmployeeId(
	user: Pick<User, "role" | "employeeId"> | null,
	requestedEmployeeId: string
): FloorScopeResult {
	const normalizedRequestedEmployeeId = requestedEmployeeId.trim();

	if (!user) {
		if (!normalizedRequestedEmployeeId) {
			return { ok: false, error: "Employee is required" };
		}
		return { ok: true, employeeId: normalizedRequestedEmployeeId };
	}

	if (user.role === "WORKER") {
		if (!user.employeeId) {
			return { ok: false, error: "Worker session is not linked to an employee" };
		}

		if (normalizedRequestedEmployeeId && normalizedRequestedEmployeeId !== user.employeeId) {
			return { ok: false, error: "Workers can only perform floor actions for themselves" };
		}

		return { ok: true, employeeId: user.employeeId };
	}

	if (!normalizedRequestedEmployeeId) {
		return { ok: false, error: "Employee is required" };
	}

	return { ok: true, employeeId: normalizedRequestedEmployeeId };
}

export async function getActiveEmployeeByCode(db: DbClient, employeeCode: string) {
	if (!employeeCode) {
		return null;
	}

	return db.employee.findFirst({
		where: {
			employeeCode,
			status: "ACTIVE",
			pinHash: { not: null },
		},
	});
}

export async function getWorkerSelfTaskContext(
	db: DbClient,
	user: Pick<User, "role" | "employeeId"> | null,
	mode: TaskAssignmentMode
): Promise<WorkerSelfTaskContext> {
	const access = getWorkerSelfAssignmentAccess(user, mode);

	if (!access.ok) {
		return { ok: false, error: access.error };
	}

	const employee = await db.employee.findUnique({
		where: { id: access.employeeId },
		select: { id: true, status: true },
	});

	if (!employee || employee.status !== "ACTIVE") {
		return { ok: false, error: "Linked employee is not active" };
	}

	return { ok: true, employeeId: employee.id };
}
