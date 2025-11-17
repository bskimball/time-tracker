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
import { ThemeBlockingScript } from "~/components/theme-blocking-script";

export function Layout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<ThemeBlockingScript />
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />
				<Links />
			</head>
			<body className="bg-grid-pattern">
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
	let errorName = "Error";
	let errorStack: string | undefined;
	let errorDetails: Record<string, any> = {};

	if (isRouteErrorResponse(error)) {
		status = error.status;
		message = status === 404 ? "Page not found." : error.statusText || message;
		errorDetails = error.data || {};
	} else if (error instanceof Error) {
		message = error.message;
		errorName = error.constructor.name;
		errorStack = error.stack;
		// Extract additional properties from the error object
		Object.keys(error).forEach((key) => {
			if (key !== "message" && key !== "stack" && key !== "name") {
				errorDetails[key] = (error as any)[key];
			}
		});
	}

	const isDev = import.meta.env.DEV;

	return (
		<Layout>
			<main className="min-h-screen bg-grid-pattern flex items-center justify-center p-4">
				<div className="w-full max-w-4xl animate-slide-up">
					{/* Industrial Warning Header */}
					<div className="safety-stripes h-3 mb-8 rounded-t-lg" />

					<div className="bg-card border-4 border-destructive rounded-lg panel-shadow overflow-hidden">
						{/* Error Header - Industrial Style */}
						<div className="bg-destructive text-destructive-foreground p-8 relative overflow-hidden">
							<div className="absolute inset-0 bg-grid-pattern-diagonal opacity-20" />
							<div className="relative flex items-start gap-6">
								{/* LED Indicator */}
								<div className="flex flex-col items-center gap-2 pt-1">
									<div className="led-indicator active bg-destructive-foreground w-6 h-6" />
									<div className="w-px h-full bg-destructive-foreground/30" />
								</div>

								<div className="flex-1">
									<div className="font-industrial text-sm uppercase tracking-widest opacity-90 mb-2">
										System Malfunction
									</div>
									<h1 className="font-industrial text-7xl font-bold mb-4 tracking-tight">
										{status}
									</h1>
									<div className="font-mono-industrial text-lg opacity-95 bg-destructive-foreground/10 px-4 py-2 rounded border border-destructive-foreground/20">
										{errorName}
									</div>
								</div>
							</div>
						</div>

						{/* Error Message */}
						<div className="p-8 border-b border-border">
							<div className="font-industrial text-sm uppercase tracking-widest text-muted-foreground mb-3">
								Error Message
							</div>
							<p className="text-xl text-foreground font-medium leading-relaxed">{message}</p>
						</div>

						{/* Error Details - Development Only */}
						{isDev && errorStack && (
							<div className="p-8 border-b border-border bg-muted/30">
								<details className="group">
									<summary className="cursor-pointer font-industrial text-sm uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors mb-4 flex items-center gap-2">
										<span className="transform group-open:rotate-90 transition-transform">▶</span>
										Stack Trace
									</summary>
									<div className="bg-card border border-border rounded-lg p-6 overflow-x-auto">
										<pre className="font-mono-industrial text-sm text-foreground leading-relaxed whitespace-pre-wrap">
											{errorStack}
										</pre>
									</div>
								</details>
							</div>
						)}

						{/* Additional Error Details - Development Only */}
						{isDev && Object.keys(errorDetails).length > 0 && (
							<div className="p-8 bg-muted/30">
								<details className="group">
									<summary className="cursor-pointer font-industrial text-sm uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors mb-4 flex items-center gap-2">
										<span className="transform group-open:rotate-90 transition-transform">▶</span>
										Additional Details
									</summary>
									<div className="bg-card border border-border rounded-lg p-6 overflow-x-auto">
										<pre className="font-mono-industrial text-sm text-foreground leading-relaxed">
											{JSON.stringify(errorDetails, null, 2)}
										</pre>
									</div>
								</details>
							</div>
						)}

						{/* Action Footer */}
						<div className="p-8 bg-accent/50 flex items-center justify-between gap-4">
							<div className="flex items-center gap-3">
								<div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
								<span className="font-mono-industrial text-sm text-muted-foreground">
									{isDev ? "Development Mode - Full Error Details" : "Production Mode"}
								</span>
							</div>
							<a
								href="/"
								className="bg-primary text-primary-foreground font-industrial font-semibold px-6 py-3 rounded-lg hover:bg-primary-hover active:bg-primary-active transition-smooth uppercase tracking-wider text-sm"
							>
								Return Home
							</a>
						</div>
					</div>

					<div className="safety-stripes h-3 mt-8 rounded-b-lg" />
				</div>
			</main>
		</Layout>
	);
}
