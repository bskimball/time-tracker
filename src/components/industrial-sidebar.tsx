"use client";

import { useState, type ReactNode } from "react";
import { Link, useLocation } from "react-router";
import { cn } from "~/lib/cn";

interface NavLink {
	to: string;
	label: string;
	icon?: ReactNode;
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

	return (
		<div className="flex h-screen overflow-hidden bg-background">
			{/* Modern Sidebar */}
			<aside
				className={cn(
					"bg-sidebar relative flex flex-col border-r border-sidebar-border transition-all duration-300 shadow-sm",
					isCollapsed ? "w-16" : "w-64"
				)}
			>
				{/* Header with brand */}
				<div className="border-b border-sidebar-border bg-sidebar/50 p-4">
					<Link to={brandHref} className="flex items-center gap-3">
						{!isCollapsed && (
							<>
								<div className="led-indicator active" />
								<span className="text-xl font-bold tracking-tight text-sidebar-foreground">
									{title}
								</span>
							</>
						)}
						{isCollapsed && <div className="led-indicator active mx-auto" />}
					</Link>
				</div>

				{/* Navigation Links */}
				<nav className="flex-1 overflow-y-auto p-2">
					{navLinks.map((link) => {
						const isActive =
							location.pathname === link.to ||
							(link.to !== brandHref && location.pathname.startsWith(link.to));

						return (
							<Link key={link.to} to={link.to}>
								<div
									className={cn(
										"group relative mb-2 flex items-center gap-3 rounded-md border border-sidebar-border bg-sidebar-accent px-3 py-3 transition-all hover:bg-primary hover:text-primary-foreground hover:shadow-sm",
										isActive && "bg-primary text-primary-foreground shadow-sm"
									)}
								>
									{/* LED indicator */}
									<div className={cn("led-indicator", isActive && "active")} />

									{/* Label */}
									{!isCollapsed && <span className="text-sm font-medium">{link.label}</span>}
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
					<button
						onClick={() => setIsCollapsed(!isCollapsed)}
						className={cn(
							"flex w-full items-center justify-center rounded-md border border-sidebar-border bg-sidebar-accent px-3 py-2 text-sidebar-foreground transition-all hover:bg-sidebar-primary hover:text-sidebar-primary-foreground hover:shadow-sm"
						)}
						aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
					>
						<svg
							className={cn("h-5 w-5 transition-transform", !isCollapsed && "rotate-180")}
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M13 5l7 7-7 7M5 5l7 7-7 7"
							/>
						</svg>
						{!isCollapsed && <span className="ml-2 text-xs font-medium">Collapse</span>}
					</button>
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
								{new Date().toLocaleString("en-US", {
									weekday: "short",
									year: "numeric",
									month: "short",
									day: "numeric",
									hour: "2-digit",
									minute: "2-digit",
								})}
							</div>
						</div>
					</div>
				</div>

				{/* Content */}
				<div className="flex-1 overflow-y-auto p-6">{children}</div>
			</main>
		</div>
	);
}
