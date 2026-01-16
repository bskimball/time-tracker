"use client";

import React from "react";
import { TouchButton } from "~/components/mobile/touch-button";
import { TouchInput, TouchSelect } from "~/components/mobile/touch-input";
import { MobileCard, MobileSection, MobileGrid } from "~/components/mobile/mobile-layout";
import { useKioskMode, KioskBatteryWarning, KioskOverlay, KioskMonitor } from "./kiosk-manager";
import { Alert } from "~/components/ds/alert";
import type { Employee, Station, TimeLog } from "@prisma/client";
import {
	clockIn,
	clockOut,
	startBreak,
	endBreak,
	pinToggleClock,
} from "../../routes/time-clock/actions";
import { useOnlineStatus, useOfflineActionQueue } from "~/lib/offline-support";
import { notify } from "../../routes/time-clock/notifications";
import { cn } from "~/lib/cn";

type TimeLogWithRelations = TimeLog & {
	employee: Employee;
	station: Station | null;
};

interface KioskTimeClockProps {
	employees: Employee[];
	stations: Station[];
	activeLogs: TimeLogWithRelations[];
	activeBreaks: TimeLogWithRelations[];
	completedLogs: TimeLogWithRelations[];
}

export function KioskTimeClock({
	employees,
	stations,
	activeLogs,
	activeBreaks,
	completedLogs: _completedLogs,
}: KioskTimeClockProps) {
	const { isKioskMode, config, session, device, updateActivity, batteryLevel, isCharging } =
		useKioskMode();

	const [method, setMethod] = React.useState<"pin" | "select" | "barcode">(
		config.enableBarcodeScanner ? "barcode" : "pin"
	);
	const [pin, setPin] = React.useState("");
	const [selectedEmployee, setSelectedEmployee] = React.useState("");
	const [selectedStation, setSelectedStation] = React.useState(config.stationId || "");
	const [processing, setProcessing] = React.useState(false);
	const [error, setError] = React.useState("");
	const [success, setSuccess] = React.useState("");

	// Online status management
	const { isOnline } = useOnlineStatus();
	const { enqueue, sync, queue, isSyncing } = useOfflineActionQueue("");

	const pinInputRef = React.useRef<HTMLInputElement>(null);

	// Auto-focus PIN input when enabled
	React.useEffect(() => {
		if (config.enablePinPad && pinInputRef.current && method === "pin") {
			pinInputRef.current.focus();
		}
	}, [config.enablePinPad, method]);

	// Handle activity tracking for auto-logout
	React.useEffect(() => {
		const handleUserActivity = () => {
			updateActivity();
		};

		if (isKioskMode) {
			const events = ["mousedown", "touchstart", "keydown"];
			events.forEach((event) => {
				document.addEventListener(event, handleUserActivity);
			});

			return () => {
				events.forEach((event) => {
					document.removeEventListener(event, handleUserActivity);
				});
			};
		}
	}, [isKioskMode, updateActivity]);

	const handlePinSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!pin.trim()) return;

		setProcessing(true);
		setError("");
		setSuccess("");
		updateActivity();

		try {
			if (!isOnline) {
				enqueue("pinToggle", {
					pin: pin.trim(),
					stationId: selectedStation || null,
				});
				notify("Clock action queued for sync", "warning");
				setPin("");
				setSuccess("Action queued for next sync");
				playFeedback();
			} else {
				const formData = new FormData();
				formData.set("pin", pin.trim());
				formData.set("stationId", selectedStation || "");

				const result = await pinToggleClock({}, formData);

				if (!result || result.error) {
					setError(result?.error || "Action failed");
					playErrorFeedback();
				} else {
					setPin("");
					setSuccess(result.message || "Action completed successfully");
					playSuccessFeedback();
				}
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : "An error occurred");
			playErrorFeedback();
		} finally {
			setProcessing(false);
		}
	};

	const handleSelectSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!selectedEmployee || !selectedStation) return;

		setProcessing(true);
		setError("");
		setSuccess("");
		updateActivity();

		try {
			if (!isOnline) {
				enqueue("clockIn", {
					employeeId: selectedEmployee,
					stationId: selectedStation,
				});
				notify("Clock in queued for sync", "warning");
				setSuccess("Clock in queued for next sync");
				setSelectedEmployee("");
				playFeedback();
			} else {
				const formData = new FormData();
				formData.set("employeeId", selectedEmployee);
				formData.set("stationId", selectedStation);

				const result = await clockIn({}, formData);

				if (!result || result.error) {
					setError(result?.error || "Clock in failed");
					playErrorFeedback();
				} else {
					setSelectedEmployee("");
					setSuccess("Clocked in successfully");
					playSuccessFeedback();
				}
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : "An error occurred");
			playErrorFeedback();
		} finally {
			setProcessing(false);
		}
	};

	const handleBreak = async (employeeId: string, isEnding: boolean) => {
		setProcessing(true);
		setError("");
		setSuccess("");
		updateActivity();

		try {
			if (!isOnline) {
				enqueue(isEnding ? "endBreak" : "startBreak", { employeeId });
				notify(`Break ${isEnding ? "end" : "start"} queued for sync`, "warning");
				setSuccess("Action queued for next sync");
				playFeedback();
			} else {
				const formData = new FormData();
				formData.set("employeeId", employeeId);

				const result = isEnding ? await endBreak({}, formData) : await startBreak({}, formData);

				if (!result || result.error) {
					setError(result?.error || "Break action failed");
					playErrorFeedback();
				} else {
					setSuccess(`Break ${isEnding ? "ended" : "started"} successfully`);
					playSuccessFeedback();
				}
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : "An error occurred");
			playErrorFeedback();
		} finally {
			setProcessing(false);
		}
	};

	const handleClockOut = async (logId: string) => {
		setProcessing(true);
		setError("");
		setSuccess("");
		updateActivity();

		try {
			if (!isOnline) {
				enqueue("clockOut", { logId });
				notify("Clock out queued for sync", "warning");
				setSuccess("Clock out queued for next sync");
				playFeedback();
			} else {
				const formData = new FormData();
				formData.set("logId", logId);

				const result = await clockOut({}, formData);

				if (!result || result.error) {
					setError(result?.error || "Clock out failed");
					playErrorFeedback();
				} else {
					setSuccess("Clocked out successfully");
					playSuccessFeedback();
				}
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : "An error occurred");
			playErrorFeedback();
		} finally {
			setProcessing(false);
		}
	};

	const playFeedback = () => {
		if (config.soundEnabled && typeof Audio !== "undefined") {
			try {
				const audio = new Audio("data:audio/wav;base64," + getSoundData("click"));
				audio.play().catch(() => {}); // Ignore errors for autoplay policies
			} catch (error) {
				console.warn("Audio playback failed:", error);
			}
		}
		if (config.vibrationEnabled && "vibrate" in navigator) {
			navigator.vibrate(25);
		}
	};

	const playSuccessFeedback = () => {
		if (config.soundEnabled && typeof Audio !== "undefined") {
			try {
				const audio = new Audio("data:audio/wav;base64," + getSoundData("success"));
				audio.play().catch(() => {});
			} catch (error) {
				console.warn("Audio playback failed:", error);
			}
		}
		if (config.vibrationEnabled && "vibrate" in navigator) {
			navigator.vibrate([50, 50, 50]);
		}
	};

	const playErrorFeedback = () => {
		if (config.soundEnabled && typeof Audio !== "undefined") {
			try {
				const audio = new Audio("data:audio/wav;base64," + getSoundData("error"));
				audio.play().catch(() => {});
			} catch (error) {
				console.warn("Audio playback failed:", error);
			}
		}
		if (config.vibrationEnabled && "vibrate" in navigator) {
			navigator.vibrate([100, 50, 100]);
		}
	};

	const getSoundData = (_type: "click" | "success" | "error"): string => {
		// Base64 encoded simple sound files (placeholder - in production, use actual sound files)
		return (
			"/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAIBAQIBAQICAgICAgMDAwMEBAYECwUHBwcICgkICgsLCwsIC/8BQECAwMDBAMDBAQEBAQEBAQICAQQECAgICwgICwgMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMD/2wBDAQMDAwMDBAwMDBAwMDAwMDAwMDBAwMDAwMDAwMDAwMDA" +
			"wMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMD/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAr/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/wA=="
		);
	};

	const formatDate = (date: Date) => {
		return date.toLocaleDateString("en-US", {
			weekday: "short",
			month: "short",
			day: "numeric",
			year: "numeric",
		});
	};

	const formatTime = (date: Date) => {
		return date.toLocaleTimeString("en-US", {
			hour: "2-digit",
			minute: "2-digit",
			hour12: true,
		});
	};

	const formatDuration = (start: Date, end?: Date) => {
		const now = end || new Date();
		const diff = now.getTime() - start.getTime();
		const hours = Math.floor(diff / (1000 * 60 * 60));
		const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
		const seconds = Math.floor((diff % (1000 * 60)) / 1000);

		if (end) {
			return `${hours}h ${minutes}m`;
		} else {
			return `${hours}h ${minutes}m ${seconds}s`;
		}
	};

	// Auto-clear messages
	React.useEffect(() => {
		if (error || success) {
			const timer = setTimeout(() => {
				setError("");
				setSuccess("");
			}, 5000);
			return () => clearTimeout(timer);
		}
	}, [error, success]);

	if (!isKioskMode) {
		return (
			<div className="min-h-screen flex items-center enter mode button">
				<TouchButton onPress={() => void 0} size="2xl">
					Start Kiosk Mode
				</TouchButton>
			</div>
		);
	}

	return (
		<div
			className={cn(
				"min-h-screen overscroll-none",
				config.theme === "dark" && "bg-gray-900 text-white",
				config.theme === "light" && "bg-gray-50 text-gray-900"
			)}
		>
			{/* Status bar */}
			<div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-2">
				<div className="flex items-center justify-between text-sm">
					<div className="flex items-center gap-4">
						<span className="font-bold uppercase">{device?.name || "Kiosk Mode"}</span>
						<span className="text-gray-600 dark:text-gray-400">
							{formatDate(new Date())} • {formatTime(new Date())}
						</span>
						{!isOnline && <span className="text-red-600 font-medium">OFFLINE</span>}
					</div>
					<div className="flex items-center gap-4">
						{batteryLevel !== undefined && (
							<div className="flex items-center gap-2">
								<div
									className={`w-12 h-6 border border-gray-300 dark:border-gray-600 rounded flex items-center overflow-hidden ${
										isCharging ? "bg-green-600" : batteryLevel > 20 ? "bg-gray-600" : "bg-red-600"
									}`}
								>
									<div
										className={`h-full ${isCharging ? "bg-green-400" : batteryLevel > 20 ? "bg-blue-400" : "bg-red-400"}`}
										style={{ width: `${batteryLevel}%` }}
									/>
								</div>
								<span className="text-xs">{Math.round(batteryLevel)}%</span>
							</div>
						)}
						{queue > 0 && (
							<button onClick={sync} disabled={isSyncing} className="text-yellow-600 font-medium">
								Sync {queue}
							</button>
						)}
					</div>
				</div>
			</div>

			{/* Main content */}
			<div className="container mx-auto px-4 py-6 max-w-4xl">
				{/* Method Selection */}
				{config.enableBarcodeScanner && (
					<MobileSection showBorder={false}>
						<MobileGrid cols={3} gap="md">
							<TouchButton
								onPress={() => {
									setMethod("barcode");
									playFeedback();
								}}
								variant={method === "barcode" ? "primary" : "outline"}
								size="xl"
							>
								<svg className="w-8 h-8 mb-2" fill="currentColor" viewBox="0 0 24 24">
									<path d="M3 3h18v18H3V3zm16 16V5H5v14h14z" />
									<path d="M7 7h10v2H7V7zm0 4h10v2H7v-2zm0 4h10v2H7v-2z" />
								</svg>
								<span>Scan Badge</span>
							</TouchButton>

							<TouchButton
								onPress={() => {
									setMethod("pin");
									playFeedback();
								}}
								variant={method === "pin" ? "primary" : "outline"}
								size="xl"
							>
								<svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
									/>
								</svg>
								<span>PIN Number</span>
							</TouchButton>

							<TouchButton
								onPress={() => {
									setMethod("select");
									playFeedback();
								}}
								variant={method === "select" ? "primary" : "outline"}
								size="xl"
							>
								<svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
									/>
								</svg>
								<span>Select Employee</span>
							</TouchButton>
						</MobileGrid>
					</MobileSection>
				)}

				{/* Clock In/Out Form */}
				<MobileCard padding="lg">
					{method === "pin" ? (
						<form onSubmit={handlePinSubmit} className="space-y-6">
							<TouchInput
								label="Enter PIN"
								type="password"
								value={pin}
								onChange={setPin}
								placeholder="4-6 digit PIN"
								maxLength={6}
								pattern="\d{4,6}"
								autoComplete="off"
								autoFocus
								icon={
									<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
							/>

							<TouchButton variant="primary" loading={processing} size="2xl" hapticFeedback>
								Clock In / Out
							</TouchButton>
						</form>
					) : method === "select" ? (
						<form onSubmit={handleSelectSubmit} className="space-y-6">
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

							<TouchButton variant="primary" loading={processing} size="2xl" hapticFeedback>
								Clock In
							</TouchButton>
						</form>
					) : (
						<div className="text-center py-12">
							<svg
								className="w-24 h-24 mx-auto mb-4 text-gray-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M3 3h18v18H3V3zm16 16V5H5v14h14z"
								/>
								<path d="M7 7h10v2H7V7zm0 4h10v2H7v-2zm0 4h10v2H7v-2z" />
							</svg>
							<h3 className="text-xl font-bold mb-2">Barcode Scanner</h3>
							<p className="text-gray-600 mb-6">Scan employee badge using the barcode scanner</p>
							<div className="animate-pulse">
								<div className="h-2 bg-gray-200 rounded-full w-64 mx-auto"></div>
								<div className="h-2 bg-gray-200 rounded-full w-48 mx-auto mt-2"></div>
							</div>
						</div>
					)}
				</MobileCard>

				{/* Active Sessions */}
				{activeLogs.length > 0 && (
					<MobileSection title="Active Sessions">
						<div className="space-y-4">
							{activeLogs.map((log) => {
								const isOnBreak = activeBreaks.some((b) => b.employeeId === log.employeeId);
								return (
									<MobileCard key={log.id} padding="lg" className="border-2 border-blue-200">
										<div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
											<div>
												<h3 className="font-bold text-xl">{log.employee.name}</h3>
												<p className="text-gray-600">{log.station?.name || "No station"}</p>
											</div>
											<div className="text-center">
												<div className="text-sm text-gray-500">Duration</div>
												<div className="font-mono text-2xl font-bold">
													{formatDuration(log.startTime)}
												</div>
											</div>
											<div className="flex items-center justify-center gap-3">
												<TouchButton
													onPress={() => handleBreak(log.employeeId, isOnBreak)}
													variant={isOnBreak ? "error" : "primary"}
													size="lg"
													disabled={processing}
													hapticFeedback
												>
													{isOnBreak ? "End Break" : "Start Break"}
												</TouchButton>
												<TouchButton
													onPress={() => handleClockOut(log.id)}
													variant="secondary"
													size="lg"
													disabled={processing}
													hapticFeedback
												>
													Clock Out
												</TouchButton>
											</div>
										</div>

										{isOnBreak && (
											<div className="mt-4">
												<Alert variant="warning" className="text-center">
													<div className="flex items-center justify-center gap-2">
														<svg
															className="w-6 h-6"
															fill="none"
															stroke="currentColor"
															viewBox="0 0 24 24"
														>
															<path
																strokeLinecap="round"
																strokeLinejoin="round"
																strokeWidth={2}
																d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
															/>
														</svg>
														<span className="font-medium">On Break</span>
													</div>
												</Alert>
											</div>
										)}
									</MobileCard>
								);
							})}
						</div>
					</MobileSection>
				)}

				{/* Messages */}
				{error && (
					<div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50">
						<Alert variant="error" className="max-w-md">
							<div className="flex items-center justify-center gap-2">
								<svg
									className="w-6 h-6 flex-shrink-0"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
								<span className="font-medium">{error}</span>
							</div>
						</Alert>
					</div>
				)}

				{success && (
					<div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50">
						<Alert variant="success" className="max-w-md">
							<div className="flex items-center justify-center gap-2">
								<svg
									className="w-6 h-6 flex-shrink-0"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M5 13l4 4L19 7"
									/>
								</svg>
								<span className="font-medium">{success}</span>
							</div>
						</Alert>
					</div>
				)}

				{/* Status indicators */}
				{!isOnline && (
					<div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-40">
						<Alert variant="warning" className="max-w-md">
							<div className="text-center">
								<div className="font-medium">Offline Mode</div>
								<div className="text-sm">
									Actions will be queued and synced when connection is restored
								</div>
							</div>
						</Alert>
					</div>
				)}

				{/* Battery warning */}
				<KioskBatteryWarning level={batteryLevel} isCharging={isCharging} />

				{/* System overlay for idle/error states */}
				<KioskOverlay show={session?.isIdle} type="idle" />
			</div>

			{/* Kiosk monitor overlay */}
			<KioskMonitor showExitButton={config.allowExit} />
		</div>
	);
}
