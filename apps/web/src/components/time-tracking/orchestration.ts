"use client";

import type { Employee, Station } from "@prisma/client";
import type { TimeLogWithRelations } from "~/routes/time-clock/route";

export const createClientId = () =>
	typeof crypto !== "undefined" && crypto.randomUUID
		? crypto.randomUUID()
		: Math.random().toString(36).slice(2);

export function getAppStatusBarOffset() {
	if (typeof document === "undefined") {
		return 0;
	}

	const statusBar = document.getElementById("app-status-bar");
	if (!statusBar) {
		return 0;
	}

	return Math.ceil(statusBar.getBoundingClientRect().bottom);
}

export function createOptimisticClockInLog({
	employee,
	station,
}: {
	employee: Employee;
	station: Station;
}): TimeLogWithRelations {
	const now = new Date();

	return {
		id: createClientId(),
		employeeId: employee.id,
		stationId: station.id,
		type: "WORK",
		startTime: now,
		endTime: null,
		note: null,
		deletedAt: null,
		correctedBy: null,
		taskId: null,
		clockMethod: "MANUAL",
		createdAt: now,
		updatedAt: now,
		Employee: employee,
		Station: station,
	};
}
