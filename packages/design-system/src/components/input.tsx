"use client";

import React from "react";
import {
	TextField as AriaTextField,
	Input as AriaInput,
	Label as AriaLabel,
	FieldError,
} from "react-aria-components";
import { cn } from "../utils/cn";

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
					<AriaLabel
						className={cn(
							"text-xs font-industrial uppercase tracking-wider text-muted-foreground",
							labelClassName
						)}
					>
						{label}
					</AriaLabel>
				)}
				<div className="relative group">
					<AriaInput
						{...props}
						ref={ref}
					className={cn(
						// Layout & Base
						"w-full h-10 px-3 py-2 rounded-[2px]",
						"bg-input-background text-zinc-950 dark:text-zinc-100",
						"font-mono text-sm transition-all duration-150",

							// Borders - Precision Industrial (Hairline, High Contrast)
							"border border-input hover:border-input-hover",

						// Focus - Signal Orange, Sharp
						"focus:outline-none focus:border-primary focus:bg-input-background focus:ring-1 focus:ring-primary",

							// Disabled - Maintain structure but dim
							"disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted",

							// Placeholder
							"placeholder:text-muted-foreground/50",

							// Error State
							error && "border-destructive focus:border-destructive focus:ring-destructive",

							inputClassName,
							className
						)}
					/>
				</div>

				{description && <p className="text-xs text-muted-foreground font-mono">{description}</p>}
				{error && (
					<FieldError
						className={cn("text-xs text-destructive font-mono font-medium", errorClassName)}
					>
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
			"w-full h-10 px-3 py-2 rounded-[2px]",
			"bg-zinc-50 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-100",
			"font-mono text-sm transition-all duration-150",
			"border border-input hover:border-input-hover",
			"focus:outline-none focus:border-primary focus:bg-input-background focus:ring-1 focus:ring-primary",
				"disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted",
				"placeholder:text-muted-foreground/50",
				props.className
			)}
		/>
	);
}
