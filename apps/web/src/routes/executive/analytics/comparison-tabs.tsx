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
					"grid w-full grid-cols-1 sm:grid-cols-3 gap-px bg-border/60 p-px border-2 border-border/80",
					className
				)}
			>
				{visibleOptions.map((option) => (
					<Tab
						key={option.id}
						id={option.id}
						className={({ isSelected }) =>
							cn(
								"group relative flex h-10 items-center justify-center overflow-hidden px-3 text-[10px] font-mono font-bold uppercase tracking-[0.18em] transition-all outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset",
								isSelected
									? "bg-card text-foreground"
									: "bg-muted/30 text-muted-foreground/70 hover:bg-muted/60 hover:text-foreground"
							)
						}
					>
						{({ isSelected }) => (
							<>
								<span className="relative z-10">{option.label}</span>
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
