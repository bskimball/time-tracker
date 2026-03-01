"use client";

import React, { useCallback, useRef, useEffect, useState, useMemo } from "react";
import {
	Button,
	Alert,
	Card,
	CardHeader,
	CardTitle,
	CardBody,
	SimpleInput,
	SimpleSelect,
} from "@monorepo/design-system";
import {
	pinToggleClock as pinToggleAction,
	checkPinStatus as checkPinAction,
} from "../../time-clock/actions";
import { IndustrialSpinner } from "~/components/industrial-spinner";
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

interface KioskTimeClockProps {
	employees: Employee[];
	stations: Station[];
}

export function KioskTimeClock({ employees: _employees, stations }: KioskTimeClockProps) {
	const [kioskEnabled, setKioskEnabled] = useKioskMode();
	const apiKey =
		typeof window !== "undefined" ? window.localStorage.getItem("timeClock:apiKey") || "" : "";
	const { queue, enqueue, sync, status } = useOfflineActionQueue(apiKey);
	const pinInputRef = useRef<HTMLInputElement>(null);

	const [notifications, setNotifications] = useState<
		Array<{
			id: string;
			message: string;
			type: "success" | "error" | "warning";
		}>
	>([]);

	useEffect(() => {
		pinInputRef.current?.focus();
	}, []);

	useAutoRefresh(true, 30000);

	const [pin, setPin] = useState<string>("");
	const [stationId, setStationId] = useState<string>("");
	const [step, setStep] = useState<1 | 2>(1);
	const [isProcessing, startTransition] = React.useTransition();
	const [verifiedUser, setVerifiedUser] = useState<{
		employeeName: string;
		isClockedIn: boolean;
		lastStationId?: string | null;
		defaultStationId?: string | null;
	} | null>(null);
	const [errorMsg, setErrorMsg] = useState<string | null>(null);

	const handleCancel = useCallback(() => {
		setStep(1);
		setPin("");
		setStationId("");
		setVerifiedUser(null);
		setErrorMsg(null);
		setTimeout(() => pinInputRef.current?.focus(), 100);
	}, []);

	const handlePinSubmit = useCallback(
		(event: React.FormEvent<HTMLFormElement>) => {
			event.preventDefault();
			setErrorMsg(null);

			if (typeof navigator !== "undefined" && !navigator.onLine) {
				enqueue("pinToggle", { pin, stationId: null });
				const id = createId();
				window.setTimeout(() => {
					setNotifications((prev) => [
						...prev,
						{ id, message: `Clock action queued for sync`, type: "warning" },
					]);
				}, 0);
				setPin("");
				return;
			}

			startTransition(async () => {
				const formData = new FormData();
				formData.append("pin", pin);
				const result = (await checkPinAction(null, formData)) as any;
				if (result?.success) {
					setVerifiedUser({
						employeeName: result.employeeName,
						isClockedIn: result.isClockedIn,
						lastStationId: result.lastStationId,
						defaultStationId: result.defaultStationId,
					});
					const defaultStation = result.lastStationId || result.defaultStationId;
					if (defaultStation) {
						setStationId(defaultStation);
					}
					setStep(2);
				} else {
					setErrorMsg(result?.error || "Invalid PIN");
					setPin("");
					setTimeout(() => pinInputRef.current?.focus(), 100);
				}
			});
		},
		[pin, enqueue]
	);

	const handleToggleSubmit = useCallback(
		(event: React.FormEvent<HTMLFormElement>) => {
			event.preventDefault();
			setErrorMsg(null);

			if (typeof navigator !== "undefined" && !navigator.onLine) {
				enqueue("pinToggle", { pin, stationId });
				const id = createId();
				window.setTimeout(() => {
					setNotifications((prev) => [
						...prev,
						{ id, message: `Clock action queued for sync`, type: "warning" },
					]);
				}, 0);
				handleCancel();
				return;
			}

			startTransition(async () => {
				const formData = new FormData();
				formData.append("pin", pin);
				if (stationId) {
					formData.append("stationId", stationId);
				}
				const result = await pinToggleAction(null, formData);
				if (result?.success) {
					const id = createId();
					window.setTimeout(() => {
						setNotifications((prev) => [
							...prev,
							{
								id,
								message: result.message || "Clock action completed",
								type: "success",
							},
						]);
					}, 0);
					handleCancel();
				} else {
					setErrorMsg(result?.error || "An error occurred");
				}
			});
		},
		[pin, stationId, enqueue, handleCancel]
	);

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

	const handleExitKiosk = useCallback(() => {
		setKioskEnabled(false);
		window.location.href = "/floor";
	}, [setKioskEnabled]);

	const [showApiKey, setShowApiKey] = useState(false);

	return (
		<KioskContext.Provider value={contextValue}>
			<div className="flex flex-col gap-6 relative">
				<div className="flex justify-center relative z-10">
					<div className="w-full max-w-xl">
						<Card className="border-border shadow-sm">
							<CardHeader className="border-b border-border bg-muted/20">
								<div className="flex justify-between items-center relative z-10">
									<CardTitle className="text-2xl font-bold">Terminal Access</CardTitle>
									<div className="flex items-center gap-2 bg-background px-3 py-1.5 rounded-[2px] border border-border">
										<div
											className={`w-2 h-2 rounded-full ${queue.length === 0 ? "bg-green-500" : "bg-primary"} ${queue.length > 0 ? "animate-pulse" : ""}`}
										/>
										<span className="text-xs font-medium text-muted-foreground uppercase">
											{queue.length > 0 ? "Syncing" : "Ready"}
										</span>
									</div>
								</div>
							</CardHeader>
							<CardBody className="p-8">
								{errorMsg && (
									<Alert variant="error" className="mb-6">
										{errorMsg}
									</Alert>
								)}

								{step === 1 ? (
									<form onSubmit={handlePinSubmit} className="space-y-6">
										<div className="flex flex-col gap-2">
											<label className="text-sm font-bold text-foreground">Employee PIN</label>
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
												className="text-3xl text-center h-20 tracking-widest bg-background border-2 focus-visible:border-primary transition-all"
											/>
										</div>

										<Button
											type="submit"
											variant="primary"
											size="lg"
											className="w-full py-6 text-xl font-bold uppercase transition-all"
											disabled={isProcessing || !pin.trim()}
										>
											{isProcessing ? (
												<div className="flex items-center gap-3">
													<IndustrialSpinner size="sm" className="text-white" />
													<span>Checking...</span>
												</div>
											) : (
												"Next"
											)}
										</Button>
									</form>
								) : (
									<form onSubmit={handleToggleSubmit} className="space-y-6">
										<div className="text-center space-y-6">
											<h3 className="text-2xl font-bold text-foreground">
												Hello, {verifiedUser?.employeeName}
											</h3>
											{verifiedUser?.isClockedIn ? (
												<div className="bg-primary/10 border border-primary/20 p-4 rounded text-primary font-bold">
													Currently CLOCKED IN
												</div>
											) : (
												<div className="bg-muted/50 border border-border p-4 rounded font-bold text-muted-foreground">
													Currently CLOCKED OUT
												</div>
											)}

											{!verifiedUser?.isClockedIn && (
												<div className="flex flex-col gap-2 text-left">
													<label className="text-sm font-bold text-foreground">
														Select Station (Optional if using default)
													</label>
													<SimpleSelect
														name="stationId"
														value={stationId}
														onChange={(value) => setStationId((value as string) || "")}
														placeholder="Use Last Station..."
														options={stations.map((station) => ({
															value: station.id,
															label: station.name,
														}))}
														className="h-14 text-lg bg-background border-2"
													/>
												</div>
											)}

											<div className="flex gap-4">
												<Button
													type="button"
													variant="ghost"
													size="lg"
													className="flex-1 py-6 text-xl font-bold uppercase transition-all border border-border"
													onClick={handleCancel}
													disabled={isProcessing}
												>
													Cancel
												</Button>
												<Button
													type="submit"
													variant={verifiedUser?.isClockedIn ? "secondary" : "primary"}
													size="lg"
													className="flex-1 py-6 text-xl font-bold uppercase transition-all"
													disabled={isProcessing}
												>
													{isProcessing ? (
														<div className="flex items-center justify-center gap-3">
															<IndustrialSpinner size="sm" className="text-current" />
															<span>Processing...</span>
														</div>
													) : verifiedUser?.isClockedIn ? (
														"Clock Out"
													) : (
														"Clock In"
													)}
												</Button>
											</div>
										</div>
									</form>
								)}
							</CardBody>
						</Card>
					</div>
				</div>

				<div className="pt-6 mt-4 border-t border-border flex flex-wrap justify-between items-center gap-4 text-sm relative z-10">
					<div className="flex items-center gap-4">
						<div className="flex items-center gap-2 bg-muted/30 px-3 py-1.5 rounded-[2px] border border-border">
							<div
								className={`w-2 h-2 rounded-full ${status !== "syncing" ? "bg-green-500" : "bg-primary"} ${status === "syncing" ? "animate-pulse" : ""}`}
							/>
							<span className="text-xs font-medium uppercase">
								{status === "syncing"
									? "Syncing"
									: queue.length > 0
										? `${queue.length} Pending`
										: "Online"}
							</span>
						</div>
						{showApiKey && (
							<div className="flex items-center gap-2">
								<SimpleInput
									type="password"
									value={apiKey}
									onChange={(e) => {
										if (typeof window !== "undefined") {
											window.localStorage.setItem("timeClock:apiKey", e.target.value);
										}
									}}
									placeholder="API KEY"
									className="h-9 w-48 text-xs bg-background"
								/>
							</div>
						)}
					</div>

					<div className="flex items-center gap-3">
						<Button
							variant="ghost"
							size="sm"
							onPress={() => setShowApiKey(!showApiKey)}
							className="text-xs uppercase h-9 px-3 border border-border"
						>
							{showApiKey ? "Hide Config" : "Config"}
						</Button>
						<Button
							variant="ghost"
							size="sm"
							onPress={handleExitKiosk}
							className="text-xs uppercase h-9 px-3 text-destructive border border-destructive/20 hover:bg-destructive/10"
						>
							Exit Kiosk
						</Button>
					</div>
				</div>

				{notifications.map((notification) => (
					<div key={notification.id} className="fixed bottom-6 right-6 z-50">
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
								<span className="font-bold">{notification.message}</span>
							</div>
						</Alert>
					</div>
				))}
			</div>
		</KioskContext.Provider>
	);
}
