"use client";

import { cn } from "~/lib/cn";
import { useManagerRealtime } from "~/lib/manager-realtime-client";

const TOPBAR_REALTIME_SCOPES = ["monitor", "tasks"] as const;
const TOPBAR_INVALIDATION_EVENTS = ["heartbeat"] as const;

export function ManagerRealtimeTopbarIndicator({ className }: { className?: string }) {
	const realtime = useManagerRealtime({
		scopes: TOPBAR_REALTIME_SCOPES,
		invalidateOn: TOPBAR_INVALIDATION_EVENTS,
		pollingIntervalSeconds: 60,
		onInvalidate: () => {
			// Top bar indicator does not trigger route reloads.
		},
	});

	// Derive state for cleaner rendering
	const isConnected = realtime.connectionState === "connected";
	const isReconnecting = realtime.connectionState === "reconnecting";
	const isPolling = realtime.connectionState === "offline-fallback";

	// Determine visual properties based on state
	let label = "OFFLINE";
	let dotColor = "bg-muted-foreground";
	let dotAnimation = "";
	let containerBorder = "border-border/40";
	let title = "Stream offline";

	if (isConnected) {
		label = "LIVE";
		dotColor = "bg-[var(--color-success)] shadow-[0_0_6px_var(--color-success)]";
		title = "Connected to live stream";
	} else if (isReconnecting) {
		label = "SYNC";
		dotColor = "bg-[var(--color-warning)]";
		dotAnimation = "animate-pulse";
		title = "Reconnecting to live stream...";
	} else if (isPolling) {
		label = "POLL";
		dotColor = "bg-[var(--color-warning)]";
		containerBorder = "border-[var(--color-warning)]/30";
		title = "Live stream offline; polling fallback active";
	}

	return (
		<div
			className={cn(
				"group inline-flex h-6 items-center gap-2 rounded-[2px] border bg-background/50 px-2 backdrop-blur-[2px] transition-all duration-300",
				containerBorder,
				className
			)}
			title={title}
			role="status"
			aria-live="polite"
		>
			<span className="relative flex h-1.5 w-1.5 items-center justify-center">
				{isConnected && (
					<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-success)] opacity-20 duration-1000" />
				)}
				<span
					className={cn("relative inline-flex h-1.5 w-1.5 rounded-full", dotColor, dotAnimation)}
				/>
			</span>

			<span className="font-mono text-[10px] font-medium tracking-widest text-muted-foreground transition-colors group-hover:text-foreground">
				{label}
			</span>
		</div>
	);
}
