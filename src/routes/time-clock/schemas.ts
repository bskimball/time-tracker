import { z } from "zod";

export const clockInSchema = z.object({
	employeeId: z.string().min(1, "Employee is required"),
	stationId: z.string().min(1, "Station is required"),
});

export const clockOutSchema = z.object({
	logId: z.string().min(1, "Log ID is required"),
});

export const breakSchema = z.object({
	employeeId: z.string().min(1, "Employee ID is required"),
});

export const updateTimeLogSchema = z.object({
	logId: z.string().min(1, "Log ID is required"),
	startTime: z.string().min(1, "Start time is required"),
	endTime: z.string().optional(),
	type: z.enum(["WORK", "BREAK"]),
	stationId: z.string().nullable().optional(),
	note: z.string().optional(),
});

export const deleteTimeLogSchema = z.object({
	logId: z.string().min(1, "Log ID is required"),
});

export const pinToggleClockSchema = z.object({
	pin: z.string().min(4, "PIN must be at least 4 digits").max(6, "PIN cannot exceed 6 digits"),
	stationId: z.string().nullable().optional(),
});

export type ClockInInput = z.infer<typeof clockInSchema>;
export type ClockOutInput = z.infer<typeof clockOutSchema>;
export type BreakInput = z.infer<typeof breakSchema>;
export type UpdateTimeLogInput = z.infer<typeof updateTimeLogSchema>;
export type DeleteTimeLogInput = z.infer<typeof deleteTimeLogSchema>;
export type PinToggleClockInput = z.infer<typeof pinToggleClockSchema>;
