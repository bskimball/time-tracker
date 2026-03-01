"use client";

import React, {
	Suspense,
	useActionState,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
	use,
	useOptimistic,
} from "react";
import { useFormStatus } from "react-dom";
import { Dialog, DialogTrigger, Modal, ModalOverlay } from "react-aria-components";
import type { Employee, Station } from "@prisma/client";
import {
	clockIn,
	clockOut,
	startBreak,
	endBreak,
	updateTimeLog,
	deleteTimeLog,
	pinToggleClock,
} from "~/routes/time-clock/actions";
import type { ClockActionState } from "~/routes/time-clock/actions";
import { cn } from "~/lib/cn";
import {
	Button,
	Alert,
	SimpleInput,
	Input,
	Select,
	Form,
	Card,
	CardHeader,
	CardTitle,
	CardBody,
} from "@monorepo/design-system";
import { KioskContext, useKioskContext, type KioskContextValue } from "./context";
import { useAutoRefresh, useKioskMode } from "./hooks";
import { notify, subscribe } from "./notifications";
import { useOfflineActionQueue } from "./offline-queue";
import type { OfflineEndpoint } from "./offline-queue";
import type { TaskAssignmentMode } from "~/lib/task-assignment-permissions";
import {
	canSelfAssign,
	endSelfTaskAction,
	isSelfAssignRequired,
	startSelfTaskAction,
	switchSelfTaskAction,
	type ActiveTaskInfo,
	type TaskOption,
} from "./self-task-actions";
import {
	calculateNetHours,
	isOvertime,
	getWeekBounds,
	DEFAULT_DAILY_LIMIT,
} from "~/lib/domain/time-tracking";
import type { TimeLogWithRelations } from "~/routes/time-clock/route";
import { intervalToDuration, formatDuration as formatDurationFn } from "date-fns";
import { IndustrialSpinner } from "~/components/industrial-spinner";

const createId = () =>
	typeof crypto !== "undefined" && crypto.randomUUID
		? crypto.randomUUID()
		: Math.random().toString(36).slice(2);

function ClockInForm({
	employees,
	stations,
	pinInputRef,
	onOptimisticClockIn,
}: {
	employees: Employee[];
	stations: Station[];
	pinInputRef: React.RefObject<HTMLInputElement | null>;
	onOptimisticClockIn: (log: TimeLogWithRelations) => void;
}) {
	const {
		kioskEnabled,
		focusPinInput,
		actionQueueSize,
		isSyncing,
		syncOfflineActions,
		enqueueOfflineAction,
		apiKey,
		saveApiKey,
	} = useKioskContext();
	const [method, setMethod] = useState<"pin" | "select">("pin");
	const [pin, setPin] = useState("");
	const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
	const [selectedStationId, setSelectedStationId] = useState("");

	const [pinState, pinFormAction] = useActionState<ClockActionState, FormData>(
		pinToggleClock,
		null
	);
	const [selectState, selectFormAction] = useActionState<ClockActionState, FormData>(clockIn, null);
	const [isApiKeyDialogOpen, setIsApiKeyDialogOpen] = useState(false);
	const [draftApiKey, setDraftApiKey] = useState(apiKey);

	const handleOfflineSubmit = useCallback(
		(
			event: React.FormEvent<HTMLFormElement>,
			endpoint: OfflineEndpoint,
			payload: Record<string, unknown>,
			message: string
		) => {
			if (typeof navigator !== "undefined" && !navigator.onLine) {
				event.preventDefault();
				enqueueOfflineAction(endpoint, payload);
				notify(message, "warning");
				return true;
			}
			return false;
		},
		[enqueueOfflineAction]
	);

	const handlePinSubmit = useCallback(
		(event: React.FormEvent<HTMLFormElement>) => {
			// We can't easily do optimistic UI for PIN because we don't know WHO the employee is
			// without a server roundtrip. So we just let the action run.
			const formData = new FormData(event.currentTarget);
			const pinValue = (formData.get("pin") as string | null)?.trim();
			const stationValue = (formData.get("stationId") as string | null) || "";
			if (!pinValue) {
				return;
			}
			const queued = handleOfflineSubmit(
				event,
				"pinToggle",
				{
					pin: pinValue,
					stationId: stationValue || null,
				},
				"Clock action queued for sync"
			);
			if (queued) {
				setPin("");
				focusPinInput();
			}
		},
		[focusPinInput, handleOfflineSubmit]
	);

	const handleSelectSubmit = useCallback(
		(event: React.FormEvent<HTMLFormElement>) => {
			const formData = new FormData(event.currentTarget);
			const employeeId = (formData.get("employeeId") as string | null)?.trim();
			const stationId = (formData.get("stationId") as string | null)?.trim();

			if (!employeeId || !stationId) {
				return;
			}

			// OPTIMISTIC UPDATE
			const employee = employees.find((e) => e.id === employeeId);
			const station = stations.find((s) => s.id === stationId);

			if (employee && station) {
				onOptimisticClockIn({
					id: createId(),
					employeeId,
					stationId,
					type: "WORK",
					startTime: new Date(),
					endTime: null,
					note: null,
					deletedAt: null,
					correctedBy: null,
					taskId: null,
					clockMethod: "MANUAL",
					createdAt: new Date(),
					updatedAt: new Date(),
					Employee: employee,
					Station: station,
				});
			}

			const queued = handleOfflineSubmit(
				event,
				"clockIn",
				{ employeeId, stationId },
				"Clock in queued for sync"
			);
			if (queued) {
				event.currentTarget.reset();
			}
		},
		[handleOfflineSubmit, employees, stations, onOptimisticClockIn]
	);

	const handleApiDialogOpenChange = useCallback(
		(isOpen: boolean) => {
			setIsApiKeyDialogOpen(isOpen);
			if (isOpen) {
				setDraftApiKey(apiKey);
			}
		},
		[apiKey]
	);

	const handleSaveApiKey = useCallback(() => {
		saveApiKey(draftApiKey.trim());
		setIsApiKeyDialogOpen(false);
	}, [draftApiKey, saveApiKey]);

	useEffect(() => {
		if (pinState?.success) {
			// eslint-disable-next-line react-hooks/set-state-in-effect
			setPin("");
			focusPinInput();
			notify(pinState.message ?? "PIN action completed", "success");
		}
		if (pinState?.error) {
			notify(pinState.error, "error");
		}
	}, [pinState, focusPinInput]);

	useEffect(() => {
		if (kioskEnabled) {
			focusPinInput();
		}
	}, [kioskEnabled, focusPinInput]);

	useEffect(() => {
		if (selectState?.success) {
			notify("Clocked in successfully", "success");
		}
		if (selectState?.error) {
			notify(selectState.error, "error");
		}
	}, [selectState]);

	return (
		<Card className="flex flex-col">
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<span className="w-2 h-2 rounded-full bg-primary" />
					Access Terminal
				</CardTitle>
			</CardHeader>
			<CardBody className="flex-1 flex flex-col gap-6">
				<div className="grid gap-4 md:grid-cols-2">
					<div className="bg-muted/50 p-3 rounded-[2px] border border-border/50 flex items-center justify-between gap-3">
						<div className="flex items-center gap-4 text-xs text-muted-foreground">
							<span className="flex items-center gap-2">
								<span>Mode</span>
								<span
									className={
										kioskEnabled ? "text-primary font-medium" : "font-medium text-foreground"
									}
								>
									{kioskEnabled ? "Kiosk" : "Standard"}
								</span>
							</span>
							<span className="flex items-center gap-1.5">
								<span
									className={cn(
										"w-2 h-2 rounded-full",
										actionQueueSize > 0 ? "bg-amber-500" : "bg-emerald-500"
									)}
								/>
								{actionQueueSize} queued
							</span>
						</div>
						<Button
							type="button"
							variant={actionQueueSize > 0 ? "secondary" : "ghost"}
							size="sm"
							onPress={syncOfflineActions}
							disabled={isSyncing || actionQueueSize === 0}
							className={actionQueueSize === 0 ? "text-muted-foreground" : undefined}
						>
							{isSyncing ? "Syncing..." : "Force Sync"}
						</Button>
					</div>

					<div className="bg-muted/50 p-3 rounded-[2px] border border-border/50 flex items-center justify-between gap-3">
						<div className="flex flex-col">
							<span className="text-xs text-muted-foreground">Device Auth</span>
							<span className="text-sm font-mono text-foreground">
								{apiKey ? `••••••••${apiKey.slice(-4)}` : "No token configured"}
							</span>
						</div>
						<DialogTrigger isOpen={isApiKeyDialogOpen} onOpenChange={handleApiDialogOpenChange}>
							<Button type="button" variant="outline" size="sm">
								{apiKey ? "Manage Token" : "Add Token"}
							</Button>
							<ModalOverlay className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
								<Modal className="bg-card border border-border rounded-[2px] shadow-xl w-full max-w-md mx-4">
									<Dialog className="outline-none p-5 space-y-4">
										<div className="space-y-1">
											<h3 className="text-base font-semibold text-foreground">Device Auth Token</h3>
											<p className="text-sm text-muted-foreground">
												Used for online sync and secure clock actions.
											</p>
										</div>
										<SimpleInput
											type="text"
											value={draftApiKey}
											onChange={(e) => setDraftApiKey(e.target.value)}
											placeholder="Enter token"
											autoFocus
										/>
										<div className="flex justify-between items-center pt-2">
											<Button
												type="button"
												variant="ghost"
												size="sm"
												onPress={() => setDraftApiKey("")}
											>
												Clear
											</Button>
											<div className="flex gap-2">
												<Button
													type="button"
													variant="ghost"
													size="sm"
													onPress={() => setIsApiKeyDialogOpen(false)}
												>
													Cancel
												</Button>
												<Button
													type="button"
													variant="secondary"
													size="sm"
													onPress={handleSaveApiKey}
												>
													Save Token
												</Button>
											</div>
										</div>
									</Dialog>
								</Modal>
							</ModalOverlay>
						</DialogTrigger>
					</div>
				</div>

				<div className="flex gap-1 w-full p-1 bg-muted/30 rounded-[2px] border border-border/50">
					<button
						type="button"
						className={cn(
							"flex-1 text-sm font-medium py-2 rounded-[2px] transition-all duration-200",
							method === "pin"
								? "bg-background text-foreground shadow-sm border border-border/50"
								: "hover:bg-muted/50 text-muted-foreground"
						)}
						onClick={() => setMethod("pin")}
					>
						PIN Entry
					</button>
					<button
						type="button"
						className={cn(
							"flex-1 text-sm font-medium py-2 rounded-[2px] transition-all duration-200",
							method === "select"
								? "bg-background text-foreground shadow-sm border border-border/50"
								: "hover:bg-muted/50 text-muted-foreground"
						)}
						onClick={() => setMethod("select")}
					>
						Manual Select
					</button>
				</div>

				{method === "pin" ? (
					<Form
						action={pinFormAction}
						onSubmit={handlePinSubmit}
						className="flex flex-col flex-1 gap-6"
					>
						<div className="grid gap-4 md:grid-cols-2">
							<div className="flex flex-col gap-2">
								<label className="text-sm font-medium text-foreground flex justify-between">
									<span>Security PIN</span>
									<span className="text-muted-foreground font-normal">4-6 digits</span>
								</label>
								<div className="relative">
									<Input
										type="password"
										name="pin"
										value={pin}
										ref={pinInputRef}
										onChange={(e) => {
											const value = e.target.value.replace(/\D/g, "");
											if (value.length <= 6) {
												setPin(value);
											}
										}}
										placeholder="••••"
										className="h-10 text-center text-base tracking-[0.35em]"
										inputMode="numeric"
										autoFocus={kioskEnabled}
										maxLength={6}
										pattern="\d{4,6}"
										required
									/>
								</div>
							</div>

							<div className="flex flex-col gap-2">
								<label className="text-sm font-medium text-foreground">Location Override</label>
								<Select
									name="stationId"
									options={[
										{ value: "", label: "Auto-detect (Last known)" },
										...stations.map((st) => ({ value: st.id, label: st.name })),
									]}
								/>
							</div>
						</div>

						<div className="mt-auto pt-5 border-t border-border flex justify-end">
							<PinSubmitButton />
						</div>

						{pinState?.error && (
							<Alert variant="error" className="relative mt-4 text-sm">
								{pinState.error}
							</Alert>
						)}
						{pinState?.success && pinState?.message && (
							<Alert variant="success" className="relative mt-4 text-sm">
								{pinState.message}
							</Alert>
						)}
					</Form>
				) : (
					<Form
						action={selectFormAction}
						onSubmit={handleSelectSubmit}
						className="flex flex-col flex-1 gap-6"
					>
						<div className="grid gap-4 md:grid-cols-2">
							<div className="flex flex-col gap-2">
								<label className="text-sm font-medium text-foreground">Personnel Roster</label>
								<Select
									name="employeeId"
									options={[
										{ value: "", label: "-- Select Personnel --" },
										...employees.map((emp) => ({ value: emp.id, label: emp.name })),
									]}
									value={selectedEmployeeId}
									onChange={setSelectedEmployeeId}
									isDisabled={employees.length === 0}
								/>
							</div>

							<div className="flex flex-col gap-2">
								<label className="text-sm font-medium text-foreground">Assigned Station</label>
								<Select
									name="stationId"
									options={[
										{ value: "", label: "-- Select Station --" },
										...stations.map((st) => ({ value: st.id, label: st.name })),
									]}
									value={selectedStationId}
									onChange={setSelectedStationId}
									isDisabled={stations.length === 0}
								/>
							</div>
						</div>

						<div className="mt-auto pt-5 border-t border-border flex justify-end">
							<ClockInButton />
						</div>

						{selectState?.error && (
							<Alert variant="error" className="relative mt-4 text-sm">
								{selectState.error}
							</Alert>
						)}
						{selectState?.success && (
							<Alert variant="success" className="relative mt-4 text-sm">
								Clock In Successful
							</Alert>
						)}
					</Form>
				)}
			</CardBody>
		</Card>
	);
}

function ClockInButton() {
	const { pending } = useFormStatus();
	return (
		<Button
			type="submit"
			variant="primary"
			disabled={pending}
			className="w-full md:w-auto md:min-w-44"
		>
			{pending ? "Clocking In..." : "Clock In"}
		</Button>
	);
}

function PinSubmitButton() {
	const { pending } = useFormStatus();
	return (
		<Button
			type="submit"
			variant="primary"
			disabled={pending}
			className="w-full md:w-auto md:min-w-44"
		>
			{pending ? "Processing..." : "Clock In/Out"}
		</Button>
	);
}

function ElapsedTime({ startTime }: { startTime: Date }) {
	const [elapsed, setElapsed] = useState("");

	useEffect(() => {
		const updateElapsed = () => {
			const start = new Date(startTime);
			const now = new Date();
			const duration = intervalToDuration({ start, end: now });

			const hours = duration.hours || 0;
			const minutes = duration.minutes || 0;
			const seconds = duration.seconds || 0;

			setElapsed(`${hours}h ${minutes}m ${seconds}s`);
		};

		updateElapsed();
		const interval = setInterval(updateElapsed, 1000);
		return () => clearInterval(interval);
	}, [startTime]);

	return <span className="text-xs font-mono text-primary">{elapsed}</span>;
}

function BreakButton({ employeeId, onBreak }: { employeeId: string; onBreak: boolean }) {
	const { kioskEnabled, enqueueOfflineAction } = useKioskContext();
	const [state, formAction] = useActionState<ClockActionState, FormData>(
		onBreak ? endBreak : startBreak,
		null
	);
	const { pending } = useFormStatus();

	const handleSubmit = useCallback(
		(event: React.FormEvent<HTMLFormElement>) => {
			if (typeof navigator !== "undefined" && !navigator.onLine) {
				event.preventDefault();
				enqueueOfflineAction(onBreak ? "endBreak" : "startBreak", {
					employeeId,
				});
				notify(onBreak ? "Break end queued for sync" : "Break start queued for sync", "warning");
			}
		},
		[enqueueOfflineAction, employeeId, onBreak]
	);

	useEffect(() => {
		if (state?.success) {
			notify(onBreak ? "Break ended" : "Break started", "success");
		}
		if (state?.error) {
			notify(state.error, "error");
		}
	}, [state, onBreak]);

	return (
		<form action={formAction} className="inline" onSubmit={handleSubmit}>
			<input type="hidden" name="employeeId" value={employeeId} />
			<Button
				type="submit"
				variant={onBreak ? "error" : "primary"}
				size={kioskEnabled ? "lg" : "md"}
				disabled={pending}
				className="w-full"
			>
				{pending ? "..." : onBreak ? "End Break" : "Start Break"}
			</Button>
			{state?.error && <span className="text-xs text-red-600 mt-1 block">{state.error}</span>}
		</form>
	);
}

function WorkerTaskControls({
	employeeId,
	activeTask,
	assignmentMode,
	taskOptions,
}: {
	employeeId: string;
	activeTask?: ActiveTaskInfo;
	assignmentMode: TaskAssignmentMode;
	taskOptions: TaskOption[];
}) {
	const [selectedTaskId, setSelectedTaskId] = useState("");
	const [startState, startFormAction, isStartPending] = useActionState<ClockActionState, FormData>(
		startSelfTaskAction,
		null
	);
	const [switchState, switchFormAction, isSwitchPending] = useActionState<
		ClockActionState,
		FormData
	>(switchSelfTaskAction, null);
	const [endState, endFormAction, isEndPending] = useActionState<ClockActionState, FormData>(
		endSelfTaskAction,
		null
	);

	const isPending = isStartPending || isSwitchPending || isEndPending;
	const canAssignTasks = canSelfAssign(assignmentMode);
	const requiresTask = isSelfAssignRequired(assignmentMode);
	const resetSelectedTask = useCallback(() => {
		setSelectedTaskId("");
	}, []);

	useEffect(() => {
		if (startState?.success) {
			notify(startState.message ?? "Task started", "success");
		}
		if (startState?.error) {
			notify(startState.error, "error");
		}
	}, [startState]);

	useEffect(() => {
		if (switchState?.success) {
			notify(switchState.message ?? "Task switched", "success");
		}
		if (switchState?.error) {
			notify(switchState.error, "error");
		}
	}, [switchState]);

	useEffect(() => {
		if (endState?.success) {
			notify(endState.message ?? "Task ended", "success");
		}
		if (endState?.error) {
			notify(endState.error, "error");
		}
	}, [endState]);

	if (!canAssignTasks) {
		return null;
	}

	return (
		<div className="mt-4 border-t border-border pt-4 space-y-3">
			<div className="flex items-center gap-2">
				<p className="text-xs font-medium text-muted-foreground">Sub-Routine / Task</p>
			</div>

			{requiresTask && !activeTask && (
				<div className="bg-amber-500/10 border-l-2 border-amber-500 p-3 rounded-r-md">
					<p className="text-sm text-amber-600 font-medium">Task Assignment Required</p>
				</div>
			)}

			<div className="flex flex-col gap-2">
				<Select
					name="workerTaskType"
					options={[
						{
							value: "",
							label: activeTask ? "-- Select Replacement Task --" : "-- Select Task --",
						},
						...taskOptions.map((task) => ({
							value: task.id,
							label: task.stationName ? `${task.name} [${task.stationName}]` : task.name,
						})),
					]}
					value={selectedTaskId}
					onChange={setSelectedTaskId}
					isDisabled={isPending || taskOptions.length === 0}
				/>

				{activeTask ? (
					<div className="flex flex-wrap gap-2 mt-2">
						<form
							action={switchFormAction}
							onSubmit={() => {
								resetSelectedTask();
							}}
							className="flex-1"
						>
							<input type="hidden" name="employeeId" value={employeeId} />
							<input type="hidden" name="taskTypeId" value={selectedTaskId} />
							<input type="hidden" name="newTaskTypeId" value={selectedTaskId} />
							<input type="hidden" name="assignmentId" value={activeTask.assignmentId} />
							<Button
								type="submit"
								variant="outline"
								size="sm"
								className="w-full"
								disabled={isPending || !selectedTaskId}
							>
								{isSwitchPending ? "Switching..." : "Execute Switch"}
							</Button>
						</form>

						<form action={endFormAction} className="flex-1">
							<input type="hidden" name="employeeId" value={employeeId} />
							<input type="hidden" name="assignmentId" value={activeTask.assignmentId} />
							<input type="hidden" name="taskId" value={activeTask.assignmentId} />
							<Button
								type="submit"
								variant="secondary"
								size="sm"
								className="w-full"
								disabled={isPending}
							>
								{isEndPending ? "Terminating..." : "Terminate Task"}
							</Button>
						</form>
					</div>
				) : (
					<form
						action={startFormAction}
						onSubmit={() => {
							resetSelectedTask();
						}}
						className="mt-2"
					>
						<input type="hidden" name="employeeId" value={employeeId} />
						<input type="hidden" name="taskTypeId" value={selectedTaskId} />
						<Button
							type="submit"
							variant="primary"
							size="sm"
							className="w-full"
							disabled={isPending || !selectedTaskId}
						>
							{isStartPending ? "Initializing..." : "Initialize Task"}
						</Button>
					</form>
				)}
			</div>

			<div aria-live="polite" className="space-y-2">
				{startState?.error && (
					<Alert variant="error" className="text-sm">
						{startState.error}
					</Alert>
				)}
				{switchState?.error && (
					<Alert variant="error" className="text-sm">
						{switchState.error}
					</Alert>
				)}
				{endState?.error && (
					<Alert variant="error" className="text-sm">
						{endState.error}
					</Alert>
				)}
			</div>
		</div>
	);
}

function ActiveSessions({
	activeLogs,
	activeBreaks,
	activeTasksByEmployee,
	assignmentMode,
	taskOptions,
}: {
	activeLogs: TimeLogWithRelations[];
	activeBreaks: TimeLogWithRelations[];
	activeTasksByEmployee?: Record<
		string,
		{ assignmentId: string; taskTypeName: string; stationName: string | null }
	>;
	assignmentMode: TaskAssignmentMode;
	taskOptions: TaskOption[];
}) {
	const { kioskEnabled, enqueueOfflineAction } = useKioskContext();
	const [state, formAction] = useActionState<ClockActionState, FormData>(clockOut, null);

	const handleClockOutSubmit = useCallback(
		(event: React.FormEvent<HTMLFormElement>, logId: string) => {
			if (typeof navigator !== "undefined" && !navigator.onLine) {
				event.preventDefault();
				enqueueOfflineAction("clockOut", { logId });
				notify("Clock out queued for sync", "warning");
			}
		},
		[enqueueOfflineAction]
	);

	useEffect(() => {
		if (state?.success) {
			notify("Clocked out successfully", "success");
		}
		if (state?.error) {
			notify(state.error, "error");
		}
	}, [state]);

	return (
		<Card className="flex flex-col">
			<CardHeader className="flex flex-row justify-between items-center">
				<CardTitle className="flex items-center gap-2">
					<span className="w-2 h-2 rounded-full bg-primary" />
					Active Roster
				</CardTitle>
				<div className="text-sm font-medium text-muted-foreground bg-background/50 border border-border/50 px-3 py-1 rounded-[2px] z-10 relative">
					Count: {activeLogs.length}
				</div>
			</CardHeader>
			<CardBody>
				{activeLogs.length === 0 ? (
					<div className="h-full min-h-[200px] flex flex-col items-center justify-center border-2 border-dashed border-border/40 rounded-[2px] text-muted-foreground bg-muted/5">
						<svg
							className="w-10 h-10 mb-3 opacity-30"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={1.5}
								d="M12 4v16m8-8H4"
							/>
						</svg>
						<p className="font-medium text-sm">No Active Personnel</p>
					</div>
				) : (
					<div className="space-y-4">
						{activeLogs.map((log) => {
							const employeeOnBreak = activeBreaks.some((b) => b.employeeId === log.employeeId);
							const activeTask = activeTasksByEmployee?.[log.employeeId];

							return (
								<div
									key={log.id}
									className="relative bg-card border border-border rounded-[2px] p-4 shadow-sm transition-all hover:border-primary/30"
								>
									{/* Status indicator line */}
									<div
										className={cn(
											"absolute left-0 top-0 bottom-0 w-1.5 rounded-l-[2px] transition-colors",
											employeeOnBreak ? "bg-amber-500" : "bg-primary"
										)}
									/>

									<div className="flex flex-col sm:flex-row justify-between items-start gap-4 pl-3">
										<div className="flex-1 min-w-0">
											<div className="flex flex-wrap items-center gap-3 mb-2">
												<p className="font-semibold text-lg text-foreground">{log.Employee.name}</p>
												{employeeOnBreak ? (
													<span className="text-xs bg-amber-500/10 text-amber-600 border border-amber-500/30 px-2 py-0.5 rounded-full font-medium">
														On Break
													</span>
												) : (
													<span className="text-xs bg-primary/10 text-primary border border-primary/30 px-2 py-0.5 rounded-full font-medium">
														Active
													</span>
												)}
											</div>
											<div className="flex flex-col gap-1.5">
												<p className="text-sm text-muted-foreground flex items-center gap-2">
													<span className="font-medium">Location:</span>
													<span className="text-foreground">
														{log.Station?.name || "Unassigned"}
													</span>
												</p>
												{activeTask && (
													<p className="text-sm text-muted-foreground flex items-center gap-2">
														<span className="font-medium">Task:</span>
														<span className="text-foreground font-semibold">
															{activeTask.taskTypeName}
														</span>
													</p>
												)}
												<div className="flex items-center gap-3 mt-2 pt-2 border-t border-border/50">
													<p className="text-sm text-muted-foreground">
														In:{" "}
														{new Date(log.startTime).toLocaleTimeString([], {
															hour: "2-digit",
															minute: "2-digit",
														})}
													</p>
													<span className="text-sm text-primary font-medium">
														<ElapsedTime startTime={log.startTime} />
													</span>
												</div>
											</div>
										</div>
										<div className="flex flex-col gap-3 w-full sm:w-auto">
											<BreakButton employeeId={log.employeeId} onBreak={employeeOnBreak} />
											<form
												action={formAction}
												onSubmit={(event) => handleClockOutSubmit(event, log.id)}
												className="w-full"
											>
												<input type="hidden" name="logId" value={log.id} />
												<ClockOutButton kioskMode={kioskEnabled} />
											</form>
										</div>
									</div>

									<div className="pl-3">
										<WorkerTaskControls
											employeeId={log.employeeId}
											activeTask={activeTask}
											assignmentMode={assignmentMode}
											taskOptions={taskOptions}
										/>
									</div>
								</div>
							);
						})}
					</div>
				)}
				{state?.error && (
					<Alert variant="error" className="relative mt-5 text-sm">
						{state.error}
					</Alert>
				)}
				{state?.success && (
					<Alert variant="success" className="relative mt-5 text-sm">
						Clock Out Successful
					</Alert>
				)}
			</CardBody>
		</Card>
	);
}

function ClockOutButton({ kioskMode }: { kioskMode: boolean }) {
	const { pending } = useFormStatus();
	return (
		<Button
			type="submit"
			variant="secondary"
			size={kioskMode ? "lg" : "md"}
			disabled={pending}
			className="w-full"
		>
			{pending ? "Clocking Out..." : "Clock Out"}
		</Button>
	);
}

function TimeLogEditDialog({ log, stations }: { log: TimeLogWithRelations; stations: Station[] }) {
	const [isOpen, setIsOpen] = useState(false);
	const [state, formAction] = useActionState<ClockActionState, FormData>(updateTimeLog, null);

	useEffect(() => {
		if (state?.success) {
			// eslint-disable-next-line react-hooks/set-state-in-effect
			setIsOpen(false);
		}
	}, [state]);

	const formatDateTimeLocal = (date: Date | null) => {
		if (!date) return "";
		const d = new Date(date);
		const offset = d.getTimezoneOffset();
		const localDate = new Date(d.getTime() - offset * 60 * 1000);
		return localDate.toISOString().slice(0, 16);
	};

	return (
		<DialogTrigger isOpen={isOpen} onOpenChange={setIsOpen}>
			<Button variant="ghost" size="xs">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth={1.5}
					stroke="currentColor"
					className="w-4 h-4"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
					/>
				</svg>
			</Button>
			<ModalOverlay className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
				<Modal className="bg-card border border-border rounded-[2px] shadow-xl w-full max-w-md mx-4">
					<Dialog className="outline-none relative">
						<form action={formAction} className="p-4">
							<input type="hidden" name="logId" value={log.id} />
							<h3 className="text-lg font-bold mb-4">Edit Time Log</h3>

							<div className="flex flex-col gap-1 mb-3">
								<label className="flex items-center justify-between">
									<span className="text-sm font-medium text-foreground">Start Time</span>
								</label>
								<input
									type="datetime-local"
									name="startTime"
									defaultValue={formatDateTimeLocal(log.startTime)}
									className="px-3 py-2 border rounded bg-card text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
									required
								/>
							</div>

							<div className="flex flex-col gap-1 mb-3">
								<label className="flex items-center justify-between">
									<span className="text-sm font-medium text-foreground">End Time</span>
								</label>
								<input
									type="datetime-local"
									name="endTime"
									defaultValue={formatDateTimeLocal(log.endTime)}
									className="px-3 py-2 border rounded bg-card text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
								/>
							</div>

							<div className="flex flex-col gap-1 mb-3">
								<label className="flex items-center justify-between">
									<span className="text-sm font-medium text-foreground">Type</span>
								</label>
								<select
									name="type"
									defaultValue={log.type}
									className="px-3 py-2 border rounded bg-card text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
									required
								>
									<option value="WORK">Work</option>
									<option value="BREAK">Break</option>
								</select>
							</div>

							<div className="flex flex-col gap-1 mb-3">
								<label className="flex items-center justify-between">
									<span className="text-sm font-medium text-foreground">Station</span>
								</label>
								<select
									name="stationId"
									defaultValue={log.stationId || ""}
									className="px-3 py-2 border rounded bg-card text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
								>
									<option value="">None</option>
									{stations.map((st) => (
										<option key={st.id} value={st.id}>
											{st.name}
										</option>
									))}
								</select>
							</div>

							<div className="flex flex-col gap-1 mb-4">
								<label className="flex items-center justify-between">
									<span className="text-sm font-medium text-foreground">Note</span>
								</label>
								<textarea
									name="note"
									defaultValue={log.note || ""}
									className="px-3 py-2 border rounded bg-card text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
									rows={3}
								/>
							</div>

							{state?.error && (
								<Alert variant="error" className="relative mb-3 text-sm">
									{state.error}
								</Alert>
							)}

							<div className="flex justify-end gap-2">
								<Button type="button" variant="ghost" onPress={() => setIsOpen(false)}>
									Cancel
								</Button>
								<EditSubmitButton />
							</div>
						</form>
					</Dialog>
				</Modal>
			</ModalOverlay>
		</DialogTrigger>
	);
}

function EditSubmitButton() {
	const { pending } = useFormStatus();
	return (
		<Button type="submit" variant="primary" disabled={pending}>
			{pending ? "Saving..." : "Save"}
		</Button>
	);
}

function DeleteButton({ logId }: { logId: string }) {
	const { kioskEnabled, enqueueOfflineAction } = useKioskContext();
	const [state, formAction] = useActionState<ClockActionState, FormData>(deleteTimeLog, null);

	useEffect(() => {
		if (state?.success) {
			notify("Time log deleted", "warning");
		}
		if (state?.error) {
			notify(state.error, "error");
		}
	}, [state]);

	const handleDelete = useCallback(
		(event: React.FormEvent<HTMLFormElement>) => {
			if (!confirm("Are you sure you want to delete this time log?")) {
				event.preventDefault();
				return;
			}
			if (typeof navigator !== "undefined" && !navigator.onLine) {
				event.preventDefault();
				enqueueOfflineAction("deleteTimeLog", { logId });
				notify("Delete queued for sync", "warning");
			}
		},
		[enqueueOfflineAction, logId]
	);

	return (
		<form action={formAction} onSubmit={handleDelete} className="inline">
			<input type="hidden" name="logId" value={logId} />
			<DeleteSubmitButton kioskMode={kioskEnabled} />
			{state?.error && <span className="text-xs text-error ml-2">{state.error}</span>}
		</form>
	);
}

function DeleteSubmitButton({ kioskMode }: { kioskMode: boolean }) {
	const { pending } = useFormStatus();
	return (
		<Button
			type="submit"
			variant="ghost"
			size={kioskMode ? "sm" : "xs"}
			disabled={pending}
			className="text-red-600"
		>
			{pending ? (
				<IndustrialSpinner size="sm" className="text-red-600" />
			) : (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth={1.5}
					stroke="currentColor"
					className="w-4 h-4"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
					/>
				</svg>
			)}
		</Button>
	);
}

function TimeHistory({
	completedLogs,
	stations,
	employees,
}: {
	completedLogs: TimeLogWithRelations[];
	stations: Station[];
	employees: Employee[];
}) {
	const [startDate, setStartDate] = useState(() => {
		const today = new Date();
		return today.toISOString().split("T")[0];
	});
	const [endDate, setEndDate] = useState(() => {
		const today = new Date();
		return today.toISOString().split("T")[0];
	});
	const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
	const [selectedStationId, setSelectedStationId] = useState("");
	const [searchQuery, setSearchQuery] = useState("");

	const filteredLogs = completedLogs.filter((log) => {
		const logDate = new Date(log.startTime).toISOString().split("T")[0];

		if (startDate && logDate < startDate) return false;
		if (endDate && logDate > endDate) return false;

		if (selectedEmployeeId && log.employeeId !== selectedEmployeeId) return false;

		if (selectedStationId) {
			if (selectedStationId === "none" && log.stationId !== null) return false;
			if (selectedStationId !== "none" && log.stationId !== selectedStationId) return false;
		}

		if (searchQuery && !log.Employee.name.toLowerCase().includes(searchQuery.toLowerCase())) {
			return false;
		}

		return true;
	});

	const calculateDuration = (start: Date, end: Date | null) => {
		if (!end) return "N/A";
		const duration = intervalToDuration({ start: new Date(start), end: new Date(end) });
		return formatDurationFn(duration, { format: ["hours", "minutes"] }) || "0m";
	};

	const employeeOvertimeStatus = useMemo(() => {
		const status: Record<string, { dailyOT: boolean; weeklyOT: boolean }> = {};

		const selectedDate = startDate ? new Date(startDate) : new Date();
		const weekBounds = getWeekBounds(selectedDate);

		employees.forEach((employee) => {
			const employeeLogs = filteredLogs.filter((log) => log.employeeId === employee.id);

			const dailyWorkLogs = employeeLogs.filter((log) => {
				const logDate = new Date(log.startTime).toISOString().split("T")[0];
				return log.type === "WORK" && logDate === startDate;
			});

			const dailyBreakLogs = employeeLogs.filter((log) => {
				const logDate = new Date(log.startTime).toISOString().split("T")[0];
				return log.type === "BREAK" && logDate === startDate;
			});

			const weeklyWorkLogs = employeeLogs.filter((log) => {
				const logTime = new Date(log.startTime).getTime();
				return (
					log.type === "WORK" &&
					logTime >= weekBounds.start.getTime() &&
					logTime <= weekBounds.end.getTime()
				);
			});

			const weeklyBreakLogs = employeeLogs.filter((log) => {
				const logTime = new Date(log.startTime).getTime();
				return (
					log.type === "BREAK" &&
					logTime >= weekBounds.start.getTime() &&
					logTime <= weekBounds.end.getTime()
				);
			});

			const dailyNetHours = calculateNetHours(dailyWorkLogs, dailyBreakLogs);
			const weeklyNetHours = calculateNetHours(weeklyWorkLogs, weeklyBreakLogs);

			status[employee.id] = {
				dailyOT: isOvertime(dailyNetHours, employee, "daily"),
				weeklyOT: isOvertime(weeklyNetHours, employee, "weekly"),
			};
		});

		return status;
	}, [filteredLogs, employees, startDate]);

	const totalWorkLogs = filteredLogs.filter((log) => log.type === "WORK");
	const totalBreakLogs = filteredLogs.filter((log) => log.type === "BREAK");

	const grossHours = totalWorkLogs.reduce((sum, log) => {
		if (!log.endTime) return sum;
		const diff = new Date(log.endTime).getTime() - new Date(log.startTime).getTime();
		return sum + diff / (1000 * 60 * 60);
	}, 0);

	const breakHours = totalBreakLogs.reduce((sum, log) => {
		if (!log.endTime) return sum;
		const diff = new Date(log.endTime).getTime() - new Date(log.startTime).getTime();
		return sum + diff / (1000 * 60 * 60);
	}, 0);

	const netHours = grossHours - breakHours;

	const selectedEmployee = employees.find((emp) => emp.id === selectedEmployeeId);
	const dailyLimit = selectedEmployee?.dailyHoursLimit ?? DEFAULT_DAILY_LIMIT;
	const showOvertimeWarning = selectedEmployeeId && netHours > dailyLimit;

	return (
		<Card className="mt-4 flex flex-col overflow-hidden">
			<CardHeader className="flex flex-row justify-between items-center">
				<CardTitle className="flex items-center gap-2">
					<svg
						className="w-4 h-4 text-primary"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M4 6h16M4 10h16M4 14h16M4 18h16"
						/>
					</svg>
					System Logs
				</CardTitle>
				<div className="text-sm font-medium text-muted-foreground bg-background/50 border border-border/50 px-3 py-1 rounded-[2px] z-10 relative">
					Total Records: {filteredLogs.length}
				</div>
			</CardHeader>
			<CardBody>
				<div className="mb-6 bg-muted/30 p-4 rounded-[2px] border border-border/50 space-y-4">
					<div className="flex flex-col gap-1">
						<p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
							Log Filters
						</p>
						<p className="text-xs text-muted-foreground">
							Refine by date, personnel, location, or name.
						</p>
					</div>
					<div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
						<div className="flex flex-col gap-1.5 lg:col-span-3">
							<label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
								Start Date
							</label>
							<Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
						</div>

						<div className="flex flex-col gap-1.5 lg:col-span-3">
							<label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
								End Date
							</label>
							<Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
						</div>

						<div className="flex flex-col gap-1.5 lg:col-span-3">
							<label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
								Personnel
							</label>
							<Select
								options={[
									{ value: "", label: "-- All Personnel --" },
									...employees.map((emp) => ({ value: emp.id, label: emp.name })),
								]}
								value={selectedEmployeeId}
								onChange={setSelectedEmployeeId}
							/>
						</div>

						<div className="flex flex-col gap-1.5 lg:col-span-3">
							<label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
								Location
							</label>
							<Select
								options={[
									{ value: "", label: "-- All Locations --" },
									{ value: "none", label: "Unassigned" },
									...stations.map((st) => ({ value: st.id, label: st.name })),
								]}
								value={selectedStationId}
								onChange={setSelectedStationId}
							/>
						</div>

						<div className="flex flex-col gap-1.5 lg:col-span-8">
							<label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
								Name Search
							</label>
							<Input
								type="text"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								placeholder="Search by employee name"
							/>
						</div>

						<div className="lg:col-span-4 flex items-end">
							<Button
								type="button"
								variant="outline"
								size="sm"
								className="w-full lg:w-auto"
								onPress={() => {
									setStartDate("");
									setEndDate("");
									setSelectedEmployeeId("");
									setSelectedStationId("");
									setSearchQuery("");
								}}
							>
								Clear Filters
							</Button>
						</div>
					</div>
				</div>

				{filteredLogs.length === 0 ? (
					<div className="py-16 flex flex-col items-center justify-center border-2 border-dashed border-border/50 rounded-[2px] bg-muted/10">
						<p className="text-sm font-medium text-muted-foreground">
							No logs found matching criteria
						</p>
					</div>
				) : (
					<div className="border border-border/50 rounded-[2px] overflow-hidden">
						<div className="overflow-x-auto">
							<table className="w-full text-left border-collapse text-sm">
								<thead>
									<tr className="bg-muted/50 border-b border-border">
										<th className="p-4 font-semibold text-muted-foreground">Personnel</th>
										<th className="p-4 font-semibold text-muted-foreground">Type</th>
										<th className="p-4 font-semibold text-muted-foreground">Location</th>
										<th className="p-4 font-semibold text-muted-foreground">Time In</th>
										<th className="p-4 font-semibold text-muted-foreground">Time Out</th>
										<th className="p-4 font-semibold text-muted-foreground">Net Time</th>
										<th className="p-4 font-semibold text-muted-foreground text-right">Actions</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-border/50 bg-card">
									{filteredLogs.map((log) => {
										const overtimeStatus = employeeOvertimeStatus[log.employeeId];
										const showDailyOT = overtimeStatus?.dailyOT;
										const showWeeklyOT = overtimeStatus?.weeklyOT;

										return (
											<tr key={log.id} className="hover:bg-muted/30 transition-colors group">
												<td className="p-4">
													<div className="flex flex-col gap-1">
														<span className="font-medium text-foreground">{log.Employee.name}</span>
														<div className="flex gap-2">
															{showDailyOT && (
																<span className="text-xs bg-amber-500/10 text-amber-600 border border-amber-500/30 px-1.5 py-0.5 rounded-sm">
																	Daily OT
																</span>
															)}
															{showWeeklyOT && (
																<span className="text-xs bg-amber-500/10 text-amber-600 border border-amber-500/30 px-1.5 py-0.5 rounded-sm">
																	Weekly OT
																</span>
															)}
														</div>
													</div>
												</td>
												<td className="p-4">
													<span
														className={cn(
															"text-xs px-2 py-1 border rounded-full font-medium",
															log.type === "WORK"
																? "bg-primary/10 text-primary border-primary/30"
																: "bg-amber-500/10 text-amber-600 border-amber-500/30"
														)}
													>
														{log.type === "WORK" ? "Work" : "Break"}
													</span>
												</td>
												<td className="p-4 text-muted-foreground">{log.Station?.name || "N/A"}</td>
												<td className="p-4 text-muted-foreground">
													{new Date(log.startTime).toLocaleTimeString([], {
														hour: "2-digit",
														minute: "2-digit",
													})}
												</td>
												<td className="p-4 text-muted-foreground">
													{log.endTime ? (
														new Date(log.endTime).toLocaleTimeString([], {
															hour: "2-digit",
															minute: "2-digit",
														})
													) : (
														<span className="text-primary font-medium">Active</span>
													)}
												</td>
												<td className="p-4 font-semibold text-foreground">
													{calculateDuration(log.startTime, log.endTime)}
												</td>
												<td className="p-4 text-right">
													<div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
														<TimeLogEditDialog log={log} stations={stations} />
														<DeleteButton logId={log.id} />
													</div>
												</td>
											</tr>
										);
									})}
								</tbody>
							</table>
						</div>

						<div className="bg-muted/30 border-t border-border p-5">
							<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
								<div className="flex items-center gap-2">
									<div className="w-2 h-2 rounded-full bg-primary" />
									<span className="text-sm font-medium text-muted-foreground">Metrics Summary</span>
								</div>

								<div className="flex gap-8 text-sm">
									<div className="flex flex-col items-end">
										<span className="text-muted-foreground mb-1">Gross (Work)</span>
										<span className="text-xl font-semibold text-foreground">
											{grossHours.toFixed(2)}
											<span className="text-xs text-muted-foreground ml-1">hr</span>
										</span>
									</div>
									<div className="w-[1px] h-10 bg-border/50" />
									<div className="flex flex-col items-end">
										<span className="text-muted-foreground mb-1">Break Time</span>
										<span className="text-xl font-semibold text-foreground">
											{breakHours.toFixed(2)}
											<span className="text-xs text-muted-foreground ml-1">hr</span>
										</span>
									</div>
									<div className="w-[1px] h-10 bg-border/50" />
									<div className="flex flex-col items-end relative">
										<span className="text-muted-foreground mb-1">Net Total</span>
										<div className="flex items-center gap-2">
											{showOvertimeWarning && (
												<span className="text-xs bg-amber-500/10 text-amber-600 border border-amber-500/30 px-2 py-0.5 rounded-full absolute -left-20 -top-2 font-medium">
													Overtime
												</span>
											)}
											<span
												className={cn(
													"text-2xl font-bold",
													showOvertimeWarning ? "text-amber-600" : "text-primary"
												)}
											>
												{netHours.toFixed(2)}
											</span>
											<span className="text-xs text-muted-foreground">hr</span>
										</div>
										{selectedEmployee && (
											<div className="text-xs text-muted-foreground mt-1">Limit: {dailyLimit}h</div>
										)}
									</div>
								</div>
							</div>
						</div>
					</div>
				)}
			</CardBody>
		</Card>
	);
}

export function TimeTracking({
	employees,
	stations,
	activeLogs,
	activeBreaks,
	completedLogs,
	completedLogsPromise,
	activeTasksByEmployee,
	assignmentMode,
	taskOptions,
	workerEmployeeId,
}: {
	employees: Employee[];
	stations: Station[];
	activeLogs: TimeLogWithRelations[];
	activeBreaks: TimeLogWithRelations[];
	completedLogs?: TimeLogWithRelations[];
	completedLogsPromise?: Promise<TimeLogWithRelations[]>;
	activeTasksByEmployee?: Record<
		string,
		{ assignmentId: string; taskTypeName: string; stationName: string | null }
	>;
	assignmentMode: TaskAssignmentMode;
	taskOptions: TaskOption[];
	workerEmployeeId?: string | null;
}) {
	const getStatusBarOffset = () => {
		if (typeof document === "undefined") {
			return 0;
		}

		const statusBar = document.getElementById("app-status-bar");
		if (!statusBar) {
			return 0;
		}

		return Math.ceil(statusBar.getBoundingClientRect().bottom);
	};

	const [kioskEnabled, setKioskEnabled] = useKioskMode();
	const pinInputRef = useRef<HTMLInputElement | null>(null);
	const [activeDrawer, setActiveDrawer] = useState<"roster" | "logs" | null>(null);
	const [drawerTopOffset, setDrawerTopOffset] = useState(() => getStatusBarOffset());

	// Optimistic state for active logs
	const [optimisticLogs, addOptimisticLog] = useOptimistic(
		activeLogs,
		(state, newLog: TimeLogWithRelations) => [newLog, ...state]
	);

	const [notifications, setNotifications] = useState(
		[] as Array<{
			id: string;
			message: string;
			type: "success" | "error" | "warning";
		}>
	);
	const [autoDismissTimer, setAutoDismissTimer] = useState<number | null>(null);

	const apiKey =
		typeof window !== "undefined" ? window.localStorage.getItem("timeClock:apiKey") || "" : "";
	const { queue, enqueue, sync, status } = useOfflineActionQueue(apiKey);
	const workerActiveLog = workerEmployeeId
		? optimisticLogs.find((log) => log.employeeId === workerEmployeeId)
		: null;
	const workerActiveTask = workerEmployeeId ? activeTasksByEmployee?.[workerEmployeeId] : undefined;

	useEffect(() => {
		const unsub = subscribe((message, type) => {
			const id = createId();
			setNotifications((prev) => [...prev, { id, message, type }]);
			if (autoDismissTimer) {
				window.clearTimeout(autoDismissTimer);
			}
			const timer = window.setTimeout(() => {
				setNotifications((prev) => prev.filter((item) => item.id !== id));
			}, 4000);
			setAutoDismissTimer(timer);
		});
		return () => {
			unsub();
			if (autoDismissTimer) window.clearTimeout(autoDismissTimer);
		};
	}, [autoDismissTimer]);

	const focusPinInput = useCallback(() => {
		pinInputRef.current?.focus();
	}, []);

	useAutoRefresh(kioskEnabled, 60000);

	const contextValue = useMemo<KioskContextValue>(
		() => ({
			kioskEnabled,
			setKioskEnabled,
			focusPinInput,
			actionQueueSize: queue.length,
			isSyncing: status === "syncing",
			enqueueOfflineAction: enqueue,
			syncOfflineActions: sync,
			apiKey,
			saveApiKey: (value: string) => {
				if (typeof window !== "undefined") {
					window.localStorage.setItem("timeClock:apiKey", value);
				}
			},
		}),
		[enqueue, focusPinInput, kioskEnabled, queue.length, status, sync, setKioskEnabled, apiKey]
	);

	const handleEnableKiosk = useCallback(() => {
		setKioskEnabled(true);
		window.location.href = "/floor/kiosk";
	}, [setKioskEnabled]);

	useEffect(() => {
		const statusBar = document.getElementById("app-status-bar");
		if (!statusBar) {
			return;
		}

		const updateOffset = () => {
			setDrawerTopOffset(Math.ceil(statusBar.getBoundingClientRect().bottom));
		};

		const observer =
			typeof ResizeObserver !== "undefined" ? new ResizeObserver(updateOffset) : null;
		observer?.observe(statusBar);
		window.addEventListener("resize", updateOffset);

		return () => {
			observer?.disconnect();
			window.removeEventListener("resize", updateOffset);
		};
	}, []);

	return (
		<KioskContext.Provider value={contextValue}>
			<div className="flex flex-col gap-6 w-full relative z-10 min-h-[60vh]">
				<div className="flex justify-end gap-2">
					<Button
						type="button"
						variant="outline"
						size="sm"
						onPress={() => setActiveDrawer("roster")}
					>
						View Roster ({optimisticLogs.length})
					</Button>
					<Button type="button" variant="outline" size="sm" onPress={() => setActiveDrawer("logs")}>
						View Logs
					</Button>
					<Button
						type="button"
						variant="secondary"
						size="sm"
						onPress={handleEnableKiosk}
						className="transition-all duration-300"
					>
						Launch Kiosk Mode
					</Button>
				</div>

				<div className="mx-auto w-full mt-2 md:mt-8 mb-12">
					<ClockInForm
						employees={employees}
						stations={stations}
						pinInputRef={pinInputRef}
						onOptimisticClockIn={addOptimisticLog}
					/>

					{workerEmployeeId && workerActiveLog && (
						<Card className="mt-4 border-primary/40">
							<CardHeader>
								<CardTitle className="text-sm uppercase tracking-wider">My Task Controls</CardTitle>
							</CardHeader>
							<CardBody>
								<p className="mb-3 text-xs text-muted-foreground">
									Manage your own task directly from the primary floor screen.
								</p>
								<WorkerTaskControls
									employeeId={workerEmployeeId}
									activeTask={workerActiveTask}
									assignmentMode={assignmentMode}
									taskOptions={taskOptions}
								/>
							</CardBody>
						</Card>
					)}
				</div>

				{/* Drawer Overlay */}
				<div
					className={cn(
						"fixed inset-x-0 bottom-0 bg-background/80 backdrop-blur-sm z-50 transition-opacity duration-300",
						activeDrawer ? "opacity-100" : "opacity-0 pointer-events-none"
					)}
					style={{ top: drawerTopOffset }}
					onClick={() => setActiveDrawer(null)}
					aria-hidden="true"
				/>

				{/* Drawer Content */}
				<div
					className={cn(
						"fixed right-0 bottom-0 z-50 bg-background border-l border-border shadow-2xl transition-transform duration-300 ease-in-out flex flex-col min-h-0",
						activeDrawer === "logs"
							? "w-full sm:w-[620px] lg:w-[920px]"
							: "w-full sm:w-[540px] md:w-[640px]",
						activeDrawer ? "translate-x-0" : "translate-x-full"
					)}
					style={{ top: drawerTopOffset }}
				>
					<div className="flex justify-end p-3 border-b border-border bg-muted/20">
						<Button variant="ghost" size="sm" onPress={() => setActiveDrawer(null)}>
							<span className="sr-only">Close</span>
							<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</Button>
					</div>
					<div className="flex-1 min-h-0 overflow-hidden p-4 md:p-6 bg-background">
						{activeDrawer === "roster" ? (
							<div className="h-full min-h-0 overflow-y-auto pr-1">
								<ActiveSessions
									activeLogs={optimisticLogs}
									activeBreaks={activeBreaks}
									activeTasksByEmployee={activeTasksByEmployee}
									assignmentMode={assignmentMode}
									taskOptions={taskOptions}
								/>
							</div>
						) : null}
						{activeDrawer === "logs" ? (
							<div className="h-full min-h-0 overflow-y-auto pr-1">
								<div className="flex items-center gap-3 mb-2">
									<h3 className="text-base font-semibold text-foreground">Historical Data</h3>
								</div>
								<Suspense fallback={<TimeHistoryFallback />}>
									<DeferredTimeHistory
										completedLogs={completedLogs}
										completedLogsPromise={completedLogsPromise}
										stations={stations}
										employees={employees}
									/>
								</Suspense>
							</div>
						) : null}
					</div>
				</div>
			</div>
			{notifications.length > 0 && (
				<div className="fixed bottom-4 right-4 space-y-2 z-50 flex flex-col items-end">
					{notifications.map((note) => (
						<Alert
							key={note.id}
							variant={
								note.type === "success" ? "success" : note.type === "error" ? "error" : "warning"
							}
							className="relative shadow-lg max-w-sm animate-in slide-in-from-right-8"
						>
							{note.message}
						</Alert>
					))}
				</div>
			)}
		</KioskContext.Provider>
	);
}

function DeferredTimeHistory({
	completedLogs,
	completedLogsPromise,
	stations,
	employees,
}: {
	completedLogs?: TimeLogWithRelations[];
	completedLogsPromise?: Promise<TimeLogWithRelations[]>;
	stations: Station[];
	employees: Employee[];
}) {
	const resolvedCompletedLogs = completedLogsPromise
		? use(completedLogsPromise)
		: (completedLogs ?? []);

	return (
		<TimeHistory completedLogs={resolvedCompletedLogs} stations={stations} employees={employees} />
	);
}

function TimeHistoryFallback() {
	return (
		<Card className="mt-4 flex flex-col overflow-hidden">
			<CardHeader className="flex justify-between items-center">
				<CardTitle className="flex items-center gap-2">
					<span className="w-4 h-4 bg-muted animate-pulse rounded-full" />
					System Logs Loading...
				</CardTitle>
			</CardHeader>
			<CardBody className="space-y-4">
				<div className="h-12 rounded-[2px] border border-border bg-muted/20 animate-pulse" />
				<div className="h-12 rounded-[2px] border border-border bg-muted/20 animate-pulse" />
				<div className="h-64 rounded-[2px] border border-border bg-muted/20 animate-pulse" />
			</CardBody>
		</Card>
	);
}
