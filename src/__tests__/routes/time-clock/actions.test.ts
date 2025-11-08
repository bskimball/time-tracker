import { describe, it, expect, beforeEach, vi } from "vitest";
import {
	clockIn,
	clockOut,
	startBreak,
	endBreak,
	updateTimeLog,
	deleteTimeLog,
	pinToggleClock,
} from "~/routes/time-clock/actions";
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

// Mock the service functions
vi.mock("~/services/time-clock", () => ({
	ClockActionError: class extends Error {},
	clockInEmployee: vi.fn(),
	clockOutLog: vi.fn(),
	startBreakForEmployee: vi.fn(),
	endBreakForEmployee: vi.fn(),
	updateTimeLogEntry: vi.fn(),
	deleteTimeLogEntry: vi.fn(),
	pinToggleClockAction: vi.fn(),
}));

describe("Server Actions", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("clockIn action", () => {
		it("successfully clocks in employee", async () => {
			const formData = new FormData();
			formData.append("employeeId", "emp-1");
			formData.append("stationId", "station-1");

			vi.mocked(clockInEmployee).mockResolvedValue({
				message: "Clocked in successfully",
			});

			const result = await clockIn(null, formData);

			expect(clockInEmployee).toHaveBeenCalledWith("emp-1", "station-1");
			expect(result).toEqual({ success: true });
		});

		it("handles clock in errors", async () => {
			const formData = new FormData();
			formData.append("employeeId", "emp-1");
			formData.append("stationId", "station-1");

			vi.mocked(clockInEmployee).mockRejectedValue(new ClockActionError("Already clocked in"));

			const result = await clockIn(null, formData);

			expect(result).toEqual({ error: "Already clocked in" });
		});

		it("handles non-ClockActionError errors", async () => {
			const formData = new FormData();
			formData.append("employeeId", "emp-1");
			formData.append("stationId", "station-1");

			vi.mocked(clockInEmployee).mockRejectedValue(new Error("Database error"));

			await expect(clockIn(null, formData)).rejects.toThrow("Database error");
		});
	});

	describe("clockOut action", () => {
		it("successfully clocks out employee", async () => {
			const formData = new FormData();
			formData.append("logId", "log-1");

			vi.mocked(clockOutLog).mockResolvedValue({
				message: "Clocked out successfully",
			});

			const result = await clockOut(null, formData);

			expect(clockOutLog).toHaveBeenCalledWith("log-1");
			expect(result).toEqual({ success: true });
		});

		it("handles clock out errors", async () => {
			const formData = new FormData();
			formData.append("logId", "log-1");

			vi.mocked(clockOutLog).mockRejectedValue(new ClockActionError("No active session"));

			const result = await clockOut(null, formData);

			expect(result).toEqual({ error: "No active session" });
		});
	});

	describe("startBreak action", () => {
		it("successfully starts break", async () => {
			const formData = new FormData();
			formData.append("employeeId", "emp-1");

			vi.mocked(startBreakForEmployee).mockResolvedValue({
				message: "Break started",
			});

			const result = await startBreak(null, formData);

			expect(startBreakForEmployee).toHaveBeenCalledWith("emp-1");
			expect(result).toEqual({ success: true });
		});

		it("handles start break errors", async () => {
			const formData = new FormData();
			formData.append("employeeId", "emp-1");

			vi.mocked(startBreakForEmployee).mockRejectedValue(
				new ClockActionError("Must be clocked in")
			);

			const result = await startBreak(null, formData);

			expect(result).toEqual({ error: "Must be clocked in" });
		});
	});

	describe("endBreak action", () => {
		it("successfully ends break", async () => {
			const formData = new FormData();
			formData.append("employeeId", "emp-1");

			vi.mocked(endBreakForEmployee).mockResolvedValue({
				message: "Break ended",
			});

			const result = await endBreak(null, formData);

			expect(endBreakForEmployee).toHaveBeenCalledWith("emp-1");
			expect(result).toEqual({ success: true });
		});

		it("handles end break errors", async () => {
			const formData = new FormData();
			formData.append("employeeId", "emp-1");

			vi.mocked(endBreakForEmployee).mockRejectedValue(new ClockActionError("No active break"));

			const result = await endBreak(null, formData);

			expect(result).toEqual({ error: "No active break" });
		});
	});

	describe("updateTimeLog action", () => {
		it("successfully updates time log", async () => {
			const formData = new FormData();
			formData.append("logId", "log-1");
			formData.append("startTime", "2024-01-01T09:00:00.000Z");
			formData.append("endTime", "2024-01-01T17:00:00.000Z");
			formData.append("type", "WORK");
			formData.append("stationId", "station-1");
			formData.append("note", "Updated log");

			vi.mocked(updateTimeLogEntry).mockResolvedValue({
				message: "Time log updated",
			});

			const result = await updateTimeLog(null, formData);

			expect(updateTimeLogEntry).toHaveBeenCalledWith(
				"log-1",
				"2024-01-01T09:00:00.000Z",
				"2024-01-01T17:00:00.000Z",
				"WORK",
				"station-1",
				"Updated log"
			);
			expect(result).toEqual({ success: true });
		});

		it("handles update errors", async () => {
			const formData = new FormData();
			formData.append("logId", "log-1");
			formData.append("startTime", "2024-01-01T09:00:00.000Z");

			vi.mocked(updateTimeLogEntry).mockRejectedValue(new ClockActionError("Overlapping session"));

			const result = await updateTimeLog(null, formData);

			expect(result).toEqual({ error: "Overlapping session" });
		});
	});

	describe("deleteTimeLog action", () => {
		it("successfully deletes time log", async () => {
			const formData = new FormData();
			formData.append("logId", "log-1");

			vi.mocked(deleteTimeLogEntry).mockResolvedValue({
				message: "Time log deleted",
			});

			const result = await deleteTimeLog(null, formData);

			expect(deleteTimeLogEntry).toHaveBeenCalledWith("log-1");
			expect(result).toEqual({ success: true });
		});

		it("handles delete errors", async () => {
			const formData = new FormData();
			formData.append("logId", "log-1");

			vi.mocked(deleteTimeLogEntry).mockRejectedValue(new ClockActionError("Log not found"));

			const result = await deleteTimeLog(null, formData);

			expect(result).toEqual({ error: "Log not found" });
		});
	});

	describe("pinToggleClock action", () => {
		it("successfully toggles clock with PIN", async () => {
			const formData = new FormData();
			formData.append("pin", "1234");
			formData.append("stationId", "station-1");

			vi.mocked(pinToggleClockAction).mockResolvedValue({
				message: "Alice Johnson clocked in successfully",
			});

			const result = await pinToggleClock(null, formData);

			expect(pinToggleClockAction).toHaveBeenCalledWith("1234", "station-1");
			expect(result).toEqual({
				success: true,
				message: "Alice Johnson clocked in successfully",
			});
		});

		it("handles PIN action errors", async () => {
			const formData = new FormData();
			formData.append("pin", "1234");

			vi.mocked(pinToggleClockAction).mockRejectedValue(new ClockActionError("Invalid PIN"));

			const result = await pinToggleClock(null, formData);

			expect(result).toEqual({ error: "Invalid PIN" });
		});
	});
});
