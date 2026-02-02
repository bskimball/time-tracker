"use client";

import { Link } from "react-router";
import { Nav } from "./nav";
import { ThemeToggle } from "./theme-toggle";

export function Header({
	userName,
	userRole,
}: {
	userName: string | null;
	userRole: string | null;
}) {
	return (
		<div className="container pt-16 mx-auto">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold">
					Time Tracker <sup>v4</sup>
				</h1>
				<div className="flex items-center gap-4">
					<Nav userRole={userRole} />
					<ThemeToggle />
				</div>
				<div>
					{userName ? (
						<div className="flex items-center gap-4">
							<p>Signed in as {userName}</p>
							<a href="/logout" className="text-primary hover:underline">
								Logout
							</a>
						</div>
					) : (
						<div className="flex items-center gap-4">
							<p>Not signed in</p>
							<Link to="/login" className="text-primary hover:underline">
								Login
							</Link>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
