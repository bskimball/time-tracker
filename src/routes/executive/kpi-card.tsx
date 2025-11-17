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

// Industrial color classes using CSS variables
const colorClasses = {
	green: "text-primary bg-primary/10 border-primary",
	yellow: "text-primary bg-primary/10 border-primary",
	red: "text-destructive bg-destructive/10 border-destructive",
	blue: "text-secondary bg-secondary/10 border-secondary",
	purple: "text-accent bg-accent/10 border-accent",
};

const trendIcons = {
	up: (
		<svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
			<path
				fillRule="evenodd"
				d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
				clipRule="evenodd"
			/>
		</svg>
	),
	down: (
		<svg className="w-4 h-4 text-destructive" fill="currentColor" viewBox="0 0 20 20">
			<path
				fillRule="evenodd"
				d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
				clipRule="evenodd"
			/>
		</svg>
	),
	neutral: (
		<svg className="w-4 h-4 text-secondary" fill="currentColor" viewBox="0 0 20 20">
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
			<Card className="border-2">
				<CardHeader>
					<div className="animate-pulse">
						<div className="h-4 bg-muted w-3/4 mb-2"></div>
						<div className="h-8 bg-muted w-1/2"></div>
					</div>
				</CardHeader>
			</Card>
		);
	}

	return (
		<Card className={`border-2 ${colorClasses[color]}`}>
			<CardHeader className="pb-2">
				<CardTitle className="text-sm font-medium text-muted-foreground normal-case tracking-normal">
					{title}
				</CardTitle>
			</CardHeader>
			<CardBody>
				<div className="flex items-end justify-between">
					<div>
						<div
							className={`font-mono-industrial text-2xl font-bold ${colorClasses[color].split(" ")[0]}`}
						>
							{typeof value === "number" ? value.toLocaleString() : value}
						</div>
						{subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
					</div>
					{trend && (
						<div className="flex items-center space-x-1 text-sm">
							{trendIcons[trend.direction]}
							<span className="font-mono-industrial font-medium">({trend.value})</span>
							{trend.label && <span className="text-xs text-muted-foreground">{trend.label}</span>}
						</div>
					)}
				</div>
			</CardBody>
		</Card>
	);
}
