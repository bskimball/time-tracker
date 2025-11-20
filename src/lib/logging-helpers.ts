import { getLogger } from "./request-context";
import type { Logger } from "./logger";

/* eslint-env node */

/**
 * Measure and log the performance of an async operation
 * @param operation - Name of the operation being performed
 * @param fn - The async function to execute
 * @param logger - Optional logger instance (defaults to request-scoped logger)
 * @returns Result of the function execution
 *
 * @example
 * const employees = await logPerformance(
 *   "fetch-active-employees",
 *   () => db.employee.findMany({ where: { status: "ACTIVE" } })
 * );
 */
export async function logPerformance<T>(
	operation: string,
	fn: () => Promise<T>,
	logger?: Logger
): Promise<T> {
	const log = logger || getLogger();
	const start = globalThis.performance.now();

	log.debug({ operation }, "Starting operation");

	try {
		const result = await fn();
		const duration = globalThis.performance.now() - start;
		log.info({ operation, duration: `${duration.toFixed(2)}ms` }, "Operation completed");
		return result;
	} catch (error) {
		const duration = globalThis.performance.now() - start;
		log.error({ operation, duration: `${duration.toFixed(2)}ms`, err: error }, "Operation failed");
		throw error;
	}
}

/**
 * Log an error with full context and stack trace
 * @param error - The error to log
 * @param context - Additional context about where/why the error occurred
 * @param logger - Optional logger instance (defaults to request-scoped logger)
 *
 * @example
 * try {
 *   await clockIn(employeeId);
 * } catch (error) {
 *   logError(error as Error, {
 *     operation: "employee-clock-in",
 *     employeeId: "123"
 *   });
 *   throw error;
 * }
 */
export function logError(error: Error, context?: Record<string, any>, logger?: Logger): void {
	const log = logger || getLogger();

	log.error(
		{
			err: error,
			errorName: error.name,
			errorMessage: error.message,
			stack: error.stack,
			...context,
		},
		`Error: ${error.message}`
	);
}

/**
 * Create a timed logger that tracks elapsed time from creation
 * Useful for tracking multi-step operations
 *
 * @param operation - Name of the overall operation
 * @param logger - Optional logger instance (defaults to request-scoped logger)
 * @returns Object with checkpoint and finish methods
 *
 * @example
 * const timer = createTimer("complex-operation");
 * await step1();
 * timer.checkpoint("step-1-complete");
 * await step2();
 * timer.checkpoint("step-2-complete");
 * timer.finish("Operation completed successfully");
 */
export function createTimer(operation: string, logger?: Logger) {
	const log = logger || getLogger();
	const startTime = globalThis.performance.now();

	log.debug({ operation }, "Starting timed operation");

	return {
		/**
		 * Log a checkpoint with elapsed time since start
		 */
		checkpoint(message: string, metadata?: Record<string, any>) {
			const elapsed = globalThis.performance.now() - startTime;
			log.debug(
				{
					operation,
					checkpoint: message,
					elapsed: `${elapsed.toFixed(2)}ms`,
					...metadata,
				},
				`Checkpoint: ${message}`
			);
		},

		/**
		 * Log the final result with total elapsed time
		 */
		finish(message: string, metadata?: Record<string, any>) {
			const elapsed = globalThis.performance.now() - startTime;
			log.info(
				{
					operation,
					totalDuration: `${elapsed.toFixed(2)}ms`,
					...metadata,
				},
				message
			);
		},

		/**
		 * Log an error with elapsed time
		 */
		error(error: Error, metadata?: Record<string, any>) {
			const elapsed = globalThis.performance.now() - startTime;
			log.error(
				{
					operation,
					elapsed: `${elapsed.toFixed(2)}ms`,
					err: error,
					...metadata,
				},
				`Operation failed: ${error.message}`
			);
		},
	};
}

/**
 * Log a warning with context
 * @param message - Warning message
 * @param context - Additional context
 * @param logger - Optional logger instance (defaults to request-scoped logger)
 *
 * @example
 * logWarning("Employee PIN is weak", { employeeId: "123" });
 */
export function logWarning(message: string, context?: Record<string, any>, logger?: Logger): void {
	const log = logger || getLogger();
	log.warn(context || {}, message);
}

/**
 * Log debug information
 * @param message - Debug message
 * @param context - Additional context
 * @param logger - Optional logger instance (defaults to request-scoped logger)
 *
 * @example
 * logDebug("Processing time log", { timeLogId: "456", employeeId: "123" });
 */
export function logDebug(message: string, context?: Record<string, any>, logger?: Logger): void {
	const log = logger || getLogger();
	log.debug(context || {}, message);
}

/**
 * Log informational message
 * @param message - Info message
 * @param context - Additional context
 * @param logger - Optional logger instance (defaults to request-scoped logger)
 *
 * @example
 * logInfo("Employee clocked in successfully", { employeeId: "123" });
 */
export function logInfo(message: string, context?: Record<string, any>, logger?: Logger): void {
	const log = logger || getLogger();
	log.info(context || {}, message);
}
