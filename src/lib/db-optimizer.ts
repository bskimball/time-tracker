/**
 * Database query optimization layer
 * Provides efficient queries with proper indexing and connection pooling
 */

import { PrismaClient } from "@prisma/client";
import { redisCache, CACHE_TAGS, getDashboardCacheKey } from "./redis-cache";

// Global Prisma instance with optimized configuration
const globalPrisma = globalThis as unknown as {
	prisma: PrismaClient | undefined;
};

export const prisma =
	globalPrisma.prisma ??
	new PrismaClient({
		// Connection pooling optimization
		datasources: {
			db: {
				url: process.env.DATABASE_URL,
			},
		},
		// Query optimization settings
		log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
		errorFormat: "pretty",
	});

if (process.env.NODE_ENV !== "production") {
	globalPrisma.prisma = prisma;
}

/**
 * Optimized query functions for common patterns
 */

export class OptimizedQueries {
	/**
	 * Get employee with related data in a single query
	 */
	static async getEmployeeWithMetrics(employeeId: string, startDate: Date, endDate: Date) {
		const cacheKey = `employee_full:${employeeId}:${startDate.toISOString().split("T")[0]}:${endDate.toISOString().split("T")[0]}`;

		return redisCache.get(
			cacheKey,
			async () => {
				const employee = await prisma.employee.findUnique({
					where: { id: employeeId },
					include: {
						User: {
							select: {
								email: true,
								role: true,
							},
						},
						defaultStation: {
							select: {
								id: true,
								name: true,
								zone: true,
							},
						},
						TaskAssignment: {
							where: {
								startTime: {
									gte: startDate,
									lte: endDate,
								},
							},
							include: {
								TaskType: {
									select: {
										name: true,
										estimatedMinutesPerUnit: true,
									},
								},
							},
							orderBy: {
								startTime: "desc",
							},
						},
						PerformanceMetric: {
							where: {
								date: {
									gte: startDate.toISOString().split("T")[0],
									lte: endDate.toISOString().split("T")[0],
								},
							},
							orderBy: {
								date: "desc",
							},
						},
						TimeLog: {
							where: {
								startTime: {
									gte: startDate,
									lte: endDate,
								},
								deletedAt: null,
							},
							include: {
								Station: {
									select: {
										id: true,
										name: true,
									},
								},
							},
							orderBy: {
								startTime: "desc",
							},
							take: 50, // Limit for performance
						},
					},
				});

				if (!employee) return null;

				// Calculate metrics in one go
				const timeLogs = employee.TimeLog || [];
				const totalHours = timeLogs.reduce((sum, log) => {
					if (log.endTime) {
						const duration = log.endTime.getTime() - log.startTime.getTime();
						return sum + duration / (1000 * 60 * 60);
					}
					return sum;
				}, 0);

				const tasksCompleted = employee.TaskAssignment?.filter((t) => t.endTime).length || 0;

				return {
					...employee,
					calculatedMetrics: {
						totalHours,
						tasksCompleted,
						avgProductivity: tasksCompleted > 0 ? tasksCompleted / totalHours : 0,
					},
				};
			},
			15 * 60 * 1000
		); // 15 minutes cache
	}

	/**
	 * Get station analytics with optimal queries
	 */
	static async getStationAnalytics(startDate: Date, endDate: Date) {
		const cacheKey = `station_analytics:${startDate.toISOString().split("T")[0]}:${endDate.toISOString().split("T")[0]}`;

		return redisCache.get(
			cacheKey,
			async () => {
				// Get all station data in parallel
				const [stations, stationTimeLogs, taskStats] = await Promise.all([
					// Station basic info
					prisma.station.findMany({
						select: {
							id: true,
							name: true,
							description: true,
							capacity: true,
							isActive: true,
							zone: true,
						},
						orderBy: {
							name: "asc",
						},
					}),

					// Time logs aggregated by station
					prisma.timeLog.groupBy({
						by: ["stationId"],
						where: {
							startTime: {
								gte: startDate,
								lte: endDate,
							},
							deletedAt: null,
						},
						_count: {
							id: true,
						},
					}),

					// Task statistics by station
					prisma.taskAssignment.groupBy({
						by: ["taskTypeId"],
						where: {
							startTime: {
								gte: startDate,
								lte: endDate,
							},
							endTime: {
								not: null,
							},
						},
						_count: {
							id: true,
						},
						_avg: {
							unitsCompleted: true,
						},
					}),
				]);

				// Build station analytics
				const stationData = stations.map((station) => {
					const timeLogData = stationTimeLogs.find((tl) => tl.stationId === station.id);
					const taskData = taskStats; // TODO: Filter by station when TaskType relation is available

					return {
						...station,
						shiftCount: timeLogData?._count.id || 0,
						totalTasks: taskData.reduce((sum, ts) => sum + ts._count.id, 0),
						avgUnitsPerTask:
							taskData.length > 0
								? taskData.reduce((sum, ts) => sum + (ts._avg.unitsCompleted || 0), 0) /
									taskData.length
								: 0,
					};
				});

				return stationData;
			},
			10 * 60 * 1000
		); // 10 minutes cache
	}

	/**
	 * Get dashboard KPIs with optimized queries
	 */
	static async getDashboardKPIs(startDate: Date, endDate: Date) {
		const cacheKey = getDashboardCacheKey(startDate, endDate, { kpis: true });

		return redisCache.getWithTags(
			cacheKey,
			[CACHE_TAGS.DASHBOARD, CACHE_TAGS.KPI],
			async () => {
				const [
					activeEmployees,
					totalShifts,
					totalHoursWorked,
					stationStats,
					todayMetrics,
					taskStats,
				] = await Promise.all([
					// Active employees
					prisma.employee.count({
						where: {
							status: "ACTIVE",
						},
					}),

					// Total shifts in period
					prisma.timeLog.count({
						where: {
							startTime: {
								gte: startDate,
								lte: endDate,
							},
							type: "WORK",
							deletedAt: null,
						},
					}),

					// Total hours worked (approximate)
					prisma.timeLog.findMany({
						where: {
							startTime: {
								gte: startDate,
								lte: endDate,
							},
							type: "WORK",
							deletedAt: null,
							endTime: {
								not: null,
							},
						},
						select: {
							startTime: true,
							endTime: true,
						},
						take: 1000, // Limit for performance
					}),

					// Station breakdown
					prisma.timeLog.groupBy({
						by: ["stationId"],
						where: {
							startTime: {
								gte: startDate,
								lte: endDate,
							},
							type: "WORK",
							deletedAt: null,
						},
						_count: {
							id: true,
						},
					}),

					// Today's metrics
					prisma.performanceMetric.findMany({
						where: {
							date: new Date().toISOString().split("T")[0],
						},
						select: {
							hoursWorked: true,
							unitsProcessed: true,
							efficiency: true,
							qualityScore: true,
						},
					}),

					// Task completion stats
					prisma.taskAssignment.groupBy({
						by: ["taskTypeId"],
						where: {
							startTime: {
								gte: startDate,
								lte: endDate,
							},
							endTime: {
								not: null,
							},
						},
						_count: {
							id: true,
						},
						_avg: {
							unitsCompleted: true,
						},
					}),
				]);

				// Calculate hours from time logs
				const totalHours = totalHoursWorked.reduce((sum, log) => {
					if (log.endTime) {
						const duration = log.endTime.getTime() - log.startTime.getTime();
						return sum + duration / (1000 * 60 * 60);
					}
					return sum;
				}, 0);

				// Calculate today's metrics
				const todayKPIs = todayMetrics.reduce(
					(acc, metric) => ({
						totalHours: acc.totalHours + metric.hoursWorked,
						totalUnits: acc.totalUnits + (metric.unitsProcessed || 0),
						avgEfficiency: acc.efficiencySum + (metric.efficiency || 0),
						avgQuality: acc.qualitySum + (metric.qualityScore || 0),
						count: acc.count + 1,
						efficiencySum: acc.efficiencySum + (metric.efficiency || 0),
						qualitySum: acc.qualitySum + (metric.qualityScore || 0),
					}),
					{
						totalHours: 0,
						totalUnits: 0,
						avgEfficiency: 0,
						avgQuality: 0,
						count: 0,
						efficiencySum: 0,
						qualitySum: 0,
					}
				);

				const finalTodayKPIs = {
					totalHours: todayKPIs.totalHours,
					totalUnits: todayKPIs.totalUnits,
					avgEfficiency: todayKPIs.count > 0 ? todayKPIs.avgEfficiency / todayKPIs.count : 0,
					avgQuality: todayKPIs.count > 0 ? todayKPIs.avgQuality / todayKPIs.count : 0,
				};

				return {
					workforce: {
						activeEmployees,
						totalShifts,
						totalHours: Number(totalHours.toFixed(2)),
						avgHoursPerShift: totalShifts > 0 ? (totalHours / totalShifts).toFixed(2) : 0,
					},
					stations: {
						breakdown: stationStats.map((stat) => ({
							stationId: stat.stationId,
							shifts: stat._count.id,
						})),
						totalActive: stationStats.length,
					},
					productivity: {
						totalTasksCompleted: taskStats.reduce((sum, ts) => sum + ts._count.id, 0),
						avgUnitsPerTask:
							taskStats.length > 0
								? taskStats.reduce((sum, ts) => sum + (ts._avg.unitsCompleted || 0), 0) /
									taskStats.length
								: 0,
					},
					today: finalTodayKPIs,
				};
			},
			5 * 60 * 1000 // 5 minutes cache for real-time data
		);
	}

	/**
	 * Get productivity metrics with optimized queries
	 */
	static async getProductivityMetrics(filters: {
		startDate: Date;
		endDate: Date;
		stationId?: string;
		employeeId?: string;
		groupBy?: "day" | "week" | "month";
	}) {
		const cacheKey = `productivity:${JSON.stringify(filters)}`;

		return redisCache.getWithTags(
			cacheKey,
			[CACHE_TAGS.PRODUCTIVITY, CACHE_TAGS.PERFORMANCE],
			async () => {
				const { startDate, endDate, stationId, employeeId, groupBy = "day" } = filters;

				// Build where clause
				const whereClause: {
					startTime: { gte: Date; lte: Date };
					type: "WORK";
					deletedAt: null;
					stationId?: string;
					employeeId?: string;
				} = {
					startTime: { gte: startDate, lte: endDate },
					type: "WORK",
					deletedAt: null,
				};

				if (stationId) whereClause.stationId = stationId;
				if (employeeId) whereClause.employeeId = employeeId;

				const [timeLogs, taskAssignments] = await Promise.all([
					// Time log data
					prisma.timeLog.findMany({
						where: whereClause,
						select: {
							id: true,
							employeeId: true,
							stationId: true,
							startTime: true,
							endTime: true,
							Task: {
								select: {
									taskTypeId: true,
									unitsCompleted: true,
								},
							},
						},
						orderBy: { startTime: "asc" },
					}),

					// Task assignment data
					prisma.taskAssignment.findMany({
						where: {
							startTime: { gte: startDate, lte: endDate },
							...(employeeId && { employeeId }),
						},
						select: {
							id: true,
							employeeId: true,
							taskTypeId: true,
							startTime: true,
							endTime: true,
							unitsCompleted: true,
							TaskType: {
								select: {
									name: true,
									stationId: true,
									estimatedMinutesPerUnit: true,
								},
							},
						},
						orderBy: { startTime: "asc" },
					}),
				]);

				// Process data for charts
				const processedData = this.processProductivityData(timeLogs, taskAssignments, groupBy);

				return processedData;
			},
			15 * 60 * 1000 // 15 minutes cache
		);
	}

	/**
	 * Process productivity data for different groupings
	 */
	private static processProductivityData(
		timeLogs: Array<{
			id: string;
			employeeId: string;
			stationId: string | null;
			startTime: Date;
			endTime: Date | null;
			Task?: { unitsCompleted: number | null } | null;
		}>,
		_taskAssignments: unknown[],
		groupBy: "day" | "week" | "month"
	) {
		// Group data by the specified period
		const groupedData: Record<
			string,
			{
				date: string;
				totalHours: number;
				totalShifts: number;
				totalUnits: number;
				uniqueEmployees: Set<string>;
				uniqueStations: Set<string>;
			}
		> = {};

		for (const log of timeLogs) {
			if (!log.endTime) continue;

			const date = new Date(log.startTime);
			let key: string;

			switch (groupBy) {
				case "week": {
					const weekStart = new Date(date);
					weekStart.setDate(date.getDate() - date.getDay());
					key = weekStart.toISOString().split("T")[0];
					break;
				}
				case "month":
					key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
					break;
				default: // day
					key = date.toISOString().split("T")[0];
			}

			if (!groupedData[key]) {
				groupedData[key] = {
					date: key,
					totalHours: 0,
					totalShifts: 0,
					totalUnits: 0,
					uniqueEmployees: new Set(),
					uniqueStations: new Set(),
				};
			}

			const entry = groupedData[key];
			const duration = log.endTime.getTime() - log.startTime.getTime();
			entry.totalHours += duration / (1000 * 60 * 60);
			entry.totalShifts++;
			entry.uniqueEmployees.add(log.employeeId);
			if (log.stationId) entry.uniqueStations.add(log.stationId);

			if (log.Task?.unitsCompleted) {
				entry.totalUnits += log.Task.unitsCompleted;
			}
		}

		// Convert Sets to counts and sort by date
		return Object.values(groupedData)
			.map((entry) => ({
				...entry,
				uniqueEmployees: entry.uniqueEmployees.size,
				uniqueStations: entry.uniqueStations.size,
				avgProductivity: entry.totalHours > 0 ? entry.totalUnits / entry.totalHours : 0,
			}))
			.sort((a, b) => a.date.localeCompare(b.date));
	}

	/**
	 * Batch update operations for performance metrics
	 */
	static async batchUpdatePerformanceMetrics(
		metrics: Array<{
			employeeId: string;
			date: string;
			hoursWorked: number;
			unitsProcessed?: number;
			efficiency?: number;
			stationId?: string;
		}>
	) {
		// Use Prisma's batch operations for better performance
		const operations = metrics.map((metric) =>
			prisma.performanceMetric.upsert({
				where: {
					employeeId_date_stationId: {
						employeeId: metric.employeeId,
						date: metric.date,
						stationId: metric.stationId || "",
					},
				},
				update: {
					hoursWorked: metric.hoursWorked,
					unitsProcessed: metric.unitsProcessed,
					efficiency: metric.efficiency,
					updatedAt: new Date(),
				},
				create: {
					id: `perf_${metric.employeeId}_${metric.date}_${metric.stationId || "default"}`,
					employeeId: metric.employeeId,
					date: new Date(metric.date),
					stationId: metric.stationId || "",
					hoursWorked: metric.hoursWorked,
					unitsProcessed: metric.unitsProcessed,
					efficiency: metric.efficiency,
				},
			})
		);

		const results = await prisma.$transaction(operations);

		// Invalidate related caches
		await redisCache.invalidateByTags([CACHE_TAGS.EMPLOYEE_METRICS, CACHE_TAGS.PERFORMANCE]);

		return results;
	}

	/**
	 * Health check for database performance
	 */
	static async healthCheck() {
		const startTime = Date.now();

		try {
			// Test basic connectivity
			await prisma.$queryRaw`SELECT 1`;

			// Test query performance
			const employeeCount = await prisma.employee.count();

			const queryTime = Date.now() - startTime;

			return {
				status: "healthy",
				queryTime: `${queryTime}ms`,
				employeeCount,
				cacheStats: await redisCache.getStats(),
			};
		} catch (error) {
			return {
				status: "unhealthy",
				error: error instanceof Error ? error.message : "Unknown error",
				queryTime: `${Date.now() - startTime}ms`,
			};
		}
	}
}

// Export for backward compatibility
export { prisma as db };
