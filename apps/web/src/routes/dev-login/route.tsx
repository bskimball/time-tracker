import { db } from "../../lib/db";
import { CreateAdminForm, LoginSubmitButton } from "./client";
import { loginAsUser } from "./actions";
import { IndustrialHeader, IndustrialPanel, SafetyStripes } from "@monorepo/design-system";
import type { User } from "@prisma/client";

// Fetch data directly in Server Component instead of using loader
export default async function Component() {
	// Get all users for dev login
	const users = await db.user.findMany({
		orderBy: { createdAt: "desc" },
	});

	// Convert to plain objects for RSC serialization
	const plainUsers = JSON.parse(JSON.stringify(users)) as User[];

	return (
		<>
			<title>Development Login</title>
			<meta
				name="description"
				content="Create a new admin user or login as an existing user (development only)"
			/>

			<main className="min-h-screen flex items-center justify-center bg-dot-grid-pattern p-4">
				<div className="w-full max-w-4xl space-y-6">
					<SafetyStripes position="top" />
					<IndustrialPanel>
						<IndustrialHeader title="DEV LOGIN" subtitle="Development Access" className="mb-0" />
						<div className="p-8">
							<p className="text-sm text-muted-foreground mb-6">
								Create a new admin user or login as an existing user (development only)
							</p>

							<CreateAdminForm />

							{plainUsers.length > 0 && (
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
											{plainUsers.map((user) => (
												<div
													key={user.id}
													className="panel-shadow shadow-industrial border border-border bg-background p-4 flex items-center justify-between"
												>
													<div>
														<p className="font-medium">{user.name || user.email}</p>
														<p className="text-sm text-muted-foreground">{user.email}</p>
														<p className="text-xs text-muted-foreground">{user.role}</p>
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
