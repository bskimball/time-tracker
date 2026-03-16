"use client";

import { Card, CardBody, Metric } from "@monorepo/design-system";
import { useEffect, useState, useRef } from "react";
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

const MAX_ANIMATION_CACHE_KEYS = 200;
const seenAnimationKeys = new Set<string>();

function markAnimationSeen(cacheKey: string) {
	if (seenAnimationKeys.has(cacheKey)) {
		return;
	}

	seenAnimationKeys.add(cacheKey);
	if (seenAnimationKeys.size <= MAX_ANIMATION_CACHE_KEYS) {
		return;
	}

	const oldestKey = seenAnimationKeys.values().next().value;
	if (typeof oldestKey === "string") {
		seenAnimationKeys.delete(oldestKey);
	}
}

function useCountUp(end: string | number, duration = 1000, enabled = true) {
	const [count, setCount] = useState<string | number>(() => (typeof end === "number" ? 0 : "0"));
	const startTime = useRef<number | null>(null);
	const numericEnd = typeof end === "string" ? parseFloat(end.replace(/[^0-9.-]/g, "")) : end;
	const isNumeric = !isNaN(numericEnd);

	useEffect(() => {
		if (!enabled || !isNumeric) {
			return;
		}

		startTime.current = null;

		const animate = (timestamp: number) => {
			if (!startTime.current) startTime.current = timestamp;
			const progress = timestamp - startTime.current;
			const percentage = Math.min(progress / duration, 1);

			// Easing function: easeOutQuart
			const ease = 1 - Math.pow(1 - percentage, 4);

			const currentVal = numericEnd * ease;

			if (typeof end === "string") {
				if (end.includes("$")) {
					setCount(`$${currentVal.toLocaleString(undefined, { maximumFractionDigits: 0 })}`);
				} else if (end.includes("%")) {
					setCount(`${currentVal.toFixed(1)}%`);
				} else {
					setCount(currentVal.toFixed(end.includes(".") ? 1 : 0));
				}
			} else {
				setCount(Number(currentVal.toFixed(1)));
			}

			if (progress < duration) {
				window.requestAnimationFrame(animate);
			} else {
				setCount(end);
			}
		};

		const id = window.requestAnimationFrame(animate);
		return () => window.cancelAnimationFrame(id);
	}, [end, duration, enabled, isNumeric, numericEnd]);

	if (!enabled || !isNumeric) {
		return end;
	}

	return count;
}

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
	animateCountUp?: boolean;
	animationCacheKey?: string;
	/** When true, renders with a dark "anodized" aesthetic */
	dominant?: boolean;
	/** "dense" reduces padding and uses a tighter layout */
	variant?: "default" | "dense";
}

export function KPICard({
	title,
	value,
	subtitle,
	trend,
	loading = false,
	icon,
	animateCountUp = true,
	animationCacheKey,
	dominant = false,
	variant = "default",
}: KPICardProps) {
	const Icon = icon ? iconMap[icon] : null;
	const shouldAnimate =
		animateCountUp && !(animationCacheKey && seenAnimationKeys.has(animationCacheKey));
	const animatedValue = useCountUp(value, 1000, shouldAnimate);

	useEffect(() => {
		if (animationCacheKey) {
			markAnimationSeen(animationCacheKey);
		}
	}, [animationCacheKey]);

	const isDense = variant === "dense";

	if (loading) {
		return (
			<Card className="h-full border-2 border-border/60 bg-muted/10">
				<CardBody
					className={`${isDense ? "p-4 gap-3" : "p-6 gap-6"} flex flex-col h-full justify-between relative`}
				>
					<div className="absolute inset-0 bg-noise opacity-[0.25] pointer-events-none mix-blend-overlay" />
					<div className="flex items-start justify-between relative z-10">
						<Metric label={title} value={String(value)} className="flex-1" />
						{Icon && (
							<div className="p-2 border border-border/50 bg-background/50 rounded-xs text-muted-foreground opacity-50">
								<Icon className="h-5 w-5" aria-hidden="true" />
							</div>
						)}
					</div>
					<div
						className={`pt-4 border-t-2 border-border/50 ${isDense ? "mt-2" : "mt-4"} relative z-10`}
					>
						<div className="h-3 bg-muted rounded-none w-2/3 animate-pulse" />
					</div>
				</CardBody>
			</Card>
		);
	}

	return (
		<Card
			className={`h-full group transition-all duration-300 relative overflow-hidden border-2 shadow-sm ${
				dominant
					? "border-primary/50 bg-primary/5 hover:bg-primary/10"
					: "border-border/70 hover:border-primary/40 bg-card hover:-translate-y-[2px] hover:shadow-[0_4px_12px_-4px_rgba(0,0,0,0.1)]"
			}`}
		>
			<div className="absolute inset-0 bg-noise opacity-[0.25] pointer-events-none mix-blend-overlay" />
			{dominant && (
				<div className="absolute left-0 top-0 bottom-0 w-1 bg-primary group-hover:bg-primary-hover transition-colors" />
			)}
			{!dominant && (
				<div className="absolute left-0 top-0 bottom-0 w-1 bg-border/40 group-hover:bg-primary/30 transition-colors" />
			)}

			<CardBody
				className={`${isDense ? "p-4 gap-3" : "p-6 gap-6"} flex flex-col h-full justify-between relative z-10`}
			>
				<div className="flex items-start justify-between">
					<div className={`flex-1 flex flex-col`}>
						<Metric
							label={title}
							value={animatedValue}
							trend={trend?.value}
							trendDirection={trend?.direction}
						/>
					</div>
					{Icon && (
						<div
							className={`p-2 border border-border/50 rounded-none transition-colors duration-300 shadow-sm ${
								dominant
									? "bg-primary/20 text-primary border-primary/30"
									: "bg-muted/30 text-muted-foreground group-hover:text-primary group-hover:border-primary/30"
							}`}
						>
							<Icon className={`${isDense ? "h-4 w-4" : "h-5 w-5"}`} aria-hidden="true" />
						</div>
					)}
				</div>

				{subtitle && (
					<div className={`pt-3 border-t-2 mt-2 border-border/50`}>
						<p className={`text-[10px] font-mono truncate text-muted-foreground tracking-wide`}>
							{subtitle}
							{trend?.label && <span className="opacity-70 ml-1">({trend.label})</span>}
						</p>
					</div>
				)}
			</CardBody>
		</Card>
	);
}
