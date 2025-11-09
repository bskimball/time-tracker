import { startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";

/**
 * Date utility functions for executive dashboard
 */

export function getDateRange(timeRange: "today" | "week" | "month") {
	const now = new Date();
	let startDate: Date;
	let endDate: Date;

	switch (timeRange) {
		case "week":
			return {
				start: startOfWeek(now),
				end: endOfWeek(now),
				display: "This Week",
			};
		case "month":
			return {
				start: startOfMonth(now),
				end: endOfMonth(now),
				display: "This Month",
			};
		case "today":
		default:
			startDate = new Date(now);
			startDate.setHours(0, 0, 0, 0);
			endDate = new Date(now);
			endDate.setHours(23, 59, 59, 999);
			return {
				start: startDate,
				end: endDate,
				display: "Today",
			};
	}
}
