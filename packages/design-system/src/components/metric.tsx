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
		<div className={cn("flex flex-col gap-2", className)} {...props}>
			<dt className="text-[10px] font-mono tracking-widest text-muted-foreground uppercase font-bold">
				{label}
			</dt>
			<dd className="flex items-baseline gap-3">
				<span className="text-4xl md:text-5xl font-display font-black tracking-tight text-foreground leading-[0.9]">
					{value}
				</span>
				{trend && (
					<span
						className={cn(
							"text-[10px] font-mono font-bold px-2 py-0.5 border uppercase tracking-wider",
							trendDirection === "up" && "text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800",
							trendDirection === "down" && "text-destructive bg-destructive/10 border-destructive/20",
							trendDirection === "neutral" && "text-muted-foreground bg-muted border-border"
						)}
					>
						{trendDirection === "up" ? "↑" : trendDirection === "down" ? "↓" : "→"} {trend}
					</span>
				)}
			</dd>
		</div>
	);
}
