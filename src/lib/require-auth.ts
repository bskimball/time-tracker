import { validateRequest } from "./auth";
import type { User } from "@prisma/client";

/**
 * Require authentication in a Server Component
 * Throws an error if not authenticated (should not happen if handler pre-auth check passed)
 *
 * NOTE: Auth redirects are handled in src/entry.rsc.tsx BEFORE RSC rendering starts.
 * This function should only be reached if the handler's auth check passed.
 * If user is missing here, it indicates an invalid session state.
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
		// This should not happen if the handler's pre-auth check passed
		// If we reach here, the session became invalid between checks
		throw new Error("Authentication required. Session is invalid or expired.");
	}

	return user;
}

/**
 * Require specific roles in a Server Component
 * Throws an error if user doesn't have required role
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
		throw new Error(`Access denied. Required role: ${roles.join(" or ")}`);
	}

	return user;
}
