import { type unstable_RSCRouteConfig as RSCRouteConfig } from "react-router";

export function routes() {
	return [
		{
			id: "root",
			path: "",
			lazy: () => import("./root/route.tsx"),
			children: [
				{
					id: "home",
					index: true,
					// @ts-expect-error - This route throws redirect() for routing logic
					lazy: () => import("./home/route.tsx"),
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
					// @ts-expect-error - This route throws a Response for logout redirect
					lazy: () => import("./logout/route.ts"),
				},
				{
					id: "auth-google-start",
					path: "auth/google/start",
					// @ts-expect-error - This route throws redirect() for OAuth flow
					lazy: () => import("./auth/google/start.ts"),
				},
				{
					id: "auth-google-callback",
					path: "auth/google/callback",
					// @ts-expect-error - This route throws a Response for redirect handling
					lazy: () => import("./auth/google/callback.ts"),
				},
				{
					id: "auth-microsoft-start",
					path: "auth/microsoft/start",
					// @ts-expect-error - This route throws redirect() for OAuth flow
					lazy: () => import("./auth/microsoft/start.ts"),
				},
				{
					id: "auth-microsoft-callback",
					path: "auth/microsoft/callback",
					// @ts-expect-error - This route throws a Response for redirect handling
					lazy: () => import("./auth/microsoft/callback.ts"),
				},
				{
					id: "dashboard",
					path: "dashboard",
					lazy: () => import("./dashboard/route.tsx"),
				},
				{
					id: "time-clock",
					path: "time-clock",
					lazy: () => import("./time-clock/route.tsx"),
				},
				{
					id: "time-clock-kiosk",
					path: "time-clock/kiosk",
					lazy: () => import("./time-clock/kiosk/route.tsx"),
				},
				{
					id: "time-clock-reports",
					path: "time-clock/reports",
					lazy: () => import("./time-clock/reports/route.tsx"),
				},
				{
					id: "time-clock-reports-csv",
					path: "time-clock/reports/reports.csv",
					// @ts-expect-error - This route throws a Response for file download
					lazy: () => import("./time-clock/reports/reports.csv/route.tsx"),
				},
				{
					id: "settings",
					path: "settings",
					lazy: () => import("./settings/route.tsx"),
				},
				{
					id: "todo",
					path: "todo",
					lazy: () => import("./todo/route.tsx"),
				},
			],
		},
	] satisfies RSCRouteConfig;
}
