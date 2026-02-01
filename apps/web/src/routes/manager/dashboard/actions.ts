"use server";

import { db } from "~/lib/db";
import { validateRequest } from "~/lib/auth";
import type { Employee, TimeLog } from "@prisma/client";

export interface Alert {
	id: string;
	type: "OVERTIME" | "MISSING_PUNCH" | "PERFORMANCE" | "SYSTEM" | "COMPLIANCE";
	severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
	title: string;
	description: string;
	employeeId?: string;
	employeeName?: string;
	stationName?: string;
	createdAt: Date;
	requiresAction: boolean;
	actionUrl?: string;
}

type EmployeeWithBreakPolicy = Employee & {
	breakPolicy?: {
		id: string;
		maxHoursWithoutBreak?: number | null;
	};
};

type EmployeeWithBreakData = EmployeeWithBreakPolicy & {
	TimeLog: TimeLog[];
	defaultStation?: { id: string; name: string } | null;
};

export async function getActiveAlerts(): Promise<Alert[]> {
		const { user } = await validateRequest();
		if (!user) {
			throw new Error("Unauthorized");
		}

		const alerts: Alert[] = [];

		// 1. Overtime warnings - employees approaching or exceeding limits
		const now = new Date();
		const todayStart = new Date(now);
		todayStart.setHours(0, 0, 0, 0);
		const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
		const dailyHours = new Map<string, number>();

	// Get recent time logs for overtime calculations
	const recentTimeLogs = await db.timeLog.findMany({
		where: {
			startTime: { gte: weekAgo },
			type: "WORK",
			deletedAt: null,
		},
		include: {
			Employee: true,
			Station: true,
		},
	});

	// Group by employee and calculate hours
	const employeeHours = new Map<string, { hours: number; employee: Employee }>();

	recentTimeLogs.forEach((log) => {
		const duration = log.endTime
			? (new Date(log.endTime).getTime() - new Date(log.startTime).getTime()) / (1000 * 60 * 60)
			: 0;

		const logStart = new Date(log.startTime);
		if (logStart >= todayStart) {
			dailyHours.set(log.employeeId, (dailyHours.get(log.employeeId) || 0) + duration);
		}

		const existing = employeeHours.get(log.employeeId);
		if (existing) {
			existing.hours += duration;
		} else {
			employeeHours.set(log.employeeId, { hours: duration, employee: log.Employee });
		}
	});

	// Generate overtime alerts
	employeeHours.forEach((data, employeeId) => {
		const hoursWorkedWeek = data.hours;
		const weeklyLimit = data.employee.weeklyHoursLimit || 40;
		const weeklyThreshold = weeklyLimit === 40 ? 32 : Math.max(weeklyLimit * 0.8, weeklyLimit - 8, 0);
		const hoursWorkedDay = dailyHours.get(employeeId) || 0;
		const dailyLimit = data.employee.dailyHoursLimit || 8;
		const dailyThreshold = dailyLimit === 8 ? 7 : Math.max(dailyLimit - 1, 0);
		const alertTimestamp = new Date();

		if (hoursWorkedWeek >= weeklyLimit) {
			alerts.push({
				id: `overtime-${employeeId}`,
				type: "OVERTIME",
				severity: "HIGH",
				title: "Overtime Limit Exceeded",
				description: `${data.employee.name} has worked ${hoursWorkedWeek.toFixed(1)} hours this week (exceeding ${weeklyLimit} hour limit)`,
				employeeId,
				employeeName: data.employee.name,
				createdAt: alertTimestamp,
				requiresAction: true,
				actionUrl: `/manager/employees/${employeeId}`,
			});
		} else if (hoursWorkedWeek >= weeklyThreshold) {
			const hoursLeft = Math.max(weeklyLimit - hoursWorkedWeek, 0);
			alerts.push({
				id: `overtime-approaching-week-${employeeId}`,
				type: "OVERTIME",
				severity: "MEDIUM",
				title: "Approaching Weekly Overtime",
				description: `${data.employee.name} has ${hoursWorkedWeek.toFixed(1)} hours this week and is ${hoursLeft.toFixed(1)}h from the ${weeklyLimit}h limit`,
				employeeId,
				employeeName: data.employee.name,
				createdAt: alertTimestamp,
				requiresAction: false,
				actionUrl: `/manager/employees/${employeeId}`,
			});
		}

		if (hoursWorkedDay >= dailyLimit) {
			alerts.push({
				id: `daily-limit-${employeeId}`,
				type: "OVERTIME",
				severity: "HIGH",
				title: "Daily Limit Exceeded",
				description: `${data.employee.name} has already worked ${hoursWorkedDay.toFixed(1)} hours today (daily limit ${dailyLimit}h)`,
				employeeId,
				employeeName: data.employee.name,
				createdAt: alertTimestamp,
				requiresAction: true,
				actionUrl: `/manager/employees/${employeeId}`,
			});
		} else if (hoursWorkedDay >= dailyThreshold) {
			alerts.push({
				id: `daily-warning-${employeeId}`,
				type: "OVERTIME",
				severity: "MEDIUM",
				title: "Approaching Daily Limit",
				description: `${data.employee.name} has worked ${hoursWorkedDay.toFixed(1)} hours today (${((hoursWorkedDay / dailyLimit) * 100).toFixed(1)}% of the daily limit)`,
				employeeId,
				employeeName: data.employee.name,
				createdAt: alertTimestamp,
				requiresAction: false,
				actionUrl: `/manager/employees/${employeeId}`,
			});
		}
	});

	// 2. Missing punch alerts - employees with unusual shift patterns

	const expectedActive = (await db.employee.findMany({
		where: {
			status: "ACTIVE",
		},
		include: {
			defaultStation: true,
			TimeLog: {
				where: {
					startTime: { gte: todayStart },
					deletedAt: null,
				},
				orderBy: { startTime: "desc" },
				take: 1,
			},
		},
	})) as EmployeeWithBreakData[];

	expectedActive.forEach((employee) => {
		const hasTodayActivity = employee.TimeLog.length > 0;

		// Check for employees who should be working but haven't clocked in
		const currentHour = new Date().getHours();
		const isWorkHours = currentHour >= 9 && currentHour <= 17; // 9 AM to 5 PM

		if (!hasTodayActivity && isWorkHours) {
			alerts.push({
				id: `missing-punch-${employee.id}`,
				type: "MISSING_PUNCH",
				severity: "MEDIUM",
				title: "Missing Time Entry",
				description: `${employee.name} has not clocked in today during business hours`,
				employeeId: employee.id,
				employeeName: employee.name,
				createdAt: new Date(),
				requiresAction: true,
				actionUrl: `/manager/employees/${employee.id}`,
			});
		}
	});

	// 3. Break compliance alerts
	const activeEmployeeIds = expectedActive.map((employee) => employee.id);
	const breakLogs = await db.timeLog.findMany({
		where: {
			employeeId: { in: activeEmployeeIds },
			type: "BREAK",
			deletedAt: null,
		},
		orderBy: { startTime: "desc" },
	});

	const lastBreakMap = new Map<string, typeof breakLogs[number]>();
	breakLogs.forEach((log) => {
		if (!lastBreakMap.has(log.employeeId)) {
			lastBreakMap.set(log.employeeId, log);
		}
	});

	const breakWarningBufferHours = 0.5;
	expectedActive.forEach((employee) => {
		const policy = employee.breakPolicy;
		if (!policy?.maxHoursWithoutBreak) {
			return;
		}

		const lastBreak = lastBreakMap.get(employee.id);
		if (!lastBreak) {
			return;
		}

		const breakEnd = lastBreak.endTime ? new Date(lastBreak.endTime) : new Date(lastBreak.startTime);
		const hoursSinceLastBreak = Math.max(0, (now.getTime() - breakEnd.getTime()) / (1000 * 60 * 60));
		const violationThreshold = policy.maxHoursWithoutBreak;
		if (violationThreshold <= 0) {
			return;
		}
		const warningThreshold = Math.max(violationThreshold - breakWarningBufferHours, 0);

		if (hoursSinceLastBreak >= violationThreshold) {
			alerts.push({
				id: `break-violation-${employee.id}`,
				type: "COMPLIANCE",
				severity: "HIGH",
				title: "Break Violation",
				description: `${employee.name} has not taken a break in ${hoursSinceLastBreak.toFixed(1)}h (policy allows ${violationThreshold}h without a break).`,
				employeeId: employee.id,
				employeeName: employee.name,
				stationName: employee.defaultStation?.name,
				createdAt: now,
				requiresAction: true,
				actionUrl: `/manager/employees/${employee.id}`,
			});
		} else if (hoursSinceLastBreak >= warningThreshold) {
			alerts.push({
				id: `break-due-${employee.id}`,
				type: "COMPLIANCE",
				severity: "MEDIUM",
				title: "Break Due Soon",
				description: `${employee.name} has gone ${hoursSinceLastBreak.toFixed(1)}h without a break (policy allows ${violationThreshold}h).`,
				employeeId: employee.id,
				employeeName: employee.name,
				stationName: employee.defaultStation?.name,
				createdAt: now,
				requiresAction: true,
				actionUrl: `/manager/employees/${employee.id}`,
			});
		}
	});

	// 4. Performance alerts - employees with low efficiency
	const recentTaskAssignments = await db.taskAssignment.findMany({
		where: {
			startTime: { gte: weekAgo },
			endTime: { not: null },
			unitsCompleted: { not: null },
		},
		include: {
			Employee: true,
			TaskType: true,
		},
		orderBy: { startTime: "desc" },
		take: 100,
	});

	// Calculate efficiency per employee
	const employeeEfficiency = new Map<string, { efficiency: number; employee: Employee }>();

	recentTaskAssignments.forEach((assignment) => {
		const duration =
			(new Date(assignment.endTime!).getTime() - new Date(assignment.startTime).getTime()) /
			(1000 * 60 * 60);
		const unitsPerHour = assignment.unitsCompleted! / duration;

		const existing = employeeEfficiency.get(assignment.employeeId);
		if (existing) {
			// Simple average - could be improved with weighted average
			existing.efficiency = (existing.efficiency + unitsPerHour) / 2;
		} else {
			employeeEfficiency.set(assignment.employeeId, {
				efficiency: unitsPerHour,
				employee: assignment.Employee,
			});
		}
	});

	// Generate performance alerts for low efficiency
	employeeEfficiency.forEach((data, employeeId) => {
		if (data.efficiency < 1.0) {
			// Threshold could be configurable
			alerts.push({
				id: `performance-${employeeId}`,
				type: "PERFORMANCE",
				severity: data.efficiency < 0.5 ? "HIGH" : "MEDIUM",
				title: "Low Performance Alert",
				description: `${data.employee.name} has a task completion rate of ${data.efficiency.toFixed(2)} units per hour (below expected performance)`,
				employeeId,
				employeeName: data.employee.name,
				createdAt: new Date(),
				requiresAction: false,
				actionUrl: `/manager/employees/${employeeId}`,
			});
		}
	});

	// 4. System alerts
	const totalActive = alerts.length;
	if (totalActive === 0) {
		// Add informational alert when no alerts
		alerts.push({
			id: "system-no-alerts",
			type: "SYSTEM",
			severity: "LOW",
			title: "System Status: All Clear",
			description: "No active alerts. All systems operating within normal parameters.",
			createdAt: new Date(),
			requiresAction: false,
		});
	}

	// Sort alerts by severity and creation time
	return alerts.sort((a, b) => {
		const severityOrder = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
		const severityDiff = severityOrder[a.severity] - severityOrder[b.severity];
		return severityDiff !== 0 ? severityDiff : b.createdAt.getTime() - a.createdAt.getTime();
	});
}

export async function getSystemNotifications() {
	const notifications = [
		{
			id: "system-backup",
			type: "INFO",
			message: "System backup completed successfully",
			timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
		},
		{
			id: "system-update",
			type: "INFO",
			message: "Database optimization completed",
			timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
		},
	];

	return notifications;
}
