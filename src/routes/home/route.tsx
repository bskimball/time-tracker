import { redirect } from "react-router";
import { validateRequest } from "../../lib/auth";

// Home route: authenticated users go to dashboard, unauthenticated to login
export default async function Component(): Promise<never> {
	const { user } = await validateRequest();

	if (user) {
		// User is authenticated, send to dashboard
		throw redirect("/dashboard");
	}
	// User is not authenticated, send to login
	throw redirect("/login");
}
