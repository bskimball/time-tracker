"use client";

import { Button } from "@monorepo/design-system";
import { LiaSyncSolid } from "react-icons/lia";

interface RefreshButtonProps {
	action: (formData: FormData) => Promise<void>;
}

export function RefreshButton({ action }: RefreshButtonProps) {
	return (
		<form action={action}>
			<Button variant="outline" size="sm" type="submit">
				<LiaSyncSolid className="h-4 w-4 mr-2" />
				Refresh
			</Button>
		</form>
	);
}
