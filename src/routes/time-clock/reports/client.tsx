"use client";

import { useNavigate } from "react-router";
import { Button } from "~/components/ds/button";
import { Card, CardHeader, CardTitle, CardBody } from "~/components/ds/card";

type EmployeeData = { name: string; hours: number };
type StationData = { name: string; hours: number };
type TrendData = { date: string; hours: number };

type ReportsPageProps = {
	employeeData: EmployeeData[];
	stationData: StationData[];
	trendData: TrendData[];
	startDate: string;
	endDate: string;
	groupBy: string;
};

export function ReportsPage({
	employeeData,
	stationData,
	trendData,
	startDate,
	endDate,
	groupBy,
}: ReportsPageProps) {
	return (
		<div className="space-y-6">
			<ReportFilters startDate={startDate} endDate={endDate} groupBy={groupBy} />

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<EmployeeChart data={employeeData} />
				<StationChart data={stationData} />
			</div>

			<WeeklyTrendChart data={trendData} groupBy={groupBy} />

			<ExportButtons startDate={startDate} endDate={endDate} />
		</div>
	);
}

function ReportFilters({
	startDate,
	endDate,
	groupBy,
}: {
	startDate: string;
	endDate: string;
	groupBy: string;
}) {
	const navigate = useNavigate();

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const params = new URLSearchParams();

		const start = formData.get("startDate") as string;
		const end = formData.get("endDate") as string;
		const group = formData.get("groupBy") as string;

		if (start) params.set("startDate", start);
		if (end) params.set("endDate", end);
		if (group) params.set("groupBy", group);

		navigate(`/time-clock/reports?${params.toString()}`);
	};

	return (
		<Card className="bg-gray-50">
			<CardHeader>
				<CardTitle>Filters</CardTitle>
			</CardHeader>
			<CardBody>
				<form onSubmit={handleSubmit} className="flex flex-wrap gap-4 items-end">
					<div className="flex flex-col gap-1">
						<label className="text-sm font-medium text-gray-700">Start Date</label>
						<input
							type="date"
							name="startDate"
							defaultValue={startDate}
							className="px-3 py-2 border border-gray-300 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
						/>
					</div>
					<div className="flex flex-col gap-1">
						<label className="text-sm font-medium text-gray-700">End Date</label>
						<input
							type="date"
							name="endDate"
							defaultValue={endDate}
							className="px-3 py-2 border border-gray-300 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
						/>
					</div>

					<div className="flex flex-col gap-1">
						<label className="text-sm font-medium text-gray-700">Group By</label>
						<select
							name="groupBy"
							defaultValue={groupBy}
							className="px-3 py-2 border border-gray-300 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						>
							<option value="daily">Daily</option>
							<option value="weekly">Weekly</option>
							<option value="monthly">Monthly</option>
						</select>
					</div>

					<Button type="submit" variant="primary">
						Apply Filters
					</Button>
				</form>
			</CardBody>
		</Card>
	);
}

function EmployeeChart({ data }: { data: EmployeeData[] }) {
	if (data.length === 0) {
		return (
			<Card className="bg-gray-50">
				<CardHeader>
					<CardTitle>Net Hours by Employee</CardTitle>
				</CardHeader>
				<CardBody>
					<p className="text-sm text-gray-500">No data available</p>
				</CardBody>
			</Card>
		);
	}

	const maxHours = Math.max(...data.map((d) => d.hours));
	const barHeight = 32;
	const barGap = 16;
	const chartHeight = data.length * (barHeight + barGap) + 40;
	const chartWidth = 600;
	const labelWidth = 150;
	const barMaxWidth = chartWidth - labelWidth - 100;

	return (
		<Card className="bg-gray-50">
			<CardHeader>
				<CardTitle>Net Hours by Employee</CardTitle>
			</CardHeader>
			<CardBody>
				<div className="overflow-x-auto">
					<svg
						width={chartWidth}
						height={chartHeight}
						className="w-full"
						viewBox={`0 0 ${chartWidth} ${chartHeight}`}
					>
						{data.map((item, i) => {
							const barWidth = (item.hours / maxHours) * barMaxWidth;
							const y = i * (barHeight + barGap) + 20;

							return (
								<g key={item.name}>
									<text
										x="10"
										y={y + barHeight / 2}
										dominantBaseline="middle"
										className="fill-gray-900 text-sm"
										style={{ fontSize: "14px" }}
									>
										{item.name.length > 18 ? item.name.substring(0, 18) + "..." : item.name}
									</text>
									<rect
										x={labelWidth}
										y={y}
										width={barWidth}
										height={barHeight}
										className="fill-primary"
										rx="4"
									/>
									<text
										x={labelWidth + barWidth + 10}
										y={y + barHeight / 2}
										dominantBaseline="middle"
										className="fill-gray-900 text-sm font-semibold"
										style={{ fontSize: "14px" }}
									>
										{item.hours.toFixed(1)}h
									</text>
								</g>
							);
						})}
					</svg>
				</div>
			</CardBody>
		</Card>
	);
}

function StationChart({ data }: { data: StationData[] }) {
	if (data.length === 0) {
		return (
			<Card className="bg-gray-50">
				<CardHeader>
					<CardTitle>Hours by Station</CardTitle>
				</CardHeader>
				<CardBody>
					<p className="text-sm text-gray-500">No data available</p>
				</CardBody>
			</Card>
		);
	}

	const maxHours = Math.max(...data.map((d) => d.hours));
	const barHeight = 32;
	const barGap = 16;
	const chartHeight = data.length * (barHeight + barGap) + 40;
	const chartWidth = 600;
	const labelWidth = 120;
	const barMaxWidth = chartWidth - labelWidth - 100;

	return (
		<Card className="bg-gray-50">
			<CardHeader>
				<CardTitle>Hours by Station</CardTitle>
			</CardHeader>
			<CardBody>
				<div className="overflow-x-auto">
					<svg
						width={chartWidth}
						height={chartHeight}
						className="w-full"
						viewBox={`0 0 ${chartWidth} ${chartHeight}`}
					>
						{data.map((item, i) => {
							const barWidth = (item.hours / maxHours) * barMaxWidth;
							const y = i * (barHeight + barGap) + 20;

							return (
								<g key={item.name}>
									<text
										x="10"
										y={y + barHeight / 2}
										dominantBaseline="middle"
										className="fill-gray-900 text-sm"
										style={{ fontSize: "14px" }}
									>
										{item.name}
									</text>
									<rect
										x={labelWidth}
										y={y}
										width={barWidth}
										height={barHeight}
										className="fill-secondary"
										rx="4"
									/>
									<text
										x={labelWidth + barWidth + 10}
										y={y + barHeight / 2}
										dominantBaseline="middle"
										className="fill-gray-900 text-sm font-semibold"
										style={{ fontSize: "14px" }}
									>
										{item.hours.toFixed(1)}h
									</text>
								</g>
							);
						})}
					</svg>
				</div>
			</CardBody>
		</Card>
	);
}

function WeeklyTrendChart({ data, groupBy }: { data: TrendData[]; groupBy: string }) {
	if (data.length === 0) {
		return (
			<Card className="bg-gray-50">
				<CardHeader>
					<CardTitle>Hours Trend</CardTitle>
				</CardHeader>
				<CardBody>
					<p className="text-sm text-gray-500">No data available</p>
				</CardBody>
			</Card>
		);
	}

	const chartWidth = 800;
	const chartHeight = 300;
	const padding = { top: 40, right: 40, bottom: 60, left: 60 };
	const plotWidth = chartWidth - padding.left - padding.right;
	const plotHeight = chartHeight - padding.top - padding.bottom;

	const maxHours = Math.max(...data.map((d) => d.hours), 1);
	const minHours = 0;

	const points = data.map((item, i) => {
		const x = padding.left + (i / (data.length - 1 || 1)) * plotWidth;
		const y =
			padding.top + plotHeight - ((item.hours - minHours) / (maxHours - minHours)) * plotHeight;
		return { x, y, ...item };
	});

	const pathData = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

	const yAxisTicks = 5;
	const yLabels = Array.from({ length: yAxisTicks }, (_, i) => {
		const value = minHours + (maxHours - minHours) * (i / (yAxisTicks - 1));
		return {
			value,
			y: padding.top + plotHeight - (i / (yAxisTicks - 1)) * plotHeight,
		};
	});

	const displayEveryNth = Math.ceil(data.length / 10);

	return (
		<Card className="bg-gray-50">
			<CardHeader>
				<CardTitle>Hours Trend ({groupBy})</CardTitle>
			</CardHeader>
			<CardBody>
				<div className="overflow-x-auto">
					<svg
						width={chartWidth}
						height={chartHeight}
						className="w-full"
						viewBox={`0 0 ${chartWidth} ${chartHeight}`}
					>
						<line
							x1={padding.left}
							y1={padding.top}
							x2={padding.left}
							y2={chartHeight - padding.bottom}
							className="stroke-base-content"
							strokeWidth="2"
							opacity="0.3"
						/>
						<line
							x1={padding.left}
							y1={chartHeight - padding.bottom}
							x2={chartWidth - padding.right}
							y2={chartHeight - padding.bottom}
							className="stroke-base-content"
							strokeWidth="2"
							opacity="0.3"
						/>

						{yLabels.map((label) => (
							<g key={label.value}>
								<line
									x1={padding.left}
									y1={label.y}
									x2={chartWidth - padding.right}
									y2={label.y}
									className="stroke-base-content"
									strokeWidth="1"
									opacity="0.1"
								/>
								<text
									x={padding.left - 10}
									y={label.y}
									textAnchor="end"
									dominantBaseline="middle"
									className="fill-gray-900 text-xs"
									style={{ fontSize: "12px" }}
								>
									{label.value.toFixed(0)}h
								</text>
							</g>
						))}

						<path
							d={pathData}
							fill="none"
							className="stroke-accent"
							strokeWidth="3"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>

						{points.map((point) => (
							<circle key={point.date} cx={point.x} cy={point.y} r="4" className="fill-accent" />
						))}

						{points.map((point, i) => {
							if (i % displayEveryNth !== 0 && i !== points.length - 1) return null;
							return (
								<text
									key={point.date}
									x={point.x}
									y={chartHeight - padding.bottom + 20}
									textAnchor="middle"
									className="fill-gray-900 text-xs"
									style={{ fontSize: "11px" }}
								>
									{point.date.split("-").slice(1).join("/")}
								</text>
							);
						})}
					</svg>
				</div>
			</CardBody>
		</Card>
	);
}

function ExportButtons({ startDate, endDate }: { startDate: string; endDate: string }) {
	const handleCSVExport = () => {
		const params = new URLSearchParams({ startDate, endDate });
		window.location.href = `/time-clock/reports/reports.csv?${params.toString()}`;
	};

	const handlePrint = () => {
		window.print();
	};

	return (
		<Card className="bg-gray-50">
			<CardHeader>
				<CardTitle>Export</CardTitle>
			</CardHeader>
			<CardBody>
				<div className="flex gap-4">
					<Button onPress={handleCSVExport} variant="outline">
						Download CSV
					</Button>
					<Button onPress={handlePrint} variant="outline">
						Print / Save PDF
					</Button>
				</div>
			</CardBody>
		</Card>
	);
}
