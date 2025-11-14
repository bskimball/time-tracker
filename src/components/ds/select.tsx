"use client";

import React from "react";
import {
	Select as AriaSelect,
	Label as AriaLabel,
	FieldError,
	Button,
	Popover,
	ListBox,
	ListBoxItem,
} from "react-aria-components";
import { cn } from "~/lib/cn";

interface SelectOption {
	value: string;
	label: string;
	isDisabled?: boolean;
}

interface SelectProps {
	options: SelectOption[];
	label?: string;
	error?: string;
	description?: string;
	placeholder?: string;
	defaultValue?: string;
	value?: string;
	onChange?: (value: string | null) => void;
	isDisabled?: boolean;
	containerClassName?: string;
	labelClassName?: string;
	selectClassName?: string;
	errorClassName?: string;
	className?: string;
}

export function Select({
	options,
	label,
	error,
	description,
	placeholder = "Select an option",
	defaultValue,
	value,
	onChange,
	isDisabled = false,
	containerClassName = "",
	labelClassName = "",
	selectClassName = "",
	errorClassName = "",
	className = "",
	...props
}: SelectProps) {
	const selectedValue = value || defaultValue;

	const handleSelectionChange = (key: React.Key | null) => {
		onChange?.(key?.toString() || null);
	};

	return (
		<AriaSelect
			defaultValue={selectedValue || ""}
			onChange={handleSelectionChange}
			isDisabled={isDisabled}
			className={cn("flex flex-col gap-1", containerClassName)}
			{...props}
		>
			{label && (
				<AriaLabel className={cn("text-sm font-medium", labelClassName)}>{label}</AriaLabel>
			)}
			<Button
				className={cn(
					// Base styles matching Input component exactly
					"px-3 py-2.5 bg-background text-foreground border border-input rounded-md transition-all",
					// Focus states matching Input
					"focus:outline-none focus:ring-2 ring-ring focus:ring-offset-1 ring-offset-background focus:border-primary",
					// Disabled states
					"disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground",
					// Error states
					error && "border-destructive focus:ring-destructive focus:ring-opacity-40",
					// Select button specific styling
					"flex items-center justify-between text-left w-full",
					selectClassName,
					className
				)}
			>
				<span>
					{selectedValue === "" || !selectedValue
						? placeholder
						: options.find((opt) => opt.value === selectedValue)?.label}
				</span>
				<span className="text-muted-foreground text-xs">▼</span>
			</Button>
			<Popover className="max-h-60 overflow-auto">
				<ListBox className="p-1 bg-background border border-input rounded-md w-full shadow-lg">
					{options.map((option) => (
						<ListBoxItem
							key={option.value}
							id={option.value}
							className={cn(
								"px-3 py-2 rounded-sm cursor-default transition-colors",
								"hover:bg-muted focus:bg-muted",
								"focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 focus:ring-offset-background",
								option.isDisabled && "opacity-50 cursor-not-allowed"
							)}
							isDisabled={option.isDisabled}
						>
							{option.label}
						</ListBoxItem>
					))}
				</ListBox>
			</Popover>
			{description && <p className="text-xs text-muted-foreground">{description}</p>}
			{error && (
				<FieldError className={cn("text-xs text-destructive", errorClassName)}>{error}</FieldError>
			)}
		</AriaSelect>
	);
}

// Simpler select component for quick usage (works in both server and client)
// This uses native HTML select but with consistent styling
export function SimpleSelect({
	options,
	label,
	error,
	description,
	placeholder = "Select an option",
	className = "",
	...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
	options: SelectOption[];
	label?: string;
	error?: string;
	description?: string;
	placeholder?: string;
}) {
	return (
		<div className="flex flex-col gap-1">
			{label && <label className="text-sm font-medium">{label}</label>}
			<div className="relative">
				<select
					{...props}
					className={cn(
						// Base styles matching Input component exactly
						"px-3 py-2.5 bg-background text-foreground border border-input rounded-md transition-all appearance-none",
						// Focus states matching Input
						"focus:outline-none focus:ring-2 ring-ring focus:ring-offset-1 ring-offset-background focus:border-primary",
						// Disabled states
						"disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground",
						// Error states
						error && "border-destructive focus:ring-destructive focus:ring-opacity-40",
						// Custom select arrow
						"pr-8",
						className
					)}
				>
					{placeholder && (
						<option value="" disabled>
							{placeholder}
						</option>
					)}
					{options.map((option) => (
						<option key={option.value} value={option.value} disabled={option.isDisabled}>
							{option.label}
						</option>
					))}
				</select>
				<div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
					<span className="text-muted-foreground text-xs">▼</span>
				</div>
			</div>
			{description && <p className="text-xs text-muted-foreground">{description}</p>}
			{error && <p className="text-xs text-destructive">{error}</p>}
		</div>
	);
}
