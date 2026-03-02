"use client";

import { startTransition } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { Tab, TabList, Tabs } from "@monorepo/design-system";
import { cn } from "~/lib/cn";

type Section = "productivity" | "labor-cost" | "trends" | "capacity" | "benchmarks";

interface SectionTabsProps {
	sections?: Array<{ id: Section; label: string }>;
	className?: string;
}

export function SectionTabs({
	sections = [
		{ id: "productivity", label: "Productivity" },
		{ id: "labor-cost", label: "Labor Costs" },
		{ id: "trends", label: "Trends" },
		{ id: "capacity", label: "Capacity" },
		{ id: "benchmarks", label: "Benchmarks" },
	],
	className,
}: SectionTabsProps) {
	const searchParams = useSearchParams()[0];
	const navigate = useNavigate();

	const currentSection = (searchParams.get("section") as Section) || "productivity";

	const handleSectionChange = (section: string | number) => {
		const newSearchParams = new URLSearchParams(searchParams);
		newSearchParams.set("section", section.toString());
		startTransition(() => {
			navigate(`?${newSearchParams.toString()}`, { replace: false });
		});
	};

	return (
		<Tabs
			selectedKey={currentSection}
			onSelectionChange={handleSectionChange}
			aria-label="Analytics sections"
		>
			<TabList
				aria-label="Select analytics section"
				className={cn(
					"inline-flex min-w-max w-full justify-start gap-1 overflow-x-auto pb-1 border-b border-border/60",
					className
				)}
			>
				{sections.map(({ id, label }) => (
					<Tab
						id={id}
						key={id}
						className={({ isSelected }) =>
							cn(
								"relative flex h-10 min-w-[120px] items-center justify-center border-b-2 px-4 text-xs font-bold font-industrial uppercase tracking-widest transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
								isSelected
									? "text-foreground border-primary"
									: "text-muted-foreground border-transparent hover:text-foreground"
							)
						}
					>
						{label}
					</Tab>
				))}
			</TabList>
		</Tabs>
	);
}
