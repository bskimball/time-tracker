import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockDb } from "~/__tests__/setup";
import { updateOperationalConfig } from "~/routes/settings/operational-config/actions";

const {
	mockValidateRequest,
	mockEnsureOperationalConfigSeeded,
	mockGetOperationalConfigEntries,
	mockGetOperationalConfigDefinition,
} = vi.hoisted(() => ({
	mockValidateRequest: vi.fn(),
	mockEnsureOperationalConfigSeeded: vi.fn(),
	mockGetOperationalConfigEntries: vi.fn(),
	mockGetOperationalConfigDefinition: vi.fn(),
}));

vi.mock("~/lib/auth", () => ({
	validateRequest: mockValidateRequest,
}));

vi.mock("~/lib/operational-config", () => ({
	OPERATIONAL_CONFIG_KEYS: ["TASK_ASSIGNMENT_MODE"],
	ensureOperationalConfigSeeded: mockEnsureOperationalConfigSeeded,
	getOperationalConfigEntries: mockGetOperationalConfigEntries,
	getOperationalConfigDefinition: mockGetOperationalConfigDefinition,
}));

describe("updateOperationalConfig", () => {
	beforeEach(() => {
		vi.clearAllMocks();

		mockValidateRequest.mockResolvedValue({
			user: { id: "admin-1", role: "ADMIN" },
		});
		mockEnsureOperationalConfigSeeded.mockResolvedValue(undefined);
		mockGetOperationalConfigEntries.mockResolvedValue([
			{
				key: "TASK_ASSIGNMENT_MODE",
				value: "SELF_ASSIGN_ALLOWED",
				description: "Task assignment mode",
			},
		]);
		mockGetOperationalConfigDefinition.mockReturnValue({
			key: "TASK_ASSIGNMENT_MODE",
			value: "MANAGER_ONLY",
			description: "Task assignment mode",
			validation: {
				type: "enum",
				options: ["MANAGER_ONLY", "SELF_ASSIGN_ALLOWED", "SELF_ASSIGN_REQUIRED"],
				defaultValue: "MANAGER_ONLY",
				unit: "mode",
			},
		});
		mockDb.$executeRaw.mockResolvedValue(1);
	});

	it("rejects invalid TASK_ASSIGNMENT_MODE values", async () => {
		const formData = new FormData();
		formData.set("key", "TASK_ASSIGNMENT_MODE");
		formData.set("value", "INVALID_MODE");

		const result = await updateOperationalConfig(null, formData);

		expect(result).toEqual({
			error: "Value must be one of: MANAGER_ONLY, SELF_ASSIGN_ALLOWED, SELF_ASSIGN_REQUIRED",
		});
		expect(mockDb.$executeRaw).not.toHaveBeenCalled();
	});

	it("accepts valid TASK_ASSIGNMENT_MODE values and returns refreshed entries", async () => {
		const formData = new FormData();
		formData.set("key", "TASK_ASSIGNMENT_MODE");
		formData.set("value", "SELF_ASSIGN_ALLOWED");

		const result = await updateOperationalConfig(null, formData);

		expect(mockDb.$executeRaw).toHaveBeenCalledTimes(1);
		expect(result?.success).toBe(true);
		expect(result?.entries).toEqual([
			{
				key: "TASK_ASSIGNMENT_MODE",
				value: "SELF_ASSIGN_ALLOWED",
				description: "Task assignment mode",
				validation: {
					type: "enum",
					options: ["MANAGER_ONLY", "SELF_ASSIGN_ALLOWED", "SELF_ASSIGN_REQUIRED"],
					defaultValue: "MANAGER_ONLY",
					unit: "mode",
				},
			},
		]);
	});
});
