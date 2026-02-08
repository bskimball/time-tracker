import { OpenAPIHono } from "@hono/zod-openapi";
import { swaggerUI } from "@hono/swagger-ui";
import { pinoLogger } from "hono-pino";

import { logger } from "../../lib/logger";
import { requiredApiKey } from "./middleware";
import healthRoutes from "./health";
import timeClockRoutes from "./time-clock";
import employeeRoutes from "./employees";
import stationRoutes from "./stations";
import timeLogRoutes from "./time-logs";
import userRoutes from "./users";
import todoRoutes from "./todos";
import taskTypeRoutes from "./task-types";
import taskAssignmentRoutes from "./task-assignments";
import performanceMetricRoutes from "./performance-metrics";

const app = new OpenAPIHono();

// Add Pino logger to API routes
// @ts-expect-error - hono-pino types may not align perfectly with OpenAPIHono
app.use("*", pinoLogger({ logger }));

// OpenAPI documentation
const apiDocConfig = {
	openapi: "3.0.0",
	info: {
		title: "Time Clock API",
		version: "1.0.0",
		description: "Operational endpoints for warehouse time tracking and performance analytics",
	},
	components: {
		securitySchemes: {
			ApiKeyAuth: {
				type: "apiKey",
				in: "header",
				name: "x-api-key",
				description: "API key required for all endpoints except health",
			},
		},
	},
	security: [{ ApiKeyAuth: [] }],
} as unknown as Parameters<typeof app.doc>[1];

app.doc("/doc", apiDocConfig);

// Register route modules with proper prefixes
app.route("/", healthRoutes);

// Protect API documentation routes with API key auth
app.use("/doc", requiredApiKey());

// Apply API key authentication to all routes except health
app.use("/*", requiredApiKey());

// Swagger UI
app.get("/ui", swaggerUI({ url: "/api/doc" }));

// Register other routes
app.route("/time-clock", timeClockRoutes);
app.route("/employees", employeeRoutes);
app.route("/stations", stationRoutes);
app.route("/time-logs", timeLogRoutes);
app.route("/users", userRoutes);
app.route("/todos", todoRoutes);
app.route("/task-types", taskTypeRoutes);
app.route("/task-assignments", taskAssignmentRoutes);
app.route("/performance-metrics", performanceMetricRoutes);

export default app;
