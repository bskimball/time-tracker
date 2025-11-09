"use client";

import { useState, useEffect } from "react";
import { Button, Card, CardHeader, CardTitle, CardBody } from "~/components/ds";

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

	const getStationStatusColor = (status: string): string => {
		const colors = {
			ACTIVE: "bg-green-100 text-green-800",
			BUSY: "bg-yellow-100 text-yellow-800",
			FULL: "bg-red-100 text-red-800",
			EMPTY: "bg-gray-100 text-gray-800",
			INACTIVE: "bg-gray-200 text-gray-600",
		};
		return colors[status as keyof typeof colors] || colors.INACTIVE;
	};

	const workLogs = activeLogs.filter((log) => log.type === "WORK" && !log.endTime);
	const breakLogs = activeLogs.filter((log) => log.type === "BREAK" && !log.endTime);

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-2xl font-bold">Floor Monitor</h1>
					<p className="text-muted-foreground">Real-time view of warehouse floor activity</p>
				</div>
				<div className="flex items-center space-x-4">
					<div className="text-right">
						<p className="text-sm text-muted-foreground">Current Time</p>
						<p className="text-lg font-medium">{currentTime.toLocaleTimeString()}</p>
					</div>
					<div className="flex items-center space-x-2">
						<input
							type="checkbox"
							id="auto-refresh"
							checked={autoRefresh}
							onChange={(e) => setAutoRefresh(e.target.checked)}
							className="rounded"
						/>
						<label htmlFor="auto-refresh" className="text-sm">
							Auto-refresh
						</label>
						<select
							value={refreshInterval}
							onChange={(e) => setRefreshInterval(parseInt(e.target.value))}
							disabled={!autoRefresh}
							className="text-sm px-2 py-1 border rounded"
						>
							<option value={10}>10s</option>
							<option value={30}>30s</option>
							<option value={60}>1m</option>
							<option value={300}>5m</option>
						</select>
					</div>
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
								<div key={station.id} className="border rounded-lg p-4 bg-muted/30">
									<div className="flex justify-between items-start mb-2">
										<div>
											<h4 className="font-medium">{station.name}</h4>
											{station.zone && (
												<p className="text-sm text-muted-foreground">Zone: {station.zone}</p>
											)}
										</div>
										<span
											className={`px-2 py-1 text-xs font-medium rounded-full ${getStationStatusColor(status)}`}
										>
											{status}
										</span>
									</div>

									<div className="space-y-2">
										<div>
											<div className="flex justify-between text-sm">
												<span>Occupancy</span>
												<span>
													{occupancy}/{capacity}
												</span>
											</div>
											<div className="w-full bg-muted rounded-full h-2">
												<div
													className="bg-primary h-2 rounded-full transition-all duration-500"
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
								<div key={log.id} className="border rounded p-4">
									<div className="flex justify-between items-start">
										<div>
											<h4 className="font-medium">{log.Employee.name}</h4>
											<p className="text-sm text-muted-foreground">
												{log.Station?.name || "No Station"}
											</p>
										</div>
										<div className="text-right">
											<p className="font-medium">{calculateDuration(log.startTime)}</p>
											<span
												className={`px-2 py-1 text-xs rounded ${log.type === "WORK"
														? "bg-blue-100 text-blue-800"
														: "bg-gray-100 text-gray-800"
													}`}
											>
												{log.type}
											</span>
										</div>
									</div>

									<div className="mt-3 space-y-1">
										<div className="flex justify-between text-sm">
											<span className="text-muted-foreground">Started:</span>
											<span>{new Date(log.startTime).toLocaleTimeString()}</span>
										</div>
										<div className="flex justify-between text-sm">
											<span className="text-muted-foreground">Method:</span>
											<span className="text-xs px-1 py-0.5 rounded bg-muted">
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
