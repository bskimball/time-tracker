import { vi } from "vitest";
// Mock Prisma client for testing
export const createMockDb = () => ({
	employee: {
		findMany: vi.fn(),
		findUnique: vi.fn(),
		findFirst: vi.fn(),
		create: vi.fn(),
		update: vi.fn(),
		delete: vi.fn(),
		count: vi.fn(),
	},
	station: {
		findMany: vi.fn(),
		findUnique: vi.fn(),
		findFirst: vi.fn(),
		create: vi.fn(),
		update: vi.fn(),
		delete: vi.fn(),
		count: vi.fn(),
	},
	timeLog: {
		findMany: vi.fn(),
		findUnique: vi.fn(),
		findFirst: vi.fn(),
		create: vi.fn(),
		update: vi.fn(),
		delete: vi.fn(),
		count: vi.fn(),
	},
	todo: {
		findMany: vi.fn(),
		findUnique: vi.fn(),
		findFirst: vi.fn(),
		create: vi.fn(),
		update: vi.fn(),
		delete: vi.fn(),
		count: vi.fn(),
	},
	user: {
		findMany: vi.fn(),
		findUnique: vi.fn(),
		findFirst: vi.fn(),
		create: vi.fn(),
		update: vi.fn(),
		delete: vi.fn(),
		count: vi.fn(),
	},
	session: {
		findMany: vi.fn(),
		findUnique: vi.fn(),
		findFirst: vi.fn(),
		create: vi.fn(),
		update: vi.fn(),
		delete: vi.fn(),
		count: vi.fn(),
	},
	$transaction: vi.fn((callback) => {
		const mockDb = createMockDb();
		return callback(mockDb);
	}),
	$connect: vi.fn(),
	$disconnect: vi.fn(),
});

// Sample test data
export const mockEmployees = [
	{
		id: "emp-1",
		name: "Alice Johnson",
		email: "alice@example.com",
		pinHash: "$2b$10$hash1",
		lastStationId: "station-1",
		dailyHoursLimit: 8.0,
		weeklyHoursLimit: 40.0,
		createdAt: new Date("2024-01-01T00:00:00Z"),
	},
	{
		id: "emp-2",
		name: "Bob Smith",
		email: "bob@example.com",
		pinHash: null,
		lastStationId: null,
		dailyHoursLimit: 8.0,
		weeklyHoursLimit: 40.0,
		createdAt: new Date("2024-01-02T00:00:00Z"),
	},
];

export const mockStations = [
	{
		id: "station-1",
		name: "PICKING",
		createdAt: new Date("2024-01-01T00:00:00Z"),
	},
	{
		id: "station-2",
		name: "PACKING",
		createdAt: new Date("2024-01-01T00:00:00Z"),
	},
	{
		id: "station-3",
		name: "FILLING",
		createdAt: new Date("2024-01-01T00:00:00Z"),
	},
];

export const mockTimeLogs = [
	{
		id: "log-1",
		employeeId: "emp-1",
		stationId: "station-1",
		type: "WORK" as const,
		startTime: new Date("2024-01-01T09:00:00Z"),
		endTime: null,
		note: null,
		deletedAt: null,
		createdAt: new Date("2024-01-01T09:00:00Z"),
		updatedAt: new Date("2024-01-01T09:00:00Z"),
	},
	{
		id: "log-2",
		employeeId: "emp-1",
		stationId: "station-1",
		type: "BREAK" as const,
		startTime: new Date("2024-01-01T12:00:00Z"),
		endTime: new Date("2024-01-01T12:30:00Z"),
		note: null,
		deletedAt: null,
		createdAt: new Date("2024-01-01T12:00:00Z"),
		updatedAt: new Date("2024-01-01T12:30:00Z"),
	},
];

export const mockTimeLogsWithRelations = mockTimeLogs.map((log) => ({
	...log,
	Employee: mockEmployees.find((emp) => emp.id === log.employeeId)!,
	Station: mockStations.find((station) => station.id === log.stationId) || null,
}));

export const mockUsers = [
	{
		id: "user-1",
		email: "admin@example.com",
		name: "Admin User",
		image: null,
		role: "ADMIN" as const,
		employeeId: "emp-1",
		createdAt: new Date("2024-01-01T00:00:00Z"),
		updatedAt: new Date("2024-01-01T00:00:00Z"),
	},
];

export const mockTodos = [
	{
		id: "todo-1",
		title: "Test todo 1",
		completed: false,
		createdAt: new Date("2024-01-01T00:00:00Z"),
		updatedAt: new Date("2024-01-01T00:00:00Z"),
	},
	{
		id: "todo-2",
		title: "Test todo 2",
		completed: true,
		createdAt: new Date("2024-01-01T00:00:00Z"),
		updatedAt: new Date("2024-01-01T00:00:00Z"),
	},
];
