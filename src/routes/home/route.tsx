import { validateRequest } from "~/lib/auth";

function redirectTo(url: string): never {
	throw new Response(null, {
		status: 302,
		headers: { Location: url },
	});
}

export default async function Component(): Promise<never> {
	const { user } = await validateRequest();

	const destination = user
		? user.role === "ADMIN"
			? "/executive"
			: user.role === "MANAGER"
				? "/manager"
				: "/floor"
		: "/login";

	redirectTo(destination);
}
