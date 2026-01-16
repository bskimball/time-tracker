"use client";

import { Button } from "@monorepo/design-system";
import { LiaSignOutAltSolid } from "react-icons/lia";

export function LogoutButton() {
	return (
		<a href="/logout" className="w-full">
			<Button variant="error" size="sm" className="w-full">
				<LiaSignOutAltSolid className="h-4 w-4 mr-2" />
				Logout
			</Button>
		</a>
	);
}
