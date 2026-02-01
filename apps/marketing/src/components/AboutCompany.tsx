import { IndustrialPanel, Card, CardBody } from "@monorepo/design-system";
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
			icon: LiaShieldAltSolid,
			title: "Reliability First",
			description: "We build systems that work when you need them most, even in the harshest industrial environments."
		},
		{
			icon: LiaUsersSolid,
			title: "Customer Focused",
			description: "Your operational success drives our product decisions. We listen, adapt, and deliver solutions that work."
		},
		{
			icon: LiaChartLineSolid,
			title: "Data-Driven",
			description: "Every feature is designed to provide actionable insights that improve your operations."
		},
		{
			icon: LiaWrenchSolid,
			title: "Built for Industry",
			description: "Purpose-built for warehouses and manufacturing, not adapted from generic software."
		}
	];

	return (
		<section className="py-20 bg-muted/20 relative overflow-hidden">
			{/* Textured Background */}
			<div className="absolute inset-0 bg-gradient-to-br from-secondary/8 via-muted/30 to-primary/8" />
			<div className="absolute inset-0 bg-grid-pattern opacity-20" />

			<div className="container mx-auto px-6 md:px-8 relative">
				{/* Content with proper spacing */}
				<div className="pt-20 pb-16 px-8">

					{/* Mission & Vision */}
					<div className="grid md:grid-cols-2 gap-8 mb-20">
						<IndustrialPanel className="p-8 relative group">
							<div className="flex items-start gap-4 mb-4">
								<LiaBullseyeSolid className="text-4xl text-primary flex-shrink-0" />
								<div>
									<h2 className="text-2xl font-heading font-bold mb-2">Our Mission</h2>
								</div>
							</div>


							{/* Divider line */}
							<div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-6" />

							<p className="text-muted-foreground leading-relaxed">
								To empower industrial operations with precision time tracking and workforce analytics
								that drive measurable improvements in productivity, efficiency, and operational excellence.
								We believe every warehouse and manufacturing facility deserves enterprise-grade tools
								that are purpose-built for their unique challenges.
							</p>
						</IndustrialPanel>

						<IndustrialPanel className="p-8 relative group">
							<div className="flex items-start gap-4 mb-4">
								<LiaEyeSolid className="text-4xl text-secondary flex-shrink-0" />
								<div>
									<h2 className="text-2xl font-heading font-bold mb-2">Our Vision</h2>
								</div>
							</div>


							{/* Divider line */}
							<div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-6" />

							<p className="text-muted-foreground leading-relaxed">
								To become the global standard for industrial workforce management by providing
								reliable, intuitive, and powerful tools that transform how warehouses and manufacturing
								facilities operate. We envision a future where every industrial operation has the
								insights and capabilities to maximize their workforce potential.
							</p>
						</IndustrialPanel>
					</div>

					{/* Our Values */}
					<div className="text-center mb-12">
						<h2 className="text-3xl font-display font-bold text-foreground mb-4">
							Our Core Values
						</h2>
						<p className="text-xl text-muted-foreground max-w-2xl mx-auto">
							The principles that guide everything we build and every decision we make.
						</p>
					</div>

					<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
						{values.map((value, index) => (
							<Card key={index} className="hover:shadow-lg transition-all hover:-translate-y-1 relative group">
								<CardBody className="text-center p-6">
									<value.icon className="text-5xl text-primary mx-auto mb-4" />
									<h3 className="text-xl font-heading font-semibold mb-3">{value.title}</h3>

									<p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
								</CardBody>
							</Card>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
