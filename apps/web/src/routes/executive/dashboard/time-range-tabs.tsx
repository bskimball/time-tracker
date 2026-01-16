"use client";

import { useSearchParams, useNavigate } from "react-router";
import { Button } from "@monorepo/design-system";

type TimeRange = "today" | "week" | "month";

interface TimeRangeTabsProps {
	ranges?: TimeRange[];
}

export function TimeRangeTabs({ ranges = ["today", "week", "month"] }: TimeRangeTabsProps) {
	const searchParams = useSearchParams()[0];
	const navigate = useNavigate();

	const currentRange = (searchParams.get("range") as TimeRange) || "today";

	const handleRangeChange = (range: TimeRange) => {
		const newSearchParams = new URLSearchParams(searchParams);
		newSearchParams.set("range", range);
		navigate(`?${newSearchParams.toString()}`, { replace: false });
	};

	return (
		<div className="bg-background/50 backdrop-blur-sm p-1 rounded-sm border border-border shadow-sm inline-flex">
			{ranges.map((range) => (
				<Button
					key={range}
					variant={currentRange === range ? "primary" : "ghost"}
					size="sm"
					onClick={() => handleRangeChange(range)}
				>
					{range.charAt(0).toUpperCase() + range.slice(1)}
				</Button>
			))}
		</div>
	);
}
