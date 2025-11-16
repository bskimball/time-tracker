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
			{/* Industrial Sidebar */}
			<aside
				className={cn(
					"bg-metal relative flex flex-col border-r-2 border-sidebar-border transition-all duration-300",
					isCollapsed ? "w-16" : "w-64",
				)}
			>
				{/* Rivet decorations at top corners */}
				<div className="absolute left-2 top-2 rivet" />
				<div className="absolute right-2 top-2 rivet" />

				{/* Header with brand */}
				<div className="border-b-2 border-sidebar-border bg-sidebar p-4">
					<Link to={brandHref} className="flex items-center gap-3">
						{!isCollapsed && (
							<>
								<div className="led-indicator active" />
								<span className="font-industrial text-xl font-bold uppercase tracking-wider text-sidebar-foreground">
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
						const isActive = location.pathname === link.to ||
							(link.to !== brandHref && location.pathname.startsWith(link.to));

						return (
							<Link key={link.to} to={link.to}>
								<div
									className={cn(
										"panel-shadow group relative mb-2 flex items-center gap-3 border border-sidebar-border bg-sidebar-accent px-3 py-3 transition-all hover:bg-primary hover:text-primary-foreground",
										isActive && "bg-primary text-primary-foreground",
									)}
								>
									{/* LED indicator */}
									<div className={cn("led-indicator", isActive && "active")} />

									{/* Label */}
									{!isCollapsed && (
										<span className="font-industrial text-sm font-semibold uppercase tracking-wide">
											{link.label}
										</span>
									)}

									{/* Decorative rivet */}
									{!isCollapsed && (
										<div className="rivet absolute right-2 top-1/2 -translate-y-1/2" />
									)}
								</div>
							</Link>
						);
					})}
				</nav>

				{/* Rivets at bottom corners */}
				<div className="absolute bottom-16 left-2 rivet" />
				<div className="absolute bottom-16 right-2 rivet" />

				{/* User section and collapse toggle */}
				<div className="border-t-2 border-sidebar-border bg-sidebar p-2">
					{!isCollapsed && userSection && (
						<div className="mb-2 border border-sidebar-border bg-sidebar-accent p-2 text-xs text-sidebar-foreground">
							{userSection}
						</div>
					)}

					{/* Collapse toggle button */}
					<button
						onClick={() => setIsCollapsed(!isCollapsed)}
						className={cn(
							"panel-shadow flex w-full items-center justify-center border border-sidebar-border bg-sidebar-accent px-3 py-2 text-sidebar-foreground transition-colors hover:bg-sidebar-primary hover:text-sidebar-primary-foreground",
						)}
						aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
					>
						<svg
							className={cn("h-5 w-5 transition-transform", !isCollapsed && "rotate-180")}
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
						</svg>
						{!isCollapsed && (
							<span className="font-industrial ml-2 text-xs font-semibold uppercase tracking-wide">
								Collapse
							</span>
						)}
					</button>
				</div>
			</aside>

			{/* Main content area */}
			<main className="flex flex-1 flex-col overflow-hidden">
				{/* Top bar with warehouse floor pattern */}
				<div className="border-b-2 border-border bg-muted px-6 py-3">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<div className="h-3 w-3 border-2 border-primary" />
							<div className="font-mono-industrial text-sm text-muted-foreground">
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
