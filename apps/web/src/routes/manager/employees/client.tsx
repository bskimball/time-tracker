"use client";

import { useState } from "react";
import { Link, useNavigate } from "react-router";
import {
	Button,
	Input,
	Card,
	CardHeader,
	CardTitle,
	CardBody,
	Select,
	Badge,
} from "@monorepo/design-system";
import { PageHeader } from "~/components/page-header";

type EmployeeStatus = "ACTIVE" | "INACTIVE" | "ON_LEAVE" | "TERMINATED";

type EmployeeWithDetails = {
	id: string;
	name: string;
	email: string;
	pinHash: string | null;
	lastStationId: string | null;
	dailyHoursLimit: number | null;
	weeklyHoursLimit: number | null;
	employeeCode: string | null;
	phoneNumber: string | null;
	hireDate: Date | null;
	status: EmployeeStatus;
	defaultStationId: string | null;
	createdAt: Date;
	updatedAt: Date;
	defaultStation: { id: string; name: string } | null;
	lastStation: { id: string; name: string } | null;
	User?: { role: string } | null;
	_count: { TimeLog: number };
};

interface EmployeeRosterProps {
	initialEmployees: EmployeeWithDetails[];
	total: number;
	totalPages: number;
	currentPage: number;
	search?: string;
	status?: EmployeeStatus;
	stations: Array<{ id: string; name: string }>;
}

export function EmployeeRoster({
	initialEmployees,
	total,
	totalPages,
	currentPage,
	search: initialSearch = "",
	status: initialStatus,
	stations,
}: EmployeeRosterProps) {
	const navigate = useNavigate();
	const [employees] = useState(initialEmployees);
	const [search, setSearch] = useState(initialSearch);
	const [status, setStatus] = useState<EmployeeStatus | undefined>(initialStatus);
	const [page, setPage] = useState(currentPage);
	const [loading, setLoading] = useState(false);

	const statusOptions = [
		{ value: "", label: "All Status" },
		{ value: "ACTIVE", label: "Active" },
		{ value: "INACTIVE", label: "Inactive" },
		{ value: "ON_LEAVE", label: "On Leave" },
		{ value: "TERMINATED", label: "Terminated" },
	];

	const handleSearch = async (newSearch?: string, newStatus?: EmployeeStatus, newPage = 1) => {
		setLoading(true);
		try {
			const params = new URLSearchParams();
			if (newSearch || search) params.set("search", newSearch || search);
			if (newStatus || status) params.set("status", (newStatus || status)?.toString() || "");
			if (newPage > 1) params.set("page", newPage.toString());

			navigate(`/manager/employees?${params.toString()}`);
		} catch (error) {
			console.error("Search failed:", error);
		} finally {
			setLoading(false);
		}
	};

	const getStatusBadge = (status: EmployeeStatus) => {
		const variants: Record<EmployeeStatus, "success" | "secondary" | "primary" | "destructive"> = {
			ACTIVE: "success",
			INACTIVE: "secondary",
			ON_LEAVE: "primary",
			TERMINATED: "destructive",
		};

		return <Badge variant={variants[status]}>{status.replace("_", " ")}</Badge>;
	};

	const getStationName = (stationId: string | null) => {
		return stations.find((s) => s.id === stationId)?.name || "Unassigned";
	};

	return (
		<div className="space-y-6">
			<PageHeader
				title="Employee Management"
				subtitle={`${total} employees in the system`}
				actions={
					<Link to="/manager/employees/new">
						<Button variant="primary">Add Employee</Button>
					</Link>
				}
			/>

			{/* Search and Filters */}
			<Card>
				<CardHeader>
					<CardTitle className="uppercase tracking-wide text-base">Employee Search</CardTitle>
				</CardHeader>
				<CardBody>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<Input
							name="search"
							autoComplete="off"
							label="Search"
							placeholder="Search by name, email, or code…"
							value={search}
							onChange={(e) => {
								setSearch(e.target.value);
							}}
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									handleSearch();
								}
							}}
						/>

						<Select
							name="status"
							options={statusOptions}
							label="Status"
							value={status || ""}
							onChange={(value: string) => setStatus(value ? (value as EmployeeStatus) : undefined)}
							placeholder="All Status"
						/>

						<Button onClick={() => handleSearch()} variant="primary" disabled={loading}>
							{loading ? "Searching…" : "Search"}
						</Button>
					</div>
				</CardBody>
			</Card>

			{/* Results Summary */}
			<div className="flex justify-end items-center">
				<p className="text-sm text-muted-foreground">
					Showing {employees.length} of {total} employees
				</p>
			</div>

			{/* Employee List */}
			<Card>
				<CardBody className="p-0">
					{employees.length === 0 ? (
						<div className="text-center py-6">
							<p className="text-muted-foreground">No employees found.</p>
						</div>
					) : (
						<div className="overflow-x-auto">
							<table className="w-full">
								<thead>
									<tr className="border-b border-border bg-muted/20 text-xs font-heading uppercase tracking-wider text-muted-foreground">
										<th className="text-left p-4">Name</th>
										<th className="text-left p-4">Email</th>
										<th className="text-left p-4">Code</th>
										<th className="text-left p-4">Status</th>
										<th className="text-left p-4">Default Station</th>
										<th className="text-left p-4">Today's Activity</th>
										<th className="text-left p-4">Actions</th>
									</tr>
								</thead>
								<tbody>
									{employees.map((employee) => (
										<tr key={employee.id} className="border-b border-border hover:bg-muted/50">
											<td className="p-4">
												<div className="font-medium">{employee.name}</div>
											</td>
											<td className="p-4">{employee.email}</td>
											<td className="p-4">
												<code className="px-2 py-1 bg-muted rounded-[2px] text-sm font-mono tabular-nums">
													{employee.employeeCode}
												</code>
											</td>
											<td className="p-4">{getStatusBadge(employee.status)}</td>
											<td className="p-4">
												<span className="text-sm">{getStationName(employee.defaultStationId)}</span>
											</td>
											<td className="p-4">
												<div className="text-sm">{employee._count.TimeLog} time entries today</div>
											</td>
											<td className="p-4">
												<div className="flex space-x-2">
													<Link to={`/manager/employees/${employee.id}`}>
														<Button variant="outline" size="sm">
															View
														</Button>
													</Link>
													<Link to={`/manager/employees/${employee.id}/edit`}>
														<Button variant="outline" size="sm">
															Edit
														</Button>
													</Link>
												</div>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)}
				</CardBody>
			</Card>

			{/* Pagination */}
			{totalPages > 1 && (
				<div className="flex justify-center space-x-2">
					{Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
						<Button
							key={pageNum}
							variant={pageNum === page ? "primary" : "outline"}
							size="sm"
							onClick={() => {
								setPage(pageNum);
								handleSearch(search, status, pageNum);
							}}
						>
							{pageNum}
						</Button>
					))}
				</div>
			)}
		</div>
	);
}
