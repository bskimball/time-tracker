import { google, type GoogleUser } from "../../../lib/oauth";
import { db } from "../../../lib/db";
import { generateSessionToken, createSession, setSessionTokenCookie } from "../../../lib/auth";
import { getRequest } from "../../../lib/request-context";

// In RSC Data Mode, this route returns a Response instead of rendering a component
export default async function Component(): Promise<never> {
	const request = getRequest();

	if (!request) {
		throw new Response("Request not available", { status: 500 });
	}

	const url = new URL(request.url);
	const code = url.searchParams.get("code");
	const state = url.searchParams.get("state");

	const cookies = request.headers.get("Cookie") || "";
	const storedState = getCookie(cookies, "google_oauth_state");
	const codeVerifier = getCookie(cookies, "google_code_verifier");

	if (!code || !state || !storedState || state !== storedState || !codeVerifier) {
		throw new Response("Invalid request", { status: 400 });
	}

	try {
		const tokens = await google.validateAuthorizationCode(code, codeVerifier);
		const response = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
			headers: { Authorization: `Bearer ${tokens.accessToken}` },
		});

		const googleUser: GoogleUser = await response.json();

		if (!googleUser.email_verified) {
			throw new Response("Email not verified", { status: 400 });
		}

		let user = await db.user.findUnique({
			where: { email: googleUser.email },
		});

		if (!user) {
			user = await db.user.create({
				data: {
					id: crypto.randomUUID(),
					email: googleUser.email,
					name: googleUser.name,
					image: googleUser.picture,
					role: "WORKER",
					updatedAt: new Date(),
				},
			});
		}

		await db.oAuthAccount.upsert({
			where: {
				provider_providerUserId: {
					provider: "google",
					providerUserId: googleUser.sub,
				},
			},
			create: {
				provider: "google",
				providerUserId: googleUser.sub,
				userId: user.id,
				accessToken: tokens.accessToken?.toString() || null,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			update: {
				accessToken: tokens.accessToken?.toString() || null,
				updatedAt: new Date(),
			},
		});

		const sessionToken = generateSessionToken();
		const session = await createSession(sessionToken, user.id);

		// Redirect based on user role
		let location = "/floor";
		if (user.role === "ADMIN") {
			location = "/executive";
		} else if (user.role === "MANAGER") {
			location = "/manager";
		}

		throw new Response(null, {
			status: 302,
			headers: [
				["Set-Cookie", setSessionTokenCookie(sessionToken, session.expiresAt)],
				["Set-Cookie", `google_oauth_state=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`],
				["Set-Cookie", `google_code_verifier=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`],
				["Location", location],
			],
		});
	} catch (error) {
		if (error instanceof Response) {
			throw error;
		}
		console.error("Google OAuth error:", error);
		throw new Response("Authentication failed", { status: 500 });
	}
}

function getCookie(cookies: string, name: string): string | null {
	const cookie = cookies
		.split(";")
		.map((c) => c.trim())
		.find((c) => c.startsWith(`${name}=`));

	return cookie ? cookie.split("=")[1] : null;
}
