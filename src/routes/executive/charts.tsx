"use client";

import { Card, CardHeader, CardTitle, CardBody } from "~/components/ds/card";
import { useEffect, useRef } from "react";

interface LineChartData {
	labels: string[];
	datasets: {
		label: string;
		data: number[];
		color: string;
	}[];
}

interface BarChartData {
	labels: string[];
	datasets: {
		label: string;
		data: number[];
		color: string;
	}[];
}

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
	data: {
		label: string;
		value: number;
		color: string;
	}[];
	height?: number;
}

/**
 * Simple line chart using SVG
 */
export function LineChart({ title, data, height = 250 }: LineChartProps) {
	const svgRef = useRef<SVGSVGElement>(null);

	useEffect(() => {
		if (!svgRef.current || !data.datasets[0]?.data.length) return;

		const width = svgRef.current.clientWidth;
		const heightNum = height;
		const padding = { top: 20, right: 30, bottom: 40, left: 50 };
		const chartWidth = width - padding.left - padding.right;
		const chartHeight = heightNum - padding.top - padding.bottom;

		const svg = svgRef.current;
		svg.innerHTML = "";

		// Clear existing content
		while (svg.firstChild) {
			svg.removeChild(svg.firstChild);
		}

		// Create main group
		const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
		g.setAttribute("transform", `translate(${padding.left},${padding.top})`);
		svg.appendChild(g);

		// Find min and max values
		const allData = data.datasets.flatMap((d) => d.data);
		const maxValue = Math.max(...allData);
		const minValue = Math.min(...allData, 0);
		const valueRange = maxValue - minValue || 1;

		// Draw grid lines
		for (let i = 0; i <= 5; i++) {
			const y = (chartHeight / 5) * i;
			const value = maxValue - (valueRange / 5) * i;

			const gridLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
			gridLine.setAttribute("x1", "0");
			gridLine.setAttribute("y1", y.toString());
			gridLine.setAttribute("x2", chartWidth.toString());
			gridLine.setAttribute("y2", y.toString());
			gridLine.setAttribute("stroke", "#e5e7eb");
			gridLine.setAttribute("stroke-width", "1");
			g.appendChild(gridLine);

			const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
			label.setAttribute("x", "-10");
			label.setAttribute("y", (y + 4).toString());
			label.setAttribute("text-anchor", "end");
			label.setAttribute("font-size", "12");
			label.setAttribute("fill", "#6b7280");
			label.textContent = value.toFixed(1);
			g.appendChild(label);
		}

		// Draw lines for each dataset
		data.datasets.forEach((dataset, _datasetIndex) => {
			const points: { x: number; y: number }[] = [];

			dataset.data.forEach((value, index) => {
				const x = (chartWidth / (data.labels.length - 1)) * index;
				const y = chartHeight - ((value - minValue) / valueRange) * chartHeight;
				points.push({ x, y });
			});

			// Draw line
			const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
			const pathData = points
				.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
				.join(" ");
			path.setAttribute("d", pathData);
			path.setAttribute("fill", "none");
			path.setAttribute("stroke", dataset.color);
			path.setAttribute("stroke-width", "2");
			g.appendChild(path);

			// Draw points
			points.forEach((point) => {
				const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
				circle.setAttribute("cx", point.x.toString());
				circle.setAttribute("cy", point.y.toString());
				circle.setAttribute("r", "4");
				circle.setAttribute("fill", dataset.color);
				g.appendChild(circle);
			});
		});

		// Draw X-axis labels
		data.labels.forEach((label, index) => {
			const x = (chartWidth / (data.labels.length - 1)) * index;
			const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
			text.setAttribute("x", x.toString());
			text.setAttribute("y", (chartHeight + 20).toString());
			text.setAttribute("text-anchor", "middle");
			text.setAttribute("font-size", "12");
			text.setAttribute("fill", "#6b7280");
			text.textContent = label;
			g.appendChild(text);
		});
	}, [data, height]);

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-base">{title}</CardTitle>
			</CardHeader>
			<CardBody>
				<svg ref={svgRef} width="100%" height={height} className="w-full" />
			</CardBody>
		</Card>
	);
}

/**
 * Simple bar chart using SVG
 */
export function BarChart({ title, data, height = 250 }: BarChartProps) {
	const svgRef = useRef<SVGSVGElement>(null);

	useEffect(() => {
		if (!svgRef.current || !data.datasets[0]?.data.length) return;

		const width = svgRef.current.clientWidth;
		const heightNum = height;
		const padding = { top: 20, right: 30, bottom: 40, left: 50 };
		const chartWidth = width - padding.left - padding.right;
		const chartHeight = heightNum - padding.top - padding.bottom;

		const svg = svgRef.current;
		svg.innerHTML = "";

		// Clear existing content
		while (svg.firstChild) {
			svg.removeChild(svg.firstChild);
		}

		// Create main group
		const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
		g.setAttribute("transform", `translate(${padding.left},${padding.top})`);
		svg.appendChild(g);

		// Find max value
		const allData = data.datasets.flatMap((d) => d.data);
		const maxValue = Math.max(...allData);

		// Draw grid lines
		for (let i = 0; i <= 5; i++) {
			const y = (chartHeight / 5) * i;
			const value = maxValue - (maxValue / 5) * i;

			const gridLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
			gridLine.setAttribute("x1", "0");
			gridLine.setAttribute("y1", y.toString());
			gridLine.setAttribute("x2", chartWidth.toString());
			gridLine.setAttribute("y2", y.toString());
			gridLine.setAttribute("stroke", "#e5e7eb");
			gridLine.setAttribute("stroke-width", "1");
			g.appendChild(gridLine);

			const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
			label.setAttribute("x", "-10");
			label.setAttribute("y", (y + 4).toString());
			label.setAttribute("text-anchor", "end");
			label.setAttribute("font-size", "12");
			label.setAttribute("fill", "#6b7280");
			label.textContent = value.toFixed(0);
			g.appendChild(label);
		}

		// Draw bars
		const barWidth = chartWidth / data.labels.length / data.datasets.length;
		const groupWidth = chartWidth / data.labels.length;

		data.datasets.forEach((dataset, datasetIndex) => {
			dataset.data.forEach((value, index) => {
				const barHeight = (value / maxValue) * chartHeight;
				const x =
					index * groupWidth +
					datasetIndex * barWidth +
					(groupWidth - barWidth * data.datasets.length) / 2;
				const y = chartHeight - barHeight;

				const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
				rect.setAttribute("x", x.toString());
				rect.setAttribute("y", y.toString());
				rect.setAttribute("width", (barWidth * 0.8).toString());
				rect.setAttribute("height", barHeight.toString());
				rect.setAttribute("fill", dataset.color);
				rect.setAttribute("rx", "2");
				g.appendChild(rect);
			});
		});

		// Draw X-axis labels
		data.labels.forEach((label, index) => {
			const x = index * groupWidth + groupWidth / 2;
			const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
			text.setAttribute("x", x.toString());
			text.setAttribute("y", (chartHeight + 20).toString());
			text.setAttribute("text-anchor", "middle");
			text.setAttribute("font-size", "12");
			text.setAttribute("fill", "#6b7280");
			text.textContent = label;
			g.appendChild(text);
		});
	}, [data, height]);

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-base">{title}</CardTitle>
			</CardHeader>
			<CardBody>
				<svg ref={svgRef} width="100%" height={height} className="w-full" />
			</CardBody>
		</Card>
	);
}

/**
 * Simple pie chart using SVG
 */
export function PieChart({ title, data, height = 250 }: PieChartProps) {
	const svgRef = useRef<SVGSVGElement>(null);

	useEffect(() => {
		if (!svgRef.current || !data.length) return;

		const width = svgRef.current.clientWidth;
		const heightNum = height;
		const centerX = width / 2;
		const centerY = heightNum / 2;
		const radius = Math.min(centerX, centerY) - 20;

		const svg = svgRef.current;
		svg.innerHTML = "";

		// Clear existing content
		while (svg.firstChild) {
			svg.removeChild(svg.firstChild);
		}

		// Create main group
		const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
		g.setAttribute("transform", `translate(${centerX},${centerY})`);
		svg.appendChild(g);

		// Calculate total
		const total = data.reduce((sum, item) => sum + item.value, 0);

		let currentAngle = -90; // Start from top

		data.forEach((item, _index) => {
			const percentage = item.value / total;
			const angle = percentage * 360;
			const endAngle = currentAngle + angle;

			// Create pie slice
			const path = document.createElementNS("http://www.w3.org/2000/svg", "path");

			const startAngleRad = (currentAngle * Math.PI) / 180;
			const endAngleRad = (endAngle * Math.PI) / 180;

			const x1 = radius * Math.cos(startAngleRad);
			const y1 = radius * Math.sin(startAngleRad);
			const x2 = radius * Math.cos(endAngleRad);
			const y2 = radius * Math.sin(endAngleRad);

			const largeArcFlag = angle > 180 ? 1 : 0;

			const pathData = [
				`M 0 0`,
				`L ${x1} ${y1}`,
				`A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
				`Z`,
			].join(" ");

			path.setAttribute("d", pathData);
			path.setAttribute("fill", item.color);
			path.setAttribute("stroke", "white");
			path.setAttribute("stroke-width", "2");
			g.appendChild(path);

			// Add label
			const labelAngle = ((currentAngle + angle / 2) * Math.PI) / 180;
			const labelX = radius * 0.7 * Math.cos(labelAngle);
			const labelY = radius * 0.7 * Math.sin(labelAngle);

			const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
			text.setAttribute("x", labelX.toString());
			text.setAttribute("y", labelY.toString());
			text.setAttribute("text-anchor", "middle");
			text.setAttribute("dominant-baseline", "middle");
			text.setAttribute("font-size", "12");
			text.setAttribute("font-weight", "bold");
			text.setAttribute("fill", "white");
			text.textContent = `${(percentage * 100).toFixed(0)}%`;
			g.appendChild(text);

			currentAngle = endAngle;
		});
	}, [data, height]);

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-base">{title}</CardTitle>
			</CardHeader>
			<CardBody>
				<svg ref={svgRef} width="100%" height={height} className="w-full" />
				<div className="mt-4 space-y-2">
					{data.map((item, index) => (
						<div key={index} className="flex items-center justify-between text-sm">
							<div className="flex items-center gap-2">
								<div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
								<span>{item.label}</span>
							</div>
							<span className="font-medium">{item.value}</span>
						</div>
					))}
				</div>
			</CardBody>
		</Card>
	);
}
