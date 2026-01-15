import { Card, CardHeader, CardTitle, CardBody } from "@monorepo/design-system";

export default function PricingFAQ() {
	const faqs = [
		{
			question: "Can I change plans at any time?",
			answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any charges."
		},
		{
			question: "What happens after the free trial ends?",
			answer: "After your 14-day trial, you'll be automatically charged for the plan you selected. You can cancel anytime before the trial ends."
		},
		{
			question: "Do you offer discounts for annual billing?",
			answer: "Yes, we offer a 20% discount for annual billing on all plans. Contact our sales team for annual pricing."
		},
		{
			question: "Is there a setup fee?",
			answer: "No, there are no setup fees for any of our plans. Everything is included in your monthly subscription."
		},
		{
			question: "Can I cancel my subscription anytime?",
			answer: "Yes, you can cancel your subscription at any time. Your data will be retained for 30 days in case you decide to reactivate."
		},
		{
			question: "Do you offer on-premise deployment?",
			answer: "Yes, on-premise deployment is available for Enterprise customers who require data to remain within their own infrastructure."
		}
	];

	return (
		<section className="py-20 bg-card relative overflow-hidden">
			{/* Textured Background */}
			<div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-card to-secondary/5" />
			<div className="absolute inset-0 bg-grid-pattern-subtle opacity-30" />

			<div className="container mx-auto px-4 relative">
				{/* Corner Accents - System: LG size, Section spacing */}
				<div className="corner-section-tl corner-accent-lg corner-primary animate-fade-in" />
				<div className="corner-section-tr corner-accent-lg corner-secondary animate-fade-in" />
				<div className="corner-section-bl corner-accent-lg corner-primary animate-fade-in animate-delay-100" />
				<div className="corner-section-br corner-accent-lg corner-secondary animate-fade-in animate-delay-100" />

				{/* Technical Labels */}
				<div className="absolute top-2 left-[88px] font-mono text-[10px] text-primary/40 tracking-wider animate-fade-in animate-delay-200">
					[FAQ_MODULE]
				</div>
				<div className="absolute top-2 right-[88px] font-mono text-[10px] text-secondary/40 tracking-wider animate-fade-in animate-delay-200">
					6_QUESTIONS
				</div>

				{/* Content with proper spacing */}
				<div className="pt-20 pb-16 px-8">
					<div className="text-center mb-16">
					<h2 className="text-4xl font-display font-bold text-foreground mb-4">
						Frequently Asked Questions
					</h2>
					<p className="text-xl text-muted-foreground max-w-2xl mx-auto">
						Have questions about our pricing or features? We're here to help.
					</p>
				</div>

				<div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
					{faqs.map((faq, index) => (
						<Card key={index} className="hover:shadow-lg transition-all hover:-translate-y-1 relative group">
							{/* Card corner accents - System: MD size, Card spacing */}
							<div className="corner-card-tl corner-accent-md corner-primary" />
							<div className="corner-card-tr corner-accent-md corner-secondary" />
							<div className="corner-card-bl corner-accent-sm corner-primary" />
							<div className="corner-card-br corner-accent-sm corner-secondary" />

							<CardHeader>
								{/* FAQ ID */}
								<div className="flex items-center justify-between mb-2">
									<span className="font-mono text-[9px] text-muted-foreground/30 tracking-wider">
										FAQ_{String(index + 1).padStart(2, '0')}
									</span>
								</div>
								<CardTitle className="text-lg">{faq.question}</CardTitle>
							</CardHeader>
							<CardBody>
								<p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
							</CardBody>
						</Card>
					))}
				</div>

				<div className="text-center mt-12">
					<p className="text-muted-foreground mb-4">
						Still have questions? Our sales team is ready to help.
					</p>
					<a
						href="mailto:sales@industrialtime.com"
						className="text-primary hover:underline font-heading font-medium"
					>
						Contact Sales Team →
					</a>
				</div>
				</div>
			</div>
		</section>
	);
}