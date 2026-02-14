import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockDb } from "~/__tests__/setup";
import { startSelfTaskAction } from "~/routes/time-clock/actions";
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
