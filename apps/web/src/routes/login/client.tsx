"use client";

import { Link } from "react-router";
import { Button } from "@monorepo/design-system";
import {
	IndustrialHeader,
	IndustrialPanel,
	SafetyStripes,
} from "@monorepo/design-system";

export function LoginClient() {
	return (
		<main className="min-h-screen flex items-center justify-center bg-grid-pattern p-4">
			<div className="w-full max-w-md animate-scale-in">
				<SafetyStripes position="top" />
				<IndustrialPanel className="relative">
					{/* Subtle corner accents - brand establishment */}
					<div className="corner-card-tl corner-accent-md corner-primary" />
					<div className="corner-card-tr corner-accent-md corner-secondary" />

					<IndustrialHeader title="Login" subtitle="Secure Access" />
					<div className="p-8">
						<p className="text-center text-sm mb-8 text-muted-foreground animate-fade-in">
							Choose your authentication method
						</p>

						<div className="space-y-3">
							<Link
								to="/auth/google/start"
								className="flex w-full h-10 px-4 text-base inline-flex items-center justify-center font-medium rounded-sm transition-all duration-150 ease-out focus:outline-none focus:ring-2 ring-ring focus:ring-offset-2 ring-offset-background active:scale-[0.98] font-heading tracking-tight border border-border bg-background text-foreground hover:bg-accent active:bg-accent/80 gap-3 group"
							>
								<svg
									className="w-5 h-5 transition-transform duration-200 group-hover:rotate-12"
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
								<span className="flex-1 text-left">Continue with Google</span>
							</Link>

							<Link
								to="/auth/microsoft/start"
								className="flex w-full h-10 px-4 text-base inline-flex items-center justify-center font-medium rounded-sm transition-all duration-150 ease-out focus:outline-none focus:ring-2 ring-ring focus:ring-offset-2 ring-offset-background active:scale-[0.98] font-heading tracking-tight border border-border bg-background text-foreground hover:bg-accent active:bg-accent/80 gap-3 group"
							>
								<svg
									className="w-5 h-5 transition-transform duration-200 group-hover:rotate-12"
									viewBox="0 0 24 24"
									aria-hidden="true"
								>
									<path fill="#f25022" d="M1 1h10v10H1z" />
									<path fill="#00a4ef" d="M13 1h10v10H13z" />
									<path fill="#7fba00" d="M1 13h10v10H1z" />
									<path fill="#ffb900" d="M13 13h10v10H1z" />
								</svg>
								<span className="flex-1 text-left">Continue with Microsoft</span>
							</Link>

							<Link to="/auth/microsoft/start" className="flex w-full">
								<Button variant="outline" className="w-full gap-3 group" onPress={() => {}}>
									<svg
										className="w-5 h-5 transition-transform duration-200 group-hover:rotate-12"
										viewBox="0 0 24 24"
									>
										<path fill="#f25022" d="M1 1h10v10H1z" />
										<path fill="#00a4ef" d="M13 1h10v10H13z" />
										<path fill="#7fba00" d="M1 13h10v10H1z" />
										<path fill="#ffb900" d="M13 13h10v10H13z" />
									</svg>
									<span className="flex-1 text-left">Continue with Microsoft</span>
								</Button>
							</Link>
						</div>

						<div className="my-8 flex items-center gap-4">
							<div className="flex-1 border-t border-border" />
							<span className="text-muted-foreground text-xs font-heading tracking-wider uppercase">
								Or
							</span>
							<div className="flex-1 border-t border-border" />
						</div>

						<Link
							to="/floor"
							className="flex w-full h-10 px-4 text-base inline-flex items-center justify-center font-medium rounded-sm transition-all duration-150 ease-out focus:outline-none focus:ring-2 ring-ring focus:ring-offset-2 ring-offset-background active:scale-[0.98] font-heading tracking-tight text-muted-foreground border border-transparent hover:bg-accent active:bg-accent/80 hover:text-foreground"
						>
							Floor Time Clock (Guest)
						</Link>
					</div>
				</IndustrialPanel>
				<SafetyStripes position="bottom" />
			</div>
		</main>
	);
}
