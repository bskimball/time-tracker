import { Button } from "@monorepo/design-system";

import {
	LiaClockSolid,
	LiaChartLineSolid,
	LiaCloudSolid,
	LiaShieldAltSolid
} from "react-icons/lia";

export default function HeroSection() {
	return (
		<>
			{/* Hero Header - Textured background */}
			<section className="relative overflow-hidden py-16 md:py-24 bg-noise group">
				{/* Gradient Background */}
				<div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5 pointer-events-none" />

				{/* Tactical Grid Pattern */}
				<div className="absolute inset-0 bg-tactical-grid opacity-20 pointer-events-none animate-grid-pan" aria-hidden="true" />

				{/* Decorative Elements */}
				<div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" aria-hidden="true" />

				<div className="container mx-auto px-6 md:px-8 relative">
					{/* Content with proper spacing */}
					<div className="pt-12 pb-16 px-6 md:px-8">
						<div className="flex items-start gap-6">
						<div className="hidden md:flex flex-col items-center gap-2 pt-1 animate-fade-in" aria-hidden="true">
							<div className="led-indicator active w-5 h-5 animate-blink" />
							<div className="w-px h-64 bg-gradient-to-b from-primary/30 to-transparent" />
						</div>

						<div className="flex-1">
							<div className="font-heading text-xs uppercase tracking-[0.2em] text-primary mb-3 animate-slide-in-left animate-delay-100 flex items-center gap-2">
								<span className="w-2 h-2 bg-primary/50 block animate-pulse" />
								PRECISION WORKFORCE ANALYTICS
							</div>
							<h1 className="font-display text-5xl md:text-7xl font-bold mb-6 tracking-tight text-foreground animate-shutter-v text-pretty origin-top">
								The Industrial Standard for Time Tracking
							</h1>

							<p className="text-xl text-muted-foreground max-w-2xl mt-4 leading-relaxed animate-slide-in-left animate-delay-400">
								Transform your fulfillment operations with precision time tracking,
								real-time telemetry, and data-driven workforce optimization.
								Built for the modern industrial scale.
							</p>

							<div className="flex flex-col sm:flex-row gap-4 mt-10 animate-slide-in-left animate-delay-500">
								<a href="/pricing">
									<Button size="lg" className="w-full sm:w-auto shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 relative overflow-hidden group/btn btn-mechanical">
										<span className="relative z-10">Deploy System</span>
									</Button>
								</a>
								<a href="/features">
									<Button variant="outline" size="lg" className="w-full sm:w-auto backdrop-blur-sm focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 hover:bg-card/80 transition-all group/btn btn-mechanical">
										<span className="group-hover/btn:text-primary transition-colors relative z-10">System Specs</span>
									</Button>
								</a>
							</div>
						</div>
					</div>
					</div>
				</div>
			</section>

			{/* Key Features Pills */}
			<section className="py-12 bg-background">
				<div className="container mx-auto px-4">
					<div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
						<div className="industrial-panel px-5 py-3 flex items-center gap-2 hover:border-primary transition-colors animate-fade-in-up animate-delay-100">
							<LiaClockSolid className="text-xl text-primary" />
							<span className="font-heading text-sm">Real-Time Tracking</span>
						</div>
						<div className="industrial-panel px-5 py-3 flex items-center gap-2 hover:border-primary transition-colors animate-fade-in-up animate-delay-200">
							<LiaChartLineSolid className="text-xl text-secondary" />
							<span className="font-heading text-sm">Advanced Analytics</span>
						</div>
						<div className="industrial-panel px-5 py-3 flex items-center gap-2 hover:border-primary transition-colors animate-fade-in-up animate-delay-300">
							<LiaCloudSolid className="text-xl text-primary" />
							<span className="font-heading text-sm">Multi-Deployment</span>
						</div>
						<div className="industrial-panel px-5 py-3 flex items-center gap-2 hover:border-primary transition-colors animate-fade-in-up animate-delay-400">
							<LiaShieldAltSolid className="text-xl text-secondary" />
							<span className="font-heading text-sm">OpenAPI Compliant</span>
						</div>
					</div>
				</div>
			</section>

			{/* Technical Specs Grid */}
			<section className="py-16 bg-muted/20 relative overflow-hidden">
				{/* Subtle grid overlay */}
				<div className="absolute inset-0 bg-tactical-grid opacity-10 pointer-events-none animate-grid-pan" aria-hidden="true" />
				<div className="absolute inset-0 bg-noise opacity-10 pointer-events-none" aria-hidden="true" />

				<div className="container mx-auto px-6 md:px-8 relative">
					{/* Content with proper spacing */}
					<div className="pt-12 px-6 md:px-8">
						<div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto stagger-children">
						<div className="industrial-panel p-6 text-center hover:shadow-lg transition-all relative group bg-noise overflow-hidden">
							<div className="absolute top-0 left-0 w-full h-1 bg-primary transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
							<div className="text-4xl font-display font-bold text-primary mb-2 tabular-nums">99.9%</div>
							<div className="text-xs text-muted-foreground font-heading uppercase tracking-widest">
								Uptime SLA
							</div>
						</div>
						<div className="industrial-panel p-6 text-center hover:shadow-lg transition-all relative group bg-noise overflow-hidden">
							<div className="absolute top-0 left-0 w-full h-1 bg-secondary transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
							<div className="text-4xl font-display font-bold text-primary mb-2 tabular-nums">&lt;50ms</div>
							<div className="text-xs text-muted-foreground font-heading uppercase tracking-widest">
								API Latency
							</div>
						</div>
						<div className="industrial-panel p-6 text-center hover:shadow-lg transition-all relative group bg-noise overflow-hidden">
							<div className="absolute top-0 left-0 w-full h-1 bg-primary transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
							<div className="text-4xl font-display font-bold text-primary mb-2 tabular-nums">500+</div>
							<div className="text-xs text-muted-foreground font-heading uppercase tracking-widest">
								Facilities
							</div>
						</div>
						<div className="industrial-panel p-6 text-center hover:shadow-lg transition-all relative group bg-noise overflow-hidden">
							<div className="absolute top-0 left-0 w-full h-1 bg-secondary transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
							<div className="text-4xl font-display font-bold text-primary mb-2 tabular-nums">24/7</div>
							<div className="text-xs text-muted-foreground font-heading uppercase tracking-widest">
								Tech Support
							</div>
						</div>
					</div>
					</div>
				</div>
			</section>

		</>
	);
}