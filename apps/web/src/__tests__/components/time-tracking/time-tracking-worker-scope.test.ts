import { describe, expect, it } from "vitest";
import { getVisibleClockEmployees } from "~/components/time-tracking/time-tracking";

describe("worker manual-select scoping", () => {
	it("returns full roster for non-worker sessions", () => {
		const employees = [
			{ id: "a", name: "Alex" },
			{ id: "b", name: "Blair" },
		] as any[];

		expect(getVisibleClockEmployees(employees as any, null)).toHaveLength(2);
	});

	it("returns only worker identity when worker is logged in", () => {
		const employees = [
			{ id: "a", name: "Alex" },
			{ id: "b", name: "Blair" },
		] as any[];

		expect(getVisibleClockEmployees(employees as any, "b")).toEqual([employees[1]]);
	});
});
