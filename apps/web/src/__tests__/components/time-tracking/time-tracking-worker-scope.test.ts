import { describe, expect, it } from "vitest";
import { getVisibleClockEmployees } from "~/components/time-tracking/time-tracking";

describe("worker manual-select scoping", () => {
	it("returns full roster for non-worker sessions (no worker id provided)", () => {
		const employees = [
			{ id: "a", name: "Alex" },
			{ id: "b", name: "Blair" },
		];

		expect(getVisibleClockEmployees(employees, undefined)).toHaveLength(2);
	});

	it("returns empty roster when worker session has no linked employee", () => {
		const employees = [
			{ id: "a", name: "Alex" },
			{ id: "b", name: "Blair" },
		];

		expect(getVisibleClockEmployees(employees, null)).toHaveLength(0);
	});

	it("returns only worker identity when worker is logged in", () => {
		const employees = [
			{ id: "a", name: "Alex" },
			{ id: "b", name: "Blair" },
		];

		expect(getVisibleClockEmployees(employees, "b")).toEqual([employees[1]]);
	});
});
