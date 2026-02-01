export default function PricingHero() {
	return (
		<section className="relative overflow-hidden py-16 md:py-24 bg-noise">
			{/* Gradient Background */}
			<div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5 pointer-events-none" />

			{/* Tactical Grid Pattern */}
			<div className="absolute inset-0 bg-tactical-grid opacity-20 pointer-events-none animate-grid-pan" aria-hidden="true" />

			{/* Decorative Elements */}
			<div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" aria-hidden="true" />

			<div className="container mx-auto px-6 md:px-8 relative">
				{/* Content with proper spacing */}
				<div className="pt-20 pb-16 px-6 md:px-8">
					<div className="flex items-start gap-6">
						<div className="hidden md:flex flex-col items-center gap-2 pt-1 animate-fade-in" aria-hidden="true">
							<div className="led-indicator active w-5 h-5 animate-blink" />
							<div className="w-px h-64 bg-gradient-to-b from-primary/30 to-transparent" />
						</div>

						<div className="flex-1 text-center md:text-left">
							<div className="font-heading text-xs uppercase tracking-[0.2em] text-primary mb-3 animate-slide-in-left animate-delay-100">
								PRICING
							</div>
							<h1 className="font-display text-5xl md:text-7xl font-bold mb-4 tracking-tight text-foreground animate-shutter-v origin-top text-pretty">
								Transparent Tiers
							</h1>

							<p className="text-xl text-muted-foreground max-w-3xl mt-4 leading-relaxed animate-slide-in-left animate-delay-400 text-pretty">
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
