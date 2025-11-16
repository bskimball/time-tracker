"use client";

import React from "react";
import { Button as AriaButton, type ButtonProps as AriaButtonProps } from "react-aria-components";
import { cn } from "~/lib/cn";

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
		"bg-primary text-primary-foreground hover:bg-primary-hover active:bg-primary-active aria-disabled:bg-muted aria-disabled:cursor-not-allowed",
	secondary:
		"bg-secondary text-secondary-foreground hover:bg-secondary/80 active:bg-secondary/70 aria-disabled:bg-muted aria-disabled:cursor-not-allowed",
	outline:
		"border border-border bg-background text-foreground hover:bg-accent active:bg-accent/80 aria-disabled:border-muted aria-disabled:text-muted-foreground aria-disabled:cursor-not-allowed",
	ghost:
		"text-muted-foreground hover:bg-accent active:bg-accent/80 hover:text-foreground aria-disabled:text-muted-foreground aria-disabled:cursor-not-allowed",
	error:
		"bg-destructive text-destructive-foreground hover:bg-destructive/90 active:bg-destructive/80 aria-disabled:bg-muted aria-disabled:cursor-not-allowed",
};

const sizeStyles: Record<ButtonSize, string> = {
	xs: "px-2 py-1 text-xs",
	sm: "px-3 py-1.5 text-sm",
	md: "px-4 py-2 text-base",
	lg: "px-6 py-3 text-lg",
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
		"inline-flex items-center justify-center font-medium transition-all focus:outline-none focus:ring-2 ring-ring focus:ring-offset-2 ring-offset-background",
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
