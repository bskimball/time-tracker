import { redirect } from "react-router";
import { validateRequest } from "./auth";

/**
 * Authentication middleware for protected routes
 * Redirects to /login if user is not authenticated
 * Runs during route matching for both server and client navigation
 */
export async function authMiddleware() {
	const { user } = await validateRequest();

	if (!user) {
		// Get current URL for redirect parameter
		const request = (await import("./request-context")).getRequest();
		const url = request ? new URL(request.url) : null;
		const redirectParam = url ? `?redirect=${encodeURIComponent(url.pathname)}` : "";

		throw redirect(`/login${redirectParam}`);
	}
}

/**
 * Role-based authorization middleware
 * Must be used after authMiddleware
 * Redirects to / if user doesn't have required role
 */
export function createRoleMiddleware(roles: string[]) {
	return async () => {
		const { user } = await validateRequest();

		if (!user) {
			throw redirect("/login");
		}

		if (!roles.includes(user.role)) {
			throw redirect("/");
		}
	};
}
