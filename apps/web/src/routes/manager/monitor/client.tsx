"use client";

import { useState, useEffect, useMemo } from "react";
import { useNavigate, useNavigation } from "react-router";
import {
	Card,
	Badge,
	IndustrialPanel,
	LedIndicator,
} from "@monorepo/design-system";
import { PageHeader } from "~/components/page-header";
import { cn } from "~/lib/cn";
import { useManagerRealtime } from "~/lib/manager-realtime-client";
import {
	LiaUserClockSolid,
	LiaChartPieSolid,
	LiaExclamationTriangleSolid,
	LiaStopwatchSolid,
	LiaSyncSolid,
} from "react-icons/lia";

const MONITOR_REALTIME_SCOPES = ["monitor", "tasks"] as const;
const MONITOR_INVALIDATION_EVENTS = [
	"task_assignment_changed",
	"time_log_changed",
	"break_changed",
	"worker_status_changed",
] as const;

type ActiveTimeLog = {
	id: string;
	startTime: Date;
	endTime: Date | null;
	type: "WORK" | "BREAK";
	note: string | null;
	correctedBy: string | null;
	clockMethod: "PIN" | "CARD" | "BIOMETRIC" | "MANUAL";
	Employee: {
		id: string;
		name: string;
		email: string;
		defaultStation?: { id: string; name: string } | null;
		lastStation?: { id: string; name: string } | null;
	};
	Station: { id: string; name: string } | null;
};

type Station = {
	id: string;
	name: string;
	capacity: number | null;
	isActive: boolean;
	zone: string | null;
};

interface FloorMonitorProps {
	activeLogs: ActiveTimeLog[];
	stations: Station[];
	snapshotAt: Date;
	activeTasksByEmployee: Record<
		string,
		{
			assignmentId: string;
			taskTypeName: string;
			employeeName: string;
			startTime: Date;
			stationId: string;
			stationName: string | null;
		}
	>;
}

export function FloorMonitor({
	activeLogs,
	stations,
	activeTasksByEmployee,
	snapshotAt,
}: FloorMonitorProps) {
	const navigate = useNavigate();
	const navigation = useNavigation();
	const isRefreshing = navigation.state !== "idle";
	const [currentTime, setCurrentTime] = useState(new Date());
	useManagerRealtime({
		scopes: MONITOR_REALTIME_SCOPES,
		invalidateOn: MONITOR_INVALIDATION_EVENTS,
		pollingIntervalSeconds: 30,
		onInvalidate: () => {
			if (document.hidden || isRefreshing) {
				return;
			}

			navigate(0);
		},
	});
	const stationStatusOptions = ["ACTIVE", "BUSY", "FULL", "IDLE", "INACTIVE"] as const;
	const [statusFilters, setStatusFilters] = useState<string[]>([...stationStatusOptions]);

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentTime(new Date());
		}, 1000);
		return () => clearInterval(interval);
	}, []);

	const snapshotDate = useMemo(() => new Date(snapshotAt), [snapshotAt]);
	const calculateDuration = (startTime: Date): string => {
		const diff = currentTime.getTime() - new Date(startTime).getTime();
		const hours = Math.floor(diff / (1000 * 60 * 60));
		const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
		return `${hours}h ${minutes}m`;
	};

	const workLogs = activeLogs.filter((log) => log.type === "WORK" && !log.endTime);
	const breakLogs = activeLogs.filter((log) => log.type === "BREAK" && !log.endTime);

	const activeTaskEntries = Object.entries(activeTasksByEmployee);

	const getStationOccupancy = (stationId: string): number => {
		const employeeIds = new Set<string>();
		for (const log of workLogs) {
			if (log.Station?.id === stationId) employeeIds.add(log.Employee.id);
		}
		for (const [employeeId, task] of activeTaskEntries) {
			if (task.stationId === stationId) employeeIds.add(employeeId);
		}
		return employeeIds.size;
	};

	const getStationStatus = (station: Station): string => {
		const occupancy = getStationOccupancy(station.id);
		const capacity = station.capacity || 999;
		if (!station.isActive) return "INACTIVE";
		if (occupancy === 0) return "IDLE";
		if (occupancy >= capacity) return "FULL";
		if (occupancy >= Math.ceil(capacity * 0.8)) return "BUSY";
		return "ACTIVE";
	};

	const toggleStatusFilter = (status: string) => {
		setStatusFilters((current) => {
			if (current.includes(status)) {
				if (current.length === 1) {
					return current;
				}
				return current.filter((item) => item !== status);
			}
			return [...current, status];
		});
	};

	const activeWorkerIds = new Set<string>();
	for (const log of workLogs) activeWorkerIds.add(log.Employee.id);
	for (const employeeId of Object.keys(activeTasksByEmployee)) activeWorkerIds.add(employeeId);

	// Calculate longest shift
	const shiftStartCandidates = [
		...workLogs.map((log) => new Date(log.startTime)),
		...activeTaskEntries.map(([, task]) => new Date(task.startTime)),
	];
	const longestCurrentStartTime =
		shiftStartCandidates.length > 0
			? new Date(Math.min(...shiftStartCandidates.map((d) => d.getTime())))
			: null;

	const activeStationsCount = stations.filter(
		(s) => s.isActive && getStationOccupancy(s.id) > 0,
	).length;
	const stationLoadPercent =
		stations.length > 0 ? Math.round((activeStationsCount / stations.length) * 100) : 0;
	const filteredStations = stations.filter((station) => statusFilters.includes(getStationStatus(station)));

	// Identify workers who are assigned tasks but not in active work logs
	const taskOnlyWorkers = activeTaskEntries
		.filter(([employeeId]) => !workLogs.some((log) => log.Employee.id === employeeId))
		.map(([employeeId, task]) => ({
			id: employeeId,
			name: task.employeeName,
			stationName: task.stationName,
			startTime: task.startTime,
			taskName: task.taskTypeName,
		}));

	return (
		<div className="space-y-8">
			{/* Header */}
			<PageHeader
				title="Floor Monitor"
				subtitle="Operations Monitor"
				actions={
					<div className="flex items-center gap-2">
						<div className="rounded-[2px] border border-border/60 bg-card px-3 py-2">
							<div className="text-[10px] font-heading uppercase tracking-wider text-muted-foreground">
								Snapshot
							</div>
							<div className="font-data text-xs tabular-nums">
								{snapshotDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
							</div>
						</div>
						<button
							type="button"
							onClick={() => navigate(0)}
							disabled={isRefreshing}
							className={cn(
								"h-9 w-9 flex items-center justify-center rounded-[2px] border border-border/60 bg-card transition-colors",
								"hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
								isRefreshing ? "opacity-60 cursor-not-allowed" : "text-foreground",
							)}
							title="Refresh Now"
						>
							<LiaSyncSolid className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
						</button>
					</div>
				}
			/>

			{/* Metrics Dashboard */}
			<section
				aria-label="Key Metrics"
				className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-border border border-border rounded-[2px] overflow-hidden shadow-industrial"
			>
				<div className="bg-card p-4 md:p-6 flex flex-col justify-between group hover:bg-muted/5 transition-colors">
					<div className="flex items-center gap-2 text-muted-foreground mb-4">
						<LiaUserClockSolid className="w-5 h-5" />
						<span className="text-xs font-heading uppercase tracking-wider font-semibold">
							Active Personnel
						</span>
					</div>
					<div className="flex items-baseline gap-2">
						<span className="text-3xl font-data font-medium tracking-tight text-foreground group-hover:text-primary transition-colors">
							{activeWorkerIds.size}
						</span>
						<span className="text-sm text-muted-foreground font-data">
							{activeWorkerIds.size > 0 ? "On Floor" : "Clear"}
						</span>
					</div>
					<p className="text-[10px] text-muted-foreground mt-2">Clocked in (WORK) or assigned task</p>
				</div>

				<div className="bg-card p-4 md:p-6 flex flex-col justify-between group hover:bg-muted/5 transition-colors">
					<div className="flex items-center gap-2 text-muted-foreground mb-4">
						<LiaChartPieSolid className="w-5 h-5" />
						<span className="text-xs font-heading uppercase tracking-wider font-semibold">Station Load</span>
					</div>
					<div className="flex items-baseline gap-2">
						<span className="text-3xl font-data font-medium tracking-tight text-foreground group-hover:text-primary transition-colors">
							{stationLoadPercent}%
						</span>
						<span className="text-sm text-muted-foreground font-data">
							{activeStationsCount}/{stations.length} Active
						</span>
					</div>
				</div>

				<div className="bg-card p-4 md:p-6 flex flex-col justify-between group hover:bg-muted/5 transition-colors">
					<div className="flex items-center gap-2 text-muted-foreground mb-4">
						<LiaExclamationTriangleSolid className="w-5 h-5" />
						<span className="text-xs font-heading uppercase tracking-wider font-semibold">Break Status</span>
					</div>
					<div className="flex items-baseline gap-2">
						<span className="text-3xl font-data font-medium tracking-tight text-foreground group-hover:text-primary transition-colors">
							{breakLogs.length}
						</span>
						<span className="text-sm text-muted-foreground font-data">Paused</span>
					</div>
				</div>

				<div className="bg-card p-4 md:p-6 flex flex-col justify-between group hover:bg-muted/5 transition-colors">
					<div className="flex items-center gap-2 text-muted-foreground mb-4">
						<LiaStopwatchSolid className="w-5 h-5" />
						<span className="text-xs font-heading uppercase tracking-wider font-semibold">Shift Max</span>
					</div>
					<div className="flex items-baseline gap-2">
						<span className="text-3xl font-data font-medium tracking-tight text-foreground group-hover:text-primary transition-colors">
							{longestCurrentStartTime
								? calculateDuration(longestCurrentStartTime)
								: "--"}
						</span>
						<span className="text-sm text-muted-foreground font-data">Duration</span>
					</div>
					<p className="text-[10px] text-muted-foreground mt-2">Longest active session on floor</p>
				</div>
			</section>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				{/* Left Column: Station Map (2/3 width) */}
				<div className="lg:col-span-2 space-y-6">
					<div className="flex items-center justify-between border-b border-border pb-2">
						<h3 className="font-heading font-semibold text-lg flex items-center gap-2">
							<span className="w-2 h-2 bg-primary rounded-[1px] animate-pulse" />
							STATION STATUS
						</h3>
						<div className="flex gap-2">
							{stationStatusOptions.map((status) => (
								<button
									type="button"
									key={status}
									onClick={() => toggleStatusFilter(status)}
									className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-[2px]"
									aria-pressed={statusFilters.includes(status)}
								>
									<Badge
										variant={statusFilters.includes(status) ? "primary" : "outline"}
										className={cn(
											"text-[10px] font-mono",
											!statusFilters.includes(status) && "opacity-60",
										)}
									>
										{status}
									</Badge>
								</button>
							))}
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
						{filteredStations.map((station) => {
							const occupancy = getStationOccupancy(station.id);
							const status = getStationStatus(station);
							const capacity = station.capacity || 5; // Default for visual if null

							// Get workers at this station
							const stationWorkers = [
								...workLogs
									.filter((log) => log.Station?.id === station.id)
									.map((log) => ({
										id: log.Employee.id,
										name: log.Employee.name,
										task: activeTasksByEmployee[log.Employee.id]?.taskTypeName,
										time: log.startTime,
									})),
								...activeTaskEntries
									.filter(([, task]) => task.stationId === station.id)
									.filter(([id]) => !workLogs.some((l) => l.Employee.id === id)) // Avoid dupes if clocked in AND assigned task
									.map(([id, task]) => ({
										id,
										name: task.employeeName,
										task: task.taskTypeName,
										time: task.startTime,
									})),
							];

							return (
								<IndustrialPanel
									key={station.id}
									className={cn(
										"flex flex-col h-full",
										status === "INACTIVE" && "opacity-60 grayscale",
									)}
									variant={status === "FULL" ? "destructive" : "default"}
								>
									<div className="p-4 flex-1">
										<div className="flex justify-between items-start mb-4">
											<div>
												<div className="flex items-center gap-2">
													<h4 className="font-heading font-bold text-sm tracking-tight uppercase">
														{station.name}
													</h4>
													{station.zone && (
														<span className="text-[10px] font-mono bg-muted px-1 rounded-[1px] text-muted-foreground">
															{station.zone}
														</span>
													)}
												</div>
												<div className="text-[10px] font-mono text-muted-foreground mt-1">
													CAP: {capacity} | ID: {station.id.slice(0, 4)}
												</div>
											</div>
											<LedIndicator
												active={status !== "IDLE" && status !== "INACTIVE"}
												className={cn(
													status === "FULL" && "bg-destructive shadow-destructive/50",
													status === "BUSY" && "bg-amber-500 shadow-amber-500/50",
												)}
											/>
										</div>

										{/* Occupancy Bar */}
										<div className="mb-4 space-y-1">
											<div className="flex justify-between text-[10px] font-mono text-muted-foreground">
												<span>LOAD</span>
												<span>
													{occupancy}/{capacity}
												</span>
											</div>
											<div className="h-2 w-full bg-muted rounded-[1px] overflow-hidden flex gap-[1px]">
												{Array.from({ length: capacity }).map((_, i) => (
													<div
														key={i}
														className={cn(
															"flex-1 transition-all duration-300",
															i < occupancy
																? status === "FULL"
																	? "bg-destructive"
																	: status === "BUSY"
																		? "bg-amber-500"
																		: "bg-primary"
																: "bg-transparent",
														)}
													/>
												))}
											</div>
										</div>

										{/* Worker List */}
										{stationWorkers.length > 0 ? (
											<div className="space-y-2 mt-4 border-t border-border/50 pt-2">
												{stationWorkers.map((worker) => (
													<div
														key={worker.id}
														className="flex justify-between items-center text-xs group"
													>
														<div className="flex flex-col">
															<span className="font-medium group-hover:text-primary transition-colors">
																{worker.name}
															</span>
															{worker.task && (
																<span className="text-[10px] text-muted-foreground truncate max-w-[120px]">
																	{worker.task}
																</span>
															)}
														</div>
														<span className="font-mono text-[10px] text-muted-foreground tabular-nums">
															{calculateDuration(worker.time)}
														</span>
													</div>
												))}
											</div>
										) : (
											<div className="h-12 flex items-center justify-center text-xs text-muted-foreground/50 font-mono italic">
												STATION CLEAR
											</div>
										)}
									</div>
								</IndustrialPanel>
							);
						})}
						{filteredStations.length === 0 && (
							<div className="md:col-span-2 xl:col-span-3 py-10 text-center text-sm text-muted-foreground border border-dashed border-border rounded-[2px]">
								No stations match the selected status filters
							</div>
						)}
					</div>
				</div>

				{/* Right Column: Manifest (1/3 width) */}
				<div className="space-y-6">
					<div className="flex items-center justify-between border-b border-border pb-2">
						<h3 className="font-heading font-semibold text-lg">PERSONNEL MANIFEST</h3>
						<Badge variant="secondary" className="font-mono">
							TOTAL: {activeWorkerIds.size}
						</Badge>
					</div>

					<Card className="h-[calc(100vh-300px)] overflow-hidden flex flex-col">
						<div className="bg-muted/30 p-2 grid grid-cols-4 gap-2 text-[10px] font-mono text-muted-foreground uppercase tracking-wider border-b border-border">
							<div className="col-span-2">Employee</div>
							<div className="text-right">Time</div>
							<div className="text-center">Status</div>
						</div>
						<div className="overflow-y-auto flex-1 p-2 space-y-1">
							{workLogs.map((log) => (
								<div
									key={log.id}
									className="grid grid-cols-4 gap-2 p-2 rounded-[1px] hover:bg-muted/50 transition-colors border-b border-border/30 last:border-0 items-center"
								>
									<div className="col-span-2">
										<div className="text-sm font-medium leading-none">{log.Employee.name}</div>
										<div className="text-[10px] text-muted-foreground font-mono mt-1">
											{log.Station?.name || (log.Employee.defaultStation ? `FLOAT (Def: ${log.Employee.defaultStation.name})` : "FLOAT")}
										</div>
									</div>
									<div className="text-right font-mono text-xs tabular-nums text-muted-foreground">
										{calculateDuration(log.startTime)}
									</div>
									<div className="text-center">
										<Badge variant="outline" className="text-[10px] h-5 px-1 bg-primary/10 text-primary border-primary/20">
											WORK
										</Badge>
									</div>
								</div>
							))}
							
							{breakLogs.map((log) => (
								<div
									key={log.id}
									className="grid grid-cols-4 gap-2 p-2 rounded-[1px] hover:bg-muted/50 transition-colors border-b border-border/30 last:border-0 items-center opacity-70"
								>
									<div className="col-span-2">
										<div className="text-sm font-medium leading-none">{log.Employee.name}</div>
										<div className="text-[10px] text-muted-foreground font-mono mt-1">
											ON BREAK
										</div>
									</div>
									<div className="text-right font-mono text-xs tabular-nums text-muted-foreground">
										{calculateDuration(log.startTime)}
									</div>
									<div className="text-center">
										<Badge variant="secondary" className="text-[10px] h-5 px-1">
											BREAK
										</Badge>
									</div>
								</div>
							))}

							{taskOnlyWorkers.map((worker) => (
								<div
									key={worker.id}
									className="grid grid-cols-4 gap-2 p-2 rounded-[1px] hover:bg-muted/50 transition-colors border-b border-border/30 last:border-0 items-center"
								>
									<div className="col-span-2">
										<div className="text-sm font-medium leading-none">{worker.name}</div>
										<div className="text-[10px] text-muted-foreground font-mono mt-1">
											{worker.stationName || "Unknown Station"}
											{worker.taskName ? ` :: ${worker.taskName}` : ""}
										</div>
									</div>
									<div className="text-right font-mono text-xs tabular-nums text-muted-foreground">
										{calculateDuration(worker.startTime)}
									</div>
									<div className="text-center">
										<Badge
											variant="outline"
											className="text-[10px] h-5 px-1 bg-blue-500/10 text-blue-600 border-blue-200"
										>
											ASSIGNED
										</Badge>
									</div>
								</div>
							))}

							{activeWorkerIds.size === 0 && (
								<div className="py-12 text-center text-muted-foreground text-sm">
									No active personnel
								</div>
							)}
						</div>
					</Card>
				</div>
			</div>
		</div>
	);
}
