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
							"w-full h-10 px-3 py-2 bg-muted/30 text-foreground border border-input rounded-[2px]",
							"font-mono text-sm transition-all duration-100",
							"focus:outline-none focus:border-primary focus:bg-background focus:ring-1 focus:ring-primary",
							"disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground disabled:border-transparent",
							"placeholder:text-muted-foreground/50",
							error && "border-destructive focus:border-destructive focus:ring-destructive",
							inputClassName,
							className
						)}
					/>
					{/* Corner accent for active state could go here, but keeping it clean for now */}
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
				"w-full h-10 px-3 py-2 bg-muted/30 text-foreground border border-input rounded-[2px]",
				"font-mono text-sm transition-all duration-100",
				"focus:outline-none focus:border-primary focus:bg-background focus:ring-1 focus:ring-primary",
				"disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground",
				"placeholder:text-muted-foreground/50",
				props.className
			)}
		/>
	);
}


