// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: "Shift Pulse Docs",
			description: "Customer documentation for the Shift Pulse application and API.",
			disable404Route: true,
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
					items: [{ label: "Release Notes", slug: "reference/release-notes" }]
				}
			]
		})
	]
});
