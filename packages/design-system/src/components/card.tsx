import React from "react";
import { cn } from "../utils/cn";

interface CardProps {
	children: React.ReactNode;
	className?: string;
}

interface CardHeaderProps {
	children: React.ReactNode;
	className?: string;
}

interface CardTitleProps {
	children: React.ReactNode;
	className?: string;
}

interface CardBodyProps {
	children: React.ReactNode;
	className?: string;
}

interface CardFooterProps {
	children: React.ReactNode;
	className?: string;
}

/**
 * Card component - Industrial Professional style (Braun/Rams).
 * Clean lines, subtle machined details, matte finish.
 */
export function Card({ children, className = "" }: CardProps) {
	return (
		<div
			className={cn(
				"rounded-[2px] relative group overflow-hidden",
				// Light mode
				"bg-white bg-gradient-to-b from-zinc-50 to-zinc-100/80 text-zinc-900",
				"border border-zinc-200 ring-1 ring-inset ring-black/5",
				"transition-all duration-300 ease-out",
				"hover:border-zinc-300 hover:from-zinc-100 hover:to-zinc-200/80",
				"[--color-foreground:var(--color-zinc-900)] [--color-muted-foreground:var(--color-zinc-500)] [--color-border:var(--color-zinc-200)]",
				// Dark mode
				"dark:bg-zinc-900 dark:bg-gradient-to-b dark:from-zinc-800 dark:to-zinc-950 dark:text-zinc-50",
				"dark:border-zinc-700 dark:ring-white/10",
				"dark:hover:border-zinc-600 dark:hover:from-zinc-700/80 dark:hover:to-zinc-900",
				"dark:[--color-foreground:var(--color-zinc-50)] dark:[--color-muted-foreground:var(--color-zinc-400)] dark:[--color-border:var(--color-zinc-700)]",
				className
			)}
		>
			{/* Material Simulation Overlay for all cards */}
			<div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-black/[0.03] dark:from-white/[0.05] via-transparent to-transparent pointer-events-none" />
			
			<div className="relative z-10">{children}</div>
		</div>
	);
}

/**
 * Card header section - typically contains the title and actions.
 * Standard padding: p-5 (20px)
 */
export function CardHeader({ children, className = "" }: CardHeaderProps) {
	return (
		<div
			className={cn(
				"p-5 border-b border-black/5 bg-black/[0.02]",
				"dark:border-white/10 dark:bg-white/5",
				"transition-colors duration-150 relative z-10",
				className
			)}
		>
			{children}
		</div>
	);
}

/**
 * Card title - typically used within CardHeader.
 */
export function CardTitle({ children, className = "" }: CardTitleProps) {
	return (
		<h2 className={cn("text-lg font-heading font-semibold tracking-tight text-inherit", className)}>
			{children}
		</h2>
	);
}

/**
 * Card body section - main content area.
 * Standard padding: p-5 (20px)
 */
export function CardBody({ children, className = "" }: CardBodyProps) {
	return <div className={cn("p-5", className)}>{children}</div>;
}

/**
 * Card footer section - typically contains actions/buttons.
 * Standard padding: p-5 (20px), pt-0 to sit flush with body.
 */
export function CardFooter({ children, className = "" }: CardFooterProps) {
	return <div className={cn("p-5 pt-0 flex items-center", className)}>{children}</div>;
}
