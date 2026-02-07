"use client";

import { useSearchParams, useNavigate } from "react-router";
import { Tabs, TabList, Tab } from "@monorepo/design-system";

type Section = "productivity" | "labor-cost" | "trends" | "capacity" | "benchmarks";

interface SectionTabsProps {
	sections?: Array<{ id: Section; label: string }>;
}

export function SectionTabs({
	sections = [
		{ id: "productivity", label: "PRODUCTIVITY" },
		{ id: "labor-cost", label: "LABOR COSTS" },
		{ id: "trends", label: "TRENDS" },
		{ id: "capacity", label: "CAPACITY" },
		{ id: "benchmarks", label: "BENCHMARKS" },
	],
}: SectionTabsProps) {
	const searchParams = useSearchParams()[0];
	const navigate = useNavigate();

	const currentSection = (searchParams.get("section") as Section) || "productivity";

	const handleSectionChange = (section: string | number) => {
		const newSearchParams = new URLSearchParams(searchParams);
		newSearchParams.set("section", section.toString());
		// Keep the current range if it exists
		navigate(`?${newSearchParams.toString()}`, { replace: false });
	};

	return (
		<div className="mb-0">
			<Tabs selectedKey={currentSection} onSelectionChange={handleSectionChange}>
				<TabList className="inline-flex w-full sm:w-auto flex-wrap gap-1 rounded-[2px] border border-border bg-muted/20 p-1">
					{sections.map(({ id, label }) => (
						<Tab
							id={id}
							key={id}
							className="h-9 px-4 text-xs font-bold tracking-wide"
						>
							{label}
						</Tab>
					))}
				</TabList>
			</Tabs>
		</div>
	);
}
