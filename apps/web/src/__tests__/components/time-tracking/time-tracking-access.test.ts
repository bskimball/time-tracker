import { describe, expect, it } from "vitest";
import {
	getAvailableClockMethods,
	getVisibleClockEmployees,
} from "~/components/time-tracking/time-tracking";

describe("time tracking worker access controls", () => {
	it("only allows manual-select mode for worker sessions", () => {
		expect(getAvailableClockMethods({ id: "worker-1", name: "Worker" } as any)).toEqual([
			"select",
		]);
	});

	it("keeps pin and manual modes for kiosk/shared usage", () => {
		expect(getAvailableClockMethods(null)).toEqual(["pin", "select"]);
	});

	it("limits visible personnel options to the logged-in worker", () => {
		const allEmployees = [
			{ id: "worker-1", name: "Worker One" },
			{ id: "worker-2", name: "Worker Two" },
		] as any[];
		const worker = allEmployees[0];

		expect(getVisibleClockEmployees(allEmployees as any, worker as any)).toEqual([worker]);
	});
});
