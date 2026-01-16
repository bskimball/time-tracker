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
 * Card component with semantic structure.
 * Accepts any children but typically used with CardHeader, CardTitle, and CardBody.
 */
export function Card({ children, className = "" }: CardProps) {
	return (
		<div
			className={cn(
				"bg-card text-card-foreground border border-border rounded-md shadow-sm hover:shadow-md transition-all",
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
	return <div className={cn("px-6 py-4 border-b border-border", className)}>{children}</div>;
}

/**
 * Card title - typically used within CardHeader.
 */
export function CardTitle({ children, className = "" }: CardTitleProps) {
	return <h2 className={cn("text-lg font-semibold", className)}>{children}</h2>;
}

/**
 * Card body section - main content area.
 */
export function CardBody({ children, className = "" }: CardBodyProps) {
	return <div className={cn("px-6 py-4", className)}>{children}</div>;
}
