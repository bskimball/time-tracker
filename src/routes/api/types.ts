import { z } from "zod";

// Base schemas
const errorResponseSchema = z.object({
	success: z.literal(false),
	error: z.string(),
});

const successWithMessageSchema = z.object({
	success: z.literal(true),
	message: z.string().optional(),
});

// Parameter schemas
const employeeIdSchema = z.string().uuid().openapi({
	description: "Employee identifier",
});

const stationIdSchema = z.string().uuid().openapi({
	description: "Station identifier",
});

const logIdSchema = z.string().uuid().openapi({
	description: "Time log identifier",
});

// Employee schemas
const employeeSchema = z.object({
	id: z.string(),
	name: z.string(),
	email: z.string(),
	lastStationId: z.string().nullable(),
	dailyHoursLimit: z.number().nullable(),
	weeklyHoursLimit: z.number().nullable(),
	createdAt: z.string(), // Date serialized as string
});

const employeesResponseSchema = z.object({
	success: z.literal(true),
	data: z.array(employeeSchema),
});

// Station schemas
const stationSchema = z.object({
	id: z.string(),
	name: z.enum(["PICKING", "PACKING", "FILLING", "RECEIVING", "SHIPPING", "QUALITY", "INVENTORY"]),
	isActive: z.boolean().optional(),
	capacity: z.number().nullable().optional(),
	createdAt: z.string(),
});

const stationsResponseSchema = z.object({
	success: z.literal(true),
	data: z.array(stationSchema),
});

// TimeLog schemas
const timeLogSchema = z.object({
	id: z.string(),
	employeeId: z.string(),
	stationId: z.string().nullable(),
	type: z.enum(["WORK", "BREAK"]),
	startTime: z.string(),
	endTime: z.string().nullable(),
	note: z.string().nullable(),
	deletedAt: z.string().nullable(),
	createdAt: z.string(),
	updatedAt: z.string(),
});

const timeLogsResponseSchema = z.object({
	success: z.literal(true),
	data: z.array(timeLogSchema),
});

// User schemas
const userSchema = z.object({
	id: z.string(),
	email: z.string(),
	name: z.string().nullable(),
	image: z.string().nullable(),
	role: z.enum(["ADMIN", "MANAGER", "WORKER"]),
	employeeId: z.string().nullable(),
	createdAt: z.string(),
	updatedAt: z.string(),
});

const usersResponseSchema = z.object({
	success: z.literal(true),
	data: z.array(userSchema),
});

// Todo schemas
const todoSchema = z.object({
	id: z.string(),
	title: z.string(),
	completed: z.boolean(),
	createdAt: z.string(),
	updatedAt: z.string(),
});

const todosResponseSchema = z.object({
	success: z.literal(true),
	data: z.array(todoSchema),
});

const todoResponseSchema = z.object({
	success: z.literal(true),
	data: todoSchema,
});

// Helper function to serialize Prisma date fields to strings
export function serializeDates<T extends Record<string, any>>(obj: T): T {
	const serialized: any = { ...obj };

	const dateFields = ["createdAt", "updatedAt", "startTime", "endTime", "deletedAt"];

	for (const field of dateFields) {
		if (field in serialized && serialized[field] instanceof Date) {
			serialized[field] = (serialized[field] as Date).toISOString();
		}
	}

	return serialized as T;
}

// Helper function to serialize arrays of objects with dates
export function serializeArrayDates<T extends Record<string, any>>(arr: T[]): T[] {
	return arr.map(serializeDates);
}

export {
	errorResponseSchema,
	successWithMessageSchema,
	employeeIdSchema,
	stationIdSchema,
	logIdSchema,
	employeeSchema,
	employeesResponseSchema,
	stationSchema,
	stationsResponseSchema,
	timeLogSchema,
	timeLogsResponseSchema,
	userSchema,
	usersResponseSchema,
	todoSchema,
	todosResponseSchema,
	todoResponseSchema,
};

// Helper functions for API responses
export const okResponse = (message?: string) => ({
	success: true as const,
	message,
});

export const actionError = (error: unknown) => {
	if (error instanceof Error) {
		return { success: false as const, error: error.message };
	}
	return { success: false as const, error: "Unknown error" };
};

export type ApiError = z.infer<typeof errorResponseSchema>;
export type ApiSuccess = z.infer<typeof successWithMessageSchema>;
export type Employee = z.infer<typeof employeeSchema>;
export type Station = z.infer<typeof stationSchema>;
export type TimeLog = z.infer<typeof timeLogSchema>;
export type User = z.infer<typeof userSchema>;
export type Todo = z.infer<typeof todoSchema>;
