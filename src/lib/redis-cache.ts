/**
 * Enhanced caching layer with Redis support for production performance
 * Falls back to in-memory cache if Redis is not available
 */

interface CacheEntry<T> {
	data: T;
	timestamp: number;
	ttl: number;
}

type RedisClientLike = {
	ping: () => Promise<unknown>;
	get: (key: string) => Promise<string | null>;
	del: (key: string) => Promise<unknown>;
	setex: (key: string, ttlSeconds: number, value: string) => Promise<unknown>;
	flushdb: () => Promise<unknown>;
	info: (section: string) => Promise<string>;
	dbsize: () => Promise<number>;
	quit: () => Promise<unknown>;
};

class RedisCache {
	private static instance: RedisCache;
	private memoryCache: Map<string, CacheEntry<unknown>>;
	private redisClient: RedisClientLike | null = null;
	private isRedisAvailable: boolean;

	private constructor() {
		this.memoryCache = new Map();
		this.isRedisAvailable = false;
		this.initializeRedis();

		// Clean up expired entries every 5 minutes for memory cache
		setInterval(
			() => {
				this.cleanupMemoryCache();
			},
			5 * 60 * 1000
		);
	}

	static getInstance(): RedisCache {
		if (!RedisCache.instance) {
			RedisCache.instance = new RedisCache();
		}
		return RedisCache.instance;
	}

	private async initializeRedis(): Promise<void> {
		try {
			// Dynamic import to avoid build issues if Redis is not available
			const Redis = await import("ioredis");

			if (process.env.REDIS_URL) {
				this.redisClient = new Redis.default(process.env.REDIS_URL);

				// Test connection
				await this.redisClient.ping();
				this.isRedisAvailable = true;
				console.log("Redis cache initialized successfully");
			} else {
				console.log("Redis URL not configured, using memory cache only");
			}
		} catch (error) {
			console.warn("Failed to initialize Redis, falling back to memory cache:", error);
			this.isRedisAvailable = false;
		}
	}

	/**
	 * Get cached data or compute and cache it
	 */
	async get<T>(
		key: string,
		computeFn: () => Promise<T>,
		ttlMs: number = 5 * 60 * 1000
	): Promise<T> {
		// Try Redis first if available
		if (this.isRedisAvailable && this.redisClient) {
			try {
				const cached = await this.redisClient.get(key);
				if (cached) {
					const { data, timestamp, ttl } = JSON.parse(cached);
					if (Date.now() - timestamp < ttl) {
						return data;
					} else {
						// Expires soon, refresh
						this.redisClient.del(key);
					}
				}
			} catch (error) {
				console.warn("Redis read error, falling back to memory cache:", error);
			}
		}

		// Check memory cache
		const memoryEntry = this.memoryCache.get(key);
		const now = Date.now();
		if (memoryEntry && now - memoryEntry.timestamp < memoryEntry.ttl) {
			return memoryEntry.data as T;
		}

		// Compute new data
		const data = await computeFn();
		const entry: CacheEntry<T> = {
			data,
			timestamp: now,
			ttl: ttlMs,
		};

		// Store in Redis if available
		if (this.isRedisAvailable && this.redisClient) {
			try {
				await this.redisClient.setex(key, Math.ceil(ttlMs / 1000), JSON.stringify(entry));
			} catch (error) {
				console.warn("Redis write error, using memory cache:", error);
			}
		}

		// Always store in memory cache as backup
		this.memoryCache.set(key, entry);

		return data;
	}

	/**
	 * Set data in cache with TTL
	 */
	async set<T>(key: string, data: T, ttlMs: number = 5 * 60 * 1000): Promise<void> {
		const entry: CacheEntry<T> = {
			data,
			timestamp: Date.now(),
			ttl: ttlMs,
		};

		// Store in Redis if available
		if (this.isRedisAvailable && this.redisClient) {
			try {
				await this.redisClient.setex(key, Math.ceil(ttlMs / 1000), JSON.stringify(entry));
			} catch (error) {
				console.warn("Redis write error:", error);
			}
		}

		// Always store in memory cache
		this.memoryCache.set(key, entry);
	}

	/**
	 * Get data without computing (returns null if not cached)
	 */
	async peek<T>(key: string): Promise<T | null> {
		// Try Redis first
		if (this.isRedisAvailable && this.redisClient) {
			try {
				const cached = await this.redisClient.get(key);
				if (cached) {
					const { data, timestamp, ttl } = JSON.parse(cached);
					if (Date.now() - timestamp < ttl) {
						return data;
					} else {
						this.redisClient.del(key);
					}
				}
			} catch (error) {
				console.warn("Redis read error:", error);
			}
		}

		// Check memory cache
		const entry = this.memoryCache.get(key);
		if (!entry) return null;

		if (Date.now() - entry.timestamp >= entry.ttl) {
			this.memoryCache.delete(key);
			return null;
		}

		return entry.data as T;
	}

	/**
	 * Invalidate cache entry
	 */
	async invalidate(key: string): Promise<void> {
		if (this.isRedisAvailable && this.redisClient) {
			try {
				await this.redisClient.del(key);
			} catch (error) {
				console.warn("Redis delete error:", error);
			}
		}

		this.memoryCache.delete(key);
	}

	/**
	 * Clear all cache entries
	 */
	async clear(): Promise<void> {
		if (this.isRedisAvailable && this.redisClient) {
			try {
				await this.redisClient.flushdb();
			} catch (error) {
				console.warn("Redis clear error:", error);
			}
		}

		this.memoryCache.clear();
	}

	/**
	 * Clean up expired memory cache entries
	 */
	private cleanupMemoryCache(): void {
		const now = Date.now();
		for (const [key, entry] of this.memoryCache.entries()) {
			if (now - entry.timestamp >= entry.ttl) {
				this.memoryCache.delete(key);
			}
		}
	}

	/**
	 * Get cache statistics
	 */
	async getStats(): Promise<{
		type: string;
		entries: number;
		hitRate?: number;
		memoryUsage?: number;
	}> {
		const stats = {
			type: this.isRedisAvailable ? "redis" : "memory",
			entries: this.memoryCache.size,
			memoryUsage: process.memoryUsage().heapUsed,
		};

		if (this.isRedisAvailable && this.redisClient) {
			try {
				const info = await this.redisClient.info("memory");
				const memoryMatch = info.match(/used_memory:(\d+)/);
				if (memoryMatch) {
					stats.memoryUsage = parseInt(memoryMatch[1]);
				}

				const keyCount = await this.redisClient.dbsize();
				stats.entries = keyCount;
			} catch (error) {
				console.warn("Redis stats error:", error);
			}
		}

		return stats;
	}

	/**
	 * Cache with automatic busting patterns
	 */
	async getWithTags<T>(
		key: string,
		tags: string[],
		computeFn: () => Promise<T>,
		ttlMs: number = 5 * 60 * 1000
	): Promise<T> {
		const result = await this.get(key, computeFn, ttlMs);

		// Store reverse mapping for tag-based invalidation
		for (const tag of tags) {
			const tagKey = `tag:${tag}`;
			const taggedKeys = (await this.peek<string[]>(tagKey)) || [];
			if (!taggedKeys.includes(key)) {
				taggedKeys.push(key);
				await this.set(tagKey, taggedKeys, 24 * 60 * 60 * 1000); // 24 hours
			}
		}

		return result;
	}

	/**
	 * Invalidate cache entries by tags
	 */
	async invalidateByTags(tags: string[]): Promise<void> {
		for (const tag of tags) {
			const tagKey = `tag:${tag}`;
			const taggedKeys = await this.peek<string[]>(tagKey);

			if (taggedKeys) {
				for (const key of taggedKeys) {
					await this.invalidate(key);
				}

				// Clear the tag mapping
				await this.invalidate(tagKey);
			}
		}
	}

	/**
	 * Cache warming for critical data
	 */
	async warmCache(
		warmupTasks: Array<{
			key: string;
			tags?: string[];
			computeFn: () => Promise<unknown>;
			ttlMs?: number;
		}>
	): Promise<void> {
		console.log(`Warming cache with ${warmupTasks.length} tasks...`);

		const promises = warmupTasks.map(async ({ key, tags, computeFn, ttlMs }) => {
			try {
				if (tags) {
					await this.getWithTags(key, tags, computeFn, ttlMs);
				} else {
					await this.get(key, computeFn, ttlMs);
				}
			} catch (error) {
				console.warn(`Cache warmup failed for key ${key}:`, error);
			}
		});

		await Promise.all(promises);
		console.log("Cache warming completed");
	}

	/**
	 * Close Redis connection gracefully
	 */
	async close(): Promise<void> {
		if (this.redisClient) {
			await this.redisClient.quit();
		}
	}
}

export const redisCache = RedisCache.getInstance();

/**
 * Helper functions for common cache patterns with tags
 */

export function getDashboardCacheKey(
	startDate: Date,
	endDate: Date,
	filters: Record<string, unknown> = {}
): string {
	const filterStr = Object.entries(filters)
		.sort(([a], [b]) => a.localeCompare(b))
		.map(([k, v]) => `${k}=${v}`)
		.join("&");
	return `dashboard:${startDate.toISOString().split("T")[0]}:${endDate.toISOString().split("T")[0]}:${filterStr}`;
}

export function getEmployeeMetricsCacheKey(
	employeeId: string,
	startDate: Date,
	endDate: Date
): string {
	return `employee:${employeeId}:${startDate.toISOString().split("T")[0]}:${endDate.toISOString().split("T")[0]}`;
}

export function getStationMetricsCacheKey(
	stationId: string,
	startDate: Date,
	endDate: Date
): string {
	return `station:${stationId}:${startDate.toISOString().split("T")[0]}:${endDate.toISOString().split("T")[0]}`;
}

export function getProductivityCacheKey(filters: {
	stationId?: string;
	employeeId?: string;
	dateRange: { start: Date; end: Date };
	metricType?: string;
}): string {
	const key = [
		"productivity",
		filters.stationId || "all",
		filters.employeeId || "all",
		filters.dateRange.start.toISOString().split("T")[0],
		filters.dateRange.end.toISOString().split("T")[0],
		filters.metricType || "all",
	].join(":");

	return key;
}

export function getLaborCostCacheKey(
	startDate: Date,
	endDate: Date,
	breakdownType: string = "total"
): string {
	return `labor:${breakdownType}:${startDate.toISOString().split("T")[0]}:${endDate.toISOString().split("T")[0]}`;
}

// Common tags for cache invalidation
export const CACHE_TAGS = {
	DASHBOARD: "dashboard",
	EMPLOYEE_METRICS: "employee_metrics",
	STATION_METRICS: "station_metrics",
	PRODUCTIVITY: "productivity",
	LABOR_COST: "labor_cost",
	PERFORMANCE: "performance",
	TIME_LOGS: "time_logs",
	TASK_ASSIGNMENTS: "task_assignments",
	KPI: "kpi",
} as const;
