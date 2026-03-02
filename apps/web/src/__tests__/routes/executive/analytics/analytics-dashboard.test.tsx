import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import {
	getStaffShortageTrend,
	ProductivityEmployeeTableContent,
} from "~/routes/executive/analytics/analytics-dashboard";

describe("Analytics productivity employee table", () => {
	it("renders per-employee units, hours, and rate when source data is available", () => {
		render(
			<ProductivityEmployeeTableContent
				employeeProductivity={[
					{
						employee: "Alice",
						value: 28,
						station: "PICKING",
						units: 112,
						hours: 4,
						rate: 28,
						hasSourceData: true,
					},
				] as any}
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
		expect(within(row as HTMLElement).getByText("112")).toBeInTheDocument();
		expect(within(row as HTMLElement).getByText("4.0")).toBeInTheDocument();
		expect(within(row as HTMLElement).getByText("28.0 u/h")).toBeInTheDocument();
		expect(
			screen.queryByText(
				"Rate values are hidden when per-employee Units/Hours source data is unavailable."
			)
		).not.toBeInTheDocument();
	});

	it("renders derived estimate fallback when per-employee volume inputs are unavailable", () => {
		render(
			<ProductivityEmployeeTableContent
				employeeProductivity={[
					{
						employee: "Alice",
						value: 28,
						station: "PICKING",
						units: null,
						hours: null,
						rate: null,
						hasSourceData: false,
					},
				] as any}
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
		expect(
			screen.getByText(
				"Rate values are hidden when per-employee Units/Hours source data is unavailable."
			)
		).toBeInTheDocument();
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
			direction: "up",
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
