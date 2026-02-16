import { KPICard } from "~/routes/executive/kpi-card";
import { Card, CardBody, CardHeader, CardTitle } from "@monorepo/design-system";

// ─── Primitives ─────────────────────────────────────────────────────────────

export function MetricSkeleton() {
	// Replaced by KPICard({ loading: true }) usage in specific row skeletons
	return null;
}

export function ChartSkeleton({ title }: { title?: string; height?: number }) {
	return (
		<Card className="h-full flex flex-col">
			<CardHeader className="bg-muted/30 border-b border-border/50 py-3">
				<CardTitle className="uppercase tracking-widest font-industrial text-sm text-muted-foreground">
					{title || "Loading Chart..."}
				</CardTitle>
			</CardHeader>
			<CardBody className="p-4 flex-1 flex items-center justify-center">
				<div className="w-full h-full border border-dashed border-border/40 rounded bg-muted/5 flex items-center justify-center">
					<span className="text-xs font-mono text-muted-foreground animate-pulse">Initializing...</span>
				</div>
			</CardBody>
		</Card>
	);
}

export function TableSkeleton({
	title,
	rows = 5,
}: {
	title?: string;
	rows?: number;
}) {
	return (
		<Card className="overflow-hidden">
			<CardHeader className="border-b border-border/50 bg-muted/30 py-3">
				<CardTitle className="text-sm font-industrial uppercase tracking-widest text-muted-foreground">
					{title || <div className="h-4 w-48 bg-muted/40 rounded animate-pulse" />}
				</CardTitle>
			</CardHeader>
			<div className="p-0">
				<div className="border-b border-border/50 bg-muted/10 px-4 py-3">
					<div className="flex justify-between gap-4">
						<div className="h-3 w-1/4 bg-muted/40 rounded animate-pulse" />
						<div className="h-3 w-1/6 bg-muted/40 rounded animate-pulse" />
						<div className="h-3 w-1/6 bg-muted/40 rounded animate-pulse" />
						<div className="h-3 w-1/6 bg-muted/40 rounded animate-pulse" />
					</div>
				</div>
				<div className="divide-y divide-border/30">
					{Array.from({ length: rows }).map((_, i) => (
						<div key={i} className="px-4 py-3 flex justify-between gap-4 animate-pulse">
							<div className="h-3 w-1/4 bg-muted/20 rounded" />
							<div className="h-3 w-1/6 bg-muted/20 rounded" />
							<div className="h-3 w-1/6 bg-muted/20 rounded" />
							<div className="h-3 w-1/6 bg-muted/20 rounded" />
						</div>
					))}
				</div>
			</div>
		</Card>
	);
}

export function StationCardSkeleton() {
	return (
		<Card className="overflow-hidden">
			<CardHeader className="border-b border-border/50 bg-muted/30 py-2">
				<div className="flex items-center justify-between">
					<div className="h-3 w-20 bg-muted/40 rounded animate-pulse" />
					<div className="h-2 w-2 rounded-full bg-muted/40 animate-pulse" />
				</div>
			</CardHeader>
			<CardBody className="space-y-3 p-4">
				<div className="grid grid-cols-2 gap-2">
					<div className="space-y-1">
						<div className="h-2 w-8 bg-muted/30 rounded animate-pulse" />
						<div className="h-6 w-12 bg-muted/30 rounded animate-pulse" />
					</div>
					<div className="space-y-1">
						<div className="h-2 w-8 bg-muted/30 rounded animate-pulse" />
						<div className="h-6 w-12 bg-muted/30 rounded animate-pulse" />
					</div>
				</div>
				<div className="h-1.5 w-full bg-muted/30 rounded-full animate-pulse" />
				<div className="flex justify-between">
					<div className="h-2 w-12 bg-muted/30 rounded animate-pulse" />
					<div className="h-2 w-8 bg-muted/30 rounded animate-pulse" />
				</div>
			</CardBody>
		</Card>
	);
}

// ─── Section Skeletons ──────────────────────────────────────────────────────

// Productivity
export function ProductivityKpiRowSkeleton() {
	return (
		<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
			<KPICard title="Avg Units/Hour" value="0.0" loading />
			<KPICard title="Top Performer" value="0.0 u/h" loading />
			<KPICard title="Task Completion" value="0%" loading />
			<Card className="h-full border-l-4 border-l-muted bg-muted/10 opacity-60">
				<CardBody className="flex h-full flex-col justify-between p-4">
					<div>
						<div className="mb-1 text-xs font-industrial uppercase tracking-widest text-muted-foreground">
							System Status
						</div>
						<div className="font-data text-2xl font-bold text-muted-foreground">CONNECTING</div>
					</div>
				</CardBody>
			</Card>
		</div>
	);
}

export function ProductivityChartsSkeleton() {
	return (
		<>
			<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
				<ChartSkeleton title="Productivity Trends Over Time" />
				<ChartSkeleton title="Station Efficiency Comparison" />
			</div>

			<div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mt-6">
				<ChartSkeleton title="Task Type Efficiency" />
				<ChartSkeleton title="Shift Productivity" />
			</div>
		</>
	);
}

export function ProductivityStationCardsSkeleton() {
	return (
		<div>
			<h3 className="mb-4 text-sm font-bold font-industrial uppercase tracking-widest text-muted-foreground">
				Station Performance Breakdown
			</h3>
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
				<StationCardSkeleton />
				<StationCardSkeleton />
				<StationCardSkeleton />
				<StationCardSkeleton />
			</div>
		</div>
	);
}

export function ProductivityEmployeeTableSkeleton() {
	return <TableSkeleton title="Employee Productivity Rankings" rows={8} />;
}

// Labor Cost
export function LaborCostKpiRowSkeleton() {
	return (
		<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
			<KPICard title="Regular Hours" value="$0" loading />
			<KPICard title="Overtime Cost" value="$0" loading />
			<KPICard title="Total Cost" value="$0" loading />
			<KPICard title="Budget Variance" value="0%" loading />
		</div>
	);
}

export function LaborCostChartsSkeleton() {
	return (
		<>
			<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
				<ChartSkeleton title="Labor Cost Trends (Cost per Unit)" />
				<ChartSkeleton title="Shift Productivity vs Cost" />
			</div>

			<div className="grid grid-cols-1 gap-6 lg:grid-cols-3 mt-6">
				<div className="lg:col-span-1">
					<ChartSkeleton title="Labor Cost Breakdown" height={300} />
				</div>
			</div>
		</>
	);
}

export function LaborCostStationTableSkeleton() {
	return <TableSkeleton title="Cost Analysis by Station" rows={6} />;
}

// Trends
export function TrendKpisSkeleton() {
	return (
		<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
			<KPICard title="Productivity Trend" value="0%" loading />
			<KPICard title="Cost Trend" value="0%" loading />
			<KPICard title="Quality Trend" value="0%" loading />
		</div>
	);
}

export function TrendChartsSkeleton() {
	return (
		<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
			<ChartSkeleton title="Productivity Momentum" />
			<ChartSkeleton title="Cost Efficiency" />
		</div>
	);
}

export function TrendAnomalyTableSkeleton() {
	return <TableSkeleton title="Detected Anomalies & Alerts" rows={4} />;
}

// Capacity
export function CapacityKpisSkeleton() {
	return (
		<div className="grid grid-cols-1 gap-4 md:grid-cols-4">
			<KPICard title="Overall Utilization" value="0%" loading />
			<KPICard title="Staff Shortage" value="0" loading />
			<KPICard title="Cost Impact" value="$0" loading />
			<KPICard title="Bottlenecks" value="0" loading />
		</div>
	);
}

export function CapacityFloorSkeleton() {
	return (
		<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
			<div className="lg:col-span-2">
				<Card className="h-full min-h-[400px]">
					<CardHeader className="border-b border-border/50 bg-muted/30 py-3">
						<CardTitle className="uppercase tracking-widest font-industrial text-sm text-muted-foreground">
							Warehouse Floor Map
						</CardTitle>
					</CardHeader>
					<CardBody className="p-4 h-full relative overflow-hidden">
						<div className="absolute inset-0 bg-muted/10 animate-pulse" />
						<div className="grid grid-cols-4 gap-4 h-full p-8 opacity-30">
							{Array.from({ length: 8 }).map((_, i) => (
								<div key={i} className="bg-muted/40 rounded border border-border/50" />
							))}
						</div>
					</CardBody>
				</Card>
			</div>
			<div className="space-y-4 lg:col-span-1">
				<StationCardSkeleton />
				<StationCardSkeleton />
				<StationCardSkeleton />
			</div>
		</div>
	);
}

// Benchmarks
export function BenchmarkKpisSkeleton() {
	return (
		<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
			<KPICard title="Productivity Position" value="0 u/h" loading />
			<KPICard title="Cost Position" value="$0.00" loading />
			<KPICard title="Quality Position" value="0%" loading />
		</div>
	);
}

export function BenchmarkChartsSkeleton() {
	return (
		<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
			<ChartSkeleton title="Productivity Benchmark Ladder" height={300} />
			<ChartSkeleton title="Cost Benchmark Ladder (Lower Is Better)" height={300} />
		</div>
	);
}

export function BenchmarkStationTableSkeleton() {
	return <TableSkeleton title="Station Benchmark Positioning" rows={6} />;
}
