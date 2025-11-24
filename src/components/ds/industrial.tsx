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
				"safety-stripes h-2",
				"transition-all duration-300 ease-out",
				position === "top" ? "mb-6 rounded-t-sm" : "mt-6 rounded-b-sm",
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
					"led-indicator w-5 h-5",
					"transition-all duration-300 ease-out",
					active && "active bg-primary scale-110",
					!active && "bg-muted-foreground/20 scale-100",
					className,
				)}
				{...props}
			/>
			<div className={cn(
				"w-px h-full transition-colors duration-300",
				active ? "bg-primary/30" : "bg-muted-foreground/20"
			)} />
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
				"bg-card border-2 rounded-sm panel-shadow overflow-hidden",
				"transition-all duration-200 ease-out",
				"hover:shadow-lg hover:-translate-y-0.5",
				variant === "destructive" ? "border-primary" : "border-border",
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
				"bg-primary text-primary-foreground p-8 relative overflow-hidden",
				"transition-all duration-300 ease-out",
				className,
			)}
			{...props}
		>
			<div className="absolute inset-0 bg-grid-pattern-diagonal opacity-10" />
			<div className="relative flex items-start gap-6 animate-slide-up">
				<LedIndicator active={active} />

				<div className="flex-1">
					{subtitle && (
						<div className="font-heading text-xs uppercase tracking-widest opacity-90 mb-3 transition-opacity duration-200">
							{subtitle}
						</div>
					)}
					<h1 className="font-display text-5xl font-bold mb-4 tracking-tight transition-transform duration-200 hover:scale-[1.01]">
						{title}
					</h1>
					{badge && (
						<div className="font-data text-sm opacity-95 bg-primary-foreground/10 px-4 py-2 rounded-sm border border-primary-foreground/20 inline-block transition-all duration-150 hover:bg-primary-foreground/15">
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
		<div className={cn(
			"p-8 border-b border-border",
			"transition-colors duration-200",
			className
		)} {...props}>
			{title && (
				<div className="font-heading text-xs uppercase tracking-wider text-muted-foreground mb-4 transition-colors duration-150">
					{title}
				</div>
			)}
			{children}
		</div>
	);
}
