"use client";

import { useState, useEffect } from "react";
import {
	Button,
	Card,
	CardHeader,
	CardTitle,
	CardBody,
	Checkbox,
	Select,
	Badge,
} from "@monorepo/design-system";
import { PageHeader } from "~/components/page-header";

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
}

export function FloorMonitor({ activeLogs, stations }: FloorMonitorProps) {
	const [currentTime, setCurrentTime] = useState(new Date());
	const [autoRefresh, setAutoRefresh] = useState(true);
	const [refreshInterval, setRefreshInterval] = useState(30); // seconds

	useEffect(() => {
		if (!autoRefresh) return;

		const interval = setInterval(() => {
			setCurrentTime(new Date());
		}, 1000);

		return () => clearInterval(interval);
	}, [autoRefresh]);

	// Auto-refresh data every N seconds
	useEffect(() => {
		if (!autoRefresh) return;

		const interval = setInterval(() => {
			// In a real app, you'd fetch fresh data here
			console.log("Auto-refreshing floor data...");
		}, refreshInterval * 1000);

		return () => clearInterval(interval);
	}, [autoRefresh, refreshInterval]);

	const calculateDuration = (startTime: Date): string => {
		const diff = currentTime.getTime() - new Date(startTime).getTime();
		const hours = Math.floor(diff / (1000 * 60 * 60));
		const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
		return `${hours}h ${minutes}m`;
	};

	const getStationOccupancy = (stationId: string): number => {
		return activeLogs.filter((log) => log.Station?.id === stationId && !log.endTime).length;
	};

	const getStationStatus = (station: Station): string => {
		const occupancy = getStationOccupancy(station.id);
		const capacity = station.capacity || 999;

		if (!station.isActive) return "INACTIVE";
		if (occupancy === 0) return "EMPTY";
		if (occupancy >= capacity) return "FULL";
		if (occupancy >= Math.ceil(capacity * 0.8)) return "BUSY";
		return "ACTIVE";
	};

	const getStationStatusVariant = (status: string): "success" | "primary" | "destructive" | "secondary" => {
		const variants: Record<string, "success" | "primary" | "destructive" | "secondary"> = {
			ACTIVE: "success",
			BUSY: "primary",
			FULL: "destructive",
			EMPTY: "secondary",
			INACTIVE: "secondary",
		};
		return variants[status] || "secondary";
	};

	const workLogs = activeLogs.filter((log) => log.type === "WORK" && !log.endTime);
	const breakLogs = activeLogs.filter((log) => log.type === "BREAK" && !log.endTime);

	return (
		<div className="space-y-6">
			<PageHeader title="Floor Monitor" subtitle="Real-time view of warehouse floor activity" />

			{/* Monitor Controls */}
			<div className="flex justify-end items-center gap-4">
				<div className="text-right">
					<p className="text-sm text-muted-foreground">Current Time</p>
					<p className="text-lg font-medium">{currentTime.toLocaleTimeString()}</p>
				</div>
				<div className="flex items-center gap-4">
					<Checkbox isSelected={autoRefresh} onChange={setAutoRefresh} label="Auto-refresh" />
					<Select
						options={[
							{ value: "10", label: "10s" },
							{ value: "30", label: "30s" },
							{ value: "60", label: "1m" },
							{ value: "300", label: "5m" },
						]}
						value={refreshInterval.toString()}
						onChange={(value: string) => setRefreshInterval(parseInt(value))}
						isDisabled={!autoRefresh}
						className="w-24"
					/>
				</div>
			</div>

			{/* Summary Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<Card>
					<CardBody>
						<h3 className="font-semibold mb-2">Active Workers</h3>
						<p className="text-2xl">{workLogs.length}</p>
						<p className="text-sm text-muted-foreground">Currently clocked in</p>
					</CardBody>
				</Card>

				<Card>
					<CardBody>
						<h3 className="font-semibold mb-2">On Break</h3>
						<p className="text-2xl">{breakLogs.length}</p>
						<p className="text-sm text-muted-foreground">Currently on break</p>
					</CardBody>
				</Card>

				<Card>
					<CardBody>
						<h3 className="font-semibold mb-2">Active Stations</h3>
						<p className="text-2xl">
							{stations.filter((s) => s.isActive && getStationOccupancy(s.id) > 0).length}
						</p>
						<p className="text-sm text-muted-foreground">
							of {stations.filter((s) => s.isActive).length} total
						</p>
					</CardBody>
				</Card>

				<Card>
					<CardBody>
						<h3 className="font-semibold mb-2">Average Shift Length</h3>
						<p className="text-2xl">
							{workLogs.length > 0 ? calculateDuration(workLogs[0].startTime) : "0h 0m"}
						</p>
						<p className="text-sm text-muted-foreground">Longest current shift</p>
					</CardBody>
				</Card>
			</div>

			{/* Station Occupancy */}
			<Card>
				<CardHeader>
					<CardTitle>Station Occupancy</CardTitle>
				</CardHeader>
				<CardBody>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{stations.map((station) => {
							const occupancy = getStationOccupancy(station.id);
							const status = getStationStatus(station);
							const capacity = station.capacity || 999;

							return (
								<div key={station.id} className="border border-border/50 rounded-[2px] p-4 bg-card/50">
									<div className="flex justify-between items-start mb-2">
										<div>
											<h4 className="font-bold font-heading text-sm uppercase tracking-tight">{station.name}</h4>
											{station.zone && (
												<p className="text-xs text-muted-foreground font-mono">Zone: {station.zone}</p>
											)}
										</div>
										<Badge variant={getStationStatusVariant(status)}>
											{status}
										</Badge>
									</div>

									<div className="space-y-2">
										<div>
											<div className="flex justify-between text-sm">
												<span>Occupancy</span>
												<span>
													{occupancy}/{capacity}
												</span>
											</div>
											<div className="w-full bg-muted rounded-[1px] h-1.5 border border-border/30">
												<div
													className="bg-primary h-full transition-all duration-500"
													style={{
														width: `${Math.min((occupancy / capacity) * 100, 100)}%`,
													}}
												/>
											</div>
										</div>

										{occupancy > 0 && (
											<div className="space-y-1">
												{activeLogs
													.filter((log) => log.Station?.id === station.id && !log.endTime)
													.map((log) => (
														<div key={log.id} className="flex justify-between items-center text-xs">
															<span>{log.Employee.name}</span>
															<span className="text-muted-foreground">
																{calculateDuration(log.startTime)}
															</span>
														</div>
													))}
											</div>
										)}
									</div>
								</div>
							);
						})}
					</div>
				</CardBody>
			</Card>

			{/* Active Workers List */}
			<Card>
				<CardHeader>
					<CardTitle>Active Workers</CardTitle>
				</CardHeader>
				<CardBody>
					{workLogs.length === 0 ? (
						<p className="text-center text-muted-foreground py-8">
							No workers currently clocked in
						</p>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							{workLogs.map((log) => (
								<div key={log.id} className="border border-border/50 rounded-[2px] p-4 bg-card/50">
									<div className="flex justify-between items-start">
										<div>
											<h4 className="font-bold font-heading text-sm uppercase tracking-tight">{log.Employee.name}</h4>
											<p className="text-xs text-muted-foreground font-mono">
												{log.Station?.name || "No Station"}
											</p>
										</div>
										<div className="text-right">
											<p className="font-mono text-sm">{calculateDuration(log.startTime)}</p>
											<Badge variant={log.type === "WORK" ? "primary" : "secondary"}>
												{log.type}
											</Badge>
										</div>
									</div>

									<div className="mt-3 space-y-1">
										<div className="flex justify-between text-sm">
											<span className="text-muted-foreground">Started:</span>
											<span>{new Date(log.startTime).toLocaleTimeString()}</span>
										</div>
										<div className="flex justify-between text-xs">
											<span className="text-muted-foreground font-mono uppercase tracking-widest text-[10px]">Method:</span>
											<span className="text-[10px] px-1 py-0.5 rounded-[1px] bg-muted font-mono">
												{log.clockMethod}
											</span>
										</div>
									</div>

									<div className="mt-3 flex space-x-2">
										<Button size="sm" variant="outline">
											View Details
										</Button>
										<Button size="sm" variant="outline">
											End Shift
										</Button>
									</div>
								</div>
							))}
						</div>
					)}
				</CardBody>
			</Card>

			{/* Performance Indicators */}
			<Card>
				<CardHeader>
					<CardTitle>Performance Indicators</CardTitle>
				</CardHeader>
				<CardBody>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div>
							<h4 className="font-medium mb-3">Peak Performance</h4>
							<div className="space-y-2">
								{activeLogs
									.filter((log) => !log.endTime)
									.sort((a, b) => {
										const aDuration = currentTime.getTime() - new Date(a.startTime).getTime();
										const bDuration = currentTime.getTime() - new Date(b.startTime).getTime();
										return bDuration - aDuration;
									})
									.slice(0, 3)
									.map((log, index) => (
										<div key={log.id} className="flex justify-between items-center">
											<span className="text-sm">
												{index + 1}. {log.Employee.name}
											</span>
											<span className="text-sm font-medium">
												{calculateDuration(log.startTime)}
											</span>
										</div>
									))}
								{activeLogs.filter((log) => !log.endTime).length === 0 && (
									<p className="text-sm text-muted-foreground">No active workers</p>
								)}
							</div>
						</div>

						<div>
							<h4 className="font-medium mb-3">Employee Distribution</h4>
							<div className="space-y-2">
								{stations.map((station) => {
									const count = getStationOccupancy(station.id);
									if (count === 0) return null;

									return (
										<div key={station.id} className="flex justify-between items-center">
											<span className="text-sm">{station.name}</span>
											<span className="text-sm font-medium">{count} workers</span>
										</div>
									);
								})}
								{workLogs.length === 0 && (
									<p className="text-sm text-muted-foreground">No station distribution</p>
								)}
							</div>
						</div>
					</div>
				</CardBody>
			</Card>
		</div>
	);
}
