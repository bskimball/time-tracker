import { IndustrialPanel } from "@monorepo/design-system";
import {
	LiaBullseyeSolid,
	LiaEyeSolid,
	LiaShieldAltSolid,
	LiaUsersSolid,
	LiaChartLineSolid,
	LiaWrenchSolid
} from "react-icons/lia";

export default function AboutCompany() {
	const values = [
		{
			id: "VAL.01",
			icon: LiaShieldAltSolid,
			title: "Reliability First",
			description: "We build systems that work when you need them most, even in the harshest industrial environments."
		},
		{
			id: "VAL.02",
			icon: LiaUsersSolid,
			title: "Customer Focused",
			description: "Your operational success drives our product decisions. We listen, adapt, and deliver solutions that work."
		},
		{
			id: "VAL.03",
			icon: LiaChartLineSolid,
			title: "Data-Driven",
			description: "Every feature is designed to provide actionable insights that improve your operations."
		},
		{
			id: "VAL.04",
			icon: LiaWrenchSolid,
			title: "Built for Industry",
			description: "Purpose-built for warehouses and manufacturing, not adapted from generic software."
		}
	];

	return (
		<section className="py-24 bg-muted/20 relative overflow-hidden border-b-2 border-border/80">
			{/* Textured Background */}
			<div className="absolute inset-0 bg-noise opacity-[0.2] pointer-events-none mix-blend-overlay" />
			<div className="absolute inset-0 bg-tactical-grid opacity-[0.05] pointer-events-none" aria-hidden="true" />

			<div className="container mx-auto px-4 md:px-8 relative z-10">
				{/* Mission & Vision */}
				<div className="grid md:grid-cols-2 gap-8 mb-24 max-w-6xl mx-auto">
					<IndustrialPanel className="flex flex-col border-2 border-border/70 bg-card p-0 shadow-sm relative group overflow-hidden">
						<div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700"></div>
						
						<div className="p-8 border-b-2 border-border/60 bg-muted/30 relative z-10">
							<div className="flex items-center gap-4">
								<div className="flex h-12 w-12 items-center justify-center rounded-sm border-2 border-primary/30 bg-background text-primary shadow-inner">
									<LiaBullseyeSolid className="text-2xl" />
								</div>
								<div>
									<div className="font-mono text-[9px] uppercase tracking-[0.25em] text-muted-foreground bg-background border border-border/50 px-1.5 py-0.5 inline-block mb-1">DIR.01</div>
									<h2 className="text-2xl font-display font-bold uppercase tracking-wider text-foreground leading-none">Our Mission</h2>
								</div>
							</div>
						</div>

						<div className="p-8 relative z-10 flex-1">
							<p className="text-foreground/80 leading-relaxed font-body border-l-2 border-primary/30 pl-4">
								To empower industrial operations with precision time tracking and workforce analytics
								that drive measurable improvements in productivity, efficiency, and operational excellence.
								We believe every warehouse and manufacturing facility deserves enterprise-grade tools
								that are purpose-built for their unique challenges.
							</p>
						</div>
					</IndustrialPanel>

					<IndustrialPanel className="flex flex-col border-2 border-border/70 bg-card p-0 shadow-sm relative group overflow-hidden">
						<div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-bl-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700"></div>
						
						<div className="p-8 border-b-2 border-border/60 bg-muted/30 relative z-10">
							<div className="flex items-center gap-4">
								<div className="flex h-12 w-12 items-center justify-center rounded-sm border-2 border-secondary/30 bg-background text-secondary shadow-inner">
									<LiaEyeSolid className="text-2xl" />
								</div>
								<div>
									<div className="font-mono text-[9px] uppercase tracking-[0.25em] text-muted-foreground bg-background border border-border/50 px-1.5 py-0.5 inline-block mb-1">DIR.02</div>
									<h2 className="text-2xl font-display font-bold uppercase tracking-wider text-foreground leading-none">Our Vision</h2>
								</div>
							</div>
						</div>

						<div className="p-8 relative z-10 flex-1">
							<p className="text-foreground/80 leading-relaxed font-body border-l-2 border-secondary/30 pl-4">
								To become the global standard for industrial workforce management by providing
								reliable, intuitive, and powerful tools that transform how warehouses and manufacturing
								facilities operate. We envision a future where every industrial operation has the
								insights and capabilities to maximize their workforce potential.
							</p>
						</div>
					</IndustrialPanel>
				</div>

				{/* Our Values */}
				<div className="max-w-6xl mx-auto">
					<div className="mb-10 flex items-center justify-between gap-4 border-b-2 border-border/60 pb-4">
						<h2 className="text-2xl md:text-3xl font-display font-bold text-foreground uppercase tracking-wider">
							Core Values Output
						</h2>
						<div className="hidden sm:block font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
							Array Length: 4
						</div>
					</div>

					<div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-1 p-1 bg-border/60 border-2 border-border/80 shadow-sm">
						{values.map((value) => (
							<div key={value.id} className="bg-card p-8 flex flex-col relative group hover:bg-muted/20 transition-colors overflow-hidden">
								<div className="absolute top-0 left-0 w-full h-1 bg-primary/20 group-hover:bg-primary transition-colors"></div>
								<div className="absolute top-4 right-4 font-mono text-[9px] text-muted-foreground/50 group-hover:text-primary/50 transition-colors">
									{value.id}
								</div>
								
								<div className="mb-6 mt-2">
									<value.icon className="text-4xl text-primary opacity-80 group-hover:opacity-100 transition-opacity group-hover:scale-110 transform origin-left" />
								</div>
								
								<h3 className="text-lg font-display font-bold uppercase mb-3 text-foreground">{value.title}</h3>
								<p className="text-sm text-foreground/70 font-body leading-relaxed">{value.description}</p>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
