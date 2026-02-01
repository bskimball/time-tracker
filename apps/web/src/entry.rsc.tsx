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
import { runWithRequest } from "./lib/request-context";
import { validateRequest, invalidateSession, deleteSessionTokenCookie } from "./lib/auth";

type RSCMatch = {
	payload: unknown;
	statusCode: number;
	headers: Headers | Record<string, string>;
};

type RSCStreamOptions = Parameters<typeof renderToReadableStream>[1];

function fetchServer(request: Request) {
	// Wrap RSC rendering in request context so Server Components can access request
	return runWithRequest(request, () =>
		matchRSCServerRequest({
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
			generateResponse(match: RSCMatch, options: RSCStreamOptions) {
				return new Response(renderToReadableStream(match.payload, options), {
					status: match.statusCode,
					headers: match.headers,
				});
			},
		})
	);
}

export default async function handler(request: Request) {
	const url = new URL(request.url);

	// Handle logout as a top-level redirect before RSC rendering
	if (url.pathname === "/logout") {
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

	// Handle auth redirects BEFORE RSC rendering to avoid redirect Responses
	// bubbling through the RSC/SSR pipeline as server errors.
	const { user } = await validateRequest(request);

	// Handle home page and dashboard redirects based on user role
	if (url.pathname === "/" || url.pathname === "/dashboard") {
		const destination = user
			? user.role === "ADMIN"
				? "/executive"
				: user.role === "MANAGER"
					? "/manager"
					: "/floor"
			: "/login";

		return new Response(null, {
			status: 302,
			headers: { Location: destination },
		});
	}

	// Protect /manager/* routes - require MANAGER or ADMIN role
	if (url.pathname.startsWith("/manager")) {
		if (!user) {
			const redirectParam = `?redirect=${encodeURIComponent(url.pathname)}`;
			return new Response(null, {
				status: 302,
				headers: { Location: `/login${redirectParam}` },
			});
		}

		if (user.role !== "MANAGER" && user.role !== "ADMIN") {
			const defaultRoute = user.role === "ADMIN" ? "/executive" : "/floor";
			return new Response(null, {
				status: 302,
				headers: { Location: defaultRoute },
			});
		}
	}

	// Protect /executive/* routes - require ADMIN role
	if (url.pathname.startsWith("/executive")) {
		if (!user) {
			const redirectParam = `?redirect=${encodeURIComponent(url.pathname)}`;
			return new Response(null, {
				status: 302,
				headers: { Location: `/login${redirectParam}` },
			});
		}

		if (user.role !== "ADMIN") {
			const defaultRoute = user.role === "MANAGER" ? "/manager" : "/floor";
			return new Response(null, {
				status: 302,
				headers: { Location: defaultRoute },
			});
		}
	}

	// Protect /settings and /todo routes - require any authenticated user
	if (url.pathname.startsWith("/settings") || url.pathname.startsWith("/todo")) {
		if (!user) {
			const redirectParam = `?redirect=${encodeURIComponent(url.pathname)}`;
			return new Response(null, {
				status: 302,
				headers: { Location: `/login${redirectParam}` },
			});
		}

		// Redirect /settings to /settings/stations
		if (url.pathname === "/settings") {
			return new Response(null, {
				status: 302,
				headers: { Location: "/settings/stations" },
			});
		}
	}

	// Handle mobile redirect for /floor route
	if (url.pathname === "/floor") {
		const userAgent = request.headers.get("user-agent") || "";
		const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
			userAgent
		);
		if (isMobile) {
			return new Response(null, {
				status: 302,
				headers: { Location: "/floor/time-clock/mobile" },
			});
		}
	}

	// Import the generateHTML function from the client environment
	const ssr = await import.meta.viteRsc.loadModule<typeof import("./entry.ssr")>("ssr", "index");

	return ssr.generateHTML(request, fetchServer);
}

if (import.meta.hot) {
	import.meta.hot.accept();
}
