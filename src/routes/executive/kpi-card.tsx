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

const colorClasses = {
	green: "text-green-600 bg-green-50 border-green-200 dark:text-green-300 dark:bg-green-900/30 dark:border-green-700",
	yellow: "text-yellow-600 bg-yellow-50 border-yellow-200 dark:text-yellow-300 dark:bg-yellow-900/30 dark:border-yellow-700",
	red: "text-red-600 bg-red-50 border-red-200 dark:text-red-300 dark:bg-red-900/30 dark:border-red-700",
	blue: "text-blue-600 bg-blue-50 border-blue-200 dark:text-blue-300 dark:bg-blue-900/30 dark:border-blue-700",
	purple: "text-purple-600 bg-purple-50 border-purple-200 dark:text-purple-300 dark:bg-purple-900/30 dark:border-purple-700",
};

const trendIcons = {
	up: (
		<svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
			<path
				fillRule="evenodd"
				d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
				clipRule="evenodd"
			/>
		</svg>
	),
	down: (
		<svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
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
	if (loading) {
		return (
			<Card className="border">
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
		<Card className={`border-2 ${colorClasses[color]}`}>
			<CardHeader className="pb-2">
				<CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
			</CardHeader>
			<CardBody>
				<div className="flex items-end justify-between">
					<div>
						<div className={`text-2xl font-bold ${colorClasses[color].split(" ")[0]}`}>
							{typeof value === "number" ? value.toLocaleString() : value}
						</div>
						{subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
					</div>
					{trend && (
						<div className="flex items-center space-x-1 text-sm">
							{trendIcons[trend.direction]}
							<span className="font-medium">({trend.value})</span>
							{trend.label && <span className="text-muted-foreground">{trend.label}</span>}
						</div>
					)}
				</div>
			</CardBody>
		</Card>
	);
}
