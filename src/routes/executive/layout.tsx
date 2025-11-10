import { Outlet } from "react-router";
import { Link } from "react-router";
import { Button } from "~/components/ds/button";
import { validateRequest } from "~/lib/auth";

export default async function Component() {
	await validateRequest();
	// Middleware ensures ADMIN role

	return (
		<div className="min-h-screen bg-background">
			<nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
				<div className="container mx-auto px-4">
					<div className="flex h-16 items-center justify-between">
						<div className="flex items-center space-x-4">
							<Link to="/executive" className="flex items-center space-x-2">
								<span className="text-xl font-bold">Executive Portal</span>
							</Link>
							<div className="flex space-x-1">
								<Link to="/executive">
									<Button variant="ghost" size="sm">
										Dashboard
									</Button>
								</Link>
								<Link to="/executive/analytics">
									<Button variant="ghost" size="sm">
										Analytics
									</Button>
								</Link>
							</div>
						</div>
						<div className="flex items-center space-x-2">
							<Link to="/">
								<Button variant="outline" size="sm">
									Home
								</Button>
							</Link>
						</div>
					</div>
				</div>
			</nav>
			<main className="container mx-auto px-4 py-6">
				<Outlet />
			</main>
		</div>
	);
}
