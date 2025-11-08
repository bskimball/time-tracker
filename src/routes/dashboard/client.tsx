"use client";

import {
	BarChart,
	Bar,
	LineChart,
	Line,
	PieChart,
	Pie,
	Cell,
	AreaChart,
	Area,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from "recharts";

// Fake data for fulfillment warehouse dashboard
const dailyOrdersData = [
	{ day: "Mon", orders: 245 },
	{ day: "Tue", orders: 312 },
	{ day: "Wed", orders: 289 },
	{ day: "Thu", orders: 378 },
	{ day: "Fri", orders: 456 },
	{ day: "Sat", orders: 234 },
	{ day: "Sun", orders: 198 },
];

const productivityData = [
	{ time: "8:00", productivity: 85 },
	{ time: "9:00", productivity: 92 },
	{ time: "10:00", productivity: 88 },
	{ time: "11:00", productivity: 95 },
	{ time: "12:00", productivity: 78 },
	{ time: "13:00", productivity: 89 },
	{ time: "14:00", productivity: 91 },
	{ time: "15:00", productivity: 87 },
	{ time: "16:00", productivity: 82 },
];

const taskDistributionData = [
	{ name: "Picking", value: 45, color: "#8884d8" },
	{ name: "Packing", value: 30, color: "#82ca9d" },
	{ name: "Shipping", value: 15, color: "#ffc658" },
	{ name: "Quality Check", value: 10, color: "#ff7300" },
];

const efficiencyData = [
	{ month: "Jan", efficiency: 78 },
	{ month: "Feb", efficiency: 82 },
	{ month: "Mar", efficiency: 85 },
	{ month: "Apr", efficiency: 88 },
	{ month: "May", efficiency: 91 },
	{ month: "Jun", efficiency: 89 },
];

export function DashboardCharts() {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
			{/* Daily Orders Fulfilled */}
			<div className="card bg-base-200 shadow-xl">
				<div className="card-body">
					<h2 className="card-title">Daily Orders Fulfilled</h2>
					<ResponsiveContainer width="100%" height={300}>
						<BarChart data={dailyOrdersData}>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="day" />
							<YAxis />
							<Tooltip />
							<Bar dataKey="orders" fill="#8884d8" />
						</BarChart>
					</ResponsiveContainer>
				</div>
			</div>

			{/* Employee Productivity */}
			<div className="card bg-base-200 shadow-xl">
				<div className="card-body">
					<h2 className="card-title">Today&apos;s Productivity Trend</h2>
					<ResponsiveContainer width="100%" height={300}>
						<LineChart data={productivityData}>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="time" />
							<YAxis domain={[0, 100]} />
							<Tooltip />
							<Line type="monotone" dataKey="productivity" stroke="#82ca9d" strokeWidth={2} />
						</LineChart>
					</ResponsiveContainer>
				</div>
			</div>

			{/* Task Distribution */}
			<div className="card bg-base-200 shadow-xl">
				<div className="card-body">
					<h2 className="card-title">Task Distribution</h2>
					<ResponsiveContainer width="100%" height={300}>
						<PieChart>
							<Pie
								data={taskDistributionData}
								cx="50%"
								cy="50%"
								labelLine={false}
								label={((props: any) =>
									`${props.name} ${((props.percent as number) * 100).toFixed(0)}%`
								) as any}
								outerRadius={80}
								fill="#8884d8"
								dataKey="value"
							>
								{taskDistributionData.map((entry, index) => (
									<Cell key={`cell-${index}`} fill={entry.color} />
								))}
							</Pie>
							<Tooltip />
						</PieChart>
					</ResponsiveContainer>
				</div>
			</div>

			{/* Warehouse Efficiency */}
			<div className="card bg-base-200 shadow-xl">
				<div className="card-body">
					<h2 className="card-title">Warehouse Efficiency Trend</h2>
					<ResponsiveContainer width="100%" height={300}>
						<AreaChart data={efficiencyData}>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="month" />
							<YAxis domain={[0, 100]} />
							<Tooltip />
							<Area
								type="monotone"
								dataKey="efficiency"
								stroke="#ffc658"
								fill="#ffc658"
								fillOpacity={0.6}
							/>
						</AreaChart>
					</ResponsiveContainer>
				</div>
			</div>
		</div>
	);
}
