import { expect } from "vitest";

// Custom assertion helpers for better test readability
export const assertValidEmployee = (employee: any, expectedEmail?: string) => {
	expect(employee.id).toBeDefined();
	expect(employee.name).toBeTruthy();
	expect(employee.email).toMatch(/@.*\./); // Basic email validation
	if (expectedEmail) {
		expect(employee.email).toBe(expectedEmail);
	}
	expect(typeof employee.dailyHoursLimit).toBe("number");
	expect(typeof employee.weeklyHoursLimit).toBe("number");
	expect(employee.createdAt).toBeInstanceOf(Date);
};

export const assertValidTimeLog = (timeLog: any, expectedType?: string) => {
	expect(timeLog.id).toBeDefined();
	expect(timeLog.employeeId).toBeDefined();
	expect(["WORK", "BREAK"]).toContain(timeLog.type);
	if (expectedType && expectedType !== "any") {
		expect(timeLog.type).toBe(expectedType);
	}
	expect(timeLog.startTime).toBeInstanceOf(Date);
	if (timeLog.endTime !== null) {
		expect(timeLog.endTime).toBeInstanceOf(Date);
	}
	expect(timeLog.createdAt).toBeInstanceOf(Date);
	expect(timeLog.updatedAt).toBeInstanceOf(Date);
};

export const assertValidSession = (session: any) => {
	expect(session.id).toBeDefined();
	expect(session.userId).toBeDefined();
	expect(session.expiresAt).toBeInstanceOf(Date);
	expect(session.createdAt).toBeInstanceOf(Date);
	expect(session.expiresAt.getTime()).toBeGreaterThan(Date.now());
};

export const assertValidUser = (user: any, expectedRole?: string) => {
	expect(user.id).toBeDefined();
	expect(user.email).toMatch(/@.*\./);
	expect(user.createdAt).toBeInstanceOf(Date);
	expect(user.updatedAt).toBeInstanceOf(Date);
	expect(["ADMIN", "MANAGER", "WORKER"]).toContain(user.role);
	if (expectedRole) {
		expect(user.role).toBe(expectedRole);
	}
};

export const assertValidStation = (station: any) => {
	expect(station.id).toBeDefined();
	expect(station.name).toBeDefined();
	expect(["PICKING", "PACKING", "FILLING"]).toContain(station.name);
	expect(station.createdAt).toBeInstanceOf(Date);
};

export const assertValidTodo = (todo: any) => {
	expect(todo.id).toBeDefined();
	expect(todo.title).toBeTruthy();
	expect(typeof todo.completed).toBe("boolean");
	expect(todo.createdAt).toBeInstanceOf(Date);
	expect(todo.updatedAt).toBeInstanceOf(Date);
};

// Database operation assertions
export const assertDatabaseCalled = (
	mockDb: any,
	operation: string,
	table: string,
	expectedArgs?: any
) => {
	expect(mockDb[table][operation]).toHaveBeenCalled();
	if (expectedArgs !== undefined) {
		expect(mockDb[table][operation]).toHaveBeenCalledWith(expectedArgs);
	}
};

export const assertDatabaseNotCalled = (mockDb: any, operation: string, table: string) => {
	expect(mockDb[table][operation]).not.toHaveBeenCalled();
};

// API response assertions
export const assertSuccessResponse = (response: any, expectedData?: any) => {
	expect(response.success).toBe(true);
	if (expectedData !== undefined) {
		expect(response.data).toEqual(expectedData);
	}
};

export const assertErrorResponse = (response: any, expectedError?: string) => {
	expect(response.success).toBe(false);
	expect(response.error).toBeDefined();
	if (expectedError) {
		expect(response.error).toBe(expectedError);
	}
};

// HTTP status assertions
export const assertHttpStatus = (response: Response, expectedStatus: number) => {
	expect(response.status).toBe(expectedStatus);
};

export const assertHttpSuccess = (response: Response) => {
	expect(response.status).toBeGreaterThanOrEqual(200);
	expect(response.status).toBeLessThan(300);
};

export const assertHttpError = (response: Response, expectedStatus?: number) => {
	expect(response.status).toBeGreaterThanOrEqual(400);
	if (expectedStatus) {
		expect(response.status).toBe(expectedStatus);
	}
};

// Time-based assertions
export const assertTimeRange = (
	startTime: Date,
	endTime: Date | null,
	expectedMinDuration?: number
) => {
	expect(startTime).toBeInstanceOf(Date);
	if (endTime !== null) {
		expect(endTime).toBeInstanceOf(Date);
		expect(endTime.getTime()).toBeGreaterThan(startTime.getTime());

		if (expectedMinDuration !== undefined) {
			const durationMs = endTime.getTime() - startTime.getTime();
			expect(durationMs).toBeGreaterThanOrEqual(expectedMinDuration * 60 * 1000); // Convert minutes to ms
		}
	}
};

export const assertNoOverlap = (logs: any[]) => {
	// Assert that work logs don't overlap for the same employee
	const workLogs = logs.filter((log) => log.type === "WORK");

	for (let i = 0; i < workLogs.length; i++) {
		for (let j = i + 1; j < workLogs.length; j++) {
			const log1 = workLogs[i];
			const log2 = workLogs[j];

			if (log1.employeeId === log2.employeeId) {
				const start1 = log1.startTime.getTime();
				const end1 = log1.endTime ? log1.endTime.getTime() : Date.now();
				const start2 = log2.startTime.getTime();
				const end2 = log2.endTime ? log2.endTime.getTime() : Date.now();

				// Check for overlap
				const overlap = !(end1 <= start2 || end2 <= start1);
				expect(overlap).toBe(false);
			}
		}
	}
};

// Component rendering assertions
export const assertComponentRenders = (component: any) => {
	expect(component).toBeDefined();
	expect(component.type).toBeDefined();
};

export const assertContainsText = (container: any, text: string) => {
	expect(container.textContent).toContain(text);
};

export const assertNotContainsText = (container: any, text: string) => {
	expect(container.textContent).not.toContain(text);
};

// Form validation assertions
export const assertFormValid = (formData: FormData, requiredFields: string[]) => {
	for (const field of requiredFields) {
		expect(formData.get(field)).toBeTruthy();
	}
};

export const assertFormInvalid = (formData: FormData, requiredFields: string[]) => {
	for (const field of requiredFields) {
		expect(formData.get(field) || "").toBeFalsy();
	}
};
