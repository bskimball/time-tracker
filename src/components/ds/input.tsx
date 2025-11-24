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

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
	(
		{
			label,
			error,
			description,
			containerClassName = "",
			labelClassName = "",
			inputClassName = "",
			errorClassName = "",
			className = "",
			...props
		},
		ref
	) => {
		return (
			<AriaTextField className={cn("flex flex-col gap-1.5", containerClassName)}>
				{label && (
					<AriaLabel className={cn("text-sm font-heading", labelClassName)}>{label}</AriaLabel>
				)}
				<AriaInput
					{...props}
					ref={ref}
					className={cn(
						"h-10 px-3 py-2 bg-background text-foreground border border-input rounded-sm transition-all duration-150",
						"focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:border-primary",
						"disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground",
						"placeholder:text-muted-foreground/60",
						error && "border-destructive focus:ring-destructive",
						inputClassName,
						className
					)}
				/>
				{description && <p className="text-xs text-muted-foreground">{description}</p>}
				{error && (
					<FieldError className={cn("text-xs text-destructive font-medium", errorClassName)}>
						{error}
					</FieldError>
				)}
			</AriaTextField>
		);
	}
);

Input.displayName = "Input";

// Simpler input component for quick usage (works in both server and client)
export function SimpleInput(props: React.ComponentProps<"input">) {
	return (
		<input
			{...props}
			className={cn(
				"h-10 px-3 py-2 bg-background text-foreground border border-input rounded-sm transition-all duration-150",
				"focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:border-primary",
				"disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground",
				"placeholder:text-muted-foreground/60",
				props.className
			)}
		/>
	);
}
