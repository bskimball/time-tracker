import { validateRequest, invalidateSession, deleteSessionTokenCookie } from "../../lib/auth";

export default async function Component(): Promise<never> {
	const { session } = await validateRequest();

	if (session) {
		await invalidateSession(session.id);
	}

	const response = new Response(null, {
		status: 302,
		headers: {
			Location: "/login",
			"Set-Cookie": deleteSessionTokenCookie(),
		},
	});

	throw response;
}
