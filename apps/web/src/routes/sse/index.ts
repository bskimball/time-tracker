import { Hono } from "hono";

import managerStreamRoutes from "~/routes/sse/manager-stream";

const app = new Hono();

app.route("/sse", managerStreamRoutes);

export default app;
