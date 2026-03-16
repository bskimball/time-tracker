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
					"grid w-full grid-cols-2 lg:grid-cols-4 gap-px bg-border/60 p-px border-2 border-border/80",
					className
				)}
			>
				{ranges.map((range) => (
					<Tab
						id={range}
						key={range}
						className={({ isSelected }) =>
							cn(
								"group relative flex h-10 items-center justify-center overflow-hidden px-4 text-[11px] font-mono font-bold uppercase tracking-[0.18em] transition-all outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset",
								isSelected
									? "bg-card text-foreground"
									: "bg-muted/30 text-muted-foreground/70 hover:bg-muted/60 hover:text-foreground"
							)
						}
					>
						{({ isSelected }) => (
							<>
								<span className="relative z-10">{range}</span>
								{isSelected && (
									<span className="absolute bottom-0 left-0 h-0.5 w-full bg-primary" />
								)}
							</>
						)}
					</Tab>
				))}
			</TabList>
		</Tabs>
	);
}
