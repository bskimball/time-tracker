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
			<div className="flex items-center gap-1 min-w-max border-b border-border/60">
				{sections.map(({ id, label }) => {
					const isActive = currentSection === id;
					return (
						<button
							key={id}
							onClick={() => handleSectionChange(id)}
							className={cn(
								"relative flex items-center px-4 h-9 text-xs font-industrial uppercase tracking-widest transition-colors duration-150 border-b-2",
								isActive
									? "text-foreground border-primary"
									: "text-muted-foreground border-transparent hover:text-foreground"
							)}
							aria-current={isActive ? "page" : undefined}
						>
							<span className="font-bold">{label}</span>
						</button>
					);
				})}
			</div>
		</nav>
	);
}
