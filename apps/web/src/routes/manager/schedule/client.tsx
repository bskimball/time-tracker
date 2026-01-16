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
	NIGHT: "border-l-4 border-l-purple-500",
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
								key={day.date}
								onClick={() => setSelectedDate(day.date)}
								className={`rounded-lg border p-3 text-left transition-all ${
									selectedDate === day.date
										? "border-primary bg-primary/10"
										: day.isToday
											? "border-border bg-muted/30"
											: "border-transparent bg-muted/20"
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
							label="Station"
							options={[
								{ value: "all", label: "All Stations" },
								...stations.map((s) => ({ value: s.id, label: s.name })),
							]}
							value={selectedStation}
							onChange={(value: string) => setSelectedStation(value || "all")}
						/>
						<Input
							label="Search"
							placeholder="Search employees..."
							value={search}
							onChange={(e) => setSearch(e.target.value)}
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
										className={`rounded-lg border bg-card p-4 shadow-sm ${shiftColors[entry.shiftType]}`}
									>
										<div className="flex justify-between items-start">
											<div>
												<h3 className="font-semibold">{entry.employeeName}</h3>
												<p className="text-xs text-muted-foreground">{entry.role}</p>
											</div>
											<span
												className={`rounded-full px-2 py-0.5 text-xs font-medium ${
													entry.status === "CONFIRMED"
														? "bg-green-100 text-green-800"
														: entry.status === "PENDING"
															? "bg-yellow-100 text-yellow-800"
															: "bg-slate-200 text-slate-700"
												}`}
											>
												{entry.status}
											</span>
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
									<p className="text-center text-muted-foreground py-8">
										No shifts match your filters.
									</p>
								)}
							</div>
						</TabPanel>

						<TabPanel id="list">
							<div className="overflow-x-auto">
								<table className="w-full text-sm">
									<thead>
										<tr className="border-b">
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
											<tr key={entry.id} className="border-b hover:bg-muted/40">
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
													<span
														className={`px-2 py-0.5 rounded-full text-xs font-medium ${
															entry.role === "LEAD"
																? "bg-indigo-100 text-indigo-800"
																: entry.role === "SUPPORT"
																	? "bg-rose-100 text-rose-800"
																	: "bg-slate-100 text-slate-800"
														}`}
													>
														{entry.role}
													</span>
												</td>
												<td className="p-3">
													<span
														className={`px-2 py-0.5 rounded-full text-xs font-medium ${
															entry.status === "CONFIRMED"
																? "bg-green-100 text-green-800"
																: entry.status === "PENDING"
																	? "bg-yellow-100 text-yellow-800"
																	: "bg-slate-200 text-slate-700"
														}`}
													>
														{entry.status}
													</span>
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
												<td colSpan={6} className="p-6 text-center text-muted-foreground">
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
									<tr className="border-b">
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
										<tr key={station.id} className="border-b">
											<td className="p-3 font-medium">{station.name}</td>
											{schedule.days.map((day) => {
												const count = day.entries.filter(
													(entry) => entry.stationId === station.id
												).length;
												const utilization = Math.min((count / 4) * 100, 100);
												return (
													<td key={`${station.id}-${day.date}`} className="p-3 text-center">
														<div className="h-10 rounded bg-muted">
															<div
																className="h-full rounded"
																style={{
																	width: `${utilization}%`,
																	backgroundColor: utilization > 80 ? "#f97316" : "#22c55e",
																}}
															/>
														</div>
														<p className="text-xs text-muted-foreground mt-1">{count} shifts</p>
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
