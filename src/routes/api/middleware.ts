import type { Context, Next } from "hono";

const API_KEY_HEADER = "x-api-key";

export const authenticate = (expectedKey: string) => async (c: Context, next: Next) => {
	const provided = c.req.header(API_KEY_HEADER);
	if (!expectedKey || !provided || provided !== expectedKey) {
		return c.json({ success: false as const, error: "Unauthorized" }, 401);
	}
	await next();
};

export const requiredApiKey = () => {
	const expected = process.env.TIME_CLOCK_API_KEY ?? "";
	return authenticate(expected);
};
