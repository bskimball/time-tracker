"use client";

import {
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	BarChart as RechartsBarChart,
	Bar,
	Cell,
	Area,
	AreaChart as RechartsAreaChart,
	ReferenceLine,
	Label,
} from "recharts";
import { useId } from "react";

// ─── Shared Tooltip Style ────────────────────────────────────────────────────
// Uses CSS variables so it adapts to light/dark automatically.

const tooltipStyle = {
	contentStyle: {
		background: "var(--color-card)",
		border: "1px solid var(--color-muted-foreground)",
		borderRadius: "2px",
		fontFamily: "var(--font-mono)",
		fontSize: "11px",
		padding: "8px 12px",
		color: "var(--color-card-foreground)",
	},
	labelStyle: {
		fontFamily: "var(--font-heading)",
		fontWeight: 600,
		textTransform: "uppercase" as const,
		letterSpacing: "0.05em",
		fontSize: "10px",
		marginBottom: "4px",
		color: "var(--color-card-foreground)",
	},
};

// Grid & axis colors that work in both themes.
// muted-foreground has good contrast in both modes.
const gridStroke = "var(--color-muted-foreground)";
const gridOpacity = 0.15;
const axisTickFill = "var(--color-muted-foreground)";
const axisFontProps = {
	fontFamily: "var(--font-mono)",
	fontSize: 10,
	fill: axisTickFill,
};

function normalizeGradientId(id: string) {
	return `chart-${id.replaceAll(":", "")}`;
}

// ─── Productivity Trend (Hero Area Chart) ────────────────────────────────────

export interface TrendDataPoint {
	date: string; // formatted label e.g. "Mon", "Tue"
	value: number;
}

interface ProductivityTrendChartProps {
	data: TrendDataPoint[];
	height?: number;
	/** If provided, draws a dashed warning reference line at this value */
	thresholdMedium?: number;
	/** If provided, draws a dashed high-alert reference line at this value */
	thresholdHigh?: number;
}

export function ProductivityTrendChart({
	data,
	height = 260,
	thresholdMedium,
	thresholdHigh,
}: ProductivityTrendChartProps) {
	const chartId = normalizeGradientId(useId());
	const trendFillId = `${chartId}-trend-fill`;

	return (
		<ResponsiveContainer width="100%" height={height}>
			<RechartsAreaChart data={data} margin={{ top: 8, right: 56, left: 0, bottom: 0 }}>
				<defs>
					<linearGradient id={trendFillId} x1="0" y1="0" x2="0" y2="1">
						<stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.2} />
						<stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
					</linearGradient>
				</defs>
				<CartesianGrid
					strokeDasharray="none"
					stroke={gridStroke}
					strokeOpacity={gridOpacity}
					vertical={false}
				/>
				<XAxis
					dataKey="date"
					tick={axisFontProps}
					axisLine={{ stroke: gridStroke, strokeOpacity: 0.25 }}
					tickLine={false}
				/>
				<YAxis tick={axisFontProps} axisLine={false} tickLine={false} width={36} />
				<Tooltip
					contentStyle={tooltipStyle.contentStyle}
					labelStyle={tooltipStyle.labelStyle}
					formatter={(value: number | undefined) => [
						`${(value ?? 0).toFixed(1)} u/hr`,
						"Productivity",
					]}
				/>
				{thresholdMedium !== undefined && (
					<ReferenceLine
						y={thresholdMedium}
						stroke="var(--color-warning)"
						strokeDasharray="4 3"
						strokeOpacity={0.7}
						strokeWidth={1.5}
					>
						<Label
							value={`TARGET: ${thresholdMedium}`}
							position="insideRight"
							style={{
								fontFamily: "var(--font-mono)",
								fontSize: 9,
								fill: "var(--color-warning)",
								opacity: 0.9,
							}}
						/>
					</ReferenceLine>
				)}
				{thresholdHigh !== undefined && (
					<ReferenceLine
						y={thresholdHigh}
						stroke="var(--color-primary)"
						strokeDasharray="4 3"
						strokeOpacity={0.6}
						strokeWidth={1.5}
					>
						<Label
							value={`HIGH: ${thresholdHigh}`}
							position="insideRight"
							style={{
								fontFamily: "var(--font-mono)",
								fontSize: 9,
								fill: "var(--color-primary)",
								opacity: 0.85,
							}}
						/>
					</ReferenceLine>
				)}
				<Area
					type="monotone"
					dataKey="value"
					stroke="var(--color-primary)"
					strokeWidth={2.5}
					fill={`url(#${trendFillId})`}
					dot={{ r: 3, fill: "var(--color-primary)", strokeWidth: 0 }}
					activeDot={{
						r: 5,
						fill: "var(--color-primary)",
						stroke: "var(--color-card)",
						strokeWidth: 2,
					}}
				/>
			</RechartsAreaChart>
		</ResponsiveContainer>
	);
}

// ─── Station Performance Bar Chart ───────────────────────────────────────────

export interface StationBarData {
	name: string;
	productivity: number;
	occupancy: number;
}

interface StationPerformanceChartProps {
	data: StationBarData[];
	height?: number;
}

export function StationPerformanceChart({ data, height = 240 }: StationPerformanceChartProps) {
	const chartId = normalizeGradientId(useId());
	const productivityBarId = `${chartId}-productivity`;
	const occupancyHighId = `${chartId}-occupancy-high`;
	const occupancyMediumId = `${chartId}-occupancy-medium`;
	const occupancyLowId = `${chartId}-occupancy-low`;

	function occupancyFill(occupancy: number) {
		if (occupancy > 90) return `url(#${occupancyHighId})`;
		if (occupancy > 70) return `url(#${occupancyMediumId})`;
		return `url(#${occupancyLowId})`;
	}

	return (
		<ResponsiveContainer width="100%" height={height}>
			<RechartsBarChart
				data={data}
				margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
				barCategoryGap="20%"
			>
				<defs>
					<linearGradient id={productivityBarId} x1="0" y1="0" x2="0" y2="1">
						<stop offset="0%" stopColor="var(--color-primary)" stopOpacity={1} />
						<stop offset="55%" stopColor="var(--color-primary)" stopOpacity={0.82} />
						<stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0.28} />
					</linearGradient>
					<linearGradient id={occupancyHighId} x1="0" y1="0" x2="0" y2="1">
						<stop offset="0%" stopColor="var(--color-destructive)" stopOpacity={1} />
						<stop offset="55%" stopColor="var(--color-destructive)" stopOpacity={0.82} />
						<stop offset="100%" stopColor="var(--color-destructive)" stopOpacity={0.28} />
					</linearGradient>
					<linearGradient id={occupancyMediumId} x1="0" y1="0" x2="0" y2="1">
						<stop offset="0%" stopColor="var(--color-chart-3)" stopOpacity={1} />
						<stop offset="55%" stopColor="var(--color-chart-3)" stopOpacity={0.82} />
						<stop offset="100%" stopColor="var(--color-chart-3)" stopOpacity={0.28} />
					</linearGradient>
					<linearGradient id={occupancyLowId} x1="0" y1="0" x2="0" y2="1">
						<stop offset="0%" stopColor="var(--color-chart-5)" stopOpacity={1} />
						<stop offset="55%" stopColor="var(--color-chart-5)" stopOpacity={0.82} />
						<stop offset="100%" stopColor="var(--color-chart-5)" stopOpacity={0.28} />
					</linearGradient>
				</defs>
				<CartesianGrid
					strokeDasharray="none"
					stroke={gridStroke}
					strokeOpacity={gridOpacity}
					vertical={false}
				/>
				<XAxis
					dataKey="name"
					tick={axisFontProps}
					axisLine={{ stroke: gridStroke, strokeOpacity: 0.25 }}
					tickLine={false}
				/>
				<YAxis tick={axisFontProps} axisLine={false} tickLine={false} width={36} />
				<Tooltip contentStyle={tooltipStyle.contentStyle} labelStyle={tooltipStyle.labelStyle} />
				<Bar
					dataKey="productivity"
					name="U/Hr"
					fill={`url(#${productivityBarId})`}
					radius={[2, 2, 0, 0]}
					maxBarSize={28}
				/>
				<Bar dataKey="occupancy" name="Occ %" radius={[2, 2, 0, 0]} maxBarSize={28}>
					{data.map((entry, index) => (
						<Cell key={`cell-${index}`} fill={occupancyFill(entry.occupancy)} />
					))}
				</Bar>
			</RechartsBarChart>
		</ResponsiveContainer>
	);
}

// ─── Cost Comparison Bar Chart ───────────────────────────────────────────────

export interface CostBarData {
	label: string;
	value: number;
	fill: string;
}

interface CostComparisonChartProps {
	data: CostBarData[];
	height?: number;
}

export function CostComparisonChart({ data, height = 180 }: CostComparisonChartProps) {
	const chartId = normalizeGradientId(useId());

	return (
		<ResponsiveContainer width="100%" height={height}>
			<RechartsBarChart
				data={data}
				layout="vertical"
				margin={{ top: 0, right: 16, left: 0, bottom: 0 }}
				barCategoryGap="30%"
			>
				<defs>
					{data.map((entry, index) => (
						<linearGradient
							key={`${entry.label}-cost-gradient`}
							id={`${chartId}-cost-${index}`}
							x1="1"
							y1="0"
							x2="0"
							y2="0"
						>
							<stop offset="0%" stopColor={entry.fill} stopOpacity={1} />
							<stop offset="50%" stopColor={entry.fill} stopOpacity={0.82} />
							<stop offset="100%" stopColor={entry.fill} stopOpacity={0.28} />
						</linearGradient>
					))}
				</defs>
				<CartesianGrid
					strokeDasharray="none"
					stroke={gridStroke}
					strokeOpacity={gridOpacity}
					horizontal={false}
				/>
				<XAxis
					type="number"
					tick={axisFontProps}
					axisLine={false}
					tickLine={false}
					tickFormatter={(v: number) => `$${v.toLocaleString()}`}
				/>
				<YAxis
					type="category"
					dataKey="label"
					tick={axisFontProps}
					axisLine={false}
					tickLine={false}
					width={72}
				/>
				<Tooltip
					contentStyle={tooltipStyle.contentStyle}
					labelStyle={tooltipStyle.labelStyle}
					formatter={(value: number | undefined) => [`$${(value ?? 0).toLocaleString()}`, ""]}
				/>
				<Bar dataKey="value" radius={[0, 2, 2, 0]} maxBarSize={20}>
					{data.map((_, index) => (
						<Cell key={`cost-${index}`} fill={`url(#${chartId}-cost-${index})`} />
					))}
				</Bar>
			</RechartsBarChart>
		</ResponsiveContainer>
	);
}
