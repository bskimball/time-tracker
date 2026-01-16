import { Outlet } from "react-router";
import { AppLayout } from "~/components/app-layout";
import { validateRequest } from "~/lib/auth";
import { getExecutiveNavLinks } from "./nav";

export default async function Component() {
	const { user } = await validateRequest();

	// If no user, this component won't render (middleware should handle redirects)
	// But for RSC compatibility, we check here too
	if (!user || user.role !== "ADMIN") {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center">
					<h1 className="text-2xl font-bold text-destructive mb-4">Access Denied</h1>
					<p className="text-muted-foreground">
						You need administrator privileges to access this area.
					</p>
				</div>
			</div>
		);
	}

	return (
		<AppLayout
			title="Executive Portal"
			brandHref="/executive"
			navLinks={getExecutiveNavLinks(user)}
		>
			<Outlet />
		</AppLayout>
	);
}
