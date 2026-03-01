import { db } from "~/lib/db";
import { ensureOperationalDataSeeded } from "~/lib/ensure-operational-data";
import { getTaskAssignmentMode } from "~/lib/operational-config";
import { MobileTimeClock } from "~/routes/floor/mobile-time-clock/client";

export default async function Component() {
	await ensureOperationalDataSeeded();

	const [
		employees,
		stations,
		activeLogs,
		activeBreaks,
		assignmentMode,
		activeTaskTypes,
		activeAssignments,
	] = await Promise.all([
		db.employee.findMany({ orderBy: { name: "asc" } }),
		db.station.findMany({ where: { isActive: true }, orderBy: { name: "asc" } }),
		db.timeLog.findMany({
			where: { endTime: null, type: "WORK", deletedAt: null },
			include: { Employee: true, Station: true },
			orderBy: { startTime: "desc" },
		}),
		db.timeLog.findMany({
			where: { endTime: null, type: "BREAK", deletedAt: null },
			include: { Employee: true, Station: true },
			orderBy: { startTime: "desc" },
		}),
		getTaskAssignmentMode(),
		db.taskType.findMany({
			where: { isActive: true },
			include: { Station: true },
			orderBy: [{ name: "asc" }],
		}),
		db.taskAssignment.findMany({
			where: { endTime: null },
			include: {
				TaskType: {
					include: { Station: true },
				},
			},
			orderBy: { startTime: "desc" },
		}),
	]);

	const taskOptions = activeTaskTypes.map((taskType) => ({
		id: taskType.id,
		name: taskType.name,
		stationName: taskType.Station.name,
	}));

	const activeTasksByEmployee = activeAssignments.reduce<
		Record<string, { assignmentId: string; taskTypeName: string; stationName: string | null }>
	>((acc, assignment) => {
		if (!acc[assignment.employeeId]) {
			acc[assignment.employeeId] = {
				assignmentId: assignment.id,
				taskTypeName: assignment.TaskType.name,
				stationName: assignment.TaskType.Station.name,
			};
		}
		return acc;
	}, {});

	const toMobileLog = (log: (typeof activeLogs)[number] | (typeof activeBreaks)[number]) => ({
		id: log.id,
		startTime: log.startTime,
		endTime: log.endTime,
		type: log.type,
		note: log.note,
		deletedAt: log.deletedAt,
		correctedBy: log.correctedBy,
		taskId: log.taskId,
		clockMethod: log.clockMethod,
		createdAt: log.createdAt,
		updatedAt: log.updatedAt,
		employeeId: log.employeeId,
		stationId: log.stationId,
		employee: log.Employee,
		station: log.Station,
	});

	const mobileActiveLogs = activeLogs.map(toMobileLog) as Parameters<
		typeof MobileTimeClock
	>[0]["activeLogs"];
	const mobileActiveBreaks = activeBreaks.map(toMobileLog) as Parameters<
		typeof MobileTimeClock
	>[0]["activeBreaks"];

	return (
		<MobileTimeClock
			employees={employees}
			stations={stations}
			activeLogs={mobileActiveLogs}
			activeBreaks={mobileActiveBreaks}
			activeTasksByEmployee={activeTasksByEmployee}
			assignmentMode={assignmentMode}
			taskOptions={taskOptions}
		/>
	);
}
