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
		container: "bg-green-50 border-green-200 text-green-800",
		text: "text-green-800",
		icon: "text-green-600",
	},
	error: {
		container: "bg-red-50 border-red-200 text-red-800",
		text: "text-red-800",
		icon: "text-red-600",
	},
	warning: {
		container: "bg-amber-50 border-amber-200 text-amber-800",
		text: "text-amber-800",
		icon: "text-amber-600",
	},
	info: {
		container: "bg-blue-50 border-blue-200 text-blue-800",
		text: "text-blue-800",
		icon: "text-blue-600",
	},
};

const defaultIcons: Record<AlertVariant, string> = {
	success: "✓",
	error: "✕",
	warning: "⚠",
	info: "ℹ",
};

/**
 * Alert component for displaying messages to the user.
 * Works in both server and client components.
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
		<div className={cn("flex gap-3 rounded-md p-4", styles.container, className)} role="alert">
			<div className={cn("flex-shrink-0 text-lg font-bold", styles.icon)}>{displayIcon}</div>
			<div className="flex-1">
				{title && <h3 className={cn("font-semibold", styles.text)}>{title}</h3>}
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
