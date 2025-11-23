import { db } from "../../lib/db";
import { CreateAdminForm, LoginSubmitButton } from "./client";
import { loginAsUser } from "./actions";
import {
	IndustrialHeader,
	IndustrialPanel,
	SafetyStripes,
} from "~/components/ds/industrial";

// Fetch data directly in Server Component instead of using loader
export default async function Component() {
	// Get all users for dev login
	const users = await db.user.findMany({
		orderBy: { createdAt: "desc" },
	});

	return (
		<>
			<title>Development Login</title>
			<meta
				name="description"
				content="Create a new admin user or login as an existing user (development only)"
			/>

			<main className="min-h-screen flex items-center justify-center bg-grid-pattern p-4">
				<div className="w-full max-w-4xl space-y-6">
					<SafetyStripes position="top" />
					<IndustrialPanel>
						<IndustrialHeader
							title="DEV LOGIN"
							subtitle="Development Access"
							className="mb-0"
						/>
						<div className="p-8">
							<p className="text-sm text-muted-foreground mb-6">
								Create a new admin user or login as an existing user (development
								only)
							</p>

							<CreateAdminForm />

							{users.length > 0 && (
								<>
									<div className="my-6 flex items-center gap-4">
										<div className="flex-1 border-t border-border" />
										<span className="text-muted-foreground text-sm font-industrial tracking-widest uppercase">
											OR
										</span>
										<div className="flex-1 border-t border-border" />
									</div>
									<div className="space-y-2">
										<h2 className="text-xl font-bold mb-4 font-industrial uppercase tracking-wide">
											Existing Users
										</h2>
										<div className="space-y-2">
											{users.map((user) => (
												<div
													key={user.id}
													className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border"
												>
													<div>
														<p className="font-medium">
															{user.name || user.email}
														</p>
														<p className="text-sm text-muted-foreground">
															{user.email}
														</p>
														<p className="text-xs text-muted-foreground">
															{user.role}
														</p>
													</div>
													<form action={loginAsUser}>
														<input type="hidden" name="userId" value={user.id} />
														<LoginSubmitButton />
													</form>
												</div>
											))}
										</div>
									</div>
								</>
							)}
						</div>
					</IndustrialPanel>
					<SafetyStripes position="bottom" className="mt-8" />
				</div>
			</main>
		</>
	);
}
