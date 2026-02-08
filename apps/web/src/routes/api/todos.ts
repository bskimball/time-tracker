import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { db } from "../../lib/db";
import {
	actionError,
	errorResponseSchema,
	isPrismaNotFoundError,
	serializeArrayDates,
	serializeDates,
	successWithMessageSchema,
	todosResponseSchema,
	todoResponseSchema,
} from "./types";

const app = new OpenAPIHono();

const createTodoBodySchema = z.object({
	title: z.string().trim().min(1),
});

const updateTodoBodySchema = z
	.object({
		title: z.string().trim().min(1).optional(),
		completed: z.boolean().optional(),
	})
	.refine((data) => data.title !== undefined || data.completed !== undefined, {
		message: "At least one field is required",
	});

// Get all todos
app.openapi(
	createRoute({
		method: "get",
		path: "/",
		responses: {
			200: {
				content: {
					"application/json": {
						schema: todosResponseSchema,
					},
				},
				description: "List all todos",
			},
			400: {
				content: {
					"application/json": {
						schema: errorResponseSchema,
					},
				},
				description: "Failed to fetch todos",
			},
		},
	}),
	async (c) => {
		try {
			const todos = await db.todo.findMany({
				orderBy: { createdAt: "desc" },
			});
			const serializedTodos = serializeArrayDates(todos);
			return c.json({ success: true as const, data: serializedTodos }, 200);
		} catch (error) {
			const errorResponse = actionError(error);
			return c.json(errorResponse, 400);
		}
	}
);

// Create a new todo
app.openapi(
	createRoute({
		method: "post",
		path: "/",
		request: {
			body: {
				content: {
					"application/json": {
						schema: createTodoBodySchema,
					},
				},
			},
		},
		responses: {
			201: {
				content: {
					"application/json": {
						schema: todoResponseSchema,
					},
				},
				description: "Todo created successfully",
			},
			400: {
				content: {
					"application/json": {
						schema: errorResponseSchema,
					},
				},
				description: "Failed to create todo",
			},
		},
	}),
	async (c) => {
		try {
			const parsed = c.req.valid("json");
			const todo = await db.todo.create({
				data: {
					title: parsed.title,
					updatedAt: new Date(),
				},
			});
			const serializedTodo = serializeDates(todo);
			return c.json({ success: true as const, data: serializedTodo }, 201);
		} catch (error) {
			const errorResponse = actionError(error);
			return c.json(errorResponse, 400);
		}
	}
);

// Update a todo
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
						schema: updateTodoBodySchema,
					},
				},
			},
		},
		responses: {
			200: {
				content: {
					"application/json": {
						schema: todoResponseSchema,
					},
				},
				description: "Todo updated successfully",
			},
			404: {
				content: {
					"application/json": {
						schema: errorResponseSchema,
					},
				},
				description: "Todo not found",
			},
			400: {
				content: {
					"application/json": {
						schema: errorResponseSchema,
					},
				},
				description: "Failed to update todo",
			},
		},
	}),
	async (c) => {
		try {
			const { id } = c.req.valid("param");
			const parsed = c.req.valid("json");

			const todo = await db.todo.update({
				where: { id },
				data: parsed,
			});
			const serializedTodo = serializeDates(todo);
			return c.json({ success: true as const, data: serializedTodo }, 200);
		} catch (error) {
			if (isPrismaNotFoundError(error)) {
				return c.json({ success: false as const, error: "Todo not found" }, 404);
			}

			const errorResponse = actionError(error);
			return c.json(errorResponse, 400);
		}
	}
);

// Delete a todo
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
						schema: successWithMessageSchema,
					},
				},
				description: "Todo deleted successfully",
			},
			404: {
				content: {
					"application/json": {
						schema: errorResponseSchema,
					},
				},
				description: "Todo not found",
			},
			400: {
				content: {
					"application/json": {
						schema: errorResponseSchema,
					},
				},
				description: "Failed to delete todo",
			},
		},
	}),
	async (c) => {
		try {
			const { id } = c.req.valid("param");

			// Check if todo exists first
			const existingTodo = await db.todo.findUnique({
				where: { id },
				select: { id: true },
			});

			if (!existingTodo) {
				return c.json({ success: false as const, error: "Todo not found" }, 404);
			}

			await db.todo.delete({
				where: { id },
			});
			return c.json(
				{
					success: true as const,
					message: "Todo deleted successfully",
				},
				200
			);
		} catch (error) {
			const errorResponse = actionError(error);
			return c.json(errorResponse, 400);
		}
	}
);

export default app;
