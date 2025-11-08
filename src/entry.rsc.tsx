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
import { getSessionToken } from "./lib/auth";

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
	// Pre-auth redirect for protected routes to avoid UI flashes and 500s from thrown redirects
	// Use cookie-based check only (no Prisma call) to prevent DB errors
	const reqUrl = new URL(request.url);
	const { pathname } = reqUrl;
	if (pathname === "/dashboard" || pathname === "/todo") {
		const sessionToken = getSessionToken(request);
		if (!sessionToken) {
			return Response.redirect(new URL("/login", reqUrl).toString(), 302);
		}
	}

	// Import the generateHTML function from the client environment
	const ssr = await import.meta.viteRsc.loadModule<typeof import("./entry.ssr")>("ssr", "index");

	return ssr.generateHTML(request, fetchServer);
}

if (import.meta.hot) {
	import.meta.hot.accept();
}
