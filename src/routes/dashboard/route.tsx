import { Header } from "../../components/header";
import { Footer } from "../../components/footer";
import { db } from "../../lib/db";
import { validateRequest } from "../../lib/auth";

// Fetch dashboard data directly in Server Component
export default async function Component() {
	// Get authenticated user from middleware
	// Middleware ensures user is authenticated before this component renders
	const { user } = await validateRequest();
	const headerName = user?.name ?? user?.email ?? null;
	const headerRole = user?.role ?? "USER";

	// Get metrics for the dashboard
	const [totalEmployees, totalStations, activeClocks, activeBreaks, pendingTodos, completedTodos] =
		await Promise.all([
			db.employee.count(),
			db.station.count(),
			db.timeLog.count({
				where: { endTime: null, type: "WORK", deletedAt: null },
			}),
			db.timeLog.count({
				where: { endTime: null, type: "BREAK", deletedAt: null },
			}),
			db.todo.count({ where: { completed: false } }),
			db.todo.count({ where: { completed: true } }),
		]);

	// Get recent activity (last 5 clock events)
	const recentActivity = await db.timeLog.findMany({
		take: 5,
		orderBy: { createdAt: "desc" },
		include: { Employee: true, Station: true },
	});

	return (
		<>
			<title>Warehouse Dashboard</title>
			<meta name="description" content="Fulfillment warehouse operations dashboard" />

			<Header userName={headerName} userRole={headerRole} />
			<main className="container mx-auto py-8 lg:py-12">
				<h1 className="text-4xl font-bold mb-8">Warehouse Dashboard</h1>

				{/* Metrics Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
					<div className="card bg-base-200 shadow-xl">
						<div className="card-body">
							<h2 className="card-title text-primary">Employees</h2>
							<p className="text-4xl font-bold">{totalEmployees}</p>
							<p className="text-sm opacity-70">Total employees</p>
						</div>
					</div>

					<div className="card bg-base-200 shadow-xl">
						<div className="card-body">
							<h2 className="card-title text-primary">Stations</h2>
							<p className="text-4xl font-bold">{totalStations}</p>
							<p className="text-sm opacity-70">Active stations</p>
						</div>
					</div>

					<div className="card bg-base-200 shadow-xl">
						<div className="card-body">
							<h2 className="card-title text-success">Clocked In</h2>
							<p className="text-4xl font-bold">{activeClocks}</p>
							<p className="text-sm opacity-70">Currently working</p>
						</div>
					</div>

					<div className="card bg-base-200 shadow-xl">
						<div className="card-body">
							<h2 className="card-title text-warning">On Break</h2>
							<p className="text-4xl font-bold">{activeBreaks}</p>
							<p className="text-sm opacity-70">Taking a break</p>
						</div>
					</div>

					<div className="card bg-base-200 shadow-xl">
						<div className="card-body">
							<h2 className="card-title text-info">Pending Todos</h2>
							<p className="text-4xl font-bold">{pendingTodos}</p>
							<p className="text-sm opacity-70">Tasks remaining</p>
						</div>
					</div>

					<div className="card bg-base-200 shadow-xl">
						<div className="card-body">
							<h2 className="card-title text-success">Completed Todos</h2>
							<p className="text-4xl font-bold">{completedTodos}</p>
							<p className="text-sm opacity-70">Tasks done</p>
						</div>
					</div>
				</div>

				{/* Recent Activity */}
				<div className="card bg-base-200 shadow-xl">
					<div className="card-body">
						<h2 className="card-title mb-4">Recent Activity</h2>
						{recentActivity.length === 0 ? (
							<p className="text-center opacity-70 py-4">No recent activity</p>
						) : (
							<div className="space-y-2">
								{recentActivity.map((log) => (
									<div
										key={log.id}
										className="flex items-center justify-between p-3 bg-base-200 rounded-lg"
									>
										<div className="flex items-center gap-3">
											<div
												className={`badge ${log.type === "WORK" ? "badge-success" : "badge-warning"}`}
											>
												{log.type}
											</div>
											<span className="font-medium">{log.Employee.name}</span>
											{log.Station && (
												<span className="text-sm opacity-70">@ {log.Station.name}</span>
											)}
										</div>
										<div className="text-sm opacity-70">
											{log.endTime ? "Clocked Out" : "Clocked In"}
										</div>
									</div>
								))}
							</div>
						)}
					</div>
				</div>
			</main>
			<Footer />
		</>
	);
}
