import React from "react";
import { cn } from "../utils/cn";

interface SafetyStripesProps extends React.HTMLAttributes<HTMLDivElement> {
	position?: "top" | "bottom";
}

export function SafetyStripes({ className, position = "top", ...props }: SafetyStripesProps) {
	return (
		<div
			className={cn(
				"safety-stripes h-1", /* Thinner */
				"transition-all duration-300 ease-out opacity-50",
				position === "top" ? "mb-6 rounded-t-[1px]" : "mt-6 rounded-b-[1px]",
				className
			)}
			{...props}
		/>
	);
}

interface IndustrialPanelProps extends React.HTMLAttributes<HTMLDivElement> {
	variant?: "default" | "destructive";
}

export function IndustrialPanel({
	className,
	children,
	variant = "default",
	...props
}: IndustrialPanelProps) {
	return (
		<div
			className={cn(
				"bg-card border rounded-[2px] overflow-hidden relative",
				"transition-all duration-200 ease-out",
				"hover:shadow-industrial hover:-translate-y-[1px]",
				variant === "destructive" ? "border-primary/50" : "border-border",
				className
			)}
			{...props}
		>
			{children}
		</div>
	);
}

interface IndustrialHeaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
	title: React.ReactNode;
	subtitle?: React.ReactNode;
	badge?: React.ReactNode;
}

export function IndustrialHeader({
	className,
	title,
	subtitle,
	badge,
	children,
	...props
}: IndustrialHeaderProps) {
	return (
		<div
			className={cn(
				"bg-foreground text-background p-8 relative overflow-hidden bg-noise", /* Dark background (Braun style) */
				"transition-all duration-300 ease-out",
				className
			)}
			{...props}
		>
			<div className="absolute inset-0 bg-tactical-grid opacity-10" aria-hidden="true" />
			<div className="relative flex items-start gap-6">
				<div className="flex-1">
					{subtitle && (
						<div className="font-industrial text-xs tracking-[0.1em] text-muted-foreground mb-2 transition-opacity duration-200">
							{subtitle}
						</div>
					)}
					<h1 className="font-display text-4xl font-bold mb-4 tracking-tight text-white">
						{title}
					</h1>
					{badge && (
						<div className="font-mono text-xs text-background bg-primary px-3 py-1 rounded-[1px] inline-flex items-center gap-2">
							{badge}
						</div>
					)}
					{children}
				</div>
			</div>
		</div>
	);
}

export function IndustrialSection({
	className,
	title,
	children,
	...props
}: React.HTMLAttributes<HTMLDivElement> & { title?: string }) {
	return (
		<div
			className={cn("p-8 border-b border-border", "transition-colors duration-200", className)}
			{...props}
		>
			{title && (
				<div className="font-industrial text-xs tracking-wider text-muted-foreground mb-6">
					{title}
				</div>
			)}
			{children}
		</div>
	);
}
