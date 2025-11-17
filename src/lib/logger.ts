import pino from "pino";
import type { Logger, LoggerOptions } from "pino";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const isDevelopment = process.env.NODE_ENV === "development";
const isTest = process.env.NODE_ENV === "test";

// Resolve logs directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const logsDir = join(__dirname, "../../logs");

// Base logger configuration
const loggerOptions: LoggerOptions = {
	level: process.env.LOG_LEVEL || (isDevelopment ? "debug" : "info"),

	// Base metadata
	base: {
		env: process.env.NODE_ENV,
		app: "time-tracker",
	},

	// Redact sensitive data
	redact: {
		paths: [
			"req.headers.authorization",
			"req.headers.cookie",
			"res.headers['set-cookie']",
			"*.password",
			"*.pin",
			"*.pinHash",
			"*.token",
			"*.secret",
			"*.accessToken",
			"*.refreshToken",
			"*.clientSecret",
		],
		remove: true,
	},

	// Format timestamps
	timestamp: pino.stdTimeFunctions.isoTime,

	// Formatter for consistent structure
	formatters: {
		level: (label) => ({ level: label }),
	},
};

// Create logger with appropriate transport
let logger: Logger;

if (isTest) {
	// Silent logging in tests
	logger = pino({
		...loggerOptions,
		level: "silent",
	});
} else if (isDevelopment) {
	// Development: Pretty print to console AND write to file
	logger = pino(
		loggerOptions,
		pino.transport({
			targets: [
				// Pretty console output
				{
					target: "pino-pretty",
					options: {
						colorize: true,
						translateTime: "HH:MM:ss Z",
						ignore: "pid,hostname",
						messageFormat: "{levelLabel} - {msg}",
						errorLikeObjectKeys: ["err", "error"],
					},
					level: "debug",
				},
				// JSON logs to file for persistence
				{
					target: "pino/file",
					options: {
						destination: join(logsDir, "dev.log"),
						mkdir: true,
					},
					level: "debug",
				},
			],
		})
	);
} else {
	// Production: Log to file with rotation
	logger = pino(
		loggerOptions,
		pino.transport({
			targets: [
				// JSON logs to file with rotation
				{
					target: "pino-roll",
					options: {
						file: join(logsDir, "app.log"),
						frequency: "daily", // Rotate daily
						size: "10m", // Or when file reaches 10MB
						mkdir: true, // Create logs directory if it doesn't exist
					},
					level: "info",
				},
				// Also log errors to separate file
				{
					target: "pino-roll",
					options: {
						file: join(logsDir, "error.log"),
						frequency: "daily",
						size: "10m",
						mkdir: true,
					},
					level: "error",
				},
				// Console output for container logs (optional)
				{
					target: "pino/file",
					options: { destination: 1 }, // stdout
					level: "warn",
				},
			],
		})
	);
}

/**
 * Create a child logger with additional context
 * @param context - Additional metadata to include in all logs from this logger
 * @returns Child logger instance
 */
export function createLogger(context: Record<string, any>): Logger {
	return logger.child(context);
}

/**
 * Get the base logger instance
 * Use createLogger() for contextual logging or getLogger() from request-context for request-scoped logging
 */
export { logger };

/**
 * Logger type export for use throughout the application
 */
export type { Logger };
