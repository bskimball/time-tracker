import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockDb } from "~/__tests__/setup";
import { assignTaskAction, setTaskTypeActiveStateAction } from "~/routes/manager/tasks/actions";

const { mockValidateRequest } = vi.hoisted(() => ({
	mockValidateRequest: vi.fn(),
}));

vi.mock("~/lib/auth", () => ({
	validateRequest: mockValidateRequest,
}));

vi.mock("~/lib/manager-realtime", () => ({
	publishManagerRealtimeEvent: vi.fn(),
}));

describe("manager task actions", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockValidateRequest.mockResolvedValue({
			user: { id: "manager-1", role: "MANAGER" },
		});
		mockDb.taskAssignment.findMany.mockResolvedValue([]);
	});

	it("returns a validation error when assignTaskAction is missing required fields", async () => {
		const formData = new FormData();

		const result = await assignTaskAction(null, formData);

		expect(result).toEqual({
			error: "Employee and task type are required",
			success: false,
		});
	});

	it("returns a permission error when a non-manager role assigns tasks", async () => {
		mockValidateRequest.mockResolvedValue({
			user: { id: "worker-1", role: "WORKER" },
		});

		const formData = new FormData();
		formData.set("employeeId", "emp-1");
		formData.set("taskTypeId", "task-1");

		const result = await assignTaskAction(null, formData);

		expect(result).toEqual({
			error: "Only manager roles can assign tasks",
			success: false,
		});
		expect(mockDb.$transaction).not.toHaveBeenCalled();
	});

	it("prevents task type deactivation while active assignments exist", async () => {
		mockDb.taskAssignment.count.mockResolvedValue(2);

		const formData = new FormData();
		formData.set("taskTypeId", "task-1");
		formData.set("isActive", "false");

		const result = await setTaskTypeActiveStateAction(null, formData);

		expect(result.success).toBe(false);
		expect(result.error).toContain(
			"Cannot deactivate this task type while it has active assignments"
		);
		expect(mockDb.taskType.update).not.toHaveBeenCalled();
	});

	it("updates task type state when activation request is valid", async () => {
		mockDb.taskType.update.mockResolvedValue({
			id: "task-1",
			name: "Packing",
			isActive: true,
			Station: { id: "station-1", name: "PACKING" },
		});

		const formData = new FormData();
		formData.set("taskTypeId", "task-1");
		formData.set("isActive", "true");

		const result = await setTaskTypeActiveStateAction(null, formData);

		expect(result.success).toBe(true);
		expect(mockDb.taskType.update).toHaveBeenCalledWith(
			expect.objectContaining({
				where: { id: "task-1" },
				data: { isActive: true },
			})
		);
	});
});
