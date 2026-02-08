"use client";

import { cn } from "~/lib/cn";

interface IndustrialLoaderProps {
	className?: string;
	variant?: "processing" | "standby" | "scanning";
	color?: "primary" | "secondary" | "success" | "warning" | "destructive";
	isAnimated?: boolean;
}

export function IndustrialLoader({
	className,
	variant = "processing",
	color = "primary",
	isAnimated = true,
}: IndustrialLoaderProps) {
	// Color mapping to CSS variables
	const colorVar = `var(--color-${color})`;

	if (variant === "scanning") {
		return (
			<div className={cn("relative h-1 w-24 overflow-hidden rounded-[1px] bg-muted/20", className)}>
				<div
					className={cn(
						"absolute inset-0 w-1/3 bg-current opacity-50 blur-[2px]",
						isAnimated && "animate-scanner-line"
					)}
					style={{ color: colorVar }}
				/>
				<div
					className={cn(
						"absolute inset-0 w-1/3 bg-current",
						isAnimated && "animate-scanner-line"
					)}
					style={{ color: colorVar }}
				/>
			</div>
		);
	}

	if (variant === "standby") {
		return (
			<div className={cn("flex items-center gap-1.5", className)}>
				<div
					className={cn(
						"h-1.5 w-1.5 rounded-full bg-current",
						isAnimated && "animate-pulse-glow"
					)}
					style={{ color: colorVar, animationDuration: "3s" }}
				/>
				<span
					className={cn(
						"text-[10px] font-mono uppercase tracking-widest text-muted-foreground",
						isAnimated && "animate-pulse"
					)}
				>
					Standby
				</span>
			</div>
		);
	}

	// Default: "processing" (TUI style blinking blocks)
	return (
		<div className={cn("flex items-center gap-0.5", className)} aria-label="Loading">
			{[0, 1, 2].map((i) => (
				<div
					key={i}
					className={cn(
						"h-2.5 w-1.5 bg-current rounded-[0.5px]",
						isAnimated ? "animate-sequence-pulse" : "opacity-30"
					)}
					style={{
						color: colorVar,
						animationDelay: isAnimated ? `${i * 200}ms` : undefined,
						animationDuration: isAnimated ? "1.5s" : undefined,
					}}
				/>
			))}
		</div>
	);
}
