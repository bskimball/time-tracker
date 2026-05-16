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
		title: "Real-Time Workforce Visibility",
		description:
			"See who is clocked in, on break, or on task—instantly. Spot idle capacity before it costs you money and redirect labor where it is needed most.",
		benefits: ["Live floor dashboard", "Automated punch tracking", "Idle-station alerts"],
		group: "Monitoring",
	},
	{
		icon: LiaChartBarSolid,
		title: "Executive Reporting & KPIs",
		description:
			"Stop guessing. Get daily reports on overtime trends, labor cost per unit, and productivity by station. Export to Excel in one click.",
		benefits: ["Daily P&L-ready reports", "Overtime trend alerts", "Station-level scorecards"],
		group: "Analytics",
	},
	{
		icon: LiaSyncAltSolid,
		title: "Never Lose a Minute to Downtime",
		description:
			"Wi-Fi goes down? Workers keep punching in on their station tablets. Data syncs automatically when the network returns. No lost hours, no manual catch-up.",
		benefits: ["Offline time capture", "Auto-sync on reconnect", "Conflict-free merge"],
		group: "Continuity",
	},
	{
		icon: LiaShieldAltSolid,
		title: "Compliance You Can Prove",
		description:
			"Audit-ready time logs, enforced break policies, and role-based access so you pass labor inspections without the scramble. SOC 2 Type II certified.",
		benefits: ["Audit trails", "Break-policy enforcement", "SOC 2 certified"],
		group: "Security",
	},
	{
		icon: LiaCloudSolid,
		title: "Your Stack, Your Rules",
		description:
			"Cloud for speed, on-prem for control, or hybrid for the best of both. The same dashboards and policies work everywhere.",
		benefits: ["AWS / Azure / GCP", "Air-gapped option", "One policy, all sites"],
		group: "Infrastructure",
	},
	{
		icon: LiaCogSolid,
		title: "Plays Nice With Your Payroll",
		description:
			"Push approved hours straight to ADP, Workday, or your home-grown payroll. Open API + webhooks mean your integration team finishes in a sprint, not a quarter.",
		benefits: ["ADP / Workday ready", "OpenAPI + webhooks", "Pre-built connectors"],
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
							Turn labor data into decisions that save money.
						</h2>
						<p className="mt-4 max-w-2xl text-lg leading-8 text-foreground/70">
							Every module is built for operators under real production pressure:
							fast readouts, clear hierarchy, and zero wasted clicks.
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
