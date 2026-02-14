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
import { cn } from "../utils/cn";

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
	// Prefer controlled value when provided; used for label lookup only
	const selectedValue = value ?? defaultValue ?? null;

	// React Aria Select now uses value/defaultValue/onChange instead of selectedKey/onSelectionChange
	const handleSelectionChange = (key: React.Key | null) => {
		// Normalize possible array of keys to a single string value for our simpler API
		const sanitizedValue = key != null ? key.toString() : "";
		onChange?.(sanitizedValue);
	};

	return (
		<AriaSelect
			{...props} // `name` and other AriaSelect props flow through
			selectedKey={value}
			defaultSelectedKey={value === undefined ? defaultValue : undefined}
			onSelectionChange={handleSelectionChange}
			isDisabled={isDisabled}
			className={cn("flex flex-col gap-1.5", containerClassName)}
		>
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
			<Button
				className={cn(
					// Reset button defaults to match input
					"appearance-none font-normal cursor-default",
					// Base styles matching Input component exactly
					"h-10 px-3 bg-input-background text-foreground border border-input rounded-[2px] transition-all duration-100",
					// Focus states matching Input
					"focus:outline-none focus:border-primary focus:bg-input-background focus:ring-1 focus:ring-primary",
					// Hover state - slight darkening or border change could go here
					"hover:border-input/80",
					// Pressed state
					"pressed:bg-background pressed:border-primary",
					// Disabled states
					"disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground disabled:border-transparent",
					// Error states
					error && "border-destructive focus:border-destructive focus:ring-destructive",
					// Select button specific styling
					"flex items-center justify-between text-left w-full font-mono text-sm",
					"placeholder:text-muted-foreground/50",
					selectClassName,
					className
				)}
			>
				<span>
					{selectedValue == null || selectedValue === ""
						? placeholder
						: options.find((opt) => opt.value === selectedValue)?.label}
				</span>
				<span className="text-muted-foreground text-[10px] font-mono">▼</span>
			</Button>
			<Popover className="max-h-60 overflow-auto rounded-[2px] bg-input-background text-foreground border border-input shadow-industrial min-w-[var(--trigger-width)]">
				<ListBox className="p-1 bg-input-background text-foreground w-full outline-none">
					{options.map((option) => (
						<ListBoxItem
							key={option.value}
							id={option.value}
							className={cn(
								"px-3 py-2 rounded-[1px] cursor-default transition-colors duration-75 outline-none font-mono text-sm",
								"hover:bg-muted focus:bg-muted focus:text-foreground",
								"selected:bg-primary/20 selected:text-primary selected:font-medium",
								option.isDisabled && "opacity-50 cursor-not-allowed"
							)}
							isDisabled={option.isDisabled}
						>
							{option.label}
						</ListBoxItem>
					))}
				</ListBox>
			</Popover>
			{description && <p className="text-xs text-muted-foreground font-mono">{description}</p>}
			{error && (
				<FieldError className={cn("text-xs text-destructive font-mono font-medium", errorClassName)}>
					{error}
				</FieldError>
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
	"children" | "selectedKey" | "defaultSelectedKey" | "onSelectionChange" | "onChange"
>) {
	const isControlled = value !== undefined;
	const selectedKey = isControlled ? value : undefined;

	const handleSelectionChange = (key: React.Key | null) => {
		onChange?.(key != null ? key.toString() : null);
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
			{label && (
				<AriaLabel className="text-xs font-industrial uppercase tracking-wider text-muted-foreground">
					{label}
				</AriaLabel>
			)}
			<Button
				className={cn(
					// Base styles matching Input component exactly
					"h-10 px-3 bg-input-background text-foreground border border-input rounded-[2px] transition-all duration-100",
					// Focus states matching Input
					"focus:outline-none focus:border-primary focus:bg-input-background focus:ring-1 focus:ring-primary",
					// Disabled states
					"disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground disabled:border-transparent",
					// Error states
					error && "border-destructive focus:border-destructive focus:ring-destructive",
					// Select button specific styling
					"flex items-center justify-between text-left w-full appearance-none pr-8 font-mono text-sm",
					"placeholder:text-muted-foreground/50",
					className
				)}
			>
				<span>{selectedLabel}</span>
				<span className="text-muted-foreground text-[10px] font-mono">▼</span>
			</Button>
			<Popover className="max-h-60 overflow-auto rounded-[2px] bg-input-background text-foreground border border-input shadow-industrial min-w-[var(--trigger-width)]">
				<ListBox className="p-1 bg-input-background text-foreground w-full outline-none">
					{options.map((option) => (
						<ListBoxItem
							key={option.value}
							id={option.value}
							isDisabled={option.isDisabled}
							className={cn(
								"px-3 py-2 rounded-[1px] cursor-default transition-colors duration-75 outline-none font-mono text-sm",
								"hover:bg-muted focus:bg-muted focus:text-foreground",
								"selected:bg-primary/20 selected:text-primary selected:font-medium",
								option.isDisabled && "opacity-50 cursor-not-allowed"
							)}
						>
							{option.label}
						</ListBoxItem>
					))}
				</ListBox>
			</Popover>
			{description && <p className="text-xs text-muted-foreground font-mono">{description}</p>}
			{error && <p className="text-xs text-destructive font-mono font-medium">{error}</p>}
		</AriaSelect>
	);
}
