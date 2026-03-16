import { IndustrialPanel, Button, Alert } from "@monorepo/design-system";
import { LiaCheckSquareSolid, LiaTerminalSolid, LiaServerSolid } from "react-icons/lia";

export default function PricingCards() {
	const plans = [
		{
			name: "Starter",
			price: "$29",
			period: "/month",
			description: "Perfect for small operations",
			popular: false,
			features: [
				"Up to 25 employees",
				"Real-time tracking",
				"Basic reporting",
				"Email support"
			],
			cta: "Start Free Trial",
			ctaVariant: "outline" as const
		},
		{
			name: "Professional",
			price: "$79",
			period: "/month",
			description: "For growing industrial operations",
			popular: true,
			features: [
				"Up to 100 employees",
				"Advanced analytics",
				"Custom reports",
				"Priority support",
				"API access"
			],
			cta: "Start Deployment",
			ctaVariant: "primary" as const
		},
		{
			name: "Enterprise",
			price: "Custom",
			period: "",
			description: "For large-scale operations",
			popular: false,
			features: [
				"Unlimited employees",
				"All features included",
				"Custom integrations",
				"Dedicated support",
				"On-premise deployment"
			],
			cta: "Contact Sales",
			ctaVariant: "outline" as const
		}
	];

	return (
		<section className="py-24 bg-muted/20 relative overflow-hidden border-b-2 border-border/60">
			{/* Textured Background */}
			<div className="absolute inset-0 bg-noise opacity-[0.25] pointer-events-none mix-blend-overlay" />
			<div className="absolute inset-0 bg-tactical-grid opacity-[0.06] dark:opacity-[0.12] pointer-events-none animate-grid-pan" aria-hidden="true" />

			<div className="container mx-auto px-4 md:px-8 relative z-10">
				<div className="grid lg:grid-cols-3 gap-6 max-w-6xl mx-auto relative">
					{/* Connecting lines for industrial look */}
					<div className="absolute top-1/2 left-0 w-full h-px bg-border/40 pointer-events-none hidden lg:block" aria-hidden="true"></div>
					
					{plans.map((plan, index) => (
						<div key={index} className={`relative flex flex-col ${plan.popular ? 'lg:-translate-y-4' : ''}`}>
							{plan.popular && (
								<div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20">
									<div className="bg-primary text-primary-foreground px-3 py-1 rounded-sm text-[10px] font-mono uppercase tracking-[0.2em] font-bold flex items-center gap-2 shadow-[0_2px_10px_rgba(var(--color-primary),0.4)]">
										<span className="w-1.5 h-1.5 bg-background rounded-full animate-pulse"></span>
										Recommended
									</div>
								</div>
							)}

							<IndustrialPanel className={`flex flex-col flex-1 p-0 relative group transition-all duration-300 ${plan.popular ? 'border-2 border-primary/80 shadow-[0_15px_40px_-15px_rgba(var(--color-primary),0.3)]' : 'border-2 border-border/70 shadow-sm hover:border-primary/40'}`}>
								{/* Header */}
								<div className={`p-8 border-b-2 ${plan.popular ? 'border-primary/20 bg-primary/5' : 'border-border/60 bg-muted/30'}`}>
									<div className="flex items-center justify-between mb-4">
										<h3 className="text-xl font-display font-bold uppercase tracking-wider">{plan.name}</h3>
										<span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground bg-background border border-border/50 px-1.5 py-0.5">Tier.0{index + 1}</span>
									</div>
									<div className="text-5xl font-display font-black tracking-[-0.04em] text-foreground mb-2 flex items-baseline gap-1">
										{plan.price}
										{plan.period && <span className="text-sm font-mono tracking-widest text-muted-foreground uppercase">{plan.period}</span>}
									</div>
									<p className="text-sm text-foreground/70 font-body">{plan.description}</p>
								</div>

								{/* Features */}
								<div className="p-8 flex-1 bg-card">
									<div className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary font-bold mb-6 flex items-center gap-2">
										<LiaTerminalSolid className="text-lg" /> Allocated Resources
									</div>
									<ul className="space-y-4">
										{plan.features.map((feature, i) => (
											<li key={i} className="flex items-start gap-3">
												<LiaCheckSquareSolid className={`mt-0.5 flex-shrink-0 text-lg ${plan.popular ? 'text-primary' : 'text-primary/60'}`} />
												<span className="text-sm font-body text-foreground/80">{feature}</span>
											</li>
										))}
									</ul>
								</div>

								{/* CTA */}
								<div className={`p-8 border-t-2 ${plan.popular ? 'border-primary/20 bg-primary/5' : 'border-border/60 bg-muted/10'}`}>
									<Button
										variant={plan.ctaVariant}
										className={`w-full py-6 text-sm uppercase tracking-widest font-bold ${plan.popular ? 'shadow-[0_4px_0_0_oklch(48%_0.14_42)] hover:translate-y-[2px] hover:shadow-[0_2px_0_0_oklch(48%_0.14_42)] active:translate-y-[4px] active:shadow-none' : 'border-2 border-border/80'}`}
										size="lg"
									>
										{plan.cta}
									</Button>
								</div>
							</IndustrialPanel>
						</div>
					))}
				</div>

				<div className="mt-16 text-center max-w-3xl mx-auto">
					<div className="inline-flex flex-col sm:flex-row items-center gap-4 bg-card border-2 border-border/70 shadow-sm p-4 px-6 relative overflow-hidden">
						<div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
						<div className="flex items-center gap-3">
							<LiaServerSolid className="text-primary text-2xl" />
							<strong className="font-mono text-[11px] uppercase tracking-[0.15em]">Global SLA Parameters:</strong>
						</div>
						<div className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground flex flex-wrap justify-center gap-x-4 gap-y-2">
							<span>14-Day Eval</span>
							<span className="text-border/60">•</span>
							<span>No Card Required</span>
							<span className="text-border/60">•</span>
							<span>SOC 2 Sec</span>
							<span className="text-border/60">•</span>
							<span className="text-primary">99.9% Uptime</span>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
