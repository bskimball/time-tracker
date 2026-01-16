// Factory functions for creating test data
export const createEmployee = (overrides: Partial<any> = {}) => ({
	id: `emp-${crypto.randomUUID().slice(0, 8)}`,
	name: "Test Employee",
	email: "test@example.com",
	pinHash: null,
	lastStationId: null,
	dailyHoursLimit: 8.0,
	weeklyHoursLimit: 40.0,
	createdAt: new Date(),
	...overrides,
});

export const createStation = (overrides: Partial<any> = {}) => ({
	id: `station-${crypto.randomUUID().slice(0, 8)}`,
	name: "PICKING",
	createdAt: new Date(),
	...overrides,
});

export const createTimeLog = (overrides: Partial<any> = {}) => ({
	id: `log-${crypto.randomUUID().slice(0, 8)}`,
	employeeId: "emp-1",
	stationId: "station-1",
	type: "WORK",
	startTime: new Date(),
	endTime: null,
	note: null,
	deletedAt: null,
	createdAt: new Date(),
	updatedAt: new Date(),
	...overrides,
});

export const createUser = (overrides: Partial<any> = {}) => ({
	id: `user-${crypto.randomUUID().slice(0, 8)}`,
	email: "user@example.com",
	name: "Test User",
	image: null,
	role: "WORKER",
	employeeId: "emp-1",
	createdAt: new Date(),
	updatedAt: new Date(),
	...overrides,
});

export const createTodo = (overrides: Partial<any> = {}) => ({
	id: `todo-${crypto.randomUUID().slice(0, 8)}`,
	title: "Test Todo",
	completed: false,
	createdAt: new Date(),
	updatedAt: new Date(),
	...overrides,
});

// Builder pattern for complex test data
export class EmployeeBuilder {
	private employee: any;

	constructor() {
		this.employee = createEmployee();
	}

	withPin(pin: string) {
		this.employee.pinHash = `$2b$10$${pin}`;
		return this;
	}

	withDailyLimit(hours: number) {
		this.employee.dailyHoursLimit = hours;
		return this;
	}

	withWeeklyLimit(hours: number) {
		this.employee.weeklyHoursLimit = hours;
		return this;
	}

	withName(name: string) {
		this.employee.name = name;
		this.employee.email = name.toLowerCase().replace(/\s+/g, ".") + "@example.com";
		return this;
	}

	build() {
		return this.employee;
	}
}

export class TimeLogBuilder {
	private timeLog: any;

	constructor() {
		this.timeLog = createTimeLog();
	}

	forEmployee(employeeId: string) {
		this.timeLog.employeeId = employeeId;
		return this;
	}

	atStation(stationId: string) {
		this.timeLog.stationId = stationId;
		return this;
	}

	of(type: "WORK" | "BREAK") {
		this.timeLog.type = type;
		return this;
	}

	startedAt(startTime: Date) {
		this.timeLog.startTime = startTime;
		return this;
	}

	endedAt(endTime: Date | null) {
		this.timeLog.endTime = endTime;
		return this;
	}

	withNote(note: string) {
		this.timeLog.note = note;
		return this;
	}

	build() {
		return this.timeLog;
	}
}

// Scenario builders
export class TestDataFactory {
	static createWarehouseScenario() {
		const employees = [
			new EmployeeBuilder().withName("Alice Johnson").withPin("1234").withDailyLimit(8).build(),
			new EmployeeBuilder().withName("Bob Smith").withDailyLimit(10).build(),
			new EmployeeBuilder().withName("Charlie Brown").withPin("5678").withWeeklyLimit(35).build(),
		];

		const stations = [
			createStation({ name: "PICKING" }),
			createStation({ name: "PACKING" }),
			createStation({ name: "FILLING" }),
		];

		const now = new Date();
		const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

		const timeLogs = [
			// Active work session for Alice
			new TimeLogBuilder()
				.forEmployee(employees[0].id)
				.atStation(stations[0].id)
				.of("WORK")
				.startedAt(new Date(now.getTime() - 2 * 60 * 60 * 1000)) // 2 hours ago
				.build(),

			// Completed session for Bob
			new TimeLogBuilder()
				.forEmployee(employees[1].id)
				.atStation(stations[1].id)
				.of("WORK")
				.startedAt(new Date(yesterday.getTime() + 9 * 60 * 60 * 1000))
				.endedAt(new Date(yesterday.getTime() + 17 * 60 * 60 * 1000))
				.build(),

			// Break for Alice
			new TimeLogBuilder()
				.forEmployee(employees[0].id)
				.atStation(stations[0].id)
				.of("BREAK")
				.startedAt(new Date(now.getTime() - 4 * 60 * 60 * 1000))
				.endedAt(new Date(now.getTime() - 3.5 * 60 * 60 * 1000))
				.build(),
		];

		return { employees, stations, timeLogs };
	}

	static createOvertimeScenario() {
		const employee = new EmployeeBuilder()
			.withName("Diana Prince")
			.withPin("9999")
			.withDailyLimit(8)
			.build();

		const today = new Date();
		const timeLogs = [
			// Long work session that exceeds daily limit
			new TimeLogBuilder()
				.forEmployee(employee.id)
				.of("WORK")
				.startedAt(new Date(today.getTime() - 10 * 60 * 60 * 1000)) // 10 hours ago
				.endedAt(new Date(today.getTime() - 2 * 60 * 60 * 1000)) // 2 hours ago
				.build(),
		];

		return { employee, timeLogs };
	}

	static createBreakComplianceScenario() {
		const employee = new EmployeeBuilder().withName("Eve Wilson").withPin("1111").build();

		const today = new Date();
		const startTime = new Date(today.getTime() - 8 * 60 * 60 * 1000); // 8 hours ago

		const timeLogs = [
			// Work session
			new TimeLogBuilder()
				.forEmployee(employee.id)
				.of("WORK")
				.startedAt(startTime)
				.endedAt(new Date(startTime.getTime() + 4 * 60 * 60 * 1000))
				.build(),

			// Proper break
			new TimeLogBuilder()
				.forEmployee(employee.id)
				.of("BREAK")
				.startedAt(new Date(startTime.getTime() + 4 * 60 * 60 * 1000))
				.endedAt(new Date(startTime.getTime() + 4.5 * 60 * 60 * 1000))
				.build(),

			// Resume work
			new TimeLogBuilder()
				.forEmployee(employee.id)
				.of("WORK")
				.startedAt(new Date(startTime.getTime() + 4.5 * 60 * 60 * 1000))
				.endedAt(new Date(startTime.getTime() + 8 * 60 * 60 * 1000))
				.build(),
		];

		return { employee, timeLogs };
	}
}
