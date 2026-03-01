"use client";

import { Link } from "react-router";
import { IndustrialHeader, IndustrialPanel, SafetyStripes } from "@monorepo/design-system";

export function LoginClient() {
	return (
		<main className="min-h-screen flex items-center justify-center bg-background p-4 selection:bg-primary/30">
			{/* Dotted grid background */}
			<div
				className="absolute inset-0 bg-dot-grid-pattern opacity-50 pointer-events-none"
				aria-hidden="true"
			/>

			<div className="w-full max-w-md relative z-10">
				<SafetyStripes position="top" aria-hidden="true" className="opacity-80" />
				<IndustrialPanel className="relative shadow-xl">
					<IndustrialHeader title="Login">
						<div className="absolute top-8 right-8 flex gap-1.5 opacity-40">
							<div className="w-1.5 h-1.5 rounded-full bg-background" />
							<div className="w-1.5 h-1.5 rounded-full bg-background" />
							<div className="w-1.5 h-1.5 rounded-full bg-background" />
						</div>
					</IndustrialHeader>

					<div className="p-8 pt-10 bg-industrial-card-gradient">
						<div className="flex items-center justify-center mb-6">
							<p className="text-xs text-muted-foreground font-mono uppercase tracking-widest flex items-center gap-2">
								<span className="w-2 h-px bg-primary/50" />
								Select Auth Protocol
								<span className="w-2 h-px bg-primary/50" />
							</p>
						</div>

						<div className="space-y-4">
							<Link
								to="/auth/google/start"
								className="relative flex w-full h-14 px-6 items-center justify-start font-bold rounded-[2px] transition-all duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ring-offset-background active:translate-y-[1px] font-heading tracking-tight border border-border/80 bg-background text-foreground shadow-[0_2px_0_rgba(0,0,0,0.02)] hover:bg-accent hover:border-border active:shadow-none gap-4 group overflow-hidden"
							>
								<div className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary scale-y-0 group-hover:scale-y-100 transition-transform duration-200 ease-out origin-center" />

								<div className="flex items-center justify-center w-8 h-8 rounded-[1px] bg-card border border-border/50 group-hover:border-primary/20 transition-colors shadow-sm">
									<svg
										className="w-4 h-4 transition-transform duration-300 group-hover:scale-110"
										viewBox="0 0 24 24"
										aria-hidden="true"
									>
										<path
											fill="currentColor"
											d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
										/>
										<path
											fill="currentColor"
											d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
										/>
										<path
											fill="currentColor"
											d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
										/>
										<path
											fill="currentColor"
											d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
										/>
									</svg>
								</div>

								<span className="flex-1 text-left uppercase tracking-tight text-sm font-industrial">
									Google Workspace
								</span>
								<span className="font-mono text-[10px] text-muted-foreground opacity-50 group-hover:opacity-100 group-hover:text-primary transition-all">
									[G-AUTH]
								</span>
							</Link>

							<Link
								to="/auth/microsoft/start"
								className="relative flex w-full h-14 px-6 items-center justify-start font-bold rounded-[2px] transition-all duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ring-offset-background active:translate-y-[1px] font-heading tracking-tight border border-border/80 bg-background text-foreground shadow-[0_2px_0_rgba(0,0,0,0.02)] hover:bg-accent hover:border-border active:shadow-none gap-4 group overflow-hidden"
							>
								<div className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary scale-y-0 group-hover:scale-y-100 transition-transform duration-200 ease-out origin-center" />

								<div className="flex items-center justify-center w-8 h-8 rounded-[1px] bg-card border border-border/50 group-hover:border-primary/20 transition-colors shadow-sm">
									<svg
										className="w-4 h-4 transition-transform duration-300 group-hover:scale-110"
										viewBox="0 0 24 24"
										aria-hidden="true"
									>
										<path fill="#f25022" d="M1 1h10v10H1z" />
										<path fill="#00a4ef" d="M13 1h10v10H13z" />
										<path fill="#7fba00" d="M1 13h10v10H1z" />
										<path fill="#ffb900" d="M13 13h10v10H13z" />
									</svg>
								</div>

								<span className="flex-1 text-left uppercase tracking-tight text-sm font-industrial">
									Microsoft Entra
								</span>
								<span className="font-mono text-[10px] text-muted-foreground opacity-50 group-hover:opacity-100 group-hover:text-primary transition-all">
									[M-AUTH]
								</span>
							</Link>
						</div>

						<div className="my-10 flex items-center gap-4 opacity-70" aria-hidden="true">
							<div className="flex-1 border-t border-border border-dashed" />
							<div className="w-1.5 h-1.5 rounded-full bg-border" />
							<div className="flex-1 border-t border-border border-dashed" />
						</div>

						<Link
							to="/floor"
							className="relative flex w-full h-14 overflow-hidden items-center justify-between px-6 font-bold rounded-[2px] transition-all duration-75 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ring-offset-background font-industrial antialiased bg-primary border border-white/40 text-primary-foreground shadow-none hover:bg-primary-hover active:bg-primary-active active:translate-y-[1px] group"
						>
							<div className="relative flex items-center gap-3">
								<span className="font-industrial text-sm uppercase tracking-widest">
									Floor Kiosk Terminal
								</span>
							</div>

							<svg
								className="w-5 h-5 group-hover:translate-x-1 transition-transform"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M5 12h14M12 5l7 7-7 7"
								/>
							</svg>
						</Link>
					</div>
				</IndustrialPanel>
				<SafetyStripes position="bottom" aria-hidden="true" className="opacity-80" />
			</div>
		</main>
	);
}
