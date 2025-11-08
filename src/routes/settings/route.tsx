import { db } from "../../lib/db";
import { SettingsManagement } from "./client";
import { Header } from "../../components/header";
import { Footer } from "../../components/footer";
import { validateRequest } from "../../lib/auth";

// Fetch data directly in Server Component instead of using loader
// This is the correct pattern for React Server Components
export default async function Component() {
	// Get authenticated user from middleware
	// Middleware ensures user is authenticated before this component renders
	const { user } = await validateRequest();

	const [stations, employees] = await Promise.all([
		db.station.findMany({ orderBy: { name: "asc" } }),
		db.employee.findMany({ orderBy: { name: "asc" } }),
	]);

	return (
		<>
			<title>Settings</title>
			<meta name="description" content="Manage warehouse settings and users" />

			<Header userName={user?.name ?? user?.email ?? null} userRole={user?.role ?? "USER"} />
			<main className="container mx-auto py-8 lg:py-12">
				<h1 className="text-4xl font-bold mb-8">Settings</h1>
				<SettingsManagement stations={stations} employees={employees} />
			</main>
			<Footer />
		</>
	);
}
