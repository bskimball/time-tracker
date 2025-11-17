# Logging Guide

This guide covers the comprehensive logging solution implemented in the Time Tracker application using Pino, a high-performance Node.js logger.

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Configuration](#configuration)
4. [Usage Patterns](#usage-patterns)
5. [Log Levels](#log-levels)
6. [Log Rotation](#log-rotation)
7. [Best Practices](#best-practices)
8. [Troubleshooting](#troubleshooting)

## Overview

The application uses **Pino** for structured JSON logging with the following features:

- **Unified Logging**: Same logger works across Hono server, API routes, and React Server Components
- **Request Correlation**: Automatic request ID tracking across all logs
- **Structured Data**: JSON format for easy parsing and analysis
- **High Performance**: Minimal overhead, up to 10x faster than Winston
- **Development Experience**: Pretty printing in dev, JSON in production
- **Security**: Automatic redaction of sensitive fields (passwords, tokens, cookies)
- **Log Rotation**: Daily rotation with size limits in production

### Technology Stack

- **pino** - Core logging library
- **pino-pretty** - Pretty printing for development
- **hono-pino** - Hono middleware integration
- **pino-roll** - File rotation for production

## Architecture

### Component Structure

```
src/lib/
├── logger.ts              # Core logger configuration
├── request-context.ts     # Request-scoped logger with AsyncLocalStorage
└── logging-helpers.ts     # Convenience functions for common patterns
```

### Flow Diagram

```
HTTP Request
    ↓
Hono Server (server.js)
    ├─ pinoLogger middleware → Logs request/response
    ↓
API Routes or RSC Handler
    ├─ Request context established (runWithRequest)
    ├─ Request-scoped logger created (with requestId)
    ↓
Server Components / API Handlers
    ├─ getLogger() → Returns request-scoped logger
    ├─ logPerformance() → Measure operation timing
    ├─ logError() → Log errors with context
    ↓
Database (Prisma)
    └─ Automatic query logging (debug level)
```

## Configuration

### Environment Variables

Add to `.env`:

```bash
# Logging Configuration
LOG_LEVEL=debug              # Logging level: debug, info, warn, error
LOG_DB_QUERIES=true          # Enable database query logging
```

### Log Levels

| Level   | When to Use                                                |
| ------- | ---------------------------------------------------------- |
| `debug` | Development, detailed troubleshooting, database queries    |
| `info`  | General application flow, successful operations            |
| `warn`  | Recoverable issues, deprecations, performance concerns     |
| `error` | Errors, exceptions, failures requiring attention           |
| `fatal` | Critical errors causing application shutdown (rarely used) |

### Default Behavior

| Environment | Console Output | File Output               | Query Logging |
| ----------- | -------------- | ------------------------- | ------------- |
| Development | Pretty print   | `logs/dev.log` (JSON)     | Enabled       |
| Production  | Warnings only  | `logs/app.log` + rotation | Disabled      |
| Test        | Silent         | None                      | Disabled      |

## Usage Patterns

### 1. Request-Scoped Logging (Recommended)

Use `getLogger()` from request context for automatic request correlation:

```typescript
// src/routes/manager/dashboard/route.tsx
import { getLogger } from "../../../lib/request-context";
import { db } from "../../../lib/db";

export default async function ManagerDashboard() {
  const logger = getLogger();

  logger.info("Loading manager dashboard");

  const employees = await db.employee.findMany({
    where: { status: "ACTIVE" },
  });

  logger.debug({ count: employees.length }, "Retrieved active employees");

  return <div>{/* Dashboard UI */}</div>;
}
```

**Automatic metadata included:**

- `requestId` - Unique request identifier
- `method` - HTTP method (GET, POST, etc.)
- `path` - Request path
- `userAgent` - Client user agent

### 2. Server Actions

```typescript
// src/routes/employees/actions.ts
"use server";

import { getLogger } from "../../lib/request-context";
import { db } from "../../lib/db";
import { logError, logPerformance } from "../../lib/logging-helpers";

export async function clockIn(formData: FormData) {
	const logger = getLogger();
	const employeeId = formData.get("employeeId") as string;

	logger.info({ employeeId }, "Clock-in attempt");

	try {
		// Use logPerformance helper to measure operation
		const timeLog = await logPerformance("create-time-log", () =>
			db.timeLog.create({
				data: {
					employeeId,
					clockIn: new Date(),
					clockMethod: "PIN",
				},
			})
		);

		logger.info({ employeeId, timeLogId: timeLog.id }, "Clock-in successful");
		return { success: true, timeLogId: timeLog.id };
	} catch (error) {
		logError(error as Error, {
			operation: "clock-in",
			employeeId,
		});
		return { success: false, error: "Failed to clock in" };
	}
}
```

### 3. API Routes (Hono)

The logger is automatically available via `c.var.logger`:

```typescript
// src/routes/api/employees.ts
import { OpenAPIHono } from "@hono/zod-openapi";
import { db } from "../../lib/db";

const app = new OpenAPIHono();

app.get("/", async (c) => {
	const logger = c.var.logger; // Provided by hono-pino middleware

	logger.info("Fetching employees via API");

	try {
		const employees = await db.employee.findMany();

		logger.debug({ count: employees.length }, "Retrieved employees");

		return c.json({ employees });
	} catch (error) {
		logger.error({ err: error }, "Failed to fetch employees");
		return c.json({ error: "Internal server error" }, 500);
	}
});

export default app;
```

### 4. Performance Monitoring

Use `logPerformance` for timing critical operations:

```typescript
import { logPerformance } from "../../lib/logging-helpers";
import { db } from "../../lib/db";

// Automatically logs duration on success or failure
const analytics = await logPerformance("calculate-analytics", async () => {
	const data = await db.employee.findMany({
		include: { timeLogs: true, performanceMetrics: true },
	});
	return calculateMetrics(data);
});
```

**Output:**

```json
{
	"level": "info",
	"operation": "calculate-analytics",
	"duration": "234.56ms",
	"msg": "Operation completed"
}
```

### 5. Multi-Step Operations with Timers

Use `createTimer` for complex operations with checkpoints:

```typescript
import { createTimer } from "../../lib/logging-helpers";

async function processPayroll() {
	const timer = createTimer("process-payroll");

	// Step 1
	const employees = await fetchEmployees();
	timer.checkpoint("employees-fetched", { count: employees.length });

	// Step 2
	const timeLogs = await fetchTimeLogs(employees);
	timer.checkpoint("time-logs-fetched", { count: timeLogs.length });

	// Step 3
	const payroll = calculatePayroll(timeLogs);
	timer.checkpoint("payroll-calculated");

	// Final
	timer.finish("Payroll processing complete", { totalAmount: payroll.total });
}
```

**Output:**

```json
{"level":"debug","operation":"process-payroll","checkpoint":"employees-fetched","elapsed":"45.23ms","count":150}
{"level":"debug","operation":"process-payroll","checkpoint":"time-logs-fetched","elapsed":"234.56ms","count":450}
{"level":"debug","operation":"process-payroll","checkpoint":"payroll-calculated","elapsed":"345.67ms"}
{"level":"info","operation":"process-payroll","totalDuration":"625.46ms","totalAmount":45000,"msg":"Payroll processing complete"}
```

### 6. Error Logging

Use `logError` for consistent error logging:

```typescript
import { logError } from "../../lib/logging-helpers";

try {
	await dangerousOperation();
} catch (error) {
	logError(error as Error, {
		operation: "dangerous-operation",
		userId: "123",
		additionalContext: "Something specific to this failure",
	});
	throw error;
}
```

### 7. Contextual Logging (Outside Request Context)

For background jobs or scheduled tasks without request context:

```typescript
// src/lib/performance-scheduler.ts
import { createLogger } from "./logger";

const schedulerLogger = createLogger({ component: "performance-scheduler" });

export async function calculatePerformanceMetrics() {
	schedulerLogger.info("Starting scheduled performance calculation");

	try {
		const employees = await db.employee.findMany();
		schedulerLogger.debug({ count: employees.length }, "Processing employees");

		// ... calculations

		schedulerLogger.info("Performance metrics calculated successfully");
	} catch (error) {
		schedulerLogger.error({ err: error }, "Failed to calculate metrics");
	}
}
```

### 8. Database Query Logging

Database queries are automatically logged in development (configured in `src/lib/db.ts`):

```typescript
// Queries are automatically logged at debug level
const employees = await db.employee.findMany();
```

**Output:**

```json
{
	"level": "debug",
	"component": "prisma",
	"query": "SELECT * FROM Employee WHERE status = ?",
	"params": "[\"ACTIVE\"]",
	"duration": "5.23ms",
	"target": "employee.findMany",
	"msg": "Database query"
}
```

**Control query logging:**

```bash
# In .env
LOG_DB_QUERIES=true   # Enable in production (usually false)
```

## Log Rotation

### Development Configuration

In development, logs are written to a single file with no rotation:

**Log Files:**

```
logs/
└── dev.log              # All development logs (JSON format, not rotated)
```

**Note:** In development, logs accumulate in `dev.log`. You may want to manually delete this file periodically:

```bash
# Clear development logs
rm logs/dev.log
```

### Production Configuration

Logs are automatically rotated in production:

**Daily Rotation:**

- Logs rotate every 24 hours at midnight
- Old logs renamed with date suffix: `app.log.2025-01-15`

**Size-Based Rotation:**

- Files also rotate when reaching 10MB
- Prevents disk space issues from verbose logging

**Log Files:**

```
logs/
├── app.log              # All logs (info and above)
├── app.log.2025-01-15   # Previous day
├── app.log.2025-01-14   # Two days ago
├── error.log            # Error-only logs
└── error.log.2025-01-15 # Previous errors
```

### Manual Log Management

**Development:**

```bash
# View development logs
tail -f logs/dev.log

# Clear development logs
rm logs/dev.log
```

**Production:**

```bash
# View recent logs
tail -f logs/app.log

# View errors only
tail -f logs/error.log
```

**Search logs:**

```bash
# Find all logs for a specific request
cat logs/app.log | grep "requestId\":\"abc-123"

# Find all errors
cat logs/app.log | grep "\"level\":\"error\""

# Find slow operations (>1000ms)
cat logs/app.log | grep "duration" | grep -E "[0-9]{4,}\.[0-9]+ms"
```

**Clean old logs:**

```bash
# Delete logs older than 30 days
find logs/ -name "*.log.*" -mtime +30 -delete
```

### Log Retention Strategy

Recommended retention:

- **Development**: No file logging (console only)
- **Production**:
  - Keep last 30 days of app logs
  - Keep last 90 days of error logs
  - Archive critical logs to S3/cloud storage

## Best Practices

### DO: Use Structured Logging

✅ **Good:**

```typescript
logger.info({ employeeId, clockIn: new Date() }, "Employee clocked in");
```

❌ **Bad:**

```typescript
logger.info(`Employee ${employeeId} clocked in at ${new Date()}`);
```

**Why:** Structured data is easily queryable and parseable by log aggregators.

### DO: Include Context in Metadata

✅ **Good:**

```typescript
logger.error(
	{
		err: error,
		employeeId,
		operation: "clock-in",
		attemptCount: 3,
	},
	"Clock-in failed"
);
```

❌ **Bad:**

```typescript
logger.error("Clock-in failed");
```

### DO: Use Appropriate Log Levels

```typescript
// Debug: Detailed info for troubleshooting
logger.debug({ query, params }, "Executing database query");

// Info: Normal application flow
logger.info({ userId }, "User logged in");

// Warn: Potential issues, recoverable
logger.warn({ pinStrength: "weak", employeeId }, "Weak PIN detected");

// Error: Actual errors
logger.error({ err: error }, "Failed to process payment");
```

### DO: Redact Sensitive Data

Sensitive fields are **automatically redacted**:

- Passwords, PINs, tokens
- Authorization headers
- Cookies
- OAuth secrets

**Configured in `src/lib/logger.ts`:**

```typescript
redact: {
  paths: [
    "req.headers.authorization",
    "req.headers.cookie",
    "*.password",
    "*.pin",
    "*.token",
    "*.secret",
  ],
  remove: true,
}
```

### DON'T: Log in Tight Loops

❌ **Bad:**

```typescript
employees.forEach((emp) => {
	logger.debug({ emp }, "Processing employee"); // Spams logs
	processEmployee(emp);
});
```

✅ **Good:**

```typescript
logger.info({ count: employees.length }, "Processing employees batch");
const results = employees.map(processEmployee);
logger.info({ processed: results.length }, "Employees processed");
```

### DON'T: Log Large Objects

❌ **Bad:**

```typescript
logger.info({ allEmployees }, "Loaded employees"); // Logs entire array
```

✅ **Good:**

```typescript
logger.info({ count: allEmployees.length }, "Loaded employees");
```

### DON'T: Use Console Methods

❌ **Bad:**

```typescript
console.log("User logged in");
console.error(error);
```

✅ **Good:**

```typescript
logger.info({ userId }, "User logged in");
logger.error({ err: error }, "Operation failed");
```

## Advanced Usage

### Custom Logger Instances

Create specialized loggers for different components:

```typescript
import { createLogger } from "../../lib/logger";

// Background job logger
const jobLogger = createLogger({
	component: "scheduled-jobs",
	jobType: "cleanup",
});

// Integration logger
const integrationLogger = createLogger({
	component: "external-api",
	service: "stripe",
});
```

### Correlation IDs Across Services

Request IDs propagate automatically, but you can also set custom correlation IDs:

```typescript
import { getLogger, getRequestId } from "../../lib/request-context";

async function callExternalAPI() {
	const logger = getLogger();
	const requestId = getRequestId();

	const response = await fetch("https://api.example.com", {
		headers: {
			"X-Request-ID": requestId, // Propagate to external service
		},
	});

	logger.info(
		{
			requestId,
			externalStatus: response.status,
		},
		"External API called"
	);
}
```

### Sampling for High-Traffic Routes

For extremely high-traffic endpoints, consider sampling:

```typescript
const shouldLog = Math.random() < 0.1; // Log 10% of requests

if (shouldLog) {
	logger.debug({ productId }, "Product viewed");
}
```

## Troubleshooting

### No Logs Appearing

**Check log level:**

```bash
# In .env
LOG_LEVEL=debug  # Make sure it's not set to error or silent
```

**Check logger import:**

```typescript
// Use getLogger() in request context
import { getLogger } from "../../lib/request-context";

// Or createLogger() outside request context
import { createLogger } from "../../lib/logger";
```

### Logs Not Rotating

**Check production environment:**

```bash
NODE_ENV=production npm start
```

Log rotation only works in production mode. Development uses console output.

**Verify logs directory exists:**

```bash
ls -la logs/
```

The directory should be auto-created, but you can create it manually if needed:

```bash
mkdir -p logs
```

### Performance Issues

**Disable query logging in production:**

```bash
# In .env
LOG_DB_QUERIES=false
```

**Reduce log level:**

```bash
LOG_LEVEL=warn  # Only log warnings and errors
```

**Use async logging** (already enabled by default in Pino)

### Sensitive Data in Logs

If sensitive data appears in logs:

1. Add field to redaction list in `src/lib/logger.ts`:

```typescript
redact: {
  paths: [
    // Add your sensitive field here
    "*.socialSecurityNumber",
    "*.creditCard",
  ],
  remove: true,
}
```

2. Restart the application

### Disk Space Issues

**Monitor log size:**

```bash
du -sh logs/
```

**Implement log cleanup:**

```bash
# Add to cron or systemd timer
find logs/ -name "*.log.*" -mtime +30 -delete
```

## Integration with Log Aggregators

### Datadog

Datadog automatically parses JSON logs:

```bash
# Install Datadog agent, then configure log collection
# /etc/datadog-agent/conf.d/nodejs.d/conf.yaml
logs:
  - type: file
    path: /path/to/app/logs/app.log
    service: time-tracker
    source: nodejs
```

### Elasticsearch + Kibana

Use Filebeat to ship logs:

```yaml
# filebeat.yml
filebeat.inputs:
  - type: log
    enabled: true
    paths:
      - /path/to/app/logs/app.log
    json.keys_under_root: true
    json.add_error_key: true
```

### CloudWatch

Use CloudWatch agent:

```json
{
	"logs": {
		"logs_collected": {
			"files": {
				"collect_list": [
					{
						"file_path": "/path/to/app/logs/app.log",
						"log_group_name": "/aws/ec2/time-tracker",
						"log_stream_name": "{instance_id}"
					}
				]
			}
		}
	}
}
```

## Summary

### Quick Reference

| Use Case                | Function/Pattern                |
| ----------------------- | ------------------------------- |
| Request-scoped logging  | `getLogger()`                   |
| Performance measurement | `logPerformance(operation, fn)` |
| Error logging           | `logError(error, context)`      |
| Multi-step timing       | `createTimer(operation)`        |
| Background jobs         | `createLogger({ component })`   |
| API routes              | `c.var.logger` (Hono context)   |
| Database queries        | Automatic (configured in db.ts) |

### Key Files

- `src/lib/logger.ts` - Core logger configuration
- `src/lib/request-context.ts` - Request-scoped logger
- `src/lib/logging-helpers.ts` - Convenience utilities
- `src/lib/db.ts` - Database query logging
- `server.js` - Hono middleware setup
- `.env` - Environment configuration

### Environment Variables

```bash
LOG_LEVEL=debug        # debug, info, warn, error
LOG_DB_QUERIES=true    # Enable database query logging
```

### Log Locations

- **Development**: Console (pretty print)
- **Production**: `logs/app.log` (JSON, rotated daily/10MB)
- **Errors**: `logs/error.log` (Errors only)

---

For more information about the application architecture, see [ARCHITECTURE.md](./ARCHITECTURE.md).
