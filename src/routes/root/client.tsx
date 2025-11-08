"use client";

import {
	isRouteErrorResponse,
	useRouteError,
	ScrollRestoration,
	Meta,
	Links,
	Navigate,
} from "react-router";
import { ThemeProvider } from "~/components/theme-provider";

export function Layout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />
				<Links />
			</head>
			<body>
				<ThemeProvider defaultTheme="system">{children}</ThemeProvider>
				<ScrollRestoration />
			</body>
		</html>
	);
}

export function ErrorBoundary() {
	const error = useRouteError();

	if (error instanceof Response && error.status >= 300 && error.status < 400) {
		const location = error.headers.get("Location") ?? "/";
		return <Navigate to={location} replace />;
	}

	let status = 500;
	let message = "An unexpected error occurred.";

	if (isRouteErrorResponse(error)) {
		status = error.status;
		message = status === 404 ? "Page not found." : error.statusText || message;
	}

	return (
		<main className="mx-auto max-w-screen-xl px-4 py-8 lg:py-12">
			<article className="prose mx-auto">
				<h1>{status}</h1>
				<p>{message}</p>
			</article>
		</main>
	);
}
