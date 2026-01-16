import { validateRequest } from "~/lib/auth";

/**
 * Middleware to ensure user is authenticated and has ADMIN role for executive routes
 * Note: This is a placeholder - React Router middleware support may not be fully implemented
 */
export const requireAdmin = async (request: Request) => {
	const { user } = await validateRequest(request);

	if (!user) {
		// Redirect to login if not authenticated
		return new Response(null, {
			status: 302,
			headers: { Location: "/login" },
		});
	}

	if (user.role !== "ADMIN") {
		// Redirect to home if not admin
		return new Response(null, {
			status: 302,
			headers: { Location: "/" },
		});
	}

	// User is authenticated and has admin role
	return null;
};
