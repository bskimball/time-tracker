import { IndustrialPanel, Button } from "@monorepo/design-system";
import { LiaCheckSquareSolid, LiaTerminalSolid } from "react-icons/lia";

export default function FeaturesCTA() {
	return (
		<section className="py-24 relative overflow-hidden bg-background">
			{/* Textured Background */}
			<div className="absolute inset-0 bg-noise opacity-[0.25] pointer-events-none mix-blend-overlay" />
			<div className="absolute inset-0 bg-tactical-grid opacity-[0.05] pointer-events-none" aria-hidden="true" />

			<div className="container mx-auto px-4 md:px-8 relative">
				<IndustrialPanel className="overflow-hidden border-2 border-primary/50 bg-card shadow-[0_22px_60px_-30px_rgba(var(--color-primary),0.2)] max-w-5xl mx-auto">
					<div className="grid lg:grid-cols-[1fr_320px]">
						<div className="p-10 lg:border-r-2 lg:border-border/60">
							<div className="mb-6 inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.25em] text-primary">
								<span className="inline-flex items-center rounded-sm border border-primary/30 bg-primary/10 px-2 py-1 shadow-inner">
									<LiaTerminalSolid className="mr-2" />
									INIT.02
								</span>
								System Deployment
							</div>
							
							<h2 className="max-w-2xl font-display text-4xl font-black tracking-[-0.04em] text-foreground md:text-5xl leading-tight uppercase">
								Experience The Power Of ShiftPulse
							</h2>
							
							<p className="mt-6 max-w-xl text-lg leading-relaxed text-foreground/70 font-body border-l-2 border-primary/40 pl-4">
								See how our comprehensive feature set can transform your workforce management.
								Schedule a personalized demo to explore how ShiftPulse fits your specific operational needs.
							</p>

							<div className="mt-10 flex flex-col sm:flex-row gap-4">
								<a href="/pricing" className="w-full sm:w-auto">
									<Button size="lg" className="w-full btn-mechanical px-8 py-6 text-sm uppercase tracking-widest font-bold shadow-[0_4px_0_0_oklch(48%_0.14_42)] hover:translate-y-[2px] hover:shadow-[0_2px_0_0_oklch(48%_0.14_42)] active:translate-y-[4px] active:shadow-none transition-all">
										Start Free Trial
									</Button>
								</a>
								<a href="mailto:sales@industrialtime.com" className="w-full sm:w-auto">
									<Button variant="outline" size="lg" className="w-full border-2 border-border/80 bg-background px-8 py-6 text-sm uppercase tracking-widest font-bold hover:border-primary/50 hover:bg-muted/50 transition-all">
										Schedule Demo
									</Button>
								</a>
							</div>
						</div>

						<div className="bg-primary/5 p-8 relative overflow-hidden flex flex-col justify-center">
							<div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(var(--color-primary),0.03)_50%,transparent_75%)] bg-[length:250%_250%,100%_100%] animate-bg-pan"></div>
							
							<div className="mb-6 flex items-center justify-between gap-3 border-b-2 border-primary/20 pb-4 relative z-10">
								<span className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary font-bold">
									Trial Parameters
								</span>
							</div>

							<div className="space-y-4 relative z-10">
								<div className="flex items-start gap-3 bg-background/50 border border-primary/10 p-3">
									<LiaCheckSquareSolid className="mt-0.5 text-primary text-lg flex-shrink-0" />
									<span className="font-mono text-[11px] uppercase tracking-[0.1em] text-foreground/80 font-bold">14-Day Full Access</span>
								</div>
								<div className="flex items-start gap-3 bg-background/50 border border-primary/10 p-3">
									<LiaCheckSquareSolid className="mt-0.5 text-primary text-lg flex-shrink-0" />
									<span className="font-mono text-[11px] uppercase tracking-[0.1em] text-foreground/80 font-bold">Unlimited Nodes</span>
								</div>
								<div className="flex items-start gap-3 bg-background/50 border border-primary/10 p-3">
									<LiaCheckSquareSolid className="mt-0.5 text-primary text-lg flex-shrink-0" />
									<span className="font-mono text-[11px] uppercase tracking-[0.1em] text-foreground/80 font-bold">Zero Setup Fees</span>
								</div>
							</div>
						</div>
					</div>
				</IndustrialPanel>
			</div>
		</section>
	);
}
