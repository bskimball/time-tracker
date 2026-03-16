// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

// https://astro.build/config
export default defineConfig({
	vite: {
		// @ts-expect-error - Astro/Vite plugin type mismatch in monorepo
		plugins: [tailwindcss(), tsconfigPaths()],
		ssr: {
			noExternal: ["@monorepo/design-system"],
		},
	},
	integrations: [
		react(),
		// @ts-ignore - Astro type duplication across workspace installs
		starlight({
			title: "Shift Pulse",
			description: "Customer documentation for the Shift Pulse application and API.",
			disable404Route: true,
			customCss: ["./src/styles/global.css"],
			expressiveCode: {
				themes: ['github-dark', 'github-light'],
				styleOverrides: {
					borderRadius: '2px',
					borderWidth: '1px',
				}
			},
			social: [
				{
					icon: "github",
					label: "GitHub",
					href: "https://github.com/bskimball/time-tracker"
				}
			],
			sidebar: [
				{
					label: "Getting Started",
					items: [
						{ label: "Introduction", slug: "index" },
						{ label: "Deployment Quickstart", slug: "quickstart" }
					]
				},
				{
					label: "Using Shift Pulse",
					items: [
						{ label: "Web App Basics", slug: "web-app/basics" },
						{ label: "Navigation and Access", slug: "web-app/navigation-and-access" },
						{ label: "Employee Guide", slug: "web-app/employee" },
						{ label: "Manager Guide", slug: "web-app/manager" },
						{ label: "Administrator Guide", slug: "web-app/administrator" },
						{ label: "Troubleshooting", slug: "web-app/troubleshooting" }
					]
				},
				{
					label: "Operating Shift Pulse",
					items: [
						{ label: "Operations Overview", slug: "operations" },
						{ label: "On-Prem Operations Handbook", slug: "operations/on-prem-operations" },
						{ label: "Authentication and Access Setup", slug: "operations/authentication-and-access-setup" },
						{ label: "Backup and Restore", slug: "operations/backup-and-restore" },
						{ label: "Release Validation", slug: "operations/release-validation" }
					]
				},
				{
					label: "API",
					items: [
						{ label: "REST API and OpenAPI", slug: "api/rest-openapi" },
						{ label: "API Authentication", slug: "api/authentication" },
						{ label: "Endpoint Reference", slug: "api/endpoint-reference" },
						{ label: "Realtime Streaming", slug: "api/realtime-streaming" }
					]
				},
				{
					label: "Reference",
					items: [
						{ label: "Environment Variables", slug: "reference/environment-variables" },
						{ label: "Roles and Permissions", slug: "reference/roles-and-permissions" },
						{ label: "Operational Config Reference", slug: "reference/operational-config-reference" },
						{ label: "Documentation Roadmap", slug: "reference/documentation-roadmap" },
						{ label: "Release Notes", slug: "reference/release-notes" }
					]
				}
			]
		})
	]
});
