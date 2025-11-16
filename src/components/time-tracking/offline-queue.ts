"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const createId = () =>
	typeof crypto !== "undefined" && crypto.randomUUID
		? crypto.randomUUID()
		: Math.random().toString(36).slice(2);

type PendingAction = {
	id: string;
	endpoint: string;
	body: Record<string, unknown>;
	createdAt: number;
};

const STORAGE_KEY = "timeClock:offlineQueue";
const DEFAULT_ENDPOINTS = {
	clockIn: "/api/time-clock/clock-in",
	clockOut: "/api/time-clock/clock-out",
	startBreak: "/api/time-clock/start-break",
	endBreak: "/api/time-clock/end-break",
	pinToggle: "/api/time-clock/pin-toggle",
	deleteTimeLog: "/api/time-clock/delete-time-log",
} as const;

type EndpointKey = keyof typeof DEFAULT_ENDPOINTS;

export type OfflineEndpoint = EndpointKey;

export const offlineEndpointPaths = DEFAULT_ENDPOINTS;

function readQueue(): PendingAction[] {
	if (typeof window === "undefined") return [];
	try {
		const raw = window.localStorage.getItem(STORAGE_KEY);
		if (!raw) return [];
		const parsed = JSON.parse(raw) as PendingAction[];
		return Array.isArray(parsed) ? parsed : [];
	} catch (error) {
		console.warn("Failed to parse queue", error);
		return [];
	}
}

function writeQueue(queue: PendingAction[]) {
	if (typeof window === "undefined") return;
	window.localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
}

export function useOfflineActionQueue(
	apiKey?: string,
	resolveEndpoint?: (key: OfflineEndpoint) => string
) {
	const [queue, setQueue] = useState<PendingAction[]>(() => readQueue());
	const [status, setStatus] = useState<"idle" | "syncing">("idle");
	const controllerRef = useRef<AbortController | null>(null);

	useEffect(() => {
		setQueue(readQueue());
	}, []);

	const enqueue = useCallback(
		(endpointKey: OfflineEndpoint, body: Record<string, unknown>) => {
			const entry: PendingAction = {
				id: createId(),
				endpoint: resolveEndpoint?.(endpointKey) ?? DEFAULT_ENDPOINTS[endpointKey],
				body,
				createdAt: Date.now(),
			};

			setQueue((prev) => {
				const next = [...prev, entry];
				writeQueue(next);
				return next;
			});
		},
		[resolveEndpoint]
	);

	const remove = useCallback((id: string) => {
		setQueue((prev) => {
			const next = prev.filter((item) => item.id !== id);
			writeQueue(next);
			return next;
		});
	}, []);

	const sync = useCallback(async () => {
		if (status === "syncing" || queue.length === 0) return;
		if (typeof window === "undefined") return;
		if (typeof navigator !== "undefined" && !navigator.onLine) return;
		setStatus("syncing");

		const controller = new AbortController();
		controllerRef.current = controller;

		for (const action of queue) {
			try {
				const response = await fetch(action.endpoint, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"x-api-key": apiKey ?? "",
					},
					body: JSON.stringify(action.body),
					signal: controller.signal,
				});

				if (!response.ok) {
					throw new Error(`Sync failed with status ${response.status}`);
				}

				remove(action.id);
			} catch (error) {
				console.error("Failed to sync action", action, error);
				break;
			}
		}

		setStatus("idle");
		controllerRef.current = null;
	}, [apiKey, queue, remove, status]);

	useEffect(() => {
		const handleOnline = () => {
			void sync();
		};

		if (typeof window !== "undefined") {
			window.addEventListener("online", handleOnline);
			window.addEventListener("focus", handleOnline);
		}

		return () => {
			if (typeof window !== "undefined") {
				window.removeEventListener("online", handleOnline);
				window.removeEventListener("focus", handleOnline);
			}
			controllerRef.current?.abort();
		};
	}, [sync]);

	return useMemo(
		() => ({ queue, enqueue, sync, status, remove }),
		[enqueue, queue, remove, status, sync]
	);
}
