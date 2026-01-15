import { IndustrialPanel, Button } from "@monorepo/design-system";

export default function CTASection() {
	return (
		<section className="py-20 relative overflow-hidden">
			{/* Textured Background */}
			<div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-secondary/8 to-primary/8" />
			<div className="absolute inset-0 bg-grid-pattern opacity-25" />

			{/* Animated Decorative Lines */}
			<div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
			<div className="absolute bottom-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-secondary/30 to-transparent" />

			<div className="container mx-auto px-4 relative">
				{/* Corner Accents - System: LG size, Section spacing */}
				<div className="corner-section-tl corner-accent-lg corner-primary" />
				<div className="corner-section-tr corner-accent-lg corner-secondary" />
				<div className="corner-section-bl corner-accent-lg corner-primary" />
				<div className="corner-section-br corner-accent-lg corner-secondary" />
				<IndustrialPanel variant="destructive" className="max-w-4xl mx-auto p-12 text-center animate-scale-in shadow-xl">
					<h2 className="text-4xl font-display font-bold text-foreground mb-6 animate-fade-in-up animate-delay-100">
						Ready to Transform Your Operations?
					</h2>
					<p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in-up animate-delay-200">
						Join industry leaders who have optimized their workforce management with ShiftPulse.
						Start your free trial today and see the difference precision time tracking makes.
					</p>

					<div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up animate-delay-300">
						<a href="/pricing">
							<Button size="lg" className="px-8 hover:scale-105 transition-transform">
								Start Free Trial - 14 Days
							</Button>
						</a>
						<a href="/features">
							<Button variant="outline" size="lg" className="px-8 hover:scale-105 transition-transform">
								Schedule Demo
							</Button>
						</a>
					</div>

					<div className="mt-8 pt-8 border-t border-border animate-fade-in-up animate-delay-400">
						<p className="text-sm text-muted-foreground">
							✓ No credit card required • ✓ Full feature access • ✓ Enterprise support included
						</p>
					</div>
				</IndustrialPanel>
			</div>
		</section>
	);
}