import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import rsc from "@vitejs/plugin-rsc/plugin";
import honoDevServer from "@hono/vite-dev-server";
import { defineConfig } from "vite-plus";
import devtoolsJson from "vite-plugin-devtools-json";
import { VitePWA } from "vite-plugin-pwa";
import type { ConfigEnv } from "vite";

function createConfig({ mode }: ConfigEnv) {
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
			resolve: {
				tsconfigPaths: true,
			},
		};
	}

	if (mode === "sse") {
		return {
			build: {
				copyPublicDir: false,
				emptyOutDir: false,
				outDir: "dist/sse",
				rollupOptions: {
					input: "src/routes/sse/index.ts",
					output: {
						entryFileNames: "index.js",
					},
					external: ["hono", "@hono/node-server"],
				},
				ssr: true,
			},
			resolve: {
				tsconfigPaths: true,
			},
		};
	}

	return {
		lint: {
			options: {
				typeAware: true,
				typeCheck: true,
			},
			categories: {
				correctness: "warn",
			},
			ignorePatterns: ["dist/**"],
		},
		fmt: {
			semi: true,
			singleQuote: false,
			useTabs: true,
			ignorePatterns: ["dist/**"],
		},
		plugins: [
			tailwindcss(),
			react(),
			babel({
				presets: [reactCompilerPreset({ compilationMode: "annotation" })],
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
							urlPattern: ({ request }) =>
								request.destination === "style" || request.destination === "script",
							handler: "NetworkFirst",
							options: {
								cacheName: "static-resources",
							},
						},
						{
							urlPattern: ({ request }) =>
								request.destination === "image" || request.destination === "font",
							handler: "CacheFirst",
							options: {
								cacheName: "static-assets",
							},
						},
						{
							urlPattern: ({ url }) => url.pathname.startsWith("/api/"),
							handler: "NetworkOnly",
						},
						{
							urlPattern: ({ url }) => url.pathname.startsWith("/sse/"),
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
				exclude: [/^(?!\/api).*/],
			}),
			honoDevServer({
				entry: "src/routes/sse/index.ts",
				exclude: [/^(?!\/sse).*/],
			}),
			devtoolsJson(),
		],
		resolve: {
			tsconfigPaths: true,
		},
		define: {
			"import.meta.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV || "development"),
		},
		optimizeDeps: {
			exclude: ["@prisma/client", ".prisma/client"],
			include: ["nuqs"],
		},
		ssr: {
			noExternal: ["@monorepo/design-system", "nuqs"],
			external: ["@prisma/client", ".prisma/client"],
		},
	};
}

export default defineConfig(createConfig as never);
