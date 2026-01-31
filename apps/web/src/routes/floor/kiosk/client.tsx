"use client";

import React, { useCallback, useRef, useEffect, useState, useMemo } from "react";
import { useActionState } from "react";
import { Button } from "@monorepo/design-system";
import { Alert } from "@monorepo/design-system";
import { Card, CardHeader, CardTitle, CardBody } from "@monorepo/design-system";
import { SimpleInput } from "@monorepo/design-system";
import { SimpleSelect } from "@monorepo/design-system";
import { pinToggleClock as pinToggleAction } from "../../time-clock/actions";
import { useKioskMode, useAutoRefresh } from "../../time-clock/hooks";
import { useOfflineActionQueue } from "../../time-clock/offline-queue";
import { KioskContext, type KioskContextValue } from "../../time-clock/context";

const createId = () =>
	typeof crypto !== "undefined" && crypto.randomUUID
		? crypto.randomUUID()
		: Math.random().toString(36).slice(2);

type Employee = {
	id: string;
	name: string;
	email: string;
	pinHash?: string | null;
	lastStationId?: string | null;
	dailyHoursLimit?: number | null;
	weeklyHoursLimit?: number | null;
	createdAt: string;
};

type Station = {
	id: string;
	name: "PICKING" | "PACKING" | "FILLING" | "RECEIVING" | "SHIPPING" | "QUALITY" | "INVENTORY";
	createdAt: string;
};

type TimeLog = {
	id: string;
	employeeId: string;
	employee: Employee;
	stationId: string | null;
	station: Station | null;
	type: "WORK" | "BREAK";
	startTime: string;
	endTime: string | null;
	note: string | null;
	deletedAt: string | null;
	createdAt: string;
	updatedAt: string;
};

interface KioskTimeClockProps {
	employees: Employee[];
	stations: Station[];
	activeLogs: TimeLog[];
}

export function KioskTimeClock({
	employees: _employees,
	stations,
	activeLogs,
}: KioskTimeClockProps) {
	const [kioskEnabled, setKioskEnabled] = useKioskMode();
	const apiKey =
		typeof window !== "undefined" ? window.localStorage.getItem("timeClock:apiKey") || "" : "";
	const { queue, enqueue, sync, status } = useOfflineActionQueue(apiKey);
	const pinInputRef = useRef<HTMLInputElement>(null);

	// State for notifications
	const [notifications, setNotifications] = useState<
		Array<{
			id: string;
			message: string;
			type: "success" | "error" | "warning";
		}>
	>([]);

	// Auto-focus PIN input and auto-refresh
	useEffect(() => {
		pinInputRef.current?.focus();
	}, []);

	useAutoRefresh(true, 30000); // Refresh every 30 seconds in kiosk

	const [pinState, pinFormAction, isPinPending] = useActionState(pinToggleAction, null);

	const [pin, setPin] = useState<string>("");
	const [stationId, setStationId] = useState<string>("");

	// Handle offline mode
	const handleOfflineAction = useCallback(
		(event: React.FormEvent, action: string, data: Record<string, unknown>) => {
			if (typeof navigator !== "undefined" && !navigator.onLine) {
				event.preventDefault();
				enqueue(action as "pinToggle", data);
				const id = createId();
				window.setTimeout(() => {
					setNotifications((prev) => [
						...prev,
						{ id, message: `${action} queued for sync`, type: "warning" },
					]);
				}, 0);
				return true;
			}
			return false;
		},
		[enqueue]
	);

	// Handle PIN submit
	const handlePinSubmit = useCallback(
		(event: React.FormEvent<HTMLFormElement>) => {
			const shouldUseOffline = handleOfflineAction(event, "pinToggle", {
				pin: pin,
				stationId: stationId || null,
			});

			if (!shouldUseOffline && event.isTrusted) {
				event.currentTarget.submit();
			}
		},
		[handleOfflineAction, pin, stationId]
	);

	// Notifications
	useEffect(() => {
		if (pinState?.success) {
			const id = createId();
			window.setTimeout(() => {
				setNotifications((prev) => [
					...prev,
					{
						id,
						message: pinState.message || "Clock action completed",
						type: "success",
					},
				]);
			}, 0);
			window.setTimeout(() => setPin(""), 0);
			window.setTimeout(() => setStationId(""), 0);
			pinInputRef.current?.focus();
		}
		if (pinState?.error) {
			const id = createId();
			window.setTimeout(() => {
				setNotifications((prev) => [...prev, { id, message: pinState.error!, type: "error" }]);
			}, 0);
		}
	}, [pinState]);

	// Auto-remove notifications
	useEffect(() => {
		if (notifications.length === 0) return;

		const timer = window.setTimeout(() => {
			setNotifications((prev) =>
				prev.filter((n) => {
					const age = Date.now() - parseInt(n.id);
					return age < 3000;
				})
			);
		}, 3000);
		return () => window.clearTimeout(timer);
	}, [notifications]);

	const contextValue = useMemo<KioskContextValue>(
		() => ({
			kioskEnabled,
			setKioskEnabled,
			focusPinInput: () => pinInputRef.current?.focus(),
			actionQueueSize: queue.length,
			isSyncing: status === "syncing",
			syncOfflineActions: sync,
			enqueueOfflineAction: enqueue,
			apiKey,
			saveApiKey: (value: string) => {
				if (typeof window !== "undefined") {
					window.localStorage.setItem("timeClock:apiKey", value);
				}
			},
		}),
		[kioskEnabled, setKioskEnabled, queue.length, status, sync, enqueue, apiKey]
	);

	// Handle exit kiosk mode
	const handleExitKiosk = useCallback(() => {
		setKioskEnabled(false);
		window.location.href = "/floor";
	}, [setKioskEnabled]);

	const [showApiKey, setShowApiKey] = useState(false);

	return (
		<KioskContext.Provider value={contextValue}>
			<div className="flex flex-col gap-8">
				<div className="grid lg:grid-cols-12 gap-8 items-start">
					{/* Main Column: Clock In Form */}
					<div
						className={`transition-all duration-500 ${activeLogs.length > 0 ? "lg:col-span-7" : "lg:col-span-12"}`}
					>
						<Card className="bg-card border-border shadow-md">
							<CardHeader>
								<div className="flex justify-between items-center">
									<CardTitle className="text-2xl font-display">Clock In</CardTitle>
									{/* Status Indicator inside Card Header */}
									<div className="flex items-center gap-2">
										<div
											className={`h-2.5 w-2.5 rounded-full ${queue.length > 0 ? "bg-yellow-500 animate-pulse" : "bg-green-500"}`}
										/>
										<span className="text-xs font-data text-muted-foreground uppercase">
											{queue.length > 0 ? "Syncing" : "Ready"}
										</span>
									</div>
								</div>
							</CardHeader>
							<CardBody>
								{pinState?.error && (
									<Alert variant="error" className="mb-6">
										{pinState.error}
									</Alert>
								)}

								{pinState?.success && (
									<Alert variant="success" className="mb-6">
										{pinState.message}
									</Alert>
								)}

								<form action={pinFormAction} onSubmit={handlePinSubmit} className="space-y-6">
									<div className="flex flex-col gap-2">
										<label className="text-sm font-medium text-foreground font-heading">
											Enter Your PIN
										</label>
										<SimpleInput
											type="password"
											name="pin"
											ref={pinInputRef}
											value={pin}
											onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
												const value = e.target.value.replace(/\D/g, "");
												if (value.length <= 6) {
													setPin(value);
												}
											}}
											placeholder="Enter your 4-6 digit PIN…"
											autoComplete="off"
											spellCheck={false}
											maxLength={6}
											pattern="[0-9]{4,6}"
											inputMode="numeric"
											required
											className="text-lg text-center font-mono h-14 text-2xl tracking-widest"
										/>
									</div>

									<div className="flex flex-col gap-2">
										<label className="text-sm font-medium text-foreground font-heading">
											Work Station
										</label>
										<SimpleSelect
											name="stationId"
											value={stationId}
											onChange={(value) => setStationId((value as string) || "")}
											placeholder="Select station…"
											options={stations.map((station) => ({
												value: station.id,
												label: station.name,
											}))}
											className="h-14 text-lg"
										/>
									</div>

									<Button
										type="submit"
										variant="primary"
										size="lg"
										className="w-full py-6 text-xl font-heading uppercase tracking-wide"
										disabled={isPinPending || !pin.trim() || !stationId}
									>
										{isPinPending ? (
											<>
												<span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></span>
												Processing…
											</>
										) : (
											"Clock In / Out"
										)}
									</Button>
								</form>
							</CardBody>
						</Card>
					</div>

					{/* Side Column: Active Sessions */}
					{activeLogs.length > 0 && (
						<div className="lg:col-span-5 space-y-4 animate-slide-in-right">
							<div className="flex items-center justify-between mb-2">
								<h3 className="font-heading text-lg text-muted-foreground uppercase tracking-wider">
									Active Shifts
								</h3>
								<span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-xs font-data font-bold">
									{activeLogs.length}
								</span>
							</div>
							<div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
								{activeLogs.map((log) => (
									<Card
										key={log.id}
										className="bg-muted/30 border-dashed border-border hover:border-primary/50 transition-colors"
									>
										<CardBody className="p-4">
											<div className="flex justify-between items-start">
												<div>
													<div className="text-base font-semibold text-foreground font-display truncate max-w-[150px]">
														{log.employee.name}
													</div>
													<div className="text-muted-foreground font-mono text-xs mt-1 truncate">
														{log.station?.name || "No station"}
													</div>
												</div>
												<div className="text-right">
													<div className="text-sm font-data font-medium text-primary">
														{new Date(log.startTime).toLocaleTimeString([], {
															hour: "2-digit",
															minute: "2-digit",
														})}
													</div>
													<div className="text-[10px] text-muted-foreground uppercase mt-1">
														Started
													</div>
												</div>
											</div>
										</CardBody>
									</Card>
								))}
							</div>
						</div>
					)}
				</div>

				{/* Utility Footer Bar */}
				<div className="pt-8 border-t border-border border-dashed flex flex-wrap justify-between items-center gap-4 text-sm text-muted-foreground">
					<div className="flex items-center gap-4">
						<div className="flex items-center gap-2">
							<div
								className={`h-2 w-2 rounded-full ${status === "syncing" ? "bg-blue-500 animate-pulse" : queue.length > 0 ? "bg-yellow-500" : "bg-green-500"}`}
							/>
							<span className="font-data text-xs">
								{status === "syncing"
									? "Syncing…"
									: queue.length > 0
										? `${queue.length} Offline Actions`
										: "Online"}
							</span>
						</div>
						{showApiKey && (
							<div className="flex items-center gap-2 animate-fade-in">
								<SimpleInput
									type="password"
									value={apiKey}
									onChange={(e) => {
										if (typeof window !== "undefined") {
											window.localStorage.setItem("timeClock:apiKey", e.target.value);
										}
									}}
									placeholder="API Key"
									className="h-8 w-32 text-xs"
								/>
							</div>
						)}
					</div>

					<div className="flex items-center gap-2">
						<Button
							variant="ghost"
							size="sm"
							onPress={() => setShowApiKey(!showApiKey)}
							className="text-xs h-8"
						>
							{showApiKey ? "Hide Config" : "Config"}
						</Button>
						<Button
							variant="ghost"
							size="sm"
							onPress={handleExitKiosk}
							className="text-xs h-8 text-destructive hover:bg-destructive/10"
						>
							Exit Kiosk
						</Button>
					</div>
				</div>

				{/* Notifications */}
				{notifications.map((notification) => (
					<div key={notification.id} className={`fixed bottom-4 right-4 z-50 animate-slide-up`}>
						<Alert
							variant={
								notification.type === "success"
									? "success"
									: notification.type === "error"
										? "error"
										: "warning"
							}
						>
							{notification.message}
						</Alert>
					</div>
				))}
			</div>
		</KioskContext.Provider>
	);
}
