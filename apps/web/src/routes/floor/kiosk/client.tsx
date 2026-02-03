"use client";

import React, { useCallback, useRef, useEffect, useState, useMemo } from "react";
import { useActionState } from "react";
import {
	Button,
	Alert,
	Card,
	CardHeader,
	CardTitle,
	CardBody,
	SimpleInput,
	SimpleSelect,
	Badge,
	LedIndicator,
} from "@monorepo/design-system";
import { pinToggleClock as pinToggleAction } from "../../time-clock/actions";
import { useKioskMode, useAutoRefresh } from "~/components/time-tracking/hooks";
import { useOfflineActionQueue } from "~/components/time-tracking/offline-queue";
import { KioskContext, type KioskContextValue } from "~/components/time-tracking/context";

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
			<div className="flex flex-col gap-6 bg-noise relative">
				{/* Tactical grid overlay for the whole kiosk */}
				<div
					className="absolute -inset-10 bg-tactical-grid opacity-5 pointer-events-none"
					aria-hidden="true"
				/>

				<div className="grid lg:grid-cols-12 gap-6 items-start relative z-10">
					{/* Main Column: Clock In Form */}
					<div
						className={`transition-all duration-500 ${activeLogs.length > 0 ? "lg:col-span-7" : "lg:col-span-12"}`}
					>
						<Card className="bg-card/80 backdrop-blur-sm border-border shadow-2xl relative group overflow-hidden">
							{/* Scanner effect on hover */}
							<div className="absolute inset-0 z-0 pointer-events-none opacity-0 group-hover:opacity-10 transition-opacity">
								<div className="animate-scanner" />
							</div>

							<CardHeader className="border-b border-border/50 bg-muted/30">
								<div className="flex justify-between items-center relative z-10">
									<div className="flex flex-col">
										<span className="font-mono text-[10px] text-primary/50 tracking-widest uppercase mb-1">
											Terminal_01 // Auth_Req
										</span>
										<CardTitle className="text-3xl font-display font-bold tracking-tight">
											Clock In
										</CardTitle>
									</div>
									{/* Status Indicator inside Card Header */}
									<div className="flex items-center gap-3 bg-background/50 px-4 py-2 rounded-[2px] border border-border/50 shadow-inner">
										<LedIndicator
											active={queue.length === 0}
											className={queue.length > 0 ? "animate-pulse" : ""}
										/>
										<span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest font-bold">
											{queue.length > 0 ? "Sync_Active" : "System_Ready"}
										</span>
									</div>
								</div>
							</CardHeader>
							<CardBody className="p-6 md:p-8 relative z-10">
								{pinState?.error && (
									<Alert variant="error" className="mb-8 animate-shake">
										{pinState.error}
									</Alert>
								)}

								{pinState?.success && (
									<Alert variant="success" className="mb-8 animate-fade-in">
										{pinState.message}
									</Alert>
								)}

								<form action={pinFormAction} onSubmit={handlePinSubmit} className="space-y-8">
									<div className="flex flex-col gap-3">
										<label className="text-xs font-bold text-muted-foreground font-mono uppercase tracking-[0.2em] px-1">
											Input_Identity_PIN
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
											placeholder="••••••"
											autoComplete="off"
											spellCheck={false}
											maxLength={6}
											pattern="[0-9]{4,6}"
											inputMode="numeric"
											required
											className="text-4xl text-center font-mono h-24 tracking-[0.5em] bg-background/50 border-2 focus-visible:border-primary/50 transition-all shadow-inner"
										/>
									</div>

									<div className="flex flex-col gap-3">
										<label className="text-xs font-bold text-muted-foreground font-mono uppercase tracking-[0.2em] px-1">
											Assigned_Station
										</label>
										<SimpleSelect
											name="stationId"
											value={stationId}
											onChange={(value) => setStationId((value as string) || "")}
											placeholder="SELECT_STATION…"
											options={stations.map((station) => ({
												value: station.id,
												label: station.name,
											}))}
											className="h-16 text-xl font-heading font-bold bg-background/50 border-2"
										/>
									</div>

									<Button
										type="submit"
										variant="primary"
										size="lg"
										className="w-full py-6 text-2xl font-display font-black uppercase tracking-widest shadow-industrial hover:shadow-industrial-hover active:scale-[0.98] transition-all"
										disabled={isPinPending || !pin.trim() || !stationId}
									>
										{isPinPending ? (
											<div className="flex items-center gap-4">
												<span className="animate-spin h-6 w-6 border-4 border-white/30 border-t-white rounded-full"></span>
												<span>Processing…</span>
											</div>
										) : (
											"Execute Toggle"
										)}
									</Button>
								</form>
							</CardBody>
						</Card>
					</div>

					{/* Side Column: Active Sessions */}
					{activeLogs.length > 0 && (
						<div className="lg:col-span-5 space-y-6 animate-slide-in-right">
							<div className="flex items-center justify-between px-2">
								<div className="flex flex-col">
									<span className="font-mono text-[10px] text-secondary/50 tracking-widest uppercase mb-1">
										Live_Telemetry
									</span>
									<h3 className="font-display text-2xl font-bold text-foreground tracking-tight">
										Active Personnel
									</h3>
								</div>
								<Badge
									variant="primary"
									className="font-mono text-sm font-bold shadow-sm px-3 py-1"
								>
									{activeLogs.length.toString().padStart(2, "0")}
								</Badge>
							</div>
							<div className="space-y-4 max-h-[700px] overflow-y-auto pr-2 custom-scrollbar">
								{activeLogs.map((log) => (
									<Card
										key={log.id}
										className="bg-card/40 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all hover:shadow-industrial relative group overflow-hidden"
									>
										<CardBody>
											<div className="flex justify-between items-start">
												<div className="flex-1 min-w-0">
													<div className="text-lg font-bold text-foreground font-heading truncate group-hover:text-primary transition-colors">
														{log.employee.name}
													</div>
													<div className="flex items-center gap-2 mt-1">
														<span className="font-mono text-[10px] text-muted-foreground/60 uppercase tracking-tighter">
															Station:
														</span>
														<Badge
															variant="secondary"
															className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5"
														>
															{log.station?.name || "Unassigned"}
														</Badge>
													</div>
												</div>
												<div className="text-right flex flex-col items-end">
													<div className="text-lg font-data font-bold text-primary tabular-nums">
														{new Date(log.startTime).toLocaleTimeString([], {
															hour: "2-digit",
															minute: "2-digit",
														})}
													</div>
													<div className="text-[9px] font-mono text-muted-foreground/60 uppercase tracking-widest mt-1">
														Shift_Start
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
				<div className="pt-8 border-t border-border border-dashed flex flex-wrap justify-between items-center gap-6 text-sm text-muted-foreground relative z-10">
					<div className="flex items-center gap-6">
						<div className="flex items-center gap-3 bg-muted/20 px-4 py-2 rounded-[2px] border border-border/30 backdrop-blur-sm">
							<LedIndicator
								active={status !== "syncing"}
								className={status === "syncing" ? "animate-pulse" : ""}
							/>
							<span className="font-mono text-[10px] font-bold uppercase tracking-[0.1em]">
								{status === "syncing"
									? "Network_Sync_v2"
									: queue.length > 0
										? `${queue.length} PENDING_OPERATIONS`
										: "Link_Stable_100ms"}
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
									placeholder="SYS_KEY"
									className="h-10 w-48 text-xs font-mono bg-background/50"
								/>
							</div>
						)}
					</div>

					<div className="flex items-center gap-3">
						<Button
							variant="ghost"
							size="sm"
							onPress={() => setShowApiKey(!showApiKey)}
							className="text-[10px] font-mono tracking-widest uppercase h-10 px-4 border border-border/30 hover:bg-accent"
						>
							{showApiKey ? "Hide_Config" : "Sys_Config"}
						</Button>
						<Button
							variant="ghost"
							size="sm"
							onPress={handleExitKiosk}
							className="text-[10px] font-mono tracking-widest uppercase h-10 px-4 text-destructive border border-destructive/20 hover:bg-destructive/10"
						>
							Terminate_Kiosk
						</Button>
					</div>
				</div>

				{/* Notifications */}
				{notifications.map((notification) => (
					<div key={notification.id} className={`fixed bottom-8 right-8 z-50 animate-slide-up`}>
						<Alert
							variant={
								notification.type === "success"
									? "success"
									: notification.type === "error"
										? "error"
										: "warning"
							}
						>
							<div className="flex items-center gap-3">
								<span className="font-mono text-[10px] opacity-50 uppercase tracking-widest">
									Msg_{notification.id.slice(-4)}
								</span>
								<span className="font-bold font-heading uppercase tracking-tight">
									{notification.message}
								</span>
							</div>
						</Alert>
					</div>
				))}
			</div>
		</KioskContext.Provider>
	);
}
