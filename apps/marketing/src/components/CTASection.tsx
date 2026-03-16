import { Button, IndustrialPanel } from "@monorepo/design-system";

const readinessChecks = [
	"Role-based permissions configured",
	"Offline sync policy enabled",
	"Executive KPI templates loaded",
	"Deployment paths available: cloud / hybrid / on-prem",
];

export default function CTASection() {
	return (
		<section className="relative overflow-hidden bg-background py-20">
			<div className="absolute inset-0 bg-noise opacity-20 pointer-events-none" />
			<div className="absolute inset-0 bg-tactical-grid opacity-[0.05] pointer-events-none" aria-hidden="true" />

			<div className="container mx-auto px-4 md:px-8 relative">
				<IndustrialPanel className="overflow-hidden border-border/80 bg-card shadow-[0_22px_60px_-30px_rgba(15,23,42,0.3)]">
					<div className="grid lg:grid-cols-[minmax(0,1fr)_360px]">
						<div className="border-b border-border/70 p-8 lg:border-b-0 lg:border-r">
							<div className="mb-4 inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-primary">
								<span className="inline-flex items-center rounded-[2px] border border-primary/20 bg-primary/10 px-2 py-1">04</span>
								Deployment Window
							</div>
							<h2 className="max-w-2xl font-display text-4xl font-black tracking-[-0.04em] text-foreground md:text-5xl leading-tight">
								Ready to Transform Your Operations?
							</h2>
							<p className="mt-5 max-w-2xl text-lg leading-8 text-foreground/70">
								Stand up a workforce command layer that looks and feels like the product itself:
								measured, calm, and engineered for decision-making under pressure.
							</p>

							<div className="mt-10 flex flex-col gap-4 sm:flex-row">
								<a href="/pricing">
									<Button size="lg" className="btn-mechanical px-10 py-6 text-sm w-full sm:w-auto uppercase tracking-widest font-bold shadow-[0_4px_0_0_oklch(48%_0.14_42)] hover:translate-y-[2px] hover:shadow-[0_2px_0_0_oklch(48%_0.14_42)] active:translate-y-[4px] active:shadow-none transition-all">
										Start Deployment
									</Button>
								</a>
								<a href="/features">
									<Button variant="outline" size="lg" className="w-full sm:w-auto border-2 border-border/80 bg-background px-10 py-6 text-sm uppercase tracking-widest font-bold hover:border-primary/50 hover:bg-muted/50 transition-all">
										Schedule Demo
									</Button>
								</a>
							</div>
						</div>

						<div className="bg-muted/40 p-8 border-l-2 border-border/60">
							<div className="mb-6 flex items-center justify-between gap-3 border-b-2 border-border/60 pb-4">
								<span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground font-bold">
									System readiness
								</span>
								<span className="inline-flex items-center gap-2 rounded-[2px] border border-primary/20 bg-primary/10 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-primary">
									<span className="h-1.5 w-1.5 rounded-full bg-primary" />
									Nominal
								</span>
							</div>

							<div className="space-y-3">
								{readinessChecks.map((item, index) => (
									<div key={item} className="flex items-start gap-3 border border-border/60 bg-card px-4 py-3 shadow-industrial">
										<span className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.2em] text-primary">0{index + 1}</span>
										<span className="text-sm leading-6 text-foreground/75">{item}</span>
									</div>
								))}
							</div>

							<div className="mt-5 rounded-[2px] border border-border/60 bg-card px-4 py-4 shadow-industrial">
								<div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Launch path</div>
								<div className="mt-2 font-display text-2xl font-bold tracking-tight text-foreground">2-Week Guided Rollout</div>
								<div className="mt-2 text-sm text-muted-foreground">From pilot setup to executive dashboards with floor-ready workflows.</div>
							</div>
						</div>
					</div>
				</IndustrialPanel>
			</div>
		</section>
	);
}
