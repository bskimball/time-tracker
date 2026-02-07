"use client";

import {
	LineChart as RechartsLineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
	BarChart as RechartsBarChart,
	Bar,
	PieChart as RechartsPieChart,
	Pie,
	Cell,
} from "recharts";
import { Card, CardHeader, CardTitle, CardBody } from "@monorepo/design-system";

// ─── Shared Styles ──────────────────────────────────────────────────────────

const tooltipStyle = {
	contentStyle: {
		background: "var(--color-card)",
		border: "1px solid var(--color-border)",
		borderRadius: "2px",
		fontFamily: "var(--font-mono)",
		fontSize: "11px",
		padding: "8px 12px",
		color: "var(--color-card-foreground)",
		boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
	},
	labelStyle: {
		fontFamily: "var(--font-heading)",
		fontWeight: 600,
		textTransform: "uppercase" as const,
		letterSpacing: "0.05em",
		fontSize: "10px",
		marginBottom: "4px",
		color: "var(--color-muted-foreground)",
	},
};

const gridStroke = "var(--color-border)";
const gridOpacity = 0.3;
const axisTickFill = "var(--color-muted-foreground)";
const axisFontProps = {
	fontFamily: "var(--font-mono)",
	fontSize: 10,
	fill: axisTickFill,
};

// ─── Types ──────────────────────────────────────────────────────────────────

interface LineChartData {
	labels: string[];
	datasets: Array<{
		label: string;
		data: number[];
		color: string;
	}>;
}

interface BarChartData {
	labels: string[];
	datasets: Array<{
		label: string;
		data: number[];
		color: string;
	}>;
}

interface PieChartDataItem {
	name: string;
	value: number;
	color: string;
}

type PieChartData = PieChartDataItem[];

type RechartsDataPoint = Record<string, number | string>;

interface LineChartProps {
	title: string;
	data: LineChartData;
	height?: number;
}

interface BarChartProps {
	title: string;
	data: BarChartData;
	height?: number;
}

interface PieChartProps {
	title: string;
	data: PieChartData;
	height?: number;
}

// Helper function to convert our data format to recharts format
function convertToRechartsData(data: LineChartData | BarChartData): RechartsDataPoint[] {
	const result: RechartsDataPoint[] = [];

	data.labels.forEach((label, index) => {
		const dataPoint: RechartsDataPoint = { name: label };
		data.datasets.forEach((dataset) => {
			dataPoint[dataset.label] = dataset.data[index] || 0;
		});
		result.push(dataPoint);
	});

	return result;
}

// ─── Components ─────────────────────────────────────────────────────────────

export function LineChart({ title, data, height = 250 }: LineChartProps) {
	const chartData = convertToRechartsData(data);

	return (
		<Card className="h-full flex flex-col">
			<CardHeader className="bg-muted/30 border-b border-border/50 py-3">
				<CardTitle className="uppercase tracking-widest font-industrial text-sm text-muted-foreground">
					{title}
				</CardTitle>
			</CardHeader>
			<CardBody className="p-4 flex-1">
				<ResponsiveContainer width="100%" height={height}>
					<RechartsLineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
						<CartesianGrid
							strokeDasharray="none"
							stroke={gridStroke}
							strokeOpacity={gridOpacity}
							vertical={false}
						/>
						<XAxis
							dataKey="name"
							tick={axisFontProps}
							axisLine={{ stroke: gridStroke, strokeOpacity: 0.5 }}
							tickLine={false}
							dy={10}
						/>
						<YAxis
							tick={axisFontProps}
							axisLine={false}
							tickLine={false}
							tickFormatter={(value) =>
								typeof value === "number" && value >= 1000 ? `${value / 1000}k` : `${value}`
							}
						/>
						<Tooltip
							contentStyle={tooltipStyle.contentStyle}
							labelStyle={tooltipStyle.labelStyle}
							cursor={{ stroke: "var(--color-primary)", strokeWidth: 1, strokeDasharray: "4 4" }}
						/>
						<Legend
							wrapperStyle={{ paddingTop: "16px", fontSize: "11px", fontFamily: "var(--font-mono)" }}
						/>
						{data.datasets.map((dataset) => (
							<Line
								key={dataset.label}
								type="monotone"
								dataKey={dataset.label}
								stroke={dataset.color}
								strokeWidth={2}
								dot={{ r: 3, fill: dataset.color, strokeWidth: 0 }}
								activeDot={{ r: 5, strokeWidth: 0 }}
							/>
						))}
					</RechartsLineChart>
				</ResponsiveContainer>
			</CardBody>
		</Card>
	);
}

export function BarChart({ title, data, height = 250 }: BarChartProps) {
	const chartData = convertToRechartsData(data);

	return (
		<Card className="h-full flex flex-col">
			<CardHeader className="bg-muted/30 border-b border-border/50 py-3">
				<CardTitle className="uppercase tracking-widest font-industrial text-sm text-muted-foreground">
					{title}
				</CardTitle>
			</CardHeader>
			<CardBody className="p-4 flex-1">
				<ResponsiveContainer width="100%" height={height}>
					<RechartsBarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
						<CartesianGrid
							strokeDasharray="none"
							stroke={gridStroke}
							strokeOpacity={gridOpacity}
							vertical={false}
						/>
						<XAxis
							dataKey="name"
							tick={axisFontProps}
							axisLine={{ stroke: gridStroke, strokeOpacity: 0.5 }}
							tickLine={false}
							dy={10}
						/>
						<YAxis
							tick={axisFontProps}
							axisLine={false}
							tickLine={false}
							tickFormatter={(value) =>
								typeof value === "number" && value >= 1000 ? `${value / 1000}k` : `${value}`
							}
						/>
						<Tooltip
							contentStyle={tooltipStyle.contentStyle}
							labelStyle={tooltipStyle.labelStyle}
							cursor={{ fill: "var(--color-muted)", opacity: 0.2 }}
						/>
						<Legend
							wrapperStyle={{ paddingTop: "16px", fontSize: "11px", fontFamily: "var(--font-mono)" }}
						/>
						{data.datasets.map((dataset) => (
							<Bar
								key={dataset.label}
								dataKey={dataset.label}
								fill={dataset.color}
								radius={[2, 2, 0, 0]}
								maxBarSize={40}
							/>
						))}
					</RechartsBarChart>
				</ResponsiveContainer>
			</CardBody>
		</Card>
	);
}

export function PieChart({ title, data, height = 250 }: PieChartProps) {
	return (
		<Card className="h-full flex flex-col">
			<CardHeader className="bg-muted/30 border-b border-border/50 py-3">
				<CardTitle className="uppercase tracking-widest font-industrial text-sm text-muted-foreground">
					{title}
				</CardTitle>
			</CardHeader>
			<CardBody className="p-4 flex-1">
				<ResponsiveContainer width="100%" height={height}>
					<RechartsPieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
						<Pie
							data={data}
							cx="50%"
							cy="50%"
							innerRadius={60}
							outerRadius={80}
							paddingAngle={2}
							dataKey="value"
						>
							{data.map((entry, index) => (
								<Cell key={`cell-${index}`} fill={entry.color} stroke="var(--color-card)" strokeWidth={2} />
							))}
						</Pie>
						<Tooltip contentStyle={tooltipStyle.contentStyle} labelStyle={tooltipStyle.labelStyle} />
						<Legend
							layout="vertical"
							verticalAlign="middle"
							align="right"
							wrapperStyle={{ fontSize: "11px", fontFamily: "var(--font-mono)" }}
						/>
					</RechartsPieChart>
				</ResponsiveContainer>
			</CardBody>
		</Card>
	);
}

