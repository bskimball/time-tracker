import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
	plugins: [react()],
	test: {
		environment: "happy-dom",
		testTimeout: 10000,
		setupFiles: ["./src/__tests__/setup.ts"],
		coverage: {
			reporter: ["text", "html"],
			include: ["src/**/*.{ts,tsx}"],
			exclude: ["src/__tests__/**/*", "**/*.d.ts"],
		},
		// Add test match patterns
		include: ["src/**/*.{test,spec}.{ts,tsx}"],
		exclude: ["node_modules"],
		globals: true,
	},
	resolve: {
		alias: {
			"~": resolve(process.cwd(), "src"),
		},
	},
});
