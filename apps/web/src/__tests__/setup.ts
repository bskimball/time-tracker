import { vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import { createMockDb } from "./utils/db-mocks";

// Mock environment variables that aren't available in test
process.env.NODE_ENV = "test";
process.env.DATABASE_URL = "mysql://mock-db";

// Create mock db instance
export const mockDb = createMockDb();

// Mock bcryptjs
vi.mock("bcryptjs", () => ({
	default: {
		compare: vi.fn(() => Promise.resolve(true)),
		hash: vi.fn(() => Promise.resolve("$2b$10$hashedpassword")),
	},
}));

// Mock db globally with proper factory function
vi.mock("~/lib/db", () => ({
	db: mockDb,
}));

// Mock crypto.randomUUID if not available
if (typeof globalThis.crypto === "undefined" || !globalThis.crypto.randomUUID) {
	Object.defineProperty(globalThis, "crypto", {
		value: {
			randomUUID: vi.fn(() => "mock-uuid"),
		},
	});
}

// Mock fetch for API calls
global.fetch = vi.fn();

// Mock localStorage
const localStorageMock = {
	getItem: vi.fn(() => null),
	setItem: vi.fn(),
	removeItem: vi.fn(),
	clear: vi.fn(),
};
Object.defineProperty(window, "localStorage", {
	value: localStorageMock,
});

// Mock navigator online status
Object.defineProperty(navigator, "onLine", {
	writable: true,
	value: true,
});

// Mock WebKit/Safari user-agent detection for client vs server component testing
Object.defineProperty(navigator, "userAgent", {
	writable: true,
	value: "Mozilla/5.0 (Test Environment)",
});
