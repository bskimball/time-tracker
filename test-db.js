import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

// Connect to localhost instead of postgres since we run from host
const connectionString = "postgresql://postgres:password@localhost:5432/time_tracker";
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function test() {
	const metrics = await prisma.performanceMetric.groupBy({
		by: ["employeeId"],
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
	console.log(metrics);
}
test().catch(console.error).finally(() => prisma.$disconnect());
