import { beforeEach, describe, expect, it, vi } from "vitest";

// NOTE: This test targets the SSE route `~/routes/sse/manager-stream` (GET /manager-stream).
// It currently lives under `routes/api` and is named `realtime.test.ts` for historical reasons.
import realtimeApp from "~/routes/sse/manager-stream";

const {
	mockValidateRequestWithRequest,
	mockGetManagerRealtimeLatestEventId,
	mockRetainManagerRealtimeConnection,
	mockReleaseManagerRealtimeConnection,
	mockSubscribeToManagerRealtime,
	state,
} = vi.hoisted(() => {
	const state = {
		listener: null as null | ((event: Record<string, unknown>) => void),
	};

	return {
		mockValidateRequestWithRequest: vi.fn(),
		mockGetManagerRealtimeLatestEventId: vi.fn(),
		mockRetainManagerRealtimeConnection: vi.fn(),
		mockReleaseManagerRealtimeConnection: vi.fn(),
		mockSubscribeToManagerRealtime: vi.fn((listener: (event: Record<string, unknown>) => void) => {
			state.listener = listener;
			return vi.fn();
		}),
		state,
	};
});

vi.mock("~/lib/auth", () => ({
	validateRequestWithRequest: mockValidateRequestWithRequest,
}));

vi.mock("~/lib/manager-realtime", () => ({
	getManagerRealtimeLatestEventId: mockGetManagerRealtimeLatestEventId,
	retainManagerRealtimeConnection: mockRetainManagerRealtimeConnection,
	releaseManagerRealtimeConnection: mockReleaseManagerRealtimeConnection,
	subscribeToManagerRealtime: mockSubscribeToManagerRealtime,
}));

describe("GET /manager-stream", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		state.listener = null;
		mockGetManagerRealtimeLatestEventId.mockReturnValue(42);
	});

	it("returns 401 when user is unauthenticated", async () => {
		mockValidateRequestWithRequest.mockResolvedValue({ user: null });

		const response = await realtimeApp.request("http://localhost/manager-stream");
		const payload = await response.json();

		expect(response.status).toBe(401);
		expect(payload).toEqual({ success: false, error: "Unauthorized" });
		expect(mockRetainManagerRealtimeConnection).not.toHaveBeenCalled();
	});

	it("returns 403 for non-manager roles", async () => {
		mockValidateRequestWithRequest.mockResolvedValue({
			user: { id: "u-worker", role: "WORKER" },
		});

		const response = await realtimeApp.request("http://localhost/manager-stream");
		const payload = await response.json();

		expect(response.status).toBe(403);
		expect(payload).toEqual({ success: false, error: "Forbidden" });
		expect(mockRetainManagerRealtimeConnection).not.toHaveBeenCalled();
	});

	it("streams SSE with heartbeat prelude and scoped events", async () => {
		mockValidateRequestWithRequest.mockResolvedValue({
			user: { id: "u-manager", role: "MANAGER" },
		});

		const response = await realtimeApp.request("http://localhost/manager-stream?scopes=tasks");
		expect(response.status).toBe(200);
		expect(response.headers.get("content-type")).toContain("text/event-stream");

		const reader = response.body?.getReader();
		expect(reader).toBeDefined();

		const decoder = new TextDecoder();
		const firstChunk = await reader!.read();
		expect(firstChunk.done).toBe(false);
		const secondPreludeChunk = await reader!.read();
		expect(secondPreludeChunk.done).toBe(false);
		const preludeText = decoder.decode(firstChunk.value) + decoder.decode(secondPreludeChunk.value);
		expect(preludeText).toContain("retry: 2000");
		expect(preludeText).toContain("latest_event_id=42");

		state.listener?.({
			id: 100,
			event: "worker_status_changed",
			scope: "monitor",
			timestamp: "2026-02-15T12:00:00.000Z",
			payload: { reason: "ignore-monitor-scope" },
		});

		state.listener?.({
			id: 101,
			event: "task_assignment_changed",
			scope: "tasks",
			timestamp: "2026-02-15T12:00:01.000Z",
			payload: { reason: "assignment-updated", taskAssignmentId: "ta-1" },
		});

		const secondChunk = await reader!.read();
		expect(secondChunk.done).toBe(false);
		const secondText = decoder.decode(secondChunk.value);
		expect(secondText).toContain("id: 101");
		expect(secondText).toContain("event: task_assignment_changed");
		expect(secondText).toContain('"taskAssignmentId":"ta-1"');
		expect(secondText).not.toContain("id: 100");

		await reader!.cancel();
		expect(mockReleaseManagerRealtimeConnection).toHaveBeenCalledTimes(1);
	});
});
