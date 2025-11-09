import {
	createTemporaryReferenceSet,
	decodeAction,
	decodeFormState,
	decodeReply,
	loadServerAction,
	renderToReadableStream,
} from "@vitejs/plugin-rsc/rsc";
import { unstable_matchRSCServerRequest as matchRSCServerRequest } from "react-router";

import { routes } from "./routes/config";
import { runWithRequest } from "./lib/request-context";

// Initialize performance calculations in development
if (process.env.NODE_ENV === "development") {
	// Only initialize once per server startup
	if (!(global as any).performanceInitialized) {
		(global as any).performanceInitialized = true;

		// Import and initialize performance calculations
		import("./lib/performance-scheduler")
			.then(({ performanceScheduler }) => {
				console.log("📊 Initializing performance calculation scheduler...");
				performanceScheduler.start(30); // Run every 30 minutes
				console.log("✅ Performance scheduler started");
			})
			.catch((error) => {
				console.error("❌ Failed to initialize performance scheduler:", error);
			});
	}
}

async function fetchServer(request: Request) {
	// Wrap the RSC rendering in the request context so components can access it
	return runWithRequest(request, async () => {
		return matchRSCServerRequest({
			createTemporaryReferenceSet,
			decodeAction,
			decodeFormState,
			decodeReply,
			loadServerAction,
			request,
			routes: routes(),
			generateResponse(match, options) {
				return new Response(renderToReadableStream(match.payload, options), {
					status: match.statusCode,
					headers: match.headers,
				});
			},
		});
	});
}

export default async function handler(request: Request) {
	// Import the generateHTML function from the client environment
	const ssr = await import.meta.viteRsc.loadModule<typeof import("./entry.ssr")>("ssr", "index");

	return ssr.generateHTML(request, fetchServer);
}

if (import.meta.hot) {
	import.meta.hot.accept();
}
