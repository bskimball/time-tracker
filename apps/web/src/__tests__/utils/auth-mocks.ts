import { vi } from "vitest";
import type { Session, User, User_role } from "@prisma/client";

// Mock user for testing
export const mockUser: User = {
	id: "user-1",
	email: "test@example.com",
	name: "Test User",
	image: null,
	role: "WORKER" as User_role,
	employeeId: "emp-1",
	createdAt: new Date("2024-01-01T00:00:00Z"),
	updatedAt: new Date("2024-01-01T00:00:00Z"),
};

// Mock session for testing
export const mockSession: Session = {
	id: "session-1",
	userId: "user-1",
	expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
	createdAt: new Date("2024-01-01T00:00:00Z"),
};

// Mock auth functions
export const mockRequireUser = vi.fn(() => Promise.resolve(mockUser));
export const mockRequireRole = vi.fn((roles: User_role[]) => {
	if (!roles.includes(mockUser.role)) {
		throw new Response("Forbidden", { status: 403 });
	}
	return Promise.resolve(mockUser);
});

export const mockValidateRequest = vi.fn(() => ({
	session: mockSession,
	user: mockUser,
}));

export const mockGenerateSessionToken = vi.fn(() => "mock-session-token");
export const mockCreateSession = vi.fn(() => Promise.resolve(mockSession));
export const mockValidateSessionToken = vi.fn(() =>
	Promise.resolve({
		session: mockSession,
		user: mockUser,
	})
);
