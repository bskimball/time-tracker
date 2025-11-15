import type { ReactNode } from "react";
import { Link } from "react-router";
import { Button } from "~/components/ds";
import { ThemeToggle } from "~/components/theme-toggle";
import { cn } from "~/lib/cn";

interface AppNavLink {
	label: string;
	to: string;
}

interface AppLayoutProps {
	title: string;
	brandHref?: string;
	navLinks?: AppNavLink[];
	children: ReactNode;
	className?: string;
}

export function AppLayout({
	title,
	brandHref = "/",
	navLinks = [],
	children,
	className = "",
}: AppLayoutProps) {
	return (
		<div className={cn("min-h-screen bg-background", className)}>
			<nav className="border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
				<div className="container mx-auto px-4">
					<div className="flex h-16 items-center justify-between">
						<div className="flex items-center space-x-4">
							<Link to={brandHref} className="flex items-center space-x-2">
								<span className="text-xl font-bold">{title}</span>
							</Link>
							{navLinks.length > 0 ? (
								<div className="flex flex-wrap gap-1">
									{navLinks.map((link) => (
										<Link key={link.to} to={link.to}>
											<Button variant="ghost" size="sm">
												{link.label}
											</Button>
										</Link>
									))}
								</div>
							) : null}
						</div>
						<div className="flex items-center space-x-2">
							<ThemeToggle />
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
			<main className="container mx-auto px-4 py-6">{children}</main>
		</div>
	);
}
