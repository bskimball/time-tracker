import { Outlet } from "react-router";
import { Link } from "react-router";
import { Button } from "~/components/ds/button";

export default async function Component() {
	return (
		<div className="min-h-screen bg-background">
			<nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
				<div className="container mx-auto px-4">
					<div className="flex h-16 items-center justify-between">
						<div className="flex items-center space-x-4">
							<Link to="/floor" className="flex items-center space-x-2">
								<span className="text-xl font-bold">Floor Operations</span>
							</Link>
							<div className="flex space-x-1">
								<Button variant="ghost" size="sm">
									Clock
								</Button>
								<Link to="/floor/kiosk">
									<Button variant="ghost" size="sm">
										Kiosk
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
