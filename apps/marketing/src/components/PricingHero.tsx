import { Button } from "@monorepo/design-system";

export default function PricingHero() {
	return (
		<section className="relative overflow-hidden py-16 md:py-24">
			{/* Gradient Background */}
			<div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />

			{/* Grid Pattern */}
			<div className="absolute inset-0 bg-grid-pattern opacity-30" />

			{/* Decorative Elements */}
			<div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

			<div className="container mx-auto px-4 relative">
				{/* Corner Accents - System: XL size, Section spacing */}
				<div className="corner-section-tl corner-accent-xl corner-primary animate-fade-in" />
				<div className="corner-section-tr corner-accent-xl corner-secondary animate-fade-in" />
				<div className="corner-section-bl corner-accent-lg corner-primary animate-fade-in animate-delay-200" />
				<div className="corner-section-br corner-accent-lg corner-secondary animate-fade-in animate-delay-200" />

				{/* Technical Labels */}
				<div className="absolute top-2 left-[104px] font-mono text-[10px] text-primary/40 tracking-wider animate-fade-in animate-delay-300">
					[PRICING_PAGE]
				</div>
				<div className="absolute top-2 right-[104px] font-mono text-[10px] text-secondary/40 tracking-wider animate-fade-in animate-delay-300">
					NO_HIDDEN_FEES
				</div>

				{/* Content with proper spacing */}
				<div className="pt-20 pb-16 px-8">
					<div className="flex items-start gap-6">
						<div className="flex flex-col items-center gap-2 pt-1 animate-fade-in">
							<div className="led-indicator active w-5 h-5" />
							<div className="w-px h-full bg-primary/30" />
						</div>

						<div className="flex-1 text-center md:text-left">
							<div className="font-heading text-xs uppercase tracking-widest text-muted-foreground mb-3 animate-slide-in-left animate-delay-100">
								PRICING
							</div>
							<h1 className="font-display text-5xl md:text-6xl font-bold mb-4 tracking-tight text-foreground animate-slide-in-left animate-delay-200">
								Simple, Transparent Pricing
							</h1>
							<div className="font-data text-sm bg-primary/10 text-primary px-4 py-2 rounded-sm border border-primary/20 inline-block mb-4 animate-slide-in-left animate-delay-300">
								No Hidden Fees
							</div>

							<p className="text-lg text-muted-foreground max-w-3xl mt-4 leading-relaxed animate-slide-in-left animate-delay-400">
								Choose the plan that fits your industrial workforce management needs.
								All plans include our core features with enterprise-grade security and reliability.
							</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}