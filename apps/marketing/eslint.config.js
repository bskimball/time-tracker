import js from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";
import astro from "eslint-plugin-astro";
import prettier from "eslint-config-prettier";

export default [
	js.configs.recommended,
	...astro.configs.recommended,
	{
		ignores: [".astro/**", "dist/**"],
	},
	{
		files: ["**/*.{js,jsx,ts,tsx}"],
		plugins: {
			"@typescript-eslint": tseslint,
		},
		languageOptions: {
			parser: tsparser,
			parserOptions: {
				ecmaVersion: "latest",
				sourceType: "module",
			},
			globals: {
				window: "readonly",
				document: "readonly",
				localStorage: "readonly",
				setTimeout: "readonly",
				setInterval: "readonly",
				clearInterval: "readonly",
				IntersectionObserver: "readonly",
				HTMLDivElement: "readonly",
				requestAnimationFrame: "readonly",
			},
		},
		rules: {
			...tseslint.configs.recommended.rules,
			"@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
			"@typescript-eslint/no-explicit-any": "warn",
		},
	},
	prettier,
];