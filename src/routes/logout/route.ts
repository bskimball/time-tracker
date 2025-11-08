import { validateRequest, invalidateSession, deleteSessionTokenCookie } from "../../lib/auth";

// In RSC Data Mode, Server Components handle logout instead of loaders
export default async function Component(): Promise<never> {
	const { session } = await validateRequest();

	if (session) {
		await invalidateSession(session.id);
	}

	// Throw a Response with the redirect and cookie
	// React Router catches this and returns it as the HTTP response
	const cookie = deleteSessionTokenCookie();
	const response = new Response(null, {
		status: 302,
		headers: {
			Location: "/login",
			"Set-Cookie": cookie,
		},
	});

	throw response;
}
