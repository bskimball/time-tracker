import { LiaIndustrySolid, LiaBroadcastTowerSolid } from "react-icons/lia";
import { useEffect, useRef, useState } from "react";

function Counter({ value, className }: { value: string; className?: string }) {
	const [count, setCount] = useState(0);
	const [isVisible, setIsVisible] = useState(false);
	const elementRef = useRef<HTMLDivElement>(null);

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
			{ threshold: 0.1 },
		);

		if (elementRef.current) observer.observe(elementRef.current);
		return () => observer.disconnect();
	}, []);

	useEffect(() => {
		if (!isVisible) return;

		const duration = 1800;
		const steps = 24;
		const interval = duration / steps;
		let currentStep = 0;

		const timer = setInterval(() => {
			currentStep++;
			const progress = currentStep / steps;
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
			{count.toFixed(decimals)}
			{suffix}
		</div>
	);
}

const stats = [
	{ number: "500+", label: "Active Facilities", note: "North America + EU" },
	{ number: "50K+", label: "Employees Tracked", note: "Multi-shift operations" },
	{ number: "99.9%", label: "Uptime Reliability", note: "Across monitored fleets" },
	{ number: "35%", label: "Avg Productivity Lift", note: "Post-deployment median" },
];

export default function StatsSection() {
	return (
		<section className="relative overflow-hidden border-y border-border/70 bg-background py-20">
			<div className="absolute inset-0 bg-noise opacity-20 pointer-events-none" />
			<div className="absolute inset-0 bg-tactical-grid opacity-[0.06] pointer-events-none" aria-hidden="true" />

			<div className="container mx-auto px-4 md:px-8 relative">
				<div className="mb-10 flex flex-col gap-5 border-b border-border/60 pb-6 md:flex-row md:items-end md:justify-between">
					<div>
						<div className="mb-4 inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-primary">
							<span className="inline-flex items-center rounded-[2px] border border-primary/20 bg-primary/10 px-2 py-1">02</span>
							Network Reach
						</div>
						<h2 className="font-display text-4xl font-black tracking-[-0.04em] text-foreground md:text-5xl">
							Trusted by Industry Leaders
						</h2>
						<p className="mt-4 max-w-2xl text-lg leading-8 text-foreground/70">
							ShiftPulse is built for organizations that care about measurable labor visibility,
							clean telemetry, and reliable execution at industrial scale.
						</p>
					</div>

					<div className="inline-flex items-center gap-3 self-start rounded-[2px] border border-border/70 bg-card px-4 py-3 shadow-industrial">
						<LiaBroadcastTowerSolid className="h-5 w-5 text-primary" aria-hidden="true" />
						<span className="font-mono text-[11px] uppercase tracking-[0.18em] text-foreground/72">
							Live operational telemetry
						</span>
					</div>
				</div>

				<div className="grid gap-px bg-border/60 border-2 border-border/60 p-px lg:grid-cols-4 shadow-sm">
					{stats.map((stat, index) => (
						<div
							key={stat.label}
							className="relative overflow-hidden bg-card px-6 py-8 hover:bg-muted/10 transition-colors group"
						>
							<div className="absolute inset-x-0 top-0 h-[2px] bg-primary/20 group-hover:bg-primary transition-colors" />
							<div className="mb-6 flex items-center justify-between gap-3">
								<span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground bg-muted px-1.5 py-0.5">0{index + 1}</span>
								<div className="inline-flex items-center gap-2 rounded-sm border border-primary/20 bg-primary/10 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-primary shadow-inner">
									<span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
									Live
								</div>
							</div>
							<Counter value={stat.number} className="text-5xl md:text-6xl font-display font-black tracking-[-0.05em] text-foreground group-hover:text-primary transition-colors" />
							<div className="mt-4 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground/80 font-bold border-t border-border/50 pt-3">{stat.label}</div>
							<div className="mt-2 text-xs font-mono tracking-wider text-muted-foreground">{stat.note}</div>
						</div>
					))}
				</div>

				<div className="mt-12 border-2 border-primary/30 bg-primary/5 px-6 py-6 shadow-[0_4px_20px_-10px_rgba(var(--color-primary),0.2)] relative overflow-hidden group">
					<div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(var(--color-primary),0.05)_50%,transparent_75%)] bg-[length:250%_250%,100%_100%] animate-bg-pan opacity-0 group-hover:opacity-100 transition-opacity"></div>
					<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between relative z-10">
						<div className="flex items-center gap-5">
							<div className="flex h-14 w-14 items-center justify-center rounded-sm border border-primary/40 bg-background text-primary shadow-inner">
								<LiaIndustrySolid className="h-7 w-7" aria-hidden="true" />
							</div>
							<div>
								<div className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary font-bold">Command Signal</div>
								<div className="mt-1.5 font-display text-xl md:text-2xl font-bold tracking-tight text-foreground">
									#1 Workforce Management Solution for Industrial Operations
								</div>
							</div>
						</div>
						<div className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground md:text-right max-w-[200px] leading-relaxed">
							Measured across deployments, staffing models, and shift structures.
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
