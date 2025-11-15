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

	// Handle logout as a top-level redirect before RSC rendering to avoid
	// redirect Responses bubbling through the RSC/SSR pipeline as server errors.
	if (url.pathname === "/logout") {
		const { validateRequest, invalidateSession, deleteSessionTokenCookie } = await import(
			"./lib/auth"
		);

		const { session } = await validateRequest(request);

		if (session) {
			await invalidateSession(session.id);
		}

		return new Response(null, {
			status: 302,
			headers: {
				Location: "/login",
				"Set-Cookie": deleteSessionTokenCookie(),
			},
		});
	}

	const ssr = await import.meta.viteRsc.loadModule<typeof import("./entry.ssr")>("ssr", "index");
	return ssr.generateHTML(request, fetchServer);
}

if (import.meta.hot) {
	import.meta.hot.accept();
}
