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
		<div className={cn("mb-10", className)}>
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-6">
				<div>
					<h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight font-display text-foreground leading-[0.95]">
						{title}
					</h1>
					{subtitle && (
						<div className="text-muted-foreground mt-3 text-sm font-mono tracking-widest uppercase flex items-center gap-3">
							<span className="text-primary font-bold">::</span>
							<span>{subtitle}</span>
						</div>
					)}
				</div>
				{actions && <div className="flex items-center gap-3">{actions}</div>}
			</div>

			<div className="border-b-2 border-border/80" />
		</div>
	);
}
