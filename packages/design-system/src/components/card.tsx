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
				"rounded-none relative group overflow-hidden border-2 border-border/70 shadow-sm",
				"bg-card text-foreground transition-all duration-300 ease-out",
				"hover:border-primary/40 hover:-translate-y-[1px] hover:shadow-[0_4px_10px_-4px_rgba(0,0,0,0.1)]",
				className
			)}
		>
			<div className="absolute top-0 left-0 w-full h-1 bg-border/40 group-hover:bg-primary/20 transition-colors pointer-events-none" />
			<div className="relative z-10 h-full flex flex-col">{children}</div>
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
				"px-6 py-4 border-b-2 border-border/60 bg-muted/20 relative z-10",
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
		<h2 className={cn("text-lg font-display font-bold uppercase tracking-wider text-foreground leading-none", className)}>
			{children}
		</h2>
	);
}

/**
 * Card body section - main content area.
 * Standard padding: p-5 (20px)
 */
export function CardBody({ children, className = "" }: CardBodyProps) {
	return <div className={cn("p-6 flex-1", className)}>{children}</div>;
}

/**
 * Card footer section - typically contains actions/buttons.
 * Standard padding: p-5 (20px), pt-0 to sit flush with body.
 */
export function CardFooter({ children, className = "" }: CardFooterProps) {
	return <div className={cn("px-6 py-4 pt-0 flex items-center border-t-2 border-border/60 mt-auto bg-muted/10", className)}>{children}</div>;
}

