export type TaskType = {
	id: string;
	name: string;
	stationId: string;
	description: string | null;
	estimatedMinutesPerUnit: number | null;
	isActive: boolean;
	Station: { id: string; name: string };
};

export type TaskAssignment = {
	id: string;
	employeeId: string;
	taskTypeId: string;
	source?: "MANAGER" | "WORKER" | null;
	assignedByUserId?: string | null;
	startTime: Date;
	endTime: Date | null;
	unitsCompleted: number | null;
	notes: string | null;
	Employee: {
		id: string;
		name: string;
		email: string;
		defaultStation?: { id: string; name: string } | null;
	};
	TaskType: TaskType;
};

export type Employee = {
	id: string;
	name: string;
	email: string;
	defaultStation?: { id: string; name: string } | null;
};

export type Station = {
	id: string;
	name: string;
};
