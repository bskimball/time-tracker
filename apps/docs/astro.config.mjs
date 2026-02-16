// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: "Time Tracker Docs",
			description: "Customer documentation for the Time Tracker application and API.",
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
					label: "Using Time Tracker",
					autogenerate: { directory: "web-app" }
				},
				{
					label: "API",
					autogenerate: { directory: "api" }
				}
			]
		})
	]
});
