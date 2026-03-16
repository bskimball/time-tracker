import { IndustrialPanel } from "@monorepo/design-system";
import { LiaUserTieSolid, LiaUserCogSolid, LiaUserAstronautSolid, LiaQuoteLeftSolid } from "react-icons/lia";

const testimonials = [
	{
		quote:
			"ShiftPulse transformed our warehouse operations. We saw a 40% increase in productivity and real-time visibility into workforce performance.",
		author: "Sarah Johnson",
		title: "Operations Director",
		company: "Amazon Fulfillment Center",
		avatar: LiaUserTieSolid,
		tag: "Fulfillment",
	},
	{
		quote:
			"Offline reliability mattered immediately. During our last outage, tracking kept moving and the sync recovery was invisible to operators.",
		author: "Michael Chen",
		title: "Plant Manager",
		company: "FedEx Logistics",
		avatar: LiaUserCogSolid,
		tag: "Manufacturing",
	},
	{
		quote:
			"Finally, a workforce system that speaks operations. The analytics make scheduling, staffing, and bottleneck review far more precise.",
		author: "David Rodriguez",
		title: "VP of Operations",
		company: "UPS Supply Chain",
		avatar: LiaUserAstronautSolid,
		tag: "Executive",
	},
];

export default function TestimonialsSection() {
	return (
		<section className="relative overflow-hidden bg-muted/15 py-20 border-y border-border/70">
			<div className="absolute inset-0 bg-noise opacity-20 pointer-events-none" />
			<div className="absolute inset-0 bg-tactical-grid opacity-[0.06] pointer-events-none" aria-hidden="true" />

			<div className="container mx-auto px-4 md:px-8 relative">
				<div className="mb-12 border-b border-border/60 pb-6 text-center">
					<div className="mb-4 inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-primary">
						<span className="inline-flex items-center rounded-[2px] border border-primary/20 bg-primary/10 px-2 py-1">03</span>
						Field Reports
					</div>
					<h2 className="font-display text-4xl font-black tracking-[-0.04em] text-foreground md:text-5xl">
						What Industry Leaders Say
					</h2>
					<p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-foreground/70">
						Operators choose ShiftPulse because it behaves like an industrial system should:
						clear, resilient, measurable, and easy to trust.
					</p>
				</div>

				<div className="grid gap-5 lg:grid-cols-3">
					{testimonials.map((testimonial, index) => (
						<div key={testimonial.author} className="flex h-full flex-col border-2 border-border/70 bg-card p-8 shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_0_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden group">
							<div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-bl-full -translate-y-8 translate-x-8 group-hover:scale-150 transition-transform duration-500"></div>
							
							<div className="mb-6 flex items-center justify-between gap-3 border-b-2 border-border/60 pb-5 relative z-10">
								<div className="flex items-center gap-4">
									<div className="flex h-12 w-12 items-center justify-center rounded-sm border-2 border-primary/30 bg-background text-primary shadow-inner">
										<testimonial.avatar className="h-6 w-6" aria-hidden="true" />
									</div>
									<div>
										<div className="font-mono text-[9px] uppercase tracking-[0.25em] text-muted-foreground bg-muted/50 inline-block px-1.5 py-0.5 mb-1">0{index + 1} // {testimonial.tag}</div>
										<div className="font-display text-xl font-bold text-foreground leading-none">{testimonial.company}</div>
									</div>
								</div>
								<div className="font-mono text-[10px] tracking-widest text-primary flex gap-0.5">
									<span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
								</div>
							</div>

							<div className="mb-8 flex items-start gap-4 text-foreground/80 relative z-10 flex-1">
								<LiaQuoteLeftSolid className="mt-1 h-6 w-6 shrink-0 text-primary/40" aria-hidden="true" />
								<p className="text-base leading-relaxed font-body italic">"{testimonial.quote}"</p>
							</div>

							<div className="mt-auto border-t-2 border-border/60 pt-5 flex items-center justify-between relative z-10">
								<div>
									<div className="font-display text-lg font-bold text-foreground">{testimonial.author}</div>
									<div className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
										{testimonial.title}
									</div>
								</div>
								<div className="w-8 h-8 rounded-full border border-border/80 flex items-center justify-center bg-muted/30">
									<span className="font-display font-bold text-[10px] text-foreground/50">{testimonial.author.charAt(0)}</span>
								</div>
							</div>
						</div>
					))}
				</div>

				<div className="mt-12 flex justify-center">
					<div className="inline-flex items-center gap-4 border-2 border-border/70 bg-card px-6 py-4 shadow-sm relative overflow-hidden">
						<div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
						<span className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary font-bold">Benchmark</span>
						<span className="h-5 w-px bg-border/80" />
						<span className="font-mono text-[11px] uppercase tracking-[0.2em] text-foreground/80">
							Average <span className="font-bold text-foreground">35% productivity increase</span> across implementations
						</span>
					</div>
				</div>
			</div>
		</section>
	);
}
