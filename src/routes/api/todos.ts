import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { db } from "../../lib/db";
import {
	actionError,
	errorResponseSchema,
	serializeArrayDates,
	serializeDates,
	successWithMessageSchema,
	todosResponseSchema,
	todoResponseSchema,
} from "./types";

const app = new OpenAPIHono();

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
		path: "/todos",
		request: {
			body: {
				content: {
					"application/json": {
						schema: z.object({
							title: z.string().min(1),
						}),
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
			const body = await c.req.json();
			const parsed = z.object({ title: z.string().min(1) }).safeParse(body);
			if (!parsed.success) {
				return c.json(
					{
						success: false as const,
						error: parsed.error.issues.map((issue) => issue.message).join(", "),
					},
					400
				);
			}
			const todo = await db.todo.create({
				data: {
					id: crypto.randomUUID(),
					title: parsed.data.title,
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
				id: z.string().uuid(),
			}),
			body: {
				content: {
					"application/json": {
						schema: z.object({
							title: z.string().min(1).optional(),
							completed: z.boolean().optional(),
						}),
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
			const { id } = c.req.param();
			const body = await c.req.json();
			const parsed = z
				.object({
					title: z.string().min(1).optional(),
					completed: z.boolean().optional(),
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

			const todo = await db.todo.update({
				where: { id },
				data: parsed.data,
			});
			const serializedTodo = serializeDates(todo);
			return c.json({ success: true as const, data: serializedTodo }, 200);
		} catch (error) {
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
				id: z.string().uuid(),
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
			const { id } = c.req.param();

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
