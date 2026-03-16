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
					"grid w-full grid-cols-2 lg:grid-cols-5 gap-1 rounded-[2px] bg-background/40 p-1 shadow-[inset_0_2px_12px_rgba(0,0,0,0.2)] ring-1 ring-inset ring-border/50",
					className
				)}
			>
				{sections.map(({ id, label }) => (
					<Tab
						id={id}
						key={id}
						className={({ isSelected }) =>
							cn(
								"group relative flex h-10 items-center justify-center overflow-hidden rounded-[1px] px-4 text-[11px] font-bold font-industrial uppercase tracking-[0.16em] transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-1",
								isSelected
									? "bg-card/80 text-foreground shadow-[0_1px_4px_rgba(0,0,0,0.15)] ring-1 ring-border"
									: "bg-transparent text-muted-foreground/70 hover:bg-card/40 hover:text-foreground"
							)
						}
					>
						{({ isSelected }) => (
							<>
								<span className="relative z-10">{label}</span>
								{isSelected && (
									<span className="absolute bottom-0 left-0 h-0.5 w-full bg-primary shadow-[0_-2px_8px_var(--color-primary)]" />
								)}
								{!isSelected && (
									<span className="absolute bottom-0 left-0 h-0.5 w-full bg-border/40 transition-colors duration-300 group-hover:bg-border/80" />
								)}
							</>
						)}
					</Tab>
				))}
			</TabList>
		</Tabs>
	);
}
