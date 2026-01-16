import { redirect } from "react-router";
import { validateRequest } from "./auth";
import type { User } from "@prisma/client";

/**
 * Require authentication in a Server Component
 * Redirects to /login if not authenticated
 *
 * Usage in route component:
 * ```typescript
 * export default async function Component() {
 *   const user = await requireAuth();
 *   // user is guaranteed to be defined here
 * }
 * ```
 */
export async function requireAuth(): Promise<User> {
	const { user } = await validateRequest();

	if (!user) {
		// Get current URL for redirect parameter
		const request = (await import("./request-context")).getRequest();
		const url = request ? new URL(request.url) : null;
		const redirectParam = url ? `?redirect=${encodeURIComponent(url.pathname)}` : "";

		throw redirect(`/login${redirectParam}`);
	}

	return user;
}

/**
 * Require specific roles in a Server Component
 * Redirects to / if user doesn't have required role
 *
 * Usage in route component:
 * ```typescript
 * export default async function Component() {
 *   const user = await requireRole(["ADMIN"]);
 *   // user is guaranteed to be ADMIN here
 * }
 * ```
 */
export async function requireRole(roles: string[]): Promise<User> {
	const user = await requireAuth();

	if (!roles.includes(user.role)) {
		throw redirect("/");
	}

	return user;
}
