"use client";

import { useState, useEffect, type ReactNode } from "react";
import { Link, useLocation } from "react-router";
import { cn } from "~/lib/cn";
import { Button, LedIndicator, SafetyStripes, Badge } from "@monorepo/design-system";
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
		setIsMounted(true);
	}, []);

	return (
		<div className="flex h-screen overflow-hidden bg-background">
			{/* Precision Sidebar */}
			<aside
				data-collapsed={isCollapsed}
				className={cn(
					"bg-card relative flex flex-col border-r border-border transition-all duration-300 z-20 shrink-0 overflow-hidden",
					isCollapsed ? "w-16" : "w-72"
				)}
			>
				{/* Machined Header */}
				<div className="relative border-b border-border bg-muted/10 p-5 overflow-hidden group">
					<div className="absolute inset-0 bg-noise opacity-50 pointer-events-none" />
					<Link to={brandHref} className="relative flex items-center gap-4 z-10 hover:opacity-80 transition-opacity">
						<div className="relative">
							<div className="absolute inset-0 bg-primary/20 blur-md rounded-full animate-pulse" />
							<LedIndicator active className="relative z-10" />
						</div>
						
						{!isCollapsed && (
							<div className="flex flex-col">
								<span className="text-lg font-display font-bold tracking-tight text-foreground leading-none uppercase">
									{title}
								</span>
								<span className="text-[9px] font-mono text-muted-foreground tracking-widest uppercase mt-1">
									Sys.Ver 2.0.4
								</span>
							</div>
						)}
					</Link>
				</div>

				{/* Navigation Grid */}
				<nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1" data-collapsed={isCollapsed}>
					{navLinks.map((link) => {
						const isActive =
							location.pathname === link.to ||
							(link.to !== brandHref && location.pathname.startsWith(link.to));

						const Icon = link.icon ? iconMap[link.icon] : null;

						return (
							<Link key={link.to} to={link.to} className="block group">
								<div
									className={cn(
										"relative flex items-center transition-all duration-200 rounded-[2px] overflow-hidden",
										isCollapsed ? "justify-center h-10 w-10 mx-auto" : "h-10 px-3",
										isActive
											? "bg-primary text-primary-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"
											: "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
									)}
								>
									{/* Active State Marker (Left Strip) */}
									{isActive && (
										<div className="absolute left-0 top-0 bottom-0 w-[3px] bg-white/20" />
									)}

									{Icon ? (
										<Icon 
											className={cn(
												"h-4 w-4 shrink-0 transition-transform duration-200", 
												isActive ? "scale-110" : "group-hover:scale-110",
												!isCollapsed && "mr-3"
											)} 
										/>
									) : (
										<div className={cn("h-1.5 w-1.5 rounded-full bg-current opacity-50", !isCollapsed && "mr-3")} />
									)}

									{!isCollapsed && (
										<span className={cn(
											"text-xs font-industrial uppercase tracking-wider font-medium truncate",
											isActive ? "opacity-100" : "opacity-80 group-hover:opacity-100"
										)}>
											{link.label}
										</span>
									)}
									
									{/* Hover Tech Detail */}
									{!isCollapsed && !isActive && (
										<span className="ml-auto opacity-0 group-hover:opacity-30 text-[8px] font-mono transition-opacity">
											→
										</span>
									)}
								</div>
							</Link>
						);
					})}
				</nav>

				{/* Footer Control Panel */}
				<div className="border-t border-border bg-muted/5 p-3 space-y-3">
					{!isCollapsed && (
						<div className="px-1">
							<SafetyStripes position="top" className="mb-3 opacity-30" />
							{userSection && (
								<div className="mb-3 rounded-[2px] border border-border/50 bg-background p-3 shadow-sm">
									{userSection}
								</div>
							)}
						</div>
					)}

					<Button
						variant="outline"
						size="sm"
						onPress={() => setIsCollapsed((prev) => !prev)}
						className={cn(
							"w-full flex items-center justify-center border-dashed text-muted-foreground hover:text-foreground hover:border-solid hover:border-primary/50 transition-all",
							isCollapsed ? "h-10 w-10 p-0 mx-auto" : "h-9"
						)}
						aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
					>
						<svg
							className={cn(
								"h-4 w-4 transition-transform duration-300",
								!isCollapsed && "rotate-180"
							)}
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							aria-hidden="true"
						>
							<path
								strokeLinecap="square"
								strokeLinejoin="miter"
								strokeWidth={1.5}
								d="M13 5l7 7-7 7M5 5l7 7-7 7"
							/>
						</svg>
						{!isCollapsed && <span className="ml-2 text-[10px] font-mono uppercase tracking-widest">Collapse_Menu</span>}
					</Button>
				</div>
			</aside>

			{/* Main Content Area */}
			<main className="flex flex-1 flex-col overflow-hidden relative bg-background">
				<div className="absolute inset-0 bg-tactical-grid opacity-[0.03] pointer-events-none" />
				
				{/* Top Status Bar */}
				<div className="border-b border-border bg-background/80 backdrop-blur-sm px-6 py-3 sticky top-0 z-10 flex items-center justify-between">
					<div className="flex items-center gap-4">
						<Badge variant="outline" className="rounded-[1px] border-primary/20 text-primary bg-primary/5 text-[10px] py-0 h-5">
							<span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse mr-2" />
							SYSTEM_ONLINE
						</Badge>
						<div className="h-4 w-px bg-border/50" />
						<div className="text-xs font-mono text-muted-foreground flex items-center gap-2">
							<span className="opacity-50">LOC:</span>
							<span className="text-foreground">HQ_SERVER_01</span>
						</div>
					</div>

					<div className="flex items-center gap-3">
						<div className="font-mono text-xs text-muted-foreground tabular-nums tracking-wide">
							{isMounted
								? new Date().toLocaleString("en-US", {
										hour: "2-digit",
										minute: "2-digit",
										second: "2-digit",
										hour12: false,
									})
								: "--:--:--"}
						</div>
						<div className="font-mono text-xs text-muted-foreground border-l border-border/50 pl-3">
							{isMounted ? new Date().toLocaleDateString("en-US", { month: 'short', day: '2-digit' }).toUpperCase() : "-- ---"}
						</div>
					</div>
				</div>

				{/* Viewport */}
				<div id="main-content" className="flex-1 overflow-y-auto p-8 relative z-0" tabIndex={-1}>
					{children}
				</div>
			</main>
		</div>
	);
}

