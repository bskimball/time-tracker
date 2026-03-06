import { beforeEach, describe, expect, it, vi } from "vitest";
import bcrypt from "bcryptjs";
import { mockDb } from "~/__tests__/setup";
import {
	clockIn,
	startSelfTaskAction,
	checkPinStatus,
	pinToggleClock,
} from "~/routes/time-clock/actions";
import type { TaskAssignmentMode } from "~/lib/task-assignment-permissions";

const { mockValidateRequest, mockGetTaskAssignmentMode } = vi.hoisted(() => ({
	mockValidateRequest: vi.fn(),
	mockGetTaskAssignmentMode: vi.fn(),
}));

vi.mock("~/lib/auth", () => ({
	validateRequest: mockValidateRequest,
}));

vi.mock("~/lib/operational-config", () => ({
	getTaskAssignmentMode: mockGetTaskAssignmentMode,
}));

vi.mock("~/lib/ensure-operational-data", () => ({
	ensureOperationalDataSeeded: vi.fn(() => Promise.resolve()),
}));

const mockedBcrypt = vi.mocked(bcrypt);

describe("startSelfTaskAction", () => {
	beforeEach(() => {
		vi.clearAllMocks();

		mockValidateRequest.mockResolvedValue({
			user: { id: "worker-user-1", role: "WORKER", employeeId: "emp-1" },
		});
		mockGetTaskAssignmentMode.mockResolvedValue("SELF_ASSIGN_ALLOWED");

		mockDb.employee.findUnique.mockResolvedValue({ id: "emp-1", status: "ACTIVE" });
		mockDb.taskType.findUnique.mockResolvedValue({
			id: "task-1",
			isActive: true,
			name: "Picking",
		});
		mockDb.timeLog.findFirst.mockResolvedValue({ id: "log-1" });
		mockDb.taskAssignment.findMany.mockResolvedValue([]);
		mockDb.taskAssignment.create.mockResolvedValue({ id: "assign-1" });
		mockedBcrypt.compare.mockImplementation(async () => true);
	});

	it("blocks worker self-assignment when mode is MANAGER_ONLY", async () => {
		mockGetTaskAssignmentMode.mockResolvedValue("MANAGER_ONLY");

		const formData = new FormData();
		formData.set("taskTypeId", "task-1");

		const result = await startSelfTaskAction(null, formData);

		expect(result).toEqual({
			success: false,
			error: "Worker self-assignment is disabled",
		});
		expect(mockDb.employee.findUnique).not.toHaveBeenCalled();
		expect(mockDb.taskAssignment.create).not.toHaveBeenCalled();
	});

	it.each(["SELF_ASSIGN_ALLOWED", "SELF_ASSIGN_REQUIRED"] as TaskAssignmentMode[])(
		"creates WORKER-sourced assignment when mode is %s",
		async (mode) => {
			mockGetTaskAssignmentMode.mockResolvedValue(mode);

			const formData = new FormData();
			formData.set("taskTypeId", "task-1");
			formData.set("notes", "  starting task  ");

			const result = await startSelfTaskAction(null, formData);

			expect(result).toEqual({
				success: true,
				message: "Started task: Picking",
			});
			expect(mockDb.taskAssignment.create).toHaveBeenCalledWith({
				data: {
					employeeId: "emp-1",
					taskTypeId: "task-1",
					source: "WORKER",
					notes: "starting task",
					startTime: expect.any(Date),
				},
			});
		}
	);
});

describe("floor action scoping", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockValidateRequest.mockResolvedValue({
			user: { id: "worker-user-1", role: "WORKER", employeeId: "emp-1" },
		});
	});

	it("blocks worker clock-in attempts for other employees", async () => {
		const formData = new FormData();
		formData.set("employeeId", "emp-2");
		formData.set("stationId", "station-1");

		const result = await clockIn(null, formData);

		expect(result).toEqual({
			success: false,
			error: "Workers can only perform floor actions for themselves",
		});
		expect(mockDb.employee.findUnique).not.toHaveBeenCalled();
	});

	it("allows non-worker sessions to clock in selected employees", async () => {
		mockValidateRequest.mockResolvedValue({
			user: { id: "manager-user-1", role: "MANAGER" },
		});
		mockDb.employee.findUnique.mockResolvedValue({ id: "emp-1", status: "ACTIVE", name: "Alice" });
		mockDb.station.findUnique.mockResolvedValue(null);
		mockDb.timeLog.findFirst.mockResolvedValue(null);

		const formData = new FormData();
		formData.set("employeeId", "  emp-1  ");
		formData.set("stationId", "station-1");

		const result = await clockIn(null, formData);

		expect(result).toEqual({
			success: false,
			error: "Station is not available",
		});
		expect(mockDb.employee.findUnique).toHaveBeenCalledWith({ where: { id: "emp-1" } });
	});

	it("treats whitespace-only employee id as missing", async () => {
		mockValidateRequest.mockResolvedValue({
			user: { id: "manager-user-1", role: "MANAGER" },
		});

		const formData = new FormData();
		formData.set("employeeId", "   ");
		formData.set("stationId", "station-1");

		const result = await clockIn(null, formData);

		expect(result).toEqual({
			success: false,
			error: "Employee is required",
		});
		expect(mockDb.employee.findUnique).not.toHaveBeenCalled();
	});
});

describe("pin-based clock actions", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockValidateRequest.mockResolvedValue({
			user: { id: "manager-user-1", role: "MANAGER" },
		});
		mockDb.employee.findFirst.mockResolvedValue({
			id: "emp-1",
			name: "Alice",
			status: "ACTIVE",
			employeeCode: "ABC123",
			pinHash: "$2b$10$hash",
			lastStationId: "station-1",
			defaultStationId: "station-2",
		});
		mockDb.timeLog.findFirst.mockResolvedValue(null);
		mockDb.station.findUnique.mockResolvedValue({
			id: "station-1",
			name: "PICKING",
			isActive: true,
		});
		mockedBcrypt.compare.mockImplementation(async () => true);
	});

	it("requires employee code when checking pin status", async () => {
		const formData = new FormData();
		formData.set("pin", "1234");

		const result = await checkPinStatus(null, formData);

		expect(result).toEqual({
			success: false,
			error: "Employee code is required",
		});
		expect(mockDb.employee.findFirst).not.toHaveBeenCalled();
	});

	it("rejects invalid employee code and pin combinations", async () => {
		mockDb.employee.findFirst.mockResolvedValue(null);

		const formData = new FormData();
		formData.set("employeeCode", "abc123");
		formData.set("pin", "1234");

		const result = await checkPinStatus(null, formData);

		expect(result).toEqual({
			success: false,
			error: "Invalid employee code or PIN",
		});
		expect(mockDb.employee.findFirst).toHaveBeenCalledWith({
			where: {
				employeeCode: "ABC123",
				status: "ACTIVE",
				pinHash: { not: null },
			},
		});
	});

	it("checks pin status for the specified employee code", async () => {
		mockDb.timeLog.findFirst.mockResolvedValue({ id: "log-1", stationId: "station-1" });

		const formData = new FormData();
		formData.set("employeeCode", "abc123");
		formData.set("pin", "1234");

		const result = await checkPinStatus(null, formData);

		expect(result).toEqual({
			success: true,
			employeeId: "emp-1",
			employeeName: "Alice",
			isClockedIn: true,
			lastStationId: "station-1",
			defaultStationId: "station-2",
			employeeCode: "ABC123",
			pin: "1234",
		});
	});

	it("requires employee code when toggling clock state with pin", async () => {
		const formData = new FormData();
		formData.set("pin", "1234");

		const result = await pinToggleClock(null, formData);

		expect(result).toEqual({
			success: false,
			error: "Employee code is required",
		});
	});

	it("clocks in using employee code and pin", async () => {
		mockDb.$transaction.mockImplementation(async (callback) => callback(mockDb));

		const formData = new FormData();
		formData.set("employeeCode", "abc123");
		formData.set("pin", "1234");

		const result = await pinToggleClock(null, formData);

		expect(mockDb.employee.findFirst).toHaveBeenCalledWith({
			where: {
				employeeCode: "ABC123",
				status: "ACTIVE",
				pinHash: { not: null },
			},
			include: {
				lastStation: true,
				defaultStation: true,
			},
		});
		expect(result).toEqual({
			success: true,
			message: "Alice clocked in at PICKING",
		});
	});
});
