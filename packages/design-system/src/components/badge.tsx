import React from "react";
import { cn } from "../utils/cn";

type BadgeVariant = "primary" | "secondary" | "outline" | "destructive" | "success";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
	variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
	primary: "bg-primary text-primary-foreground border-transparent",
	secondary: "bg-secondary text-secondary-foreground border-transparent",
	outline: "text-foreground border-border",
	destructive: "bg-destructive text-destructive-foreground border-transparent",
	success: "bg-chart-3 text-white border-transparent", // Using Chart Green
};

export function Badge({ className, variant = "primary", ...props }: BadgeProps) {
	return (
		<span
			className={cn(
				"inline-flex items-center px-2.5 py-0.5 rounded-[2px] text-xs font-mono font-medium border transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
				variantStyles[variant],
				className
			)}
			{...props}
		/>
	);
}
