import { Outlet } from "react-router";
import { Link } from "react-router";
import { Button } from "~/components/ds/button";
import { validateRequest } from "~/lib/auth";

export default async function Component() {
	await validateRequest();
	// Middleware ensures user has MANAGER or ADMIN role

	return (
		<div className="min-h-screen bg-background">
			<nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
				<div className="container mx-auto px-4">
					<div className="flex h-16 items-center justify-between">
						<div className="flex items-center space-x-4">
							<Link to="/manager" className="flex items-center space-x-2">
								<span className="text-xl font-bold">Manager Portal</span>
							</Link>
							<div className="flex space-x-1">
								<Link to="/manager">
									<Button variant="ghost" size="sm">
										Dashboard
									</Button>
								</Link>
								<Link to="/manager/monitor">
									<Button variant="ghost" size="sm">
										Floor Monitor
									</Button>
								</Link>
								<Link to="/manager/employees">
									<Button variant="ghost" size="sm">
										Employees
									</Button>
								</Link>
								<Link to="/manager/timesheets">
									<Button variant="ghost" size="sm">
										Timesheets
									</Button>
								</Link>
								<Link to="/manager/reports">
									<Button variant="ghost" size="sm">
										Reports
									</Button>
								</Link>
								<Link to="/manager/schedule">
									<Button variant="ghost" size="sm">
										Schedule
									</Button>
								</Link>
								<Link to="/manager/tasks">
									<Button variant="ghost" size="sm">
										Tasks
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
