import { validateRequest } from "~/lib/auth";
import { getRequest } from "~/lib/request-context";
import { ReportsManager } from "./client";
import { PageHeader } from "~/components/page-header";
import {
	getProductivityReport,
	getTaskPerformanceReport,
	getStationEfficiencyReport,
	getOvertimeReport,
	getEmployeeSummaryStats,
} from "./actions";

type ReportType = "productivity" | "tasks" | "stations" | "overtime" | "summary";

function toIsoDate(date: Date): string {
	return date.toISOString().split("T")[0];
}

function parseDateParam(value: unknown): Date | null {
	if (typeof value !== "string" || value.length === 0) {
		return null;
	}

	const parsed = new Date(value);
	if (Number.isNaN(parsed.getTime())) {
		return null;
	}

	return parsed;
}

function parseReportType(value: unknown): ReportType | null {
	if (typeof value !== "string") {
		return null;
	}

	if (
		value === "productivity" ||
		value === "tasks" ||
		value === "stations" ||
		value === "overtime" ||
		value === "summary"
	) {
		return value;
	}

	return null;
}

// Create export route
async function handleExport(reportStartDate: Date, reportEndDate: Date, reportType: ReportType) {
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
		case "summary": {
			const data = await getEmployeeSummaryStats(reportStartDate, reportEndDate);
			csv = convertToCSV([
				{ ...data, startDate: toIsoDate(reportStartDate), endDate: toIsoDate(reportEndDate) },
			]);
			break;
		}
		default:
			throw new Response("Invalid report type", { status: 400 });
	}

	return new Response(csv, {
		headers: {
			"Content-Type": "text/csv",
			"Content-Disposition": `attachment; filename="${reportType}-report-${toIsoDate(reportStartDate)}-${toIsoDate(reportEndDate)}.csv"`,
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

export default async function Component() {
	const authPromise = validateRequest();
	const request = getRequest();
	const query = request ? new URL(request.url).searchParams : new URLSearchParams();

	// Default to last 7 days if no dates provided
	const endDateParam = query.get("endDate");
	const startDateParam = query.get("startDate");
	const parsedEndDate = endDateParam ? new Date(endDateParam) : null;
	const endDate =
		parsedEndDate && !Number.isNaN(parsedEndDate.getTime()) ? parsedEndDate : new Date();
	const parsedStartDate = startDateParam ? new Date(startDateParam) : null;
	const startDate =
		parsedStartDate && !Number.isNaN(parsedStartDate.getTime())
			? parsedStartDate
			: new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);

	const productivityDataPromise = getProductivityReport(startDate, endDate);
	const taskPerformanceDataPromise = getTaskPerformanceReport(startDate, endDate);
	const stationEfficiencyDataPromise = getStationEfficiencyReport(startDate, endDate);
	const overtimeDataPromise = getOvertimeReport(startDate, endDate);
	const summaryStatsPromise = getEmployeeSummaryStats(startDate, endDate);

	const { user } = await authPromise;
	if (!user) {
		throw new Error("Not authenticated");
	}

	return (
		<div className="space-y-6 pb-12">
			<PageHeader
				title="Reports & Analytics"
				subtitle="Operational intelligence and workforce metrics"
			/>

			<ReportsManager
				initialStartDate={startDate.toISOString().split("T")[0]}
				initialEndDate={endDate.toISOString().split("T")[0]}
				hideHeader={true}
				productivityDataPromise={productivityDataPromise}
				taskPerformanceDataPromise={taskPerformanceDataPromise}
				stationEfficiencyDataPromise={stationEfficiencyDataPromise}
				overtimeDataPromise={overtimeDataPromise}
				summaryStatsPromise={summaryStatsPromise}
			/>
		</div>
	);
}

export async function action({ request }: { request: Request }) {
	const { user } = await validateRequest();
	if (!user) {
		return new Response("Unauthorized", { status: 401 });
	}

	const formData = await request.formData();
	const startDate = parseDateParam(formData.get("startDate"));
	const endDate = parseDateParam(formData.get("endDate"));
	const reportType = parseReportType(formData.get("type"));

	if (!startDate || !endDate) {
		return new Response("Invalid date range", { status: 400 });
	}

	if (startDate.getTime() > endDate.getTime()) {
		return new Response("Start date must be before end date", { status: 400 });
	}

	if (!reportType) {
		return new Response("Invalid report type", { status: 400 });
	}

	return handleExport(startDate, endDate, reportType);
}
