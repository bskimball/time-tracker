"use client";

import React from "react";
import { Tab, TabList, TabPanel, Tabs } from "react-aria-components";
import { cn } from "../utils/cn";

const TabsRoot = ({ className, ...props }: React.ComponentProps<typeof Tabs>) => (
	<Tabs className={cn("", className)} {...props} />
);

const TabsList = ({ className, ...props }: React.ComponentProps<typeof TabList>) => (
	<TabList
		className={cn(
			"inline-flex h-9 items-center justify-center rounded-[2px] bg-muted/50 p-1 text-muted-foreground border border-border/50",
			className
		)}
		{...props}
	/>
);

const TabsTrigger = ({ className, ...props }: React.ComponentProps<typeof Tab>) => (
	<Tab
		className={cn(
			"inline-flex items-center justify-center whitespace-nowrap rounded-[1px] px-3 py-1 text-sm font-medium transition-all",
			"focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-1 ring-offset-background",
			"disabled:pointer-events-none disabled:opacity-50",
			"data-[selected]:bg-background data-[selected]:text-foreground data-[selected]:shadow-sm data-[selected]:border data-[selected]:border-border/50",
			"font-industrial uppercase tracking-wide text-xs",
			className
		)}
		{...props}
	/>
);

const TabsContent = ({ className, ...props }: React.ComponentProps<typeof TabPanel>) => (
	<TabPanel
		className={cn(
			"mt-4 ring-offset-background focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-2",
			className
		)}
		{...props}
	/>
);

export { TabsRoot as Tabs, TabsList as TabList, TabsTrigger as Tab, TabsContent as TabPanel };

