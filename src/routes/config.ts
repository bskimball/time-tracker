import { type unstable_RSCRouteConfig as RSCRouteConfig } from "react-router";

export function routes(): RSCRouteConfig {
	const config = [
		{
			id: "root",
			path: "",
			lazy: () => import("./root/route.tsx"),
			children: [
				{
					id: "home",
					index: true,
					lazy: () => import("./home/route.tsx"),
				},
				{
					id: "dashboard",
					path: "dashboard",
					lazy: () => import("./dashboard-redirect/route.ts"),
				},
				{
					id: "login",
					path: "login",
					lazy: () => import("./login/route.tsx"),
				},
				{
					id: "dev-login",
					path: "dev-login",
					lazy: () => import("./dev-login/route.tsx"),
				},
				{
					id: "logout",
					path: "logout",
					lazy: () => import("./logout/route.ts"),
				},
				{
					id: "auth-google-start",
					path: "auth/google/start",
					lazy: () => import("./auth/google/start.ts"),
				},
				{
					id: "auth-google-callback",
					path: "auth/google/callback",
					lazy: () => import("./auth/google/callback.ts"),
				},
				{
					id: "auth-microsoft-start",
					path: "auth/microsoft/start",
					lazy: () => import("./auth/microsoft/start.ts"),
				},
				{
					id: "auth-microsoft-callback",
					path: "auth/microsoft/callback",
					lazy: () => import("./auth/microsoft/callback.ts"),
				},
				// Floor experience (public with PIN-based auth)
				{
					id: "floor",
					path: "floor",
					lazy: () => import("./floor/layout.tsx"),
					children: [
						{
							id: "floor-index",
							index: true,
							lazy: () => import("./floor/route.tsx"),
						},
					],
				},
				{
					id: "floor-kiosk",
					path: "floor/kiosk",
					lazy: () => import("./floor/kiosk/route.tsx"),
				},

				// Manager experience (MANAGER, ADMIN roles)
				{
					id: "manager",
					path: "manager",
					lazy: () => import("./manager/layout.tsx"),
					children: [
						{
							id: "manager-dashboard",
							index: true,
							lazy: () => import("./manager/dashboard/route.tsx"),
						},
						{
							id: "manager-monitor",
							path: "monitor",
							lazy: () => import("./manager/monitor/route.tsx"),
						},
						{
							id: "manager-employees",
							path: "employees",
							lazy: () => import("./manager/employees/route.tsx"),
							children: [
								{
									id: "manager-employees-detail",
									path: ":id",
									lazy: () => import("./manager/employees/[id]/route.tsx"),
								},
								{
									id: "manager-employees-edit",
									path: ":id/edit",
									lazy: () => import("./manager/employees/[id]/edit/route.tsx"),
								},
								{
									id: "manager-employees-new",
									path: "new",
									lazy: () => import("./manager/employees/new/route.tsx"),
								},
							],
						},
						{
							id: "manager-timesheets",
							path: "timesheets",
							lazy: () => import("./manager/timesheets/route.tsx"),
						},
						{
							id: "manager-schedule",
							path: "schedule",
							lazy: () => import("./manager/schedule/route.tsx"),
						},
						{
							id: "manager-tasks",
							path: "tasks",
							lazy: () => import("./manager/tasks/route.tsx"),
						},
						{
							id: "manager-reports",
							path: "reports",
							lazy: () => import("./manager/reports/route.tsx"),
						},
					],
				},

				// Executive experience (ADMIN role only)
				{
					id: "executive",
					path: "executive",
					lazy: () => import("./executive/layout.tsx"),
					children: [
						{
							id: "executive-dashboard",
							index: true,
							lazy: () => import("./executive/dashboard/route.tsx"),
						},
						{
							id: "executive-analytics",
							path: "analytics",
							lazy: () => import("./executive/analytics/route.tsx"),
						},
					],
				},

				{
					id: "settings",
					path: "settings",
					lazy: () => import("./settings/layout.tsx"),
					children: [
						{
							id: "settings-stations",
							path: "stations",
							lazy: () => import("./settings/stations/route.tsx"),
						},
						{
							id: "settings-employees",
							path: "employees",
							lazy: () => import("./settings/employees/route.tsx"),
						},
						{
							id: "settings-users",
							path: "users",
							lazy: () => import("./settings/users/route.tsx"),
						},
						{
							id: "settings-api-keys",
							path: "api-keys",
							lazy: () => import("./settings/api-keys/route.tsx"),
						},
					],
				},
				{
					id: "todo",
					path: "todo",
					lazy: () => import("./todo/route.tsx"),
				},
			],
		},
	] satisfies RSCRouteConfig;

	return config;
}
