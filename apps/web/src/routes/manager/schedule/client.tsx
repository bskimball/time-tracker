"use client";

import { useMemo, useState } from "react";
import { format, parseISO, isToday } from "date-fns";
import {
	Card,
	CardBody,
	CardHeader,
	CardTitle,
	Button,
	Tabs,
	TabList,
	Tab,
	TabPanel,
	Select,
	Input,
	Badge,
} from "@monorepo/design-system";
import { PageHeader } from "~/components/page-header";
import type { ScheduleData } from "./actions";

type Station = {
	id: string;
	name: string;
};

type ActiveEmployee = {
	id: string;
	startTime: Date;
	endTime: Date | null;
	employeeId: string;
	Employee: {
		id: string;
		name: string;
		defaultStation?: { id: string; name: string } | null;
	};
	Station: { id: string; name: string } | null;
};

interface ScheduleViewProps {
	schedule: ScheduleData;
	stations: Station[];
	activeEmployees: ActiveEmployee[];
}

const shiftColors: Record<string, string> = {
	MORNING: "border-l-4 border-l-amber-500",
	SWING: "border-l-4 border-l-blue-500",
	NIGHT: "border-l-4 border-l-zinc-600",
};

export function ScheduleView({ schedule, stations, activeEmployees }: ScheduleViewProps) {
	const [selectedDate, setSelectedDate] = useState(() => schedule.days[0]?.date ?? "");
	const [selectedStation, setSelectedStation] = useState<string>("all");
	const [view, setView] = useState<"grid" | "list">("grid");
	const [search, setSearch] = useState("");

	const filteredEntries = useMemo(() => {
		const day = schedule.days.find((day) => day.date === selectedDate);
		if (!day) return [];

		return day.entries.filter((entry) => {
			const stationMatch = selectedStation === "all" || entry.stationId === selectedStation;
			const searchMatch = entry.employeeName.toLowerCase().includes(search.toLowerCase());
			return stationMatch && searchMatch;
		});
	}, [schedule.days, selectedDate, selectedStation, search]);

	const weekRangeLabel = `${format(parseISO(schedule.weekStart), "MMM d")} - ${format(parseISO(schedule.weekEnd), "MMM d")}`;

	const currentDayEntries = schedule.days.map((day) => ({
		date: day.date,
		isToday: isToday(parseISO(day.date)),
		count: day.entries.length,
	}));

	return (
		<div className="space-y-6">
			<PageHeader
				title="Weekly Schedule"
				subtitle={weekRangeLabel}
				actions={
					<div className="flex flex-wrap gap-2">
						<Button variant="outline">Share Schedule</Button>
						<Button variant="primary">Publish Changes</Button>
					</div>
				}
			/>

			<Card>
				<CardHeader>
					<CardTitle>Day Overview</CardTitle>
				</CardHeader>
				<CardBody>
					<div className="grid grid-cols-2 md:grid-cols-7 gap-3">
						{currentDayEntries.map((day) => (
							<button
								type="button"
								key={day.date}
								onClick={() => setSelectedDate(day.date)}
								className={`rounded-[2px] border p-3 text-left transition-all ${
									selectedDate === day.date
										? "border-primary bg-primary/10"
										: day.isToday
											? "border-border/50 bg-muted/30"
											: "border-border/30 bg-muted/10"
								}`}
							>
								<div className="text-sm text-muted-foreground">
									{format(parseISO(day.date), "EEE")}
								</div>
								<div className="text-xl font-semibold">{format(parseISO(day.date), "d")}</div>
								<p className="text-xs text-muted-foreground mt-1">{day.count} shifts</p>
							</button>
						))}
					</div>
				</CardBody>
			</Card>

			<Card>
				<CardBody className="space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-4 gap-3">
						<Select
							name="stationFilter"
							label="Station"
							options={[
								{ value: "all", label: "All Stations" },
								...stations.map((s) => ({ value: s.id, label: s.name })),
							]}
							value={selectedStation}
							onChange={(value: string) => setSelectedStation(value || "all")}
						/>
						<Input
							name="employeeSearch"
							label="Search"
							placeholder="Search employees…"
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							autoComplete="off"
						/>
						<div className="flex flex-col gap-1">
							<label className="text-sm font-medium">View</label>
							<div className="flex gap-2">
								<Button
									variant={view === "grid" ? "primary" : "outline"}
									size="sm"
									onClick={() => setView("grid")}
								>
									Grid
								</Button>
								<Button
									variant={view === "list" ? "primary" : "outline"}
									size="sm"
									onClick={() => setView("list")}
								>
									List
								</Button>
							</div>
						</div>
					</div>

					<Tabs selectedKey={view} onSelectionChange={(key) => setView(key as "grid" | "list")}>
						<TabList>
							<Tab id="grid">Grid View</Tab>
							<Tab id="list">List View</Tab>
						</TabList>

						<TabPanel id="grid">
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
								{filteredEntries.map((entry) => (
									<div
										key={entry.id}
										className={`rounded-[2px] border bg-card p-4 shadow-sm ${shiftColors[entry.shiftType]}`}
									>
										<div className="flex justify-between items-start">
											<div>
												<h3 className="font-bold font-heading text-sm uppercase tracking-tight">{entry.employeeName}</h3>
												<p className="text-xs text-muted-foreground font-mono">{entry.role}</p>
											</div>
											<Badge
												variant={
													entry.status === "CONFIRMED"
														? "success"
														: entry.status === "PENDING"
															? "primary"
															: "secondary"
												}
											>
												{entry.status}
											</Badge>
										</div>
										<div className="mt-3 text-sm">
											<p className="font-medium">{entry.stationName}</p>
											<p className="text-muted-foreground">
												{format(parseISO(entry.startTime), "h:mm a")} -
												{format(parseISO(entry.endTime), "h:mm a")}
											</p>
											{entry.notes && (
												<p className="text-xs text-muted-foreground mt-2">{entry.notes}</p>
											)}
										</div>
										<div className="mt-3 flex gap-2">
											<Button variant="outline" size="sm">
												Swap
											</Button>
											<Button variant="primary" size="sm">
												Notify
											</Button>
										</div>
									</div>
								))}
								{filteredEntries.length === 0 && (
									<p className="text-center text-muted-foreground py-6">
										No shifts match your filters.
									</p>
								)}
							</div>
						</TabPanel>

						<TabPanel id="list">
							<div className="overflow-x-auto">
								<table className="w-full text-sm">
									<thead>
										<tr className="border-b border-border">
											<th className="p-3 text-left">Employee</th>
											<th className="p-3 text-left">Station</th>
											<th className="p-3 text-left">Shift</th>
											<th className="p-3 text-left">Role</th>
											<th className="p-3 text-left">Status</th>
											<th className="p-3 text-left">Actions</th>
										</tr>
									</thead>
									<tbody>
										{filteredEntries.map((entry) => (
											<tr key={entry.id} className="border-b border-border hover:bg-muted/40">
												<td className="p-3">
													<div className="font-medium">{entry.employeeName}</div>
													<p className="text-xs text-muted-foreground">{entry.role}</p>
												</td>
												<td className="p-3">{entry.stationName}</td>
												<td className="p-3">
													{format(parseISO(entry.startTime), "h:mm a")} -
													{format(parseISO(entry.endTime), "h:mm a")}
												</td>
												<td className="p-3">
													<Badge
														variant={
															entry.role === "LEAD"
																? "primary"
																: entry.role === "SUPPORT"
																	? "destructive"
																	: "secondary"
														}
													>
														{entry.role}
													</Badge>
												</td>
												<td className="p-3">
													<Badge
														variant={
															entry.status === "CONFIRMED"
																? "success"
																: entry.status === "PENDING"
																	? "primary"
																	: "secondary"
														}
													>
														{entry.status}
													</Badge>
												</td>
												<td className="p-3">
													<div className="flex gap-2">
														<Button variant="outline" size="sm">
															Reassign
														</Button>
														<Button variant="ghost" size="sm">
															Message
														</Button>
													</div>
												</td>
											</tr>
										))}
										{filteredEntries.length === 0 && (
											<tr>
												<td colSpan={6} className="p-4 text-center text-muted-foreground">
													No shifts match your filters.
												</td>
											</tr>
										)}
									</tbody>
								</table>
							</div>
						</TabPanel>
					</Tabs>
				</CardBody>
			</Card>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
				<Card className="lg:col-span-2">
					<CardHeader>
						<CardTitle>Coverage Heatmap</CardTitle>
					</CardHeader>
					<CardBody>
						<div className="overflow-x-auto">
							<table className="w-full text-sm">
								<thead>
									<tr className="border-b border-border">
										<th className="p-3 text-left">Station</th>
										{schedule.days.map((day) => (
											<th key={day.date} className="p-3 text-center text-xs text-muted-foreground">
												{format(parseISO(day.date), "EEE")}
											</th>
										))}
									</tr>
								</thead>
								<tbody>
									{stations.map((station) => (
										<tr key={station.id} className="border-b border-border">
											<td className="p-3 font-medium">{station.name}</td>
											{schedule.days.map((day) => {
												const count = day.entries.filter(
													(entry) => entry.stationId === station.id
												).length;
												const utilization = Math.min((count / 4) * 100, 100);
												return (
													<td key={`${station.id}-${day.date}`} className="p-3 text-center">
														<div className="h-8 rounded-[1px] bg-muted border border-border/30 overflow-hidden">
															<div
																className="h-full transition-all duration-500"
																style={{
																	width: `${utilization}%`,
																	backgroundColor: utilization > 80 ? "var(--color-primary)" : "var(--color-chart-3)",
																}}
															/>
														</div>
														<p className="text-[10px] text-muted-foreground mt-1 font-mono uppercase">{count} SHIFTS</p>
													</td>
												);
											})}
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</CardBody>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Active Today</CardTitle>
					</CardHeader>
					<CardBody className="space-y-3">
						{activeEmployees.length === 0 ? (
							<p className="text-sm text-muted-foreground">No active shifts right now.</p>
						) : (
							activeEmployees.slice(0, 5).map((log) => (
								<div key={log.id} className="rounded border p-3">
									<div className="flex justify-between">
										<div>
											<p className="font-medium">{log.Employee.name}</p>
											<p className="text-xs text-muted-foreground">
												{log.Station?.name || "Unassigned"}
											</p>
										</div>
										<p className="text-xs text-muted-foreground">
											Started {format(new Date(log.startTime), "h:mm a")}
										</p>
									</div>
									<div className="mt-3 flex gap-2">
										<Button variant="outline" size="sm">
											Adjust
										</Button>
										<Button variant="ghost" size="sm">
											Message
										</Button>
									</div>
								</div>
							))
						)}
					</CardBody>
				</Card>
			</div>
		</div>
	);
}
