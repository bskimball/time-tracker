import { Outlet } from "react-router";
import { AppLayout } from "~/components/app-layout";
import { validateRequest } from "~/lib/auth";
import { executiveNavLinks } from "./nav";

export default async function Component() {
	await validateRequest();
	// Middleware ensures ADMIN role

	return (
		<AppLayout title="Executive Portal" brandHref="/executive" navLinks={executiveNavLinks}>
			<Outlet />
		</AppLayout>
	);
}
