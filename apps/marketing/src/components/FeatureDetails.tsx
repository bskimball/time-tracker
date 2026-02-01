import { IndustrialPanel, Card, CardBody, Tabs, TabList, Tab, TabPanel } from "@monorepo/design-system";
import {
	LiaChartBarSolid,
	LiaChartLineSolid,
	LiaShieldAltSolid,
	LiaBoltSolid,
	LiaToolsSolid,
	LiaSyncSolid
} from "react-icons/lia";

export default function FeatureDetails() {
	const coreFeatures = [
		{
			category: "Real-Time Monitoring",
			icon: LiaChartBarSolid,
			features: [
				{
					title: "Live Dashboard",
					description: "Monitor employee activities, task assignments, and station performance in real-time across all production areas.",
					benefits: ["Real-time updates", "Multi-station view", "Performance alerts", "Bottleneck detection"]
				},
				{
					title: "Automated Time Tracking",
					description: "Precise time tracking with automatic clock-in/out, break management, and overtime calculations.",
					benefits: ["GPS validation", "Biometric integration", "Shift scheduling", "Compliance reporting"]
				},
				{
					title: "Task Management",
					description: "Assign, track, and optimize task completion across your entire workforce with priority management.",
					benefits: ["Task assignment", "Progress tracking", "Priority queuing", "Resource allocation"]
				}
			]
		},
		{
			category: "Analytics & Reporting",
			icon: LiaChartLineSolid,
			features: [
				{
					title: "Executive Dashboards",
					description: "Customizable KPI dashboards designed for C-level decision making and operational oversight.",
					benefits: ["Custom metrics", "Trend analysis", "Executive reports", "Performance benchmarks"]
				},
				{
					title: "Productivity Analytics",
					description: "Deep insights into workforce productivity, efficiency metrics, and optimization opportunities.",
					benefits: ["Efficiency tracking", "Cost analysis", "ROI calculations", "Benchmarking tools"]
				},
				{
					title: "Compliance & Audit",
					description: "Complete audit trails, compliance reporting, and regulatory documentation for industrial standards.",
					benefits: ["Audit logs", "Compliance reports", "Data retention", "Regulatory compliance"]
				}
			]
		},
		{
			category: "Reliability & Integration",
			icon: LiaShieldAltSolid,
			features: [
				{
					title: "Offline Operation",
					description: "Continue full operations during network outages with automatic data synchronization when connectivity returns.",
					benefits: ["Offline tracking", "Data queuing", "Auto-sync", "Zero data loss"]
				},
				{
					title: "Enterprise Integration",
					description: "Seamless integration with existing ERP, HR, and warehouse management systems.",
					benefits: ["API connectivity", "ERP integration", "SSO support", "Custom webhooks"]
				},
				{
					title: "Security & Compliance",
					description: "Enterprise-grade security with end-to-end encryption, role-based access, and SOC 2 compliance.",
					benefits: ["End-to-end encryption", "Role-based access", "SOC 2 compliant", "GDPR ready"]
				}
			]
		}
	];

	return (
		<section className="py-16 bg-muted/20 relative overflow-hidden">
			{/* Textured Background */}
			<div className="absolute inset-0 bg-gradient-to-br from-secondary/8 via-muted/30 to-primary/8" />
			<div className="absolute inset-0 bg-grid-pattern opacity-20 animate-grid-pan" />

			<div className="container mx-auto px-6 md:px-8 relative">
				{/* Content with proper spacing */}
				<div className="pt-20 pb-16 px-8">

				<Tabs className="w-full">
					<TabList className="grid w-full grid-cols-3 mb-12">
						{coreFeatures.map((category, index) => {
							const IconComponent = category.icon;
							return (
								<Tab key={index} className="flex items-center gap-3 justify-center py-4 group transition-all duration-300 data-[selected]:bg-card data-[selected]:shadow-sm data-[selected]:border-primary/50 relative overflow-hidden">
									<div className="absolute inset-0 bg-primary/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
									<IconComponent className="text-2xl relative z-10" />
									<span className="font-heading font-semibold relative z-10">{category.category}</span>
								</Tab>
							);
						})}
					</TabList>

					{coreFeatures.map((category, categoryIndex) => (
						<TabPanel key={categoryIndex} className="space-y-8">
							<div className="grid lg:grid-cols-3 gap-8">
								{category.features.map((feature, featureIndex) => (
									<IndustrialPanel 
										key={featureIndex} 
										className="p-6 relative group hover-mechanical-card animate-fade-in-up"
										style={{ animationDelay: `${featureIndex * 100}ms` }}
									>
										<div className="mb-6">
											<h3 className="text-xl font-heading font-semibold mb-3">{feature.title}</h3>
											<p className="text-muted-foreground leading-relaxed">{feature.description}</p>
										</div>

										{/* Divider line */}
										<div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-4 group-hover:via-primary/50 transition-colors" />

										<div className="space-y-3">
											<h4 className="font-heading font-medium text-sm text-primary uppercase tracking-wide flex items-center gap-2">
												<span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
												Key Benefits
											</h4>
											<ul className="space-y-2">
												{feature.benefits.map((benefit, benefitIndex) => (
													<li key={benefitIndex} className="flex items-center gap-3">
														<span className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></span>
														<span className="text-sm">{benefit}</span>
													</li>
												))}
											</ul>
										</div>
									</IndustrialPanel>
								))}
							</div>
						</TabPanel>
					))}
				</Tabs>

				{/* Technical Specifications */}
				<div className="mt-20">
					<IndustrialPanel className="p-8 relative">
						<div className="text-center mb-8">
							<h2 className="text-3xl font-display font-bold mb-4">Technical Specifications</h2>
							<p className="text-muted-foreground max-w-2xl mx-auto">
								Built for industrial environments with enterprise-grade reliability and performance.
							</p>
						</div>

						<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
							<Card className="relative">
								<CardBody className="text-center p-6">
									<LiaBoltSolid className="text-3xl mb-3 mx-auto text-primary" />
									<h3 className="font-heading font-semibold mb-2">Performance</h3>
									<p className="text-sm text-muted-foreground">Sub-second response times, 99.9% uptime SLA</p>
								</CardBody>
							</Card>

							<Card className="relative">
								<CardBody className="text-center p-6">
									<LiaToolsSolid className="text-3xl mb-3 mx-auto text-primary" />
									<h3 className="font-heading font-semibold mb-2">Scalability</h3>
									<p className="text-sm text-muted-foreground">Supports 100K+ concurrent users, unlimited facilities</p>
								</CardBody>
							</Card>

							<Card className="relative">
								<CardBody className="text-center p-6">
									<LiaShieldAltSolid className="text-3xl mb-3 mx-auto text-primary" />
									<h3 className="font-heading font-semibold mb-2">Security</h3>
									<p className="text-sm text-muted-foreground">SOC 2 Type II, end-to-end encryption, GDPR compliant</p>
								</CardBody>
							</Card>

							<Card className="relative">
								<CardBody className="text-center p-6">
									<LiaSyncSolid className="text-3xl mb-3 mx-auto text-primary" />
									<h3 className="font-heading font-semibold mb-2">Integration</h3>
									<p className="text-sm text-muted-foreground">REST APIs, webhooks, SSO, ERP system integration</p>
								</CardBody>
							</Card>
						</div>
					</IndustrialPanel>
				</div>
				</div>
			</div>
		</section>
	);
}