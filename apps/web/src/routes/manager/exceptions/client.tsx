"use client";

import { useMemo, useState } from "react";
import { Link } from "react-router";
import { AlertTriangle, ArrowUpDown, Clock3, Filter } from "lucide-react";
import {
	Badge,
	Button,
	Card,
	CardBody,
	CardHeader,
	CardTitle,
	SimpleSelect,
} from "@monorepo/design-system";
import { PageHeader } from "~/components/page-header";
import type { ExceptionQueueData, ExceptionSeverity, ExceptionType, ManagerExceptionItem } from "./actions";

const exceptionTypeOptions: Array<{ value: ExceptionType; label: string }> = [
	{ value: "MISSING_PUNCH", label: "Missing Punch" },
	{ value: "OVERTIME_RISK", label: "Overtime Risk" },
	{ value: "STAFFING_GAP", label: "Staffing Gap" },
];

const severityOptions: Array<{ value: ExceptionSeverity; label: string }> = [
	{ value: "CRITICAL", label: "Critical" },
	{ value: "HIGH", label: "High" },
	{ value: "MEDIUM", label: "Medium" },
];

function severityRank(severity: ExceptionSeverity) {
	if (severity === "CRITICAL") return 0;
	if (severity === "HIGH") return 1;
	return 2;
}

function getSeverityBadgeVariant(severity: ExceptionSeverity):
	| "destructive"
	| "primary"
	| "secondary" {
	if (severity === "CRITICAL") return "destructive";
	if (severity === "HIGH") return "primary";
	return "secondary";
}

function getTypeBadgeVariant(type: ExceptionType): "destructive" | "primary" | "outline" {
	if (type === "MISSING_PUNCH") return "destructive";
	if (type === "OVERTIME_RISK") return "primary";
	return "outline";
}

function formatDateTime(value: string) {
	return new Date(value).toLocaleString([], {
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});
}

function getDueLabel(dueAt: string, now: Date) {
	const deltaMinutes = Math.round((new Date(dueAt).getTime() - now.getTime()) / (1000 * 60));

	if (deltaMinutes < 0) {
		return {
			label: `Overdue ${Math.abs(deltaMinutes)}m`,
			variant: "destructive" as const,
		};
	}

	if (deltaMinutes <= 30) {
		return {
			label: `Due in ${deltaMinutes}m`,
			variant: "primary" as const,
		};
	}

	return {
		label: `Due in ${deltaMinutes}m`,
		variant: "outline" as const,
	};
}

function TypeCountCard({
	label,
	count,
}: {
	label: string;
	count: number;
}) {
	return (
		<div className="rounded-[2px] border border-border/50 bg-muted/20 p-3">
			<p className="text-[10px] font-industrial uppercase tracking-widest text-muted-foreground">
				{label}
			</p>
			<p className="mt-2 font-mono text-xl tabular-nums">{count}</p>
		</div>
	);
}

export function ExceptionQueueView({ initialData }: { initialData: ExceptionQueueData }) {
	const [typeFilter, setTypeFilter] = useState<"ALL" | ExceptionType>("ALL");
	const [severityFilter, setSeverityFilter] = useState<"ALL" | ExceptionSeverity>("ALL");
	const [stationFilter, setStationFilter] = useState<string>("ALL");
	const [ownerFilter, setOwnerFilter] = useState<"ALL" | "ASSIGNED" | "UNASSIGNED">("ALL");
	const [sortBy, setSortBy] = useState<"SEVERITY" | "AGE">("SEVERITY");

	const summaryCounts = useMemo(() => {
		const byType: Record<ExceptionType, number> = {
			MISSING_PUNCH: 0,
			OVERTIME_RISK: 0,
			STAFFING_GAP: 0,
		};

		for (const item of initialData.items) {
			byType[item.type] += 1;
		}

		return {
			total: initialData.items.length,
			criticalHigh: initialData.items.filter(
				(item) => item.severity === "CRITICAL" || item.severity === "HIGH"
			).length,
			byType,
		};
	}, [initialData.items]);

	const filteredItems = useMemo(() => {
		const now = new Date();

		const nextItems = initialData.items.filter((item) => {
			if (typeFilter !== "ALL" && item.type !== typeFilter) {
				return false;
			}

			if (severityFilter !== "ALL" && item.severity !== severityFilter) {
				return false;
			}

			if (stationFilter !== "ALL" && item.stationId !== stationFilter) {
				return false;
			}

			if (ownerFilter === "ASSIGNED" && !item.ownerName) {
				return false;
			}

			if (ownerFilter === "UNASSIGNED" && item.ownerName) {
				return false;
			}

			return true;
		});

		nextItems.sort((a, b) => {
			if (sortBy === "SEVERITY") {
				const severityDiff = severityRank(a.severity) - severityRank(b.severity);
				if (severityDiff !== 0) {
					return severityDiff;
				}
			}

			const ageA = now.getTime() - new Date(a.detectedAt).getTime();
			const ageB = now.getTime() - new Date(b.detectedAt).getTime();
			return ageB - ageA;
		});

		return nextItems;
	}, [initialData.items, ownerFilter, severityFilter, sortBy, stationFilter, typeFilter]);

	return (
		<div className="space-y-6 pb-12">
			<PageHeader
				title="Exceptions"
				subtitle="Action queue for missing punches, overtime exposure, and staffing gaps"
				actions={
					<div className="flex items-center gap-2 rounded-[2px] border border-border/50 bg-muted/20 px-3 py-2 text-xs font-mono uppercase tracking-widest text-muted-foreground">
						<Clock3 className="h-3.5 w-3.5" strokeWidth={1.75} />
						Refreshed {formatDateTime(initialData.generatedAt)}
					</div>
				}
			/>

			<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
				<Card className="xl:col-span-2">
					<CardBody className="grid grid-cols-2 gap-4">
						<div>
							<p className="text-[10px] font-industrial uppercase tracking-widest text-muted-foreground">
								Open Exceptions
							</p>
							<p className="mt-2 font-mono text-3xl tabular-nums">{summaryCounts.total}</p>
						</div>
						<div>
							<p className="text-[10px] font-industrial uppercase tracking-widest text-muted-foreground">
								Critical + High
							</p>
							<p className="mt-2 font-mono text-3xl tabular-nums text-primary">
								{summaryCounts.criticalHigh}
							</p>
						</div>
					</CardBody>
				</Card>

				<TypeCountCard label="Missing Punch" count={summaryCounts.byType.MISSING_PUNCH} />
				<TypeCountCard label="Overtime Risk" count={summaryCounts.byType.OVERTIME_RISK} />
				<TypeCountCard label="Staffing Gap" count={summaryCounts.byType.STAFFING_GAP} />
			</div>

			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Filter className="h-4 w-4" strokeWidth={1.8} />
						Queue Filters
					</CardTitle>
				</CardHeader>
				<CardBody className="space-y-4">
					<div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
						<SimpleSelect
							label="Type"
							value={typeFilter}
							onChange={(value) =>
								setTypeFilter((value as "ALL" | ExceptionType | null) ?? "ALL")
							}
							options={[
								{ value: "ALL", label: "All Types" },
								...exceptionTypeOptions,
							]}
						/>
						<SimpleSelect
							label="Severity"
							value={severityFilter}
							onChange={(value) =>
								setSeverityFilter((value as "ALL" | ExceptionSeverity | null) ?? "ALL")
							}
							options={[
								{ value: "ALL", label: "All Severities" },
								...severityOptions,
							]}
						/>
						<SimpleSelect
							label="Station"
							value={stationFilter}
							onChange={(value) => setStationFilter(value ?? "ALL")}
							options={[
								{ value: "ALL", label: "All Stations" },
								...initialData.stations.map((station) => ({
									value: station.id,
									label: station.name,
								})),
							]}
						/>
						<SimpleSelect
							label="Ownership"
							value={ownerFilter}
							onChange={(value) =>
								setOwnerFilter((value as "ALL" | "ASSIGNED" | "UNASSIGNED" | null) ?? "ALL")
							}
							options={[
								{ value: "ALL", label: "All" },
								{ value: "ASSIGNED", label: "Assigned" },
								{ value: "UNASSIGNED", label: "Unassigned" },
							]}
						/>
						<SimpleSelect
							label="Sort"
							value={sortBy}
							onChange={(value) => setSortBy((value as "SEVERITY" | "AGE" | null) ?? "SEVERITY")}
							options={[
								{ value: "SEVERITY", label: "Severity" },
								{ value: "AGE", label: "Age" },
							]}
						/>
						<div className="flex items-end">
							<Button
								variant="outline"
								onClick={() => {
									setTypeFilter("ALL");
									setSeverityFilter("ALL");
									setStationFilter("ALL");
									setOwnerFilter("ALL");
									setSortBy("SEVERITY");
								}}
								className="h-10 w-full gap-2"
							>
								<ArrowUpDown className="h-3.5 w-3.5" strokeWidth={1.8} />
								Reset
							</Button>
						</div>
					</div>

					<div className="overflow-x-auto rounded-[2px] border border-border/60">
						<table className="w-full text-sm">
							<thead>
								<tr className="border-b border-border bg-muted/20 text-[10px] font-industrial uppercase tracking-[0.14em] text-muted-foreground">
									<th className="p-3 text-left">Type</th>
									<th className="p-3 text-left">Severity</th>
									<th className="p-3 text-left">Employee / Station</th>
									<th className="p-3 text-left">Detected</th>
									<th className="p-3 text-left">Recommended Action</th>
									<th className="p-3 text-left">Owner</th>
									<th className="p-3 text-left">SLA</th>
									<th className="p-3 text-left">Quick Actions</th>
								</tr>
							</thead>
							<tbody>
								{filteredItems.map((item) => (
									<ExceptionRow key={item.id} item={item} />
								))}
								{filteredItems.length === 0 && (
									<tr>
										<td colSpan={8} className="p-8 text-center text-muted-foreground">
											No exceptions match the current filters.
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				</CardBody>
			</Card>
		</div>
	);
}

function ExceptionRow({ item }: { item: ManagerExceptionItem }) {
	const due = getDueLabel(item.dueAt, new Date());

	return (
		<tr className="border-b border-border hover:bg-muted/35">
			<td className="p-3 align-top">
				<div className="flex items-center gap-2">
					<AlertTriangle className="mt-0.5 h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.8} />
					<Badge variant={getTypeBadgeVariant(item.type)}>{item.type}</Badge>
				</div>
			</td>
			<td className="p-3 align-top">
				<Badge variant={getSeverityBadgeVariant(item.severity)}>{item.severity}</Badge>
			</td>
			<td className="p-3 align-top">
				<div className="space-y-1">
					<p className="font-medium">{item.employeeName ?? "Station-level exception"}</p>
					<p className="text-xs text-muted-foreground">{item.stationName ?? "No station context"}</p>
					<p className="text-xs font-mono text-muted-foreground">{item.contextLabel}</p>
				</div>
			</td>
			<td className="p-3 align-top text-xs text-muted-foreground">{formatDateTime(item.detectedAt)}</td>
			<td className="p-3 align-top">
				<p className="max-w-[24ch] text-sm leading-relaxed">{item.recommendedAction}</p>
			</td>
			<td className="p-3 align-top">
				<Badge variant={item.ownerName ? "secondary" : "outline"}>
					{item.ownerName ?? "Unassigned"}
				</Badge>
			</td>
			<td className="p-3 align-top">
				<Badge variant={due.variant}>{due.label}</Badge>
			</td>
			<td className="p-3 align-top">
				<div className="flex flex-wrap items-center gap-2">
					{item.quickLinks.map((link) => (
						<Link
							key={`${item.id}-${link.href}`}
							to={link.href}
							className="rounded-[2px] border border-border/60 bg-muted/20 px-2 py-1 text-[11px] font-medium uppercase tracking-wide text-foreground hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
						>
							{link.label}
						</Link>
					))}
				</div>
			</td>
		</tr>
	);
}
