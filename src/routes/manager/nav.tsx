import type { User } from "@prisma/client";

export function getManagerNavLinks(user: User) {
	const links = [
		{ to: "/manager", label: "Dashboard", icon: "dashboard" as const },
		{ to: "/manager/monitor", label: "Floor Monitor", icon: "monitor" as const },
		{ to: "/manager/employees", label: "Employees", icon: "users" as const },
		{ to: "/manager/timesheets", label: "Timesheets", icon: "timesheets" as const },
		{ to: "/manager/reports", label: "Reports", icon: "reports" as const },
		{ to: "/manager/schedule", label: "Schedule", icon: "schedule" as const },
		{ to: "/manager/tasks", label: "Tasks", icon: "tasks" as const },
	];

	// Add Executive Portal link for ADMIN users
	if (user.role === "ADMIN") {
		links.push({ to: "/executive", label: "Executive Portal", icon: "crown" as const });
	}

	return links;
}
