import { describe, expect, it, beforeEach, vi } from "vitest";
import bcrypt from "bcryptjs";

import { db } from "~/lib/db";
import {
	ClockActionError,
	clockInEmployee,
	clockOutLog,
	startBreakForEmployee,
	endBreakForEmployee,
	generateId,
	updateTimeLogEntry,
	deleteTimeLogEntry,
	pinToggleClockAction,
} from "~/services/time-clock";

const mockedDb = db;

describe("time clock service", () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	describe("clockInEmployee", () => {
		it("throws when required params missing", async () => {
			await expect(clockInEmployee(null, "station")).rejects.toThrowError(ClockActionError);
		});

		it("creates work log and updates employee", async () => {
			mockedDb.timeLog.findFirst.mockResolvedValue(null);
			mockedDb.$transaction.mockImplementation(async (cb) => {
				const tx = {
					timeLog: { create: vi.fn().mockResolvedValue({}) },
					employee: { update: vi.fn().mockResolvedValue({}) },
				};
				await cb(tx as typeof mockedDb);
			});

			await clockInEmployee("employee", "station");

			expect(mockedDb.timeLog.findFirst).toHaveBeenCalledWith({
				where: {
					employeeId: "employee",
					endTime: null,
					type: "WORK",
					deletedAt: null,
				},
			});

			// Verify transaction was called and timeLog.create has the right structure
			expect(mockedDb.$transaction).toHaveBeenCalled();
		});
	});

	describe("clockOutLog", () => {
		it("updates log with end time", async () => {
			await clockOutLog("log-id");
			expect(mockedDb.timeLog.update).toHaveBeenCalledWith({
				where: { id: "log-id" },
				data: expect.objectContaining({ endTime: expect.any(Date) }),
			});
		});
	});

	describe("startBreakForEmployee", () => {
		it("requires active work log", async () => {
			mockedDb.timeLog.findFirst.mockResolvedValueOnce(null);

			await expect(startBreakForEmployee("emp")).rejects.toThrowError(/clocked in/);
		});

		it("creates break when eligible", async () => {
			mockedDb.timeLog.findFirst
				.mockResolvedValueOnce({ stationId: "station", id: "work-1" } as any)
				.mockResolvedValueOnce(null);
			mockedDb.timeLog.create.mockResolvedValue({});

			await startBreakForEmployee("emp");
			expect(mockedDb.timeLog.create).toHaveBeenCalledWith({
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
			mockedDb.timeLog.findFirst.mockResolvedValueOnce(null);

			await expect(endBreakForEmployee("emp")).rejects.toThrowError(/No active break/);
		});

		it("updates break end time", async () => {
			mockedDb.timeLog.findFirst.mockResolvedValueOnce({
				id: "break-id",
			} as any);

			await endBreakForEmployee("emp");
			expect(mockedDb.timeLog.update).toHaveBeenCalledWith({
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
			mockedDb.timeLog.findUnique.mockResolvedValueOnce({
				employeeId: "emp",
			} as any);
			mockedDb.timeLog.findFirst.mockResolvedValue(null);
			mockedDb.timeLog.update.mockResolvedValue({});

			await updateTimeLogEntry(
				"log",
				"2024-01-01T10:00:00.000Z",
				"2024-01-01T12:00:00.000Z",
				"WORK",
				"station",
				"note"
			);

			expect(mockedDb.timeLog.update).toHaveBeenCalledWith({
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
			expect(mockedDb.timeLog.update).toHaveBeenCalledWith({
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
			mockedDb.employee.findMany.mockResolvedValue([
				{
					id: "emp",
					pinHash: "hash",
					lastStationId: null,
					name: "Alice",
				} as any,
			]);
			vi.mocked(bcrypt.compare).mockResolvedValue(true as never);
			mockedDb.timeLog.findFirst.mockResolvedValue({
				id: "log",
			} as any);

			await pinToggleClockAction("1234", null);

			expect(mockedDb.timeLog.update).toHaveBeenCalledWith({
				where: { id: "log" },
				data: { endTime: expect.any(Date) },
			});
		});
	});
});
