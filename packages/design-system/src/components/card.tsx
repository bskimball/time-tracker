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

/**
 * Card component - Industrial Professional style.
 * Tight corners, subtle depth, premium feel with subtle interactions.
 */
export function Card({ children, className = "" }: CardProps) {
	return (
		<div
			className={cn(
				"rounded-sm bg-card text-card-foreground border border-border shadow-sm",
				"transition-colors duration-200 ease-out",
				"hover:border-primary/20",
				className
			)}
		>
			{children}
		</div>
	);
}

/**
 * Card header section - typically contains the title and actions.
 */
export function CardHeader({ children, className = "" }: CardHeaderProps) {
	return (
		<div
			className={cn(
				"px-6 py-4 border-b border-border bg-muted/10 rounded-t-sm",
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
		<h2 className={cn("text-lg font-heading transition-colors duration-150", className)}>
			{children}
		</h2>
	);
}

/**
 * Card body section - main content area.
 */
export function CardBody({ children, className = "" }: CardBodyProps) {
	return <div className={cn("px-6 py-4", className)}>{children}</div>;
}
