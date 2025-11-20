import type { Employee, TimeLog } from "@prisma/client";
import {
	differenceInMinutes,
	endOfWeek,
	format,
	formatDuration as formatDurationFn,
	intervalToDuration,
	startOfWeek,
} from "date-fns";

export const DEFAULT_DAILY_LIMIT = 8;
export const DEFAULT_WEEKLY_LIMIT = 40;

export function calculateDuration(start: Date, end: Date | null): number {
	if (!end) return 0;
	return differenceInMinutes(new Date(end), new Date(start)) / 60;
}

export function formatDuration(hours: number): string {
	const duration = intervalToDuration({ start: 0, end: hours * 60 * 60 * 1000 });
	return formatDurationFn(duration, { format: ["hours", "minutes"] }) || "0m";
}

export function calculateNetHours(workLogs: TimeLog[], breakLogs: TimeLog[]): number {
	const totalWork = workLogs.reduce(
		(sum, log) => sum + calculateDuration(log.startTime, log.endTime),
		0
	);
	const totalBreak = breakLogs.reduce(
		(sum, log) => sum + calculateDuration(log.startTime, log.endTime),
		0
	);

	return totalWork - totalBreak;
}

export function isOvertime(
	netHours: number,
	employee: Employee,
	period: "daily" | "weekly"
): boolean {
	if (period === "daily") {
		const limit = employee.dailyHoursLimit ?? DEFAULT_DAILY_LIMIT;
		return netHours > limit;
	}

	const limit = employee.weeklyHoursLimit ?? DEFAULT_WEEKLY_LIMIT;
	return netHours > limit;
}

export function getWeekBounds(date: Date): { start: Date; end: Date } {
	return {
		start: startOfWeek(date, { weekStartsOn: 1 }), // Monday start
		end: endOfWeek(date, { weekStartsOn: 1 }),
	};
}

export function formatDateTime(date: Date): string {
	return format(date, "yyyy-MM-dd'T'HH:mm");
}
