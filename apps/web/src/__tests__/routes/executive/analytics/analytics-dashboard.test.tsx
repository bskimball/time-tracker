import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { ProductivityEmployeeTableContent } from "~/routes/executive/analytics/analytics-dashboard";

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
