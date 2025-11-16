import React from "react";
import { cn } from "~/lib/cn";

type AlertVariant = "success" | "error" | "warning" | "info";

interface AlertProps {
	children: React.ReactNode;
	variant?: AlertVariant;
	className?: string;
	icon?: React.ReactNode;
	title?: string;
	onClose?: () => void;
}

const variantStyles: Record<AlertVariant, { container: string; text: string; icon: string }> = {
	success: {
		container: "bg-card border-2 border-primary text-foreground",
		text: "text-foreground",
		icon: "text-primary",
	},
	error: {
		container: "bg-card border-2 border-destructive text-foreground",
		text: "text-foreground",
		icon: "text-destructive",
	},
	warning: {
		container: "bg-primary/10 border-2 border-primary text-foreground",
		text: "text-foreground",
		icon: "text-primary",
	},
	info: {
		container: "bg-card border-2 border-secondary text-foreground",
		text: "text-foreground",
		icon: "text-secondary",
	},
};

const defaultIcons: Record<AlertVariant, string> = {
	success: "✓",
	error: "✕",
	warning: "⚠",
	info: "ℹ",
};

/**
 * Alert component for displaying messages to the user - Industrial style.
 * Sharp corners, bold borders, high contrast industrial colors.
 */
export function Alert({
	children,
	variant = "info",
	className = "",
	icon,
	title,
	onClose,
}: AlertProps) {
	const styles = variantStyles[variant];
	const displayIcon = icon ?? defaultIcons[variant];

	return (
		<div className={cn("panel-shadow flex gap-3 p-4", styles.container, className)} role="alert">
			<div className={cn("flex-shrink-0 text-lg font-bold", styles.icon)}>{displayIcon}</div>
			<div className="flex-1">
				{title && <h3 className={cn("font-industrial font-semibold uppercase tracking-wide", styles.text)}>{title}</h3>}
				<div className={cn("text-sm", styles.text)}>{children}</div>
			</div>
			{onClose && (
				<button
					onClick={onClose}
					className={cn(
						"flex-shrink-0 text-lg font-bold hover:opacity-70 transition-opacity",
						styles.text
					)}
					aria-label="Close alert"
				>
					✕
				</button>
			)}
		</div>
	);
}
