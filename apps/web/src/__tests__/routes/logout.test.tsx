import { describe, it, expect, beforeEach, vi } from "vitest";
import Component from "~/routes/logout/route";

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

describe("Logout Route", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("redirects to login and clears session cookie when no active session", async () => {
		const auth = await import("~/lib/auth");
		vi.spyOn(auth, "validateRequest").mockResolvedValueOnce({
			session: null,
			user: null,
		});
		const response = await consumeRedirect(() => Component());
		expect(response.status).toBe(302);
		expect(response.headers.get("Location")).toBe("/login");
	});

	it("invalidates existing session and redirects to login", async () => {
		const auth = await import("~/lib/auth");
		const invalidateSession = vi
			.spyOn(auth, "invalidateSession")
			.mockResolvedValueOnce(undefined as unknown as void);
		vi.spyOn(auth, "validateRequest").mockResolvedValueOnce({
			session: { id: "session-123" } as any,
			user: { id: "user-123" } as any,
		});
		const response = await consumeRedirect(() => Component());
		expect(invalidateSession).toHaveBeenCalledWith("session-123");
		expect(response.status).toBe(302);
		expect(response.headers.get("Location")).toBe("/login");
	});
});
