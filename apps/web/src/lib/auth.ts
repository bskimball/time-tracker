import { db } from "./db";
import { redirect } from "react-router";
import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";
import type { Session, User, User_role } from "@prisma/client";
import {
	deleteRequestCacheValue,
	getRequest,
	getRequestCacheValue,
	setRequestCacheValue,
} from "./request-context";

const SESSION_COOKIE_NAME = "session";
const SESSION_EXPIRY_DAYS = 30;
const VALIDATE_REQUEST_CACHE_KEY = "auth:validate-request";
const requestValidationCache = new WeakMap<Request, Promise<SessionValidationResult>>();

export function generateSessionToken(): string {
	const bytes = new Uint8Array(20);
	crypto.getRandomValues(bytes);
	return encodeBase32LowerCaseNoPadding(bytes);
}

export async function createSession(token: string, userId: string): Promise<Session> {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * SESSION_EXPIRY_DAYS);

	const session = await db.session.create({
		data: {
			id: sessionId,
			userId,
			expiresAt,
		},
	});

	return session;
}

export async function validateSessionToken(token: string): Promise<SessionValidationResult> {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

	try {
		const result = await db.session.findFirst({
			where: {
				id: sessionId,
				expiresAt: { gt: new Date() },
			},
			include: { User: true },
		});

		if (!result) {
			return { session: null, user: null };
		}

		const { User: user, ...session } = result;

		if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
			session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * SESSION_EXPIRY_DAYS);
			await db.session.update({
				where: { id: session.id },
				data: { expiresAt: session.expiresAt },
			});
		}

		return { session, user };
	} catch (error) {
		console.error("Session validation error:", error);
		return { session: null, user: null };
	}
}

export async function invalidateSession(sessionId: string): Promise<void> {
	await db.session.delete({ where: { id: sessionId } });
}

export function setSessionTokenCookie(token: string, expiresAt: Date): string {
	const isSecure = process.env.NODE_ENV === "production";
	return [
		`${SESSION_COOKIE_NAME}=${token}`,
		`Path=/`,
		`HttpOnly`,
		`SameSite=Lax`,
		isSecure ? `Secure` : "",
		`Expires=${expiresAt.toUTCString()}`,
	]
		.filter(Boolean)
		.join("; ");
}

export function deleteSessionTokenCookie(): string {
	return [`${SESSION_COOKIE_NAME}=`, `Path=/`, `HttpOnly`, `SameSite=Lax`, `Max-Age=0`].join("; ");
}

export function getSessionToken(request?: Request): string | null {
	// In RSC Data Mode, we need to get cookies from headers
	// If request is provided, use it; otherwise get from AsyncLocalStorage context
	let cookieHeader: string | null = null;

	const req = request || getRequest();

	if (req) {
		cookieHeader = req.headers.get("Cookie");
	} else {
		// No request available - this means auth won't work
		// This can happen if request context is not set up properly
		// No request available for session token retrieval
		return null;
	}

	if (!cookieHeader) return null;

	const sessionCookie = cookieHeader
		.split(";")
		.map((c) => c.trim())
		.find((c) => c.startsWith(`${SESSION_COOKIE_NAME}=`));

	if (!sessionCookie) return null;

	return sessionCookie.split("=")[1];
}

export async function validateRequest(request?: Request): Promise<SessionValidationResult> {
	return validateRequestWithRequest(request ?? getRequest());
}

export async function validateRequestWithRequest(req?: Request): Promise<SessionValidationResult> {
	if (!req) {
		return { session: null, user: null };
	}

	const contextRequest = getRequest();
	const canUseContextCache = contextRequest !== undefined && contextRequest === req;

	if (canUseContextCache) {
		const cached = getRequestCacheValue<Promise<SessionValidationResult>>(VALIDATE_REQUEST_CACHE_KEY);
		if (cached) {
			return cached;
		}
	} else {
		const cached = requestValidationCache.get(req);
		if (cached) {
			return cached;
		}
	}

	const validationPromise = (async (): Promise<SessionValidationResult> => {
		const token = getSessionToken(req);
		if (!token) {
			return { session: null, user: null };
		}

		return validateSessionToken(token);
	})();

	if (canUseContextCache) {
		setRequestCacheValue(VALIDATE_REQUEST_CACHE_KEY, validationPromise);
		validationPromise.catch(() => {
			deleteRequestCacheValue(VALIDATE_REQUEST_CACHE_KEY);
		});
	} else {
		requestValidationCache.set(req, validationPromise);
		validationPromise.catch(() => {
			requestValidationCache.delete(req);
		});
	}

	return validationPromise;
}

export async function requireUser(request?: Request): Promise<User> {
	const { user } = await validateRequest(request);
	if (!user) {
		throw redirect("/login");
	}
	return user;
}

export async function requireRole(roles: User_role[], request?: Request): Promise<User> {
	const user = await requireUser(request);
	if (!roles.includes(user.role)) {
		throw redirect("/");
	}
	return user;
}

export type SessionValidationResult =
	| { session: Session; user: User }
	| { session: null; user: null };
