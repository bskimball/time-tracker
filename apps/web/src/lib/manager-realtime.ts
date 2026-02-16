type ManagerRealtimeScope = "tasks" | "monitor" | "all";

type ManagerRealtimeEventName =
	| "task_assignment_changed"
	| "time_log_changed"
	| "break_changed"
	| "worker_status_changed"
	| "heartbeat";

type ManagerRealtimeEventPayload = {
	reason?: string;
	employeeId?: string;
	taskAssignmentId?: string;
	timeLogId?: string;
	affectedCount?: number;
};

export type ManagerRealtimeEvent = {
	id: number;
	event: ManagerRealtimeEventName;
	scope: ManagerRealtimeScope;
	timestamp: string;
	payload?: ManagerRealtimeEventPayload;
};

type ManagerRealtimeListener = (event: ManagerRealtimeEvent) => void;

type ManagerRealtimeBus = {
	publish: (
		event: ManagerRealtimeEventName,
		scope: ManagerRealtimeScope,
		payload?: ManagerRealtimeEventPayload
	) => ManagerRealtimeEvent;
	subscribe: (listener: ManagerRealtimeListener) => () => void;
	getLatestEventId: () => number;
	retainConnection: () => void;
	releaseConnection: () => void;
};

type ManagerRealtimeGlobal = typeof globalThis & {
	__timeTrackerManagerRealtimeBus?: ManagerRealtimeBus;
};

const HEARTBEAT_INTERVAL_MS = 20_000;

function createManagerRealtimeBus(): ManagerRealtimeBus {
	const listeners = new Set<ManagerRealtimeListener>();
	let currentId = 0;
	let activeConnections = 0;
	let heartbeatInterval: ReturnType<typeof setInterval> | null = null;

	const publish = (
		event: ManagerRealtimeEventName,
		scope: ManagerRealtimeScope,
		payload?: ManagerRealtimeEventPayload
	) => {
		const emitted: ManagerRealtimeEvent = {
			id: ++currentId,
			event,
			scope,
			timestamp: new Date().toISOString(),
			payload,
		};

		for (const listener of listeners) {
			listener(emitted);
		}

		return emitted;
	};

	const startHeartbeat = () => {
		if (heartbeatInterval) {
			return;
		}

		heartbeatInterval = setInterval(() => {
			publish("heartbeat", "all");
		}, HEARTBEAT_INTERVAL_MS);
	};

	const stopHeartbeat = () => {
		if (!heartbeatInterval) {
			return;
		}

		clearInterval(heartbeatInterval);
		heartbeatInterval = null;
	};

	return {
		publish,
		subscribe(listener) {
			listeners.add(listener);
			return () => {
				listeners.delete(listener);
			};
		},
		getLatestEventId() {
			return currentId;
		},
		retainConnection() {
			activeConnections += 1;
			if (activeConnections === 1) {
				startHeartbeat();
			}
		},
		releaseConnection() {
			activeConnections = Math.max(0, activeConnections - 1);
			if (activeConnections === 0) {
				stopHeartbeat();
			}
		},
	};
}

function getBus() {
	const runtime = globalThis as ManagerRealtimeGlobal;
	runtime.__timeTrackerManagerRealtimeBus ??= createManagerRealtimeBus();
	return runtime.__timeTrackerManagerRealtimeBus;
}

export function publishManagerRealtimeEvent(
	event: ManagerRealtimeEventName,
	scope: ManagerRealtimeScope,
	payload?: ManagerRealtimeEventPayload
) {
	return getBus().publish(event, scope, payload);
}

export function subscribeToManagerRealtime(listener: ManagerRealtimeListener) {
	return getBus().subscribe(listener);
}

export function getManagerRealtimeLatestEventId() {
	return getBus().getLatestEventId();
}

export function retainManagerRealtimeConnection() {
	getBus().retainConnection();
}

export function releaseManagerRealtimeConnection() {
	getBus().releaseConnection();
}
