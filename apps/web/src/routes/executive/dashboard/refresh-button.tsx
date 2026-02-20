"use client";

import { Button } from "@monorepo/design-system";
import { LiaSyncSolid } from "react-icons/lia";
import { format } from "date-fns";

interface RefreshButtonProps {
	action: (formData: FormData) => Promise<void>;
	/** ISO timestamp of the last data sync, shown as a monospace label */
	lastSyncedAt?: string;
}

export function RefreshButton({ action, lastSyncedAt }: RefreshButtonProps) {
	const syncLabel = lastSyncedAt
		? `LAST_SYNC: ${format(new Date(lastSyncedAt), "HH:mm:ss")}`
		: "LAST_SYNC: —";

	return (
		<form action={action} className="flex items-center gap-2">
			<span className="text-[10px] font-mono text-muted-foreground/50 tracking-wide tabular-nums hidden sm:inline">
				{syncLabel}
			</span>
			<Button variant="outline" size="sm" type="submit">
				<LiaSyncSolid className="h-4 w-4 mr-2" />
				Refresh
			</Button>
		</form>
	);
}
