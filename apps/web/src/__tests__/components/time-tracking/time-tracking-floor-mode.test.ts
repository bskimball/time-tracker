import { describe, expect, it } from "vitest";
import { getAvailableClockMethods } from "~/components/time-tracking/time-tracking";

describe("worker floor clock modes", () => {
	it("hides pin mode for worker sessions", () => {
		expect(getAvailableClockMethods("worker-1")).toEqual(["select"]);
	});

	it("keeps pin and manual modes for shared/kiosk usage", () => {
		expect(getAvailableClockMethods(null)).toEqual(["pin", "select"]);
	});
});
