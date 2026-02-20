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
	const [count, setCount] = useState<string | number>(() =>
		typeof end === "number" ? 0 : "0"
	);
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

			// Format back to original style if possible, strictly for simple cases
			// For now, we return the raw number or formatted string based on simple heuristics
			// Ideally we'd use Intl.NumberFormat based on the input string pattern

			if (typeof end === "string") {
				// Naive reconstruction: if input was "$1,234", we try to match it
				// This is complex. Let's just update the number part if it looks like a simple number string
				// If it has symbols, let's just jump to end for safety or do a simple replace
				if (end.includes("$")) {
					setCount(`$${currentVal.toLocaleString(undefined, { maximumFractionDigits: 0 })}`);
				} else if (end.includes("%")) {
					setCount(`${currentVal.toFixed(1)}%`);
				} else {
					setCount(currentVal.toFixed(end.includes(".") ? 1 : 0));
				}
			} else {
				// For numeric inputs, limit decimals to 1 place during animation to avoid layout shifts
				// or weirdly long numbers
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
	/** When true, renders with a Signal Orange left-border strip as the visual anchor */
	dominant?: boolean;
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

	if (loading) {
		return (
			<Card className="h-full">
				<CardBody className="p-4 flex flex-col h-full justify-between gap-4">
					<div className="flex items-start justify-between">
						<Metric
							label={title}
							value={String(value)}
							className="flex-1"
						/>
						{Icon && (
							<div className="p-2 bg-muted/30 rounded-xs text-muted-foreground opacity-50">
								<Icon className="h-5 w-5" aria-hidden="true" />
							</div>
						)}
					</div>
					<div className="pt-4 border-t border-border/50 mt-2">
						<div className="h-3 bg-muted/40 rounded w-2/3 animate-pulse" />
					</div>
				</CardBody>
			</Card>
		);
	}

	return (
		<Card
			className={`h-full group hover:border-primary/50 transition-colors duration-300 ${dominant ? "border-l-2 border-l-primary bg-primary/[0.03]" : ""}`}
		>
			<CardBody className="p-4 flex flex-col h-full justify-between gap-4">
				<div className="flex items-start justify-between">
					<Metric
						label={title}
						value={animatedValue}
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
