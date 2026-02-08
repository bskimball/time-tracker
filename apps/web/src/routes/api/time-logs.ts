import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { db } from "../../lib/db";
import { listTimeLogs } from "../../lib/domain/time-logs";
import {
	actionError,
	errorResponseSchema,
	serializeArrayDates,
	timeLogsResponseSchema,
} from "./types";

const app = new OpenAPIHono();

// Get time logs with optional filtering
app.openapi(
	createRoute({
		method: "get",
		path: "/",
		request: {
			query: z.object({
				employeeId: z.string().cuid().optional(),
				stationId: z.string().cuid().optional(),
				startDate: z.coerce.date().optional(),
				endDate: z.coerce.date().optional(),
			}),
		},
		responses: {
			200: {
				content: {
					"application/json": {
						schema: timeLogsResponseSchema,
					},
				},
				description: "List time logs",
			},
			400: {
				content: {
					"application/json": {
						schema: errorResponseSchema,
					},
				},
				description: "Failed to fetch time logs",
			},
		},
	}),
	async (c) => {
		try {
			const { employeeId, stationId, startDate, endDate } = c.req.valid("query");
			const timeLogs = await listTimeLogs(db, {
				employeeId,
				stationId,
				startDate,
				endDate,
			});
			const serializedTimeLogs = serializeArrayDates(timeLogs);
			return c.json({ success: true as const, data: serializedTimeLogs }, 200);
		} catch (error) {
			const errorResponse = actionError(error);
			return c.json(errorResponse, 400);
		}
	}
);

export default app;
