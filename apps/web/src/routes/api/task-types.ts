import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { db } from "../../lib/db";
import {
	actionError,
	errorResponseSchema,
	serializeArrayDates,
	serializeDates,
} from "./types";

const app = new OpenAPIHono();

// Zod schemas for task types
const taskTypeSchema = z.object({
	id: z.string(),
	name: z.string(),
	stationId: z.string(),
	description: z.string().nullable(),
	estimatedMinutesPerUnit: z.number().nullable(),
	isActive: z.boolean(),
	createdAt: z.string(),
	updatedAt: z.string(),
});

const taskTypesResponseSchema = z.object({
	success: z.literal(true),
	data: z.array(taskTypeSchema),
});

const createTaskTypeSchema = z.object({
	name: z.string().trim().min(1),
	stationId: z.string().cuid(),
	description: z.string().optional(),
	estimatedMinutesPerUnit: z.number().positive().optional(),
	isActive: z.boolean().optional(),
});

const updateTaskTypeSchema = z
	.object({
		name: z.string().trim().min(1).optional(),
		description: z.string().optional(),
		estimatedMinutesPerUnit: z.number().positive().optional(),
		isActive: z.boolean().optional(),
	})
	.refine(
		(data) =>
			data.name !== undefined ||
			data.description !== undefined ||
			data.estimatedMinutesPerUnit !== undefined ||
			data.isActive !== undefined,
		{ message: "At least one field is required" }
	);

// Get all task types
app.openapi(
	createRoute({
		method: "get",
		path: "/",
		responses: {
			200: {
				content: {
					"application/json": {
						schema: taskTypesResponseSchema,
					},
				},
				description: "List all task types",
			},
			400: {
				content: {
					"application/json": {
						schema: errorResponseSchema,
					},
				},
				description: "Failed to fetch task types",
			},
		},
	}),
	async (c) => {
		try {
			const taskTypes = await db.taskType.findMany({
				orderBy: { name: "asc" },
			});
			const serializedTaskTypes = serializeArrayDates(taskTypes);
			return c.json({ success: true as const, data: serializedTaskTypes }, 200);
		} catch (error) {
			const errorResponse = actionError(error);
			return c.json(errorResponse, 400);
		}
	}
);

// Get task type by ID
app.openapi(
	createRoute({
		method: "get",
		path: "/{id}",
		request: {
			params: z.object({
				id: z.string().cuid(),
			}),
		},
		responses: {
			200: {
				content: {
					"application/json": {
						schema: z.object({
							success: z.literal(true),
							data: taskTypeSchema,
						}),
					},
				},
				description: "Get task type by ID",
			},
			404: {
				content: {
					"application/json": {
						schema: errorResponseSchema,
					},
				},
				description: "Task type not found",
			},
			400: {
				content: {
					"application/json": {
						schema: errorResponseSchema,
					},
				},
				description: "Failed to fetch task type",
			},
		},
	}),
	async (c) => {
		try {
			const { id } = c.req.valid("param");
			const taskType = await db.taskType.findUnique({
				where: { id },
			});
			if (!taskType) {
				return c.json({ success: false as const, error: "Task type not found" }, 404);
			}

			const serializedTaskType = serializeDates(taskType);
			return c.json(
				{
					success: true as const,
					data: serializedTaskType,
				},
				200
			);
		} catch (error) {
			const errorResponse = actionError(error);
			return c.json(errorResponse, 400);
		}
	}
);

// Create task type
app.openapi(
	createRoute({
		method: "post",
		path: "/",
		request: {
			body: {
				content: {
					"application/json": {
						schema: createTaskTypeSchema,
					},
				},
			},
		},
		responses: {
			201: {
				content: {
					"application/json": {
						schema: z.object({
							success: z.literal(true),
							data: taskTypeSchema,
						}),
					},
				},
				description: "Task type created successfully",
			},
			400: {
				content: {
					"application/json": {
						schema: errorResponseSchema,
					},
				},
				description: "Failed to create task type",
			},
		},
	}),
	async (c) => {
		try {
			const body = c.req.valid("json");
			const taskType = await db.taskType.create({
				data: body,
			});
			const serializedTaskType = serializeDates(taskType);
			return c.json({ success: true as const, data: serializedTaskType }, 201);
		} catch (error) {
			const errorResponse = actionError(error);
			return c.json(errorResponse, 400);
		}
	}
);

// Update task type
app.openapi(
	createRoute({
		method: "patch",
		path: "/{id}",
		request: {
			params: z.object({
				id: z.string().cuid(),
			}),
			body: {
				content: {
					"application/json": {
						schema: updateTaskTypeSchema,
					},
				},
			},
		},
		responses: {
			200: {
				content: {
					"application/json": {
						schema: z.object({
							success: z.literal(true),
							data: taskTypeSchema,
						}),
					},
				},
				description: "Task type updated successfully",
			},
			404: {
				content: {
					"application/json": {
						schema: errorResponseSchema,
					},
				},
				description: "Task type not found",
			},
			400: {
				content: {
					"application/json": {
						schema: errorResponseSchema,
					},
				},
				description: "Failed to update task type",
			},
		},
	}),
	async (c) => {
		try {
			const { id } = c.req.valid("param");
			const body = c.req.valid("json");
			const taskType = await db.taskType.update({
				where: { id },
				data: body,
			});
			const serializedTaskType = serializeDates(taskType);
			return c.json({ success: true as const, data: serializedTaskType }, 200);
		} catch (error) {
			const errorResponse = actionError(error);
			return c.json(errorResponse, 400);
		}
	}
);

// Delete task type
app.openapi(
	createRoute({
		method: "delete",
		path: "/{id}",
		request: {
			params: z.object({
				id: z.string().cuid(),
			}),
		},
		responses: {
			200: {
				content: {
					"application/json": {
						schema: z.object({
							success: z.literal(true),
							message: z.string(),
						}),
					},
				},
				description: "Task type deleted successfully",
			},
			404: {
				content: {
					"application/json": {
						schema: errorResponseSchema,
					},
				},
				description: "Task type not found",
			},
			400: {
				content: {
					"application/json": {
						schema: errorResponseSchema,
					},
				},
				description: "Failed to delete task type",
			},
		},
	}),
	async (c) => {
		try {
			const { id } = c.req.valid("param");
			await db.taskType.delete({
				where: { id },
			});
			return c.json({ success: true as const, message: "Task type deleted successfully" }, 200);
		} catch (error) {
			const errorResponse = actionError(error);
			return c.json(errorResponse, 400);
		}
	}
);

export default app;
