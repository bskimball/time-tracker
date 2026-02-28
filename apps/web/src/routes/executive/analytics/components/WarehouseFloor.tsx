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
		<Card className="overflow-hidden">
			<CardHeader className="bg-muted/30 border-b border-border/50 py-3">
				<div className="flex items-center justify-between">
					<CardTitle className="uppercase tracking-widest font-industrial text-sm text-muted-foreground">
						Live Floor Map
					</CardTitle>
					<div className="flex items-center gap-2">
						<div className="flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground uppercase">
							<span className="w-2 h-2 rounded-full bg-chart-2"></span> Optimal
						</div>
						<div className="flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground uppercase">
							<span className="w-2 h-2 rounded-full bg-warning"></span> Warning
						</div>
						<div className="flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground uppercase">
							<span className="w-2 h-2 rounded-full bg-destructive"></span> Critical
						</div>
					</div>
				</div>
			</CardHeader>
			<CardBody className="p-6 bg-muted/5 flex justify-center">
				<div className="relative w-full max-w-[600px] aspect-[2/1]">
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
