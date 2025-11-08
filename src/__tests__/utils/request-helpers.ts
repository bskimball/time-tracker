// Helper functions for creating mock requests and responses
export const createMockRequest = (
	url: string,
	options: {
		method?: string;
		headers?: Record<string, string>;
		body?: string;
		cookies?: Record<string, string>;
	} = {}
): Request => {
	const headers = new Headers(options.headers || {});

	// Add cookies to headers if provided
	if (options.cookies) {
		const cookieString = Object.entries(options.cookies)
			.map(([key, value]) => `${key}=${value}`)
			.join("; ");
		headers.set("Cookie", cookieString);
	}

	return new Request(url, {
		method: options.method || "GET",
		headers,
		body: options.body,
	});
};

export const createMockFormData = (data: Record<string, string | null>): FormData => {
	const formData = new FormData();
	Object.entries(data).forEach(([key, value]) => {
		if (value !== null) {
			formData.append(key, value);
		}
	});
	return formData;
};

export const createMockResponse = (
	body: any,
	options: {
		status?: number;
		statusText?: string;
		headers?: Record<string, string>;
	} = {}
): Response => {
	const headers = new Headers(options.headers);
	headers.set("Content-Type", "application/json");

	return new Response(JSON.stringify(body), {
		status: options.status || 200,
		statusText: options.statusText || "OK",
		headers,
	});
};

// Helper for testing streaming responses
export class MockReadableStream {
	private chunks: string[] = [];
	private completed = false;

	addChunk(chunk: string) {
		this.chunks.push(chunk);
	}

	complete() {
		this.completed = true;
	}

	async getReader(): Promise<any> {
		return {
			read: async () => {
				if (this.chunks.length > 0) {
					return {
						done: false,
						value: this.chunks.shift()!,
					};
				}
				if (this.completed) {
					return {
						done: true,
						value: "",
					};
				}
				// Wait for more chunks
				await new Promise((resolve) => (global as any).setTimeout(resolve, 10));
				return this.read();
			},
			releaseLock: () => {},
		} as any;
	}
}

export const createMockReadableStream = (chunks: string[]): any => {
	const stream = new MockReadableStream();
	chunks.forEach((chunk) => stream.addChunk(chunk));
	stream.complete();
	return stream as any;
};

// Helper for testing database transactions
export const mockTransaction = <T>(
	operations: Promise<T>,
	callback: (tx: any) => Promise<T>
): Promise<T> => {
	const { vi } = await import("vitest");
	return callback({
		employee: {
			create: vi.fn(),
			update: vi.fn(),
			delete: vi.fn(),
			findMany: vi.fn(),
			findUnique: vi.fn(),
			findFirst: vi.fn(),
			count: vi.fn(),
		},
		station: {
			create: vi.fn(),
			update: vi.fn(),
			delete: vi.fn(),
			findMany: vi.fn(),
			findUnique: vi.fn(),
			findFirst: vi.fn(),
			count: vi.fn(),
		},
		timeLog: {
			create: vi.fn(),
			update: vi.fn(),
			delete: vi.fn(),
			findMany: vi.fn(),
			findUnique: vi.fn(),
			findFirst: vi.fn(),
			count: vi.fn(),
		},
		todo: {
			create: vi.fn(),
			update: vi.fn(),
			delete: vi.fn(),
			findMany: vi.fn(),
			findUnique: vi.fn(),
			findFirst: vi.fn(),
			count: vi.fn(),
		},
		user: {
			create: vi.fn(),
			update: vi.fn(),
			delete: vi.fn(),
			findMany: vi.fn(),
			findUnique: vi.fn(),
			findFirst: vi.fn(),
			count: vi.fn(),
		},
		session: {
			create: vi.fn(),
			update: vi.fn(),
			delete: vi.fn(),
			findMany: vi.fn(),
			findUnique: vi.fn(),
			findFirst: vi.fn(),
			count: vi.fn(),
		},
	});
};

// Helper for testing authentication flows
export const createMockSession = (overrides: Partial<any> = {}) => ({
	id: "session-123",
	userId: "user-123",
	expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
	createdAt: new Date(),
	...overrides,
});

export const createMockUser = (overrides: Partial<any> = {}) => ({
	id: "user-123",
	email: "test@example.com",
	name: "Test User",
	image: null,
	role: "WORKER",
	employeeId: "emp-123",
	createdAt: new Date(),
	updatedAt: new Date(),
	...overrides,
});

// Helper for testing RSC rendering
export const mockRSCEnvironment = () => {
	const originalFetch = global.fetch;
	const originalCrypto = global.crypto;

	// Mock fetch for RSC requests
	const { vi } = await import("vitest");
	global.fetch = vi.fn();

	// Mock crypto for UUID generation
	global.crypto = {
		...originalCrypto,
		randomUUID: vi.fn(() => "mock-uuid-" + Math.random().toString(36).slice(2)),
	};

	return {
		restore: () => {
			global.fetch = originalFetch;
			global.crypto = originalCrypto;
		},
	};
};
