import fs from 'fs';
import path from 'path';

const file = 'apps/web/src/routes/executive/analytics/actions.ts';
let code = fs.readFileSync(file, 'utf8');

const regex = /export async function getEmployeeProductivityRanking[\s\S]*?return rankedIds\.map\(\(item\) => \{[\s\S]*?\}\);\n\}/;

const newFunc = `export async function getEmployeeProductivityRanking(timeRange: AnalyticsTimeRange = "week") {
	await ensureAnalyticsDataReady();
	const { startDate, endDate } = await getDateRange(timeRange);

	// Get all metrics in the time range
	const rawMetrics = await db.performanceMetric.findMany({
		where: {
			date: {
				gte: startDate,
				lte: endDate,
			},
			stationId: { not: null },
			efficiency: { not: null },
		},
		select: { employeeId: true, stationId: true, efficiency: true, unitsProcessed: true, hoursWorked: true },
	});

	if (rawMetrics.length === 0) return [];

	// Calculate baseline averages for each station
	const stationTotals = new Map<string, { sum: number; count: number }>();
	for (const m of rawMetrics) {
		if (!m.stationId || m.efficiency === null) continue;
		if (!stationTotals.has(m.stationId)) {
			stationTotals.set(m.stationId, { sum: 0, count: 0 });
		}
		const s = stationTotals.get(m.stationId)!;
		s.sum += m.efficiency;
		s.count += 1;
	}

	const stationAverages = new Map<string, number>();
	for (const [stationId, { sum, count }] of stationTotals.entries()) {
		stationAverages.set(stationId, sum / count);
	}

	// Group by employee and calculate their normalized score (100 = average for their station)
	const employeeMetrics = new Map<string, { sumNormalized: number; count: number; primaryStation: string | null; totalUnits: number; totalHours: number }>();
	for (const m of rawMetrics) {
		if (!m.stationId || m.efficiency === null) continue;
		
		if (!employeeMetrics.has(m.employeeId)) {
			employeeMetrics.set(m.employeeId, { sumNormalized: 0, count: 0, primaryStation: m.stationId, totalUnits: 0, totalHours: 0 });
		}
		const e = employeeMetrics.get(m.employeeId)!;
		
		const stationAvg = stationAverages.get(m.stationId);
		if (stationAvg && stationAvg > 0) {
			const normalizedScore = (m.efficiency / stationAvg) * 100;
			e.sumNormalized += normalizedScore;
			e.count += 1;
		}
		
		if (m.unitsProcessed != null) e.totalUnits += m.unitsProcessed;
		if (m.hoursWorked != null) e.totalHours += m.hoursWorked;
	}

	// Calculate final scores and sort
	const rankedIds = Array.from(employeeMetrics.entries())
		.map(([id, data]) => ({
			employeeId: id,
			normalizedScore: data.count > 0 ? data.sumNormalized / data.count : 0,
			primaryStationId: data.primaryStation,
			totalUnits: data.totalUnits,
			totalHours: data.totalHours,
		}))
		.filter((e) => e.normalizedScore > 0)
		.sort((a, b) => b.normalizedScore - a.normalizedScore)
		.slice(0, 10);

	if (rankedIds.length === 0) return [];

	const employeeIds = rankedIds.map((item) => item.employeeId);
	const employees = await db.employee.findMany({
		where: { id: { in: employeeIds } },
		include: {
			defaultStation: true,
		},
	});
	const employeesById = new Map(employees.map((employee) => [employee.id, employee]));

	return rankedIds.map((item) => {
		const employee = employeesById.get(item.employeeId);
		return {
			employee: employee?.name ?? "Unknown",
			// We return their normalized score representing % of their station's average
			value: Number(item.normalizedScore.toFixed(1)),
			station: employee?.defaultStation?.name ?? "UNASSIGNED",
			units: item.totalUnits,
			hours: Number(item.totalHours.toFixed(1)),
			rate: item.totalHours > 0 ? Number((item.totalUnits / item.totalHours).toFixed(1)) : 0,
		};
	});
}`;

code = code.replace(regex, newFunc);
fs.writeFileSync(file, code);
console.log("Replaced function successfully");
