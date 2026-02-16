"use client";

import { Link } from "react-router";
import {
	IndustrialHeader,
	IndustrialPanel,
	SafetyStripes,
} from "@monorepo/design-system";


export function LoginClient() {
	return (
		<main className="min-h-screen flex items-center justify-center bg-noise p-4 selection:bg-primary/30">
			{/* Tactical grid background */}
			<div className="absolute inset-0 bg-tactical-grid opacity-20 pointer-events-none" aria-hidden="true" />

			<div className="w-full max-w-md relative z-10">
				<SafetyStripes position="top" aria-hidden="true" />
				<IndustrialPanel className="relative">
					<IndustrialHeader title="Login" subtitle="SECURE_ACCESS_v1.0" />
					<div className="p-8">
						<p className="text-center text-sm mb-8 text-muted-foreground font-heading uppercase tracking-wider">
							Choose your authentication method
						</p>

						<div className="space-y-4">
							<Link
								to="/auth/google/start"
								className="flex w-full h-12 px-6 text-base inline-flex items-center justify-center font-bold rounded-[2px] transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ring-offset-background active:translate-y-[1px] font-heading tracking-tight border border-border/50 bg-card text-foreground hover:bg-muted/50 hover:border-primary/30 gap-4 group shadow-sm"
							>
								<svg
									className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110"
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
								<span className="flex-1 text-left uppercase tracking-tight text-sm font-industrial">Continue with Google</span>
								<span className="font-mono text-[10px] opacity-0 group-hover:opacity-40 transition-opacity">AUTH_G</span>
							</Link>

							<Link
								to="/auth/microsoft/start"
								className="flex w-full h-12 px-6 text-base inline-flex items-center justify-center font-bold rounded-[2px] transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ring-offset-background active:translate-y-[1px] font-heading tracking-tight border border-border/50 bg-card text-foreground hover:bg-muted/50 hover:border-primary/30 gap-4 group shadow-sm"
							>
								<svg
									className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110"
									viewBox="0 0 24 24"
									aria-hidden="true"
								>
									<path fill="#f25022" d="M1 1h10v10H1z" />
									<path fill="#00a4ef" d="M13 1h10v10H13z" />
									<path fill="#7fba00" d="M1 13h10v10H1z" />
									<path fill="#ffb900" d="M13 13h10v10H13z" />
								</svg>
								<span className="flex-1 text-left uppercase tracking-tight text-sm font-industrial">Continue with Microsoft</span>
								<span className="font-mono text-[10px] opacity-0 group-hover:opacity-40 transition-opacity">AUTH_M</span>
							</Link>
						</div>

						<div className="my-10 flex items-center gap-4" aria-hidden="true">
							<div className="flex-1 border-t border-border border-dashed" />
							<span className="text-muted-foreground text-[10px] font-mono tracking-widest uppercase">
								System_Gateway
							</span>
							<div className="flex-1 border-t border-border border-dashed" />
						</div>

						<Link
							to="/floor"
							className="flex w-full h-10 px-4 text-[10px] inline-flex items-center justify-center font-mono tracking-widest uppercase rounded-[2px] transition-all duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ring-offset-background text-muted-foreground border border-border/30 bg-muted/10 hover:bg-muted/30 hover:text-foreground group"
						>
							<span className="group-hover:translate-x-1 transition-transform font-bold">Access Floor Kiosk &rarr;</span>
						</Link>
					</div>
				</IndustrialPanel>
				<SafetyStripes position="bottom" aria-hidden="true" />
			</div>
		</main>
	);
}
