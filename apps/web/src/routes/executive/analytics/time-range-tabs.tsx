"use client";

import { useSearchParams, useNavigate } from "react-router";
import { Button } from "@monorepo/design-system";

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

	const handleRangeChange = (range: TimeRange) => {
		const newSearchParams = new URLSearchParams(searchParams);
		newSearchParams.set("range", range);
		// Keep the current section if it exists
		navigate(`?${newSearchParams.toString()}`, { replace: false });
	};

	return (
		<div className="flex gap-2">
			{ranges.map((range) => (
				<Button
					key={range}
					variant={currentRange === range ? "primary" : "outline"}
					size="sm"
					onClick={() => handleRangeChange(range)}
				>
					{range.charAt(0).toUpperCase() + range.slice(1)}
				</Button>
			))}
		</div>
	);
}
