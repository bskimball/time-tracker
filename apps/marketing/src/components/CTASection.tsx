import { IndustrialPanel, Button } from "@monorepo/design-system";

export default function CTASection() {
	return (
		<section className="py-20 relative overflow-hidden bg-noise">
			{/* Textured Background */}
			<div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-secondary/8 to-primary/8 pointer-events-none" />
			<div className="absolute inset-0 bg-tactical-grid opacity-20 pointer-events-none" aria-hidden="true" />

			{/* Animated Decorative Lines */}
			<div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-30" aria-hidden="true" />
			<div className="absolute bottom-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-secondary/30 to-transparent opacity-30" aria-hidden="true" />

			<div className="container mx-auto px-6 md:px-8 relative">
				<IndustrialPanel variant="default" className="max-w-4xl mx-auto p-12 text-center animate-scale-in shadow-2xl bg-noise border-primary/30 relative overflow-hidden group">
					{/* Scanner effect on hover */}
					<div className="absolute inset-0 z-0 pointer-events-none opacity-0 group-hover:opacity-10 transition-opacity">
						<div className="animate-scanner" />
					</div>

					<h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-6 animate-fade-in-up animate-delay-100 text-pretty relative z-10">
						Ready to Transform Your Operations?
					</h2>
					<p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-fade-in-up animate-delay-200 text-pretty relative z-10">
						Join industry leaders who have optimized their workforce management with ShiftPulse.
						Start your free trial today and see the difference precision time tracking makes.
					</p>

					<div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up animate-delay-300 relative z-10">
						<a href="/pricing">
							<Button size="lg" className="px-10 hover:scale-105 transition-all shadow-lg shadow-primary/20 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
								Start Free Trial
							</Button>
						</a>
						<a href="/features">
							<Button variant="outline" size="lg" className="px-10 hover:scale-105 transition-all focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
								Schedule Demo
							</Button>
						</a>
					</div>
				</IndustrialPanel>
			</div>
		</section>

	);
}