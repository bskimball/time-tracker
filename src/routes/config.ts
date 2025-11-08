import { type unstable_RSCRouteConfig as RSCRouteConfig } from "react-router";
import { authMiddleware } from "../lib/middleware";

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
				{
					id: "dashboard",
					path: "dashboard",
					middleware: [authMiddleware],
					lazy: () => import("./dashboard/route.tsx"),
				},
				{
					id: "time-clock",
					path: "time-clock",
					// Public route - no auth required for guest access
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
					middleware: [authMiddleware],
					lazy: () => import("./time-clock/reports/route.tsx"),
				},
				{
					id: "time-clock-reports-csv",
					path: "time-clock/reports/reports.csv",
					lazy: () => import("./time-clock/reports/reports.csv/route.tsx"),
				},
				{
					id: "settings",
					path: "settings",
					middleware: [authMiddleware],
					lazy: () => import("./settings/route.tsx"),
				},
				{
					id: "todo",
					path: "todo",
					middleware: [authMiddleware],
					lazy: () => import("./todo/route.tsx"),
				},
			],
		},
	] satisfies RSCRouteConfig;
}
