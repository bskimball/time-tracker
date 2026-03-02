"use client";

import { startTransition, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { Tabs, TabList, Tab } from "@monorepo/design-system";
import { cn } from "~/lib/cn";
import type { AnalyticsComparison } from "./model";

const comparisonOptions: Array<{ id: AnalyticsComparison; label: string }> = [
	{ id: "previous-period", label: "Prev Period" },
	{ id: "last-year", label: "Last Year" },
	{ id: "rolling-30d", label: "Rolling 30d" },
];

interface ComparisonTabsProps {
	className?: string;
	availableOptions?: AnalyticsComparison[];
}

export function getNormalizedComparison(
	availableOptions: AnalyticsComparison[],
	requested: string | null
): AnalyticsComparison {
	if (requested && availableOptions.some((option) => option === requested)) {
		return requested as AnalyticsComparison;
	}

	return availableOptions[0] ?? "previous-period";
}

export function ComparisonTabs({ className, availableOptions }: ComparisonTabsProps) {
	const searchParams = useSearchParams()[0];
	const navigate = useNavigate();

	const visibleOptions = availableOptions
		? comparisonOptions.filter((opt) => availableOptions.includes(opt.id))
		: comparisonOptions;

	const currentCompareParam = searchParams.get("compare") as AnalyticsComparison | null;
	const currentCompare = getNormalizedComparison(
		visibleOptions.map((option) => option.id),
		currentCompareParam
	);

	useEffect(() => {
		if (!visibleOptions.length) {
			return;
		}

		if (currentCompareParam === currentCompare) {
			return;
		}

		const nextSearchParams = new URLSearchParams(searchParams);
		nextSearchParams.set("compare", currentCompare);
		startTransition(() => {
			navigate(`?${nextSearchParams.toString()}`, { replace: true });
		});
	}, [currentCompare, currentCompareParam, navigate, searchParams, visibleOptions.length]);

	const handleComparisonChange = (key: string | number) => {
		if (!visibleOptions.some((option) => option.id === key)) {
			return;
		}

		const newSearchParams = new URLSearchParams(searchParams);
		newSearchParams.set("compare", key.toString());
		startTransition(() => {
			navigate(`?${newSearchParams.toString()}`, { replace: false });
		});
	};

	return (
		<Tabs
			selectedKey={currentCompare}
			onSelectionChange={handleComparisonChange}
			aria-label="Comparison basis"
		>
			<TabList
				aria-label="Select comparison window"
				className={cn(
					"inline-flex w-auto justify-start gap-1 rounded-[2px] p-0.5 bg-card border border-border/40",
					className
				)}
			>
				{visibleOptions.map((option) => (
					<Tab
						key={option.id}
						id={option.id}
						className={({ isSelected }) =>
							cn(
								"h-10 min-w-[92px] px-3 text-xs uppercase tracking-widest font-bold transition-all rounded-[2px] flex items-center justify-center outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
								isSelected
									? "bg-primary text-primary-foreground shadow-sm"
									: "text-muted-foreground hover:text-foreground hover:bg-muted/50"
							)
						}
					>
						{option.label}
					</Tab>
				))}
			</TabList>
		</Tabs>
	);
}
