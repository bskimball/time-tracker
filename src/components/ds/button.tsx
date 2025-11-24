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
		"bg-primary border border-primary text-primary-foreground hover:bg-primary-hover active:bg-primary-active aria-disabled:bg-muted aria-disabled:cursor-not-allowed",
	secondary:
		"bg-secondary border border-secondary text-secondary-foreground hover:bg-secondary/80 active:bg-secondary/70 aria-disabled:bg-muted aria-disabled:cursor-not-allowed",
	outline:
		"border border-border bg-background text-foreground hover:bg-accent active:bg-accent/80 aria-disabled:border-muted aria-disabled:text-muted-foreground aria-disabled:cursor-not-allowed",
	ghost:
		"text-muted-foreground border border-transparent hover:bg-accent active:bg-accent/80 hover:text-foreground aria-disabled:text-muted-foreground aria-disabled:cursor-not-allowed",
	error:
		"bg-destructive border border-destructive text-destructive-foreground hover:bg-destructive/90 active:bg-destructive/80 aria-disabled:bg-muted aria-disabled:cursor-not-allowed",
};

const sizeStyles: Record<ButtonSize, string> = {
	xs: "h-8 px-2 text-xs",
	sm: "h-9 px-3 text-sm",
	md: "h-10 px-4 text-base",
	lg: "h-12 px-6 text-lg",
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
		"inline-flex items-center justify-center font-medium rounded-sm",
		"transition-all duration-150 ease-out",
		"focus:outline-none focus:ring-2 ring-ring focus:ring-offset-2 ring-offset-background",
		"active:scale-[0.98]",
		"font-heading tracking-tight",
		variant === "primary" ? "shadow-sm" : "",
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
