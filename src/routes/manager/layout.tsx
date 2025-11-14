import { Outlet } from "react-router";
import { AppLayout } from "~/components/app-layout";
import { validateRequest } from "~/lib/auth";
import { managerNavLinks } from "./nav";

export default async function Component() {
	await validateRequest();
	// Middleware ensures user has MANAGER or ADMIN role

	return (
		<AppLayout title="Manager Portal" brandHref="/manager" navLinks={managerNavLinks}>
			<Outlet />
		</AppLayout>
	);
}
