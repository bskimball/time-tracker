import js from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import prettier from "eslint-config-prettier";

export default [
	js.configs.recommended,
	{
		files: ["**/*.{js,jsx,ts,tsx}"],
		plugins: {
			"@typescript-eslint": tseslint,
			react: react,
			"react-hooks": reactHooks,
		},
		languageOptions: {
			parser: tsparser,
			parserOptions: {
				ecmaVersion: "latest",
				sourceType: "module",
				ecmaFeatures: {
					jsx: true,
				},
			},
			globals: {
				React: "readonly",
				process: "readonly",
				console: "readonly",
				document: "readonly",
				window: "readonly",
				Request: "readonly",
				Response: "readonly",
				FormData: "readonly",
				crypto: "readonly",
				URL: "readonly",
				fetch: "readonly",
				Headers: "readonly",
				setInterval: "readonly",
				clearInterval: "readonly",
				HTMLFormElement: "readonly",
				confirm: "readonly",
				URLSearchParams: "readonly",
				TextEncoder: "readonly",
				TextDecoder: "readonly",
				ReadableStream: "readonly",
				Blob: "readonly",
				MutationObserver: "readonly",
				Element: "readonly",
				HTMLElement: "readonly",
				localStorage: "readonly",
				SVGElement: "readonly",
				HTMLInputElement: "readonly",
				HTMLTextAreaElement: "readonly",
				HTMLSelectElement: "readonly",
				HTMLButtonElement: "readonly",
				Node: "readonly",
				NodeFilter: "readonly",
				CustomEvent: "readonly",
				KeyboardEvent: "readonly",
				MouseEvent: "readonly",
				FocusEvent: "readonly",
				MessageChannel: "readonly",
				MessagePort: "readonly",
				AbortController: "readonly",
				navigator: "readonly",
				matchMedia: "readonly",
				sessionStorage: "readonly",
				location: "readonly",
				IntersectionObserver: "readonly",
				ResizeObserver: "readonly",
				CSS: "readonly",
				reportError: "readonly",
				queueMicrotask: "readonly",
				__webpack_chunk_load__: "readonly",
				__vite_rsc_require__: "readonly",
				IS_REACT_ACT_ENVIRONMENT: "readonly",
				__REACT_DEVTOOLS_GLOBAL_HOOK__: "readonly",
				global: "readonly",
				Buffer: "readonly",
			},
		},
		rules: {
			...tseslint.configs.recommended.rules,
			...react.configs.recommended.rules,
			...reactHooks.configs.recommended.rules,
			"react/react-in-jsx-scope": "off",
			"react/prop-types": "off",
			"react/no-unescaped-entities": "off",
			"@typescript-eslint/no-explicit-any": "warn",
			"@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
			// RSC and Design System specific rules
			"react/jsx-no-constructed-context-values": "error",
			"react/jsx-uses-react": "off",
			"react/require-render-return": "error",
			// Good practices for our design system
			"prefer-const": "error",
			"no-var": "error",
		},
		settings: {
			react: {
				version: "detect",
			},
		},
	},
	// Design system components - more permissive for styling
	{
		files: ["src/components/ds/**/*.{ts,tsx}"],
		rules: {
			"@typescript-eslint/no-explicit-any": "off", // Allow any for React Aria props
		},
	},
	// Test files - more permissive
	{
		files: ["src/__tests__/**/*.{ts,tsx}", "**/*.test.{ts,tsx}", "**/*.spec.{ts,tsx}"],
		rules: {
			"@typescript-eslint/no-explicit-any": "off", // Allow any in tests
			"prefer-const": "off",
		},
	},
	// Ignore patterns
	{
		ignores: [
			"node_modules",
			"dist",
			"build",
			".react-router",
			".next",
			".cache",
			"coverage",
			"src/generated",
			".factory/**/*",
		],
	},
	prettier,
];
