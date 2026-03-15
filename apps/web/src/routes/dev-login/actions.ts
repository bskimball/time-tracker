"use server";

import { db } from "../../lib/db";
import { generateSessionToken, createSession, setSessionTokenCookie } from "../../lib/auth";
import { redirect } from "react-router";

export type DevLoginState = {
	error?: string;
};

const DEV_LOGIN_ROLES = ["ADMIN", "EXECUTIVE", "MANAGER"] as const;

function isDevLoginRole(role: string): role is (typeof DEV_LOGIN_ROLES)[number] {
	return DEV_LOGIN_ROLES.includes(role as (typeof DEV_LOGIN_ROLES)[number]);
}

export async function createDevUser(
	_prevState: DevLoginState,
	formData: FormData
): Promise<DevLoginState | Response> {
	const email = formData.get("email") as string;
	const name = formData.get("name") as string;
	const role = String(formData.get("role") || "");

	if (!email || !name) {
		return { error: "Email and name are required" };
	}

	if (!isDevLoginRole(role)) {
		return { error: "Role is required" };
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
				role,
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

	// Get user to determine redirect location
	const user = await db.user.findUnique({ where: { id: userId } });
	if (!user) {
		throw new Error("User not found");
	}

	const token = generateSessionToken();
	const session = await createSession(token, userId);
	const cookie = setSessionTokenCookie(token, session.expiresAt);

	// Redirect based on user role
	let location = "/floor";
	if (user.role === "ADMIN" || user.role === "EXECUTIVE") {
		location = "/executive";
	} else if (user.role === "MANAGER") {
		location = "/manager";
	}

	// Create a redirect response with the session cookie
	const response = new Response(null, {
		status: 302,
		headers: {
			Location: location,
			"Set-Cookie": cookie,
		},
	});

	throw response;
}
