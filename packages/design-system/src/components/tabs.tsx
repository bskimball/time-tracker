"use client";

import React from "react";
import { Tab, TabList, TabPanel, Tabs } from "react-aria-components";
import { cn } from "../utils/cn";

const TabsRoot = ({ className, ...props }: React.ComponentProps<typeof Tabs>) => (
	<Tabs className={cn("group", className)} {...props} />
);

const TabsList = ({ className, ...props }: React.ComponentProps<typeof TabList>) => (
	<TabList
		className={cn(
			"inline-flex items-center gap-1",
			className
		)}
		{...props}
	/>
);

const TabsTrigger = ({ className, ...props }: React.ComponentProps<typeof Tab>) => (
	<Tab
		className={(values) => cn(
			"inline-flex items-center justify-center whitespace-nowrap rounded-[2px] px-4 py-2 text-xs font-medium transition-all duration-200 ring-offset-background",
			"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-1",
			"disabled:pointer-events-none disabled:opacity-50",
			"font-industrial uppercase tracking-wide cursor-pointer border border-transparent",
			values.isSelected 
				? "bg-primary text-primary-foreground shadow-sm" 
				: "text-muted-foreground hover:bg-muted/30 hover:text-foreground",
			typeof className === "function" ? className(values) : className
		)}
		{...props}
	/>
);

const TabsContent = ({ className, ...props }: React.ComponentProps<typeof TabPanel>) => (
	<TabPanel
		className={cn(
			"mt-4 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
			className
		)}
		{...props}
	/>
);

export { TabsRoot as Tabs, TabsList as TabList, TabsTrigger as Tab, TabsContent as TabPanel };
