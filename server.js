import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { Hono } from "hono";
import { compress } from "hono/compress";

// Dynamically import the React Router build output and type it as a handler
/** @typedef {function(Request): Promise<Response>} BuildFunction */
/** @typedef {function(Request): Promise<Response>} APIFunction */
// @ts-expect-error - dynamic import of build output
const build = (await import("./dist/rsc/index.js")).default;
const api = (await import("./dist/api/index.js")).default;

// Create the Hono app instance
const app = new Hono();

// Serve static assets with compression for better performance
app.use("/assets/*", compress());
app.use("/*", serveStatic({ root: "./dist/client" }));

app.route("/api", api);

// Special route for Chrome DevTools integration (returns 404 for this template)
app.get("/.well-known/appspecific/com.chrome.devtools.json", (c) => {
	return c.text("Not Found", 404);
});

// Catch-all route: handle all other requests with the React Router build handler
// This will render your React Server Components app
app.use("*", (c) => {
	return build(c.req.raw);
});

// Start the Node server
const port = Number.parseInt(process.env.PORT || "3000", 10);
serve({ fetch: app.fetch, port }, (info) => {
	console.log(`Server running on http://localhost:${info.port}`);
});
