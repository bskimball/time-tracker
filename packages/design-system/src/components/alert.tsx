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

const variantStyles: Record<AlertVariant, { container: string; icon: string }> = {
	success: {
		container: "border-l-chart-3",
		icon: "text-chart-3",
	},
	error: {
		container: "border-l-destructive",
		icon: "text-destructive",
	},
	warning: {
		container: "border-l-chart-1", // Using Orange/Amber for warning
		icon: "text-chart-1",
	},
	info: {
		container: "border-l-secondary",
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
 * "Status Card" aesthetic: Left border strip, neutral background, hard edges.
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
			className={cn(
				"relative flex gap-3 p-4 animate-fade-in",
				"bg-card text-foreground shadow-sm",
				"rounded-[2px] border border-border border-l-4",
				styles.container,
				className
			)}
			role="alert"
		>
			<div className={cn("shrink-0 text-sm font-bold font-mono mt-0.5", styles.icon)}>
				{displayIcon}
			</div>
			<div className="flex-1 min-w-0">
				{title && (
					<h3 className="font-industrial font-bold uppercase tracking-wide text-xs mb-1 text-foreground">
						{title}
					</h3>
				)}
				<div className="text-sm font-mono text-muted-foreground break-words">{children}</div>
			</div>
			{onClose && (
				<button
					onClick={onClose}
					className="shrink-0 text-lg font-bold text-muted-foreground hover:text-foreground transition-colors duration-150 rounded-[1px] focus:outline-none focus-visible:ring-1 focus-visible:ring-ring"
					aria-label="Close alert"
				>
					✕
				</button>
			)}
		</div>
	);
}

