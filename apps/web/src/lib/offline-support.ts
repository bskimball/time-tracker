import React from "react";

/**
 * Enhanced offline support for mobile applications
 * Provides network detection, offline queuing, and sync management
 */

interface OfflineAction {
	id: string;
	endpoint: string;
	payload: Record<string, unknown>;
	timestamp: number;
	retries: number;
	maxRetries: number;
}

interface OfflineQueue {
	actions: OfflineAction[];
	isProcessing: boolean;
	lastSync: number | null;
	failedActions: OfflineAction[];
}

export function useOnlineStatus(): { isOnline: boolean; connectionType?: ConnectionType } {
	const [isOnline, setIsOnline] = React.useState(true);
	const [connectionType, setConnectionType] = React.useState<ConnectionType>();

	React.useEffect(() => {
		if (typeof navigator === "undefined") return;

		const updateOnlineStatus = () => {
			setIsOnline(navigator.onLine);
			const connection =
				(navigator as NavigatorWithConnection).connection ||
				(navigator as NavigatorWithConnection).mozConnection ||
				(navigator as NavigatorWithConnection).webkitConnection;
			if (connection) {
				setConnectionType(connection.effectiveType);
			}
		};

		window.addEventListener("online", updateOnlineStatus);
		window.addEventListener("offline", updateOnlineStatus);

		// Listen for connection changes
		const connection =
			(navigator as NavigatorWithConnection).connection ||
			(navigator as NavigatorWithConnection).mozConnection ||
			(navigator as NavigatorWithConnection).webkitConnection;
		if (connection && connection.addEventListener) {
			connection.addEventListener("change", updateOnlineStatus);
		}

		updateOnlineStatus();

		return () => {
			window.removeEventListener("online", updateOnlineStatus);
			window.removeEventListener("offline", updateOnlineStatus);
			if (connection && connection.removeEventListener) {
				connection.removeEventListener("change", updateOnlineStatus);
			}
		};
	}, []);

	return { isOnline, connectionType };
}

export function useOfflineActionQueue(apiKey: string) {
	const [queue, setQueue] = React.useState<OfflineQueue>(() => ({
		actions: [],
		isProcessing: false,
		lastSync: null,
		failedActions: [],
	}));

	React.useEffect(() => {
		// Load queue from localStorage
		const stored = localStorage.getItem("offlineQueue");
		if (stored) {
			try {
				const parsed = JSON.parse(stored);
				setQueue((prev) => ({
					...prev,
					actions: parsed.actions || [],
					failedActions: parsed.failedActions || [],
				}));
			} catch {
				// Failed to parse offline queue; ignore and start with an empty queue
			}
		}
	}, []);

	React.useEffect(() => {
		// Save queue to localStorage whenever it changes
		localStorage.setItem(
			"offlineQueue",
			JSON.stringify({
				actions: queue.actions,
				failedActions: queue.failedActions,
			})
		);
	}, [queue]);

	const { isOnline } = useOnlineStatus();

	const enqueue = React.useCallback((endpoint: string, payload: Record<string, unknown>) => {
		const action: OfflineAction = {
			id: `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
			endpoint,
			payload,
			timestamp: Date.now(),
			retries: 0,
			maxRetries: 5,
		};

		setQueue((prev) => ({
			...prev,
			actions: [...prev.actions, action],
		}));
	}, []);

	const sync = React.useCallback(async () => {
		if (queue.isProcessing || !isOnline || queue.actions.length === 0) {
			return;
		}

		setQueue((prev) => ({ ...prev, isProcessing: true }));

		try {
			const actionsToProcess = [...queue.actions];
			const failed: OfflineAction[] = [];

			for (const action of actionsToProcess) {
				try {
					// Send action to server
					const response = await fetch(`/api/offline-sync`, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${apiKey}`,
						},
						body: JSON.stringify(action),
					});

					if (!response.ok) {
						throw new Error(`HTTP ${response.status}: ${response.statusText}`);
					}

					// Remove from queue on success
					setQueue((prev) => ({
						...prev,
						actions: prev.actions.filter((a) => a.id !== action.id),
					}));
				} catch (error) {
					console.warn("Failed to sync offline action", error);
					action.retries++;
					if (action.retries >= action.maxRetries) {
						failed.push(action);
					} else {
						// Exponential backoff
						const delay = Math.min(1000 * Math.pow(2, action.retries), 30000);
						setTimeout(() => {
							setQueue((prev) => ({
								...prev,
								actions: [...prev.actions, action],
							}));
						}, delay);
					}
				}
			}

			setQueue((prev) => ({
				...prev,
				failedActions: [...prev.failedActions, ...failed],
				isProcessing: false,
				lastSync: Date.now(),
			}));
		} catch (error) {
			console.error("Failed to sync offline actions", error);
			setQueue((prev) => ({
				...prev,
				isProcessing: false,
			}));
		}
	}, [queue.isProcessing, isOnline, queue.actions, apiKey]);

	// Auto-sync when coming online
	React.useEffect(() => {
		if (isOnline && queue.actions.length > 0) {
			sync();
		}
	}, [isOnline, queue.actions.length, sync]);

	return {
		queue: queue.actions.length,
		failed: queue.failedActions.length,
		isSyncing: queue.isProcessing,
		enqueue,
		sync,
		lastSync: queue.lastSync,
	};
}

export function useOfflineCache<T>(
	key: string,
	fetcher: () => Promise<T>,
	options: {
		staleTime?: number; // milliseconds
		cacheTime?: number; // milliseconds
		retryCount?: number;
		retryDelay?: number;
	} = {}
) {
	const {
		staleTime = 5 * 60 * 1000,
		cacheTime = 24 * 60 * 60 * 1000,
		retryCount = 3,
		retryDelay = 1000,
	} = options;
	const { isOnline } = useOnlineStatus();

	const [data, setData] = React.useState<T | null>(null);
	const [status, setStatus] = React.useState<"idle" | "loading" | "success" | "error">("idle");
	const [error, setError] = React.useState<Error | null>(null);
	const [lastFetched, setLastFetched] = React.useState<number | null>(null);

	const isStale = React.useMemo(() => {
		if (!lastFetched) return true;
		return Date.now() - lastFetched > staleTime;
	}, [lastFetched, staleTime]);

	const fetch = React.useCallback(
		async (force = false) => {
			if (!isOnline && !force && data !== null) {
				setStatus("success");
				return data;
			}

			setStatus("loading");
			setError(null);

			let attempt = 0;
			while (attempt < retryCount) {
				try {
					const result = await fetcher();
					setData(result);
					setStatus("success");
					setLastFetched(Date.now());

					// Cache to localStorage
					localStorage.setItem(
						`offlineCache:${key}`,
						JSON.stringify({
							data: result,
							timestamp: Date.now(),
						})
					);

					return result;
				} catch (err) {
					attempt++;
					if (attempt >= retryCount) {
						setError(err instanceof Error ? err : new Error("Fetch failed"));
						setStatus("error");
						break;
					}
					await new Promise((resolve) =>
						setTimeout(resolve, retryDelay * Math.pow(2, attempt - 1))
					);
				}
			}
		},
		[isOnline, data, fetcher, retryCount, retryDelay, key]
	);

	React.useEffect(() => {
		// Try to load from cache first
		const cached = localStorage.getItem(`offlineCache:${key}`);
		if (cached) {
			try {
				const { data: cachedData, timestamp } = JSON.parse(cached);
				if (Date.now() - timestamp < cacheTime) {
					setData(cachedData);
					setLastFetched(timestamp);

					// Fetch fresh data if online and cache is stale
					if (isOnline && isStale) {
						fetch();
					} else {
						setStatus("success");
					}
					return;
				}
			} catch (err) {
				console.error("Failed to parse cache:", err);
			}
		}

		// Fetch fresh data
		fetch();
	}, [key, isOnline, isStale, staleTime, cacheTime, fetch]);

	return {
		data,
		status,
		error,
		fetch,
		refetch: () => fetch(true),
		isStale,
	};
}

export function useNetworkPerformance() {
	const [metrics, setMetrics] = React.useState({
		rtt: null as number | null,
		downlink: null as number | null,
		effectiveType: null as ConnectionType | null,
		saveData: false,
	});

	React.useEffect(() => {
		if (typeof navigator === "undefined") return;

		const connection =
			(navigator as NavigatorWithConnection).connection ||
			(navigator as NavigatorWithConnection).mozConnection ||
			(navigator as NavigatorWithConnection).webkitConnection;

		const updateMetrics = () => {
			if (connection) {
				setMetrics({
					rtt: connection.rtt ?? null,
					downlink: connection.downlink ?? null,
					effectiveType: connection.effectiveType ?? null,
					saveData: connection.saveData ?? false,
				});
			}
		};

		updateMetrics();

		if (connection && connection.addEventListener) {
			connection.addEventListener("change", updateMetrics);
		}

		return () => {
			if (connection && connection.removeEventListener) {
				connection.removeEventListener("change", updateMetrics);
			}
		};
	}, []);

	const measureLatency = React.useCallback(async () => {
		const start = Date.now();
		try {
			await fetch("/api/health", { method: "HEAD" });
			return Date.now() - start;
		} catch {
			return null;
		}
	}, []);

	return {
		...metrics,
		measureLatency,
		isSlowConnection: metrics.effectiveType === "slow-2g" || metrics.effectiveType === "2g",
		isFastConnection: metrics.effectiveType === "4g",
	};
}

export function useBackgroundSync(
	syncFunction: () => Promise<void>,
	options: {
		interval?: number; // milliseconds
		onlyWhenOnline?: boolean;
		immediate?: boolean;
	} = {}
) {
	const { interval = 5 * 60 * 1000, onlyWhenOnline = true, immediate = false } = options;
	const { isOnline } = useOnlineStatus();
	const [lastSync, setLastSync] = React.useState<Date | null>(null);
	const [isSyncing, setIsSyncing] = React.useState(false);

	const sync = React.useCallback(async () => {
		if (onlyWhenOnline && !isOnline) return;

		setIsSyncing(true);

		try {
			await syncFunction();
			setLastSync(new Date());
		} catch (error) {
			console.error("Background sync failed", error);
		} finally {
			setIsSyncing(false);
		}
	}, [syncFunction, onlyWhenOnline, isOnline]);

	React.useEffect(() => {
		if (immediate) {
			sync();
		}
	}, [immediate, sync]);

	React.useEffect(() => {
		if (onlyWhenOnline && !isOnline && !immediate) return;

		const intervalId = setInterval(sync, interval);
		return () => clearInterval(intervalId);
	}, [interval, sync, onlyWhenOnline, isOnline, immediate]);

	return {
		sync,
		isSyncing,
		lastSync,
	};
}

// Progressive loading helper
export function useProgressiveLoad<T>(
	loader: (chunk: number) => Promise<T[]>,
	totalChunks: number,
	chunkSize: number = 10
) {
	const [items, setItems] = React.useState<T[]>([]);
	const [loading, setLoading] = React.useState(false);
	const [loadedChunks, setLoadedChunks] = React.useState(0);
	const [hasMore, setHasMore] = React.useState(true);
	const [error, setError] = React.useState<Error | null>(null);

	const loadMore = React.useCallback(async () => {
		if (loading || !hasMore) return;

		setLoading(true);
		setError(null);

		try {
			const newItems = await loader(loadedChunks);

			if (newItems.length < chunkSize) {
				setHasMore(false);
			}

			setItems((prev) => [...prev, ...newItems]);
			setLoadedChunks((prev) => prev + 1);
		} catch (err) {
			setError(err instanceof Error ? err : new Error("Load failed"));
		} finally {
			setLoading(false);
		}
	}, [loader, loadedChunks, chunkSize, loading, hasMore]);

	const reset = React.useCallback(() => {
		setItems([]);
		setLoadedChunks(0);
		setHasMore(true);
		setError(null);
		setLoading(false);
	}, []);

	return {
		items,
		loading,
		hasMore,
		error,
		loadMore,
		reset,
		progress: (loadedChunks / totalChunks) * 100,
	};
}

type ConnectionType = "slow-2g" | "2g" | "3g" | "4g";

interface NetworkInformation {
	rtt?: number;
	downlink?: number;
	effectiveType?: ConnectionType;
	saveData?: boolean;
	addEventListener?: (type: "change", listener: () => void) => void;
	removeEventListener?: (type: "change", listener: () => void) => void;
}

interface NavigatorWithConnection {
	connection?: NetworkInformation;
	mozConnection?: NetworkInformation;
	webkitConnection?: NetworkInformation;
}
