"use client";

import React, { createContext, useContext, useMemo } from "react";
import {
	Tabs as AriaTabs,
	TabList as AriaTabList,
	Tab as AriaTab,
	TabPanel as AriaTabPanel,
	type TabsProps as AriaTabsProps,
	type TabListProps as AriaTabListProps,
	type TabProps as AriaTabProps,
	type TabPanelProps as AriaTabPanelProps,
} from "react-aria-components";
import { cn } from "~/lib/cn";

type TabVariant = "underline" | "pill";
type TabSize = "sm" | "md";

interface TabsContextValue {
	variant: TabVariant;
	size: TabSize;
}

const TabsContext = createContext<TabsContextValue>({ variant: "underline", size: "md" });

function useTabsContext() {
	return useContext(TabsContext);
}

type TabsProps = Omit<AriaTabsProps, "className"> & {
	children: React.ReactNode;
	className?: string;
	variant?: TabVariant;
	size?: TabSize;
};

export function Tabs({
	children,
	className,
	variant = "underline",
	size = "md",
	...props
}: TabsProps) {
	const contextValue = useMemo(() => ({ variant, size }), [variant, size]);
	return (
		<TabsContext.Provider value={contextValue}>
			<AriaTabs {...props} className={cn("w-full", className)}>
				{children}
			</AriaTabs>
		</TabsContext.Provider>
	);
}

type TabListProps = Omit<AriaTabListProps<object>, "className"> & {
	children: React.ReactNode;
	className?: string;
};

export function TabList({ children, className, ...props }: TabListProps) {
	const { variant } = useTabsContext();
	return (
		<AriaTabList
			{...props}
			className={cn(
				"flex flex-wrap gap-1",
				variant === "underline" ? "border-b border-border" : "bg-muted/40 rounded-lg p-1",
				className
			)}
		>
			{children}
		</AriaTabList>
	);
}

type TabProps = Omit<AriaTabProps, "className"> & {
	children: React.ReactNode;
	className?: string;
};

const tabSizeStyles: Record<TabSize, string> = {
	sm: "text-sm px-3 py-2",
	md: "text-sm px-4 py-2.5",
};

const variantStyles: Record<TabVariant, string> = {
	underline:
		"rounded-t-md border-b-2 border-transparent data-[hovered=true]:text-foreground data-[selected=true]:text-primary data-[selected=true]:border-primary transition-all",
	pill: "rounded-md data-[hovered=true]:bg-background/80 data-[selected=true]:bg-primary data-[selected=true]:text-primary-foreground data-[selected=true]:shadow-sm transition-all",
};

export function Tab({ children, className, ...props }: TabProps) {
	const { variant, size } = useTabsContext();
	return (
		<AriaTab
			{...props}
			className={cn(
				"relative font-medium text-muted-foreground transition-all duration-200 ease-in-out focus:outline-none focus-visible:ring-2 ring-ring ring-offset-2 ring-offset-background data-[disabled=true]:opacity-60 data-[disabled=true]:cursor-not-allowed",
				tabSizeStyles[size],
				variantStyles[variant],
				className
			)}
		>
			{children}
		</AriaTab>
	);
}

type TabPanelProps = Omit<AriaTabPanelProps, "className"> & {
	children: React.ReactNode;
	className?: string;
};

export function TabPanel({ children, className, ...props }: TabPanelProps) {
	return (
		<AriaTabPanel
			{...props}
			className={cn(
				"pt-6 focus:outline-none focus-visible:ring-2 ring-ring ring-offset-2 ring-offset-background",
				className
			)}
		>
			{children}
		</AriaTabPanel>
	);
}
