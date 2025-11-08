import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { z } from "zod";

const app = new OpenAPIHono();

app.openapi(
	createRoute({
		method: "get",
		path: "/health",
		responses: {
			200: {
				content: {
					"application/json": {
						schema: z.object({ status: z.string() }),
					},
				},
				description: "Health check",
			},
		},
	}),
	(c) => c.json({ status: "ok" })
);

export default app;
