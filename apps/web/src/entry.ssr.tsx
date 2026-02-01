// Unstable RSC APIs - partial type coverage in react-router
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { createFromReadableStream } from "@vitejs/plugin-rsc/ssr";
import { renderToReadableStream as renderHTMLToReadableStream } from "react-dom/server.edge";
import {
	unstable_routeRSCServerRequest as routeRSCServerRequest,
	unstable_RSCStaticRouter as RSCStaticRouter,
} from "react-router";

type RSCStreamPayload = {
	type: "render" | string;
	formState?: Promise<unknown> | unknown;
};

export async function generateHTML(
	request: Request,
	fetchServer: (request: Request) => Promise<Response>
): Promise<Response> {
	const serverResponse = await fetchServer(request);

	return await routeRSCServerRequest({
		// The incoming request.
		request,
		// The server response
		serverResponse,
		// Provide the React Server touchpoints.
		createFromReadableStream,
		// Render the router to HTML.
		async renderHTML(getPayload: () => Promise<RSCStreamPayload>) {
			const payload = await getPayload();
			const formState = payload.type === "render" ? await payload.formState : undefined;

			const bootstrapScriptContent = await import.meta.viteRsc.loadBootstrapScriptContent("index");

			return await renderHTMLToReadableStream(<RSCStaticRouter getPayload={getPayload} />, {
				bootstrapScriptContent,
				formState,
			});
		},
	});
}
