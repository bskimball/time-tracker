import { Outlet } from "react-router";
import { AppLayout } from "~/components/app-layout";
import { requireUser } from "~/lib/auth";
import { getExecutiveNavLinks } from "./nav";

export default async function Component() {
	const user = await requireUser();
	// Middleware ensures ADMIN role

	return (
		<AppLayout title="Executive Portal" brandHref="/executive" navLinks={getExecutiveNavLinks(user)}>
			<Outlet />
		</AppLayout>
	);
}
