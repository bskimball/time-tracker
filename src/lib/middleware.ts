// import { type unstable_RSCMiddleware as RSCMiddleware } from "react-router";
// Note: This type might not be exported yet, using generic middleware type
type RSCMiddleware = (context: { request: Request }) => Promise<Response | void | null>;
import { validateRequest } from "./auth";
import type { User_role } from "@prisma/client";

/**
 * Authentication middleware for protected routes
 * Redirects to /login if user is not authenticated
 * Runs during route matching for both server and client navigation
 */
export const authMiddleware: RSCMiddleware = async ({ request }) => {
	const { user } = await validateRequest(request);

	if (!user) {
		const url = new URL(request.url);
		const redirectParam = `?redirect=${encodeURIComponent(url.pathname)}`;
		return new Response(null, {
			status: 302,
			headers: { Location: `/login${redirectParam}` },
		});
	}
};

/**
 * Role-based authorization middleware factory
 * Returns middleware that checks if user has required role
 * Redirects based on user role if access denied
 */
export const roleMiddleware = (allowedRoles: User_role[]): RSCMiddleware => {
	return async ({ request }) => {
		const { user } = await validateRequest(request);

		if (!user) {
			const url = new URL(request.url);
			const redirectParam = `?redirect=${encodeURIComponent(url.pathname)}`;
			return new Response(null, {
				status: 302,
				headers: { Location: `/login${redirectParam}` },
			});
		}

		if (!allowedRoles.includes(user.role)) {
			// Redirect based on user role to appropriate default page
			const defaultRoute =
				user.role === "ADMIN" ? "/executive" : user.role === "MANAGER" ? "/manager" : "/floor";
			return new Response(null, {
				status: 302,
				headers: { Location: defaultRoute },
			});
		}
	};
};

/**
 * Legacy middleware for backward compatibility
 * @deprecated Use roleMiddleware instead
 */
export function createRoleMiddleware(roles: string[]) {
	return async () => {
		const { user } = await validateRequest();

		if (!user) {
			return new Response(null, {
				status: 302,
				headers: { Location: "/login" },
			});
		}

		if (!roles.includes(user.role)) {
			return new Response(null, {
				status: 302,
				headers: { Location: "/" },
			});
		}
	};
}
