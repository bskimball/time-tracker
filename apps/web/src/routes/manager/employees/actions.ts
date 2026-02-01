"use server";

import { db } from "~/lib/db";
import bcrypt from "bcryptjs";
import { validateRequest } from "~/lib/auth";
import { EmployeeStatus } from "@prisma/client";
import type { Prisma } from "@prisma/client";

export async function getEmployees(search?: string, status?: EmployeeStatus, page = 1, limit = 25) {
	const skip = (page - 1) * limit;
	const where: Prisma.EmployeeWhereInput = {};

	if (search) {
		where.OR = [
			{ name: { contains: search, mode: "insensitive" } },
			{ email: { contains: search, mode: "insensitive" } },
			{ employeeCode: { contains: search, mode: "insensitive" } },
		];
	}

	if (status) {
		where.status = status;
	}

	const [employees, total] = await Promise.all([
		db.employee.findMany({
			where,
			include: {
				defaultStation: true,
				lastStation: true,
				User: {
					select: {
						role: true,
					},
				},
				_count: {
					select: {
						TimeLog: {
							where: {
								startTime: {
									gte: new Date(new Date().setHours(0, 0, 0, 0)),
								},
							},
						},
					},
				},
			},
			orderBy: { name: "asc" },
			skip,
			take: limit,
		}),
		db.employee.count({ where }),
	]);

	return { employees, total, totalPages: Math.ceil(total / limit) };
}

export async function getEmployeeById(id: string) {
	return await db.employee.findUnique({
		where: { id },
		include: {
			defaultStation: true,
			lastStation: true,
			User: {
				select: {
					id: true,
					email: true,
					name: true,
					role: true,
				},
			},
			TimeLog: {
				where: {
					startTime: {
						gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
					},
					deletedAt: null,
				},
				include: {
					Station: true,
				},
				orderBy: { startTime: "desc" },
				take: 50,
			},
			TaskAssignment: {
				where: {
					startTime: {
						gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
					},
				},
				include: {
					TaskType: true,
				},
				orderBy: { startTime: "desc" },
				take: 25,
			},
		},
	});
}

export async function createEmployee(data: {
	name: string;
	email: string;
	phoneNumber?: string;
	pin?: string;
	defaultStationId?: string;
	dailyHoursLimit?: number;
	weeklyHoursLimit?: number;
	status?: EmployeeStatus;
}) {
	const { user } = await validateRequest();
	if (!user) {
		throw new Error("Unauthorized");
	}

	// Check if email already exists
	const existingEmployee = await db.employee.findUnique({
		where: { email: data.email },
	});

	if (existingEmployee) {
		throw new Error("Email already in use");
	}

	// Generate employee code if not provided
	const employeeCode =
		data.name
			.toLowerCase()
			.replace(/[^a-z0-9]/g, "")
			.substring(0, 3)
			.toUpperCase() + Math.floor(Math.random() * 1000);

	// Hash PIN if provided
	let pinHash = null;
	if (data.pin && data.pin.length >= 4) {
		pinHash = await bcrypt.hash(data.pin, 12);
	}

	const employee = await db.employee.create({
		data: {
			name: data.name,
			email: data.email,
			phoneNumber: data.phoneNumber,
			pinHash,
			defaultStationId: data.defaultStationId,
			dailyHoursLimit: data.dailyHoursLimit || 8.0,
			weeklyHoursLimit: data.weeklyHoursLimit || 40.0,
			status: data.status || "ACTIVE",
			employeeCode,
		},
	});

	return employee;
}

export async function updateEmployee(
	id: string,
	data: {
		name?: string;
		email?: string;
		phoneNumber?: string;
		pin?: string;
		defaultStationId?: string;
		dailyHoursLimit?: number;
		weeklyHoursLimit?: number;
		status?: EmployeeStatus;
	}
) {
	const { user } = await validateRequest();
	if (!user) {
		throw new Error("Unauthorized");
	}

	const { pin, ...rest } = data;
	const updateData: Prisma.EmployeeUpdateInput = { ...rest };

	// Handle PIN update separately
	if (pin !== undefined) {
		if (pin.length >= 4) {
			updateData.pinHash = await bcrypt.hash(pin, 12);
		} else if (pin === "") {
			updateData.pinHash = null; // Remove PIN
		}
	}

	// Check if email is being changed and if it conflicts
	if (data.email) {
		const existingEmployee = await db.employee.findFirst({
			where: {
				email: data.email,
				NOT: { id },
			},
		});

		if (existingEmployee) {
			throw new Error("Email already in use");
		}
	}

	const employee = await db.employee.update({
		where: { id },
		data: updateData,
	});

	return employee;
}

export async function deleteEmployee(id: string) {
	const { user } = await validateRequest();
	if (!user) {
		throw new Error("Unauthorized");
	}

	// Check if employee has active time logs
	const activeTimeLog = await db.timeLog.findFirst({
		where: {
			employeeId: id,
			endTime: null,
		},
	});

	if (activeTimeLog) {
		throw new Error("Cannot delete employee with active time log");
	}

	// Soft delete by setting status to TERMINATED
	await db.employee.update({
		where: { id },
		data: {
			status: "TERMINATED",
			pinHash: null, // Remove PIN access
		},
	});

	return { success: true };
}

export async function getEmployeesCurrentlyClockedIn() {
	const activeLogs = await db.timeLog.findMany({
		where: {
			endTime: null,
			type: "WORK",
			deletedAt: null,
		},
		include: {
			Employee: {
				include: {
					defaultStation: true,
					lastStation: true,
				},
			},
			Station: true,
		},
		orderBy: { startTime: "desc" },
	});

	return activeLogs;
}

export async function getStations() {
	return await db.station.findMany({
		where: { isActive: true },
		orderBy: { name: "asc" },
	});
}
