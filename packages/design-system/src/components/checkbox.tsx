"use client";

import React from "react";
import {
	Checkbox as AriaCheckbox,
	type CheckboxProps as AriaCheckboxProps,
} from "react-aria-components";
import { cn } from "../utils/cn";

export interface CheckboxProps extends Omit<AriaCheckboxProps, "className"> {
	label?: string;
	description?: string;
	error?: string;
	className?: string;
	labelClassName?: string;
}

/**
 * Design system Checkbox component built with React Aria Components.
 *
 * Provides accessible checkbox with label, description, and error states.
 * Follows industrial design system styling with tightly rounded corners.
 */
export function Checkbox({
	label,
	description,
	error,
	className = "",
	labelClassName = "",
	children,
	...props
}: React.PropsWithChildren<CheckboxProps>) {
	return (
		<AriaCheckbox
			{...props}
			className={cn(
				"group flex items-start gap-3 cursor-pointer",
				props.isDisabled && "cursor-not-allowed opacity-50",
				className
			)}
		>
			{({ isSelected, isIndeterminate }) => (
				<>
					<div
						className={cn(
							// Base styles
							"flex items-center justify-center w-5 h-5 mt-0.5",
							"border-2 border-input rounded-sm transition-all duration-150",
							"bg-background",
							// Focus states
							"group-focus:outline-none group-focus:ring-2 group-focus:ring-ring group-focus:ring-offset-2",
							// Checked states
							isSelected && "bg-primary border-primary",
							// Indeterminate states
							isIndeterminate && "bg-primary border-primary",
							// Error states
							error && "border-destructive",
							// Disabled states
							props.isDisabled && "bg-muted cursor-not-allowed"
						)}
					>
						{isSelected && (
							<svg
								className="w-3 h-3 text-primary-foreground"
								viewBox="0 0 12 12"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M10 3L4.5 8.5L2 6"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
						)}
						{isIndeterminate && (
							<svg
								className="w-3 h-3 text-primary-foreground"
								viewBox="0 0 12 12"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M2 6H10"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
						)}
					</div>
					<div className="flex flex-col gap-1">
						{(label || children) && (
							<span className={cn("text-sm font-medium", labelClassName)}>{label || children}</span>
						)}
						{description && <p className="text-xs text-muted-foreground">{description}</p>}
						{error && <p className="text-xs text-destructive">{error}</p>}
					</div>
				</>
			)}
		</AriaCheckbox>
	);
}
