"use client";

import React from "react";
import { Link } from "react-router";
import { TouchButton } from "~/components/mobile/touch-button";
import { TouchInput, TouchSelect } from "~/components/mobile/touch-input";
import {
	MobileLayout,
	MobileNavigation,
	MobileCard,
	MobileSection,
	MobileHeader,
} from "~/components/mobile/mobile-layout";
import { Alert } from "@monorepo/design-system";
import type { Employee, Station, TimeLog } from "@prisma/client";
import { clockIn, clockOut, startBreak, endBreak, pinToggleClock } from "../../time-clock/actions";
import { useOnlineStatus, useOfflineActionQueue } from "~/lib/offline-support";
import { notify } from "../../time-clock/notifications";

type TimeLogWithRelations = TimeLog & {
	employee: Employee;
	station: Station | null;
};

export function MobileTimeClock({
	employees,
	stations,
	activeLogs,
	activeBreaks,
}: {
	employees: Employee[];
	stations: Station[];
	activeLogs: TimeLogWithRelations[];
	activeBreaks: TimeLogWithRelations[];
}) {
	const [method, setMethod] = React.useState<"pin" | "select">("pin");
	const [pin, setPin] = React.useState("");
	const [selectedEmployee, setSelectedEmployee] = React.useState("");
	const [selectedStation, setSelectedStation] = React.useState("");
	const [processing, setProcessing] = React.useState(false);
	const [error, setError] = React.useState("");
	const [success, setSuccess] = React.useState("");

	// Online status management
	const { isOnline } = useOnlineStatus();
	const { enqueue, sync, queue, isSyncing } = useOfflineActionQueue("");

	const handlePinSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!pin.trim()) return;

		setProcessing(true);
		setError("");

		try {
			if (!isOnline) {
				enqueue("pinToggle", {
					pin: pin.trim(),
					stationId: selectedStation || null,
				});
				notify("Clock action queued for sync", "warning");
				setPin("");
				setSuccess("Action queued for next sync");
			} else {
				const formData = new FormData();
				formData.set("pin", pin.trim());
				formData.set("stationId", selectedStation || "");

				const result = await pinToggleClock({}, formData);

				if (result?.error) {
					setError(result.error);
				} else {
					setPin("");
					setSelectedStation("");
					setSuccess(result?.message || "Action completed successfully");
				}
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : "An error occurred");
		} finally {
			setProcessing(false);
		}
	};

	const handleSelectSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!selectedEmployee || !selectedStation) return;

		setProcessing(true);
		setError("");

		try {
			if (!isOnline) {
				enqueue("clockIn", {
					employeeId: selectedEmployee,
					stationId: selectedStation,
				});
				notify("Clock in queued for sync", "warning");
				setSuccess("Clock in queued for next sync");
				setSelectedEmployee("");
				setSelectedStation("");
			} else {
				const formData = new FormData();
				formData.set("employeeId", selectedEmployee);
				formData.set("stationId", selectedStation);

				const result = await clockIn({}, formData);

				if (result?.error) {
					setError(result.error);
				} else {
					setSelectedEmployee("");
					setSelectedStation("");
					setSuccess("Clocked in successfully");
				}
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : "An error occurred");
		} finally {
			setProcessing(false);
		}
	};

	const handleBreak = async (employeeId: string, isEnding: boolean) => {
		setProcessing(true);
		setError("");

		try {
			if (!isOnline) {
				enqueue(isEnding ? "endBreak" : "startBreak", { employeeId });
				notify(`Break ${isEnding ? "end" : "start"} queued for sync`, "warning");
				setSuccess("Action queued for next sync");
			} else {
				const formData = new FormData();
				formData.set("employeeId", employeeId);

				const result = isEnding ? await endBreak({}, formData) : await startBreak({}, formData);

				if (result?.error) {
					setError(result.error);
				} else {
					setSuccess(`Break ${isEnding ? "ended" : "started"} successfully`);
				}
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : "An error occurred");
		} finally {
			setProcessing(false);
		}
	};

	const handleClockOut = async (logId: string) => {
		setProcessing(true);
		setError("");

		try {
			if (!isOnline) {
				enqueue("clockOut", { logId });
				notify("Clock out queued for sync", "warning");
				setSuccess("Clock out queued for next sync");
			} else {
				const formData = new FormData();
				formData.set("logId", logId);

				const result = await clockOut({}, formData);

				if (result?.error) {
					setError(result.error);
				} else {
					setSuccess("Clocked out successfully");
				}
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : "An error occurred");
		} finally {
			setProcessing(false);
		}
	};

	const formatDuration = (start: Date, end?: Date) => {
		const now = end || new Date();
		const diff = now.getTime() - start.getTime();
		const hours = Math.floor(diff / (1000 * 60 * 60));
		const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
		const seconds = Math.floor((diff % (1000 * 60)) / 1000);

		return end ? `${hours}h ${minutes}m` : `${hours}h ${minutes}m ${seconds}s`;
	};

	const currentRoute = "/floor/time-clock";

	return (
		<MobileLayout
			header={
				<MobileHeader
					title="Time Clock"
					subtitle={isOnline ? "Online" : "Offline - Actions queued"}
					action={
						!isOnline && queue > 0 ? (
							<TouchButton onPress={sync} disabled={isSyncing} variant="outline" size="sm">
								{isSyncing ? "Syncing…" : `Sync ${queue}`}
							</TouchButton>
						) : null
					}
				/>
			}
			footer={<MobileNavigation currentRoute={currentRoute} />}
		>
			<div className="px-4 py-4 space-y-6">
				{/* Method Selection */}
				<MobileSection title="Clock In / Out" showBorder={false}>
					<div className="grid grid-cols-2 gap-3 mb-6">
						<TouchButton
							onPress={() => setMethod("pin")}
							variant={method === "pin" ? "primary" : "outline"}
						>
							PIN Number
						</TouchButton>
						<TouchButton
							onPress={() => setMethod("select")}
							variant={method === "select" ? "primary" : "outline"}
						>
							Select Employee
						</TouchButton>
					</div>

					{method === "pin" ? (
						<form onSubmit={handlePinSubmit} className="space-y-4">
							<TouchInput
								label="Enter PIN"
								type="password"
								value={pin}
								onChange={setPin}
								placeholder="4-6 digit PIN…"
								maxLength={6}
								pattern="\d{4,6}"
								keyboardType="numeric"
								autoComplete="off"
								icon={
									<svg
										className="w-6 h-6"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
										aria-hidden="true"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
										/>
									</svg>
								}
							/>

							<TouchSelect
								label="Station"
								value={selectedStation}
								onChange={setSelectedStation}
								options={[
									{ value: "", label: "Use last station" },
									...stations.map((station) => ({
										value: station.id,
										label: station.name as string,
									})),
								]}
								icon={
									<svg
										className="w-6 h-6"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
										aria-hidden="true"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
										/>
									</svg>
								}
							/>

							<TouchButton
								type="submit"
								variant="primary"
								loading={processing}
								size="2xl"
								hapticFeedback
							>
								Clock In / Out
							</TouchButton>
						</form>
					) : (
						<form onSubmit={handleSelectSubmit} className="space-y-4">
							<TouchSelect
								label="Employee"
								value={selectedEmployee}
								onChange={setSelectedEmployee}
								options={[
									{ value: "", label: "Select employee" },
									...employees.map((employee) => ({
										value: employee.id,
										label: employee.name,
									})),
								]}
							/>

							<TouchSelect
								label="Station"
								value={selectedStation}
								onChange={setSelectedStation}
								options={[
									{ value: "", label: "Select station" },
									...stations.map((station) => ({
										value: station.id,
										label: station.name as string,
									})),
								]}
							/>

							<TouchButton
								type="submit"
								variant="primary"
								loading={processing}
								size="2xl"
								hapticFeedback
							>
								Clock In
							</TouchButton>
						</form>
					)}
				</MobileSection>

				{/* Active Sessions */}
				{activeLogs.length > 0 && (
					<MobileSection title="Active Sessions">
						<div className="space-y-4">
							{activeLogs.map((log) => {
								const isOnBreak = activeBreaks.some((b) => b.employeeId === log.employeeId);
								return (
									<MobileCard key={log.id} padding="md">
										<div className="space-y-3">
											<div>
												<h3 className="font-bold text-lg">{log.employee.name}</h3>
												<p className="text-sm text-muted-foreground">
													{log.station?.name || "No station"}
												</p>
											</div>

											<div className="flex items-center justify-between">
												<div>
													<p className="text-xs text-muted-foreground">Started</p>
													<p className="font-mono text-lg">
														{new Date(log.startTime).toLocaleTimeString()}
													</p>
												</div>
												<div className="text-right">
													<p className="text-xs text-muted-foreground">Duration</p>
													<p className="font-mono text-lg">{formatDuration(log.startTime)}</p>
												</div>
											</div>

											{isOnBreak && (
												<Alert variant="warning" aria-live="polite">
													<div className="flex items-center gap-2">
														<svg
															className="w-5 h-5"
															fill="none"
															stroke="currentColor"
															viewBox="0 0 24 24"
															aria-hidden="true"
														>
															<path
																strokeLinecap="round"
																strokeLinejoin="round"
																strokeWidth={2}
																d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
															/>
														</svg>
														<span>On Break</span>
													</div>
												</Alert>
											)}

											<div className="flex gap-3">
												<TouchButton
													onPress={() => handleBreak(log.employeeId, isOnBreak)}
													variant={isOnBreak ? "error" : "primary"}
													size="md"
													disabled={processing}
													hapticFeedback
												>
													{isOnBreak ? "End Break" : "Start Break"}
												</TouchButton>

												<TouchButton
													onPress={() => handleClockOut(log.id)}
													variant="secondary"
													size="md"
													disabled={processing}
													hapticFeedback
												>
													Clock Out
												</TouchButton>
											</div>
										</div>
									</MobileCard>
								);
							})}
						</div>
					</MobileSection>
				)}

				{/* Offline Status */}
				{!isOnline && (
					<MobileCard variant="warning" padding="md">
						<div className="flex items-center gap-3">
							<svg
								className="w-6 h-6 text-yellow-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								aria-hidden="true"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"
								/>
							</svg>
							<div>
								<p className="font-medium">Offline Mode</p>
								<p className="text-sm text-muted-foreground">
									Actions will be queued and synced when connection is restored
								</p>
							</div>
						</div>
					</MobileCard>
				)}

				{/* Messages */}
				{error && <Alert variant="error">{error}</Alert>}

				{success && <Alert variant="success">{success}</Alert>}

				{/* Quick Actions */}
				{method === "pin" && (
					<MobileSection title="Quick Actions" showBorder={false}>
						<div className="grid grid-cols-2 gap-3">
							<Link to="/floor/reports">
								<TouchButton variant="outline" size="md" className="w-full">
									View Reports
								</TouchButton>
							</Link>
							<Link to="/floor/tasks">
								<TouchButton variant="outline" size="md" className="w-full">
									My Tasks
								</TouchButton>
							</Link>
						</div>
					</MobileSection>
				)}
			</div>
		</MobileLayout>
	);
}
