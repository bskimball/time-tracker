import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import "dotenv/config";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function test() {
	const metrics = await prisma.performanceMetric.findMany({ take: 10, orderBy: { efficiency: "desc" } });
	console.log(metrics);
}
test().catch(console.error).finally(() => prisma.$disconnect());
