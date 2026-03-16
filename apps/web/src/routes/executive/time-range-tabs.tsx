"use client";

import { startTransition } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Tab, TabList, Tabs } from "@monorepo/design-system";
import { cn } from "~/lib/cn";
import {
	COMPARISON_COMPATIBILITY,
	DEFAULT_COMPARE,
	type AnalyticsComparison,
} from "./analytics/model";

export type TimeRange = "today" | "week" | "month" | "quarter";

export function normalizeComparisonForRange(
	range: TimeRange,
	compare: string | null
): AnalyticsComparison {
	const allowed = COMPARISON_COMPATIBILITY[range];
	if (compare && allowed.includes(compare as AnalyticsComparison)) {
		return compare as AnalyticsComparison;
	}

	if (allowed.includes(DEFAULT_COMPARE)) {
		return DEFAULT_COMPARE;
	}

	return allowed[0];
}

interface TimeRangeTabsProps {
	ranges?: readonly TimeRange[];
	defaultRange?: TimeRange;
	className?: string;
}

export function TimeRangeTabs({
	ranges = ["today", "week", "month", "quarter"],
	defaultRange = "week",
	className,
}: TimeRangeTabsProps) {
	const searchParams = useSearchParams()[0];
	const navigate = useNavigate();

	const currentRange = (searchParams.get("range") as TimeRange) || defaultRange;

	const handleRangeChange = (range: string | number) => {
		const nextRange = range.toString() as TimeRange;
		const nextSearchParams = new URLSearchParams(searchParams);
		nextSearchParams.set("range", nextRange);

		const compareParam = searchParams.get("compare");
		nextSearchParams.set("compare", normalizeComparisonForRange(nextRange, compareParam));

		startTransition(() => {
			navigate(`?${nextSearchParams.toString()}`, { replace: false });
		});
	};

	return (
		<Tabs selectedKey={currentRange} onSelectionChange={handleRangeChange} aria-label="Time range">
			<TabList
				aria-label="Select analytics period"
				className={cn(
					"grid w-full grid-cols-2 lg:grid-cols-4 gap-1 rounded-[2px] bg-background/40 p-1 shadow-[inset_0_2px_12px_rgba(0,0,0,0.2)] ring-1 ring-inset ring-border/50",
					className
				)}
			>
				{ranges.map((range) => (
					<Tab
						id={range}
						key={range}
						className={({ isSelected }) =>
							cn(
								"group relative flex h-10 items-center justify-center overflow-hidden rounded-[1px] px-3 text-[11px] font-bold uppercase tracking-[0.18em] transition-all outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-1",
								isSelected
									? "bg-card/80 text-foreground shadow-[0_1px_4px_rgba(0,0,0,0.15)] ring-1 ring-border"
									: "bg-transparent text-muted-foreground/70 hover:bg-card/40 hover:text-foreground"
							)
						}
					>
						{({ isSelected }) => (
							<>
								<span className="relative z-10">{range}</span>
								{isSelected && (
									<span className="absolute bottom-0 left-0 h-0.5 w-full bg-primary shadow-[0_-2px_8px_var(--color-primary)]" />
								)}
								{!isSelected && (
									<span className="absolute bottom-0 left-0 h-0.5 w-full bg-border/40 transition-colors duration-300 group-hover:bg-border/80" />
								)}
							</>
						)}
					</Tab>
				))}
			</TabList>
		</Tabs>
	);
}
