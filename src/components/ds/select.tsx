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

type BaseAriaSelectProps = Omit<
	React.ComponentProps<typeof AriaSelect>,
	// We control these via our own API
	"children" | "defaultSelectedKey" | "selectedKey" | "onSelectionChange" | "onChange"
>;

interface SelectProps extends BaseAriaSelectProps {
	options: SelectOption[];
	label?: string;
	error?: string;
	description?: string;
	placeholder?: string;
	defaultValue?: string;
	value?: string;
	onChange?: React.Dispatch<React.SetStateAction<string>> | ((value: string) => void);
	isDisabled?: boolean;
	containerClassName?: string;
	labelClassName?: string;
	selectClassName?: string;
	errorClassName?: string;
	className?: string;
	// no need to add `name` explicitly; it comes from BaseAriaSelectProps
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
	// NOTE: don't destructure and drop name; keep it in ...props
	...props
}: SelectProps) {
	// Prefer controlled value when provided; used for label lookup only
	const selectedValue = value ?? defaultValue ?? null;

	// React Aria Select now uses value/defaultValue/onChange instead of selectedKey/onSelectionChange
	const handleSelectionChange = (key: React.Key | React.Key[] | null) => {
		// Normalize possible array of keys to a single string value for our simpler API
		const normalizedKey = Array.isArray(key) ? (key[0] ?? null) : key;
		const sanitizedValue = normalizedKey != null ? normalizedKey.toString() : "";
		onChange?.(sanitizedValue);
	};

	return (
		<AriaSelect
			{...props} // `name` and other AriaSelect props flow through
			value={value}
			defaultValue={value === undefined ? defaultValue : undefined}
			onChange={handleSelectionChange}
			isDisabled={isDisabled}
			className={cn("flex flex-col gap-1", containerClassName)}
		>
			{label && (
				<AriaLabel className={cn("text-sm font-heading", labelClassName)}>{label}</AriaLabel>
			)}
			<Button
				className={cn(
					// Reset button defaults to match input
					"appearance-none font-normal cursor-default",
					// Base styles matching Input component exactly
					"h-10 px-3 py-2 bg-background text-foreground border border-input rounded-sm transition-all duration-150",
					// Focus states matching Input
					"focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:border-primary",
					// Hover state - keep same as default
					"hover:bg-background",
					// Pressed state - keep same as default
					"pressed:bg-background",
					// Disabled states
					"disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground",
					// Error states
					error && "border-destructive focus:ring-destructive",
					// Select button specific styling
					"flex items-center justify-between text-left w-full",
					"placeholder:text-muted-foreground/60",
					selectClassName,
					className
				)}
			>
				<span>
					{selectedValue == null || selectedValue === ""
						? placeholder
						: options.find((opt) => opt.value === selectedValue)?.label}
				</span>
				<span className="text-muted-foreground text-xs font-mono">▼</span>
			</Button>
			<Popover className="max-h-60 overflow-auto rounded-sm bg-background">
				<ListBox className="p-1 bg-background border border-input rounded-sm text-foreground w-full shadow-lg">
					{options.map((option) => (
						<ListBoxItem
							key={option.value}
							id={option.value}
							className={cn(
								"px-3 py-2 rounded-sm cursor-default transition-colors duration-150",
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

// Simpler select component built with React Aria Components
// Smaller API surface but same visual styling as Select
export function SimpleSelect({
	options,
	label,
	error,
	description,
	placeholder = "Select an option",
	className = "",
	value,
	defaultValue,
	onChange,
	...props
}: {
	options: SelectOption[];
	label?: string;
	error?: string;
	description?: string;
	placeholder?: string;
	className?: string;
	value?: string;
	defaultValue?: string;
	onChange?: (value: string | null) => void;
} & Omit<
	React.ComponentProps<typeof AriaSelect>,
	"children" | "selectedKey" | "defaultSelectedKey" | "onSelectionChange"
>) {
	const isControlled = value !== undefined;
	const selectedKey = isControlled ? value : undefined;

	const handleSelectionChange = (key: React.Key | null) => {
		onChange?.(key?.toString() ?? null);
	};

	const selectedLabel =
		selectedKey != null
			? (options.find((opt) => opt.value === selectedKey)?.label ?? placeholder)
			: placeholder;

	return (
		<AriaSelect
			{...props}
			selectedKey={isControlled ? selectedKey : undefined}
			defaultSelectedKey={!isControlled ? defaultValue : undefined}
			onSelectionChange={handleSelectionChange}
			className="flex flex-col gap-1.5"
		>
			{label && <AriaLabel className="text-sm font-heading">{label}</AriaLabel>}
			<Button
				className={cn(
					// Base styles matching Input component exactly
					"h-10 px-3 py-2 bg-background text-foreground border border-input rounded-sm transition-all duration-150",
					// Focus states matching Input
					"focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:border-primary",
					// Disabled states
					"disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground",
					// Error states
					error && "border-destructive focus:ring-destructive",
					// Select button specific styling
					"flex items-center justify-between text-left w-full appearance-none pr-8",
					"placeholder:text-muted-foreground/60",
					className
				)}
			>
				<span>{selectedLabel}</span>
				<span className="text-muted-foreground text-xs font-mono">▼</span>
			</Button>
			<Popover className="max-h-60 overflow-auto rounded-sm">
				<ListBox className="p-1 bg-background border border-input rounded-sm w-full shadow-lg">
					{options.map((option) => (
						<ListBoxItem
							key={option.value}
							id={option.value}
							isDisabled={option.isDisabled}
							className={cn(
								"px-3 py-2 rounded-sm cursor-default transition-colors duration-150",
								"hover:bg-muted focus:bg-muted",
								"focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 focus:ring-offset-background",
								option.isDisabled && "opacity-50 cursor-not-allowed"
							)}
						>
							{option.label}
						</ListBoxItem>
					))}
				</ListBox>
			</Popover>
			{description && <p className="text-xs text-muted-foreground">{description}</p>}
			{error && <p className="text-xs text-destructive">{error}</p>}
		</AriaSelect>
	);
}
