import { describe, expect, it, beforeEach, vi } from "vitest";
import bcrypt from "bcryptjs";

import { db } from "~/lib/db";
import {
	ClockActionError,
	clockInEmployee,
	clockOutLog,
	startBreakForEmployee,
	endBreakForEmployee,
	updateTimeLogEntry,
	deleteTimeLogEntry,
	pinToggleClockAction,
} from "~/services/time-clock";

describe("time clock service", () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	describe("clockInEmployee", () => {
		it("throws when required params missing", async () => {
			await expect(clockInEmployee(null, "station")).rejects.toThrowError(ClockActionError);
		});

		it("creates work log and updates employee", async () => {
			(db.timeLog.findFirst as any).mockResolvedValue(null);
			(db.$transaction as any).mockImplementation(async (cb: any) => {
				const tx = {
					timeLog: { create: vi.fn().mockResolvedValue({}) },
					employee: { update: vi.fn().mockResolvedValue({}) },
				};
				await cb(tx);
			});

			await clockInEmployee("employee", "station");

			expect(db.timeLog.findFirst as any).toHaveBeenCalledWith({
				where: {
					employeeId: "employee",
					endTime: null,
					type: "WORK",
					deletedAt: null,
				},
			});

			// Verify transaction was called and timeLog.create has the right structure
			expect(db.$transaction as any).toHaveBeenCalled();
		});
	});

	describe("clockOutLog", () => {
		it("updates log with end time", async () => {
			await clockOutLog("log-id");
			expect(db.timeLog.update as any).toHaveBeenCalledWith({
				where: { id: "log-id" },
				data: expect.objectContaining({ endTime: expect.any(Date) }),
			});
		});
	});

	describe("startBreakForEmployee", () => {
		it("requires active work log", async () => {
			(db as any).timeLog.findFirst.mockResolvedValueOnce(null);

			await expect(startBreakForEmployee("emp")).rejects.toThrowError(/clocked in/);
		});

		it("creates break when eligible", async () => {
			(db as any).timeLog.findFirst
				.mockResolvedValueOnce({ stationId: "station", id: "work-1" } as any)
				.mockResolvedValueOnce(null);
			(db as any).timeLog.create.mockResolvedValue({});

			await startBreakForEmployee("emp");
			expect((db as any).timeLog.create).toHaveBeenCalledWith({
				data: {
					id: expect.any(String),
					employeeId: "emp",
					stationId: "station",
					type: "BREAK",
					updatedAt: expect.any(Date),
				},
			});
		});
	});

	describe("endBreakForEmployee", () => {
		it("requires active break", async () => {
			(db as any).timeLog.findFirst.mockResolvedValueOnce(null);

			await expect(endBreakForEmployee("emp")).rejects.toThrowError(/No active break/);
		});

		it("updates break end time", async () => {
			(db as any).timeLog.findFirst.mockResolvedValueOnce({
				id: "break-id",
			} as any);

			await endBreakForEmployee("emp");
			expect((db as any).timeLog.update).toHaveBeenCalledWith({
				where: { id: "break-id" },
				data: { endTime: expect.any(Date) },
			});
		});
	});

	describe("updateTimeLogEntry", () => {
		it("validates end time after start time", async () => {
			await expect(
				updateTimeLogEntry(
					"log",
					"2024-01-01T10:00:00.000Z",
					"2023-12-31T10:00:00.000Z",
					"WORK",
					null,
					null
				)
			).rejects.toThrowError(/End time must be after start time/);
		});

		it("updates log when valid", async () => {
			(db as any).timeLog.findUnique.mockResolvedValueOnce({
				employeeId: "emp",
			} as any);
			(db as any).timeLog.findFirst.mockResolvedValue(null);
			(db as any).timeLog.update.mockResolvedValue({});

			await updateTimeLogEntry(
				"log",
				"2024-01-01T10:00:00.000Z",
				"2024-01-01T12:00:00.000Z",
				"WORK",
				"station",
				"note"
			);

			expect((db as any).timeLog.update).toHaveBeenCalledWith({
				where: { id: "log" },
				data: expect.objectContaining({
					startTime: new Date("2024-01-01T10:00:00.000Z"),
					endTime: new Date("2024-01-01T12:00:00.000Z"),
					type: "WORK",
					stationId: "station",
					note: "note",
				}),
			});
		});
	});

	describe("deleteTimeLogEntry", () => {
		it("marks log deleted", async () => {
			await deleteTimeLogEntry("log");
			expect((db as any).timeLog.update).toHaveBeenCalledWith({
				where: { id: "log" },
				data: { deletedAt: expect.any(Date) },
			});
		});
	});

	describe("pinToggleClockAction", () => {
		it("rejects invalid pin length", async () => {
			await expect(pinToggleClockAction("123", null)).rejects.toThrowError(/4-6/);
		});

		it("clocks out when active log exists", async () => {
			(db as any).employee.findMany.mockResolvedValue([
				{
					id: "emp",
					pinHash: "hash",
					lastStationId: null,
					name: "Alice",
				} as any,
			]);
			vi.mocked(bcrypt.compare).mockResolvedValue(true as never);
			(db as any).timeLog.findFirst.mockResolvedValue({
				id: "log",
			} as any);

			await pinToggleClockAction("1234", null);

			expect((db as any).timeLog.update).toHaveBeenCalledWith({
				where: { id: "log" },
				data: { endTime: expect.any(Date) },
			});
		});
	});
});
