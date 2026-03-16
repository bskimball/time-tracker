import { IndustrialPanel, Button } from "@monorepo/design-system";
import {
	LiaClockSolid,
	LiaChartBarSolid,
	LiaSyncAltSolid,
	LiaShieldAltSolid,
	LiaCloudSolid,
	LiaCogSolid,
} from "react-icons/lia";

const features = [
	{
		icon: LiaClockSolid,
		title: "Real-Time Workforce Monitoring",
		description:
			"Track employee activity, task assignments, and station throughput in real time across every floor, dock, and fulfillment lane.",
		benefits: ["Live dashboard updates", "Automated time tracking", "Performance alerts"],
		group: "Monitoring",
	},
	{
		icon: LiaChartBarSolid,
		title: "Advanced Analytics & KPIs",
		description:
			"Turn raw labor data into executive signals with custom reporting, utilization trends, and operational scorecards.",
		benefits: ["Custom report builder", "KPI tracking", "Executive dashboards"],
		group: "Analytics",
	},
	{
		icon: LiaSyncAltSolid,
		title: "Offline Reliability",
		description:
			"Keep production moving during outages with resilient local capture and automatic sync the moment connectivity returns.",
		benefits: ["Offline data collection", "Automatic synchronization", "Data integrity guarantees"],
		group: "Continuity",
	},
	{
		icon: LiaShieldAltSolid,
		title: "Enterprise Security",
		description:
			"Protect workforce data with strict access controls, hardened transport, and compliance-aligned operational safeguards.",
		benefits: ["AES-256 encryption", "SOC 2 certified", "Role-based access"],
		group: "Security",
	},
	{
		icon: LiaCloudSolid,
		title: "Flexible Deployment",
		description:
			"Launch on-prem, in the cloud, or in hybrid mode without compromising telemetry, reporting, or policy enforcement.",
		benefits: ["Multi-cloud support", "On-premise option", "Hybrid deployment"],
		group: "Infrastructure",
	},
	{
		icon: LiaCogSolid,
		title: "OpenAPI Compliant",
		description:
			"Integrate scheduling, HRIS, payroll, and floor systems with a clean API surface, webhooks, and documented contracts.",
		benefits: ["200+ API endpoints", "Complete documentation", "SDKs & webhooks"],
		group: "Platform",
	},
];

export default function FeaturesSection() {
	return (
		<section className="relative overflow-hidden border-y border-border/70 bg-muted/20 py-20">
			<div className="absolute inset-0 bg-noise opacity-25 pointer-events-none" />
			<div className="absolute inset-0 bg-tactical-grid opacity-[0.08] pointer-events-none" aria-hidden="true" />

			<div className="container mx-auto px-4 md:px-8 relative">
				<div className="mb-12 grid gap-10 border-b border-border/60 pb-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-end">
					<div>
						<div className="mb-4 inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-primary">
							<span className="inline-flex items-center rounded-[2px] border border-primary/20 bg-primary/10 px-2 py-1">01</span>
							Capabilities Matrix
						</div>
						<h2 className="max-w-3xl font-display text-4xl font-black tracking-[-0.04em] text-foreground md:text-5xl leading-tight">
							Built to run the floor like the dashboard looks.
						</h2>
						<p className="mt-4 max-w-2xl text-lg leading-8 text-foreground/70">
							Every module mirrors the discipline of the web app: clear hierarchy, fast readouts,
							and practical tools for leaders operating under real production pressure.
						</p>
					</div>

					<IndustrialPanel className="bg-card/90 p-5 shadow-industrial border-2 border-border/80">
						<div className="flex items-center justify-between gap-3 border-b-2 border-border/60 pb-3">
							<span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold">
								Command summary
							</span>
							<span className="led-indicator active" aria-hidden="true" />
						</div>
						<div className="mt-4 space-y-3 font-mono text-[11px] uppercase tracking-[0.18em] text-foreground/72">
							<div className="flex items-center justify-between"><span className="text-muted-foreground">Modules online</span><span className="font-bold">06</span></div>
							<div className="flex items-center justify-between"><span className="text-muted-foreground">Sync policy</span><span className="font-bold">Automatic</span></div>
							<div className="flex items-center justify-between"><span className="text-muted-foreground">Alerting</span><span className="font-bold">Threshold-based</span></div>
							<div className="flex items-center justify-between"><span className="text-muted-foreground">API mode</span><span className="font-bold">Open</span></div>
						</div>
					</IndustrialPanel>
				</div>

				<div className="grid gap-5 lg:grid-cols-3 relative">
					<div className="absolute top-1/2 left-0 w-full h-px bg-border/40 pointer-events-none hidden lg:block" aria-hidden="true"></div>
					<div className="absolute top-0 left-1/3 w-px h-full bg-border/40 pointer-events-none hidden lg:block" aria-hidden="true"></div>
					<div className="absolute top-0 right-1/3 w-px h-full bg-border/40 pointer-events-none hidden lg:block" aria-hidden="true"></div>
					
					{features.map((feature, index) => (
						<IndustrialPanel
							key={feature.title}
							className="group flex h-full flex-col border-2 border-border/70 bg-card p-6 shadow-industrial hover:border-primary/60 hover:shadow-industrial-hover transition-all duration-300 relative z-10"
						>
							<div className="mb-5 flex items-start justify-between gap-4 border-b border-border/60 pb-4">
								<div className="flex items-start gap-4">
									<div className="flex h-12 w-12 items-center justify-center rounded-[2px] border border-primary/25 bg-primary/10 text-primary transition-transform duration-200 group-hover:scale-105">
										<feature.icon className="h-6 w-6" aria-hidden="true" />
									</div>
									<div>
										<p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
											0{index + 1} // {feature.group}
										</p>
										<h3 className="mt-2 font-display text-2xl font-bold leading-tight text-foreground">
											{feature.title}
										</h3>
									</div>
								</div>
							</div>

							<p className="mb-6 flex-1 text-sm leading-7 text-foreground/70">{feature.description}</p>

							<div className="space-y-3 border-t border-border/60 pt-5">
								{feature.benefits.map((benefit) => (
									<div key={benefit} className="flex items-center justify-between gap-3">
										<div className="flex items-center gap-3">
											<span className="h-1.5 w-1.5 rounded-full bg-primary" />
											<span className="text-[11px] font-mono uppercase tracking-[0.16em] text-foreground/72">
												{benefit}
											</span>
										</div>
										<span className="text-xs text-primary opacity-0 transition-opacity duration-200 group-hover:opacity-100">→</span>
									</div>
								))}
							</div>
						</IndustrialPanel>
					))}
				</div>

				<div className="mt-10 flex justify-center">
					<a href="/features">
						<Button size="lg" className="btn-mechanical px-8">Explore All Features</Button>
					</a>
				</div>
			</div>
		</section>
	);
}
