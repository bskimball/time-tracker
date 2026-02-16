import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import rsc from "@vitejs/plugin-rsc/plugin";
import { defineConfig } from "vite";
import devtoolsJson from "vite-plugin-devtools-json";
import { VitePWA } from "vite-plugin-pwa";
import tsconfigPaths from "vite-tsconfig-paths";
import honoDevServer from "@hono/vite-dev-server";

export default defineConfig(({ mode }) => {
	if (mode === "api") {
		return {
			build: {
				copyPublicDir: false,
				emptyOutDir: false,
				outDir: "dist/api",
				rollupOptions: {
					input: "src/routes/api/index.ts",
					output: {
						entryFileNames: "[name].js",
					},
					external: ["hono", "@hono/node-server"],
				},
				ssr: true,
			},
		};
	}
	return {
		plugins: [
			tailwindcss(),
			tsconfigPaths(),
			react({
				babel: {
					plugins: ["babel-plugin-react-compiler"],
				},
			}),
			rsc({
				entries: {
					client: "src/entry.browser.tsx",
					rsc: "src/entry.rsc.tsx",
					ssr: "src/entry.ssr.tsx",
				},
			}),
			VitePWA({
				manifest: false,
				injectRegister: false,
				registerType: "prompt",
				workbox: {
					globPatterns: ["**/*.{js,css,html,ico,png,svg,webmanifest,woff2}"],
					runtimeCaching: [
						{
							urlPattern: ({ request, url }) =>
								request.mode === "navigate" && !url.pathname.startsWith("/api/"),
							handler: "NetworkOnly",
							options: {
								precacheFallback: {
									fallbackURL: "/offline.html",
								},
							},
						},
						{
							urlPattern: ({ url }) => url.pathname.startsWith("/api/"),
							handler: "NetworkOnly",
						},
						{
							urlPattern: ({ url }) => url.searchParams.has("_rsc"),
							handler: "NetworkOnly",
						},
					],
				},
			}),
			honoDevServer({
				entry: "src/routes/api/index.ts",
				exclude: [
					/^(?!\/api).*/, // Exclude anything that doesn't start with /api
				],
			}),
			devtoolsJson(),
		],
		optimizeDeps: {
			exclude: ["@prisma/client", ".prisma/client"],
		},
		ssr: {
			noExternal: ["@monorepo/design-system"],
			external: ["@prisma/client", ".prisma/client"],
		},
		define: {
			"import.meta.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV || "development"),
		},
	};
});
