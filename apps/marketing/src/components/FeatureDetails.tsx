import { IndustrialPanel, Card, CardBody, Tabs, TabList, Tab, TabPanel } from "@monorepo/design-system";
import {
	LiaChartBarSolid,
	LiaChartLineSolid,
	LiaShieldAltSolid,
	LiaBoltSolid,
	LiaToolsSolid,
	LiaSyncSolid,
	LiaServerSolid
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
		<section className="py-16 md:py-24 bg-muted/20 relative overflow-hidden border-b border-border/70">
			{/* Textured Background */}
			<div className="absolute inset-0 bg-noise opacity-[0.25] pointer-events-none mix-blend-overlay" />
			<div className="absolute inset-0 bg-tactical-grid opacity-[0.06] dark:opacity-[0.12] pointer-events-none animate-grid-pan" aria-hidden="true" />

			<div className="container mx-auto px-4 md:px-8 relative z-10">
				<Tabs className="w-full">
					<TabList className="grid w-full grid-cols-1 md:grid-cols-3 mb-16 gap-1 p-1 bg-border/60 border-2 border-border/80 shadow-inner">
						{coreFeatures.map((category, index) => {
							const IconComponent = category.icon;
							return (
								<Tab key={index} className="flex items-center gap-4 justify-center py-4 bg-card hover:bg-muted/50 data-[selected]:bg-primary/10 data-[selected]:text-primary transition-colors cursor-pointer group border border-transparent data-[selected]:border-primary/30 relative overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset">
									<div className="absolute inset-x-0 bottom-0 h-1 bg-primary scale-x-0 group-data-[selected]:scale-x-100 transition-transform origin-left" />
									<IconComponent className="text-2xl text-muted-foreground group-data-[selected]:text-primary transition-colors" />
									<span className="font-mono text-[11px] uppercase tracking-[0.2em] font-bold text-foreground/80 group-data-[selected]:text-primary">{category.category}</span>
								</Tab>
							);
						})}
					</TabList>

					{coreFeatures.map((category, categoryIndex) => (
						<TabPanel key={categoryIndex} className="space-y-8 outline-none">
							<div className="grid lg:grid-cols-3 gap-6 relative">
								<div className="absolute top-1/2 left-0 w-full h-px bg-border/40 pointer-events-none hidden lg:block" aria-hidden="true"></div>
								<div className="absolute top-0 left-1/3 w-px h-full bg-border/40 pointer-events-none hidden lg:block" aria-hidden="true"></div>
								<div className="absolute top-0 right-1/3 w-px h-full bg-border/40 pointer-events-none hidden lg:block" aria-hidden="true"></div>
								
								{category.features.map((feature, featureIndex) => (
									<IndustrialPanel 
										key={featureIndex} 
										className="flex flex-col border-2 border-border/70 bg-card p-6 shadow-sm hover:border-primary/60 hover:-translate-y-1 transition-all duration-300 relative z-10 group"
									>
										<div className="mb-6 flex-1">
											<div className="flex items-center justify-between mb-4 border-b-2 border-border/60 pb-3">
												<h3 className="text-lg font-display font-bold leading-tight text-foreground">{feature.title}</h3>
												<span className="font-mono text-[9px] uppercase tracking-[0.25em] text-muted-foreground bg-muted/50 inline-block px-1.5 py-0.5">MOD.{featureIndex + 1}</span>
											</div>
											<p className="text-sm text-foreground/80 leading-relaxed font-body">{feature.description}</p>
										</div>

										<div className="space-y-3 bg-muted/30 p-4 border border-border/50">
											<h4 className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary font-bold flex items-center gap-2 mb-3">
												<span className="w-1.5 h-1.5 bg-primary animate-pulse shadow-[0_0_5px_rgba(var(--color-primary),0.5)]" />
												Sub_Routines
											</h4>
											<ul className="space-y-2.5">
												{feature.benefits.map((benefit, benefitIndex) => (
													<li key={benefitIndex} className="flex items-start gap-3">
														<span className="mt-1 w-1.5 h-1.5 bg-primary/60 flex-shrink-0"></span>
														<span className="text-[11px] font-mono uppercase tracking-[0.1em] text-foreground/70">{benefit}</span>
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
				<div className="mt-24">
					<div className="mb-8 flex items-center gap-4 border-b-2 border-border/60 pb-4">
						<LiaServerSolid className="text-primary text-2xl" />
						<h2 className="text-2xl font-display font-bold text-foreground uppercase tracking-wider">Hardware Integration Specs</h2>
					</div>

					<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-1 p-1 bg-border/60 border-2 border-border/80 shadow-sm">
						<div className="bg-card p-6 flex flex-col items-center text-center group hover:bg-muted/10 transition-colors relative overflow-hidden">
							<div className="absolute top-0 left-0 w-full h-1 bg-primary/20 group-hover:bg-primary transition-colors"></div>
							<LiaBoltSolid className="text-3xl mb-4 text-primary opacity-80 group-hover:opacity-100 transition-opacity" />
							<h3 className="font-mono text-[11px] uppercase tracking-[0.2em] font-bold mb-2">Performance</h3>
							<p className="text-xs text-muted-foreground font-mono tracking-wider">Sub-second response, 99.9% uptime SLA</p>
						</div>

						<div className="bg-card p-6 flex flex-col items-center text-center group hover:bg-muted/10 transition-colors relative overflow-hidden">
							<div className="absolute top-0 left-0 w-full h-1 bg-primary/20 group-hover:bg-primary transition-colors"></div>
							<LiaToolsSolid className="text-3xl mb-4 text-primary opacity-80 group-hover:opacity-100 transition-opacity" />
							<h3 className="font-mono text-[11px] uppercase tracking-[0.2em] font-bold mb-2">Scalability</h3>
							<p className="text-xs text-muted-foreground font-mono tracking-wider">100K+ concurrent users, unbounded nodes</p>
						</div>

						<div className="bg-card p-6 flex flex-col items-center text-center group hover:bg-muted/10 transition-colors relative overflow-hidden">
							<div className="absolute top-0 left-0 w-full h-1 bg-primary/20 group-hover:bg-primary transition-colors"></div>
							<LiaShieldAltSolid className="text-3xl mb-4 text-primary opacity-80 group-hover:opacity-100 transition-opacity" />
							<h3 className="font-mono text-[11px] uppercase tracking-[0.2em] font-bold mb-2">Security</h3>
							<p className="text-xs text-muted-foreground font-mono tracking-wider">SOC 2 Type II, E2E encryption, Zero Trust</p>
						</div>

						<div className="bg-card p-6 flex flex-col items-center text-center group hover:bg-muted/10 transition-colors relative overflow-hidden">
							<div className="absolute top-0 left-0 w-full h-1 bg-primary/20 group-hover:bg-primary transition-colors"></div>
							<LiaSyncSolid className="text-3xl mb-4 text-primary opacity-80 group-hover:opacity-100 transition-opacity" />
							<h3 className="font-mono text-[11px] uppercase tracking-[0.2em] font-bold mb-2">Data I/O</h3>
							<p className="text-xs text-muted-foreground font-mono tracking-wider">REST API, Webhooks, ERP sync protocol</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
