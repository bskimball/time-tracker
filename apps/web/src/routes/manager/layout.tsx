import { Outlet } from "react-router";
import { AppLayout } from "~/components/app-layout";
import { requireUser } from "~/lib/auth";
import { getManagerNavLinks } from "./nav";
import { ManagerRealtimeTopbarIndicator } from "~/routes/manager/realtime-topbar-indicator";

export default async function Component() {
	const user = await requireUser();
	// Middleware ensures user has MANAGER or ADMIN role

	return (
		<AppLayout
			title="Manager Portal"
			brandHref="/manager"
			navLinks={getManagerNavLinks(user)}
			statusBarSlot={<ManagerRealtimeTopbarIndicator />}
		>
			<Outlet />
		</AppLayout>
	);
}
