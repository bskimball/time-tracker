"use client";

import React from "react";
import { cn } from "~/lib/cn";

interface TabsProps {
	children: React.ReactNode;
	className?: string;
}

interface TabListProps {
	children: React.ReactNode;
	className?: string;
}

interface TabProps {
	children: React.ReactNode;
	isActive: boolean;
	onClick: () => void;
	className?: string;
}

interface TabPanelProps {
	children: React.ReactNode;
	isActive: boolean;
	className?: string;
}

/**
 * Tabs container component
 */
export function Tabs({ children, className = "" }: TabsProps) {
	return <div className={cn("w-full", className)}>{children}</div>;
}

/**
 * Tab list component - contains Tab buttons
 */
export function TabList({ children, className = "" }: TabListProps) {
	return (
		<div className={cn("flex gap-1 border-b border-border", className)} role="tablist">
			{children}
		</div>
	);
}

/**
 * Individual Tab button component
 */
export function Tab({ children, isActive, onClick, className = "" }: TabProps) {
	return (
		<button
			type="button"
			role="tab"
			aria-selected={isActive}
			onClick={onClick}
			className={cn(
				"relative px-4 py-2.5 font-medium text-sm transition-all rounded-t-md",
				"focus:outline-none focus:ring-2 ring-ring focus:ring-offset-1 ring-offset-background",
				"after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:transition-all",
				isActive
					? "text-primary after:bg-primary"
					: "text-muted-foreground hover:text-foreground hover:bg-accent/50 after:bg-transparent",
				className
			)}
		>
			{children}
		</button>
	);
}

/**
 * Tab panel component - contains content for a tab
 */
export function TabPanel({ children, isActive, className = "" }: TabPanelProps) {
	if (!isActive) return null;

	return (
		<div role="tabpanel" className={cn("py-6 px-1", className)}>
			{children}
		</div>
	);
}
