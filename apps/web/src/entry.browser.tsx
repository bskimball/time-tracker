// Unstable RSC APIs - partial type coverage in react-router
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import {
	createFromReadableStream,
	createTemporaryReferenceSet,
	encodeReply,
	setServerCallback,
} from "@vitejs/plugin-rsc/browser";
import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import {
	unstable_createCallServer as createCallServer,
	unstable_getRSCStream as getRSCStream,
	unstable_RSCHydratedRouter as RSCHydratedRouter,
	type unstable_RSCPayload as RSCServerPayload,
} from "react-router/dom";

declare global {
	interface Window {
		__router?: { revalidate?: () => void };
	}
}

// Create and set the callServer function to support post-hydration server actions.
setServerCallback(
	createCallServer({
		createFromReadableStream,
		createTemporaryReferenceSet,
		encodeReply,
	})
);

// Get and decode the initial server payload
createFromReadableStream<RSCServerPayload>(getRSCStream()).then((payload) => {
	startTransition(async () => {
		const formState = payload.type === "render" ? await payload.formState : undefined;

		hydrateRoot(
			document,
			<StrictMode>
				<RSCHydratedRouter createFromReadableStream={createFromReadableStream} payload={payload} />
			</StrictMode>,
			{
				// @ts-expect-error - no types for this yet
				formState,
			}
		);

		if (payload.type === "render") {
			window.__router = payload.router;
		}
	});
});

if (import.meta.hot) {
	import.meta.hot.on("rsc:update", () => {
		const router = window.__router;
		if (router?.revalidate) {
			console.log("[HMR] Server component updated, revalidating...");
			router.revalidate();
		} else {
			console.log("[HMR] Router not found, reloading page...");
			window.location.reload();
		}
	});
}

if (import.meta.env.PROD && "serviceWorker" in navigator) {
	void import("virtual:pwa-register").then(({ registerSW }) => {
		let hasShownUpdatePrompt = false;
		const updateSW = registerSW({
			onNeedRefresh() {
				if (hasShownUpdatePrompt) return;
				hasShownUpdatePrompt = true;
				const shouldRefresh = window.confirm(
					"A new version of Time Tracker is available. Refresh now to update?"
				);
				if (shouldRefresh) {
					void updateSW(true);
				}
			},
			onOfflineReady() {
				console.info("[PWA] Offline cache is ready.");
			},
		});
	});
}
