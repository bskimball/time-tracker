import { PrismaClient } from "@prisma/client";
import { createLogger } from "./logger";

const globalForPrisma = globalThis as unknown as {
	prismaGlobal: PrismaClient | undefined;
};

// Create a dedicated logger for database operations
const dbLogger = createLogger({ component: "prisma" });

// Determine log levels based on environment
const isDevelopment = process.env.NODE_ENV === "development";
const logQuery = process.env.LOG_DB_QUERIES === "true" || isDevelopment;

export const db =
	globalForPrisma.prismaGlobal ??
	new PrismaClient({
		log: [
			{ emit: "event", level: "query" },
			{ emit: "event", level: "error" },
			{ emit: "event", level: "warn" },
			{ emit: "event", level: "info" },
		],
		datasources: {
			db: {
				url: process.env.DATABASE_URL,
			},
		},
	});

// Log database queries (only in development or when explicitly enabled)
if (logQuery) {
	// @ts-expect-error - Prisma event types are not fully exposed
	db.$on("query", (e: any) => {
		dbLogger.debug(
			{
				query: e.query,
				params: e.params,
				duration: `${e.duration}ms`,
				target: e.target,
			},
			"Database query"
		);
	});
}

// Always log database errors
// @ts-expect-error - Prisma event types are not fully exposed
db.$on("error", (e: any) => {
	dbLogger.error(
		{
			message: e.message,
			target: e.target,
		},
		"Database error"
	);
});

// Log database warnings
// @ts-expect-error - Prisma event types are not fully exposed
db.$on("warn", (e: any) => {
	dbLogger.warn(
		{
			message: e.message,
			target: e.target,
		},
		"Database warning"
	);
});

// Log database info events
// @ts-expect-error - Prisma event types are not fully exposed
db.$on("info", (e: any) => {
	dbLogger.info(
		{
			message: e.message,
			target: e.target,
		},
		"Database info"
	);
});

if (process.env.NODE_ENV !== "production") {
	globalForPrisma.prismaGlobal = db;
	db.$connect()
		.then(() => {
			dbLogger.info("Database connected successfully");
		})
		.catch((err) => {
			dbLogger.error({ err }, "Failed to connect to database");
		});
}
