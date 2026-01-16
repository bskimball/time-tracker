import { describe, it, expect, beforeEach, vi } from "vitest";
import Component from "~/routes/home/route";

type RedirectingFn = () => Promise<never> | Promise<void>;

async function consumeRedirect(fn: RedirectingFn): Promise<Response> {
	try {
		await Promise.resolve().then(fn);
		throw new Error("Expected redirect but none thrown");
	} catch (error) {
		if (error instanceof Response) {
			return error;
		}
		throw error;
	}
}

describe("Home Route", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("exports a component function", () => {
		expect(typeof Component).toBe("function");
	});

	it("redirects unauthenticated users to login", async () => {
		const response = await consumeRedirect(() => Component());
		expect(response.status).toBe(302);
		expect(response.headers.get("Location")).toBe("/login");
	});

	it("redirects authenticated users by role", async () => {
		const auth = await import("~/lib/auth");
		vi.spyOn(auth, "validateRequest").mockResolvedValueOnce({
			session: {} as any,
			user: { role: "MANAGER" } as any,
		});
		const response = await consumeRedirect(() => Component());
		expect(response.headers.get("Location")).toBe("/manager");
	});
});
