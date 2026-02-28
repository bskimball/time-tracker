import { cn } from "~/lib/cn";
import { LiaSyncSolid } from "react-icons/lia";
import type { useManagerRealtime } from "~/lib/manager-realtime-client";

type ManagerConnectionStatusProps = {
	label?: string;
	lastSyncedAt: Date;
	realtime: ReturnType<typeof useManagerRealtime>;
	onRefresh: () => void;
	isRefreshing: boolean;
	className?: string;
};

export function ManagerConnectionStatus({
	label = "Live Stream Status",
	lastSyncedAt,
	realtime,
	onRefresh,
	isRefreshing,
	className,
}: ManagerConnectionStatusProps) {
	const secondsSinceRefresh = Math.max(
		0,
		Math.floor((new Date().getTime() - lastSyncedAt.getTime()) / 1000)
	);

	// Determine freshness state
	// If fallback polling is active, we tolerate a bit more lag (3m vs 2m)
	const staleThreshold = realtime.usingPollingFallback ? 180 : 120;
	const isStale = secondsSinceRefresh >= staleThreshold;

	const connectionState = realtime.connectionState;

	// Connection Status Dot Color
	const statusColor =
		connectionState === "connected"
			? "bg-emerald-500"
			: connectionState === "reconnecting"
				? "bg-amber-500 animate-pulse"
				: "bg-destructive";

	return (
		<div
			className={cn(
				"flex items-stretch rounded-[2px] border border-border bg-card shadow-sm h-9 overflow-hidden select-none",
				className
			)}
		>
			{/* Status & Time Section */}
			<div className="flex items-center px-3 gap-3 bg-muted/10">
				<div className="flex flex-col justify-center h-full">
					<div className="flex items-center gap-1.5">
						<div
							className={cn(
								"w-1.5 h-1.5 rounded-full shadow-[0_0_4px_rgba(0,0,0,0.2)]",
								statusColor
							)}
						/>
						<span className="text-[10px] font-bold font-heading uppercase tracking-wider text-foreground/80">
							{label}
						</span>
					</div>
				</div>

				<div className="w-px h-4 bg-border/60" />

				<div className="flex flex-col justify-center h-full min-w-[80px]">
					<div className="flex items-baseline gap-1.5">
						<span className="text-xs font-mono font-medium leading-none text-foreground tabular-nums">
							{lastSyncedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
						</span>
						<span
							className={cn(
								"text-[9px] font-mono uppercase leading-none",
								isStale ? "text-amber-600 font-bold" : "text-muted-foreground"
							)}
						>
							{isStale ? "STALE" : "FRESH"}
						</span>
					</div>
				</div>
			</div>

			{/* Live Indicator Section */}
			<div className="flex items-center px-3 border-l border-border bg-background">
				<div className="flex flex-col">
					<div className="flex items-center gap-1.5">
						<span
							className={cn(
								"text-[9px] uppercase tracking-wider font-medium",
								connectionState === "connected" ? "text-emerald-600" : "text-amber-600"
							)}
						>
							{connectionState === "connected" ? "Live Stream" : "Live Stream Reconnecting"}
						</span>
						{realtime.usingPollingFallback && (
							<span className="text-[8px] px-1 py-0.5 rounded-[1px] bg-muted text-muted-foreground font-mono uppercase">
								Polling
							</span>
						)}
					</div>
				</div>
			</div>

			{/* Refresh Action */}
			<button
				type="button"
				onClick={onRefresh}
				disabled={isRefreshing}
				className={cn(
					"flex items-center justify-center w-9 border-l border-border hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset transition-colors",
					isRefreshing ? "cursor-wait opacity-70" : "cursor-pointer"
				)}
				title="Refresh Data"
			>
				<LiaSyncSolid
					className={cn("w-3.5 h-3.5 text-muted-foreground", isRefreshing && "animate-spin")}
				/>
			</button>
		</div>
	);
}
