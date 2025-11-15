import { AsyncLocalStorage } from "node:async_hooks";

const requestContext = new AsyncLocalStorage<Request>();

export function getRequest(): Request | undefined {
	return requestContext.getStore();
}

export function runWithRequest<T>(request: Request, callback: () => T | Promise<T>): T | Promise<T> {
	return requestContext.run(request, callback);
}
