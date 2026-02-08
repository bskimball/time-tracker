"use client";

import { useState } from "react";
import type React from "react";
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
import type { Employee } from "@prisma/client";

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
	employees: Employee[];
	stations: { id: string; name: string }[];
}

export function TimesheetManager({ initialLogs, employees, stations }: TimesheetProps) {
	const logs = initialLogs;
	const [showCorrectionForm, setShowCorrectionForm] = useState(false);
	const [activeTab, setActiveTab] = useState<"logs" | "corrections" | "active">("logs");

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

	return (
		<div className="space-y-6">
			<PageHeader
				title="Timesheet Management"
				subtitle="View and manage employee time entries and corrections"
				actions={
					<Button onClick={() => setShowCorrectionForm(true)} variant="primary">
						Add Time Entry
					</Button>
				}
			/>

			<Tabs
				selectedKey={activeTab}
				onSelectionChange={(key: React.Key) => setActiveTab(key as typeof activeTab)}
			>
				<TabList aria-label="Timesheet sections">
					<Tab id="logs">Current Time Logs</Tab>
					<Tab id="corrections">Corrections History</Tab>
					<Tab id="active">Active Employees</Tab>
				</TabList>

				<TabPanel id="logs">
					<Card>
						<CardHeader>
							<CardTitle>Time Logs</CardTitle>
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
															<Button size="sm" variant="outline">
																End Shift
															</Button>
														)}
														<Button size="sm" variant="outline">
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
						</CardBody>
					</Card>
				</TabPanel>

				<TabPanel id="corrections">
					<Card>
						<CardHeader>
							<CardTitle>Correction History</CardTitle>
						</CardHeader>
						<CardBody>
							<div className="space-y-3">
								<p className="text-sm text-muted-foreground">
									Showing manual corrections and modifications made by managers
								</p>
								{logs
									.filter((log) => log.clockMethod === "MANUAL")
									.map((log) => (
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
								{logs.filter((log) => log.clockMethod === "MANUAL").length === 0 && (
									<p className="text-center text-muted-foreground py-6">No corrections found</p>
								)}
							</div>
						</CardBody>
					</Card>
				</TabPanel>

				<TabPanel id="active">
					<Card>
						<CardHeader>
							<CardTitle>Currently Clocked In</CardTitle>
						</CardHeader>
						<CardBody>
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
								{logs
									.filter((log) => !log.endTime && log.type === "WORK")
									.map((log) => (
										<div key={log.id} className="border rounded p-4">
											<h4 className="font-medium">{log.Employee.name}</h4>
											<p className="text-sm text-muted-foreground">Station: {log.Station?.name}</p>
											<p className="text-sm text-muted-foreground">
												Started: {new Date(log.startTime).toLocaleTimeString()}
											</p>
											<p className="text-sm font-medium mt-2">
												Duration: {formatDuration(log.startTime, null)}
											</p>
											<div className="mt-3 space-x-2">
												<Button size="sm" variant="outline">
													End Shift
												</Button>
											</div>
										</div>
									))}
							</div>

							{logs.filter((log) => !log.endTime && log.type === "WORK").length === 0 && (
								<p className="text-center text-muted-foreground py-6">
									No employees currently clocked in
								</p>
							)}
						</CardBody>
					</Card>
				</TabPanel>
			</Tabs>

			{showCorrectionForm && (
				<TimeCorrectionForm
					employees={employees}
					stations={stations}
					onClose={() => setShowCorrectionForm(false)}
					onSubmit={async (data) => {
						console.log("Submitting correction:", data);
						setShowCorrectionForm(false);
					}}
				/>
			)}
		</div>
	);
}

// Time Correction Form Component
function TimeCorrectionForm({
	employees,
	stations,
	onClose,
	onSubmit,
}: {
	employees: Employee[];
	stations: { id: string; name: string }[];
	onClose: () => void;
	onSubmit: (data: TimeCorrectionPayload) => Promise<void>;
}) {
	const [formData, setFormData] = useState({
		employeeId: "",
		startTime: "",
		endTime: "",
		stationId: "",
		type: "WORK" as "WORK" | "BREAK",
		note: "",
		reason: "",
	});

	const [isSubmitting, setIsSubmitting] = useState(false);

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
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overscroll-behavior-contain" aria-live="polite">
			<Card className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto overscroll-contain">
				<CardHeader>
					<CardTitle>Add Time Entry</CardTitle>
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
							onChange={(val) =>
								setFormData((prev) => ({ ...prev, employeeId: val ?? "" }))
							}
							placeholder="Select an employee…"
							isRequired
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
							onChange={(val) =>
								setFormData((prev) => ({ ...prev, stationId: val ?? "" }))
							}
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
								{isSubmitting ? "Adding…" : "Add Entry"}
							</Button>
						</div>
					</form>
				</CardBody>
			</Card>
		</div>
	);
}
