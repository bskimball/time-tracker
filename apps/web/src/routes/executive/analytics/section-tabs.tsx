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
					"grid w-full grid-cols-2 lg:grid-cols-5 gap-px bg-border/60 p-px border-2 border-border/80",
					className
				)}
			>
				{sections.map(({ id, label }) => (
					<Tab
						id={id}
						key={id}
						className={({ isSelected }) =>
							cn(
								"group relative flex h-10 items-center justify-center overflow-hidden px-4 text-[11px] font-mono font-bold uppercase tracking-[0.18em] transition-all outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset",
								isSelected
									? "bg-card text-foreground"
									: "bg-muted/30 text-muted-foreground/70 hover:bg-muted/60 hover:text-foreground"
							)
						}
					>
						{({ isSelected }) => (
							<>
								<span className="relative z-10">{label}</span>
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
