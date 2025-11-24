import type { User } from "@prisma/client";

export function getExecutiveNavLinks(user: User) {
	const links = [
		{ to: "/executive", label: "Dashboard", icon: "dashboard" as const },
		{ to: "/executive/analytics", label: "Analytics", icon: "analytics" as const },
		{ to: "/settings", label: "Settings", icon: "settings" as const },
	];

	// Add Manager Portal link for ADMIN users
	if (user.role === "ADMIN") {
		links.push({ to: "/manager", label: "Manager Portal", icon: "clipboard" as const });
	}

	return links;
}
