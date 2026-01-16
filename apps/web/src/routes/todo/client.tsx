"use client";

import { useFormStatus } from "react-dom";
import { Checkbox } from "react-aria-components";
import { toggleTodo, deleteTodo, createTodo } from "./actions";
import { useActionState } from "react";
import { Button } from "@monorepo/design-system";
import { SimpleInput } from "@monorepo/design-system";
import { Alert } from "@monorepo/design-system";
import { Card, CardBody } from "@monorepo/design-system";
import { cn } from "~/lib/cn";

function SubmitButton() {
	const { pending } = useFormStatus();

	return (
		<Button type="submit" disabled={pending}>
			{pending ? (
				<>
					<span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
					Adding...
				</>
			) : (
				"Add"
			)}
		</Button>
	);
}

export function TodoForm() {
	const [state, formAction] = useActionState(createTodo, {});

	return (
		<form action={formAction} className="flex gap-2 mb-6">
			<SimpleInput
				name="title"
				placeholder="Add a new todo..."
				className="flex-1"
				aria-label="Add Todo"
				required
			/>
			<SubmitButton />
			{state.error && <Alert variant="error">{state.error}</Alert>}
		</form>
	);
}

export function TodoItem({
	id,
	title,
	completed,
}: {
	id: string;
	title: string;
	completed: boolean;
}) {
	return (
		<Card>
			<CardBody>
				<div className="flex items-center justify-between">
					<Checkbox
						isSelected={completed}
						onChange={() => toggleTodo(id)}
						className="flex items-center gap-3 flex-1"
					>
						{({ isSelected }) => (
							<>
								<div
									className={cn(
										"w-5 h-5 border-2 border-blue-600 rounded transition-all",
										isSelected ? "bg-blue-600" : "bg-white"
									)}
								>
									{isSelected && (
										<svg className="h-4 w-4 text-white" viewBox="0 0 18 18" aria-hidden="true">
											<polyline
												points="1 9 7 14 15 4"
												fill="none"
												stroke="currentColor"
												strokeWidth="3"
											/>
										</svg>
									)}
								</div>
								<span className={cn(completed && "line-through opacity-50")}>{title}</span>
							</>
						)}
					</Checkbox>
					<Button onPress={() => deleteTodo(id)} variant="ghost" size="sm">
						Delete
					</Button>
				</div>
			</CardBody>
		</Card>
	);
}
