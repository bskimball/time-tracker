"use client";

import { useEffect, useRef, useState } from "react";

type RealtimeConnectionState = "connected" | "reconnecting" | "offline-fallback";

type RealtimeEventName =
	| "task_assignment_changed"
	| "time_log_changed"
	| "break_changed"
	| "worker_status_changed"
	| "heartbeat";

type RealtimeEvent = {
	id: number;
	event: RealtimeEventName;
	timestamp: string;
	scope: "tasks" | "monitor" | "all";
	payload?: {
		reason?: string;
		employeeId?: string;
		taskAssignmentId?: string;
		timeLogId?: string;
		affectedCount?: number;
	};
};

type ManagerRealtimeOptions = {
	scopes: readonly ("tasks" | "monitor")[];
	invalidateOn: readonly RealtimeEventName[];
	pollingIntervalSeconds?: number;
	maxReconnectAttempts?: number;
	onInvalidate: () => void;
};

type ManagerRealtimeState = {
	connectionState: RealtimeConnectionState;
	lastEventAt: Date | null;
	lastEventId: number | null;
	usingPollingFallback: boolean;
};

type ManagedEventSource = {
	close: () => void;
	onopen: ((...args: unknown[]) => unknown) | null;
	onerror: ((...args: unknown[]) => unknown) | null;
	addEventListener: (name: string, listener: (event: unknown) => void) => void;
};

const SSE_ENDPOINT_CANDIDATES = [
	"/api/realtime/manager-stream",
	"/realtime/manager-stream",
] as const;

function clampPollingSeconds(value: number | undefined) {
	if (typeof value !== "number" || Number.isNaN(value)) {
		return 60;
	}

	return Math.max(30, Math.min(300, Math.floor(value)));
}

export function useManagerRealtime(options: ManagerRealtimeOptions): ManagerRealtimeState {
	const [connectionState, setConnectionState] = useState<RealtimeConnectionState>("reconnecting");
	const [lastEventAt, setLastEventAt] = useState<Date | null>(null);
	const [lastEventId, setLastEventId] = useState<number | null>(null);
	const [usingPollingFallback, setUsingPollingFallback] = useState(false);

	const eventSourceRef = useRef<ManagedEventSource | null>(null);
	const reconnectTimerRef = useRef<number | null>(null);
	const fallbackPollTimerRef = useRef<number | null>(null);
	const fallbackSseRetryTimerRef = useRef<number | null>(null);
	const reconnectAttemptsRef = useRef(0);
	const endpointIndexRef = useRef(0);
	const fallbackRetryAttemptsRef = useRef(0);
	const invalidateQueuedRef = useRef(false);
	const onInvalidateRef = useRef(options.onInvalidate);

	const pollingIntervalSeconds = clampPollingSeconds(options.pollingIntervalSeconds);
	const maxReconnectAttempts = Math.max(2, options.maxReconnectAttempts ?? 5);

	useEffect(() => {
		onInvalidateRef.current = options.onInvalidate;
	}, [options.onInvalidate]);

	useEffect(() => {
		if (typeof window === "undefined") {
			return;
		}

		const canUseSse = typeof window.EventSource !== "undefined";
		const invalidateOn = new Set(options.invalidateOn);

		const clearTimer = (timerRef: { current: number | null }) => {
			if (timerRef.current !== null) {
				window.clearTimeout(timerRef.current);
				timerRef.current = null;
			}
		};

		const clearIntervalTimer = (timerRef: { current: number | null }) => {
			if (timerRef.current !== null) {
				window.clearInterval(timerRef.current);
				timerRef.current = null;
			}
		};

		const queueInvalidate = () => {
			if (invalidateQueuedRef.current) {
				return;
			}

			invalidateQueuedRef.current = true;
			window.setTimeout(() => {
				invalidateQueuedRef.current = false;
				onInvalidateRef.current();
			}, 500);
		};

		const closeEventSource = () => {
			if (eventSourceRef.current) {
				eventSourceRef.current.close();
				eventSourceRef.current = null;
			}
		};

		const startPollingFallback = () => {
			setUsingPollingFallback(true);
			setConnectionState("offline-fallback");

			if (fallbackPollTimerRef.current === null) {
				fallbackPollTimerRef.current = window.setInterval(() => {
					onInvalidateRef.current();
				}, pollingIntervalSeconds * 1000);
			}

			if (fallbackSseRetryTimerRef.current === null && canUseSse) {
				const attempt = Math.min(fallbackRetryAttemptsRef.current, 4);
				const retryDelayMs = Math.min(120_000, 30_000 * Math.pow(2, attempt));
				fallbackSseRetryTimerRef.current = window.setTimeout(() => {
					fallbackSseRetryTimerRef.current = null;
					fallbackRetryAttemptsRef.current += 1;
					connect();
				}, retryDelayMs);
			}
		};

		const stopPollingFallback = () => {
			setUsingPollingFallback(false);
			clearIntervalTimer(fallbackPollTimerRef);
			clearTimer(fallbackSseRetryTimerRef);
			fallbackRetryAttemptsRef.current = 0;
		};

		const handleRealtimeEvent = (event: { data: string }) => {
			try {
				const parsed = JSON.parse(event.data) as RealtimeEvent;
				setLastEventAt(new Date(parsed.timestamp));
				setLastEventId(parsed.id);

				if (invalidateOn.has(parsed.event)) {
					queueInvalidate();
				}
			} catch {
				// Ignore malformed event payloads.
			}
		};

		const connect = () => {
			if (!canUseSse) {
				startPollingFallback();
				return;
			}

			closeEventSource();
			clearTimer(reconnectTimerRef);

			setConnectionState("reconnecting");
			const scopesParam = options.scopes.join(",");
			const endpoint = SSE_ENDPOINT_CANDIDATES[endpointIndexRef.current] ?? SSE_ENDPOINT_CANDIDATES[0];
			const source = new window.EventSource(
				`${endpoint}?scopes=${encodeURIComponent(scopesParam)}`
			) as unknown as ManagedEventSource;
			eventSourceRef.current = source;

			source.onopen = () => {
				reconnectAttemptsRef.current = 0;
				endpointIndexRef.current = Math.min(
					endpointIndexRef.current,
					SSE_ENDPOINT_CANDIDATES.length - 1
				);
				stopPollingFallback();
				setConnectionState("connected");
			};

			const eventRelay = (event: unknown) => {
				if (
					typeof event !== "object" ||
					event === null ||
					!("data" in event) ||
					typeof (event as { data: unknown }).data !== "string"
				) {
					return;
				}

				handleRealtimeEvent({ data: (event as { data: string }).data });
			};

			for (const eventName of [
				"task_assignment_changed",
				"time_log_changed",
				"break_changed",
				"worker_status_changed",
				"heartbeat",
			] as const) {
				source.addEventListener(eventName, eventRelay);
			}

			source.onerror = () => {
				closeEventSource();

				if (endpointIndexRef.current < SSE_ENDPOINT_CANDIDATES.length - 1) {
					endpointIndexRef.current += 1;
					reconnectAttemptsRef.current = 0;
					reconnectTimerRef.current = window.setTimeout(() => {
						reconnectTimerRef.current = null;
						connect();
					}, 150);
					return;
				}

				reconnectAttemptsRef.current += 1;

				if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
					startPollingFallback();
					return;
				}

				setConnectionState("reconnecting");
				const backoffMs = Math.min(30_000, 1_000 * Math.pow(2, reconnectAttemptsRef.current - 1));
				reconnectTimerRef.current = window.setTimeout(() => {
					reconnectTimerRef.current = null;
					connect();
				}, backoffMs);
			};
		};

		connect();

		return () => {
			closeEventSource();
			clearTimer(reconnectTimerRef);
			clearTimer(fallbackSseRetryTimerRef);
			clearIntervalTimer(fallbackPollTimerRef);
		};
	}, [
		maxReconnectAttempts,
		options.invalidateOn,
		options.scopes,
		pollingIntervalSeconds,
	]);

	return {
		connectionState,
		lastEventAt,
		lastEventId,
		usingPollingFallback,
	};
}
