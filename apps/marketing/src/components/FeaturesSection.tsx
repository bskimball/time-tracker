import { IndustrialPanel, Button } from "@monorepo/design-system";
import {
	LiaClockSolid,
	LiaChartBarSolid,
	LiaSyncAltSolid,
	LiaShieldAltSolid,
	LiaCloudSolid,
	LiaCogSolid
} from "react-icons/lia";

export default function FeaturesSection() {
	const features = [
		{
			icon: LiaClockSolid,
			title: "Real-Time Workforce Monitoring",
			description: "Track employee activities, task assignments, and productivity metrics in real-time across all production stations and fulfillment centers.",
			benefits: ["Live dashboard updates", "Automated time tracking", "Performance alerts"]
		},
		{
			icon: LiaChartBarSolid,
			title: "Advanced Analytics & KPIs",
			description: "Make data-driven decisions with comprehensive reporting, custom dashboards, and key performance indicators tailored for industrial operations.",
			benefits: ["Custom report builder", "KPI tracking", "Executive dashboards"]
		},
		{
			icon: LiaSyncAltSolid,
			title: "Offline Reliability",
			description: "Continue operations seamlessly during network outages with automatic data synchronization when connectivity returns, ensuring no productivity loss.",
			benefits: ["Offline data collection", "Automatic synchronization", "Data integrity guarantees"]
		},
		{
			icon: LiaShieldAltSolid,
			title: "Enterprise Security",
			description: "Bank-level encryption, SOC 2 compliance, and role-based access control ensure your workforce data remains secure and compliant.",
			benefits: ["AES-256 encryption", "SOC 2 certified", "Role-based access"]
		},
		{
			icon: LiaCloudSolid,
			title: "Flexible Deployment",
			description: "Deploy on-premises, in the cloud, or hybrid. Choose AWS, Azure, GCP, or your own infrastructure with full control over your data.",
			benefits: ["Multi-cloud support", "On-premise option", "Hybrid deployment"]
		},
		{
			icon: LiaCogSolid,
			title: "OpenAPI Compliant",
			description: "RESTful API with complete OpenAPI documentation. Integrate with your existing systems using webhooks, SDKs, and custom integrations.",
			benefits: ["200+ API endpoints", "Complete documentation", "SDKs & webhooks"]
		}
	];

	return (
		<section className="py-20 relative overflow-hidden bg-noise">
			{/* Textured Background */}
			<div className="absolute inset-0 bg-gradient-to-br from-secondary/8 via-muted/30 to-primary/8 pointer-events-none" />
			<div className="absolute inset-0 bg-tactical-grid opacity-10 pointer-events-none" aria-hidden="true" />

			{/* Decorative Elements */}
			<div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-border to-transparent opacity-50" aria-hidden="true" />
			<div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-border to-transparent opacity-50" aria-hidden="true" />

			<div className="container mx-auto px-6 md:px-8 relative">
				{/* Section Header */}
				<div className="text-center mb-16 px-4">
					<h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4 animate-fade-in-up text-pretty">
						Enterprise-Grade Workforce Management
					</h2>
					<p className="text-xl text-muted-foreground max-w-3xl mx-auto animate-fade-in-up animate-delay-100 text-pretty">
						Built specifically for fulfillment warehouses, manufacturing facilities, and industrial operations
						where precision, reliability, and scalability matter most.
					</p>
				</div>

				{/* Features Grid */}
				<div className="grid lg:grid-cols-3 gap-8 mb-16">
					{features.map((feature, index) => (
						<IndustrialPanel
							key={index}
							variant="default"
							className="p-8 animate-fade-in-up relative group bg-noise hover:border-primary/50 transition-colors"
							style={{ animationDelay: `${index * 100 + 200}ms` }}
						>
							<div className="text-center mb-8">
								<div className="text-6xl mb-6 text-primary flex justify-center animate-scale-in group-hover:scale-110 transition-transform" style={{ animationDelay: `${index * 100 + 400}ms` }} aria-hidden="true">
									<feature.icon />
								</div>
								<h3 className="text-2xl font-heading font-bold mb-4 tracking-tight">{feature.title}</h3>
								<p className="text-muted-foreground leading-relaxed text-sm">{feature.description}</p>
							</div>

							{/* Divider line */}
							<div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-6" aria-hidden="true" />

							<ul className="space-y-4">
								{feature.benefits.map((benefit, i) => (
									<li key={i} className="flex items-center gap-3 group/item">
										<span className="w-1.5 h-1.5 bg-primary/40 group-hover/item:bg-primary rounded-full flex-shrink-0 transition-colors"></span>
										<span className="text-sm text-foreground/80 group-hover/item:text-foreground transition-colors">{benefit}</span>
									</li>
								))}
							</ul>
						</IndustrialPanel>
					))}
				</div>

				{/* CTA */}
				<div className="text-center animate-fade-in-up animate-delay-500">
					<a href="/features">
						<Button size="lg" className="hover:scale-105 transition-transform shadow-lg shadow-primary/10">
							Explore All Features
						</Button>
					</a>
				</div>
			</div>
		</section>

	);
}