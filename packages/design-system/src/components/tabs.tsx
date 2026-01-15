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
			"inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
			className
		)}
		{...props}
	/>
);

const TabsTrigger = ({ className, ...props }: React.ComponentProps<typeof Tab>) => (
	<Tab
		className={cn(
			"inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[selected]:bg-background data-[selected]:text-foreground data-[selected]:shadow-sm",
			className
		)}
		{...props}
	/>
);

const TabsContent = ({ className, ...props }: React.ComponentProps<typeof TabPanel>) => (
	<TabPanel
		className={cn(
			"mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
			className
		)}
		{...props}
	/>
);

export { TabsRoot as Tabs, TabsList as TabList, TabsTrigger as Tab, TabsContent as TabPanel };
