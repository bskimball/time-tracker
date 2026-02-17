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
import { Button } from "@monorepo/design-system";
import { Alert } from "@monorepo/design-system";
import { Card, CardHeader, CardTitle, CardBody } from "@monorepo/design-system";
import { SimpleInput, Input } from "@monorepo/design-system";
import { Select } from "@monorepo/design-system";
import { Form } from "@monorepo/design-system";
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
	const [isEditingApiKey, setIsEditingApiKey] = useState(false);

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
		<Card>
			<CardHeader>
				<CardTitle>Clock In/Out</CardTitle>
			</CardHeader>
			<CardBody>
				<div className="flex justify-between items-center text-xs text-muted-foreground">
					<span>
						Kiosk mode {kioskEnabled ? "enabled" : "disabled"}
						{actionQueueSize > 0 && ` • ${actionQueueSize} pending`}
					</span>
					<Button
						type="button"
						variant="ghost"
						size="sm"
						onClick={syncOfflineActions}
						disabled={isSyncing || actionQueueSize === 0}
					>
						{isSyncing ? "Syncing..." : actionQueueSize > 0 ? "Sync now" : "Queue empty"}
					</Button>
				</div>

				<div className="mt-3 flex flex-col gap-2 mb-6">
					<label className="text-xs font-medium text-foreground">Device API Key</label>
					{isEditingApiKey ? (
						<div className="flex gap-2 animate-fade-in">
							<div className="flex-1">
								<SimpleInput
									type="text"
									value={apiKey}
									onChange={(e) => saveApiKey(e.target.value)}
									placeholder="Enter API Key"
									autoFocus
								/>
							</div>
							<Button size="sm" onPress={() => setIsEditingApiKey(false)}>
								Done
							</Button>
						</div>
					) : (
						<div className="flex justify-between items-center p-3 bg-muted/20 rounded-[2px] border border-border/50 group hover:border-primary/30 transition-colors">
							<span className="text-xs font-mono text-muted-foreground tracking-wider">
								{apiKey ? `••••••••${apiKey.slice(-4)}` : "NO API KEY SET"}
							</span>
							<button
								type="button"
								className="text-xs font-medium text-primary hover:text-primary/80 uppercase tracking-wider"
								onClick={() => setIsEditingApiKey(true)}
							>
								Edit
							</button>
						</div>
					)}
				</div>

				<div className="flex gap-2 w-full mb-4 bg-muted/10 p-1 rounded-[4px] border border-border/30">
					<Button
						type="button"
						variant={method === "pin" ? "primary" : "ghost"}
						className={cn("flex-1 rounded-[2px]", method === "pin" && "shadow-sm")}
						onPress={() => setMethod("pin")}
					>
						PIN Number
					</Button>
					<Button
						type="button"
						variant={method === "select" ? "primary" : "ghost"}
						className={cn("flex-1 rounded-[2px]", method === "select" && "shadow-sm")}
						onPress={() => setMethod("select")}
					>
						Select Employee
					</Button>
				</div>

				{method === "pin" ? (
					<Form action={pinFormAction} onSubmit={handlePinSubmit}>
						<div className="flex flex-col gap-1">
							<label className="flex items-center justify-between">
								<span className="text-sm font-medium text-foreground w-24 inline-block">
									Enter PIN
								</span>
							</label>
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
								placeholder="4-6 digit PIN"
								className="px-3 py-2 border rounded transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-full"
								inputMode="numeric"
								autoFocus={kioskEnabled}
								maxLength={6}
								pattern="\d{4,6}"
								required
							/>
						</div>

						<div className="flex flex-col gap-1 mt-3">
							<label className="flex items-center justify-between">
								<span className="text-sm font-medium text-foreground w-24 inline-block">
									Station
								</span>
							</label>
							<Select
								name="stationId"
								options={[
									{ value: "", label: "Use last station" },
									...stations.map((st) => ({ value: st.id, label: st.name })),
								]}
							/>
						</div>

						<div className="flex justify-end mt-4">
							<PinSubmitButton />
						</div>

						{pinState?.error && (
							<Alert variant="error" className="relative mt-3">
								{pinState.error}
							</Alert>
						)}
						{pinState?.success && pinState?.message && (
							<Alert variant="success" className="relative mt-3">
								{pinState.message}
							</Alert>
						)}
					</Form>
				) : (
					<Form action={selectFormAction} onSubmit={handleSelectSubmit}>
						<div className="flex flex-col gap-1">
							<label className="flex items-center justify-between">
								<span className="text-sm font-medium text-foreground w-24 inline-block">
									Employee
								</span>
							</label>
							<Select
								name="employeeId"
								options={[
									{ value: "", label: "Select employee" },
									...employees.map((emp) => ({ value: emp.id, label: emp.name })),
								]}
								value={selectedEmployeeId}
								onChange={setSelectedEmployeeId}
								isDisabled={employees.length === 0}
							/>
						</div>

						<div className="flex flex-col gap-1 mt-3">
							<label className="flex items-center justify-between">
								<span className="text-sm font-medium text-foreground w-24 inline-block">
									Station
								</span>
							</label>
							<Select
								name="stationId"
								options={[
									{ value: "", label: "Select station" },
									...stations.map((st) => ({ value: st.id, label: st.name })),
								]}
								value={selectedStationId}
								onChange={setSelectedStationId}
								isDisabled={stations.length === 0}
							/>
						</div>

						<div className="flex justify-end mt-4">
							<ClockInButton />
						</div>

						{selectState?.error && (
							<Alert variant="error" className="relative mt-3">
								{selectState.error}
							</Alert>
						)}
						{selectState?.success && (
							<Alert variant="success" className="relative mt-3">
								Clocked in successfully!
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
		<Button type="submit" variant="primary" disabled={pending}>
			{pending ? "Clocking In..." : "Clock In"}
		</Button>
	);
}

function PinSubmitButton() {
	const { pending } = useFormStatus();
	return (
		<Button type="submit" variant="primary" disabled={pending}>
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
				size={kioskEnabled ? "sm" : "xs"}
				disabled={pending}
			>
				{pending ? "..." : onBreak ? "End Break" : "Start Break"}
			</Button>
			{state?.error && <span className="text-xs text-red-600 ml-2">{state.error}</span>}
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
	const [switchState, switchFormAction, isSwitchPending] = useActionState<ClockActionState, FormData>(
		switchSelfTaskAction,
		null
	);
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
		<div className="mt-3 border border-border/60 rounded-[2px] bg-card px-3 py-3 space-y-3">
			<p className="text-[11px] font-industrial uppercase tracking-[0.16em] text-muted-foreground">
				Task Controls
			</p>

			{requiresTask && !activeTask && (
				<Alert variant="warning" aria-live="assertive" className="relative">
					Task assignment required while clocked in. Start a task now.
				</Alert>
			)}

			{activeTask && (
				<div className="text-xs text-muted-foreground">
					Current task: <span className="font-medium text-foreground">{activeTask.taskTypeName}</span>
					{activeTask.stationName ? ` @ ${activeTask.stationName}` : ""}
				</div>
			)}

			<div className="flex flex-col gap-2">
				<Select
					name="workerTaskType"
					options={[
						{ value: "", label: activeTask ? "Select replacement task" : "Select task" },
						...taskOptions.map((task) => ({
							value: task.id,
							label: task.stationName ? `${task.name} (${task.stationName})` : task.name,
						})),
					]}
					value={selectedTaskId}
					onChange={setSelectedTaskId}
					isDisabled={isPending || taskOptions.length === 0}
				/>

				{activeTask ? (
					<div className="flex flex-wrap gap-2">
					<form
						action={switchFormAction}
						onSubmit={() => {
							resetSelectedTask();
						}}
					>
							<input type="hidden" name="employeeId" value={employeeId} />
							<input type="hidden" name="taskTypeId" value={selectedTaskId} />
							<input type="hidden" name="newTaskTypeId" value={selectedTaskId} />
							<input type="hidden" name="assignmentId" value={activeTask.assignmentId} />
							<Button
								type="submit"
								variant="outline"
								size="sm"
								disabled={isPending || !selectedTaskId}
							>
								{isSwitchPending ? "Switching..." : "Switch Task"}
							</Button>
						</form>

						<form action={endFormAction}>
							<input type="hidden" name="employeeId" value={employeeId} />
							<input type="hidden" name="assignmentId" value={activeTask.assignmentId} />
							<input type="hidden" name="taskId" value={activeTask.assignmentId} />
							<Button type="submit" variant="secondary" size="sm" disabled={isPending}>
								{isEndPending ? "Ending..." : "End Task"}
							</Button>
						</form>
					</div>
				) : (
					<form
						action={startFormAction}
						onSubmit={() => {
							resetSelectedTask();
						}}
					>
						<input type="hidden" name="employeeId" value={employeeId} />
						<input type="hidden" name="taskTypeId" value={selectedTaskId} />
						<Button
							type="submit"
							variant="primary"
							size="sm"
							disabled={isPending || !selectedTaskId}
						>
							{isStartPending ? "Starting..." : "Start Task"}
						</Button>
					</form>
				)}
			</div>

			<div aria-live="polite" className="space-y-2">
				{startState?.error && (
					<Alert variant="error" className="relative">
						{startState.error}
					</Alert>
				)}
				{switchState?.error && (
					<Alert variant="error" className="relative">
						{switchState.error}
					</Alert>
				)}
				{endState?.error && (
					<Alert variant="error" className="relative">
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
		<Card>
			<CardHeader>
				<CardTitle>Active Sessions</CardTitle>
			</CardHeader>
			<CardBody>
				{activeLogs.length === 0 ? (
					<p>No active sessions</p>
				) : (
					<div className="space-y-2">
						{activeLogs.map((log) => {
							const employeeOnBreak = activeBreaks.some((b) => b.employeeId === log.employeeId);
							const activeTask = activeTasksByEmployee?.[log.employeeId];

							return (
								<div key={log.id} className="p-4 bg-base-200 rounded space-y-3">
									<div className="flex justify-between items-start gap-3">
										<div className="flex-1 min-w-0">
											<div className="flex items-center gap-2">
												<p className="font-semibold">{log.Employee.name}</p>
												{employeeOnBreak && (
													<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
														On Break
													</span>
												)}
											</div>
											<p className="text-sm text-muted-foreground">{log.Station?.name || "No station"}</p>
											{activeTask && (
												<p className="text-xs text-muted-foreground">
													Task: <span className="font-medium text-foreground">{activeTask.taskTypeName}</span>
												</p>
											)}
											<p className="text-xs">Started: {new Date(log.startTime).toLocaleTimeString()}</p>
											<ElapsedTime startTime={log.startTime} />
										</div>
										<div className="flex gap-2">
											<BreakButton employeeId={log.employeeId} onBreak={employeeOnBreak} />
											<form
												action={formAction}
												onSubmit={(event) => handleClockOutSubmit(event, log.id)}
											>
												<input type="hidden" name="logId" value={log.id} />
												<ClockOutButton kioskMode={kioskEnabled} />
											</form>
										</div>
									</div>

									<WorkerTaskControls
										employeeId={log.employeeId}
										activeTask={activeTask}
										assignmentMode={assignmentMode}
										taskOptions={taskOptions}
									/>
								</div>
							);
						})}
					</div>
				)}
				{state?.error && (
					<Alert variant="error" className="relative">
						{state.error}
					</Alert>
				)}
				{state?.success && (
					<Alert variant="success" className="relative">
						Clocked out successfully!
					</Alert>
				)}
			</CardBody>
		</Card>
	);
}

function ClockOutButton({ kioskMode }: { kioskMode: boolean }) {
	const { pending } = useFormStatus();
	return (
		<Button type="submit" variant="secondary" size={kioskMode ? "lg" : "md"} disabled={pending}>
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
				<Modal className="bg-base-100 rounded-lg shadow-xl w-full max-w-md mx-4">
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
										className="px-3 py-2 border rounded bg-zinc-50 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
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
										className="px-3 py-2 border rounded bg-zinc-50 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
									/>
								</div>

								<div className="flex flex-col gap-1 mb-3">
									<label className="flex items-center justify-between">
										<span className="text-sm font-medium text-foreground">Type</span>
									</label>
									<select
										name="type"
										defaultValue={log.type}
										className="px-3 py-2 border rounded bg-zinc-50 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
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
										className="px-3 py-2 border rounded bg-zinc-50 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
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
										className="px-3 py-2 border rounded bg-zinc-50 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
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
		<Card>
			<CardHeader>
				<CardTitle>Time History</CardTitle>
			</CardHeader>
			<CardBody>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 mb-4">
					<div className="flex flex-col gap-1">
						<label className="flex items-center justify-between">
							<span className="text-sm font-medium text-foreground">Start Date</span>
						</label>
						<Input
							type="date"
							value={startDate}
							onChange={(e) => setStartDate(e.target.value)}
							className="text-sm"
						/>
					</div>

					<div className="flex flex-col gap-1">
						<label className="flex items-center justify-between">
							<span className="text-sm font-medium text-foreground">End Date</span>
						</label>
						<Input
							type="date"
							value={endDate}
							onChange={(e) => setEndDate(e.target.value)}
							className="text-sm"
						/>
					</div>

					<div className="flex flex-col gap-1">
						<label className="flex items-center justify-between">
							<span className="text-sm font-medium text-foreground">Employee</span>
						</label>
						<Select
							options={[
								{ value: "", label: "All Employees" },
								...employees.map((emp) => ({ value: emp.id, label: emp.name })),
							]}
							value={selectedEmployeeId}
							onChange={setSelectedEmployeeId}
						/>
					</div>

					<div className="flex flex-col gap-1">
						<label className="flex items-center justify-between">
							<span className="text-sm font-medium text-foreground">Station</span>
						</label>
						<Select
							options={[
								{ value: "", label: "All Stations" },
								{ value: "none", label: "No Station" },
								...stations.map((st) => ({ value: st.id, label: st.name })),
							]}
							value={selectedStationId}
							onChange={setSelectedStationId}
						/>
					</div>

					<div className="flex flex-col gap-1">
						<label className="flex items-center justify-between">
							<span className="text-sm font-medium text-foreground">Search</span>
						</label>
						<Input
							type="text"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							placeholder="Employee name..."
							className="text-sm"
						/>
					</div>
				</div>

				<div className="text-sm text-muted-foreground mb-2">
					Showing {filteredLogs.length} of {completedLogs.length} entries
				</div>

				{filteredLogs.length === 0 ? (
					<p className="text-sm text-muted-foreground">No completed sessions match the filters</p>
				) : (
					<>
						<div className="overflow-x-auto">
							<table className="table table-sm">
								<thead>
									<tr>
										<th>Employee</th>
										<th>Type</th>
										<th>Station</th>
										<th>Start</th>
										<th>End</th>
										<th>Duration</th>
										<th>Actions</th>
									</tr>
								</thead>
								<tbody>
									{filteredLogs.map((log) => {
										const overtimeStatus = employeeOvertimeStatus[log.employeeId];
										const showDailyOT = overtimeStatus?.dailyOT;
										const showWeeklyOT = overtimeStatus?.weeklyOT;

										return (
											<tr key={log.id}>
												<td>
													<div className="flex items-center gap-2">
														<span>{log.Employee.name}</span>
														{showDailyOT && (
															<span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
																Daily OT
															</span>
														)}
														{showWeeklyOT && (
															<span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
																Weekly OT
															</span>
														)}
													</div>
												</td>
												<td>
													<span
														className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${log.type === "WORK" ? "bg-blue-100 text-blue-800" : "bg-yellow-100 text-yellow-800"}`}
													>
														{log.type}
													</span>
												</td>
												<td>{log.Station?.name || "N/A"}</td>
												<td>{new Date(log.startTime).toLocaleTimeString()}</td>
												<td>{log.endTime ? new Date(log.endTime).toLocaleTimeString() : "-"}</td>
												<td className="font-mono text-sm">
													{calculateDuration(log.startTime, log.endTime)}
												</td>
												<td>
													<div className="flex gap-1">
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
						<div className="border-t my-4"></div>
						<div className="flex justify-end">
							<div className="grid grid-cols-3 gap-4 bg-accent rounded-lg p-4 shadow">
								<div>
									<div className="text-xs font-medium text-muted-foreground">
										Gross Hours (Work)
									</div>
									<div className="text-2xl font-bold text-foreground">{grossHours.toFixed(2)}</div>
								</div>
								<div>
									<div className="text-xs font-medium text-muted-foreground">Break Hours</div>
									<div className="text-2xl font-bold text-foreground">{breakHours.toFixed(2)}</div>
								</div>
								<div>
									<div className="text-xs font-medium text-muted-foreground">
										Net Hours
										{showOvertimeWarning && (
											<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 ml-2">
												Overtime
											</span>
										)}
									</div>
									<div className="text-2xl font-bold text-foreground">{netHours.toFixed(2)}</div>
									{selectedEmployee && (
										<div className="text-xs text-muted-foreground">Daily limit: {dailyLimit}h</div>
									)}
								</div>
							</div>
						</div>
					</>
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
}) {
	const [kioskEnabled, setKioskEnabled] = useKioskMode();
	const pinInputRef = useRef<HTMLInputElement | null>(null);

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

	return (
		<KioskContext.Provider value={contextValue}>
			<div className="mb-6 flex justify-end items-center">
				<Button type="button" variant="primary" onPress={() => setKioskEnabled(!kioskEnabled)}>
					{kioskEnabled ? "Disable Kiosk Mode" : "Enable Kiosk Mode"}
				</Button>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
				<ClockInForm
					employees={employees}
					stations={stations}
					pinInputRef={pinInputRef}
					onOptimisticClockIn={addOptimisticLog}
				/>
				<ActiveSessions
					activeLogs={optimisticLogs}
					activeBreaks={activeBreaks}
					activeTasksByEmployee={activeTasksByEmployee}
					assignmentMode={assignmentMode}
					taskOptions={taskOptions}
				/>
			</div>
			<Suspense fallback={<TimeHistoryFallback />}>
				<DeferredTimeHistory
					completedLogs={completedLogs}
					completedLogsPromise={completedLogsPromise}
					stations={stations}
					employees={employees}
				/>
			</Suspense>
			{notifications.length > 0 && (
				<div className="fixed bottom-4 right-4 space-y-2 z-50">
					{notifications.map((note) => (
						<Alert
							key={note.id}
							variant={
								note.type === "success" ? "success" : note.type === "error" ? "error" : "warning"
							}
							className="relative"
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

	return <TimeHistory completedLogs={resolvedCompletedLogs} stations={stations} employees={employees} />;
}

function TimeHistoryFallback() {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Time History</CardTitle>
			</CardHeader>
			<CardBody>
				<div className="space-y-3">
					<div className="h-10 rounded-[2px] border border-border bg-muted/20 animate-pulse" />
					<div className="h-10 rounded-[2px] border border-border bg-muted/20 animate-pulse" />
					<div className="h-48 rounded-[2px] border border-border bg-muted/20 animate-pulse" />
				</div>
			</CardBody>
		</Card>
	);
}
