"use client";

import { useSearchParams, useNavigate } from "react-router";
import { Tabs, TabList, Tab } from "@monorepo/design-system";

type Section = "productivity" | "labor-cost" | "trends" | "capacity" | "benchmarks";

interface SectionTabsProps {
	sections?: Array<{ id: Section; label: string }>;
}

export function SectionTabs({
	sections = [
		{ id: "productivity", label: "Productivity" },
		{ id: "labor-cost", label: "Labor Costs" },
		{ id: "trends", label: "Trends" },
		{ id: "capacity", label: "Capacity" },
		{ id: "benchmarks", label: "Benchmarks" },
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
		<div className="mb-8">
			<Tabs selectedKey={currentSection} onSelectionChange={handleSectionChange}>
				<TabList className="inline-flex flex-wrap gap-2 border border-border p-1 rounded-[2px]">
					{sections.map(({ id, label }) => (
						<Tab
							id={id}
							key={id}
							className="h-9 px-4"
						>
							{label}
						</Tab>
					))}
				</TabList>
			</Tabs>
		</div>
	);
}
