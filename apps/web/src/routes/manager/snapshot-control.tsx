"use client";

import { Button } from "@monorepo/design-system";
import { LiaSyncSolid } from "react-icons/lia";
import { cn } from "~/lib/cn";

type ManagerSnapshotControlProps = {
	label?: string;
	snapshotAt: Date;
	now: Date;
	staleAfterSeconds?: number;
	onRefresh: () => void;
	isRefreshing: boolean;
	className?: string;
};

export function ManagerSnapshotControl({
	label = "Snapshot",
	snapshotAt,
	now,
	staleAfterSeconds = 120,
	onRefresh,
	isRefreshing,
	className,
}: ManagerSnapshotControlProps) {
	const secondsSince = Math.max(0, Math.floor((now.getTime() - snapshotAt.getTime()) / 1000));
	const isStale = secondsSince >= staleAfterSeconds;

	return (
		<div
			className={cn(
				"inline-flex items-stretch overflow-hidden rounded-[2px] border border-border/50 bg-card",
				className
			)}
		>
			<div className="flex items-center gap-2 px-3 py-2">
				<span
					className={cn("h-1.5 w-1.5 rounded-full", isStale ? "bg-amber-500" : "bg-emerald-500")}
					aria-hidden="true"
				/>
				<div className="flex flex-col leading-none">
					<span className="text-[10px] font-heading uppercase tracking-widest text-muted-foreground">
						{label}
					</span>
					<span className="mt-1 font-mono text-xs tabular-nums text-foreground">
						{snapshotAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
						<span className="ml-2 text-[10px] uppercase tracking-wider text-muted-foreground">
							{isStale ? "STALE" : "FRESH"}
						</span>
					</span>
				</div>
			</div>
			<div className="w-px bg-border/50" aria-hidden="true" />
			<Button
				variant="ghost"
				size="sm"
				className="h-auto rounded-none px-2"
				onPress={onRefresh}
				disabled={isRefreshing}
				aria-label="Refresh"
			>
				<LiaSyncSolid className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
			</Button>
		</div>
	);
}
