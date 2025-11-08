import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import {
	clockInEmployee,
	clockOutLog,
	endBreakForEmployee,
	pinToggleClockAction,
	startBreakForEmployee,
	deleteTimeLogEntry,
} from "../../services/time-clock";
import {
	actionError,
	okResponse,
	employeeIdSchema,
	stationIdSchema,
	logIdSchema,
	errorResponseSchema,
	successWithMessageSchema,
} from "./types";

const app = new OpenAPIHono();

// Clock in endpoint
app.openapi(
	createRoute({
		method: "post",
		path: "/clock-in",
		request: {
			body: {
				content: {
					"application/json": {
						schema: z.object({
							employeeId: employeeIdSchema,
							stationId: stationIdSchema,
						}),
					},
				},
			},
		},
		responses: {
			200: {
				content: {
					"application/json": {
						schema: successWithMessageSchema,
					},
				},
				description: "Successfully clocked in",
			},
			400: {
				content: {
					"application/json": {
						schema: errorResponseSchema,
					},
				},
				description: "Failed to clock in",
			},
		},
	}),
	async (c) => {
		const body = await c.req.json();
		const parsed = z
			.object({ employeeId: employeeIdSchema, stationId: stationIdSchema })
			.safeParse(body);
		if (!parsed.success) {
			return c.json(
				{
					success: false as const,
					error: parsed.error.issues.map((issue) => issue.message).join(", "),
				},
				400
			);
		}
		try {
			const result = await clockInEmployee(parsed.data.employeeId, parsed.data.stationId);
			return c.json(okResponse(result.message), 200);
		} catch (error) {
			return c.json(actionError(error), 400);
		}
	}
);

// Clock out endpoint
app.openapi(
	createRoute({
		method: "post",
		path: "/clock-out",
		request: {
			body: {
				content: {
					"application/json": {
						schema: z.object({
							logId: logIdSchema,
						}),
					},
				},
			},
		},
		responses: {
			200: {
				content: {
					"application/json": {
						schema: successWithMessageSchema,
					},
				},
				description: "Successfully clocked out",
			},
			400: {
				content: {
					"application/json": {
						schema: errorResponseSchema,
					},
				},
				description: "Failed to clock out",
			},
		},
	}),
	async (c) => {
		const body = await c.req.json();
		const parsed = z.object({ logId: logIdSchema }).safeParse(body);
		if (!parsed.success) {
			return c.json(
				{
					success: false as const,
					error: parsed.error.issues.map((issue) => issue.message).join(", "),
				},
				400
			);
		}
		try {
			const result = await clockOutLog(parsed.data.logId);
			return c.json(okResponse(result.message), 200);
		} catch (error) {
			return c.json(actionError(error), 400);
		}
	}
);

// Start break endpoint
app.openapi(
	createRoute({
		method: "post",
		path: "/start-break",
		request: {
			body: {
				content: {
					"application/json": {
						schema: z.object({
							employeeId: employeeIdSchema,
						}),
					},
				},
			},
		},
		responses: {
			200: {
				content: {
					"application/json": {
						schema: successWithMessageSchema,
					},
				},
				description: "Successfully started break",
			},
			400: {
				content: {
					"application/json": {
						schema: errorResponseSchema,
					},
				},
				description: "Failed to start break",
			},
		},
	}),
	async (c) => {
		const body = await c.req.json();
		const parsed = z.object({ employeeId: employeeIdSchema }).safeParse(body);
		if (!parsed.success) {
			return c.json(
				{
					success: false as const,
					error: parsed.error.issues.map((issue) => issue.message).join(", "),
				},
				400
			);
		}
		try {
			const result = await startBreakForEmployee(parsed.data.employeeId);
			return c.json(okResponse(result.message), 200);
		} catch (error) {
			return c.json(actionError(error), 400);
		}
	}
);

// End break endpoint
app.openapi(
	createRoute({
		method: "post",
		path: "/end-break",
		request: {
			body: {
				content: {
					"application/json": {
						schema: z.object({
							employeeId: employeeIdSchema,
						}),
					},
				},
			},
		},
		responses: {
			200: {
				content: {
					"application/json": {
						schema: successWithMessageSchema,
					},
				},
				description: "Successfully ended break",
			},
			400: {
				content: {
					"application/json": {
						schema: errorResponseSchema,
					},
				},
				description: "Failed to end break",
			},
		},
	}),
	async (c) => {
		const body = await c.req.json();
		const parsed = z.object({ employeeId: employeeIdSchema }).safeParse(body);
		if (!parsed.success) {
			return c.json(
				{
					success: false as const,
					error: parsed.error.issues.map((issue) => issue.message).join(", "),
				},
				400
			);
		}
		try {
			const result = await endBreakForEmployee(parsed.data.employeeId);
			return c.json(okResponse(result.message), 200);
		} catch (error) {
			return c.json(actionError(error), 400);
		}
	}
);

// Delete time log endpoint
app.openapi(
	createRoute({
		method: "post",
		path: "/delete-time-log",
		request: {
			body: {
				content: {
					"application/json": {
						schema: z.object({
							logId: logIdSchema,
						}),
					},
				},
			},
		},
		responses: {
			200: {
				content: {
					"application/json": {
						schema: successWithMessageSchema,
					},
				},
				description: "Successfully deleted time log",
			},
			400: {
				content: {
					"application/json": {
						schema: errorResponseSchema,
					},
				},
				description: "Failed to delete time log",
			},
		},
	}),
	async (c) => {
		const body = await c.req.json();
		const parsed = z.object({ logId: logIdSchema }).safeParse(body);
		if (!parsed.success) {
			return c.json(
				{
					success: false as const,
					error: parsed.error.issues.map((issue) => issue.message).join(", "),
				},
				400
			);
		}
		try {
			const result = await deleteTimeLogEntry(parsed.data.logId);
			return c.json(okResponse(result.message), 200);
		} catch (error) {
			return c.json(actionError(error), 400);
		}
	}
);

// PIN toggle endpoint
app.openapi(
	createRoute({
		method: "post",
		path: "/pin-toggle",
		request: {
			body: {
				content: {
					"application/json": {
						schema: z.object({
							pin: z.string().min(4).max(6).openapi({ description: "Employee PIN" }),
							stationId: stationIdSchema.optional(),
						}),
					},
				},
			},
		},
		responses: {
			200: {
				content: {
					"application/json": {
						schema: successWithMessageSchema,
					},
				},
				description: "Successfully toggled clock action",
			},
			400: {
				content: {
					"application/json": {
						schema: errorResponseSchema,
					},
				},
				description: "Failed to toggle clock action",
			},
		},
	}),
	async (c) => {
		const body = await c.req.json();
		const parsed = z
			.object({
				pin: z.string().min(4).max(6).openapi({ description: "Employee PIN" }),
				stationId: stationIdSchema.optional(),
			})
			.safeParse(body);
		if (!parsed.success) {
			return c.json(
				{
					success: false as const,
					error: parsed.error.issues.map((issue) => issue.message).join(", "),
				},
				400
			);
		}
		try {
			const result = await pinToggleClockAction(parsed.data.pin, parsed.data.stationId ?? null);
			return c.json(okResponse(result.message), 200);
		} catch (error) {
			return c.json(actionError(error), 400);
		}
	}
);

export default app;
