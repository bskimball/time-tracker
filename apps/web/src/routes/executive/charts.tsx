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
function convertToRechartsData(data: LineChartData | BarChartData): Record<string, any>[] {
	const result: Record<string, any>[] = [];

	data.labels.forEach((label, index) => {
		const dataPoint: Record<string, any> = { name: label };
		data.datasets.forEach((dataset) => {
			dataPoint[dataset.label] = dataset.data[index] || 0;
		});
		result.push(dataPoint);
	});

	return result;
}

export function LineChart({ title, data, height = 250 }: LineChartProps) {
	const chartData = convertToRechartsData(data);

	return (
		<Card>
			<CardHeader>
				<CardTitle>{title}</CardTitle>
			</CardHeader>
			<CardBody>
				<ResponsiveContainer width="100%" height={height}>
					<RechartsLineChart data={chartData}>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis dataKey="name" />
						<YAxis />
						<Tooltip />
						<Legend />
						{data.datasets.map((dataset) => (
							<Line
								key={dataset.label}
								type="monotone"
								dataKey={dataset.label}
								stroke={dataset.color}
								strokeWidth={2}
								dot={{ r: 4 }}
							/>
						))}
					</RechartsLineChart>
				</ResponsiveContainer>
			</CardBody>
		</Card>
	);
}

export function BarChart({ title, data, height = 250 }: BarChartProps) {
	const chartData = convertToRechartsData(data) as any;

	return (
		<Card>
			<CardHeader>
				<CardTitle>{title}</CardTitle>
			</CardHeader>
			<CardBody>
				<ResponsiveContainer width="100%" height={height}>
					<RechartsBarChart data={chartData}>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis dataKey="name" />
						<YAxis />
						<Tooltip />
						<Legend />
						{data.datasets.map((dataset) => (
							<Bar
								key={dataset.label}
								dataKey={dataset.label}
								fill={dataset.color}
								radius={[2, 2, 0, 0]}
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
		<Card>
			<CardHeader>
				<CardTitle>{title}</CardTitle>
			</CardHeader>
			<CardBody>
				<ResponsiveContainer width="100%" height={height}>
					<RechartsPieChart>
						<Pie
							data={data as any}
							cx="50%"
							cy="50%"
							outerRadius={80}
							dataKey="value"
							label={({ name, percent }) => `${name} ${(percent! * 100).toFixed(0)}%`}
						>
							{data.map((entry, index) => (
								<Cell key={`cell-${index}`} fill={entry.color} />
							))}
						</Pie>
						<Tooltip />
					</RechartsPieChart>
				</ResponsiveContainer>
			</CardBody>
		</Card>
	);
}
