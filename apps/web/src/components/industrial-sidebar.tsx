"use client";

import { useState, useEffect, type ReactNode } from "react";
import { Link, useLocation } from "react-router";
import { cn } from "~/lib/cn";
import { Button, LedIndicator } from "@monorepo/design-system";
import {
	LiaTachometerAltSolid,
	LiaDesktopSolid,
	LiaUsersSolid,
	LiaClipboardListSolid,
	LiaChartBarSolid,
	LiaCalendarAltSolid,
	LiaTasksSolid,
	LiaCrownSolid,
	LiaChartLineSolid,
	LiaCogSolid,
	LiaClipboardCheckSolid,
	LiaBriefcaseSolid,
} from "react-icons/lia";

const iconMap = {
	dashboard: LiaTachometerAltSolid,
	monitor: LiaDesktopSolid,
	users: LiaUsersSolid,
	timesheets: LiaClipboardListSolid,
	reports: LiaChartBarSolid,
	schedule: LiaCalendarAltSolid,
	tasks: LiaTasksSolid,
	crown: LiaCrownSolid,
	analytics: LiaChartLineSolid,
	settings: LiaCogSolid,
	clipboard: LiaClipboardCheckSolid,
	briefcase: LiaBriefcaseSolid,
};

interface NavLink {
	to: string;
	label: string;
	icon?: keyof typeof iconMap;
}

interface IndustrialSidebarProps {
	title: string;
	brandHref?: string;
	navLinks?: NavLink[];
	children: ReactNode;
	userSection?: ReactNode;
}

export function IndustrialSidebar({
	title,
	brandHref = "/",
	navLinks = [],
	children,
	userSection,
}: IndustrialSidebarProps) {
	const [isCollapsed, setIsCollapsed] = useState(false);
	const location = useLocation();
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setIsMounted(true);
	}, []);

	return (
		<div className="flex h-screen overflow-hidden bg-background">
			{/* Modern Sidebar */}
			<aside
				data-collapsed={isCollapsed}
				className={cn(
					"bg-sidebar relative flex flex-col border-r border-sidebar-border transition-all duration-300 shadow-sm z-20 shrink-0 overflow-hidden",
					isCollapsed ? "w-16" : "w-64"
				)}
			>
				{/* Header with brand */}
				<div className="border-b border-sidebar-border bg-sidebar/50 p-4">
					<Link to={brandHref} className="flex items-center gap-3">
						{!isCollapsed && (
							<>
								<LedIndicator active />
								<span className="text-lg font-industrial font-bold tracking-widest text-sidebar-foreground uppercase">
									{title}
								</span>
							</>
						)}
						{isCollapsed && <LedIndicator active className="mx-auto" />}
					</Link>
				</div>

				{/* Navigation Links */}
				<nav className="flex-1 overflow-y-auto p-2" data-collapsed={isCollapsed}>
					{navLinks.map((link) => {
						const isActive =
							location.pathname === link.to ||
							(link.to !== brandHref && location.pathname.startsWith(link.to));

						const Icon = link.icon ? iconMap[link.icon] : null;

						return (
							<Link key={link.to} to={link.to}>
								<div
									className={cn(
										"group relative mb-2 flex w-full items-center rounded-[2px] border transition-all duration-200",
										isCollapsed ? "justify-center px-2 py-3" : "gap-3 px-3 py-2",
										isActive
											? "bg-primary text-primary-foreground border-primary shadow-industrial"
											: "bg-sidebar-accent border-sidebar-border text-sidebar-foreground hover:border-primary/50 hover:bg-muted/50"
									)}
								>
									{Icon ? (
										<Icon className={cn("h-5 w-5 shrink-0", isCollapsed && "mx-auto")} />
									) : (
										<LedIndicator
											active={isActive}
											className={cn(isCollapsed && "mx-auto")}
										/>
									)}

									{!isCollapsed && <span className="text-xs font-industrial font-bold uppercase tracking-wide">{link.label}</span>}
								</div>
							</Link>
						);
					})}
				</nav>

				{/* User section and collapse toggle */}
				<div className="border-t border-sidebar-border bg-sidebar/50 p-2">
					{!isCollapsed && userSection && (
						<div className="mb-2 rounded-md border border-sidebar-border bg-sidebar-accent p-2 text-xs text-sidebar-foreground">
							{userSection}
						</div>
					)}

					{/* Collapse toggle button */}
					<Button
						variant="ghost"
						size="sm"
						onPress={() => setIsCollapsed((prev) => !prev)}
						className={cn(
							"flex w-full items-center justify-center rounded-[2px] border border-sidebar-border bg-sidebar-accent px-3 py-2 text-sidebar-foreground transition-all hover:border-primary/50 hover:bg-muted/50 cursor-pointer relative z-50",
							isCollapsed ? "justify-center" : "justify-start"
						)}
						aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
					>
						<svg
							className={cn(
								"h-5 w-5 transition-transform pointer-events-none",
								!isCollapsed && "rotate-180"
							)}
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							aria-hidden="true"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M13 5l7 7-7 7M5 5l7 7-7 7"
							/>
						</svg>
						{!isCollapsed && <span className="ml-2 text-xs font-medium">Collapse</span>}
					</Button>
				</div>
			</aside>

			{/* Main content area */}
			<main className="flex flex-1 flex-col overflow-hidden">
				{/* Top bar */}
				<div className="border-b border-border bg-muted/30 px-6 py-3 shadow-sm">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<div className="h-2 w-2 rounded-full bg-primary" />
							<div className="text-sm text-muted-foreground">
								{isMounted
									? new Date().toLocaleString("en-US", {
											weekday: "short",
											year: "numeric",
											month: "short",
											day: "numeric",
											hour: "2-digit",
											minute: "2-digit",
										})
									: "Loading…"}
							</div>
						</div>
					</div>
				</div>

				{/* Content */}
				<div id="main-content" className="flex-1 overflow-y-auto p-6" tabIndex={-1}>
					{children}
				</div>
			</main>
		</div>
	);
}
