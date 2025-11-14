import type { PrismaClient } from "@prisma/client";

export interface PerformanceFilters {
	startDate: Date;
	endDate: Date;
	employeeId?: string;
	stationId?: string;
}

export async function aggregatePerformanceMetrics(db: PrismaClient, filters: PerformanceFilters) {
	return db.performanceMetric.aggregate({
		where: {
			date: {
				gte: filters.startDate,
				lte: filters.endDate,
			},
			employeeId: filters.employeeId,
			stationId: filters.stationId,
		},
		_sum: {
			hoursWorked: true,
			unitsProcessed: true,
			overtimeHours: true,
		},
		_avg: {
			efficiency: true,
			qualityScore: true,
		},
	});
}

export async function listPerformanceMetrics(db: PrismaClient, filters: PerformanceFilters) {
	return db.performanceMetric.findMany({
		where: {
			date: {
				gte: filters.startDate,
				lte: filters.endDate,
			},
			employeeId: filters.employeeId,
			stationId: filters.stationId,
		},
		orderBy: { date: "asc" },
	});
}

export interface PerformanceSummary {
	teams: Array<{
		stationId: string;
		stationName: string;
		totalHours: number;
		unitsProcessed: number;
		efficiency: number;
	}>;
	companyTotals: {
		totalHours: number;
		unitsProcessed: number;
		overtimeHours: number;
		efficiency: number;
	};
}

export async function summarizePerformance(
	db: PrismaClient,
	filters: PerformanceFilters
): Promise<PerformanceSummary> {
	const [stationGroups, totals] = await Promise.all([
		db.performanceMetric.groupBy({
			by: ["stationId"],
			where: {
				date: {
					gte: filters.startDate,
					lte: filters.endDate,
				},
				stationId: { not: null },
			},
			_sum: {
				hoursWorked: true,
				unitsProcessed: true,
			},
			_avg: {
				efficiency: true,
			},
		}),
		db.performanceMetric.aggregate({
			where: {
				date: {
					gte: filters.startDate,
					lte: filters.endDate,
				},
			},
			_sum: {
				hoursWorked: true,
				unitsProcessed: true,
				overtimeHours: true,
			},
			_avg: {
				efficiency: true,
			},
		}),
	]);

	const stations = await db.station.findMany({
		where: { isActive: true },
		select: { id: true, name: true },
	});

	return {
		teams: stationGroups.map((group) => {
			const station = stations.find((s) => s.id === group.stationId);
			return {
				stationId: group.stationId!,
				stationName: station?.name || "Unknown",
				totalHours: group._sum.hoursWorked || 0,
				unitsProcessed: group._sum.unitsProcessed || 0,
				efficiency: group._avg.efficiency || 0,
			};
		}),
		companyTotals: {
			totalHours: totals._sum.hoursWorked || 0,
			unitsProcessed: totals._sum.unitsProcessed || 0,
			overtimeHours: totals._sum.overtimeHours || 0,
			efficiency: totals._avg.efficiency || 0,
		},
	};
}

export async function buildPerformanceSnapshot(db: PrismaClient, date: Date) {
	const startDate = new Date(date);
	startDate.setHours(0, 0, 0, 0);
	const endDate = new Date(date);
	endDate.setHours(23, 59, 59, 999);

	const metrics = await listPerformanceMetrics(db, { startDate, endDate });

	return metrics.map((metric) => ({
		employeeId: metric.employeeId,
		stationId: metric.stationId,
		hoursWorked: metric.hoursWorked,
		unitsProcessed: metric.unitsProcessed,
		efficiency: metric.efficiency,
		date: metric.date,
	}));
}
