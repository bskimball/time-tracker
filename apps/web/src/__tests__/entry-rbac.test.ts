import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockValidateRequest } = vi.hoisted(() => ({
	mockValidateRequest: vi.fn(),
}));

vi.mock("@vitejs/plugin-rsc/rsc", () => ({
	createTemporaryReferenceSet: vi.fn(),
	decodeAction: vi.fn(),
	decodeFormState: vi.fn(),
	decodeReply: vi.fn(),
	loadServerAction: vi.fn(),
	renderToReadableStream: vi.fn(),
}));

vi.mock("react-router", () => ({
	unstable_matchRSCServerRequest: vi.fn(),
}));

vi.mock("~/lib/request-context", () => ({
	runWithRequest: (_request: Request, callback: () => Promise<Response>) => callback(),
}));

vi.mock("~/lib/auth", () => ({
	validateRequest: mockValidateRequest,
	invalidateSession: vi.fn(),
	deleteSessionTokenCookie: vi.fn(() => "session=; Max-Age=0"),
}));

import handler from "~/entry.rsc";

describe("entry RBAC redirects", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("routes executive role to executive home from dashboard", async () => {
		mockValidateRequest.mockResolvedValue({ user: { role: "EXECUTIVE" } });

		const response = await handler(new Request("http://localhost/dashboard"));

		expect(response.status).toBe(302);
		expect(response.headers.get("Location")).toBe("/executive");
	});

	it("redirects executive role away from manager routes to executive home", async () => {
		mockValidateRequest.mockResolvedValue({ user: { role: "EXECUTIVE" } });

		const response = await handler(new Request("http://localhost/manager"));

		expect(response.status).toBe(302);
		expect(response.headers.get("Location")).toBe("/executive");
	});

	it("redirects executive role away from floor routes to executive home", async () => {
		mockValidateRequest.mockResolvedValue({ user: { role: "EXECUTIVE" } });

		const response = await handler(new Request("http://localhost/floor"));

		expect(response.status).toBe(302);
		expect(response.headers.get("Location")).toBe("/executive");
	});

	it("redirects manager role away from executive routes to manager home", async () => {
		mockValidateRequest.mockResolvedValue({ user: { role: "MANAGER" } });

		const response = await handler(new Request("http://localhost/executive"));

		expect(response.status).toBe(302);
		expect(response.headers.get("Location")).toBe("/manager");
	});
});
