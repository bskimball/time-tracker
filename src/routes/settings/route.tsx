import { db } from "../../lib/db";
import { SettingsManagement } from "./client";
import { validateRequest } from "../../lib/auth";
import { Link } from "react-router";
import { Button } from "~/components/ds/button";

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

			<div className="min-h-screen bg-background">
				<nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
					<div className="container mx-auto px-4">
						<div className="flex h-16 items-center justify-between">
							<div className="flex items-center space-x-4">
								<Link to="/settings" className="flex items-center space-x-2">
									<span className="text-xl font-bold">Settings</span>
								</Link>
							</div>
							<div className="flex items-center space-x-2">
								<Link to="/executive">
									<Button variant="outline" size="sm">
										Executive Portal
									</Button>
								</Link>
								<Link to="/">
									<Button variant="outline" size="sm">
										Home
									</Button>
								</Link>
								<a href="/logout">
									<Button variant="ghost" size="sm">
										Logout
									</Button>
								</a>
							</div>
						</div>
					</div>
				</nav>
				<main className="container mx-auto px-4 py-6">
					<div className="mb-6">
						<h1 className="text-3xl font-bold">System Settings</h1>
						<p className="text-muted-foreground mt-1">
							Manage stations, employees, and system configuration
						</p>
					</div>
					<SettingsManagement stations={stations} employees={employees} />
				</main>
			</div>
		</>
	);
}
