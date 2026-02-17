import { Hono } from "hono";
import { pinoLogger } from "hono-pino";

import { logger } from "~/lib/logger";
import managerStreamRoutes from "~/routes/sse/manager-stream";

const app = new Hono();

// @ts-expect-error - hono-pino types may not align perfectly with Hono generic defaults
app.use("*", pinoLogger({ logger }));

app.route("/sse", managerStreamRoutes);

export default app;
