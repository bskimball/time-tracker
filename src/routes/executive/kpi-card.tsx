"use client";

import { Card, CardHeader, CardTitle, CardBody } from "~/components/ds/card";

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

const colorConfig = {
	green: {
		text: "text-green-700 dark:text-green-400",
		gradient: "from-green-500/20 to-transparent",
		icon: "text-green-500",
		border: "border-green-100 dark:border-green-900/50",
	},
	yellow: {
		text: "text-yellow-700 dark:text-yellow-400",
		gradient: "from-yellow-500/20 to-transparent",
		icon: "text-yellow-500",
		border: "border-yellow-100 dark:border-yellow-900/50",
	},
	red: {
		text: "text-red-700 dark:text-red-400",
		gradient: "from-red-500/20 to-transparent",
		icon: "text-red-500",
		border: "border-red-100 dark:border-red-900/50",
	},
	blue: {
		text: "text-blue-700 dark:text-blue-400",
		gradient: "from-blue-500/20 to-transparent",
		icon: "text-blue-500",
		border: "border-blue-100 dark:border-blue-900/50",
	},
	purple: {
		text: "text-purple-700 dark:text-purple-400",
		gradient: "from-purple-500/20 to-transparent",
		icon: "text-purple-500",
		border: "border-purple-100 dark:border-purple-900/50",
	},
};

const trendIcons = {
	up: (
		<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
			<path
				fillRule="evenodd"
				d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
				clipRule="evenodd"
			/>
		</svg>
	),
	down: (
		<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
			<path
				fillRule="evenodd"
				d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
				clipRule="evenodd"
			/>
		</svg>
	),
	neutral: (
		<svg className="w-4 h-4 text-muted-foreground" fill="currentColor" viewBox="0 0 20 20">
			<path
				fillRule="evenodd"
				d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
				clipRule="evenodd"
			/>
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
	const config = colorConfig[color];

	if (loading) {
		return (
			<Card className="border overflow-hidden relative">
				<CardHeader>
					<div className="animate-pulse">
						<div className="h-4 bg-accent rounded w-3/4 mb-2"></div>
						<div className="h-8 bg-accent rounded w-1/2"></div>
					</div>
				</CardHeader>
			</Card>
		);
	}

	return (
		<Card className={`relative overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 rounded-xl`}>
			{/* Subtle Circular Gradient in Top Right */}
			<div
				className={`absolute -top-16 -right-16 w-40 h-40 rounded-full bg-gradient-to-br ${config.gradient} blur-3xl opacity-50 pointer-events-none`}
			/>

			<CardHeader className="pb-2 relative z-10 border-b-0">
				<CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
					{title}
				</CardTitle>
			</CardHeader>
			<CardBody className="relative z-10 pt-0 pb-6">
				<div className="flex items-end justify-between">
					<div>
						<div className={`text-3xl font-bold tracking-tight ${config.text}`}>
							{typeof value === "number" ? value.toLocaleString() : value}
						</div>
						{subtitle && (
							<p className="text-xs text-muted-foreground mt-1 font-medium pl-0.5">
								{subtitle}
							</p>
						)}
					</div>
					{trend && (
						<div className="flex flex-col items-end">
							<div className="flex items-center space-x-1 text-sm bg-accent/50 px-2 py-1 rounded-md backdrop-blur-sm border border-transparent hover:border-border transition-colors">
								<span
									className={
										trend.direction === "up"
											? "text-green-500"
											: trend.direction === "down"
												? "text-red-500"
												: "text-muted-foreground"
									}
								>
									{trendIcons[trend.direction]}
								</span>
								<span
									className={`font-semibold ${
										trend.direction === "up"
											? "text-green-600 dark:text-green-400"
											: trend.direction === "down"
												? "text-red-600 dark:text-red-400"
												: "text-foreground"
									}`}
								>
									{trend.value}
								</span>
							</div>
							{trend.label && (
								<span className="text-muted-foreground text-[10px] mt-1 text-right">
									{trend.label}
								</span>
							)}
						</div>
					)}
				</div>
			</CardBody>
		</Card>
	);
}
