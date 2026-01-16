interface CacheEntry<T> {
	data: T;
	timestamp: number;
	ttl: number; // Time to live in milliseconds
}

class PerformanceCache {
	private cache = new Map<string, CacheEntry<unknown>>();
	private static instance: PerformanceCache;

	private constructor() {
		// Clean up expired entries every 5 minutes
		setInterval(
			() => {
				this.cleanup();
			},
			5 * 60 * 1000
		);
	}

	static getInstance(): PerformanceCache {
		if (!PerformanceCache.instance) {
			PerformanceCache.instance = new PerformanceCache();
		}
		return PerformanceCache.instance;
	}

	/**
	 * Get cached data or compute and cache it
	 */
	async get<T>(
		key: string,
		computeFn: () => Promise<T>,
		ttlMs: number = 5 * 60 * 1000 // Default 5 minutes
	): Promise<T> {
		const entry = this.cache.get(key);
		const now = Date.now();

		// Return cached data if valid
		if (entry && now - entry.timestamp < entry.ttl) {
			return entry.data as T;
		}

		// Compute new data
		const data = await computeFn();

		// Cache the result
		this.cache.set(key, {
			data,
			timestamp: now,
			ttl: ttlMs,
		});

		return data;
	}

	/**
	 * Set data in cache with TTL
	 */
	set<T>(key: string, data: T, ttlMs: number = 5 * 60 * 1000): void {
		this.cache.set(key, {
			data,
			timestamp: Date.now(),
			ttl: ttlMs,
		});
	}

	/**
	 * Get data without computing (returns null if not cached)
	 */
	peek<T>(key: string): T | null {
		const entry = this.cache.get(key);
		if (!entry) return null;

		if (Date.now() - entry.timestamp >= entry.ttl) {
			this.cache.delete(key);
			return null;
		}

		return entry.data as T;
	}

	/**
	 * Invalidate cache entry
	 */
	invalidate(key: string): void {
		this.cache.delete(key);
	}

	/**
	 * Clear all cache entries
	 */
	clear(): void {
		this.cache.clear();
	}

	/**
	 * Clean up expired entries
	 */
	private cleanup(): void {
		const now = Date.now();
		for (const [key, entry] of this.cache.entries()) {
			if (now - entry.timestamp >= entry.ttl) {
				this.cache.delete(key);
			}
		}
	}

	/**
	 * Get cache statistics
	 */
	getStats(): { entries: number; hitRate?: number } {
		return {
			entries: this.cache.size,
		};
	}
}

export const performanceCache = PerformanceCache.getInstance();

/**
 * Helper functions for common cache patterns
 */

export function getExecutiveKPIsCacheKey(startDate: Date, endDate: Date): string {
	return `kpi:${startDate.toISOString().split("T")[0]}:${endDate.toISOString().split("T")[0]}`;
}

export function getLaborCostAnalysisCacheKey(startDate: Date, endDate: Date): string {
	return `cost:${startDate.toISOString().split("T")[0]}:${endDate.toISOString().split("T")[0]}`;
}

export function getProductivityAnalyticsCacheKey(
	startDate: Date,
	endDate: Date,
	filters: Record<string, unknown>
): string {
	const filterStr = Object.entries(filters)
		.sort(([a], [b]) => a.localeCompare(b))
		.map(([k, v]) => `${k}=${v}`)
		.join("&");
	return `analytics:${startDate.toISOString().split("T")[0]}:${endDate.toISOString().split("T")[0]}:${filterStr}`;
}

export function getStationPerformanceCacheKey(startDate: Date, endDate: Date): string {
	return `stations:${startDate.toISOString().split("T")[0]}:${endDate.toISOString().split("T")[0]}`;
}

export function getPerformanceTrendsCacheKey(
	startDate: Date,
	endDate: Date,
	metric: string
): string {
	return `trends:${startDate.toISOString().split("T")[0]}:${endDate.toISOString().split("T")[0]},${metric}`;
}
