"use server";

import { db } from "../../lib/db";

export type FormState = {
	error?: string;
	success?: boolean;
};

export async function createTodo(_prevState: FormState, formData: FormData): Promise<FormState> {
	const title = formData.get("title") as string;

	if (!title || title.trim() === "") {
		return { error: "Title is required" };
	}

	await db.todo.create({
		data: {
			id: crypto.randomUUID(),
			title: title.trim(),
			updatedAt: new Date(),
		},
	});

	return { success: true };
}

export async function toggleTodo(id: string) {
	const todo = await db.todo.findUnique({ where: { id } });

	if (!todo) {
		return { error: "Todo not found" };
	}

	await db.todo.update({
		where: { id },
		data: { completed: !todo.completed },
	});

	return { success: true };
}

export async function deleteTodo(id: string) {
	await db.todo.delete({ where: { id } });

	return { success: true };
}
