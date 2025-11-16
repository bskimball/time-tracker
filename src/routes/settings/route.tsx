import { db } from "../../lib/db";
import { SettingsManagement } from "./client";
import { validateRequest } from "../../lib/auth";
import { AppLayout } from "~/components/app-layout";

// Settings navigation links
const settingsNavLinks = [
	{ to: "/settings?tab=stations", label: "Stations" },
	{ to: "/settings?tab=employees", label: "Employees" },
	{ to: "/executive", label: "Executive" },
];

// Fetch data directly in Server Component instead of using loader
// This is the correct pattern for React Server Components
export default async function Component() {
	// Get authenticated user from middleware
	// Middleware ensures user is authenticated before this component renders
	await validateRequest();

	const [stations, employees] = await Promise.all([
		db.station.findMany({ orderBy: { name: "asc" } }),
		db.employee.findMany({ orderBy: { name: "asc" } }),
	]);

	return (
		<>
			<title>Settings</title>
			<meta name="description" content="Manage warehouse settings and users" />

			<AppLayout title="System Settings" brandHref="/settings" navLinks={settingsNavLinks}>
				<div className="mb-6">
					<h1 className="text-3xl font-bold">System Settings</h1>
					<p className="text-muted-foreground mt-1">
						Manage stations, employees, and system configuration
					</p>
				</div>
				<SettingsManagement stations={stations} employees={employees} />
			</AppLayout>
		</>
	);
}
