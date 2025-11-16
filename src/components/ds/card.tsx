import React from "react";
import { cn } from "~/lib/cn";

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
 * Card component with semantic structure - Professional warehouse style.
 * Subtle rounded corners, clean shadows, industrial aesthetic.
 */
export function Card({ children, className = "" }: CardProps) {
	return (
		<div
			className={cn(
				"rounded-md bg-card text-card-foreground border border-border shadow-sm transition-all hover:shadow-md",
				className
			)}
		>
			{children}
		</div>
	);
}

/**
 * Card header section - typically contains the title and actions.
 * Professional style with subtle border.
 */
export function CardHeader({ children, className = "" }: CardHeaderProps) {
	return <div className={cn("px-6 py-4 border-b border-border bg-muted/20 rounded-t-md", className)}>{children}</div>;
}

/**
 * Card title - typically used within CardHeader.
 * Modern style with clean heading.
 */
export function CardTitle({ children, className = "" }: CardTitleProps) {
	return <h2 className={cn("text-lg font-semibold tracking-tight", className)}>{children}</h2>;
}

/**
 * Card body section - main content area.
 */
export function CardBody({ children, className = "" }: CardBodyProps) {
	return <div className={cn("px-6 py-4", className)}>{children}</div>;
}
