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
				"rounded-[2px] bg-card text-card-foreground border border-border shadow-sm relative group overflow-hidden",
				"transition-all duration-300 ease-out",
				"hover:border-border hover:shadow-industrial",
				className
			)}
		>
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
				"p-5 border-b border-border/50 bg-muted/10",
				"transition-colors duration-150",
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
		<h2 className={cn("text-lg font-heading font-semibold tracking-tight text-foreground", className)}>
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
