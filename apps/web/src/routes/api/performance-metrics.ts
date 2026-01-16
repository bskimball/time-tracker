import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { db } from "../../lib/db";
import { actionError, errorResponseSchema, serializeArrayDates, serializeDates } from "./types";

const app = new OpenAPIHono();

// Zod schemas for performance metrics
const performanceMetricSchema = z.object({
	id: z.string(),
	employeeId: z.string(),
	date: z.string(),
	stationId: z.string().nullable(),
	hoursWorked: z.number(),
	unitsProcessed: z.number().nullable(),
	efficiency: z.number().nullable(),
	qualityScore: z.number().nullable(),
	overtimeHours: z.number().nullable(),
	createdAt: z.string(),
	updatedAt: z.string(),
});

const performanceMetricsResponseSchema = z.object({
	success: z.literal(true),
	data: z.array(performanceMetricSchema),
});

const createPerformanceMetricSchema = z.object({
	employeeId: z.string().uuid(),
	date: z.string().date(),
	stationId: z.string().uuid().optional(),
	hoursWorked: z.number().nonnegative(),
	unitsProcessed: z.number().int().nonnegative().optional(),
	efficiency: z.number().nonnegative().optional(),
	qualityScore: z.number().min(0).max(100).optional(),
	overtimeHours: z.number().nonnegative().optional(),
});

const updatePerformanceMetricSchema = z.object({
	hoursWorked: z.number().nonnegative().optional(),
	unitsProcessed: z.number().int().nonnegative().optional(),
	efficiency: z.number().nonnegative().optional(),
	qualityScore: z.number().min(0).max(100).optional(),
	overtimeHours: z.number().nonnegative().optional(),
});

// Get all performance metrics
app.openapi(
	createRoute({
		method: "get",
		path: "/",
		request: {
			query: z.object({
				employeeId: z.string().uuid().optional(),
				stationId: z.string().uuid().optional(),
				startDate: z.string().date().optional(),
				endDate: z.string().date().optional(),
				limit: z.string().optional(),
			}),
		},
		responses: {
			200: {
				content: {
					"application/json": {
						schema: performanceMetricsResponseSchema,
					},
				},
				description: "List performance metrics",
			},
			400: {
				content: {
					"application/json": {
						schema: errorResponseSchema,
					},
				},
				description: "Failed to fetch performance metrics",
			},
		},
	}),
	async (c) => {
		try {
			const { employeeId, stationId, startDate, endDate, limit } = c.req.query();

			const where: any = {};
			if (employeeId) where.employeeId = employeeId;
			if (stationId) where.stationId = stationId;
			if (startDate || endDate) {
				where.date = {};
				if (startDate) where.date.gte = new Date(startDate);
				if (endDate) where.date.lte = new Date(endDate);
			}

			const performanceMetrics = await db.performanceMetric.findMany({
				where,
				include: {
					Employee: {
						select: {
							name: true,
							email: true,
						},
					},
				},
				orderBy: { date: "desc" },
				take: limit ? parseInt(limit) : undefined,
			});

			const serializedMetrics = serializeArrayDates(performanceMetrics);
			return c.json({ success: true as const, data: serializedMetrics }, 200);
		} catch (error) {
			const errorResponse = actionError(error);
			return c.json(errorResponse, 400);
		}
	}
);

// Get performance metric by ID
app.openapi(
	createRoute({
		method: "get",
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
						schema: z.object({
							success: z.literal(true),
							data: performanceMetricSchema,
						}),
					},
				},
				description: "Get performance metric by ID",
			},
			404: {
				content: {
					"application/json": {
						schema: errorResponseSchema,
					},
				},
				description: "Performance metric not found",
			},
			400: {
				content: {
					"application/json": {
						schema: errorResponseSchema,
					},
				},
				description: "Failed to fetch performance metric",
			},
		},
	}),
	async (c) => {
		try {
			const { id } = c.req.param();
			const performanceMetric = await db.performanceMetric.findUnique({
				where: { id },
				include: {
					Employee: {
						select: {
							name: true,
							email: true,
						},
					},
				},
			});
			if (!performanceMetric) {
				return c.json({ success: false as const, error: "Performance metric not found" }, 404);
			}

			const serializedMetric = serializeDates(performanceMetric);
			return c.json(
				{
					success: true as const,
					data: serializedMetric,
				},
				200
			);
		} catch (error) {
			const errorResponse = actionError(error);
			return c.json(errorResponse, 400);
		}
	}
);

// Get aggregated metrics for an employee
app.openapi(
	createRoute({
		method: "get",
		path: "/employee/{employeeId}/summary",
		request: {
			params: z.object({
				employeeId: z.string().uuid(),
			}),
			query: z.object({
				startDate: z.string().date().optional(),
				endDate: z.string().date().optional(),
			}),
		},
		responses: {
			200: {
				content: {
					"application/json": {
						schema: z.object({
							success: z.literal(true),
							data: z.object({
								totalHours: z.number(),
								totalUnits: z.number(),
								avgEfficiency: z.number(),
								totalOvertimeHours: z.number(),
								avgQualityScore: z.number().nullable(),
							}),
						}),
					},
				},
				description: "Get aggregated performance metrics for an employee",
			},
			400: {
				content: {
					"application/json": {
						schema: errorResponseSchema,
					},
				},
				description: "Failed to fetch employee summary",
			},
		},
	}),
	async (c) => {
		try {
			const { employeeId } = c.req.param();
			const { startDate, endDate } = c.req.query();

			const where: any = { employeeId };
			if (startDate || endDate) {
				where.date = {};
				if (startDate) where.date.gte = new Date(startDate);
				if (endDate) where.date.lte = new Date(endDate);
			}

			const aggregation = await db.performanceMetric.aggregate({
				where,
				_sum: {
					hoursWorked: true,
					unitsProcessed: true,
					overtimeHours: true,
				},
				_avg: {
					efficiency: true,
					qualityScore: true,
				},
			});

			const summary = {
				totalHours: aggregation._sum.hoursWorked || 0,
				totalUnits: aggregation._sum.unitsProcessed || 0,
				avgEfficiency: aggregation._avg.efficiency || 0,
				totalOvertimeHours: aggregation._sum.overtimeHours || 0,
				avgQualityScore: aggregation._avg.qualityScore || null,
			};

			return c.json({ success: true as const, data: summary }, 200);
		} catch (error) {
			const errorResponse = actionError(error);
			return c.json(errorResponse, 400);
		}
	}
);

// Create performance metric
app.openapi(
	createRoute({
		method: "post",
		path: "/",
		request: {
			body: {
				content: {
					"application/json": {
						schema: createPerformanceMetricSchema,
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
							data: performanceMetricSchema,
						}),
					},
				},
				description: "Performance metric created successfully",
			},
			400: {
				content: {
					"application/json": {
						schema: errorResponseSchema,
					},
				},
				description: "Failed to create performance metric",
			},
		},
	}),
	async (c) => {
		try {
			const body = await c.req.json();
			const performanceMetric = await db.performanceMetric.create({
				data: {
					...body,
					date: new Date(body.date),
				},
			});
			const serializedMetric = serializeDates(performanceMetric);
			return c.json({ success: true as const, data: serializedMetric }, 201);
		} catch (error) {
			const errorResponse = actionError(error);
			return c.json(errorResponse, 400);
		}
	}
);

// Update performance metric
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
						schema: updatePerformanceMetricSchema,
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
							data: performanceMetricSchema,
						}),
					},
				},
				description: "Performance metric updated successfully",
			},
			404: {
				content: {
					"application/json": {
						schema: errorResponseSchema,
					},
				},
				description: "Performance metric not found",
			},
			400: {
				content: {
					"application/json": {
						schema: errorResponseSchema,
					},
				},
				description: "Failed to update performance metric",
			},
		},
	}),
	async (c) => {
		try {
			const { id } = c.req.param();
			const body = await c.req.json();
			const performanceMetric = await db.performanceMetric.update({
				where: { id },
				data: body,
			});
			const serializedMetric = serializeDates(performanceMetric);
			return c.json({ success: true as const, data: serializedMetric }, 200);
		} catch (error) {
			const errorResponse = actionError(error);
			return c.json(errorResponse, 400);
		}
	}
);

// Delete performance metric
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
						schema: z.object({
							success: z.literal(true),
							message: z.string(),
						}),
					},
				},
				description: "Performance metric deleted successfully",
			},
			404: {
				content: {
					"application/json": {
						schema: errorResponseSchema,
					},
				},
				description: "Performance metric not found",
			},
			400: {
				content: {
					"application/json": {
						schema: errorResponseSchema,
					},
				},
				description: "Failed to delete performance metric",
			},
		},
	}),
	async (c) => {
		try {
			const { id } = c.req.param();
			await db.performanceMetric.delete({
				where: { id },
			});
			return c.json(
				{ success: true as const, message: "Performance metric deleted successfully" },
				200
			);
		} catch (error) {
			const errorResponse = actionError(error);
			return c.json(errorResponse, 400);
		}
	}
);

export default app;
