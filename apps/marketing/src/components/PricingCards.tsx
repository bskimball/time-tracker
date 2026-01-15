import { IndustrialPanel, Button, Alert } from "@monorepo/design-system";
import { LiaCheckCircleSolid, LiaCrownSolid } from "react-icons/lia";

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
			ctaVariant: "primary" as const
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
			cta: "Start Free Trial",
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
		<section className="py-20 bg-muted/20 relative overflow-hidden">
			{/* Textured Background */}
			<div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-muted/30 to-secondary/8" />
			<div className="absolute inset-0 bg-grid-pattern opacity-20" />

			<div className="container mx-auto px-4 relative">
				{/* Corner Accents - System: XL size, Section spacing */}
				<div className="corner-section-tl corner-accent-xl corner-primary animate-fade-in" />
				<div className="corner-section-tr corner-accent-xl corner-secondary animate-fade-in" />
				<div className="corner-section-bl corner-accent-lg corner-primary animate-fade-in animate-delay-100" />
				<div className="corner-section-br corner-accent-lg corner-secondary animate-fade-in animate-delay-100" />

				{/* Technical Labels */}
				<div className="absolute top-2 left-[104px] font-mono text-[10px] text-primary/40 tracking-wider animate-fade-in animate-delay-200">
					[PRICING_PLANS]
				</div>
				<div className="absolute top-2 right-[104px] font-mono text-[10px] text-secondary/40 tracking-wider animate-fade-in animate-delay-200">
					3_TIERS
				</div>

				{/* Content with proper spacing */}
				<div className="pt-20 pb-16 px-8">
				<div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
					{plans.map((plan, index) => (
						<div key={index} className={`relative ${plan.popular ? 'transform scale-105' : ''}`}>
							{plan.popular && (
								<div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
									<div className="bg-primary text-primary-foreground px-4 py-2 rounded-sm text-sm font-heading font-medium flex items-center gap-2">
										<LiaCrownSolid />
										Most Popular
									</div>
								</div>
							)}

							<IndustrialPanel className={`p-8 h-full relative group ${plan.popular ? 'border-primary' : ''}`}>
								{/* Card corner accents - System: MD size, Card spacing */}
								<div className="corner-card-tl corner-accent-md corner-primary" />
								<div className="corner-card-tr corner-accent-md corner-secondary" />
								<div className="corner-card-bl corner-accent-sm corner-primary" />
								<div className="corner-card-br corner-accent-sm corner-secondary" />

								{/* Plan ID */}
								<div className="flex items-center justify-between mb-4">
									<span className="font-mono text-[9px] text-muted-foreground/30 tracking-wider">
										PLAN_{String(index + 1).padStart(2, '0')}
									</span>
									{plan.popular && (
										<div className="flex items-center gap-1">
											<div className="w-1 h-1 rounded-full bg-primary/60 animate-pulse-glow" />
											<span className="font-mono text-[8px] text-primary/50">FEATURED</span>
										</div>
									)}
								</div>

								<div className="text-center mb-8">
									<h3 className="text-2xl font-heading font-semibold mb-2">{plan.name}</h3>
									<div className="text-4xl font-display font-bold text-primary mb-2">
										{plan.price}
										{plan.period && <span className="text-lg font-normal">{plan.period}</span>}
									</div>
									<p className="text-muted-foreground">{plan.description}</p>
								</div>

								{/* Divider line */}
								<div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-6" />

								<ul className="space-y-4 mb-8">
									{plan.features.map((feature, i) => (
										<li key={i} className="flex items-center gap-3">
											<LiaCheckCircleSolid className="text-primary flex-shrink-0" />
											<span>{feature}</span>
										</li>
									))}
								</ul>

								<div className="mt-auto">
									<Button
										variant={plan.ctaVariant}
										className="w-full"
										size="lg"
									>
										{plan.cta}
									</Button>
								</div>
							</IndustrialPanel>
						</div>
					))}
				</div>

				<div className="mt-12 text-center">
					<Alert className="max-w-2xl mx-auto">
						<div className="flex items-center gap-3">
							<LiaCheckCircleSolid className="text-primary" />
							<div>
								<strong>All plans include:</strong> 14-day free trial • No credit card required • Enterprise security • 99.9% uptime SLA
							</div>
						</div>
					</Alert>
				</div>
				</div>
			</div>
		</section>
	);
}