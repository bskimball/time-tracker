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
				"bg-zinc-900 bg-gradient-to-b from-zinc-800 to-zinc-950 text-zinc-50",
				"border border-zinc-700 ring-1 ring-inset ring-white/10",
				"transition-all duration-300 ease-out",
				"hover:border-zinc-600 hover:from-zinc-700/80 hover:to-zinc-900",
				"[--color-foreground:var(--color-zinc-50)] [--color-muted-foreground:var(--color-zinc-400)] [--color-border:var(--color-zinc-700)]",
				className
			)}
		>
			{/* Material Simulation Overlay for all cards */}
			<div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-white/[0.05] via-transparent to-transparent pointer-events-none" />
			
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
				"p-5 border-b border-white/10 bg-white/5",
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
