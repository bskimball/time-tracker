import { Outlet } from "react-router";
import { AppLayout } from "~/components/app-layout";
import { PageHeader } from "~/components/page-header";

// Settings navigation links
const settingsNavLinks = [
	{ to: "/settings/stations", label: "Stations" },
	{ to: "/settings/employees", label: "Employees" },
	{ to: "/settings/users", label: "Users" },
	{ to: "/settings/api-keys", label: "API Keys" },
	{ to: "/executive", label: "Executive" },
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
