"use client";

import { useNavigate, useSearchParams } from "react-router";
import { Tab, TabList, Tabs } from "@monorepo/design-system";
import { cn } from "~/lib/cn";

export type TimeRange = "today" | "week" | "month" | "quarter";

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
		const nextSearchParams = new URLSearchParams(searchParams);
		nextSearchParams.set("range", range.toString());
		navigate(`?${nextSearchParams.toString()}`, { replace: false });
	};

	return (
		<Tabs selectedKey={currentRange} onSelectionChange={handleRangeChange}>
			<TabList
				className={cn(
					"inline-flex w-auto justify-start gap-1 rounded-[2px] p-0.5 bg-card border border-border/40",
					className,
				)}
			>
				{ranges.map((range) => (
					<Tab
						id={range}
						key={range}
						className={({ isSelected }) =>
							cn(
								"h-7 px-3 text-xs uppercase tracking-widest font-bold transition-all rounded-[2px] flex items-center justify-center outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
								isSelected
									? "bg-primary text-primary-foreground shadow-sm"
									: "text-muted-foreground hover:text-foreground hover:bg-muted/50"
							)
						}
					>
						{range}
					</Tab>
				))}
			</TabList>
		</Tabs>
	);
}
