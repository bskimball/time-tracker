"use client";

import { Suspense, use, useEffect, useState } from "react";
import type React from "react";
import { useNavigate } from "react-router";
import { parseAsStringEnum, useQueryState } from "nuqs";
import {
	Button,
	Input,
	Card,
	CardHeader,
	CardTitle,
	CardBody,
	Tabs,
	TabList,
	Tab,
	TabPanel,
	SimpleSelect,
	Badge,
} from "@monorepo/design-system";
import { PageHeader } from "~/components/page-header";
import { cn } from "~/lib/cn";
import type { Employee } from "@prisma/client";
import { createTimeCorrection, editTimeCorrection, closeTimeLog } from "./actions";

type TimeLogWithDetails = {
	id: string;
	startTime: Date;
	endTime: Date | null;
	type: "WORK" | "BREAK";
	note: string | null;
	deletedAt: Date | null;
	correctedBy: string | null;
	taskId: string | null;
	clockMethod: "PIN" | "CARD" | "BIOMETRIC" | "MANUAL";
	createdAt: Date;
	updatedAt: Date;
	Employee: Employee;
	Station: { id: string; name: string } | null;
};

type TimeCorrectionPayload = {
	employeeId: string;
	startTime: Date;
	endTime?: Date;
	stationId?: string;
	type: "WORK" | "BREAK";
	note?: string;
	reason: string;
};

interface TimesheetProps {
	initialLogs: TimeLogWithDetails[];
	pagination: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
	};
	correctionHistory?: TimeLogWithDetails[];
	correctionHistoryPromise?: Promise<TimeLogWithDetails[]>;
	clockedInEmployees: {
		employeeId: string;
		employeeName: string;
		employeeEmail: string;
		startTime: Date;
		stationName: string | null;
		type: "WORK" | "BREAK" | "TASK";
		source: "TIME_LOG" | "TASK_ASSIGNMENT";
		assignmentSource: "MANAGER" | "WORKER" | null;
		clockMethod: "PIN" | "CARD" | "BIOMETRIC" | "MANUAL" | null;
		timeLogId: string | null;
		taskTypeName: string | null;
	}[];
	floorActiveEmployees: {
		employeeId: string;
		employeeName: string;
		employeeEmail: string;
		startTime: Date;
		stationName: string | null;
		type: "WORK" | "BREAK" | "TASK";
		source: "TIME_LOG" | "TASK_ASSIGNMENT";
		assignmentSource: "MANAGER" | "WORKER" | null;
		clockMethod: "PIN" | "CARD" | "BIOMETRIC" | "MANUAL" | null;
		timeLogId: string | null;
		taskTypeName: string | null;
	}[];
	employees: Employee[];
	stations: { id: string; name: string }[];
}

const formatDateTimeLocal = (value: Date | string | null) => {
	if (!value) return "";
	const date = value instanceof Date ? value : new Date(value);
	if (Number.isNaN(date.getTime())) return "";

	const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
	return local.toISOString().slice(0, 16);
};

export function TimesheetManager({
	initialLogs,
	pagination,
	correctionHistory,
	correctionHistoryPromise,
	clockedInEmployees,
	floorActiveEmployees,
	employees,
	stations,
}: TimesheetProps) {
	const tabValues = ["logs", "corrections", "active"] as const;
	type TimesheetTab = (typeof tabValues)[number];

	const navigate = useNavigate();
	const logs = initialLogs;
	const totalPages = Math.max(pagination.totalPages, 1);
	const hasPreviousPage = pagination.page > 1;
	const hasNextPage = pagination.page < totalPages;
	const [showCorrectionForm, setShowCorrectionForm] = useState(false);
	const [editingLog, setEditingLog] = useState<TimeLogWithDetails | null>(null);
	const [activeTab, setActiveTab] = useQueryState(
		"tab",
		parseAsStringEnum([...tabValues]).withDefault("logs")
	);

	const refreshLogs = () => {
		navigate(0);
	};

	const goToPage = (nextPage: number) => {
		const safePage = Math.max(1, Math.min(nextPage, totalPages));
		const params = new URLSearchParams();
		params.set("page", String(safePage));
		params.set("tab", activeTab);
		navigate(`/manager/timesheets?${params.toString()}`);
	};

	const formatDuration = (start: Date, end: Date | null) => {
		if (!end) return "In Progress";
		const diff = end.getTime() - start.getTime();
		const hours = Math.floor(diff / (1000 * 60 * 60));
		const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
		return `${hours}h ${minutes}m`;
	};

	const getMethodBadge = (method: string) => {
		const variants: Record<string, "secondary" | "success" | "primary" | "outline"> = {
			PIN: "secondary",
			CARD: "success",
			BIOMETRIC: "primary",
			MANUAL: "outline",
		};

		return <Badge variant={variants[method] || "outline"}>{method}</Badge>;
	};

	const getTaskSourceBadge = (
		source: "TIME_LOG" | "TASK_ASSIGNMENT",
		assignmentSource: "MANAGER" | "WORKER" | null
	) => {
		if (source === "TASK_ASSIGNMENT" && assignmentSource === "WORKER") {
			return (
				<Badge variant="outline" className="font-mono text-[10px] uppercase">
					Self-assigned
				</Badge>
			);
		}

		if (source === "TASK_ASSIGNMENT") {
			return (
				<Badge variant="secondary" className="font-mono text-[10px] uppercase">
					Assigned by Manager
				</Badge>
			);
		}

		return (
			<Badge variant="outline" className="font-mono text-[10px] uppercase">
				Time Log
			</Badge>
		);
	};

	const handleEndShift = async (logId: string) => {
		await closeTimeLog(logId);
		refreshLogs();
	};

	const handleCorrectionSubmit = async (data: TimeCorrectionPayload) => {
		if (editingLog) {
			await editTimeCorrection(editingLog.id, {
				startTime: data.startTime,
				endTime: data.endTime,
				stationId: data.stationId,
				type: data.type,
				note: data.note,
				reason: data.reason,
			});
		} else {
			await createTimeCorrection(data);
		}

		setShowCorrectionForm(false);
		setEditingLog(null);
		refreshLogs();
	};

	const assignedNotClockedInCount = floorActiveEmployees.filter(
		(entry) => entry.source === "TASK_ASSIGNMENT"
	).length;

	return (
		<div className="space-y-6">
			<PageHeader
				title="Timesheet Management"
				subtitle="View and manage employee time entries and corrections"
				actions={
					<Button
						onClick={() => {
							setEditingLog(null);
							setShowCorrectionForm(true);
						}}
						variant="primary"
					>
						Add Time Entry
					</Button>
				}
			/>

			<Tabs
				selectedKey={activeTab}
				onSelectionChange={(key: React.Key) => void setActiveTab(key.toString() as TimesheetTab)}
			>
				<TabList
					aria-label="Timesheet sections"
					className="mb-4 inline-flex w-auto justify-start gap-1 rounded-[2px] border border-border/40 bg-card p-0.5"
				>
					<Tab
						id="logs"
						className={({ isSelected }) =>
							cn(
								"flex h-7 items-center justify-center rounded-[2px] px-3 text-xs font-bold uppercase tracking-widest transition-all outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
								isSelected
									? "bg-primary text-primary-foreground shadow-sm"
									: "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
							)
						}
					>
						Current Time Logs
					</Tab>
					<Tab
						id="corrections"
						className={({ isSelected }) =>
							cn(
								"flex h-7 items-center justify-center rounded-[2px] px-3 text-xs font-bold uppercase tracking-widest transition-all outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
								isSelected
									? "bg-primary text-primary-foreground shadow-sm"
									: "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
							)
						}
					>
						Corrections History
					</Tab>
					<Tab
						id="active"
						className={({ isSelected }) =>
							cn(
								"flex h-7 items-center justify-center rounded-[2px] px-3 text-xs font-bold uppercase tracking-widest transition-all outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
								isSelected
									? "bg-primary text-primary-foreground shadow-sm"
									: "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
							)
						}
					>
						Active Employees
					</Tab>
				</TabList>

				<TabPanel id="logs">
					<Card>
						<CardHeader>
							<div className="flex flex-wrap items-center justify-between gap-3">
								<CardTitle>Time Logs</CardTitle>
								<div className="text-xs text-muted-foreground font-mono uppercase tracking-widest">
									Page {pagination.page} of {totalPages} -{" "}
									{pagination.total} records
								</div>
							</div>
						</CardHeader>
						<CardBody>
							<div className="overflow-x-auto">
								<table className="w-full">
									<thead>
										<tr className="border-b border-border bg-muted/20 text-xs font-heading uppercase tracking-wider text-muted-foreground">
											<th className="text-left p-4">Employee</th>
											<th className="text-left p-4">Type</th>
											<th className="text-left p-4">Station</th>
											<th className="text-left p-4">Start Time</th>
											<th className="text-left p-4">End Time</th>
											<th className="text-left p-4">Duration</th>
											<th className="text-left p-4">Method</th>
											<th className="text-left p-4">Actions</th>
										</tr>
									</thead>
									<tbody>
										{logs.map((log) => (
											<tr key={log.id} className="border-b border-border hover:bg-muted/50">
												<td className="p-4">
													<div>
														<p className="font-medium">{log.Employee.name}</p>
														<p className="text-sm text-muted-foreground">{log.Employee.email}</p>
													</div>
												</td>
												<td className="p-4">
													<Badge variant={log.type === "WORK" ? "success" : "secondary"}>
														{log.type}
													</Badge>
												</td>
												<td className="p-4">{log.Station?.name || "None"}</td>
												<td className="p-4">
													<div>
														<p>{new Date(log.startTime).toLocaleDateString()}</p>
														<p className="text-sm text-muted-foreground">
															{new Date(log.startTime).toLocaleTimeString()}
														</p>
													</div>
												</td>
												<td className="p-4">
													{log.endTime ? (
														<div>
															<p>{new Date(log.endTime).toLocaleDateString()}</p>
															<p className="text-sm text-muted-foreground">
																{new Date(log.endTime).toLocaleTimeString()}
															</p>
														</div>
													) : (
														<Badge variant="primary">Active</Badge>
													)}
												</td>
												<td className="p-4">{formatDuration(log.startTime, log.endTime)}</td>
												<td className="p-4">{getMethodBadge(log.clockMethod)}</td>
												<td className="p-4">
													<div className="flex space-x-2">
														{!log.endTime && (
															<Button
																size="sm"
																variant="outline"
																onClick={() => handleEndShift(log.id)}
															>
																End Shift
															</Button>
														)}
														<Button
															size="sm"
															variant="outline"
															onClick={() => {
																setEditingLog(log);
																setShowCorrectionForm(true);
															}}
														>
															Edit
														</Button>
													</div>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>

							{logs.length === 0 && (
								<div className="text-center py-6">
									<p className="text-muted-foreground">No time logs found</p>
								</div>
							)}

							{totalPages > 1 && (
								<div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border/50 pt-4">
									<p className="text-xs text-muted-foreground">
										Showing up to {pagination.limit} logs per page
									</p>
									<div className="flex items-center gap-2">
										<Button
											variant="outline"
											size="sm"
											disabled={!hasPreviousPage}
											onClick={() => goToPage(pagination.page - 1)}
										>
											Previous
										</Button>
										<span className="font-mono text-xs text-muted-foreground px-2">
											{pagination.page} / {totalPages}
										</span>
										<Button
											variant="outline"
											size="sm"
											disabled={!hasNextPage}
											onClick={() => goToPage(pagination.page + 1)}
										>
											Next
										</Button>
									</div>
								</div>
							)}
						</CardBody>
					</Card>
				</TabPanel>

				<TabPanel id="corrections">
					<Card>
						<CardHeader>
							<CardTitle>Correction History</CardTitle>
						</CardHeader>
						<CardBody>
							<Suspense fallback={<CorrectionHistoryFallback />}>
								<DeferredCorrectionHistory
									correctionHistory={correctionHistory}
									correctionHistoryPromise={correctionHistoryPromise}
								/>
							</Suspense>
						</CardBody>
					</Card>
				</TabPanel>

				<TabPanel id="active">
					<div className="space-y-4">
						<div className="grid gap-4 md:grid-cols-3">
							<Card>
								<CardBody>
									<p className="text-xs font-heading uppercase tracking-wider text-muted-foreground">
										Clocked In
									</p>
									<p className="mt-2 text-2xl font-mono tabular-nums">
										{clockedInEmployees.length}
									</p>
									<p className="text-xs text-muted-foreground">
										Employees with an active WORK/BREAK log
									</p>
								</CardBody>
							</Card>
							<Card>
								<CardBody>
									<p className="text-xs font-heading uppercase tracking-wider text-muted-foreground">
										Assigned/On Floor
									</p>
									<p className="mt-2 text-2xl font-mono tabular-nums">
										{floorActiveEmployees.length}
									</p>
									<p className="text-xs text-muted-foreground">
										Clocked-in workers plus employees with active task assignments
									</p>
								</CardBody>
							</Card>
							<Card>
								<CardBody>
									<p className="text-xs font-heading uppercase tracking-wider text-muted-foreground">
										Assigned Not Clocked In
									</p>
									<p className="mt-2 text-2xl font-mono tabular-nums">
										{assignedNotClockedInCount}
									</p>
									<p className="text-xs text-muted-foreground">
										Employees with open task assignments but no active WORK/BREAK log
									</p>
								</CardBody>
							</Card>
						</div>

						<Card>
							<CardHeader>
								<CardTitle>Clocked In</CardTitle>
							</CardHeader>
							<CardBody>
								<div className="overflow-x-auto">
									<table className="w-full">
										<thead>
											<tr className="border-b border-border bg-muted/20 text-xs font-heading uppercase tracking-wider text-muted-foreground">
												<th className="p-4 text-left">Employee</th>
												<th className="p-4 text-left">Type</th>
												<th className="p-4 text-left">Station</th>
												<th className="p-4 text-left">Started</th>
												<th className="p-4 text-left">Duration</th>
												<th className="p-4 text-left">Method</th>
												<th className="p-4 text-left">Actions</th>
											</tr>
										</thead>
										<tbody>
											{clockedInEmployees.map((entry) => {
												const logId = entry.timeLogId;

												return (
													<tr
														key={entry.employeeId}
														className="border-b border-border hover:bg-muted/50"
													>
														<td className="p-4">
															<div>
																<p className="font-medium">{entry.employeeName}</p>
																<p className="text-sm text-muted-foreground">
																	{entry.employeeEmail}
																</p>
															</div>
														</td>
														<td className="p-4">
															<Badge variant={entry.type === "WORK" ? "success" : "secondary"}>
																{entry.type}
															</Badge>
														</td>
														<td className="p-4">{entry.stationName || "None"}</td>
														<td className="p-4">
															{new Date(entry.startTime).toLocaleTimeString()}
														</td>
														<td className="p-4 font-mono">
															{formatDuration(entry.startTime, null)}
														</td>
														<td className="p-4">
															{entry.clockMethod ? getMethodBadge(entry.clockMethod) : "-"}
														</td>
														<td className="p-4">
															{logId ? (
																<Button
																	size="sm"
																	variant="outline"
																	onClick={() => handleEndShift(logId)}
																>
																	End Shift
																</Button>
															) : (
																<span className="text-xs text-muted-foreground">-</span>
															)}
														</td>
													</tr>
												);
											})}
										</tbody>
									</table>
								</div>

								{clockedInEmployees.length === 0 && (
									<p className="py-6 text-center text-muted-foreground">
										No employees currently clocked in
									</p>
								)}
							</CardBody>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Assigned/On Floor</CardTitle>
							</CardHeader>
							<CardBody>
								<div className="overflow-x-auto">
									<table className="w-full">
										<thead>
											<tr className="border-b border-border bg-muted/20 text-xs font-heading uppercase tracking-wider text-muted-foreground">
												<th className="p-4 text-left">Employee</th>
												<th className="p-4 text-left">Status</th>
												<th className="p-4 text-left">Station/Task</th>
												<th className="p-4 text-left">Started</th>
												<th className="p-4 text-left">Duration</th>
												<th className="p-4 text-left">Source</th>
											</tr>
										</thead>
										<tbody>
											{floorActiveEmployees.map((entry) => (
												<tr
													key={entry.employeeId}
													className="border-b border-border hover:bg-muted/50"
												>
													<td className="p-4">
														<div>
															<p className="font-medium">{entry.employeeName}</p>
															<p className="text-sm text-muted-foreground">{entry.employeeEmail}</p>
														</div>
													</td>
													<td className="p-4">
														<Badge variant={entry.type === "WORK" ? "success" : "outline"}>
															{entry.type === "WORK" ? "WORK" : "ASSIGNED"}
														</Badge>
													</td>
													<td className="p-4">
														{entry.stationName || entry.taskTypeName || "None"}
													</td>
													<td className="p-4">{new Date(entry.startTime).toLocaleTimeString()}</td>
													<td className="p-4 font-mono">{formatDuration(entry.startTime, null)}</td>
													<td className="p-4">
														{getTaskSourceBadge(entry.source, entry.assignmentSource)}
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>

								{floorActiveEmployees.length === 0 && (
									<p className="py-6 text-center text-muted-foreground">
										No employees currently floor active
									</p>
								)}
							</CardBody>
						</Card>
					</div>
				</TabPanel>
			</Tabs>

			{showCorrectionForm && (
				<TimeCorrectionForm
					employees={employees}
					stations={stations}
					initialLog={editingLog}
					onClose={() => {
						setShowCorrectionForm(false);
						setEditingLog(null);
					}}
					onSubmit={handleCorrectionSubmit}
				/>
			)}
		</div>
	);
}

function DeferredCorrectionHistory({
	correctionHistory,
	correctionHistoryPromise,
}: {
	correctionHistory?: TimeLogWithDetails[];
	correctionHistoryPromise?: Promise<TimeLogWithDetails[]>;
}) {
	const resolvedCorrectionHistory = correctionHistoryPromise
		? use(correctionHistoryPromise)
		: (correctionHistory ?? []);

	return (
		<div className="space-y-3">
			<p className="text-sm text-muted-foreground">
				Showing manual corrections and modifications made by managers
			</p>
			{resolvedCorrectionHistory.map((log) => (
				<div key={log.id} className="border border-border rounded-[2px] p-4 bg-muted/30">
					<div className="flex justify-between items-start">
						<div>
							<h4 className="font-medium">
								{log.Employee.name} - {log.type}
							</h4>
							<p className="text-sm text-muted-foreground">
								{new Date(log.startTime).toLocaleString()}
								{log.endTime && ` - ${new Date(log.endTime).toLocaleString()}`}
							</p>
							<p className="text-sm mt-2">{log.note}</p>
						</div>
						<Badge variant="primary">Correction</Badge>
					</div>
				</div>
			))}
			{resolvedCorrectionHistory.length === 0 && (
				<p className="text-center text-muted-foreground py-6">No corrections found</p>
			)}
		</div>
	);
}

function CorrectionHistoryFallback() {
	return (
		<div className="space-y-2">
			<div className="h-10 rounded-[2px] border border-border bg-muted/20 animate-pulse" />
			<div className="h-16 rounded-[2px] border border-border bg-muted/20 animate-pulse" />
			<div className="h-16 rounded-[2px] border border-border bg-muted/20 animate-pulse" />
		</div>
	);
}

// Time Correction Form Component
function TimeCorrectionForm({
	employees,
	stations,
	initialLog,
	onClose,
	onSubmit,
}: {
	employees: Employee[];
	stations: { id: string; name: string }[];
	initialLog: TimeLogWithDetails | null;
	onClose: () => void;
	onSubmit: (data: TimeCorrectionPayload) => Promise<void>;
}) {
	const [formData, setFormData] = useState({
		employeeId: initialLog?.Employee.id ?? "",
		startTime: "",
		endTime: "",
		stationId: initialLog?.Station?.id ?? "",
		type: (initialLog?.type ?? "WORK") as "WORK" | "BREAK",
		note: initialLog?.note ?? "",
		reason: "",
	});

	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		if (!initialLog) {
			setFormData({
				employeeId: "",
				startTime: "",
				endTime: "",
				stationId: "",
				type: "WORK",
				note: "",
				reason: "",
			});
			return;
		}

		setFormData({
			employeeId: initialLog.Employee.id,
			startTime: formatDateTimeLocal(initialLog.startTime),
			endTime: formatDateTimeLocal(initialLog.endTime),
			stationId: initialLog.Station?.id ?? "",
			type: initialLog.type,
			note: initialLog.note ?? "",
			reason: "",
		});
	}, [initialLog]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			await onSubmit({
				...formData,
				startTime: new Date(formData.startTime),
				endTime: formData.endTime ? new Date(formData.endTime) : undefined,
			});
		} catch (error) {
			console.error("Error submitting correction:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div
			className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overscroll-behavior-contain"
			onClick={(event) => {
				if (event.target === event.currentTarget) {
					onClose();
				}
			}}
			aria-live="polite"
			role="dialog"
			aria-modal="true"
		>
			<Card className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto overscroll-contain">
				<CardHeader>
					<div className="flex items-center justify-between gap-3">
						<CardTitle>{initialLog ? "Edit Time Entry" : "Add Time Entry"}</CardTitle>
						<Button
							type="button"
							variant="ghost"
							size="sm"
							onClick={onClose}
							aria-label="Close dialog"
						>
							Close
						</Button>
					</div>
				</CardHeader>
				<CardBody>
					<form onSubmit={handleSubmit} className="space-y-4">
						<SimpleSelect
							label="Employee"
							options={employees.map((employee) => ({
								value: employee.id,
								label: employee.name,
							}))}
							value={formData.employeeId}
							onChange={(val) => setFormData((prev) => ({ ...prev, employeeId: val ?? "" }))}
							placeholder="Select an employee…"
							isRequired
							isDisabled={Boolean(initialLog)}
						/>

						<SimpleSelect
							label="Type"
							options={[
								{ value: "WORK", label: "Work" },
								{ value: "BREAK", label: "Break" },
							]}
							value={formData.type}
							onChange={(val) =>
								setFormData((prev) => ({ ...prev, type: (val as "WORK" | "BREAK") ?? "WORK" }))
							}
						/>

						<SimpleSelect
							label="Station (optional)"
							options={stations.map((station) => ({
								value: station.id,
								label: station.name,
							}))}
							value={formData.stationId}
							onChange={(val) => setFormData((prev) => ({ ...prev, stationId: val ?? "" }))}
							placeholder="Select a station…"
						/>

						<div>
							<Input
								label="Start Time"
								type="datetime-local"
								value={formData.startTime}
								onChange={(e) => setFormData((prev) => ({ ...prev, startTime: e.target.value }))}
								required
							/>
						</div>

						<div>
							<Input
								label="End Time (optional)"
								type="datetime-local"
								value={formData.endTime}
								onChange={(e) => setFormData((prev) => ({ ...prev, endTime: e.target.value }))}
							/>
						</div>

						<div>
							<Input
								label="Reason for correction"
								value={formData.reason}
								onChange={(e) => setFormData((prev) => ({ ...prev, reason: e.target.value }))}
								placeholder="Explain why this correction is needed…"
								required
							/>
						</div>

						<div>
							<Input
								label="Notes (optional)"
								value={formData.note}
								onChange={(e) => setFormData((prev) => ({ ...prev, note: e.target.value }))}
								placeholder="Additional context or details…"
							/>
						</div>

						<div className="flex justify-end space-x-2 pt-4 border-t border-border/50">
							<Button type="button" variant="outline" onClick={onClose}>
								Cancel
							</Button>
							<Button type="submit" variant="primary" disabled={isSubmitting}>
								{isSubmitting
									? initialLog
										? "Saving…"
										: "Adding…"
									: initialLog
										? "Save"
										: "Add Entry"}
							</Button>
						</div>
					</form>
				</CardBody>
			</Card>
		</div>
	);
}
