import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { db } from "../../lib/db";
import {
	actionError,
	employeeIdSchema,
	errorResponseSchema,
	employeesResponseSchema,
	employeeSchema,
	serializeArrayDates,
	serializeDates,
} from "./types";

const app = new OpenAPIHono();

// Get all employees
app.openapi(
	createRoute({
		method: "get",
		path: "/",
		responses: {
			200: {
				content: {
					"application/json": {
						schema: employeesResponseSchema,
					},
				},
				description: "List all employees",
			},
			400: {
				content: {
					"application/json": {
						schema: errorResponseSchema,
					},
				},
				description: "Failed to fetch employees",
			},
		},
	}),
	async (c) => {
		try {
			const employees = await db.employee.findMany({
				select: {
					id: true,
					name: true,
					email: true,
					lastStationId: true,
					dailyHoursLimit: true,
					weeklyHoursLimit: true,
					createdAt: true,
				},
			});
			const serializedEmployees = serializeArrayDates(employees);
			return c.json({ success: true as const, data: serializedEmployees }, 200);
		} catch (error) {
			const errorResponse = actionError(error);
			return c.json(errorResponse, 400);
		}
	}
);

// Get employee by ID
app.openapi(
	createRoute({
		method: "get",
		path: "/{id}",
		request: {
			params: z.object({
				id: employeeIdSchema,
			}),
		},
		responses: {
			200: {
				content: {
					"application/json": {
						schema: z.object({
							success: z.literal(true),
							data: employeeSchema,
						}),
					},
				},
				description: "Get employee by ID",
			},
			404: {
				content: {
					"application/json": {
						schema: errorResponseSchema,
					},
				},
				description: "Employee not found",
			},
			400: {
				content: {
					"application/json": {
						schema: errorResponseSchema,
					},
				},
				description: "Failed to fetch employee",
			},
		},
	}),
	async (c) => {
		try {
			const { id } = c.req.valid("param");
			const employee = await db.employee.findUnique({
				where: { id },
				select: {
					id: true,
					name: true,
					email: true,
					lastStationId: true,
					dailyHoursLimit: true,
					weeklyHoursLimit: true,
					createdAt: true,
				},
			});
			if (!employee) {
				return c.json({ success: false as const, error: "Employee not found" }, 404);
			}

			const serializedEmployee = serializeDates(employee);
			return c.json(
				{
					success: true as const,
					data: serializedEmployee,
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
