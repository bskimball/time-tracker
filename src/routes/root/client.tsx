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
import {
	IndustrialHeader,
	IndustrialPanel,
	IndustrialSection,
	SafetyStripes,
} from "~/components/ds/industrial";

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
					<SafetyStripes position="top" />

					<IndustrialPanel variant="destructive">
						<IndustrialHeader
							title={status}
							subtitle="System Malfunction"
							badge={errorName}
							active={true}
						/>

						{/* Error Message */}
						<IndustrialSection title="Error Message">
							<p className="text-xl text-foreground font-medium leading-relaxed">
								{message}
							</p>
						</IndustrialSection>

						{/* Error Details - Development Only */}
						{isDev && errorStack && (
							<IndustrialSection className="bg-muted/30">
								<details className="group">
									<summary className="cursor-pointer font-industrial text-sm uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors mb-4 flex items-center gap-2">
										<span className="transform group-open:rotate-90 transition-transform">
											▶
										</span>
										Stack Trace
									</summary>
									<div className="bg-card border border-border rounded-lg p-6 overflow-x-auto">
										<pre className="font-mono-industrial text-sm text-foreground leading-relaxed whitespace-pre-wrap">
											{errorStack}
										</pre>
									</div>
								</details>
							</IndustrialSection>
						)}

						{/* Additional Error Details - Development Only */}
						{isDev && Object.keys(errorDetails).length > 0 && (
							<div className="p-8 bg-muted/30">
								<details className="group">
									<summary className="cursor-pointer font-industrial text-sm uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors mb-4 flex items-center gap-2">
										<span className="transform group-open:rotate-90 transition-transform">
											▶
										</span>
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
									{isDev
										? "Development Mode - Full Error Details"
										: "Production Mode"}
								</span>
							</div>
							<a
								href="/"
								className="bg-primary text-primary-foreground font-industrial font-semibold px-6 py-3 rounded-lg hover:bg-primary-hover active:bg-primary-active transition-smooth uppercase tracking-wider text-sm"
							>
								Return Home
							</a>
						</div>
					</IndustrialPanel>

					<SafetyStripes position="bottom" className="mt-8" />
				</div>
			</main>
		</Layout>
	);
}
