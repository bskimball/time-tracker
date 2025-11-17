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
} from "react-router/dom";

type RSCServerPayload = any;

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
	});
});

if (import.meta.hot) {
	import.meta.hot.on("rsc:update", () => {
		(window as unknown as { __router: { revalidate: () => void } }).__router.revalidate();
	});
}
