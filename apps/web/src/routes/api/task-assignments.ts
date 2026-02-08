import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import type { Prisma } from "@prisma/client";
import { db } from "../../lib/db";
import {
	actionError,
	errorResponseSchema,
	serializeArrayDates,
	serializeDates,
} from "./types";

const app = new OpenAPIHono();

// Zod schemas for task assignments
const taskAssignmentSchema = z.object({
	id: z.string(),
	employeeId: z.string(),
	taskTypeId: z.string(),
	startTime: z.string(),
	endTime: z.string().nullable(),
	unitsCompleted: z.number().nullable(),
	notes: z.string().nullable(),
	createdAt: z.string(),
	updatedAt: z.string(),
});

const taskAssignmentsResponseSchema = z.object({
	success: z.literal(true),
	data: z.array(taskAssignmentSchema),
});

const createTaskAssignmentSchema = z.object({
	employeeId: z.string().cuid(),
	taskTypeId: z.string().cuid(),
	startTime: z.string().datetime().optional(),
	unitsCompleted: z.number().int().nonnegative().optional(),
	notes: z.string().optional(),
});

const updateTaskAssignmentSchema = z
	.object({
		endTime: z.string().datetime().optional(),
		unitsCompleted: z.number().int().nonnegative().optional(),
		notes: z.string().optional(),
	})
	.refine(
		(data) =>
			data.endTime !== undefined || data.unitsCompleted !== undefined || data.notes !== undefined,
		{ message: "At least one field is required" }
	);

// Get all task assignments
app.openapi(
	createRoute({
		method: "get",
		path: "/",
		request: {
			query: z.object({
				employeeId: z.string().cuid().optional(),
				taskTypeId: z.string().cuid().optional(),
				active: z.enum(["true", "false"]).optional(),
			}),
		},
		responses: {
			200: {
				content: {
					"application/json": {
						schema: taskAssignmentsResponseSchema,
					},
				},
				description: "List all task assignments",
			},
			400: {
				content: {
					"application/json": {
						schema: errorResponseSchema,
					},
				},
				description: "Failed to fetch task assignments",
			},
		},
	}),
	async (c) => {
		try {
			const { employeeId, taskTypeId, active } = c.req.valid("query");

			const where: Prisma.TaskAssignmentWhereInput = {};
			if (employeeId) where.employeeId = employeeId;
			if (taskTypeId) where.taskTypeId = taskTypeId;
			if (active === "true") where.endTime = null;

			const taskAssignments = await db.taskAssignment.findMany({
				where,
				orderBy: { startTime: "desc" },
			});
			const serializedTaskAssignments = serializeArrayDates(taskAssignments);
			return c.json({ success: true as const, data: serializedTaskAssignments }, 200);
		} catch (error) {
			const errorResponse = actionError(error);
			return c.json(errorResponse, 400);
		}
	}
);

// Get task assignment by ID
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
							data: taskAssignmentSchema,
						}),
					},
				},
				description: "Get task assignment by ID",
			},
			404: {
				content: {
					"application/json": {
						schema: errorResponseSchema,
					},
				},
				description: "Task assignment not found",
			},
			400: {
				content: {
					"application/json": {
						schema: errorResponseSchema,
					},
				},
				description: "Failed to fetch task assignment",
			},
		},
	}),
	async (c) => {
		try {
			const { id } = c.req.valid("param");
			const taskAssignment = await db.taskAssignment.findUnique({
				where: { id },
			});
			if (!taskAssignment) {
				return c.json({ success: false as const, error: "Task assignment not found" }, 404);
			}

			const serializedTaskAssignment = serializeDates(taskAssignment);
			return c.json(
				{
					success: true as const,
					data: serializedTaskAssignment,
				},
				200
			);
		} catch (error) {
			const errorResponse = actionError(error);
			return c.json(errorResponse, 400);
		}
	}
);

// Create task assignment
app.openapi(
	createRoute({
		method: "post",
		path: "/",
		request: {
			body: {
				content: {
					"application/json": {
						schema: createTaskAssignmentSchema,
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
							data: taskAssignmentSchema,
						}),
					},
				},
				description: "Task assignment created successfully",
			},
			400: {
				content: {
					"application/json": {
						schema: errorResponseSchema,
					},
				},
				description: "Failed to create task assignment",
			},
		},
	}),
	async (c) => {
		try {
			const body = c.req.valid("json");
			const taskAssignment = await db.taskAssignment.create({
				data: body,
			});
			const serializedTaskAssignment = serializeDates(taskAssignment);
			return c.json({ success: true as const, data: serializedTaskAssignment }, 201);
		} catch (error) {
			const errorResponse = actionError(error);
			return c.json(errorResponse, 400);
		}
	}
);

// Update task assignment (typically to add endTime and unitsCompleted)
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
						schema: updateTaskAssignmentSchema,
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
							data: taskAssignmentSchema,
						}),
					},
				},
				description: "Task assignment updated successfully",
			},
			404: {
				content: {
					"application/json": {
						schema: errorResponseSchema,
					},
				},
				description: "Task assignment not found",
			},
			400: {
				content: {
					"application/json": {
						schema: errorResponseSchema,
					},
				},
				description: "Failed to update task assignment",
			},
		},
	}),
	async (c) => {
		try {
			const { id } = c.req.valid("param");
			const body = c.req.valid("json");
			const taskAssignment = await db.taskAssignment.update({
				where: { id },
				data: body,
			});
			const serializedTaskAssignment = serializeDates(taskAssignment);
			return c.json({ success: true as const, data: serializedTaskAssignment }, 200);
		} catch (error) {
			const errorResponse = actionError(error);
			return c.json(errorResponse, 400);
		}
	}
);

// Delete task assignment
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
				description: "Task assignment deleted successfully",
			},
			404: {
				content: {
					"application/json": {
						schema: errorResponseSchema,
					},
				},
				description: "Task assignment not found",
			},
			400: {
				content: {
					"application/json": {
						schema: errorResponseSchema,
					},
				},
				description: "Failed to delete task assignment",
			},
		},
	}),
	async (c) => {
		try {
			const { id } = c.req.valid("param");
			await db.taskAssignment.delete({
				where: { id },
			});
			return c.json(
				{ success: true as const, message: "Task assignment deleted successfully" },
				200
			);
		} catch (error) {
			const errorResponse = actionError(error);
			return c.json(errorResponse, 400);
		}
	}
);

export default app;
