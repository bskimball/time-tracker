import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = "postgresql://postgres:password@localhost:5432/time_tracker";
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function test() {
	const metrics = await prisma.performanceMetric.groupBy({
		by: ["employeeId", "stationId"],
		_avg: {
			efficiency: true,
		},
		orderBy: {
			_avg: {
				efficiency: "desc",
			},
		},
		take: 10,
	});
    const stations = await prisma.station.findMany({
        where: { id: { in: metrics.map(m => m.stationId) } }
    });
    console.log(stations.map(s => s.name));
}
test().catch(console.error).finally(() => prisma.$disconnect());
