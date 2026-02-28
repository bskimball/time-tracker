"use client";

import {
	Children,
	createContext,
	isValidElement,
	useContext,
	useEffect,
	useMemo,
	useState,
	type ReactNode,
} from "react";
import { Link, useLocation, useNavigation } from "react-router";
import { cn } from "~/lib/cn";
import { Button, SafetyStripes } from "@monorepo/design-system";
import { IndustrialLoader } from "~/components/industrial-loader";
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

interface SidebarContextValue {
	isCollapsed: boolean;
	setIsCollapsed: (next: boolean | ((prev: boolean) => boolean)) => void;
	brandHref: string;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

function useSidebarContext() {
	const context = useContext(SidebarContext);
	if (!context) {
		throw new Error("IndustrialSidebar components must be used within IndustrialSidebar");
	}
	return context;
}

interface IndustrialSidebarRootProps {
	children: ReactNode;
	brandHref?: string;
}

function IndustrialSidebarRoot({ children, brandHref = "/" }: IndustrialSidebarRootProps) {
	const [isCollapsed, setIsCollapsed] = useState(false);

	const value = useMemo(
		() => ({ isCollapsed, setIsCollapsed, brandHref }),
		[isCollapsed, brandHref]
	);

	return (
		<SidebarContext.Provider value={value}>
			<div className="flex h-screen overflow-hidden bg-background">{children}</div>
		</SidebarContext.Provider>
	);
}

interface IndustrialSidebarSidebarProps {
	children: ReactNode;
	className?: string;
}

function IndustrialSidebarSidebar({ children, className }: IndustrialSidebarSidebarProps) {
	const { isCollapsed } = useSidebarContext();

	return (
		<aside
			data-collapsed={isCollapsed}
			className={cn(
				"relative flex flex-col border-r border-border transition-all duration-300 z-20 shrink-0 overflow-hidden bg-background",
				isCollapsed ? "w-16" : "w-72",
				className
			)}
		>
			{children}
		</aside>
	);
}

interface IndustrialSidebarHeaderProps {
	title: string;
	brandHref?: string;
}

function IndustrialSidebarHeader({ title, brandHref }: IndustrialSidebarHeaderProps) {
	const { isCollapsed, brandHref: contextHref } = useSidebarContext();
	const href = brandHref ?? contextHref;

	return (
		<div className="relative border-b border-border bg-muted/10 p-5 overflow-hidden group">
			<div className="absolute inset-0 bg-noise opacity-50 pointer-events-none" />
			<Link
				to={href}
				className="relative flex items-center gap-4 z-10 hover:opacity-80 transition-opacity"
			>
				<div className="relative z-10 w-7 h-7 border border-primary/60 bg-primary/10 flex items-center justify-center text-primary font-mono text-xs font-bold tracking-wider shrink-0">
					SP
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
	);
}

interface IndustrialSidebarNavProps {
	children: ReactNode;
	className?: string;
}

function IndustrialSidebarNav({ children, className }: IndustrialSidebarNavProps) {
	const { isCollapsed } = useSidebarContext();

	return (
		<nav
			className={cn("flex-1 overflow-y-auto py-4 px-3 space-y-1", className)}
			data-collapsed={isCollapsed}
		>
			{children}
		</nav>
	);
}

interface IndustrialSidebarItemProps extends NavLink {
	className?: string;
}

function IndustrialSidebarItem({ to, label, icon, className }: IndustrialSidebarItemProps) {
	const { isCollapsed, brandHref } = useSidebarContext();
	const location = useLocation();
	const isActive =
		location.pathname === to || (to !== brandHref && location.pathname.startsWith(to));
	const Icon = icon ? iconMap[icon] : null;

	return (
		<Link to={to} className={cn("block group", className)}>
			<div
				title={isCollapsed ? label : undefined}
				className={cn(
					"relative flex items-center transition-all duration-200 rounded-[2px] overflow-hidden",
					isCollapsed ? "justify-center h-10 w-10 mx-auto" : "h-10 px-3",
					isActive
						? "bg-primary text-primary-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"
						: "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
				)}
			>
				{isActive && (
					<div className="absolute left-0 top-0 bottom-0 w-[3px] bg-white/40 shadow-[0_0_12px_rgba(255,255,255,0.5)]" />
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
					<div
						className={cn("h-1.5 w-1.5 rounded-full bg-current opacity-50", !isCollapsed && "mr-3")}
					/>
				)}

				{!isCollapsed && (
					<span
						className={cn(
							"text-xs font-industrial uppercase tracking-wider font-medium truncate",
							isActive ? "opacity-100" : "opacity-80 group-hover:opacity-100"
						)}
					>
						{label}
					</span>
				)}

				{!isCollapsed && !isActive && (
					<div className="ml-auto opacity-0 group-hover:opacity-100 flex items-center -space-x-[2px] transition-opacity duration-200 pr-1">
						{[0, 1].map((i) => (
							<span
								key={i}
								className="text-xs font-mono font-bold text-primary animate-sequence-pulse"
								style={{
									animationDelay: `${i * 100}ms`,
									animationDuration: "1.5s",
								}}
							>
								›
							</span>
						))}
					</div>
				)}
			</div>
		</Link>
	);
}

interface IndustrialSidebarDividerProps {
	className?: string;
}

function IndustrialSidebarDivider({ className }: IndustrialSidebarDividerProps) {
	return <div aria-hidden="true" className={cn("h-px bg-border/50 my-3", className)} />;
}

interface IndustrialSidebarCollapseButtonProps {
	className?: string;
}

function IndustrialSidebarCollapseButton({ className }: IndustrialSidebarCollapseButtonProps) {
	const { isCollapsed, setIsCollapsed } = useSidebarContext();

	return (
		<Button
			variant="ghost"
			size="sm"
			onPress={() => setIsCollapsed((prev) => !prev)}
			className={cn(
				"w-full flex items-center justify-center border border-border/30 bg-muted/20 text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-background transition-all duration-200",
				isCollapsed ? "h-9 w-9 p-0 mx-auto" : "h-9",
				className
			)}
			aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
			aria-expanded={!isCollapsed}
		>
			<svg
				className={cn("h-4 w-4 transition-transform duration-300", !isCollapsed && "rotate-180")}
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
		</Button>
	);
}

interface IndustrialSidebarFooterProps {
	children: ReactNode;
	className?: string;
}

function IndustrialSidebarFooter({ children, className }: IndustrialSidebarFooterProps) {
	const { isCollapsed } = useSidebarContext();
	const items = Children.toArray(children);
	const content: ReactNode[] = [];
	const collapseButtons: ReactNode[] = [];

	items.forEach((child) => {
		if (isValidElement(child) && child.type === IndustrialSidebarCollapseButton) {
			collapseButtons.push(child);
			return;
		}
		content.push(child);
	});

	return (
		<div className={cn("border-t border-border bg-muted/30 pb-3 pt-0", className)}>
			{!isCollapsed && (
				<>
					<div className="h-px w-full bg-gradient-to-r from-transparent via-border/40 to-transparent mb-4" />

					{content.length > 0 && (
						<div className="px-3 mb-4 space-y-4">
							<div className="flex items-center gap-3 opacity-40 mb-3">
								<SafetyStripes className="h-1.5 flex-1" />
							</div>
							<div className="space-y-3">{content}</div>
						</div>
					)}
				</>
			)}
			<div className={cn("px-3", isCollapsed && "pt-3")}>{collapseButtons}</div>
		</div>
	);
}

interface IndustrialSidebarMainProps {
	children: ReactNode;
	className?: string;
}

function IndustrialSidebarMain({ children, className }: IndustrialSidebarMainProps) {
	return (
		<main className={cn("flex flex-1 flex-col overflow-hidden relative bg-background", className)}>
			<div className="absolute inset-0 bg-tactical-grid opacity-[0.03] pointer-events-none" />
			{children}
		</main>
	);
}

interface IndustrialSidebarStatusBarProps {
	className?: string;
	children?: ReactNode;
}

function IndustrialSidebarStatusBar({ className, children }: IndustrialSidebarStatusBarProps) {
	const [now, setNow] = useState<Date | null>(null);
	const navigation = useNavigation();
	const isAnimating = navigation.state !== "idle";

	useEffect(() => {
		// Update immediately (next tick) to show time but avoid synchronous setState warning
		const initial = setTimeout(() => setNow(new Date()), 0);
		const timer = setInterval(() => setNow(new Date()), 1000);
		return () => {
			clearTimeout(initial);
			clearInterval(timer);
		};
	}, []);

	return (
		<div
			className={cn(
				"bg-background/80 backdrop-blur-sm px-6 py-3 sticky top-0 z-10 flex items-center justify-between border-b border-border",
				className
			)}
		>
			<div className="flex items-center gap-4">
				<IndustrialLoader variant="processing" className="opacity-60" isAnimated={isAnimating} />
			</div>

			<div className="flex items-center gap-3">
				{children ? <div className="flex items-center">{children}</div> : null}
				<div className="font-mono text-xs text-muted-foreground tabular-nums tracking-wide">
					{now
						? now.toLocaleString("en-US", {
								hour: "2-digit",
								minute: "2-digit",
								second: "2-digit",
								hour12: false,
							})
						: "--:--:--"}
				</div>
				<div className="font-mono text-xs text-muted-foreground border-l border-border/50 pl-3">
					{now
						? now.toLocaleDateString("en-US", { month: "short", day: "2-digit" }).toUpperCase()
						: "-- ---"}
				</div>
			</div>
		</div>
	);
}

/**
 * IndustrialSidebar - Composable Sidebar System
 * Following the Precision Industrial (Braun/Rams) aesthetic.
 */
export const IndustrialSidebar = Object.assign(IndustrialSidebarRoot, {
	Sidebar: IndustrialSidebarSidebar,
	Header: IndustrialSidebarHeader,
	Nav: IndustrialSidebarNav,
	Item: IndustrialSidebarItem,
	Divider: IndustrialSidebarDivider,
	Footer: IndustrialSidebarFooter,
	CollapseButton: IndustrialSidebarCollapseButton,
	Main: IndustrialSidebarMain,
	StatusBar: IndustrialSidebarStatusBar,
});
