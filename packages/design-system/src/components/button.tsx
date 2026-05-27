"use client";

import React from "react";
import { Button as AriaButton, type ButtonProps as AriaButtonProps } from "react-aria-components";
import { cn } from "../utils/cn";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "error";
type ButtonSize = "xs" | "sm" | "md" | "lg";

interface ButtonProps extends Omit<AriaButtonProps, "className" | "isDisabled"> {
	children: React.ReactNode;
	variant?: ButtonVariant;
	size?: ButtonSize;
	className?: string;
	type?: React.ButtonHTMLAttributes<HTMLButtonElement>["type"];
	disabled?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
	primary:
		"bg-primary shadow-[var(--shadow-border)] text-primary-foreground hover:bg-primary-hover hover:shadow-[var(--shadow-border-hover)] active:bg-primary-active active:shadow-none active:scale-[0.96]",
	secondary:
		"bg-secondary shadow-[var(--shadow-border)] text-secondary-foreground hover:bg-secondary/90 hover:shadow-[var(--shadow-border-hover)] active:bg-secondary/80 active:shadow-none active:scale-[0.96]",
	outline:
		"bg-background shadow-[var(--shadow-border)] text-foreground hover:bg-accent hover:text-foreground hover:shadow-[var(--shadow-border-hover)] active:bg-accent/90 active:shadow-none active:scale-[0.96]",
	ghost:
		"text-foreground/72 dark:text-muted-foreground hover:bg-accent hover:text-foreground active:bg-accent/90 active:scale-[0.96]",
	error:
		"bg-destructive shadow-[var(--shadow-border)] text-destructive-foreground hover:bg-destructive/90 hover:shadow-[var(--shadow-border-hover)] active:bg-destructive/80 active:shadow-none active:scale-[0.96]",
};

const sizeStyles: Record<ButtonSize, string> = {
	xs: "h-7 px-2 text-xs uppercase tracking-wider",
	sm: "h-8 px-3 text-xs uppercase tracking-wider",
	md: "h-10 px-4 text-sm uppercase tracking-widest",
	lg: "h-12 px-6 text-base uppercase tracking-widest",
};

export function Button({
	children,
	variant = "primary",
	size = "md",
	className = "",
	type = "button",
	disabled = false,
	...props
}: ButtonProps) {
	const buttonClass = cn(
		"relative overflow-hidden inline-flex items-center justify-center font-bold rounded-[2px]",
		"transition duration-75 ease-out",
		"focus:outline-none focus-visible:ring-2 ring-ring focus-visible:ring-offset-2 ring-offset-background",
		"disabled:opacity-50 disabled:pointer-events-none disabled:shadow-none disabled:translate-y-0",
		"font-industrial antialiased",
		variantStyles[variant],
		sizeStyles[size],
		className
	);

	return (
		<AriaButton type={type} isDisabled={disabled} className={buttonClass} {...props}>
			{children}
		</AriaButton>
	);
}
