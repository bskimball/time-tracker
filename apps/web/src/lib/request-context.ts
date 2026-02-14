import { AsyncLocalStorage } from "node:async_hooks";
import { randomUUID } from "node:crypto";
import type { Logger } from "./logger";
import { createLogger } from "./logger";

interface RequestContext {
	request: Request;
	logger: Logger;
	requestId: string;
	cache: Map<string, unknown>;
}

const requestContext = new AsyncLocalStorage<RequestContext>();

/**
 * Get the current request from AsyncLocalStorage context
 * @returns Current request or undefined if not in request context
 */
export function getRequest(): Request | undefined {
	return requestContext.getStore()?.request;
}

/**
 * Get the request-scoped logger with automatic metadata
 * @returns Logger instance with request context
 */
export function getLogger(): Logger {
	const store = requestContext.getStore();
	if (!store) {
		// Fallback logger if outside request context (e.g., background jobs)
		return createLogger({ context: "no-request" });
	}
	return store.logger;
}

/**
 * Get the current request ID for correlation
 * @returns Request ID or undefined if not in request context
 */
export function getRequestId(): string | undefined {
	return requestContext.getStore()?.requestId;
}

/**
 * Read request-scoped memoized data
 * @param key - Cache key
 * @returns Cached value or undefined when missing/outside request context
 */
export function getRequestCacheValue<T>(key: string): T | undefined {
	return requestContext.getStore()?.cache.get(key) as T | undefined;
}

/**
 * Write request-scoped memoized data
 * @param key - Cache key
 * @param value - Value to cache for this request only
 */
export function setRequestCacheValue<T>(key: string, value: T): void {
	requestContext.getStore()?.cache.set(key, value);
}

/**
 * Delete request-scoped memoized data
 * @param key - Cache key
 */
export function deleteRequestCacheValue(key: string): void {
	requestContext.getStore()?.cache.delete(key);
}

/**
 * Run a callback within request context with automatic logging setup
 * @param request - The incoming request
 * @param callback - The function to execute within the request context
 * @returns Result of the callback
 */
export function runWithRequest<T>(
	request: Request,
	callback: () => T | Promise<T>
): T | Promise<T> {
	// Get or generate request ID
	const requestId = request.headers.get("x-request-id") || randomUUID();
	const url = new URL(request.url);

	// Create request-scoped logger with metadata
	const logger = createLogger({
		requestId,
		method: request.method,
		path: url.pathname,
		userAgent: request.headers.get("user-agent"),
	});

	const context: RequestContext = {
		request,
		logger,
		requestId,
		cache: new Map(),
	};

	const start = Date.now();
	logger.info({ query: url.search || undefined }, "Request started");

	return requestContext.run(context, async () => {
		try {
			const result = await callback();
			const durationMs = Date.now() - start;

			if (result instanceof Response) {
				const metadata = {
					status: result.status,
					durationMs,
				};

				if (result.status >= 500) {
					logger.error(metadata, "Request completed with server error");
				} else if (result.status >= 400) {
					logger.warn(metadata, "Request completed with client error");
				} else {
					logger.info(metadata, "Request completed");
				}
			} else {
				logger.info({ durationMs }, "Request completed");
			}

			return result;
		} catch (err) {
			logger.error({ err, durationMs: Date.now() - start }, "Request failed");
			throw err;
		}
	});
}
