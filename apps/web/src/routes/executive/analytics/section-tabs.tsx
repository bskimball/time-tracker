"use client";

import { useSearchParams, useNavigate } from "react-router";
import { Button } from "@monorepo/design-system";

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

	const handleSectionChange = (section: Section) => {
		const newSearchParams = new URLSearchParams(searchParams);
		newSearchParams.set("section", section);
		// Keep the current range if it exists
		navigate(`?${newSearchParams.toString()}`, { replace: false });
	};

	return (
		<div className="flex flex-wrap gap-2">
			{sections.map(({ id, label }) => (
				<Button
					key={id}
					variant={currentSection === id ? "primary" : "ghost"}
					size="sm"
					onClick={() => handleSectionChange(id)}
				>
					{label}
				</Button>
			))}
		</div>
	);
}
