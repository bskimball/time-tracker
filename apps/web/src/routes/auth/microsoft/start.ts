import { generateState, generateCodeVerifier } from "arctic";
import { microsoft } from "../../../lib/oauth";

// In RSC Data Mode, convert loader to Server Component
export default async function Component(): Promise<never> {
	const state = generateState();
	const codeVerifier = generateCodeVerifier();
	const url = await microsoft.createAuthorizationURL(state, codeVerifier, [
		"openid",
		"profile",
		"email",
	]);

	const response = new Response(null, {
		status: 302,
		headers: [
			["Set-Cookie", `microsoft_oauth_state=${state}; Path=/; HttpOnly; SameSite=Lax; Max-Age=600`],
			[
				"Set-Cookie",
				`microsoft_code_verifier=${codeVerifier}; Path=/; HttpOnly; SameSite=Lax; Max-Age=600`,
			],
			["Location", url.toString()],
		],
	});

	throw response;
}
