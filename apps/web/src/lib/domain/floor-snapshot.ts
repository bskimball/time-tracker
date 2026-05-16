import type { PrismaClient } from "@prisma/client";

type ActiveTaskAssignment = {
	employeeId: string;
	id: string;
	startTime: Date;
	Employee?: { name: string };
	TaskType: {
		name: string;
		Station: { name: string } | null;
	};
};

type ActiveTaskByEmployee = Record<
	string,
	{
		assignmentId: string;
		employeeName?: string;
		taskTypeName: string;
		stationName: string | null;
		startTime?: Date;
	}
>;

export function buildActiveTasksByEmployee(
	activeAssignments: ActiveTaskAssignment[],
	options: { includeEmployeeName?: boolean; includeStartTime?: boolean } = {}
) {
	return activeAssignments.reduce<ActiveTaskByEmployee>((acc, assignment) => {
		if (acc[assignment.employeeId]) {
			return acc;
		}

		acc[assignment.employeeId] = {
			assignmentId: assignment.id,
			...(options.includeEmployeeName ? { employeeName: assignment.Employee?.name } : {}),
			taskTypeName: assignment.TaskType.name,
			stationName: assignment.TaskType.Station?.name ?? null,
			...(options.includeStartTime ? { startTime: assignment.startTime } : {}),
		};

		return acc;
	}, {});
}

export function buildTaskOptions(
	activeTaskTypes: Array<{ id: string; name: string; Station: { name: string } | null }>
) {
	return activeTaskTypes.map((taskType) => ({
		id: taskType.id,
		name: taskType.name,
		stationName: taskType.Station?.name ?? null,
	}));
}

export function buildManagerActiveTasksByEmployee(
	activeAssignments: Array<
		ActiveTaskAssignment & {
			Employee: { name: string };
		}
	>
) {
	return activeAssignments.reduce<
		Record<
			string,
			{
				assignmentId: string;
				employeeName: string;
				taskTypeName: string;
				stationName: string | null;
				startTime: Date;
			}
		>
	>((acc, assignment) => {
		if (acc[assignment.employeeId]) {
			return acc;
		}

		acc[assignment.employeeId] = {
			assignmentId: assignment.id,
			employeeName: assignment.Employee.name,
			taskTypeName: assignment.TaskType.name,
			stationName: assignment.TaskType.Station?.name ?? null,
			startTime: assignment.startTime,
		};

		return acc;
	}, {});
}

export async function getActiveFloorTaskState(db: PrismaClient) {
	const [activeTaskTypes, activeAssignments] = await Promise.all([
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

	return {
		taskOptions: buildTaskOptions(activeTaskTypes),
		activeTasksByEmployee: buildActiveTasksByEmployee(activeAssignments),
	};
}
