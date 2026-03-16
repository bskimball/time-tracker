import { LiaQuestionCircleSolid, LiaTerminalSolid } from "react-icons/lia";

export default function PricingFAQ() {
	const faqs = [
		{
			id: "Q.01",
			question: "Can I change plans at any time?",
			answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any charges on your next billing cycle."
		},
		{
			id: "Q.02",
			question: "What happens after the free trial ends?",
			answer: "After your 14-day trial, your instance will pause until you select a tier. We do not automatically charge you, and your telemetry data is preserved for 30 days."
		},
		{
			id: "Q.03",
			question: "Do you offer discounts for annual billing?",
			answer: "Yes, we offer a 20% discount for annual billing on all plans. Contact our sales team to configure annual pricing terms."
		},
		{
			id: "Q.04",
			question: "Is there a setup fee?",
			answer: "No, there are no deployment or setup fees for any of our standard plans. Everything is included in your monthly subscription parameter."
		},
		{
			id: "Q.05",
			question: "Can I cancel my subscription anytime?",
			answer: "Yes, you can terminate your subscription at any time. Your telemetry data will be retained in cold storage for 30 days in case of reactivation."
		},
		{
			id: "Q.06",
			question: "Do you offer on-premise deployment?",
			answer: "Yes, on-premise, air-gapped deployment is available for Enterprise clients who require strict data isolation within their own infrastructure."
		}
	];

	return (
		<section className="py-24 bg-card relative overflow-hidden border-b-2 border-border/80">
			{/* Textured Background */}
			<div className="absolute inset-0 bg-noise opacity-[0.2] pointer-events-none mix-blend-overlay" />
			<div className="absolute inset-0 bg-tactical-grid opacity-[0.04] dark:opacity-[0.08] pointer-events-none" aria-hidden="true" />

			<div className="container mx-auto px-4 md:px-8 relative z-10">
				<div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 border-b-2 border-border/60 pb-6">
					<div>
						<div className="mb-4 inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.25em] text-primary">
							<span className="inline-flex items-center rounded-sm border border-primary/30 bg-primary/10 px-2 py-1 shadow-inner">
								<LiaQuestionCircleSolid className="mr-2 text-lg" />
								DOC.03
							</span>
							Knowledge Base
						</div>
						<h2 className="font-display text-4xl font-black tracking-[-0.04em] text-foreground md:text-5xl uppercase">
							Frequently Asked Questions
						</h2>
					</div>
					<div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground bg-muted/40 px-3 py-2 border border-border/60">
						Query Database // 6 Entries
					</div>
				</div>

				<div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
					{faqs.map((faq) => (
						<div key={faq.id} className="group relative border-2 border-border/70 bg-background p-8 hover:border-primary/40 transition-colors shadow-sm">
							<div className="absolute top-0 right-0 bg-muted/50 font-mono text-[9px] text-muted-foreground px-2 py-1 border-b border-l border-border/60 group-hover:text-primary transition-colors">
								{faq.id}
							</div>
							
							<div className="mb-4 flex items-start gap-3">
								<LiaTerminalSolid className="text-primary text-xl mt-1 opacity-70 group-hover:opacity-100 transition-opacity" />
								<h3 className="font-display text-xl font-bold leading-tight text-foreground">{faq.question}</h3>
							</div>

							<div className="pl-8 border-l-2 border-border/40 ml-2 group-hover:border-primary/30 transition-colors">
								<p className="text-sm text-foreground/70 font-body leading-relaxed">{faq.answer}</p>
							</div>
						</div>
					))}
				</div>

				<div className="text-center mt-16">
					<div className="inline-flex items-center gap-4 bg-primary/5 border border-primary/20 px-6 py-4">
						<span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Unresolved query?</span>
						<span className="h-4 w-px bg-primary/30"></span>
						<a
							href="mailto:sales@industrialtime.com"
							className="font-mono text-[11px] font-bold uppercase tracking-[0.15em] text-primary hover:text-primary-hover transition-colors flex items-center gap-2 group"
						>
							Initialize Contact Sequence <span className="group-hover:translate-x-1 transition-transform">→</span>
						</a>
					</div>
				</div>
			</div>
		</section>
	);
}
