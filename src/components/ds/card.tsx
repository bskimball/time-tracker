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
 * Card component with semantic structure - Industrial style.
 * Sharp corners, panel shadows, industrial metal aesthetic.
 */
export function Card({ children, className = "" }: CardProps) {
	return (
		<div
			className={cn(
				"panel-shadow bg-card text-card-foreground border-2 border-border transition-all",
				className
			)}
		>
			{children}
		</div>
	);
}

/**
 * Card header section - typically contains the title and actions.
 * Industrial style with bold border.
 */
export function CardHeader({ children, className = "" }: CardHeaderProps) {
	return <div className={cn("px-6 py-4 border-b-2 border-border bg-muted/30", className)}>{children}</div>;
}

/**
 * Card title - typically used within CardHeader.
 * Industrial style with uppercase heading font.
 */
export function CardTitle({ children, className = "" }: CardTitleProps) {
	return <h2 className={cn("font-industrial text-lg font-semibold uppercase tracking-wide", className)}>{children}</h2>;
}

/**
 * Card body section - main content area.
 */
export function CardBody({ children, className = "" }: CardBodyProps) {
	return <div className={cn("px-6 py-4", className)}>{children}</div>;
}
