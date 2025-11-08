"use server";

import { db } from "../../lib/db";
import { generateSessionToken, createSession, setSessionTokenCookie } from "../../lib/auth";
import { redirect } from "react-router";

export type DevLoginState = {
	error?: string;
};

export async function createAdminUser(
	_prevState: DevLoginState,
	formData: FormData
): Promise<DevLoginState | Response> {
	const email = formData.get("email") as string;
	const name = formData.get("name") as string;

	if (!email || !name) {
		return { error: "Email and name are required" };
	}

	try {
		const existingUser = await db.user.findUnique({ where: { email } });
		if (existingUser) {
			return { error: "User with this email already exists" };
		}

		await db.user.create({
			data: {
				id: crypto.randomUUID(),
				email,
				name,
				role: "ADMIN",
				updatedAt: new Date(),
			},
		});

		return redirect("/dev-login");
	} catch {
		return { error: "Failed to create user" };
	}
}

export async function loginAsUser(formData: FormData) {
	const userId = formData.get("userId") as string;

	if (!userId) {
		throw new Error("User ID is required");
	}

	const token = generateSessionToken();
	const session = await createSession(token, userId);
	const cookie = setSessionTokenCookie(token, session.expiresAt);

	// Create a redirect response with the session cookie
	const response = new Response(null, {
		status: 302,
		headers: {
			Location: "/dashboard",
			"Set-Cookie": cookie,
		},
	});

	throw response;
}
