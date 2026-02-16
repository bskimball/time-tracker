"use client";

import { useOnlineStatus } from "~/lib/offline-support";

export function NetworkOfflineBanner() {
	const { isOnline } = useOnlineStatus();

	if (isOnline) {
		return null;
	}

	return (
		<div className="fixed bottom-3 left-1/2 z-50 w-[min(680px,calc(100%-1.5rem))] -translate-x-1/2 border border-destructive/50 bg-destructive/95 px-3 py-2 text-destructive-foreground shadow-lg backdrop-blur-sm">
			<div className="flex items-center justify-between gap-3">
				<span className="font-data text-[11px] uppercase tracking-[0.16em]">Network Offline</span>
				<span className="font-data text-[10px] uppercase tracking-[0.12em] opacity-90">
					Device internet unavailable
				</span>
			</div>
			<p className="mt-1 font-data text-[11px] leading-4 opacity-95">
				This banner reflects browser network state for PWA/offline behavior. Live stream badges are
				separate.
			</p>
		</div>
	);
}
