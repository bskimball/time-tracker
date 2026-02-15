"use client";

import { cn } from "~/lib/cn";
import { useManagerRealtime } from "~/lib/manager-realtime-client";

const TOPBAR_REALTIME_SCOPES = ["monitor", "tasks"] as const;

export function ManagerRealtimeTopbarIndicator({ className }: { className?: string }) {
	const realtime = useManagerRealtime({
		scopes: TOPBAR_REALTIME_SCOPES,
		invalidateOn: ["heartbeat"],
		pollingIntervalSeconds: 60,
		onInvalidate: () => {
			// Top bar indicator does not trigger route reloads.
		},
	});

	const stateLabel =
		realtime.connectionState === "connected"
			? "LIVE"
			: realtime.connectionState === "reconnecting"
				? "RETRY"
				: "OFF";

	const dotClassName =
		realtime.connectionState === "connected"
			? "bg-emerald-500"
			: realtime.connectionState === "reconnecting"
				? "bg-amber-500 animate-pulse"
				: "bg-muted-foreground/60";

	return (
		<div
			className={cn(
				"inline-flex items-center gap-2 rounded-[2px] border border-border/40 bg-background/40 px-2 py-1",
				className
			)}
			title={
				realtime.connectionState === "offline-fallback"
					? "Live stream offline; polling fallback active"
					: realtime.connectionState === "reconnecting"
						? "Reconnecting to live stream"
						: "Connected to live stream"
			}
		>
			<span className={cn("h-1.5 w-1.5 rounded-full", dotClassName)} aria-hidden="true" />
			<span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
				{stateLabel}
			</span>
			{realtime.usingPollingFallback ? (
				<span className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground/70">
					POLL
				</span>
			) : null}
		</div>
	);
}
