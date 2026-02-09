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
		"bg-primary border border-white/40 text-primary-foreground shadow-none hover:bg-primary-hover active:bg-primary-active active:translate-y-[1px]",
	secondary:
		"bg-secondary border border-white/40 text-secondary-foreground shadow-[0_1px_0_rgba(0,0,0,0.1)] hover:bg-secondary/90 active:bg-secondary/80 active:shadow-none active:translate-y-[1px]",
	outline:
		"border border-border/60 bg-background text-foreground shadow-[0_1px_0_rgba(0,0,0,0.05)] hover:bg-accent hover:text-foreground active:bg-accent/90 active:shadow-none active:translate-y-[1px]",
	ghost:
		"text-muted-foreground border border-transparent hover:bg-accent hover:text-foreground active:bg-accent/90",
	error:
		"bg-destructive border border-white/15 text-destructive-foreground shadow-[0_1px_0_rgba(0,0,0,0.1)] hover:bg-destructive/90 active:bg-destructive/80 active:shadow-none active:translate-y-[1px]",
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
		"transition-all duration-75 ease-out",
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
