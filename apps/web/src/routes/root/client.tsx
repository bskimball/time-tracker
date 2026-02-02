"use client";

import { useState } from "react";
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
	Button,
} from "@monorepo/design-system";
import { LiaCheckSolid, LiaCopySolid } from "react-icons/lia";

export function Layout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<ThemeBlockingScript />
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<meta name="theme-color" content="var(--background)" />
				<Meta />
				<Links />
			</head>
			<body className="bg-noise min-h-screen selection:bg-primary/30">
				{/* Tactical grid overlay */}
				<div className="fixed inset-0 bg-tactical-grid opacity-5 pointer-events-none z-0" aria-hidden="true" />
				<div className="relative z-10 min-h-screen flex flex-col">
					<a
						href="#main-content"
						className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-sm focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
					>
						Skip to main content
					</a>
					<ThemeProvider defaultTheme="system">{children}</ThemeProvider>
					<ScrollRestoration />
				</div>
			</body>
		</html>
	);
}

export function ErrorBoundary() {
	const error = useRouteError();
	const [copied, setCopied] = useState(false);

	if (error instanceof Response && error.status >= 300 && error.status < 400) {
		const location = error.headers.get("Location") ?? "/";
		return <Navigate to={location} replace />;
	}

	let status = 500;
	let message = "An unexpected error occurred.";
	let errorName = "Error";
	let errorStack: string | undefined;
	let errorDetails: Record<string, unknown> = {};

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
				errorDetails[key] = (error as unknown as Record<string, unknown>)[key];
			}
		});
	}

	const isDev = import.meta.env.DEV;

	const handleCopy = async () => {
		const textToCopy = errorStack ? `${message}\n\n${errorStack}` : message;
		try {
			await navigator.clipboard.writeText(textToCopy);
			setCopied(true);
			window.setTimeout(() => setCopied(false), 2000);
		} catch {
			setCopied(false);
		}
	};

	return (
		<main className="min-h-screen bg-grid-pattern flex items-center justify-center p-4">
			<div className="w-full max-w-4xl animate-scale-in">
				{/* Industrial Warning Header */}
				<SafetyStripes position="top" />
				
				<IndustrialPanel variant="destructive">
					<IndustrialHeader
						title={status}
						subtitle="System Alert"
						badge={errorName}
						active={true}
					/>
					
					{/* Error Message */}
					<IndustrialSection title="Error Message">
						<div className="flex justify-between items-start gap-4">
							<p className="text-xl text-foreground font-medium leading-relaxed animate-slide-up">
								{message}
							</p>
							<Button
								variant="ghost"
								size="sm"
								className="shrink-0 text-muted-foreground hover:text-foreground"
								onClick={handleCopy}
							>
								<span className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider">
									{copied ? (
										<LiaCheckSolid className="h-4 w-4" aria-hidden="true" />
									) : (
										<LiaCopySolid className="h-4 w-4" aria-hidden="true" />
									)}
									{copied ? "COPIED" : "COPY"}
								</span>
							</Button>
						</div>
					</IndustrialSection>
					
					{/* Error Details - Development Only */}
					{isDev && errorStack && (
						<IndustrialSection className="bg-muted/30">
							<details className="group">
								<summary className="cursor-pointer font-heading text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground transition-all duration-200 mb-4 flex items-center gap-2 hover:gap-3">
									<span className="transform group-open:rotate-90 transition-transform duration-200">
										▶
									</span>
									Stack Trace
								</summary>
								<div className="bg-card border border-border rounded-sm p-6 overflow-x-auto animate-slide-down">
									<pre className="font-mono text-xs text-foreground leading-relaxed whitespace-pre-wrap">
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
								<summary className="cursor-pointer font-heading text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground transition-all duration-200 mb-4 flex items-center gap-2 hover:gap-3">
									<span className="transform group-open:rotate-90 transition-transform duration-200">
										▶
									</span>
									Additional Details
								</summary>
								<div className="bg-card border border-border rounded-sm p-6 overflow-x-auto animate-slide-down">
									<pre className="font-mono text-xs text-foreground leading-relaxed">
										{JSON.stringify(errorDetails, null, 2)}
									</pre>
								</div>
							</details>
						</div>
					)}
					
					{/* Action Footer */}
					<div className="p-8 bg-accent/50 flex flex-col sm:flex-row items-center justify-between gap-4 animate-slide-up">
						<div className="flex items-center gap-3">
							<div className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
							<span className="font-data text-xs text-muted-foreground">
								{isDev ? "Development Mode" : "Production Mode"}
							</span>
						</div>
						<a
							href="/"
							className="bg-primary text-primary-foreground font-heading font-semibold px-6 py-3 rounded-sm hover:bg-primary-hover active:bg-primary-active transition-all duration-150 hover:scale-[1.02] hover:-translate-y-px active:scale-[0.98] active:translate-y-0 uppercase tracking-wide text-sm shadow-sm hover:shadow-md"
						>
							Return Home
						</a>
					</div>
				</IndustrialPanel>
				
				<SafetyStripes position="bottom" />
			</div>
		</main>
	);
}
