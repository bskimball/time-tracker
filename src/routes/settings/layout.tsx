import { Outlet } from "react-router";
import { AppLayout } from "~/components/app-layout";

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
				<div className="mb-6">
					<h1 className="text-3xl font-bold">System Settings</h1>
					<p className="text-muted-foreground mt-1">
						Manage stations, employees, API keys, and system configuration
					</p>
				</div>
				<Outlet />
			</AppLayout>
		</>
	);
}
