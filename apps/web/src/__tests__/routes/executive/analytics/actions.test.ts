import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockDb } from "~/__tests__/setup";
import {
	getComparativeAnalyticsData,
	getShiftProductivityData,
} from "~/routes/executive/analytics/actions";

const { mockGetPerformanceTrends, mockGetStationPerformance, mockGetLaborCostAnalysis } =
	vi.hoisted(() => ({
		mockGetPerformanceTrends: vi.fn(),
		mockGetStationPerformance: vi.fn(),
		mockGetLaborCostAnalysis: vi.fn(),
	}));

const { mockEnsureOperationalDataSeeded } = vi.hoisted(() => ({
	mockEnsureOperationalDataSeeded: vi.fn(),
}));

vi.mock("~/lib/analytics", () => ({
	getPerformanceTrends: mockGetPerformanceTrends,
	getStationPerformance: mockGetStationPerformance,
	getLaborCostAnalysis: mockGetLaborCostAnalysis,
}));

vi.mock("~/lib/ensure-operational-data", () => ({
	ensureOperationalDataSeeded: mockEnsureOperationalDataSeeded,
}));

describe("executive analytics actions", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		(
			mockDb as unknown as { performanceMetric: { count: ReturnType<typeof vi.fn> } }
		).performanceMetric = {
			count: vi.fn().mockResolvedValue(1),
		};
		mockGetStationPerformance.mockResolvedValue([]);
		mockGetLaborCostAnalysis.mockResolvedValue({
			actualCost: 100,
			budgetedCost: 90,
			variance: 10,
			variancePercentage: 11.1,
			hourlyCost: 18.5,
			overtimeCost: 20,
			regularCost: 80,
		});
	});

	it("builds comparative chart payload and seeds data when metrics are empty", async () => {
		(
			mockDb as unknown as { performanceMetric: { count: ReturnType<typeof vi.fn> } }
		).performanceMetric.count.mockResolvedValue(0);
		mockGetPerformanceTrends
			.mockResolvedValueOnce([
				{ date: new Date("2025-01-01T00:00:00.000Z"), value: 10 },
				{ date: new Date("2025-01-02T00:00:00.000Z"), value: 12 },
			])
			.mockResolvedValueOnce([
				{ date: new Date("2024-12-30T00:00:00.000Z"), value: 8 },
				{ date: new Date("2024-12-31T00:00:00.000Z"), value: 9 },
			])
			.mockResolvedValueOnce([
				{ date: new Date("2025-01-01T00:00:00.000Z"), value: 5 },
				{ date: new Date("2025-01-02T00:00:00.000Z"), value: 6 },
			])
			.mockResolvedValueOnce([
				{ date: new Date("2024-12-30T00:00:00.000Z"), value: 7 },
				{ date: new Date("2024-12-31T00:00:00.000Z"), value: 7 },
			]);

		const result = await getComparativeAnalyticsData("week", "previous-period");

		expect(mockEnsureOperationalDataSeeded).toHaveBeenCalledTimes(1);
		expect(result.summary.productivity.current).toBe(11);
		expect(result.summary.productivity.comparison).toBe(8.5);
		expect(result.summary.costPerUnit.current).toBe(5.5);
		expect(result.charts.productivityComparison.labels).toHaveLength(2);
		expect(result.charts.productivityComparison.datasets[0].data).toEqual([10, 12]);
	});

	it("groups completed assignments into shift productivity buckets", async () => {
		mockDb.taskAssignment.findMany.mockResolvedValue([
			{
				startTime: new Date("2025-02-10T08:00:00"),
				endTime: new Date("2025-02-10T10:00:00"),
				unitsCompleted: 50,
			},
			{
				startTime: new Date("2025-02-10T16:00:00"),
				endTime: new Date("2025-02-10T18:00:00"),
				unitsCompleted: 30,
			},
		]);

		const result = await getShiftProductivityData("today");

		expect(result.labels).toEqual(["Morning", "Afternoon", "Night"]);
		expect(result.datasets[0].data).toEqual([25, 15, 0]);
	});
});
