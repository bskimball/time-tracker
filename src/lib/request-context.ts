import { AsyncLocalStorage } from "node:async_hooks";

// Create an AsyncLocalStorage to store the request context
const requestContext = new AsyncLocalStorage<Request>();

export function getRequest(): Request | undefined {
	return requestContext.getStore();
}

export function runWithRequest<T>(request: Request, callback: () => T): T {
	return requestContext.run(request, callback);
}
