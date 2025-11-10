"use client";

import React, { useCallback, useRef, useEffect, useState, useMemo } from "react";
import { useActionState } from "react";
import { Button } from "~/components/ds/button";
import { Alert } from "~/components/ds/alert";
import { Card, CardHeader, CardTitle, CardBody } from "~/components/ds/card";
import { pinToggleClock as pinToggleAction } from "../actions";
import { useKioskMode, useAutoRefresh } from "../hooks";
import { useOfflineActionQueue } from "../offline-queue";
import { KioskContext, type KioskContextValue } from "../context";

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
	const { queue, enqueue, sync, status } = useOfflineActionQueue();
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

	// Employee will be determined after PIN validation through the server action

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
			apiKey: "",
			saveApiKey: () => {},
		}),
		[kioskEnabled, setKioskEnabled, queue.length, status, sync, enqueue]
	);

	// Handle exit kiosk mode
	const handleExitKiosk = useCallback(() => {
		setKioskEnabled(false);
		window.location.href = "/time-clock";
	}, [setKioskEnabled]);

	return (
		<KioskContext.Provider value={contextValue}>
			<div className="min-h-screen bg-background p-4">
				{/* Header */}
				<div className="max-w-4xl mx-auto mb-8">
					<Card>
						<CardBody className="text-center">
							<h1 className="text-4xl font-bold text-primary mb-2">Time Clock Kiosk</h1>
							<div className="flex justify-center items-center gap-4 text-sm mb-4">
								<span
									className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${queue.length > 0 ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"}`}
								>
									{queue.length > 0 ? `${queue.length} pending` : "Connected"}
								</span>
								{status === "syncing" && (
									<span className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></span>
								)}
								<span className="text-foreground">Auto-refresh every 30s</span>
							</div>
							<div className="flex justify-center">
								<Button onClick={handleExitKiosk} variant="outline" size="sm">
									Exit Kiosk Mode
								</Button>
							</div>
						</CardBody>
					</Card>
				</div>

				{/* Active Sessions */}
				{activeLogs.length > 0 && (
					<div className="max-w-4xl mx-auto mb-8">
						<Card>
							<CardHeader>
								<CardTitle>Active Sessions</CardTitle>
							</CardHeader>
							<CardBody>
								<div className="grid gap-4">
									{activeLogs.map((log) => (
										<div key={log.id} className="bg-accent rounded-lg shadow p-4">
											<div className="flex justify-between items-center">
												<div className="flex-1">
													<div className="text-lg font-semibold text-foreground">
														{log.employee.name}
													</div>
													<div className="text-muted-foreground">
														{log.station?.name || "No station"} • Started{" "}
														{new Date(log.startTime).toLocaleTimeString()}
													</div>
												</div>
												<span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
													On Shift
												</span>
											</div>
										</div>
									))}
								</div>
							</CardBody>
						</Card>
					</div>
				)}

				{/* Clock In Form */}
				<div className="max-w-xl mx-auto">
					<Card>
						<CardHeader>
							<CardTitle className="text-center text-2xl">Clock In</CardTitle>
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
								<div className="flex flex-col gap-1">
									<label className="text-sm font-medium text-foreground">Enter Your PIN</label>
									<input
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
										placeholder="Enter your 4-6 digit PIN"
										autoComplete="off"
										spellCheck="false"
										maxLength={6}
										pattern="[0-9]{4,6}"
										inputMode="numeric"
										required
										className="px-3 py-3 border rounded text-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
									/>
								</div>

								<div className="flex flex-col gap-1">
									<label className="text-sm font-medium text-foreground">Work Station</label>
									<select
										name="stationId"
										value={stationId}
										onChange={(e) => setStationId(e.target.value)}
										className="px-3 py-3 border rounded text-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
										required
									>
										<option value="">Select station</option>
										{stations.map((station) => (
											<option key={station.id} value={station.id}>
												{station.name}
											</option>
										))}
									</select>
								</div>

								<Button
									type="submit"
									variant="primary"
									size="lg"
									className="w-full py-4 text-lg"
									disabled={isPinPending || !pin.trim() || !stationId}
								>
									{isPinPending ? (
										<>
											<span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></span>
											Processing...
										</>
									) : (
										"Clock In/Out"
									)}
								</Button>
							</form>
						</CardBody>
					</Card>
				</div>

				{/* Notifications */}
				{notifications.map((notification) => (
					<div key={notification.id} className={`fixed bottom-4 right-4 z-50`}>
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
