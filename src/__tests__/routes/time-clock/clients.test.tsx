import { describe, it, expect, beforeEach, vi } from "vitest";
import TimeClockRoute from "~/routes/time-clock/route";
import { mockDb } from "~/__tests__/setup";

vi.mock("~/routes/time-clock/hooks", () => ({
	useKioskMode: () => [false, vi.fn()],
	useAutoRefresh: vi.fn(),
}));

vi.mock("~/routes/time-clock/notifications", () => ({
	notify: vi.fn(),
	subscribe: vi.fn(() => vi.fn()),
}));

vi.mock("~/routes/time-clock/offline-queue", () => ({
	useOfflineActionQueue: () => ({
		queue: [],
		enqueue: vi.fn(),
		sync: vi.fn(),
		status: "idle",
	}),
}));

vi.mock("~/routes/time-clock/actions", () => ({
	clockIn: vi.fn(),
	clockOut: vi.fn(),
	startBreak: vi.fn(),
	endBreak: vi.fn(),
	updateTimeLog: vi.fn(),
	deleteTimeLog: vi.fn(),
	pinToggleClock: vi.fn(),
}));

vi.mock("~/routes/time-clock/utils", () => ({
	calculateNetHours: () => 8,
	isOvertime: () => false,
	getWeekBounds: () => ({
		start: new Date("2024-01-01"),
		end: new Date("2024-01-07"),
	}),
	DEFAULT_DAILY_LIMIT: 8,
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
		const node = await TimeClockRoute();

		expect(node).toBeDefined();
		expect(mockDb.employee.findMany).toHaveBeenCalled();
		expect(mockDb.station.findMany).toHaveBeenCalled();
		expect(mockDb.timeLog.findMany).toHaveBeenCalled();
	});
});
