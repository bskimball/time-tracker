import type { User } from "@prisma/client";
import type { AppNavLink } from "~/components/app-layout";

export function getExecutiveNavLinks(user: User) {
	const links: AppNavLink[] = [
		{ to: "/executive", label: "Dashboard", icon: "dashboard" as const },
		{ to: "/executive/analytics", label: "Analytics", icon: "analytics" as const },
		{ to: "/settings", label: "Settings", icon: "settings" as const },
	];

	// Add Manager Portal link for ADMIN users
	if (user.role === "ADMIN") {
		links.push({ to: "/manager", label: "Manager Portal", icon: "briefcase" as const });
	}

	return links;
}
