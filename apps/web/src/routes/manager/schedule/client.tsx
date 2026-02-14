"use client";

import { useMemo, useState } from "react";
import { addWeeks, format, isToday, parseISO, startOfWeek } from "date-fns";
import { useNavigate, useSearchParams } from "react-router";
import {
	Card,
	CardBody,
	CardHeader,
	CardTitle,
	Button,
	Select,
	Input,
	Badge,
} from "@monorepo/design-system";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PageHeader } from "~/components/page-header";
import type { ScheduleData } from "./actions";

type Station = {
	id: string;
	name: string;
	capacity?: number | null;
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
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const selectedDateParam = searchParams.get("day");
	const selectedDate = useMemo(() => {
		if (schedule.days.length === 0) return "";
		if (!selectedDateParam) return schedule.days[0].date;

		const matchingDay = schedule.days.find((day) => day.date.startsWith(selectedDateParam));
		return matchingDay?.date ?? schedule.days[0].date;
	}, [schedule.days, selectedDateParam]);
	const [selectedStation, setSelectedStation] = useState<string>("all");
	const [view, setView] = useState<"grid" | "list">("grid");
	const [search, setSearch] = useState("");

	const handleDayChange = (date: string) => {
		const nextSearchParams = new URLSearchParams(searchParams);
		nextSearchParams.set("day", date.slice(0, 10));
		navigate(`?${nextSearchParams.toString()}`, { replace: false });
	};

	const handleWeekChange = (offset: number) => {
		const nextSearchParams = new URLSearchParams(searchParams);
		const currentWeekStart = startOfWeek(parseISO(schedule.weekStart), { weekStartsOn: 0 });
		const nextWeekStart = addWeeks(currentWeekStart, offset);

		nextSearchParams.set("week", format(nextWeekStart, "yyyy-MM-dd"));

		if (selectedDate) {
			const selectedDateShifted = addWeeks(parseISO(selectedDate), offset);
			nextSearchParams.set("day", format(selectedDateShifted, "yyyy-MM-dd"));
		}

		navigate(`?${nextSearchParams.toString()}`, { replace: false });
	};

	const handleGoToCurrentWeek = () => {
		const nextSearchParams = new URLSearchParams(searchParams);
		nextSearchParams.set("week", format(startOfWeek(new Date(), { weekStartsOn: 0 }), "yyyy-MM-dd"));
		nextSearchParams.set("day", format(new Date(), "yyyy-MM-dd"));
		navigate(`?${nextSearchParams.toString()}`, { replace: false });
	};

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

	const selectedDay = schedule.days.find((day) => day.date === selectedDate) ?? null;
	const selectedDayLabel = selectedDay ? format(parseISO(selectedDay.date), "EEEE, MMM d") : "No day selected";
	const selectedDayStats = selectedDay
		? {
			total: selectedDay.entries.length,
			confirmed: selectedDay.entries.filter((entry) => entry.status === "CONFIRMED").length,
			pending: selectedDay.entries.filter((entry) => entry.status === "PENDING").length,
			open: selectedDay.entries.filter((entry) => entry.status === "OPEN").length,
		}
		: { total: 0, confirmed: 0, pending: 0, open: 0 };

	const weekShiftTotal = schedule.days.reduce((sum, day) => sum + day.entries.length, 0);
	const activeNowCount = activeEmployees.filter((log) => log.endTime === null).length;

	return (
		<div className="space-y-6">
			<PageHeader
				title="Weekly Schedule"
				subtitle={`${weekRangeLabel} · ${weekShiftTotal} scheduled shifts`}
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
				<CardBody className="space-y-4">
					<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
						<div className="flex flex-col">
							<span className="text-[10px] uppercase tracking-wider font-mono text-muted-foreground font-medium">
								Current Week
							</span>
							<span className="text-base font-semibold tracking-tight">{weekRangeLabel}</span>
						</div>
						<div className="flex flex-wrap items-center gap-1">
							<Button variant="outline" size="sm" onClick={() => handleWeekChange(-1)}>
								<ChevronLeft className="w-4 h-4 mr-1" />
								Prev
							</Button>
							<Button variant="outline" size="sm" onClick={handleGoToCurrentWeek}>
								Today
							</Button>
							<Button variant="outline" size="sm" onClick={() => handleWeekChange(1)}>
								Next
								<ChevronRight className="w-4 h-4 ml-1" />
							</Button>
						</div>
					</div>

					<div className="grid grid-cols-2 md:grid-cols-7 gap-3">
						{currentDayEntries.map((day) => (
							<button
								type="button"
								key={day.date}
								onClick={() => handleDayChange(day.date)}
								className={`rounded-[2px] border p-3 text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring ${
									selectedDate === day.date
										? "border-primary bg-primary/10"
										: day.isToday
											? "border-border/60 bg-muted dark:bg-background hover:bg-muted/80 dark:hover:bg-accent/20"
											: "border-border/50 bg-muted/60 dark:bg-background/80 hover:bg-muted/80 dark:hover:bg-accent/20 hover:border-primary/50"
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

					<div className="grid grid-cols-2 md:grid-cols-5 gap-px bg-border/50 border border-border/50 rounded-[2px] overflow-hidden">
						<div className="bg-muted/5 px-3 py-2">
							<p className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono">
								Selected Day
							</p>
							<p className="text-sm font-semibold truncate">{selectedDayLabel}</p>
						</div>
						<div className="bg-muted/5 px-3 py-2">
							<p className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono">
								Total Shifts
							</p>
							<p className="text-sm font-semibold font-mono">{selectedDayStats.total}</p>
						</div>
						<div className="bg-muted/5 px-3 py-2">
							<p className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono">
								Confirmed
							</p>
							<p className="text-sm font-semibold text-emerald-600 font-mono">{selectedDayStats.confirmed}</p>
						</div>
						<div className="bg-muted/5 px-3 py-2">
							<p className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono">
								Pending
							</p>
							<p className="text-sm font-semibold text-amber-600 font-mono">{selectedDayStats.pending}</p>
						</div>
						<div className="bg-muted/5 px-3 py-2">
							<p className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono">
								Open
							</p>
							<p className="text-sm font-semibold text-muted-foreground font-mono">{selectedDayStats.open}</p>
						</div>
					</div>
				</CardBody>
			</Card>

			<Card>
				<CardHeader className="pb-0">
					<CardTitle>Shift Board</CardTitle>
				</CardHeader>
				<CardBody className="space-y-4">
					<div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
						<div className="flex items-end gap-2">
							<Select
								name="stationFilter"
								label="Station"
								options={[
									{ value: "all", label: "All Stations" },
									...stations.map((s) => ({ value: s.id, label: s.name })),
								]}
								value={selectedStation}
								onChange={(value: string) => setSelectedStation(value || "all")}
								className="h-8 w-[180px] text-xs"
								containerClassName="gap-1"
								labelClassName="text-[10px]"
							/>
							<Input
								name="employeeSearch"
								label="Search"
								placeholder="Search employees…"
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								autoComplete="off"
								className="h-8 w-[180px] text-xs"
								containerClassName="gap-1"
								labelClassName="text-[10px]"
							/>
						</div>

						<div className="inline-flex w-auto justify-start gap-1 rounded-[2px] p-0.5 bg-muted/40 border border-border/50 self-end">
							<Button
								variant={view === "grid" ? "primary" : "ghost"}
								size="xs"
								onClick={() => setView("grid")}
							>
								Grid View
							</Button>
							<Button
								variant={view === "list" ? "primary" : "ghost"}
								size="xs"
								onClick={() => setView("list")}
							>
								List View
							</Button>
						</div>
					</div>

					{view === "grid" ? (
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
								{filteredEntries.map((entry) => (
									<div
										key={entry.id}
										className={`rounded-[2px] border border-border/50 bg-muted/40 p-4 transition-colors hover:bg-muted/60 ${shiftColors[entry.shiftType]}`}
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
										<p className="mt-1 text-[10px] font-mono uppercase tracking-[0.16em] text-muted-foreground">
											{entry.shiftType} Shift
										</p>
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
									<div className="col-span-full py-12 text-center">
										<p className="text-muted-foreground">No shifts match your filters.</p>
									</div>
								)}
							</div>
					) : (
							<div className="overflow-x-auto rounded-[2px] border border-border/60">
								<table className="w-full text-sm">
									<thead>
										<tr className="border-b border-border bg-muted/20 text-[10px] uppercase tracking-[0.14em] text-muted-foreground font-mono">
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
					)}
				</CardBody>
			</Card>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
				<Card className="lg:col-span-2">
					<CardHeader>
						<CardTitle>Coverage Heatmap</CardTitle>
					</CardHeader>
					<CardBody className="space-y-2">
						<p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground font-mono">
							Station utilization vs configured capacity
						</p>
						<div className="overflow-x-auto">
							<table className="w-full text-sm">
								<thead>
									<tr className="border-b border-border/50 bg-muted/20 text-[10px] uppercase tracking-[0.14em] text-muted-foreground font-mono">
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
										<tr key={station.id} className="border-b border-border/50 hover:bg-muted/5 transition-colors">
											<td className="p-3 font-medium">{station.name}</td>
											{schedule.days.map((day) => {
												const count = day.entries.filter(
													(entry) => entry.stationId === station.id
												).length;
												const denominator = Math.max(1, station.capacity ?? 1);
												const utilization = Math.min((count / denominator) * 100, 100);
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
																<p className="text-[10px] text-muted-foreground mt-1 font-mono uppercase tracking-[0.12em]">
																	{count} shifts
																</p>
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
						<div className="rounded-[2px] border border-border/50 bg-muted/20 px-3 py-2">
							<p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground font-mono">
								Clocked In Now
							</p>
							<p className="text-lg font-semibold leading-none mt-1">{activeNowCount}</p>
						</div>
						{activeEmployees.length === 0 ? (
							<p className="text-sm text-muted-foreground py-2">No active shifts right now.</p>
						) : (
							activeEmployees.slice(0, 5).map((log) => (
								<div key={log.id} className="rounded-[2px] border border-border/50 bg-muted/40 p-3">
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
