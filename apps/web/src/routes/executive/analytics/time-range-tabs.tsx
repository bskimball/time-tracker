"use client";

import { useSearchParams, useNavigate } from "react-router";
import { Tabs, TabList, Tab } from "@monorepo/design-system";

type TimeRange = "today" | "week" | "month" | "quarter";

interface AnalyticsTimeRangeTabsProps {
	ranges?: TimeRange[];
}

export function AnalyticsTimeRangeTabs({
	ranges = ["today", "week", "month", "quarter"],
}: AnalyticsTimeRangeTabsProps) {
	const searchParams = useSearchParams()[0];
	const navigate = useNavigate();

	const currentRange = (searchParams.get("range") as TimeRange) || "week";

	const handleRangeChange = (range: string | number) => {
		const newSearchParams = new URLSearchParams(searchParams);
		newSearchParams.set("range", range.toString());
		// Keep the current section if it exists
		navigate(`?${newSearchParams.toString()}`, { replace: false });
	};

	return (
		<Tabs selectedKey={currentRange} onSelectionChange={handleRangeChange}>
			<TabList className="inline-flex gap-1 justify-start bg-muted/20 p-0.5 border border-border rounded-[4px] shadow-inner w-auto">
				{ranges.map((range) => (
					<Tab id={range} key={range} className="h-7 px-3 text-[10px]">
						{range.toUpperCase()}
					</Tab>
				))}
			</TabList>
		</Tabs>
	);
}
