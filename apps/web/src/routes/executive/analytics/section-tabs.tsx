"use client";

import { startTransition } from "react";
import { useSearchParams, useNavigate } from "react-router";
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

	const handleSectionChange = (section: string) => {
		const newSearchParams = new URLSearchParams(searchParams);
		newSearchParams.set("section", section);
		startTransition(() => {
			navigate(`?${newSearchParams.toString()}`, { replace: false });
		});
	};

	return (
		<nav className={cn("w-full overflow-x-auto pb-1", className)} aria-label="Analytics Sections">
			<div
				className="flex min-w-max items-center gap-1 border-b border-border/60"
				role="tablist"
				aria-label="Analytics sections"
			>
				{sections.map(({ id, label }) => {
					const isActive = currentSection === id;
					return (
						<button
							type="button"
							key={id}
							onClick={() => handleSectionChange(id)}
							role="tab"
							aria-selected={isActive}
							aria-controls={`analytics-section-${id}`}
							className={cn(
								"relative flex h-10 min-w-[120px] items-center justify-center px-4 text-xs font-bold font-industrial uppercase tracking-widest transition-colors duration-150 border-b-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
								isActive
									? "text-foreground border-primary"
									: "text-muted-foreground border-transparent hover:text-foreground"
							)}
						>
							<span>{label}</span>
						</button>
					);
				})}
			</div>
		</nav>
	);
}
