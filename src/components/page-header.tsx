import React from "react";
import { cn } from "~/lib/cn";

interface PageHeaderProps {
	title: string;
	subtitle?: string;
	actions?: React.ReactNode;
	className?: string;
}

/**
 * PageHeader component - Standardized header for internal admin pages
 *
 * Implements the Industrial Professional design system with:
 * - Consistent typography (font-heading, uppercase)
 * - Proper sizing hierarchy (text-4xl for titles)
 * - Optional subtitle and action buttons
 *
 * @example
 * <PageHeader
 *   title="Executive Dashboard"
 *   subtitle="Performance analytics and insights"
 *   actions={<Button>Export</Button>}
 * />
 */
export function PageHeader({ title, subtitle, actions, className }: PageHeaderProps) {
	return (
		<div className={cn("flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8", className)}>
			<div>
				<h1 className="text-4xl font-bold uppercase tracking-tight font-heading text-foreground">
					{title}
				</h1>
				{subtitle && <div className="text-muted-foreground mt-2 text-base flex items-center gap-2"><span className="font-bold">::</span><span>{subtitle}</span></div>}
			</div>
			{actions && <div className="flex items-center gap-2">{actions}</div>}
		</div>
	);
}
