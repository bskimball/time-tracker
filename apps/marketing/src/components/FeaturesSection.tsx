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
		<section className="py-20 relative overflow-hidden">
			{/* Textured Background */}
			<div className="absolute inset-0 bg-gradient-to-br from-secondary/8 via-muted/30 to-primary/8" />
			<div className="absolute inset-0 bg-grid-pattern opacity-20" />

			{/* Decorative Elements */}
			<div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-border to-transparent opacity-50" />
			<div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-border to-transparent opacity-50" />

			<div className="container mx-auto px-4 relative">
				{/* Corner Accents - System: XL size, Section spacing */}
				<div className="corner-section-tl corner-accent-xl corner-secondary animate-fade-in" />
				<div className="corner-section-tr corner-accent-xl corner-primary animate-fade-in" />
				<div className="corner-section-bl corner-accent-lg corner-secondary animate-fade-in animate-delay-100" />
				<div className="corner-section-br corner-accent-lg corner-primary animate-fade-in animate-delay-100" />

				{/* Technical Labels */}
				<div className="absolute top-2 left-[104px] font-mono text-[10px] text-secondary/45 tracking-wider animate-fade-in animate-delay-200">
					[FEATURES_MODULE]
				</div>
				<div className="absolute top-2 right-[104px] font-mono text-[10px] text-primary/40 tracking-wider animate-fade-in animate-delay-200">
					6_COMPONENTS
				</div>
				{/* Section Header */}
				<div className="text-center mb-16">
					<h2 className="text-4xl font-display font-bold text-foreground mb-4 animate-fade-in-up">
						Enterprise-Grade Workforce Management
					</h2>
					<p className="text-xl text-muted-foreground max-w-3xl mx-auto animate-fade-in-up animate-delay-100">
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
							className="p-8 animate-fade-in-up relative group"
							style={{ animationDelay: `${index * 100 + 200}ms` }}
						>
							{/* Feature corner accents - System: MD size, Card spacing */}
							<div className="corner-card-tl corner-accent-md corner-primary" />
							<div className="corner-card-tr corner-accent-md corner-secondary" />
							<div className="corner-card-bl corner-accent-sm corner-primary" />
							<div className="corner-card-br corner-accent-sm corner-secondary" />

							{/* Feature ID */}
							<div className="flex items-center justify-between mb-4">
								<span className="font-mono text-[9px] text-muted-foreground/30 tracking-wider">
									FEAT_{String(index + 1).padStart(2, '0')}
								</span>
								<div className="flex items-center gap-1">
									<div className="w-1 h-1 rounded-full bg-primary/50" />
									<span className="font-mono text-[8px] text-primary/40">ACTIVE</span>
								</div>
							</div>

							<div className="text-center mb-6">
								<div className="text-5xl mb-4 text-primary flex justify-center animate-scale-in" style={{ animationDelay: `${index * 100 + 400}ms` }}>
									<feature.icon />
								</div>
								<h3 className="text-2xl font-heading font-semibold mb-3">{feature.title}</h3>
								<p className="text-muted-foreground leading-relaxed">{feature.description}</p>
							</div>

							{/* Divider line */}
							<div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-4" />

							<ul className="space-y-3">
								{feature.benefits.map((benefit, i) => (
									<li key={i} className="flex items-center gap-3">
										<span className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></span>
										<span className="text-sm text-foreground">{benefit}</span>
									</li>
								))}
							</ul>
						</IndustrialPanel>
					))}
				</div>

				{/* CTA */}
				<div className="text-center animate-fade-in-up animate-delay-500">
					<a href="/features">
						<Button size="lg" className="hover:scale-105 transition-transform">
							Explore All Features
						</Button>
					</a>
				</div>
			</div>
		</section>
	);
}