"use client";

import type { ReactNode } from "react";
import { IndustrialSidebar } from "~/components/industrial-sidebar";
import { ThemeToggle } from "~/components/theme-toggle";
import { LogoutButton } from "~/components/logout-button";
import { LiaIdBadgeSolid } from "react-icons/lia";

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
	statusBarSlot?: ReactNode;
	currentUser?: {
		name: string | null;
		email: string;
		role: string;
	} | null;
	children: ReactNode;
}

export function AppLayout({
	title,
	brandHref = "/",
	navLinks = [],
	statusBarSlot,
	currentUser = null,
	children,
}: AppLayoutProps) {
	// Composable Layout using IndustrialSidebar Compound Components
	const userSection = (
		<div className="flex flex-col gap-3">
			{currentUser ? (
				<div className="relative overflow-hidden rounded-[2px] border border-border/70 bg-background px-3 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
					<div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/45 to-transparent" />
					<div className="flex items-center gap-3">
						<div className="flex h-9 w-9 shrink-0 items-center justify-center border border-primary/40 bg-primary/10 text-primary">
							<LiaIdBadgeSolid className="h-4 w-4" />
						</div>
						<div className="min-w-0 flex-1">
							<div className="flex items-center justify-between gap-2 mb-1">
								<p className="font-industrial text-[9px] uppercase tracking-[0.22em] text-foreground/65 dark:text-muted-foreground">
									Logged In
								</p>
								<span className="inline-flex items-center rounded-[2px] border border-primary/25 bg-primary/10 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.18em] text-primary">
									{currentUser.role}
								</span>
							</div>
							<p className="truncate text-sm font-semibold text-foreground leading-none">
								{currentUser.name || currentUser.email}
							</p>
							<p className="truncate text-xs text-foreground/70 dark:text-muted-foreground mt-0.5">
								{currentUser.email}
							</p>
						</div>
					</div>
				</div>
			) : null}

			<div className="flex flex-col gap-3">
				<div className="flex items-center justify-between px-1">
					<span className="font-mono-industrial text-xs">Theme</span>
					<ThemeToggle />
				</div>
				<LogoutButton />
			</div>
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
				<IndustrialSidebar.StatusBar>{statusBarSlot}</IndustrialSidebar.StatusBar>
				<div id="main-content" className="flex-1 overflow-y-auto p-6 relative z-0" tabIndex={-1}>
					{children}
				</div>
			</IndustrialSidebar.Main>
		</IndustrialSidebar>
	);
}
