"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardBody } from "~/components/ds/card";
import { Button } from "~/components/ds/button";

interface CapacityScenario {
	id: string;
	name: string;
	description: string;
	employees: number;
	stations: number;
	projectedUnits: number;
	costPerUnit: number;
	utilization: number;
}

interface CapacityPlanningProps {
	timeRange: "today" | "week" | "month";
	stationData: Array<{
		name: string;
		totalEmployees: number;
		avgUnitsPerHour: number;
		occupancyRate: number;
	}>;
}

export function CapacityPlanningTool({ stationData }: CapacityPlanningProps) {
	const [scenarios] = useState<CapacityScenario[]>([
		{
			id: "1",
			name: "Current Staffing",
			description: "Based on current staffing levels",
			employees: 30,
			stations: stationData.length,
			projectedUnits: 850,
			costPerUnit: 0.82,
			utilization: 76,
		},
		{
			id: "2",
			name: "Peak Season",
			description: "Additional 20% staff for peak demand",
			employees: 36,
			stations: stationData.length,
			projectedUnits: 1020,
			costPerUnit: 0.86,
			utilization: 85,
		},
		{
			id: "3",
			name: "Optimized Schedule",
			description: "Redistributed staff based on efficiency",
			employees: 28,
			stations: stationData.length,
			projectedUnits: 890,
			costPerUnit: 0.78,
			utilization: 82,
		},
	]);

	const [activeScenario, setActiveScenario] = useState<string>("1");

	const currentScenario = scenarios.find((s) => s.id === activeScenario);

	const costPerUnitColor = (costPerUnit: number) => {
		if (costPerUnit > 0.9) return "text-red-600 bg-red-50 border-red-200 dark:text-red-300 dark:bg-red-900/30 dark:border-red-700";
		if (costPerUnit > 0.8) return "text-yellow-600 bg-yellow-50 border-yellow-200 dark:text-yellow-300 dark:bg-yellow-900/30 dark:border-yellow-700";
		return "text-green-600 bg-green-50 border-green-200 dark:text-green-300 dark:bg-green-900/30 dark:border-green-700";
	};

	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>Workforce Planning Scenarios</CardTitle>
				</CardHeader>
				<CardBody>
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
						{scenarios.map((scenario) => (
							<div
								key={scenario.id}
								className={`cursor-pointer transition-all ${scenario.id === activeScenario
										? "ring-2 ring-primary border-primary"
										: "border hover:border-border"
									}`}
								onClick={() => setActiveScenario(scenario.id)}
								style={{ display: "block" }}
							>
								<div className="p-4 border rounded-lg">
									<h3 className="text-base font-medium mb-2">{scenario.name}</h3>
									<p className="text-sm text-muted-foreground mb-3">{scenario.description}</p>
									<div className="space-y-3">
										<div className="flex justify-between">
											<span className="text-sm text-muted-foreground">Employees:</span>
											<span className="font-medium">{scenario.employees}</span>
										</div>
										<div className="flex justify-between">
											<span className="text-sm text-muted-foreground">Projected Units:</span>
											<span className="font-medium">{scenario.projectedUnits}</span>
										</div>
										<div className="flex justify-between">
											<span className="text-sm text-muted-foreground">Cost/Unit:</span>
											<span
												className={`font-medium px-2 py-1 rounded-full border ${costPerUnitColor(
													scenario.costPerUnit
												)}`}
											>
												${scenario.costPerUnit.toFixed(2)}
											</span>
										</div>
										<div className="flex justify-between">
											<span className="text-sm text-muted-foreground">Utilization:</span>
											<span
												className={`font-medium px-2 py-1 rounded-full border text-red-600 bg-red-50 border-red-200 dark:text-red-300 dark:bg-red-900/30 dark:border-red-700`}
											>
												{scenario.utilization}%
											</span>
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
				</CardBody>
			</Card>

			{currentScenario && (
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					{/* Station Allocation */}
					<Card>
						<CardHeader>
							<CardTitle>Station Allocation ({currentScenario.name})</CardTitle>
						</CardHeader>
						<CardBody>
							<div className="space-y-3">
								{stationData.map((station) => {
									const allocatedEmployees = Math.round(
										currentScenario.employees * (station.totalEmployees / 30) || 1
									);
									const projectedUnits = Math.round(
										allocatedEmployees * station.avgUnitsPerHour * 8
									);

									return (
										<div key={station.name} className="border rounded-lg p-3">
											<div className="flex justify-between items-start mb-2">
												<h4 className="font-medium text-sm">{station.name}</h4>
												<span className="text-xs text-muted-foreground">
													{station.avgUnitsPerHour.toFixed(1)} u/h per employee
												</span>
											</div>
											<div className="grid grid-cols-3 gap-2 text-sm">
												<div>
													<span className="text-muted-foreground">Employees:</span>
													<span className="ml-1 font-medium">{allocatedEmployees}</span>
												</div>
												<div>
													<span className="text-muted-foreground">Units:</span>
													<span className="ml-1 font-medium">{projectedUnits}</span>
												</div>
												<div>
													<span className="text-muted-foreground">Efficiency:</span>
													<span className="ml-1 font-medium">
														{station.occupancyRate.toFixed(0)}%
													</span>
												</div>
											</div>
										</div>
									);
								})}
							</div>
						</CardBody>
					</Card>

					{/* Recommendations */}
					<Card>
						<CardHeader>
							<CardTitle>Planning Recommendations</CardTitle>
						</CardHeader>
						<CardBody>
							<div className="space-y-4">
								<div className="p-3 bg-blue-50 border border-blue-200 dark:bg-blue-900/30 dark:border-blue-700 rounded-lg">
									<h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">Workforce Optimization</h4>
									<p className="text-sm text-blue-800 dark:text-blue-200">
										{currentScenario.utilization > 90
											? "Utilization is very high. Consider adding more staff to prevent burnout."
											: currentScenario.utilization < 70
												? "Utilization could be improved. Consider consolidating roles or finding additional work."
												: "Utilization is within optimal range (70-85%). Current staffing appears balanced."}
									</p>
								</div>

								<div className="p-3 bg-green-50 border border-green-200 dark:bg-green-900/30 dark:border-green-700 rounded-lg">
									<h4 className="font-medium text-green-900 dark:text-green-100 mb-1">Cost Efficiency</h4>
									<p className="text-sm text-green-800 dark:text-green-200">
										{currentScenario.costPerUnit < 0.8
											? "Excellent cost efficiency. This scenario provides good value per unit."
											: currentScenario.costPerUnit < 0.9
												? "Reasonable cost efficiency. Monitor for optimization opportunities."
												: "Cost per unit is high. Consider efficiency improvements or process optimization."}
									</p>
								</div>

								<div className="p-3 bg-purple-50 border border-purple-200 dark:bg-purple-900/30 dark:border-purple-700 rounded-lg">
									<h4 className="font-medium text-purple-900 dark:text-purple-100 mb-1">Bottleneck Analysis</h4>
									<div className="text-sm text-purple-800 dark:text-purple-200">
										<p className="mb-2">Based on current performance patterns:</p>
										<ul className="list-disc ml-4 space-y-1">
											<li>
												FILLING station shows highest efficiency (35.1 u/h) but high occupancy
											</li>
											<li>PACKING could benefit from additional staff during peak hours</li>
											<li>RECEIVING has available capacity for expansion</li>
										</ul>
									</div>
								</div>

								<div className="p-3 bg-accent border rounded-lg">
									<h4 className="font-medium mb-1">Seasonal Planning</h4>
									<p className="text-sm text-muted-foreground">
										Historical data shows peak demand increases by 25-30% during holiday seasons.
										Consider temporary staffing or cross-training to handle seasonal volume.
									</p>
								</div>
							</div>
						</CardBody>
					</Card>
				</div>
			)}

			<Card>
				<CardHeader>
					<CardTitle>Custom Scenario Builder</CardTitle>
				</CardHeader>
				<CardBody>
					<div className="space-y-4">
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<div>
								<label className="block text-sm font-medium mb-1">Scenario Name</label>
								<input
									type="text"
									placeholder="e.g., Summer 2024"
									className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium mb-1">Total Employees</label>
								<input
									type="number"
									placeholder="30"
									className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium mb-1">Expected Daily Volume</label>
								<input
									type="number"
									placeholder="1000"
									className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
								/>
							</div>
						</div>
						<Button variant="primary" size="sm">
							Calculate Scenario
						</Button>
					</div>
				</CardBody>
			</Card>
		</div>
	);
}
