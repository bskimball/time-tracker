/**
 * Logging Examples
 *
 * This file demonstrates various logging patterns used throughout the application.
 * Copy these patterns into your routes, actions, and API handlers.
 */

"use server";

import { getLogger } from "../../src/lib/request-context";
import { createLogger } from "../../src/lib/logger";
import { db } from "../../src/lib/db";

async function logPerformance<T>(label: string, fn: () => Promise<T>): Promise<T> {
	const start = Date.now();
	try {
		return await fn();
	} finally {
		const logger = createLogger({ component: "examples" });
		logger.info({ label, durationMs: Date.now() - start }, "Performance");
	}
}

function logError(error: Error, context?: Record<string, unknown>) {
	const logger = createLogger({ component: "examples" });
	logger.error({ err: error, ...context }, "Error");
}

function logWarning(message: string, context?: Record<string, unknown>) {
	const logger = createLogger({ component: "examples" });
	logger.warn({ ...context }, message);
}

function logInfo(message: string, context?: Record<string, unknown>) {
	const logger = createLogger({ component: "examples" });
	logger.info({ ...context }, message);
}

function createTimer(label: string) {
	const start = Date.now();
	const logger = createLogger({ component: "examples" });
	return {
		checkpoint: (name: string, context?: Record<string, unknown>) => {
			logger.info({ label, checkpoint: name, ...context }, "Checkpoint");
		},
		finish: (message: string, context?: Record<string, unknown>) => {
			logger.info({ label, durationMs: Date.now() - start, ...context }, message);
		},
	};
}

// ============================================================================
// Example 1: Basic Logging in Server Components
// ============================================================================

export default async function DashboardRoute() {
	const logger = getLogger();

	logger.info("Loading dashboard");

	const users = await db.user.findMany();

	logger.debug({ count: users.length }, "Users retrieved");

	return <div>{/* Dashboard UI */}</div>;
}

// ============================================================================
// Example 2: Server Actions with Error Handling
// ============================================================================

export async function createEmployee(formData: FormData) {
	const logger = getLogger();
	const name = formData.get("name") as string;

	logger.info({ name }, "Creating employee");

	try {
		const employee = await db.employee.create({
			data: { name, email: formData.get("email") as string },
		});

		logger.info({ employeeId: employee.id }, "Employee created successfully");
		return { success: true, employee };
	} catch (error) {
		logError(error as Error, {
			operation: "create-employee",
			name,
		});
		return { success: false, error: "Failed to create employee" };
	}
}

// ============================================================================
// Example 3: Performance Monitoring
// ============================================================================

export async function fetchAnalytics() {
	const logger = getLogger();

	// Automatically logs duration
	const analytics = await logPerformance("fetch-analytics", async () => {
		const employees = await db.employee.findMany({
			include: {
				TimeLog: true,
				PerformanceMetric: true,
			},
		});

		return calculateMetrics(employees);
	});

	logger.info({ metricsCount: analytics.length }, "Analytics calculated");
	return analytics;
}

// ============================================================================
// Example 4: Multi-Step Operations with Checkpoints
// ============================================================================

export async function processPayroll() {
	const timer = createTimer("process-payroll");

	// Step 1
	const employees = await db.employee.findMany();
	timer.checkpoint("employees-fetched", { count: employees.length });

	// Step 2
	const timeLogs = await fetchTimeLogs(employees.map((e) => e.id));
	timer.checkpoint("time-logs-fetched", { count: timeLogs.length });

	// Step 3
	const payroll = calculatePayroll(timeLogs);
	timer.checkpoint("payroll-calculated");

	// Save results
	await savePayroll(payroll);
	timer.finish("Payroll processing complete", { totalAmount: payroll.total });

	return payroll;
}

// ============================================================================
// Example 5: API Route Logging (Hono)
// ============================================================================

import { OpenAPIHono } from "@hono/zod-openapi";

const app = new OpenAPIHono();

app.get("/employees/:id", async (c) => {
	const logger = (c.var as typeof c.var & { logger: ReturnType<typeof createLogger> }).logger; // From hono-pino middleware
	const id = c.req.param("id");

	logger.info({ employeeId: id }, "Fetching employee");

	try {
		const employee = await db.employee.findUnique({
			where: { id },
		});

		if (!employee) {
			logger.warn({ employeeId: id }, "Employee not found");
			return c.json({ error: "Not found" }, 404);
		}

		logger.debug({ employeeId: id }, "Employee retrieved");
		return c.json({ employee });
	} catch (error) {
		logger.error({ err: error, employeeId: id }, "Failed to fetch employee");
		return c.json({ error: "Internal server error" }, 500);
	}
});

// ============================================================================
// Example 6: Background Jobs (No Request Context)
// ============================================================================

const schedulerLogger = createLogger({
	component: "scheduler",
	jobType: "cleanup",
});

export async function cleanupOldLogs() {
	schedulerLogger.info("Starting log cleanup job");

	try {
		const deleted = await db.timeLog.deleteMany({
			where: {
				startTime: {
					lt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // 90 days ago
				},
			},
		});

		schedulerLogger.info({ count: deleted.count }, "Old logs deleted");
	} catch (error) {
		schedulerLogger.error({ err: error }, "Log cleanup failed");
	}
}

// ============================================================================
// Example 7: Conditional Logging with Warnings
// ============================================================================

export async function validateEmployeePIN(pin: string, employeeId: string) {
	const logger = getLogger();

	if (pin.length < 4) {
		logWarning("PIN is too short", {
			employeeId,
			pinLength: pin.length,
		});
		return { valid: false, reason: "PIN must be at least 4 digits" };
	}

	if (/^(\d)\1+$/.test(pin)) {
		logWarning("PIN contains repeating digits", { employeeId });
		// Allow but warn
	}

	logger.debug({ employeeId }, "PIN validated");
	return { valid: true };
}

// ============================================================================
// Example 8: Structured Logging with Rich Metadata
// ============================================================================

export async function clockInEmployee(employeeId: string, stationId: string) {
	const logger = getLogger();

	logInfo("Clock-in attempt", {
		employeeId,
		stationId,
		timestamp: new Date().toISOString(),
	});

	const employee = await db.employee.findUnique({
		where: { id: employeeId },
	});

	if (!employee) {
		logger.error({ employeeId }, "Employee not found for clock-in");
		throw new Error("Employee not found");
	}

	const timeLog = await logPerformance("create-time-log", () =>
		db.timeLog.create({
			data: {
				employeeId,
				stationId,
				startTime: new Date(),
				clockMethod: "PIN",
				updatedAt: new Date(),
			},
		})
	);

	logger.info(
		{
			employeeId,
			stationId,
			timeLogId: timeLog.id,
			employeeName: employee.name,
		},
		"Employee clocked in successfully"
	);

	return timeLog;
}

// ============================================================================
// Helper Functions (for examples)
// ============================================================================

function calculateMetrics(
	employees: { id: string; TimeLog: unknown[]; PerformanceMetric: unknown[] }[]
) {
	return employees.map((e) => ({ id: e.id, metrics: {} }));
}

async function fetchTimeLogs(employeeIds: string[]) {
	return db.timeLog.findMany({
		where: { employeeId: { in: employeeIds } },
	});
}

function calculatePayroll(timeLogs: { id: string; employeeId: string; startTime: Date }[]) {
	return { total: 10000, logs: timeLogs };
}

async function savePayroll(_payroll: {
	total: number;
	logs: { id: string; employeeId: string; startTime: Date }[];
}) {
	// Save logic
}
