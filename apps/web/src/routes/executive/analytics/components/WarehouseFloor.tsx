import React, { useId } from "react";
import type { LiveFloorData, MetricType } from "../types";
import { Card, CardHeader, CardTitle, CardBody } from "@monorepo/design-system";

interface WarehouseFloorProps {
	data: LiveFloorData;
	metric: MetricType;
}

const colorForMetric = (value: number, metric: MetricType): string => {
	if (metric === "occupancy") {
		if (value > 90) return "var(--color-destructive)";
		if (value > 75) return "var(--color-warning)";
		return "var(--color-chart-2)";
	}

	if (value < 50) return "var(--color-destructive)";
	if (value < 75) return "var(--color-warning)";
	return "var(--color-chart-2)";
};

const zonesLayout = [
	{ id: "Picking", x: 10, y: 10, width: 120, height: 80 },
	{ id: "Packing", x: 150, y: 10, width: 120, height: 80 },
	{ id: "Filling", x: 290, y: 10, width: 120, height: 80 },
	{ id: "Receiving", x: 10, y: 110, width: 120, height: 80 },
	{ id: "Shipping", x: 150, y: 110, width: 120, height: 80 },
];

const WarehouseFloor: React.FC<WarehouseFloorProps> = ({ data, metric }) => {
	const zonesMap = data.zones.reduce<Record<string, number>>((acc, zone) => {
		acc[zone.name] = metric === "occupancy" ? zone.occupancy : zone.efficiency;
		return acc;
	}, {});
	const chartId = `warehouse-${useId().replaceAll(":", "")}`;

	return (
		<Card className="overflow-hidden bg-card/80 shadow-[0_4px_12px_-6px_rgba(0,0,0,0.1)] transition-all duration-300 hover:shadow-[0_6px_16px_-6px_rgba(0,0,0,0.15)]">
			<CardHeader className="relative border-b border-border/50 bg-muted/20 py-3 px-4">
				<div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-border/40 to-transparent" />
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="grid grid-cols-2 gap-[2px] opacity-30 mt-0.5">
							<div className="h-[3px] w-[3px] bg-foreground rounded-full" />
							<div className="h-[3px] w-[3px] bg-foreground rounded-full" />
							<div className="h-[3px] w-[3px] bg-foreground rounded-full" />
							<div className="h-[3px] w-[3px] bg-foreground rounded-full" />
						</div>
						<CardTitle className="uppercase tracking-[0.18em] font-industrial text-xs text-muted-foreground/80 font-bold">
							Live Floor Map
						</CardTitle>
					</div>
					<div className="flex items-center gap-3">
						<div className="flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground uppercase">
							<span className="w-1.5 h-1.5 rounded-full bg-chart-2 ring-2 ring-chart-2/20"></span>{" "}
							Optimal
						</div>
						<div className="flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground uppercase">
							<span className="w-1.5 h-1.5 rounded-full bg-warning ring-2 ring-warning/20"></span>{" "}
							Warning
						</div>
						<div className="flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground uppercase">
							<span className="w-1.5 h-1.5 rounded-full bg-destructive ring-2 ring-destructive/20 animate-pulse"></span>{" "}
							Critical
						</div>
					</div>
				</div>
			</CardHeader>
			<CardBody className="p-6 bg-muted/5 flex justify-center relative">
				<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-background/40 to-transparent pointer-events-none" />
				<div className="relative z-10 w-full max-w-[600px] aspect-[2/1]">
					<svg viewBox="0 0 430 210" className="w-full h-full drop-shadow-sm">
						<defs>
							<pattern id={`${chartId}-grid`} width="10" height="10" patternUnits="userSpaceOnUse">
								<path
									d="M 10 0 L 0 0 0 10"
									fill="none"
									stroke="currentColor"
									strokeWidth="0.5"
									className="text-border/40"
								/>
							</pattern>
							{zonesLayout.map((zone) => {
								const value = zonesMap[zone.id] ?? 0;
								const fill = colorForMetric(value, metric);

								return (
									<linearGradient
										key={`${zone.id}-gradient`}
										id={`${chartId}-${zone.id.toLowerCase()}-gradient`}
										x1="0"
										y1="0"
										x2="1"
										y2="1"
									>
										<stop offset="0%" stopColor={fill} stopOpacity="1" />
										<stop offset="100%" stopColor={fill} stopOpacity="0.72" />
									</linearGradient>
								);
							})}
						</defs>
						<rect width="100%" height="100%" fill={`url(#${chartId}-grid)`} />

						{zonesLayout.map((zone) => {
							const value = zonesMap[zone.id] ?? 0;
							const gradientFill = `url(#${chartId}-${zone.id.toLowerCase()}-gradient)`;

							return (
								<g
									key={zone.id}
									className="transition-all duration-300 hover:opacity-90 cursor-default group"
								>
									{/* Shadow/Depth */}
									<rect
										x={zone.x + 2}
										y={zone.y + 2}
										width={zone.width}
										height={zone.height}
										fill="var(--color-border)"
										opacity="0.5"
										rx="2"
									/>
									{/* Main Area */}
									<rect
										x={zone.x}
										y={zone.y}
										width={zone.width}
										height={zone.height}
										fill={gradientFill}
										stroke="var(--color-card)"
										strokeWidth="2"
										rx="2"
										className="transition-colors duration-500"
									/>
									{/* Label Background */}
									<rect
										x={zone.x + 10}
										y={zone.y + 10}
										width={zone.width - 20}
										height={24}
										rx="2"
										fill="var(--color-card)"
										fillOpacity="0.9"
									/>
									{/* Zone Name */}
									<text
										x={zone.x + zone.width / 2}
										y={zone.y + 26}
										textAnchor="middle"
										className="font-industrial text-[10px] uppercase font-bold fill-foreground tracking-wider"
									>
										{zone.id}
									</text>
									{/* Value */}
									<text
										x={zone.x + zone.width / 2}
										y={zone.y + 55}
										textAnchor="middle"
										className="font-mono text-xl font-bold fill-white drop-shadow-md"
										style={{ fill: "var(--color-card-foreground-inverse)" }}
									>
										{value}%
									</text>
								</g>
							);
						})}
					</svg>
				</div>
			</CardBody>
		</Card>
	);
};

export default WarehouseFloor;
