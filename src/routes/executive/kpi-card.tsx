"use client";

import { Card, CardBody } from "~/components/ds/card";

interface KPICardProps {
	title: string;
	value: string | number;
	subtitle?: string;
	trend?: {
		direction: "up" | "down" | "neutral";
		value: number | string;
		label?: string;
	};
	color?: "green" | "yellow" | "red" | "blue" | "purple";
	loading?: boolean;
}

const colorStyles = {
	green: {
		bg: "bg-emerald-500/10",
		text: "text-emerald-600 dark:text-emerald-400",
		border: "border-emerald-200 dark:border-emerald-800",
		icon: "text-emerald-500",
		gradient: "from-emerald-500/20 to-transparent",
	},
	yellow: {
		bg: "bg-amber-500/10",
		text: "text-amber-600 dark:text-amber-400",
		border: "border-amber-200 dark:border-amber-800",
		icon: "text-amber-500",
		gradient: "from-amber-500/20 to-transparent",
	},
	red: {
		bg: "bg-rose-500/10",
		text: "text-rose-600 dark:text-rose-400",
		border: "border-rose-200 dark:border-rose-800",
		icon: "text-rose-500",
		gradient: "from-rose-500/20 to-transparent",
	},
	blue: {
		bg: "bg-blue-500/10",
		text: "text-blue-600 dark:text-blue-400",
		border: "border-blue-200 dark:border-blue-800",
		icon: "text-blue-500",
		gradient: "from-blue-500/20 to-transparent",
	},
	purple: {
		bg: "bg-violet-500/10",
		text: "text-violet-600 dark:text-violet-400",
		border: "border-violet-200 dark:border-violet-800",
		icon: "text-violet-500",
		gradient: "from-violet-500/20 to-transparent",
	},
};

const trendIcons = {
	up: (
		<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
		</svg>
	),
	down: (
		<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
		</svg>
	),
	neutral: (
		<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
		</svg>
	),
};

export function KPICard({
	title,
	value,
	subtitle,
	trend,
	color = "blue",
	loading = false,
}: KPICardProps) {
	const styles = colorStyles[color];

	if (loading) {
		return (
			<Card className="overflow-hidden border-0 shadow-sm bg-card/50">
				<CardBody className="p-6">
					<div className="animate-pulse space-y-4">
						<div className="h-4 bg-muted/50 rounded w-1/2"></div>
						<div className="h-8 bg-muted/50 rounded w-3/4"></div>
						<div className="h-4 bg-muted/50 rounded w-1/3"></div>
					</div>
				</CardBody>
			</Card>
		);
	}

	return (
		<Card className="relative overflow-hidden group bg-card">
			<div className={`absolute top-0 right-0 w-32 h-32 bg-linear-to-br ${styles.gradient} opacity-20 rounded-bl-full -mr-8 -mt-8 transition-opacity group-hover:opacity-30`} />

			<CardBody className="p-6 relative z-10">
				<div className="flex flex-col h-full justify-between gap-4">
					<div>
						<h3 className="text-sm font-medium text-muted-foreground tracking-wide uppercase opacity-80">
							{title}
						</h3>
						<div className="mt-2 flex items-baseline gap-2">
							<span className="text-3xl font-bold tracking-tight text-foreground">
								{typeof value === "number" ? value.toLocaleString() : value}
							</span>
						</div>
					</div>

					<div className="flex items-center justify-between">
						{subtitle && (
							<p className="text-xs text-muted-foreground font-medium">
								{subtitle}
							</p>
						)}

						{trend && (
							<div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${trend.direction === 'up' && color === 'green' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' :
									trend.direction === 'down' && color === 'red' ? 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400' :
										trend.direction === 'up' && color === 'red' ? 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400' : // Bad up
											trend.direction === 'down' && color === 'green' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' : // Good down
												'bg-secondary text-secondary-foreground'
								}`}>
								{trendIcons[trend.direction]}
								<span>{trend.value}</span>
							</div>
						)}
					</div>
				</div>
			</CardBody>
		</Card>
	);
}
