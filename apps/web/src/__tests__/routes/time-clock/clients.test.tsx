import { describe, it, expect, beforeEach, vi } from "vitest";
import TimeClockRoute from "~/routes/time-clock/route";
import { mockDb } from "~/__tests__/setup";

vi.mock("~/components/time-tracking/hooks", () => ({
	useKioskMode: () => [false, vi.fn()],
	useAutoRefresh: vi.fn(),
}));

vi.mock("~/components/time-tracking/notifications", () => ({
	notify: vi.fn(),
	subscribe: vi.fn(() => vi.fn()),
}));

vi.mock("~/components/time-tracking/offline-queue", () => ({
	useOfflineActionQueue: () => ({
		queue: [],
		enqueue: vi.fn(),
		sync: vi.fn(),
		status: "idle",
	}),
}));

vi.mock("~/routes/time-clock/actions", () => ({
	startSelfTask: vi.fn(),
	startSelfTaskAction: vi.fn(),
	switchSelfTask: vi.fn(),
	switchSelfTaskAction: vi.fn(),
	endSelfTask: vi.fn(),
	endSelfTaskAction: vi.fn(),
	clockIn: vi.fn(),
	clockOut: vi.fn(),
	startBreak: vi.fn(),
	endBreak: vi.fn(),
	updateTimeLog: vi.fn(),
	deleteTimeLog: vi.fn(),
	pinToggleClock: vi.fn(),
}));

vi.mock("~/lib/operational-config", () => ({
	getTaskAssignmentMode: vi.fn(() => Promise.resolve("MANAGER_ONLY")),
}));

vi.mock("~/lib/domain/time-tracking", () => ({
	calculateNetHours: () => 8,
	isOvertime: () => false,
	getWeekBounds: () => ({
		start: new Date("2024-01-01"),
		end: new Date("2024-01-07"),
	}),
	DEFAULT_DAILY_LIMIT: 8,
	DEFAULT_WEEKLY_LIMIT: 40,
}));

vi.mock("~/lib/auth", () => ({
	validateRequest: vi.fn(() => Promise.resolve({ user: { name: "Test User" } })),
}));

vi.mock("~/components/header", () => ({
	Header: ({ user }: { user: { name: string } | null }) => (
		<header>
			<span>Header</span>
			<span>{user?.name}</span>
		</header>
	),
}));

vi.mock("~/components/footer", () => ({
	Footer: () => <footer>Footer</footer>,
}));

describe("Time clock route", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("renders with fetched data", async () => {
		mockDb.taskAssignment.findMany.mockResolvedValue([]);
		mockDb.taskType.findMany.mockResolvedValue([]);

		const node = await TimeClockRoute();

		expect(node).toBeDefined();
		expect(mockDb.employee.findMany).toHaveBeenCalled();
		expect(mockDb.station.findMany).toHaveBeenCalled();
		expect(mockDb.timeLog.findMany).toHaveBeenCalled();
	});
});
