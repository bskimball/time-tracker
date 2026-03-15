import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import "dotenv/config";

const pool = new Pool({ connectionString: "postgresql://postgres:password@localhost:5432/time_tracker" });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function run() {
	const rawMetrics = await prisma.performanceMetric.findMany({
		where: { stationId: { not: null }, efficiency: { not: null } },
		select: { employeeId: true, stationId: true, efficiency: true, unitsProcessed: true, hoursWorked: true },
	});

	const stationTotals = new Map();
	for (const m of rawMetrics) {
		if (!stationTotals.has(m.stationId)) stationTotals.set(m.stationId, { sum: 0, count: 0 });
		const s = stationTotals.get(m.stationId);
		s.sum += m.efficiency;
		s.count += 1;
	}

	const stationAverages = new Map();
	for (const [stationId, { sum, count }] of stationTotals.entries()) {
		stationAverages.set(stationId, sum / count);
	}

	const employeeMetrics = new Map();
	for (const m of rawMetrics) {
		if (!employeeMetrics.has(m.employeeId)) {
			employeeMetrics.set(m.employeeId, { sumNormalized: 0, count: 0, primaryStation: m.stationId, totalUnits: 0, totalHours: 0 });
		}
		const e = employeeMetrics.get(m.employeeId);
		
		const stationAvg = stationAverages.get(m.stationId);
		if (stationAvg && stationAvg > 0) {
			const normalizedScore = (m.efficiency / stationAvg) * 100;
			e.sumNormalized += normalizedScore;
			e.count += 1;
		}
		if (m.unitsProcessed != null) e.totalUnits += m.unitsProcessed;
		if (m.hoursWorked != null) e.totalHours += m.hoursWorked;
	}

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
    
    console.log(rankedIds);
}

run().catch(console.error).finally(() => prisma.$disconnect());
