import React from "react";
import { cn } from "~/lib/cn";

interface SafetyStripesProps extends React.HTMLAttributes<HTMLDivElement> {
	position?: "top" | "bottom";
}

export function SafetyStripes({
	className,
	position = "top",
	...props
}: SafetyStripesProps) {
	return (
		<div
			className={cn(
				"safety-stripes h-3",
				position === "top" ? "mb-8 rounded-t" : "mt-8 rounded-b",
				className,
			)}
			{...props}
		/>
	);
}

interface LedIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
	active?: boolean;
}

export function LedIndicator({
	className,
	active = false,
	...props
}: LedIndicatorProps) {
	return (
		<div className="flex flex-col items-center gap-2 pt-1">
			<div
				className={cn(
					"led-indicator w-6 h-6",
					active && "active bg-destructive-foreground",
					!active && "bg-muted-foreground/20",
					className,
				)}
				{...props}
			/>
			<div className="w-px h-full bg-destructive-foreground/30" />
		</div>
	);
}

interface IndustrialPanelProps extends React.HTMLAttributes<HTMLDivElement> {
	variant?: "default" | "destructive";
}

export function IndustrialPanel({
	className,
	children,
	variant = "destructive",
	...props
}: IndustrialPanelProps) {
	return (
		<div
			className={cn(
				"bg-card border-4 rounded panel-shadow overflow-hidden",
				variant === "destructive" ? "border-destructive" : "border-border",
				className,
			)}
			{...props}
		>
			{children}
		</div>
	);
}

interface IndustrialHeaderProps
	extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
	title: React.ReactNode;
	subtitle?: React.ReactNode;
	badge?: React.ReactNode;
	active?: boolean;
}

export function IndustrialHeader({
	className,
	title,
	subtitle,
	badge,
	active = true,
	children,
	...props
}: IndustrialHeaderProps) {
	return (
		<div
			className={cn(
				"bg-destructive text-destructive-foreground p-8 relative overflow-hidden",
				className,
			)}
			{...props}
		>
			<div className="absolute inset-0 bg-grid-pattern-diagonal opacity-20" />
			<div className="relative flex items-start gap-6">
				<LedIndicator active={active} />

				<div className="flex-1">
					{subtitle && (
						<div className="font-industrial text-sm uppercase tracking-widest opacity-90 mb-2">
							{subtitle}
						</div>
					)}
					<h1 className="font-industrial text-7xl font-bold mb-4 tracking-tight">
						{title}
					</h1>
					{badge && (
						<div className="font-mono-industrial text-lg opacity-95 bg-destructive-foreground/10 px-4 py-2 rounded border border-destructive-foreground/20 inline-block">
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
		<div className={cn("p-8 border-b border-border", className)} {...props}>
			{title && (
				<div className="font-industrial text-sm uppercase tracking-widest text-muted-foreground mb-3">
					{title}
				</div>
			)}
			{children}
		</div>
	);
}
