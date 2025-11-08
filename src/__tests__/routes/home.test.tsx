import { describe, it, expect, beforeEach, vi } from "vitest";
import Component from "~/routes/home/route";

vi.mock("react-router", () => ({
	redirect: vi.fn(() => ({ redirected: true, status: 302 })),
}));

describe("Home Route", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("exports a component function", () => {
		expect(typeof Component).toBe("function");
	});

	it("returns static markup", () => {
		const element = Component();
		expect(element).toBeDefined();
	});
});
