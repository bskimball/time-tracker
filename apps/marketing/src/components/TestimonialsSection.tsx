import { Card, CardBody } from "@monorepo/design-system";
import { LiaUserTieSolid, LiaUserCogSolid, LiaUserAstronautSolid } from "react-icons/lia";

export default function TestimonialsSection() {
	const testimonials = [
		{
			quote: "ShiftPulse transformed our warehouse operations. We saw a 40% increase in productivity and real-time visibility into our workforce performance.",
			author: "Sarah Johnson",
			title: "Operations Director",
			company: "Amazon Fulfillment Center",
			avatar: LiaUserTieSolid
		},
		{
			quote: "The offline reliability was crucial during our recent network outage. No data loss, no downtime in tracking. This system pays for itself.",
			author: "Michael Chen",
			title: "Plant Manager",
			company: "FedEx Logistics",
			avatar: LiaUserCogSolid
		},
		{
			quote: "Finally, a time tracking solution built for industrial environments. The analytics help us optimize shift scheduling and resource allocation.",
			author: "David Rodriguez",
			title: "VP of Operations",
			company: "UPS Supply Chain",
			avatar: LiaUserAstronautSolid
		}
	];

	return (
		<section className="py-20 relative overflow-hidden">
			{/* Textured Background */}
			<div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-card to-secondary/5" />
			<div className="absolute inset-0 bg-grid-pattern-subtle opacity-30" />

			{/* Decorative Lines */}
			<div className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/15 to-transparent" />
			<div className="absolute bottom-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-secondary/15 to-transparent" />

			<div className="container mx-auto px-6 md:px-8 relative">
				<div className="text-center mb-16">
					<h2 className="text-4xl font-display font-bold text-foreground mb-4 animate-fade-in-up">
						What Industry Leaders Say
					</h2>
					<p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in-up animate-delay-100">
						See how ShiftPulse is helping fulfillment centers and manufacturing facilities
						achieve operational excellence.
					</p>
				</div>

				<div className="grid lg:grid-cols-3 gap-8">
					{testimonials.map((testimonial, index) => (
						<div
							key={index}
							className="animate-fade-in-up"
							style={{ animationDelay: `${index * 150 + 200}ms` }}
						>
							<Card className="hover:shadow-lg transition-all hover:-translate-y-1 relative group h-full">
								<CardBody>
									<div className="mb-6">
										<div className="flex text-primary mb-4 animate-scale-in" style={{ animationDelay: `${index * 150 + 400}ms` }}>
											{"★".repeat(5)}
										</div>
										<blockquote className="text-muted-foreground italic leading-relaxed">
											"{testimonial.quote}"
										</blockquote>
									</div>

									{/* Divider */}
									<div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-4" />

									<div className="flex items-center gap-4">
										<div className="text-3xl text-primary animate-scale-in" style={{ animationDelay: `${index * 150 + 500}ms` }}>
											<testimonial.avatar />
										</div>
										<div>
											<div className="font-heading font-semibold">{testimonial.author}</div>
											<div className="text-sm text-muted-foreground">{testimonial.title}</div>
											<div className="text-sm text-primary font-medium">{testimonial.company}</div>
										</div>
									</div>
								</CardBody>
							</Card>
						</div>
					))}
				</div>

				<div className="text-center mt-12 animate-fade-in-up animate-delay-500">
					<div className="inline-flex items-center gap-2 text-muted-foreground bg-card/80 backdrop-blur-sm px-6 py-3 rounded-sm border border-border">
						<span className="text-2xl">📈</span>
						<span className="font-heading">
							Average 35% productivity increase across all implementations
						</span>
					</div>
				</div>
			</div>
		</section>
	);
}
