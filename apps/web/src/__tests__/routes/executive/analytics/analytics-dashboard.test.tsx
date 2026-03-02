import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import {
	getStaffShortageTrend,
	ProductivityEmployeeTableContent,
} from "~/routes/executive/analytics/analytics-dashboard";

describe("Analytics productivity employee table", () => {
	it("renders derived estimate fallback when per-employee volume inputs are unavailable", () => {
		render(
			<ProductivityEmployeeTableContent
				employeeProductivity={[{ employee: "Alice", value: 28, station: "PICKING" }] as any}
				benchmarkData={
					{
						productivity: { current: 20, industryAvg: 18, top10Percent: 30 },
						quality: { current: 95 },
					} as any
				}
			/>
		);

		const employeeCell = screen.getByText("Alice");
		const row = employeeCell.closest("tr");
		expect(row).toBeTruthy();
		expect(within(row as HTMLElement).getByText("Derived estimate")).toBeInTheDocument();
	});
});

describe("getStaffShortageTrend", () => {
	it("marks zero shortage as on target", () => {
		expect(getStaffShortageTrend(0)).toEqual({
			direction: "neutral",
			value: "On Target",
			label: "No shortage",
		});
	});

	it("marks small shortage as watch", () => {
		expect(getStaffShortageTrend(2)).toEqual({
			direction: "neutral",
			value: "Watch",
			label: "Minor gap",
		});
	});

	it("marks larger shortage as critical", () => {
		expect(getStaffShortageTrend(4)).toEqual({
			direction: "down",
			value: "Critical",
			label: "Impact High",
		});
	});
});
