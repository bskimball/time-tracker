import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { db } from "../../lib/db";
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
				employeeId: z.string().optional(),
				stationId: z.string().optional(),
				startDate: z.string().optional(),
				endDate: z.string().optional(),
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
			const { employeeId, stationId, startDate, endDate } = c.req.query();
			const where: any = {};

			if (employeeId) where.employeeId = employeeId;
			if (stationId) where.stationId = stationId;
			if (startDate || endDate) {
				where.startTime = {};
				if (startDate) where.startTime.gte = new Date(startDate);
				if (endDate) where.startTime.lte = new Date(endDate);
			}
			where.deletedAt = null;

			const timeLogs = await db.timeLog.findMany({
				where,
				select: {
					id: true,
					employeeId: true,
					stationId: true,
					type: true,
					startTime: true,
					endTime: true,
					note: true,
					deletedAt: true,
					createdAt: true,
					updatedAt: true,
				},
				orderBy: { startTime: "desc" },
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
