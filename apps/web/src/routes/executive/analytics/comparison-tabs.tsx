"use client";

import { useSearchParams, useNavigate } from "react-router";
import { Tabs, TabList, Tab } from "@monorepo/design-system";

type ComparisonBasis = "previous-period" | "last-year" | "rolling-30d";

const comparisonOptions: Array<{ id: ComparisonBasis; label: string }> = [
	{ id: "previous-period", label: "PREVIOUS PERIOD" },
	{ id: "last-year", label: "SAME PERIOD LAST YEAR" },
	{ id: "rolling-30d", label: "ROLLING 30 DAYS" },
];

export function ComparisonTabs() {
	const searchParams = useSearchParams()[0];
	const navigate = useNavigate();
	const currentCompare =
		(searchParams.get("compare") as ComparisonBasis | null) ?? "previous-period";

	const handleComparisonChange = (key: string | number) => {
		const newSearchParams = new URLSearchParams(searchParams);
		newSearchParams.set("compare", key.toString());
		navigate(`?${newSearchParams.toString()}`, { replace: false });
	};

	return (
		<Tabs selectedKey={currentCompare} onSelectionChange={handleComparisonChange}>
			<TabList className="inline-flex w-auto justify-start gap-1 rounded-[2px] border border-border bg-card p-0.5 shadow-sm">
				{comparisonOptions.map((option) => (
					<Tab key={option.id} id={option.id} className="h-7 px-3 text-[10px] font-medium">
						{option.label}
					</Tab>
				))}
			</TabList>
		</Tabs>
	);
}
