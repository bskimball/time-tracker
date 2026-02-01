import React from "react";
import { cn } from "../utils/cn";

interface MetricProps extends React.HTMLAttributes<HTMLDivElement> {
	label: string;
	value: string | number;
	trend?: string | number;
	trendDirection?: "up" | "down" | "neutral";
}

export function Metric({
	label,
	value,
	trend,
	trendDirection = "neutral",
	className,
	...props
}: MetricProps) {
	return (
		<div className={cn("flex flex-col gap-1", className)} {...props}>
			<dt className="text-xs font-industrial tracking-wider text-muted-foreground uppercase">
				{label}
			</dt>
			<dd className="flex items-baseline gap-3">
				<span className="text-3xl font-display font-bold tracking-tight text-foreground">
					{value}
				</span>
				{trend && (
					<span
						className={cn(
							"text-xs font-mono font-medium px-1.5 py-0.5 rounded-[1px]",
							trendDirection === "up" && "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 dark:text-emerald-400",
							trendDirection === "down" && "text-destructive bg-destructive/10",
							trendDirection === "neutral" && "text-muted-foreground bg-muted"
						)}
					>
						{trendDirection === "up" ? "↑" : trendDirection === "down" ? "↓" : "→"} {trend}
					</span>
				)}
			</dd>
		</div>
	);
}
