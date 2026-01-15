import React from "react";
import { cn } from "../utils/cn";

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
		container: "bg-card border border-primary/30 text-foreground shadow-sm",
		text: "text-foreground",
		icon: "text-primary",
	},
	error: {
		container: "bg-card border border-destructive/30 text-foreground shadow-sm",
		text: "text-foreground",
		icon: "text-destructive",
	},
	warning: {
		container: "bg-primary/5 border border-primary/30 text-foreground shadow-sm",
		text: "text-foreground",
		icon: "text-primary",
	},
	info: {
		container: "bg-card border border-secondary/30 text-foreground shadow-sm",
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
 * Alert component for displaying messages to the user - Industrial technical style.
 * Tight corners, subtle borders, rugged aesthetic.
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
		<div
			className={cn("rounded-sm flex gap-3 p-4 animate-fade-in", styles.container, className)}
			role="alert"
		>
			<div className={cn("shrink-0 text-lg font-bold font-mono", styles.icon)}>{displayIcon}</div>
			<div className="flex-1">
				{title && <h3 className={cn("font-heading mb-1", styles.text)}>{title}</h3>}
				<div className={cn("text-sm", styles.text)}>{children}</div>
			</div>
			{onClose && (
				<button
					onClick={onClose}
					className={cn(
						"shrink-0 text-lg font-bold hover:opacity-70 transition-opacity duration-150 rounded-sm",
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
