import { LiaIndustrySolid } from "react-icons/lia";

export default function AboutHero() {
	return (
		<section className="relative overflow-hidden border-b-2 border-border/80 bg-background pt-16 pb-16 md:pt-24 md:pb-24">
			{/* Industrial Background Textures */}
			<div className="absolute inset-0 bg-noise opacity-[0.25] pointer-events-none mix-blend-overlay" />
			<div className="absolute inset-0 bg-tactical-grid opacity-[0.06] dark:opacity-[0.12] pointer-events-none" aria-hidden="true" />
			<div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" aria-hidden="true" />

			<div className="container mx-auto px-4 md:px-8 relative z-10">
				{/* Top Command Bar */}
				<div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-border/60 pb-4">
					<div className="flex items-center gap-4 text-[10px] font-mono uppercase tracking-[0.25em] text-foreground/80">
						<span className="inline-flex items-center gap-2 rounded-sm border border-primary/30 bg-primary/10 px-2.5 py-1.5 text-primary shadow-inner">
							<span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(245,110,32,0.6)]" />
							ORG.04 // Entity Profile
						</span>
						<span className="hidden sm:inline-block text-muted-foreground">Corporate Telemetry</span>
					</div>
					<div className="flex items-center gap-4 text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
						<span className="flex items-center gap-2"><LiaIndustrySolid className="text-primary"/> Operations</span>
						<span className="h-3 w-[2px] bg-border/80" />
						<span>Status : Nominal</span>
					</div>
				</div>

				<div className="max-w-4xl">
					<h1 className="font-display text-5xl font-black tracking-[-0.05em] text-foreground md:text-[5.5rem] leading-[0.9] uppercase relative mb-8">
						<span className="block text-primary/80 text-xl md:text-2xl mb-2 font-mono tracking-[0.2em] uppercase font-bold">Origin Profile</span>
						Industrial Excellence
					</h1>

					<p className="max-w-2xl text-lg leading-relaxed text-foreground/70 md:text-xl font-body border-l-4 border-primary/40 pl-6 py-2 bg-gradient-to-r from-primary/5 to-transparent">
						Founded by industry veterans, ShiftPulse was built to solve the unique challenges
						of warehouse and manufacturing workforce management. We're committed to helping industrial
						operations achieve execution excellence through precision telemetry.
					</p>
				</div>
			</div>
		</section>
	);
}
