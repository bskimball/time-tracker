"use client";

import React from "react";
import {
	TextField as AriaTextField,
	Input as AriaInput,
	Label as AriaLabel,
	FieldError,
} from "react-aria-components";
import { cn } from "~/lib/cn";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	label?: string;
	error?: string;
	description?: string;
	containerClassName?: string;
	labelClassName?: string;
	inputClassName?: string;
	errorClassName?: string;
}

export function Input({
	label,
	error,
	description,
	containerClassName = "",
	labelClassName = "",
	inputClassName = "",
	errorClassName = "",
	className = "",
	...props
}: InputProps) {
	return (
		<AriaTextField className={cn("flex flex-col gap-1", containerClassName)}>
			{label && (
				<AriaLabel className={cn("text-sm font-medium", labelClassName)}>{label}</AriaLabel>
			)}
			<AriaInput
				{...props}
				className={cn(
					"h-10 px-3 py-2 bg-background text-foreground border border-input rounded-md transition-all",
					"focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:border-primary",
					"disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground",
					error && "border-destructive focus:ring-destructive",
					inputClassName,
					className
				)}
			/>
			{description && <p className="text-xs text-muted-foreground">{description}</p>}
			{error && (
				<FieldError className={cn("text-xs text-destructive", errorClassName)}>{error}</FieldError>
			)}
		</AriaTextField>
	);
}

// Simpler input component for quick usage (works in both server and client)
export function SimpleInput(props: React.ComponentProps<"input">) {
	return (
		<input
			{...props}
			className={cn(
				"h-10 px-3 py-2 bg-background text-foreground border border-input rounded-md transition-all",
				"focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:border-primary",
				"disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground",
				props.className
			)}
		/>
	);
}
