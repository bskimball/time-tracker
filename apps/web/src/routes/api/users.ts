import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { db } from "../../lib/db";
import {
	actionError,
	errorResponseSchema,
	serializeArrayDates,
	usersResponseSchema,
} from "./types";

const app = new OpenAPIHono();

// Get all users
app.openapi(
	createRoute({
		method: "get",
		path: "/",
		responses: {
			200: {
				content: {
					"application/json": {
						schema: usersResponseSchema,
					},
				},
				description: "List all users",
			},
			400: {
				content: {
					"application/json": {
						schema: errorResponseSchema,
					},
				},
				description: "Failed to fetch users",
			},
		},
	}),
	async (c) => {
		try {
			const users = await db.user.findMany({
				select: {
					id: true,
					email: true,
					name: true,
					image: true,
					role: true,
					employeeId: true,
					createdAt: true,
					updatedAt: true,
				},
			});
			const serializedUsers = serializeArrayDates(users);
			return c.json({ success: true as const, data: serializedUsers }, 200);
		} catch (error) {
			const errorResponse = actionError(error);
			return c.json(errorResponse, 400);
		}
	}
);

export default app;
