import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockDb } from "~/__tests__/setup";
import { validateRequest, validateRequestWithRequest } from "~/lib/auth";
import { runWithRequest } from "~/lib/request-context";

function createRequest(cookie = "session=test-token") {
	return {
		url: "http://localhost/dashboard",
		method: "GET",
		headers: new Headers({ Cookie: cookie }),
	} as unknown as Request;
}

function createSessionQueryResult() {
	return {
		id: "session-1",
		userId: "user-1",
		expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 20),
		User: {
			id: "user-1",
			email: "user@example.com",
			name: "Test User",
			image: null,
			role: "ADMIN",
			employeeId: null,
			createdAt: new Date(),
			updatedAt: new Date(),
		},
	};
}

describe("auth request-scoped caching", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("memoizes auth validation within the same request context", async () => {
		mockDb.session.findFirst.mockResolvedValue(createSessionQueryResult());

		const request = createRequest();

		await runWithRequest(request, async () => {
			const first = await validateRequest();
			const second = await validateRequest();
			const third = await validateRequestWithRequest(request);

			expect(first.user?.id).toBe("user-1");
			expect(second.user?.id).toBe("user-1");
			expect(third.user?.id).toBe("user-1");
		});

		expect(mockDb.session.findFirst).toHaveBeenCalledTimes(1);
	});

	it("memoizes validation when the same explicit request is passed", async () => {
		mockDb.session.findFirst.mockResolvedValue(createSessionQueryResult());

		const request = createRequest();

		await validateRequestWithRequest(request);
		await validateRequestWithRequest(request);

		expect(mockDb.session.findFirst).toHaveBeenCalledTimes(1);
	});

	it("does not reuse cached auth results across different requests", async () => {
		mockDb.session.findFirst.mockResolvedValue(createSessionQueryResult());

		await runWithRequest(createRequest("session=token-a"), async () => {
			await validateRequest();
		});

		await runWithRequest(createRequest("session=token-b"), async () => {
			await validateRequest();
		});

		expect(mockDb.session.findFirst).toHaveBeenCalledTimes(2);
	});
});
