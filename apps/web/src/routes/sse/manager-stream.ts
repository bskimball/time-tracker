import { OpenAPIHono } from "@hono/zod-openapi";
import type { User_role } from "@prisma/client";

import { validateRequestWithRequest } from "~/lib/auth";
import {
	getManagerRealtimeLatestEventId,
	releaseManagerRealtimeConnection,
	retainManagerRealtimeConnection,
	subscribeToManagerRealtime,
	type ManagerRealtimeEvent,
} from "~/lib/manager-realtime";

const app = new OpenAPIHono();

const MANAGER_ROLES: User_role[] = ["MANAGER", "ADMIN"];

const SCOPES = new Set(["tasks", "monitor", "all"]);

function parseScopes(raw: string | undefined): Set<string> {
	if (!raw) {
		return new Set(["all"]);
	}

	const parsed = new Set(
		raw
			.split(",")
			.map((scope) => scope.trim().toLowerCase())
			.filter((scope) => SCOPES.has(scope))
	);

	if (parsed.size === 0) {
		parsed.add("all");
	}

	return parsed;
}

function isInScope(event: ManagerRealtimeEvent, scopes: Set<string>) {
	if (scopes.has("all")) {
		return true;
	}

	if (event.scope === "all") {
		return true;
	}

	return scopes.has(event.scope);
}

function formatSseEvent(event: ManagerRealtimeEvent) {
	const payload = JSON.stringify(event);
	return `id: ${event.id}\nevent: ${event.event}\ndata: ${payload}\n\n`;
}

app.get("/manager-stream", async (c) => {
	const { user } = await validateRequestWithRequest(c.req.raw);

	if (!user) {
		return c.json({ success: false as const, error: "Unauthorized" }, 401);
	}

	if (!MANAGER_ROLES.includes(user.role)) {
		return c.json({ success: false as const, error: "Forbidden" }, 403);
	}

	const encoder = new TextEncoder();
	const scopes = parseScopes(c.req.query("scopes"));
	retainManagerRealtimeConnection();

	let unsubscribe: (() => void) | null = null;
	let closed = false;

	const cleanup = () => {
		if (closed) {
			return;
		}

		closed = true;
		if (unsubscribe) {
			unsubscribe();
			unsubscribe = null;
		}
		releaseManagerRealtimeConnection();
	};

	const stream = new ReadableStream<Uint8Array>({
		start(controller) {
			controller.enqueue(encoder.encode("retry: 2000\n\n"));
			controller.enqueue(
				encoder.encode(`: connected latest_event_id=${getManagerRealtimeLatestEventId()}\n\n`)
			);

			unsubscribe = subscribeToManagerRealtime((event) => {
				if (!isInScope(event, scopes)) {
					return;
				}

				controller.enqueue(encoder.encode(formatSseEvent(event)));
			});
		},
		cancel() {
			cleanup();
		},
	});

	return new Response(stream, {
		headers: {
			"Content-Type": "text/event-stream",
			"Cache-Control": "no-cache, no-transform",
			Connection: "keep-alive",
			"X-Accel-Buffering": "no",
		},
	});
});

export default app;
