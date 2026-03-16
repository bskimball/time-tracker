import { Button, IndustrialPanel } from "@monorepo/design-system";
import {
	LiaBroadcastTowerSolid,
	LiaBoxesSolid,
	LiaWaveSquareSolid,
} from "react-icons/lia";

const telemetry = [
	{ value: "99.9%", label: "Uptime SLA", tone: "primary", metric: "SYS_UPTIME" },
	{ value: "<50ms", label: "API Latency", tone: "secondary", metric: "NET_LATENCY" },
	{ value: "500+", label: "Facilities", tone: "primary", metric: "ACT_NODES" },
	{ value: "24/7", label: "Support", tone: "secondary", metric: "OPS_COVERAGE" },
];

export default function HeroSection() {
	return (
		<section className="relative overflow-hidden border-b-2 border-border/80 bg-background pt-8 pb-16 md:pt-16 md:pb-24">
			{/* Industrial Background Textures */}
			<div className="absolute inset-0 bg-noise opacity-[0.25] pointer-events-none mix-blend-overlay" />
			<div className="absolute inset-0 bg-tactical-grid opacity-[0.06] dark:opacity-[0.12] pointer-events-none" aria-hidden="true" />
			<div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" aria-hidden="true" />
			<div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-primary/[0.02] to-transparent pointer-events-none" />

			<div className="container mx-auto px-4 md:px-8 relative z-10">
				{/* Top Command Bar */}
				<div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-border/60 pb-5">
					<div className="flex items-center gap-4 text-[10px] font-mono uppercase tracking-[0.25em] text-foreground/80">
						<span className="inline-flex items-center gap-2 rounded-sm border border-primary/30 bg-primary/10 px-2.5 py-1.5 text-primary shadow-inner">
							<span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(245,110,32,0.6)]" />
							SYS.00 // Command Layer
						</span>
						<span className="hidden sm:inline-block text-muted-foreground">Precision Workforce Analytics</span>
					</div>
					<div className="flex items-center gap-4 text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
						<span className="flex items-center gap-2"><LiaBroadcastTowerSolid className="text-primary"/> Ops Mode</span>
						<span className="h-3 w-[2px] bg-border/80" />
						<span>Live Telemetry : ON</span>
					</div>
				</div>

				<div className="grid gap-12 lg:grid-cols-2 lg:gap-16 lg:items-center">
					{/* Left Column: Typography & CTAs */}
					<div className="flex flex-col justify-center max-w-2xl">
						<div className="mb-8 inline-flex items-center gap-3 border border-border/60 bg-card/50 backdrop-blur-sm px-3 py-1.5 shadow-sm w-fit">
							<span className="relative flex h-2 w-2">
								<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
								<span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
							</span>
							<span className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/80 font-bold">
								System Status: Optimal // 512 Zones Online
							</span>
						</div>

						<h1 className="font-display text-5xl font-black tracking-[-0.04em] text-foreground md:text-6xl lg:text-7xl leading-[0.95] uppercase relative">
							<span className="block text-primary/80 text-lg md:text-xl mb-4 font-mono tracking-[0.25em] uppercase font-bold">The Industrial Standard</span>
							For Time Tracking
						</h1>

						<p className="mt-8 text-lg leading-relaxed text-foreground/70 md:text-xl font-body border-l-2 border-primary/40 pl-5">
							Transform fulfillment and manufacturing operations with live labor telemetry,
							operational guardrails, and executive-grade workforce dashboards built for the floor.
						</p>

						<div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
							<a href="/pricing" className="w-full sm:w-auto">
								<Button
									size="lg"
									className="w-full sm:min-w-48 justify-center btn-mechanical px-8 py-6 text-sm shadow-[0_4px_0_0_oklch(48%_0.14_42)] hover:translate-y-[2px] hover:shadow-[0_2px_0_0_oklch(48%_0.14_42)] active:translate-y-[4px] active:shadow-none transition-all uppercase tracking-widest font-bold"
								>
									Deploy System
								</Button>
							</a>
							<a href="/features" className="w-full sm:w-auto">
								<Button
									variant="outline"
									size="lg"
									className="w-full sm:min-w-48 justify-center border-2 border-border/80 bg-background/50 backdrop-blur-md px-8 py-6 text-sm text-foreground hover:border-primary/50 hover:bg-muted/80 transition-all uppercase tracking-widest font-bold"
								>
									View Tech Specs
								</Button>
							</a>
						</div>
					</div>

					{/* Right Column: Dashboard UI */}
					<div className="relative">
						{/* Background decorative glow for right column */}
						<div className="absolute -inset-4 bg-primary/5 blur-3xl rounded-full opacity-50 pointer-events-none"></div>
						
						<IndustrialPanel className="relative z-10 overflow-hidden border-2 border-border/80 bg-card shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] transform lg:rotate-1 hover:rotate-0 transition-transform duration-500">
							{/* Hardware-like top bar */}
							<div className="border-b-2 border-border/80 bg-muted/80 px-4 py-3 flex items-center justify-between relative overflow-hidden">
								<div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] bg-[length:250%_250%,100%_100%] animate-bg-pan"></div>
								<div className="flex items-center gap-3 relative z-10">
									<div className="flex gap-1.5">
										<div className="w-2.5 h-2.5 rounded-full bg-destructive/80 border border-border"></div>
										<div className="w-2.5 h-2.5 rounded-full bg-warning/80 border border-border"></div>
										<div className="w-2.5 h-2.5 rounded-full bg-success/80 border border-border"></div>
									</div>
									<div className="h-4 w-px bg-border/80 mx-2"></div>
									<p className="font-mono text-[9px] uppercase tracking-[0.25em] text-muted-foreground font-bold">
										Terminal_View // v4.2
									</p>
								</div>
								<div className="inline-flex items-center gap-2 rounded-sm border border-primary/30 bg-primary/10 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-primary relative z-10 shadow-inner">
									<span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(245,110,32,0.6)] animate-pulse" />
									Live Feed
								</div>
							</div>

							<div className="p-1 bg-border/40">
								<div className="grid gap-1 bg-border/40 p-1 sm:grid-cols-[minmax(0,1fr)_200px]">
									{/* Main Readout */}
									<div className="bg-background relative overflow-hidden flex flex-col">
										<div className="p-5 flex-1">
											<div className="mb-6 flex items-center justify-between gap-3 border-b border-border/50 pb-4">
												<div>
													<p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
														Metric // Productivity_Rate
													</p>
													<p className="mt-1.5 inline-block bg-primary/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.15em] text-primary font-bold">
														Focus: Labor Efficiency
													</p>
												</div>
												<div className="text-right">
													<div className="font-mono text-[9px] uppercase tracking-[0.15em] text-foreground/50">Time_Frame</div>
													<div className="font-mono text-[11px] uppercase tracking-[0.1em] text-foreground font-bold">Today (T-0)</div>
												</div>
											</div>

											<div className="flex items-baseline gap-2 mt-4">
												<div className="font-display text-[4.5rem] md:text-[5.5rem] font-black tracking-[-0.05em] text-foreground leading-[0.8]">
													26.4
												</div>
												<div className="font-mono text-lg md:text-xl uppercase tracking-[0.15em] text-muted-foreground font-bold mb-1">
													u/hr
												</div>
											</div>

											<div className="mt-8 grid gap-1 grid-cols-3 bg-border/50 border border-border/50">
												<div className="bg-card px-3 py-3">
													<div className="font-mono text-[8px] md:text-[9px] uppercase tracking-[0.2em] text-muted-foreground">Rolling_Avg</div>
													<div className="mt-1 font-mono text-lg md:text-xl font-bold text-foreground">24.8</div>
												</div>
												<div className="bg-primary/5 px-3 py-3 border-x border-primary/20 relative overflow-hidden">
													<div className="absolute top-0 left-0 w-full h-0.5 bg-primary"></div>
													<div className="font-mono text-[8px] md:text-[9px] uppercase tracking-[0.2em] text-primary/80">Target_SLA</div>
													<div className="mt-1 font-mono text-lg md:text-xl font-bold text-foreground">24.0</div>
												</div>
												<div className="bg-card px-3 py-3">
													<div className="font-mono text-[8px] md:text-[9px] uppercase tracking-[0.2em] text-muted-foreground">Variance_Δ</div>
													<div className="mt-1 font-mono text-lg md:text-xl font-bold text-success">+8%</div>
												</div>
											</div>
										</div>

										{/* Throughput Graph */}
										<div className="border-t border-border/50 bg-muted/20 p-5 mt-auto">
											<div className="mb-4 flex items-center justify-between text-[9px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
												<span>Station_Throughput_Array</span>
												<span className="flex items-center gap-2"><div className="w-1 h-1 bg-primary"></div> Active</span>
											</div>
											<div className="grid h-20 md:h-24 grid-cols-8 items-end gap-1.5">
												{[42, 65, 54, 78, 58, 72, 85, 60].map((bar, index) => (
													<div key={index} className="flex h-full flex-col justify-end gap-1 relative group cursor-crosshair">
														<div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-foreground text-background text-[9px] font-mono px-1 py-0.5 opacity-0 group-hover:opacity-100 pointer-events-none z-10 transition-opacity">
															{bar}
														</div>
														<div
															className={`w-full rounded-t-[1px] transition-all duration-300 ${index === 6 ? "bg-primary" : index > 3 ? "bg-foreground/30" : "bg-foreground/15"} group-hover:bg-primary/70 group-hover:h-full`}
															style={{ height: `${bar}%` }}
														/>
													</div>
												))}
											</div>
										</div>
									</div>

									{/* Side Panel Stats */}
									<div className="grid gap-1 grid-rows-3">
										<div className="bg-background p-4 flex flex-col justify-center border border-border/40">
											<div className="mb-2 flex items-center justify-between">
												<span className="font-mono text-[9px] uppercase tracking-[0.15em] text-muted-foreground">Active_Crew</span>
												<LiaBroadcastTowerSolid className="h-3.5 w-3.5 text-primary" />
											</div>
											<div className="text-3xl md:text-4xl font-display font-black tracking-tight text-foreground">72</div>
											<div className="mt-2 font-mono text-[8px] uppercase tracking-[0.15em] text-success flex items-center gap-1">
												<span className="w-1 h-1 rounded-full bg-success"></span> Stable Delta
											</div>
										</div>

										<div className="bg-destructive/5 p-4 flex flex-col justify-center border border-destructive/20 relative overflow-hidden">
											<div className="absolute left-0 top-0 h-full w-1 bg-destructive/50"></div>
											<div className="mb-2 flex items-center justify-between">
												<span className="font-mono text-[9px] uppercase tracking-[0.15em] text-destructive/80">OT_Guardrail</span>
												<LiaWaveSquareSolid className="h-3.5 w-3.5 text-destructive/80" />
											</div>
											<div className="text-3xl md:text-4xl font-display font-black tracking-tight text-foreground">2.1%</div>
											<div className="mt-2 font-mono text-[8px] uppercase tracking-[0.15em] text-destructive/80 border border-destructive/20 bg-destructive/10 px-1.5 py-0.5 w-fit">
												Warn: Threshold near
											</div>
										</div>

										<div className="bg-background p-4 flex flex-col justify-center border border-border/40">
											<div className="mb-3 flex items-center justify-between">
												<span className="font-mono text-[9px] uppercase tracking-[0.15em] text-muted-foreground">Infrastructure</span>
												<LiaBoxesSolid className="h-3.5 w-3.5 text-muted-foreground" />
											</div>
											<div className="space-y-2.5 text-[9px] font-mono uppercase tracking-[0.15em] text-foreground/80">
												<div className="flex items-center justify-between">
													<span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 bg-primary"></div> Cloud</span>
													<span className="font-bold">58%</span>
												</div>
												<div className="flex items-center justify-between">
													<span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 bg-foreground/40"></div> Hybrid</span>
													<span className="font-bold">29%</span>
												</div>
												<div className="flex items-center justify-between opacity-50">
													<span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 bg-foreground/20"></div> Local</span>
													<span className="font-bold">13%</span>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</IndustrialPanel>
					</div>
				</div>

				{/* Telemetry Footer Strip */}
				<div className="mt-16 md:mt-24 grid gap-px bg-border/60 border-2 border-border/60 p-px sm:grid-cols-2 md:grid-cols-4 shadow-sm">
					{telemetry.map((item, index) => (
						<div key={item.label} className="bg-card p-6 md:p-8 relative overflow-hidden group hover:bg-muted/20 transition-colors">
							<div
								className={`absolute left-0 top-0 bottom-0 w-1 md:w-1.5 transition-colors ${item.tone === "primary" ? "bg-primary group-hover:bg-primary-hover" : "bg-border/80 group-hover:bg-primary/50"}`}
							/>
							<div className="absolute right-4 top-4 font-mono text-[8px] text-muted-foreground opacity-30 group-hover:opacity-100 transition-opacity">
								{item.metric}
							</div>
							<div className="mb-4 flex items-center gap-2 text-[9px] font-mono uppercase tracking-[0.25em] text-muted-foreground">
								<span className="bg-muted px-1.5 py-0.5 border border-border/50">{`0${index + 1}`}</span>
								<span>Tele_Data</span>
							</div>
							<div className="text-3xl md:text-4xl font-display font-black tracking-[-0.02em] text-foreground group-hover:text-primary transition-colors">
								{item.value}
							</div>
							<div className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/70 font-bold border-t border-border/50 pt-3">
								{item.label}
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
