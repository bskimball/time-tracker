import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockDb } from "~/__tests__/setup";
import { createEmployee, updateEmployee, deleteEmployee } from "~/routes/manager/employees/actions";

const { mockValidateRequest } = vi.hoisted(() => ({
	mockValidateRequest: vi.fn(),
}));

vi.mock("~/lib/auth", () => ({
	validateRequest: mockValidateRequest,
}));

describe("manager employee actions", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockValidateRequest.mockResolvedValue({
			user: { id: "manager-1", role: "MANAGER" },
		});
		mockDb.employee.findUnique.mockResolvedValue(null);
		mockDb.employee.findFirst.mockResolvedValue(null);
		mockDb.timeLog.findFirst.mockResolvedValue(null);
	});

	it("rejects createEmployee when request is unauthenticated", async () => {
		mockValidateRequest.mockResolvedValue({ user: null });

		await expect(
			createEmployee({
				name: "Unauth User",
				email: "unauth@example.com",
			})
		).rejects.toThrow("Unauthorized");
	});

	it("creates an employee with a hashed pin", async () => {
		mockDb.employee.create.mockResolvedValue({ id: "emp-1" });

		await createEmployee({
			name: "Alice Johnson",
			email: "alice@example.com",
			pin: "1234",
		});

		expect(mockDb.employee.create).toHaveBeenCalledWith(
			expect.objectContaining({
				data: expect.objectContaining({
					name: "Alice Johnson",
					email: "alice@example.com",
					pinHash: "$2b$10$hashedpassword",
				}),
			})
		);
	});

	it("updates an employee and clears pin hash when pin is emptied", async () => {
		mockDb.employee.update.mockResolvedValue({ id: "emp-1" });

		await updateEmployee("emp-1", {
			name: "Alice Updated",
			email: "alice.updated@example.com",
			pin: "",
		});

		expect(mockDb.employee.update).toHaveBeenCalledWith(
			expect.objectContaining({
				where: { id: "emp-1" },
				data: expect.objectContaining({
					name: "Alice Updated",
					email: "alice.updated@example.com",
					pinHash: null,
				}),
			})
		);
	});

	it("blocks deleting an employee who is currently clocked in", async () => {
		mockDb.timeLog.findFirst.mockResolvedValue({ id: "log-1" });

		await expect(deleteEmployee("emp-1")).rejects.toThrow(
			"Cannot delete employee with active time log"
		);
		expect(mockDb.employee.update).not.toHaveBeenCalled();
	});

	it("soft deletes employee by marking status terminated", async () => {
		await deleteEmployee("emp-1");

		expect(mockDb.employee.update).toHaveBeenCalledWith({
			where: { id: "emp-1" },
			data: {
				status: "TERMINATED",
				pinHash: null,
			},
		});
	});
});
