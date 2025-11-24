import type { ReactNode } from "react";
import { IndustrialSidebar } from "~/components/industrial-sidebar";
import { ThemeToggle } from "~/components/theme-toggle";
import { LogoutButton } from "~/components/logout-button";

interface AppNavLink {
	label: string;
	to: string;
	icon?: "dashboard" | "monitor" | "users" | "timesheets" | "reports" | "schedule" | "tasks" | "crown" | "analytics" | "settings" | "clipboard";
}

interface AppLayoutProps {
	title: string;
	brandHref?: string;
	navLinks?: AppNavLink[];
	children: ReactNode;
}

export function AppLayout({ title, brandHref = "/", navLinks = [], children }: AppLayoutProps) {
	// User section with theme toggle and logout
	const userSection = (
		<div className="flex flex-col gap-2">
			<div className="flex items-center justify-between">
				<span className="font-mono-industrial text-xs uppercase">Theme</span>
				<ThemeToggle />
			</div>
			<LogoutButton />
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
