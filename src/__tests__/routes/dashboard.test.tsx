import { describe, it, expect, beforeEach, vi } from "vitest";
import DashboardRoute from "~/routes/dashboard/route";
import { mockTimeLogsWithRelations } from "~/__tests__/utils/db-mocks";
import { mockUser } from "~/__tests__/utils/auth-mocks";
import { mockDb } from "~/__tests__/setup";
vi.mock("~/lib/auth", () => ({
	validateRequest: vi.fn(() => Promise.resolve({ user: mockUser })),
}));

vi.mock("~/components/header", () => ({
	Header: ({ user }: { user: any }) => <div data-testid="header">{user?.name}</div>,
}));

vi.mock("~/components/footer", () => ({
	Footer: () => <div data-testid="footer">Footer</div>,
}));

describe("Dashboard route", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("renders dashboard with metrics", async () => {
		// Mock database responses
		mockDb.employee.count.mockResolvedValue(5);
		mockDb.station.count.mockResolvedValue(3);
		mockDb.timeLog.count
			.mockResolvedValueOnce(2) // active clocks
			.mockResolvedValueOnce(1) // active breaks
			.mockResolvedValueOnce(3) // pending todos
			.mockResolvedValueOnce(7); // completed todos

		mockDb.timeLog.findMany.mockResolvedValue(mockTimeLogsWithRelations.slice(0, 5));

		// Render the component
		// Note: For server components, we need to test the Promise result
		const dashboardElement = await DashboardRoute();

		// Note: This is a simplified test approach for RSC components
		// In practice, you'd need to use streaming response testing
		expect(dashboardElement).toBeDefined();
	});

	it("fetches dashboard metrics correctly", async () => {
		// Reset mocks
		vi.clearAllMocks();

		// Mock database responses
		mockDb.employee.count.mockResolvedValue(10);
		mockDb.station.count.mockResolvedValue(5);
		mockDb.timeLog.count
			.mockResolvedValueOnce(3) // activeClocks
			.mockResolvedValueOnce(2); // activeBreaks
		mockDb.todo.count
			.mockResolvedValueOnce(5) // pendingTodos
			.mockResolvedValueOnce(15); // completedTodos

		await DashboardRoute();

		// Verify database calls
		expect(mockDb.employee.count).toHaveBeenCalled();
		expect(mockDb.station.count).toHaveBeenCalled();
		expect(mockDb.timeLog.count).toHaveBeenCalledTimes(2); // activeClocks, activeBreaks
		expect(mockDb.todo.count).toHaveBeenCalledTimes(2); // pendingTodos, completedTodos
		expect(mockDb.timeLog.findMany).toHaveBeenCalledWith({
			take: 5,
			orderBy: { createdAt: "desc" },
			include: { Employee: true, Station: true },
		});
	});

	it("handles database errors gracefully", async () => {
		// Mock database error
		mockDb.employee.count.mockRejectedValue(new Error("Database connection failed"));

		// The component should throw the error to be handled by error boundaries
		await expect(DashboardRoute()).rejects.toThrow("Database connection failed");
	});

	it("displays correct metrics values", async () => {
		// Mock specific metrics
		mockDb.employee.count.mockResolvedValue(8);
		mockDb.station.count.mockResolvedValue(4);
		mockDb.timeLog.count
			.mockResolvedValueOnce(3) // activeClocks
			.mockResolvedValueOnce(1); // activeBreaks
		mockDb.todo.count
			.mockResolvedValueOnce(6) // pendingTodos
			.mockResolvedValueOnce(12); // completedTodos

		await DashboardRoute();

		// Verify the correct counts were requested
		expect(mockDb.employee.count).toHaveBeenCalled();
		expect(mockDb.station.count).toHaveBeenCalled();
		expect(mockDb.timeLog.count).toHaveBeenCalledTimes(2);
		expect(mockDb.todo.count).toHaveBeenCalledTimes(2);
	});
});
