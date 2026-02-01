import { validateRequest } from "~/lib/auth";
import { ReportsManager } from "./client";
import {
	getProductivityReport,
	getTaskPerformanceReport,
	getStationEfficiencyReport,
	getOvertimeReport,
	getEmployeeSummaryStats,
} from "./actions";

// Create export route
async function handleExport(reportStartDate: Date, reportEndDate: Date, reportType: string) {
	"use server";

	let csv: string;
	switch (reportType) {
		case "productivity": {
			const data = await getProductivityReport(reportStartDate, reportEndDate);
			csv = convertToCSV(data);
			break;
		}
		case "tasks": {
			const data = await getTaskPerformanceReport(reportStartDate, reportEndDate);
			csv = convertToCSV(data);
			break;
		}
		case "stations": {
			const data = await getStationEfficiencyReport(reportStartDate, reportEndDate);
			csv = convertToCSV(data);
			break;
		}
		case "overtime": {
			const data = await getOvertimeReport(reportStartDate, reportEndDate);
			csv = convertToCSV(data);
			break;
		}
		default:
			throw new Response("Invalid report type", { status: 400 });
	}

	return new Response(csv, {
		headers: {
			"Content-Type": "text/csv",
			"Content-Disposition": `attachment; filename="${reportType}-report-${reportStartDate.toISOString().split("T")[0]}-${reportEndDate.toISOString().split("T")[0]}.csv"`,
		},
	});
}

function convertToCSV<T extends object>(data: T[]): string {
	if (!data || !data.length) return "";

	const headers = Object.keys(data[0] as Record<string, unknown>);
	const csvHeaders = headers.join(",");
	const csvData = data.map((row) =>
		headers
			.map((header) => {
				const record = row as Record<string, unknown>;
				return formatCsvValue(record[header]);
			})
			.join(",")
	);

	return [csvHeaders, ...csvData].join("\n");
}

function formatCsvValue(value: unknown): string {
	if (typeof value === "string") {
		return `"${value.replace(/"/g, '""')}"`;
	}
	if (typeof value === "number" || typeof value === "boolean") {
		return String(value);
	}
	if (value instanceof Date) {
		return value.toISOString();
	}
	return value ? String(value) : "";
}

export default async function Component({
	searchParams,
}: {
	searchParams?: { startDate?: string; endDate?: string; type?: string };
}) {
	const { user } = await validateRequest();
	if (!user) {
		throw new Error("Not authenticated");
	}

	// Default to last 7 days if no dates provided
	const endDate = searchParams?.endDate ? new Date(searchParams.endDate) : new Date();
	const startDate = searchParams?.startDate
		? new Date(searchParams.startDate)
		: new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);

	// Fetch all data in parallel
	const [productivityData, taskData, stationData, overtimeData, summaryStats] = await Promise.all([
		getProductivityReport(startDate, endDate),
		getTaskPerformanceReport(startDate, endDate),
		getStationEfficiencyReport(startDate, endDate),
		getOvertimeReport(startDate, endDate),
		getEmployeeSummaryStats(startDate, endDate),
	]);

	return (
		<ReportsManager
			initialData={{
				productivityData,
				taskPerformanceData: taskData,
				stationEfficiencyData: stationData,
				overtimeData: overtimeData,
				summaryStats,
			}}
		/>
	);
}

export async function action({ request }: { request: Request }) {
	const { user } = await validateRequest();
	if (!user) {
		return new Response("Unauthorized", { status: 401 });
	}

	const formData = await request.formData();
	const startDate = new Date(formData.get("startDate") as string);
	const endDate = new Date(formData.get("endDate") as string);
	const reportType = formData.get("type") as string;

	return handleExport(startDate, endDate, reportType);
}
