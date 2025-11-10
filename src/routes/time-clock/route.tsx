// Redirect to /floor which is the primary time-clock route
export default async function Component() {
	throw new Response("", {
		status: 301,
		headers: {
			Location: "/floor",
		},
	});
}
