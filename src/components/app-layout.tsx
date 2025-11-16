import type { ReactNode } from "react";
import { IndustrialSidebar } from "~/components/industrial-sidebar";
import { ThemeToggle } from "~/components/theme-toggle";
import { Button } from "~/components/ds";

interface AppNavLink {
	label: string;
	to: string;
}

interface AppLayoutProps {
	title: string;
	brandHref?: string;
	navLinks?: AppNavLink[];
	children: ReactNode;
}

export function AppLayout({
	title,
	brandHref = "/",
	navLinks = [],
	children,
}: AppLayoutProps) {
	// User section with theme toggle and logout
	const userSection = (
		<div className="flex flex-col gap-2">
			<div className="flex items-center justify-between">
				<span className="font-mono-industrial text-xs uppercase">Theme</span>
				<ThemeToggle />
			</div>
			<a href="/logout" className="w-full">
				<Button variant="error" size="sm" className="w-full">
					Logout
				</Button>
			</a>
		</div>
	);

	return (
		<IndustrialSidebar
			title={title}
			brandHref={brandHref}
			navLinks={navLinks}
			userSection={userSection}
		>
			{children}
		</IndustrialSidebar>
	);
}
