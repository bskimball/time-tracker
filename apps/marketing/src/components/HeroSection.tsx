import { IndustrialHeader, Button } from "@monorepo/design-system";
import {
	LiaClockSolid,
	LiaChartLineSolid,
	LiaCloudSolid,
	LiaShieldAltSolid,
	LiaIndustrySolid
} from "react-icons/lia";

export default function HeroSection() {
	return (
		<>
			{/* Hero Header - Textured background */}
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
						[HERO_SECTION]
					</div>
					<div className="absolute top-2 right-[104px] font-mono text-[10px] text-secondary/40 tracking-wider animate-fade-in animate-delay-300">
						SYS_ONLINE
					</div>

					{/* Content with proper spacing from corner accents */}
					<div className="pt-20 pb-16 px-8">
						<div className="flex items-start gap-6">
						<div className="flex flex-col items-center gap-2 pt-1 animate-fade-in">
							<div className="led-indicator active w-5 h-5" />
							<div className="w-px h-full bg-primary/30" />
						</div>

						<div className="flex-1">
							<div className="font-heading text-xs uppercase tracking-widest text-muted-foreground mb-3 animate-slide-in-left animate-delay-100">
								TIME TRACKING & ANALYTICS
							</div>
							<h1 className="font-display text-5xl md:text-6xl font-bold mb-4 tracking-tight text-foreground animate-slide-in-left animate-delay-200">
								ShiftPulse Workforce Management
							</h1>
							<div className="font-data text-sm bg-primary/10 text-primary px-4 py-2 rounded-sm border border-primary/20 inline-block mb-4 animate-slide-in-left animate-delay-300">
								Enterprise Solution
							</div>

							<p className="text-lg text-muted-foreground max-w-3xl mt-4 leading-relaxed animate-slide-in-left animate-delay-400">
								Transform your fulfillment operations with precision time tracking,
								real-time analytics, and data-driven workforce optimization.
								Built for warehouses and manufacturing facilities.
							</p>

							<div className="flex flex-col sm:flex-row gap-4 mt-8 animate-slide-in-left animate-delay-500">
								<a href="/pricing">
									<Button size="lg">
										Start Free Trial
									</Button>
								</a>
								<a href="/features">
									<Button variant="outline" size="lg">
										Explore Features
									</Button>
								</a>
							</div>
						</div>
					</div>
					</div>
				</div>
			</section>

			{/* Trust Indicators */}
			<section className="py-12 bg-muted/30">
				<div className="container mx-auto px-4">
					<div className="text-center mb-8">
						<p className="text-sm text-muted-foreground font-heading uppercase tracking-wider">
							Trusted by Leading Fulfillment & Manufacturing Companies
						</p>
					</div>
					<div className="flex justify-center items-center gap-8 flex-wrap opacity-60">
						<div className="flex items-center gap-2">
							<LiaIndustrySolid className="text-2xl text-muted-foreground" />
							<span className="text-lg font-heading text-muted-foreground">Amazon</span>
						</div>
						<div className="flex items-center gap-2">
							<LiaIndustrySolid className="text-2xl text-muted-foreground" />
							<span className="text-lg font-heading text-muted-foreground">FedEx</span>
						</div>
						<div className="flex items-center gap-2">
							<LiaIndustrySolid className="text-2xl text-muted-foreground" />
							<span className="text-lg font-heading text-muted-foreground">UPS</span>
						</div>
						<div className="flex items-center gap-2">
							<LiaIndustrySolid className="text-2xl text-muted-foreground" />
							<span className="text-lg font-heading text-muted-foreground">DHL</span>
						</div>
					</div>
				</div>
			</section>

			{/* Key Features Pills */}
			<section className="py-12 bg-background">
				<div className="container mx-auto px-4">
					<div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
						<div className="industrial-panel px-5 py-3 flex items-center gap-2 hover:border-primary transition-colors">
							<LiaClockSolid className="text-xl text-primary" />
							<span className="font-heading text-sm">Real-Time Tracking</span>
						</div>
						<div className="industrial-panel px-5 py-3 flex items-center gap-2 hover:border-primary transition-colors">
							<LiaChartLineSolid className="text-xl text-secondary" />
							<span className="font-heading text-sm">Advanced Analytics</span>
						</div>
						<div className="industrial-panel px-5 py-3 flex items-center gap-2 hover:border-primary transition-colors">
							<LiaCloudSolid className="text-xl text-primary" />
							<span className="font-heading text-sm">Multi-Deployment</span>
						</div>
						<div className="industrial-panel px-5 py-3 flex items-center gap-2 hover:border-primary transition-colors">
							<LiaShieldAltSolid className="text-xl text-secondary" />
							<span className="font-heading text-sm">OpenAPI Compliant</span>
						</div>
					</div>
				</div>
			</section>

			{/* Technical Specs Grid */}
			<section className="py-16 bg-muted/20 relative overflow-hidden">
				{/* Subtle grid overlay */}
				<div className="absolute inset-0 bg-grid-pattern-subtle opacity-20" />

				<div className="container mx-auto px-4 relative">
					{/* Corner accents for specs section - System: LG size, Section spacing */}
					<div className="corner-section-tl corner-accent-lg corner-primary" />
					<div className="corner-section-tr corner-accent-lg corner-secondary" />

					{/* Technical label */}
					<div className="absolute top-2 left-[88px] font-mono text-[10px] text-primary/30 tracking-wider">
						[METRICS_DASHBOARD]
					</div>

					{/* Content with proper spacing from corner accents */}
					<div className="pt-16 px-8">
						<div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto stagger-children">
						<div className="industrial-panel p-6 text-center hover:shadow-lg transition-all relative group">
							<div className="corner-card-tl corner-accent-sm corner-primary" />
							<div className="corner-card-tr corner-accent-sm corner-secondary" />
							<div className="text-4xl font-display font-bold text-primary mb-2">99.9%</div>
							<div className="text-sm text-muted-foreground font-heading uppercase tracking-wider">
								Uptime SLA
							</div>
							<div className="font-mono text-[9px] text-muted-foreground/40 mt-2">SLA_001</div>
						</div>
						<div className="industrial-panel p-6 text-center hover:shadow-lg transition-all relative group">
							<div className="corner-card-tl corner-accent-sm corner-secondary" />
							<div className="corner-card-tr corner-accent-sm corner-primary" />
							<div className="text-4xl font-display font-bold text-primary mb-2">&lt;50ms</div>
							<div className="text-sm text-muted-foreground font-heading uppercase tracking-wider">
								API Response
							</div>
							<div className="font-mono text-[9px] text-muted-foreground/40 mt-2">PERF_002</div>
						</div>
						<div className="industrial-panel p-6 text-center hover:shadow-lg transition-all relative group">
							<div className="corner-card-tl corner-accent-sm corner-primary" />
							<div className="corner-card-tr corner-accent-sm corner-secondary" />
							<div className="text-4xl font-display font-bold text-primary mb-2">500+</div>
							<div className="text-sm text-muted-foreground font-heading uppercase tracking-wider">
								Facilities
							</div>
							<div className="font-mono text-[9px] text-muted-foreground/40 mt-2">SCALE_003</div>
						</div>
						<div className="industrial-panel p-6 text-center hover:shadow-lg transition-all relative group">
							<div className="corner-card-tl corner-accent-sm corner-secondary" />
							<div className="corner-card-tr corner-accent-sm corner-primary" />
							<div className="text-4xl font-display font-bold text-primary mb-2">24/7</div>
							<div className="text-sm text-muted-foreground font-heading uppercase tracking-wider">
								Support
							</div>
							<div className="font-mono text-[9px] text-muted-foreground/40 mt-2">SUP_004</div>
						</div>
					</div>
					</div>
				</div>
			</section>
		</>
	);
}