import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = "postgresql://postgres:password@localhost:5432/time_tracker";
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function test() {
    const stationAverages = await prisma.performanceMetric.groupBy({
        by: ["stationId"],
        _avg: { efficiency: true }
    });
    console.log(stationAverages);
}
test().catch(console.error).finally(() => prisma.$disconnect());
