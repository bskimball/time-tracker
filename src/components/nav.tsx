"use client";

import { Link } from "react-router";

export function Nav({ userRole }: { userRole: string | null }) {
	const buttonClass =
		"px-4 py-2 text-foreground hover:bg-muted active:bg-accent disabled:text-muted disabled:cursor-not-allowed rounded transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background";

	// Determine dashboard link based on role
	const dashboardLink =
		userRole === "ADMIN" ? "/executive" : userRole === "MANAGER" ? "/manager" : "/floor";

	return (
		<nav className="flex space-x-4">
			<Link to={dashboardLink} className={buttonClass}>
				Dashboard
			</Link>
			<Link to="/floor" className={buttonClass}>
				Time Clock
			</Link>
			{userRole === "ADMIN" && (
				<Link to="/settings" className={buttonClass}>
					Settings
				</Link>
			)}
			<Link to="/todo" className={buttonClass}>
				Todo
			</Link>
		</nav>
	);
}
