import { db } from "../../lib/db";
import { TodoForm, TodoItem } from "./client";
import { Header } from "../../components/header";
import { Footer } from "../../components/footer";
import { PageHeader } from "../../components/page-header";
import { validateRequest } from "../../lib/auth";

// Fetch data directly in Server Component instead of using loader
// This is the correct pattern for React Server Components
export default async function Component() {
	// Get authenticated user from middleware
	// Middleware ensures user is authenticated before this component renders
	const { user } = await validateRequest();
	const headerName = user?.name ?? user?.email ?? null;
	const headerRole = user?.role ?? "USER";

	const todos = await db.todo.findMany({
		orderBy: { createdAt: "desc" },
	});

	return (
		<>
			<title>Todo List</title>
			<meta name="description" content="A simple todo list app" />

			<Header userName={headerName} userRole={headerRole} />
			<main className="container mx-auto py-8 lg:py-12">
				<div className="mx-auto">
					<PageHeader title="Todo List" subtitle="Manage your tasks and reminders" />

					<TodoForm />

					<div className="space-y-3">
						{todos.length === 0 ? (
							<p className="text-center text-muted-foreground py-8">No todos yet. Add one above!</p>
						) : (
							todos.map((todo) => (
								<TodoItem
									key={todo.id}
									id={todo.id}
									title={todo.title}
									completed={todo.completed}
								/>
							))
						)}
					</div>
				</div>
			</main>
			<Footer />
		</>
	);
}
