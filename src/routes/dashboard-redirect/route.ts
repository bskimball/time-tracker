import { validateRequest } from "~/lib/auth";

export default async function Component() {
	const { user } = await validateRequest();

	if (!user) {
		throw new Response(null, {
			status: 302,
			headers: { Location: "/login" },
		});
	}

	const destination = user.role === "ADMIN" ? "/executive" : user.role === "MANAGER" ? "/manager" : "/floor";

	throw new Response(null, {
		status: 302,
		headers: { Location: destination },
	});
}
