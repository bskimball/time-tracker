import { LiaIndustrySolid } from "react-icons/lia";

export default function StatsSection() {
	const stats = [
		{ number: "500+", label: "Active Facilities" },
		{ number: "50K+", label: "Employees Tracked" },
		{ number: "99.9%", label: "Uptime Reliability" },
		{ number: "35%", label: "Average Productivity Increase" }
	];

	return (
		<section className="py-20 relative overflow-hidden">
			{/* Textured Background */}
			<div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-secondary/10" />
			<div className="absolute inset-0 bg-grid-pattern-subtle opacity-40" />

			{/* Decorative Lines */}
			<div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
			<div className="absolute bottom-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-secondary/20 to-transparent" />

			<div className="container mx-auto px-4 relative">
				{/* Corner Accents - System: XL size, Section spacing */}
				<div className="corner-section-tl corner-accent-xl corner-primary animate-fade-in" />
				<div className="corner-section-tr corner-accent-xl corner-secondary animate-fade-in" />
				<div className="corner-section-bl corner-accent-lg corner-primary animate-fade-in animate-delay-100" />
				<div className="corner-section-br corner-accent-lg corner-secondary animate-fade-in animate-delay-100" />

				{/* Technical Labels */}
				<div className="absolute top-2 left-[104px] font-mono text-[10px] text-primary/50 tracking-wider animate-fade-in animate-delay-200">
					[STATS_OVERVIEW]
				</div>
				<div className="absolute bottom-2 right-[104px] font-mono text-[10px] text-secondary/40 tracking-wider animate-fade-in animate-delay-200">
					DATA_VERIFIED
				</div>
				<div className="text-center mb-16">
					<h2 className="text-4xl font-display font-bold mb-4 text-foreground animate-fade-in-up">
						Trusted by Industry Leaders
					</h2>
					<p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in-up animate-delay-200">
						Join hundreds of fulfillment centers and manufacturing facilities
						already optimizing their workforce with ShiftPulse.
					</p>
				</div>

				<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
					{stats.map((stat, index) => (
						<div
							key={index}
							className="text-center p-6 rounded-sm bg-card/50 backdrop-blur-sm border border-border hover:border-primary transition-all hover:shadow-lg animate-fade-in-up relative group"
							style={{ animationDelay: `${index * 100}ms` }}
						>
							{/* Corner accents - System: MD size, Card spacing */}
							<div className="corner-card-tl corner-accent-md corner-primary" />
							<div className="corner-card-tr corner-accent-md corner-secondary" />
							<div className="corner-card-bl corner-accent-sm corner-primary" />
							<div className="corner-card-br corner-accent-sm corner-secondary" />

							{/* Stat ID */}
							<div className="font-mono text-[9px] text-muted-foreground/30 mb-2 tracking-wider">
								STAT_{String(index + 1).padStart(3, '0')}
							</div>

							<div className="text-5xl font-display font-bold mb-2 text-primary animate-bounce-in" style={{ animationDelay: `${index * 100 + 200}ms` }}>
								{stat.number}
							</div>
							<div className="text-base font-heading text-muted-foreground">{stat.label}</div>

							{/* Status indicator */}
							<div className="flex items-center justify-center gap-1.5 mt-3">
								<div className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-pulse-glow" />
								<span className="font-mono text-[9px] text-primary/50">LIVE</span>
							</div>
						</div>
					))}
				</div>

				<div className="text-center animate-fade-in-up animate-delay-500">
					<div className="inline-flex items-center gap-3 bg-primary/10 text-foreground border border-primary/20 px-8 py-4 rounded-sm hover:bg-primary/20 transition-all">
						<LiaIndustrySolid className="text-3xl text-primary" />
						<span className="font-heading font-medium">
							#1 Workforce Management Solution for Industrial Operations
						</span>
					</div>
				</div>
			</div>
		</section>
	);
}