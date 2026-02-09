import { Outlet } from "react-router";
import { AppLayout } from "~/components/app-layout";
import { PageHeader } from "~/components/page-header";

// Settings navigation links
const settingsNavLinks = [
	{ to: "/settings/stations", label: "Stations", icon: "monitor" as const },
	{ to: "/settings/employees", label: "Employees", icon: "users" as const },
	{ to: "/settings/users", label: "Users", icon: "users" as const },
	{ to: "/settings/api-keys", label: "API Keys", icon: "clipboard" as const },
	{ to: "/settings/operational-config", label: "Ops Config", icon: "settings" as const },
	{ to: "/executive", label: "Executive", icon: "crown" as const },
];

export default function Component() {
	return (
		<>
			<title>Settings</title>
			<meta name="description" content="Manage warehouse settings and users" />

			<AppLayout title="System Settings" brandHref="/settings" navLinks={settingsNavLinks}>
				<PageHeader
					title="System Settings"
					subtitle="Manage stations, employees, API keys, and system configuration"
				/>
				<Outlet />
			</AppLayout>
		</>
	);
}
