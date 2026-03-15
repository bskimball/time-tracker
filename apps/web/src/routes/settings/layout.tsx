import { Outlet } from "react-router";
import { AppLayout } from "~/components/app-layout";
import { PageHeader } from "~/components/page-header";
import { validateRequest } from "~/lib/auth";

// Settings navigation links
const settingsNavLinks = [
	{ to: "/settings/stations", label: "Stations", icon: "monitor" as const },
	{ to: "/settings/employees", label: "Employees", icon: "users" as const },
	{ to: "/settings/users", label: "Users", icon: "users" as const },
	{ to: "/settings/api-keys", label: "API Keys", icon: "clipboard" as const },
	{ to: "/settings/operational-config", label: "Ops Config", icon: "settings" as const },
	{ to: "/executive", label: "Executive", icon: "crown" as const },
];

export default async function Component() {
	const { user } = await validateRequest();

	return (
		<>
			<title>Settings</title>
			<meta name="description" content="Manage warehouse settings and users" />

			<AppLayout
				title="System Settings"
				brandHref="/settings"
				navLinks={settingsNavLinks}
				currentUser={user}
			>
				<PageHeader
					title="System Settings"
					subtitle="Manage stations, employees, API keys, and system configuration"
				/>
				<Outlet />
			</AppLayout>
		</>
	);
}
