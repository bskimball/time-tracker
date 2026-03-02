import { Outlet } from "react-router";
import { AppLayout } from "~/components/app-layout";
import { validateRequest } from "~/lib/auth";
import { getManagerNavLinks } from "./nav";
import { ManagerRealtimeTopbarIndicator } from "~/routes/manager/realtime-topbar-indicator";

export default async function Component() {
	const { user } = await validateRequest();

	if (!user || (user.role !== "MANAGER" && user.role !== "ADMIN")) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center">
					<h1 className="text-2xl font-bold text-destructive mb-4">Access Denied</h1>
					<p className="text-muted-foreground">
						You need manager privileges and an active session to access this area.
					</p>
				</div>
			</div>
		);
	}

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
