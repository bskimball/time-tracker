import { describe, expect, it } from "vitest";
import { normalizeComparisonForRange } from "~/routes/executive/time-range-tabs";
import { getNormalizedComparison } from "~/routes/executive/analytics/comparison-tabs";

describe("executive analytics query normalization", () => {
	it("keeps valid compare when range changes", () => {
		expect(normalizeComparisonForRange("month", "rolling-30d")).toBe("rolling-30d");
	});

	it("falls back to default compare when compare is missing", () => {
		expect(normalizeComparisonForRange("week", null)).toBe("previous-period");
	});

	it("normalizes invalid compare to the first available option", () => {
		expect(getNormalizedComparison(["previous-period", "last-year"], "rolling-30d")).toBe(
			"previous-period"
		);
	});
});
