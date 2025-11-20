import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import Component from "~/routes/home/route";

describe("Home Route", () => {
	it("exports a component function", () => {
		expect(typeof Component).toBe("function");
	});

	it("renders a redirect placeholder message", () => {
		const markup = renderToStaticMarkup(Component());
		expect(markup).toContain("Redirecting...");
		expect(markup).toContain("If you see this, there&#x27;s a bug in the routing logic.");
	});
});
