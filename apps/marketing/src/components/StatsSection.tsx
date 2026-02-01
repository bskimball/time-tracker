import { LiaIndustrySolid } from "react-icons/lia";
import { useEffect, useState, useRef } from "react";

function Counter({ value, className }: { value: string; className?: string }) {
	const [count, setCount] = useState(0);
	const [isVisible, setIsVisible] = useState(false);
	const elementRef = useRef<HTMLDivElement>(null);

	// Parse numeric value and suffix
	const numericValue = parseFloat(value.replace(/[^0-9.]/g, ""));
	const suffix = value.replace(/[0-9.]/g, "");
	const decimals = value.includes(".") ? value.split(".")[1].replace(/[^0-9]/g, "").length : 0;

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) {
					setIsVisible(true);
					observer.disconnect();
				}
			},
			{ threshold: 0.1 }
		);

		if (elementRef.current) {
			observer.observe(elementRef.current);
		}

		return () => observer.disconnect();
	}, []);

	useEffect(() => {
		if (!isVisible) return;

		const duration = 2000; // 2 seconds
		const steps = 20;
		const interval = duration / steps;
		let currentStep = 0;

		const timer = setInterval(() => {
			currentStep++;
			const progress = currentStep / steps;
			// Ease out quart
			const ease = 1 - Math.pow(1 - progress, 4);
			
			setCount(numericValue * ease);

			if (currentStep >= steps) {
				clearInterval(timer);
				setCount(numericValue);
			}
		}, interval);

		return () => clearInterval(timer);
	}, [isVisible, numericValue]);

	return (
		<div ref={elementRef} className={className}>
			{count.toFixed(decimals)}{suffix}
		</div>
	);
}

export default function StatsSection() {
	const stats = [
		{ number: "500+", label: "Active Facilities" },
		{ number: "50K+", label: "Employees Tracked" },
		{ number: "99.9%", label: "Uptime Reliability" },
		{ number: "35%", label: "Average Productivity Increase" }
	];

	return (
		<section className="py-20 relative overflow-hidden bg-noise">
			{/* Textured Background */}
			<div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-secondary/10 pointer-events-none" />
			<div className="absolute inset-0 bg-tactical-grid opacity-20 pointer-events-none animate-grid-pan" aria-hidden="true" />

			{/* Decorative Lines */}
			<div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-30" aria-hidden="true" />
			<div className="absolute bottom-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-secondary/20 to-transparent opacity-30" aria-hidden="true" />

			<div className="container mx-auto px-6 md:px-8 relative">
				<div className="text-center mb-16 px-4">
					<h2 className="text-4xl md:text-5xl font-display font-bold mb-4 text-foreground animate-fade-in-up text-pretty">
						Trusted by Industry Leaders
					</h2>
					<p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in-up animate-delay-200 text-pretty">
						Join hundreds of fulfillment centers and manufacturing facilities
						already optimizing their workforce with ShiftPulse.
					</p>
				</div>

				<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16 px-4">
					{stats.map((stat, index) => (
						<div
							key={index}
							className="text-center p-8 rounded-sm bg-card/40 backdrop-blur-sm border border-border/50 hover:border-primary transition-colors animate-fade-in-up relative group overflow-hidden"
							style={{ animationDelay: `${index * 100}ms` }}
						>
							{/* LED Status Indicator */}
							<div className="absolute top-4 right-4 flex items-center gap-1.5">
								<div className="technical-label">Live</div>
								<div className="led-indicator active w-2 h-2 animate-blink" />
							</div>

							{/* Scanner sweep effect on hover */}
							<div className="absolute inset-0 z-0 pointer-events-none opacity-0 group-hover:opacity-20 transition-opacity overflow-hidden">
								<div className="animate-scanner" />
							</div>

							<Counter 
								value={stat.number} 
								className="text-5xl font-display font-bold mb-3 text-primary tabular-nums"
							/>
							<div className="text-sm font-heading text-muted-foreground uppercase tracking-wider">{stat.label}</div>
						</div>
					))}
				</div>

				<div className="text-center animate-fade-in-up animate-delay-500 px-4">
					<div className="inline-flex items-center gap-4 bg-primary/10 text-foreground border border-primary/20 px-8 py-5 rounded-sm hover:bg-primary/20 transition-all shadow-sm group cursor-default">
						<LiaIndustrySolid className="text-4xl text-primary group-hover:animate-pulse" aria-hidden="true" />
						<span className="font-heading font-bold text-sm md:text-base uppercase tracking-tight">
							#1 Workforce Management Solution for Industrial Operations
						</span>
					</div>
				</div>
			</div>
		</section>

	);
}