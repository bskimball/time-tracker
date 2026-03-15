import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = "postgresql://postgres:password@localhost:5432/time_tracker";
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function test() {
    const rawMetrics = await prisma.performanceMetric.findMany({
        where: { stationId: { not: null } },
        select: { employeeId: true, stationId: true, efficiency: true }
    });
    console.log(`Found ${rawMetrics.length} metrics`);
    
    // Calculate station averages
    const stationTotals = new Map();
    for (const m of rawMetrics) {
        if (!stationTotals.has(m.stationId)) {
            stationTotals.set(m.stationId, { sum: 0, count: 0 });
        }
        const s = stationTotals.get(m.stationId);
        s.sum += m.efficiency;
        s.count += 1;
    }
    
    const stationAverages = new Map();
    for (const [stationId, {sum, count}] of stationTotals.entries()) {
        stationAverages.set(stationId, sum / count);
    }
    
    // Group by employee
    const employeeMetrics = new Map();
    for (const m of rawMetrics) {
        if (!employeeMetrics.has(m.employeeId)) {
            employeeMetrics.set(m.employeeId, { sumNormalized: 0, count: 0, primaryStation: m.stationId });
        }
        const e = employeeMetrics.get(m.employeeId);
        
        // Normalize against station average
        const stationAvg = stationAverages.get(m.stationId);
        const normalizedScore = (m.efficiency / stationAvg) * 100; // 100 = average
        
        e.sumNormalized += normalizedScore;
        e.count += 1;
    }
    
    const ranked = Array.from(employeeMetrics.entries())
        .map(([id, data]) => ({
            employeeId: id,
            normalizedScore: data.sumNormalized / data.count,
            primaryStationId: data.primaryStation
        }))
        .sort((a, b) => b.normalizedScore - a.normalizedScore)
        .slice(0, 10);
        
    console.log(ranked);
}
test().catch(console.error).finally(() => prisma.$disconnect());
