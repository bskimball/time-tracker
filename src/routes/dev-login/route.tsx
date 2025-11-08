import { db } from "../../lib/db";
import { CreateAdminForm, LoginSubmitButton } from "./client";
import { loginAsUser } from "./actions";
import { Card, CardBody, CardHeader, CardTitle } from "~/components/ds/card";

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

			<main className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
				<div className="w-full max-w-4xl space-y-6">
					<Card>
						<CardHeader>
							<CardTitle>Development Login</CardTitle>
						</CardHeader>
						<CardBody>
							<p className="text-sm text-gray-600 mb-6">
								Create a new admin user or login as an existing user (development only)
							</p>

							<CreateAdminForm />

							{users.length > 0 && (
								<>
									<div className="my-6 flex items-center gap-4">
										<div className="flex-1 border-t border-gray-300" />
										<span className="text-gray-600 text-sm">OR</span>
										<div className="flex-1 border-t border-gray-300" />
									</div>
									<div className="space-y-2">
										<h2 className="text-xl font-bold text-gray-900 mb-4">Existing Users</h2>
										<div className="space-y-2">
											{users.map((user) => (
												<div
													key={user.id}
													className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
												>
													<div>
														<p className="font-medium text-gray-900">{user.name || user.email}</p>
														<p className="text-sm text-gray-600">{user.email}</p>
														<p className="text-xs text-gray-500">{user.role}</p>
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
						</CardBody>
					</Card>
				</div>
			</main>
		</>
	);
}
