"use client";

import type { ReactNode } from "react";
import { IndustrialSidebar } from "~/components/industrial-sidebar";
import { ThemeToggle } from "~/components/theme-toggle";
import { LogoutButton } from "~/components/logout-button";

export interface AppNavLink {
	label: string;
	to: string;
	icon?:
	| "dashboard"
	| "monitor"
	| "users"
	| "timesheets"
	| "reports"
	| "schedule"
	| "tasks"
	| "crown"
	| "analytics"
	| "settings"
	| "clipboard"
	| "briefcase";
}

interface AppLayoutProps {
	title: string;
	brandHref?: string;
	navLinks?: AppNavLink[];
	children: ReactNode;
}

export function AppLayout({ title, brandHref = "/", navLinks = [], children }: AppLayoutProps) {
	// Composable Layout using IndustrialSidebar Compound Components
	const userSection = (
		<div className="flex flex-col gap-2">
			<div className="flex items-center justify-between">
				<span className="font-mono-industrial text-xs">Theme</span>
				<ThemeToggle />
			</div>
			<LogoutButton />
		</div>
	);

	return (
		<IndustrialSidebar brandHref={brandHref}>
			<IndustrialSidebar.Sidebar>
				<IndustrialSidebar.Header title={title} brandHref={brandHref} />
				<IndustrialSidebar.Nav>
					{navLinks.map((link) => (
						<IndustrialSidebar.Item
							key={link.to}
							to={link.to}
							label={link.label}
							icon={link.icon}
						/>
					))}
				</IndustrialSidebar.Nav>
				<IndustrialSidebar.Footer>
					{userSection}
					<IndustrialSidebar.CollapseButton />
				</IndustrialSidebar.Footer>
			</IndustrialSidebar.Sidebar>
			<IndustrialSidebar.Main>
				<IndustrialSidebar.StatusBar />
				<div id="main-content" className="flex-1 overflow-y-auto p-6 relative z-0" tabIndex={-1}>
					{children}
				</div>
			</IndustrialSidebar.Main>
		</IndustrialSidebar>
	);
}
