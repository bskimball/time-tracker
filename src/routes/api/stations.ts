import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { db } from "../../lib/db";
import {
	actionError,
	errorResponseSchema,
	serializeArrayDates,
	stationsResponseSchema,
} from "./types";

const app = new OpenAPIHono();

// Get all stations
app.openapi(
	createRoute({
		method: "get",
		path: "/",
		responses: {
			200: {
				content: {
					"application/json": {
						schema: stationsResponseSchema,
					},
				},
				description: "List all stations",
			},
			400: {
				content: {
					"application/json": {
						schema: errorResponseSchema,
					},
				},
				description: "Failed to fetch stations",
			},
		},
	}),
	async (c) => {
		try {
			const stations = await db.station.findMany({
				select: {
					id: true,
					name: true,
					isActive: true,
					capacity: true,
					createdAt: true,
				},
			});
			const serializedStations = serializeArrayDates(stations);
			return c.json({ success: true as const, data: serializedStations }, 200);
		} catch (error) {
			const errorResponse = actionError(error);
			return c.json(errorResponse, 400);
		}
	}
);

export default app;
