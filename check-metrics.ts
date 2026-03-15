import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import "dotenv/config";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function run() {
	const metrics = await prisma.performanceMetric.findMany({ take: 5 });
	console.log("Metrics:", metrics);

    const grouped = await prisma.performanceMetric.groupBy({
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
    console.log("Grouped:", grouped);
}

run().catch(console.error).finally(() => prisma.$disconnect());
