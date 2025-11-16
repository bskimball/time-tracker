// Unstable RSC APIs - partial type coverage in react-router
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
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

function fetchServer(request: Request) {
	return matchRSCServerRequest({
		// Provide the React Server touchpoints.
		createTemporaryReferenceSet,
		decodeAction,
		decodeFormState,
		decodeReply,
		loadServerAction,
		// The incoming request.
		request,
		// The app routes.
		routes: routes(),
		// Encode the match with the React Server implementation.
		generateResponse(match: any, options: any) {
			return new Response(renderToReadableStream(match.payload, options), {
				status: match.statusCode,
				headers: match.headers,
			});
		},
	});
}

export default async function handler(request: Request) {
	// Handle logout as a top-level redirect before RSC rendering to avoid
	// redirect Responses bubbling through the RSC/SSR pipeline as server errors.
	const url = new URL(request.url);
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

	// Import the generateHTML function from the client environment
	const ssr = await import.meta.viteRsc.loadModule<typeof import("./entry.ssr")>("ssr", "index");

	return ssr.generateHTML(request, fetchServer);
}

if (import.meta.hot) {
	import.meta.hot.accept();
}
