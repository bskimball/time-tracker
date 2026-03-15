import { Outlet } from "react-router";
import { AppLayout } from "~/components/app-layout";
import { validateRequest } from "~/lib/auth";
import { floorNavLinks } from "./nav";

export default async function Component() {
	const { user } = await validateRequest();

	return (
		<AppLayout
			title="Floor Operations"
			brandHref="/floor"
			navLinks={floorNavLinks}
			currentUser={user}
		>
			<Outlet />
		</AppLayout>
	);
}
