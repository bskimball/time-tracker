import { type unstable_RSCRouteConfig as RSCRouteConfig } from "react-router";

// Extend RSC route config to support middleware (experimental feature)
declare module "react-router" {
	interface unstable_RSCRouteConfigEntry {
		middleware?: Array<(context: { request: Request }) => Promise<Response | void | null>>;
	}
}
