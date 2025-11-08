import type { TimeLog, Employee } from "@prisma/client";

export const DEFAULT_DAILY_LIMIT = 8;
export const DEFAULT_WEEKLY_LIMIT = 40;

export function calculateDuration(start: Date, end: Date | null): number {
	if (!end) return 0;
	return (new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60 * 60);
}

export function formatDuration(hours: number): string {
	const h = Math.floor(hours);
	const m = Math.floor((hours - h) * 60);
	return `${h}h ${m}m`;
}

export function calculateNetHours(workLogs: TimeLog[], breakLogs: TimeLog[]): number {
	const totalWork = workLogs.reduce((sum, log) => {
		return sum + calculateDuration(log.startTime, log.endTime);
	}, 0);

	const totalBreak = breakLogs.reduce((sum, log) => {
		return sum + calculateDuration(log.startTime, log.endTime);
	}, 0);

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
	} else {
		const limit = employee.weeklyHoursLimit ?? DEFAULT_WEEKLY_LIMIT;
		return netHours > limit;
	}
}

export function getWeekBounds(date: Date): { start: Date; end: Date } {
	const d = new Date(date);
	const day = d.getDay();
	const diff = d.getDate() - day + (day === 0 ? -6 : 1);

	const start = new Date(d.setDate(diff));
	start.setHours(0, 0, 0, 0);

	const end = new Date(start);
	end.setDate(end.getDate() + 6);
	end.setHours(23, 59, 59, 999);

	return { start, end };
}

export function formatDateTime(date: Date): string {
	const d = new Date(date);
	const year = d.getFullYear();
	const month = String(d.getMonth() + 1).padStart(2, "0");
	const day = String(d.getDate()).padStart(2, "0");
	const hours = String(d.getHours()).padStart(2, "0");
	const minutes = String(d.getMinutes()).padStart(2, "0");
	return `${year}-${month}-${day}T${hours}:${minutes}`;
}
