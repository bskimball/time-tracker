import { beforeEach, describe, expect, it, vi } from "vitest";
import MobileFloorRoute from "~/routes/floor/time-clock/mobile/route";
import { mockDb } from "~/__tests__/setup";

vi.mock("~/lib/ensure-operational-data", () => ({
	ensureOperationalDataSeeded: vi.fn(() => Promise.resolve()),
}));

vi.mock("~/lib/operational-config", () => ({
	getTaskAssignmentMode: vi.fn(() => Promise.resolve("MANAGER_ONLY")),
}));

describe("Floor mobile route", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("loads and renders mobile clock data with minimal DTO fields", async () => {
		mockDb.employee.findMany.mockResolvedValue([{ id: "emp-1", name: "Alice" }]);
		mockDb.station.findMany.mockResolvedValue([{ id: "st-1", name: "PICKING" }]);
		mockDb.timeLog.findMany.mockResolvedValueOnce([]).mockResolvedValueOnce([]);
		mockDb.taskType.findMany.mockResolvedValue([]);
		mockDb.taskAssignment.findMany.mockResolvedValue([]);

		const node = await MobileFloorRoute();

		expect(node).toBeDefined();
		expect(mockDb.employee.findMany).toHaveBeenCalledWith(
			expect.objectContaining({ select: { id: true, name: true } })
		);
		expect(mockDb.station.findMany).toHaveBeenCalledWith(
			expect.objectContaining({ select: { id: true, name: true } })
		);
		expect(mockDb.timeLog.findMany).toHaveBeenCalledWith(
			expect.objectContaining({
				include: {
					Employee: { select: { id: true, name: true } },
					Station: { select: { id: true, name: true } },
				},
			})
		);
	});
});
