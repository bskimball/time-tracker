"use client";

import { Card, CardBody, Metric } from "@monorepo/design-system";
import {
	LiaUsersSolid,
	LiaChartLineSolid,
	LiaClockSolid,
	LiaIndustrySolid,
	LiaDollarSignSolid,
	LiaPercentSolid,
	LiaAwardSolid,
} from "react-icons/lia";

const iconMap = {
	users: LiaUsersSolid,
	chart: LiaChartLineSolid,
	clock: LiaClockSolid,
	industry: LiaIndustrySolid,
	dollar: LiaDollarSignSolid,
	percent: LiaPercentSolid,
	award: LiaAwardSolid,
};

interface KPICardProps {
	title: string;
	value: string | number;
	subtitle?: string;
	trend?: {
		direction: "up" | "down" | "neutral";
		value: number | string;
		label?: string;
	};
	loading?: boolean;
	icon?: keyof typeof iconMap;
}

export function KPICard({
	title,
	value,
	subtitle,
	trend,
	loading = false,
	icon,
}: KPICardProps) {
	const Icon = icon ? iconMap[icon] : null;

	if (loading) {
		return (
			<Card className="h-full border-0 shadow-sm bg-card/50">
				<CardBody className="p-4">
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
		<Card className="h-full group hover:border-primary/50 transition-colors duration-300">
			<CardBody className="p-4 flex flex-col h-full justify-between gap-4">
				<div className="flex items-start justify-between">
					<Metric
						label={title}
						value={value}
						trend={trend?.value}
						trendDirection={trend?.direction}
						className="flex-1"
					/>
					{Icon && (
						<div className="p-2 bg-muted/30 rounded-xs text-muted-foreground group-hover:text-primary transition-colors duration-300">
							<Icon className="h-5 w-5" aria-hidden="true" />
						</div>
					)}
				</div>

				{subtitle && (
					<div className="pt-4 border-t border-border/50 mt-2">
						<p className="text-xs text-muted-foreground font-mono truncate">
							{subtitle}
							{trend?.label && <span className="opacity-70 ml-1">({trend.label})</span>}
						</p>
					</div>
				)}
			</CardBody>
		</Card>
	);
}
