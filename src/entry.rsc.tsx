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
	const url = new URL(request.url);
	const { validateRequest } = await import("./lib/auth");

	// Handle home page redirects BEFORE calling generateHTML
	if (url.pathname === "/") {
		// Check authentication to determine redirect destination
		const { user } = await validateRequest(request);

		if (user) {
			// Redirect authenticated users to role-based dashboard
			if (user.role === "ADMIN") {
				return Response.redirect(new URL("/executive", url.origin), 302);
			} else if (user.role === "MANAGER") {
				return Response.redirect(new URL("/manager", url.origin), 302);
			} else {
				return Response.redirect(new URL("/floor", url.origin), 302);
			}
		}
		// User is not authenticated, redirect to login
		return Response.redirect(new URL("/login", url.origin), 302);
	}

	// Handle /dashboard redirects to role-based dashboards
	if (url.pathname === "/dashboard") {
		const { user } = await validateRequest(request);

		if (!user) {
			return Response.redirect(new URL("/login", url.origin), 302);
		}

		// Redirect to appropriate role-based dashboard
		if (user.role === "ADMIN") {
			return Response.redirect(new URL("/executive", url.origin), 302);
		} else if (user.role === "MANAGER") {
			return Response.redirect(new URL("/manager", url.origin), 302);
		} else {
			return Response.redirect(new URL("/floor", url.origin), 302);
		}
	}

	// Import the generateHTML function from the client environment
	const ssr = await import.meta.viteRsc.loadModule<typeof import("./entry.ssr")>("ssr", "index");

	return ssr.generateHTML(request, fetchServer);
}

if (import.meta.hot) {
	import.meta.hot.accept();
}
