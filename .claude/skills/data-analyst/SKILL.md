---
name: ai-data-analyst
description: Perform comprehensive data analysis and build data visualizations using TypeScript and Recharts. Use when you need to analyze datasets, perform statistical tests, or create interactive charts and dashboards within the application.
---

# Skill: AI data analyst

## Purpose

Perform comprehensive data analysis, statistical modeling, and data visualization using TypeScript. Leverage the existing application stack (React, Recharts, Node.js) to build interactive data experiences and reproducible analysis workflows.

## When to use this skill

- You need to **analyze datasets** to understand patterns, trends, or relationships.
- You want to **build interactive charts** using Recharts.
- You need to **perform statistical tests** or build predictive models.
- You're doing **exploratory data analysis** (EDA) to understand data structure.
- You need to **clean, transform, or merge** datasets for application use.
- You want to **integrate analysis** directly into the application (e.g., dashboards).

## Key capabilities

- **Full TypeScript ecosystem**: Type-safe data manipulation and analysis.
- **Recharts Integration**: Build professional, interactive charts using the installed Recharts library.
- **Server-Side Processing**: Perform heavy analysis on the server (Node.js/Hono) to keep the client light.
- **Reproducible**: Code-based analysis that can be version controlled and integrated into the app.
- **Customizable**: Extend with any npm package or custom logic.

## Inputs

- **Data sources**: Database (Prisma), CSV files, JSON, or external APIs.
- **Analysis goals**: Questions to answer or metrics to visualize.
- **Variables of interest**: Specific columns, metrics, or dimensions.
- **Output preferences**: Recharts components, JSON data structures, or statistical reports.
- **Context**: Business domain and existing application architecture.

## Out of scope

- Real-time streaming data analysis (unless using specific streaming libraries).
- Extremely large datasets requiring distributed computing (Spark/Dask).
- Generating static image files for charts (prefer interactive Recharts components).

## Conventions and best practices

### TypeScript environment

- Use **strict typing** for data structures (interfaces/types for data rows).
- Use **functional programming** patterns (map, filter, reduce) for data transformation.
- Document complex logic with comments.

### Code structure

- **Separate concerns**:
  - **Data Fetching**: Server actions or API endpoints (Hono).
  - **Data Processing**: Pure functions to clean/transform data.
  - **Visualization**: Recharts components receiving processed data.
- **Type Safety**: Define Zod schemas or TypeScript interfaces for API responses.

### Data handling

- **Validate data**: Use Zod to validate incoming data structure.
- **Handle missing values**: Decide whether to filter, zero-fill, or interpolate.
- **Optimize for frontend**: Aggregate data on the server to reduce payload size.

### Visualization best practices (Recharts)

- **Responsive**: Use `<ResponsiveContainer>` wrapper.
- **Accessible**: Add tooltips, legends, and proper labeling.
- **Consistent**: Use design system colors and tokens.
- **Performance**: Avoid heavy calculations in the render loop; memoize data.

### Statistical analysis

- **State assumptions** clearly in comments or documentation.
- **Use appropriate libraries**: `simple-statistics` for basic tests, `danfojs-node` for dataframe operations if needed.

## Required behavior

1. **Understand the goal**: What question is being answered or what metric is being shown?
2. **Explore/Query data**: Fetch data from the source (Prisma/File).
3. **Process data**: Clean, aggregate, and format data for Recharts (usually array of objects).
4. **Analyze**: Run statistical tests if needed.
5. **Visualize**: Create or update Recharts components.
6. **Verify**: Ensure data matches expectations and charts render correctly.

## Required artifacts

- **Data Processing Code**: TypeScript functions to transform raw data.
- **Visualization Components**: React components using Recharts.
- **Analysis Report** (if applicable): Markdown summary of findings.
- **Types/Schemas**: TypeScript definitions for data structures.

## Implementation checklist

### 1. Data Preparation

- [ ] Define TypeScript interfaces for raw and processed data
- [ ] Fetch data from source (Prisma, CSV, etc.)
- [ ] Clean data (handle nulls, format dates)
- [ ] Aggregate/Group data if necessary
- [ ] Validate data shape using Zod

### 2. Analysis (Optional)

- [ ] Calculate summary statistics (mean, total, growth rates)
- [ ] Perform statistical tests if comparing groups
- [ ] Identify trends or outliers

### 3. Visualization (Recharts)

- [ ] Choose appropriate chart type (Line, Bar, Pie, Area)
- [ ] Map processed data to Recharts format (`{ name: string, value: number }[]`)
- [ ] Implement `<ResponsiveContainer>`
- [ ] Add `<Tooltip>`, `<Legend>`, `<XAxis>`, `<YAxis>`
- [ ] Style with Tailwind classes and theme colors

### 4. Integration

- [ ] Connect data fetching to the component (Loader/Suspense)
- [ ] Handle loading and error states
- [ ] Verify responsiveness and interactivity

## Common analysis patterns

### Data Preparation for Recharts

```typescript
import { startOfMonth, format } from "date-fns";

interface RawTransaction {
	id: string;
	amount: number;
	date: Date;
	category: string;
}

interface MonthlyExpense {
	month: string;
	amount: number;
}

// Group by month and sum amounts
export function processMonthlyExpenses(transactions: RawTransaction[]): MonthlyExpense[] {
	const expensesByMonth = transactions.reduce(
		(acc, t) => {
			const monthKey = format(startOfMonth(t.date), "MMM yyyy");
			acc[monthKey] = (acc[monthKey] || 0) + t.amount;
			return acc;
		},
		{} as Record<string, number>
	);

	return Object.entries(expensesByMonth).map(([month, amount]) => ({
		month,
		amount,
	}));
}
```

### Recharts Component Example

```tsx
import React from "react";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from "recharts";

interface DataPoint {
	name: string;
	uv: number;
	pv: number;
	amt: number;
}

export function SimpleBarChart({ data }: { data: DataPoint[] }) {
	return (
		<div className="h-[400px] w-full">
			<ResponsiveContainer width="100%" height="100%">
				<BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis dataKey="name" />
					<YAxis />
					<Tooltip />
					<Legend />
					<Bar dataKey="pv" fill="#8884d8" />
					<Bar dataKey="uv" fill="#82ca9d" />
				</BarChart>
			</ResponsiveContainer>
		</div>
	);
}
```

### Statistical Utility (Simple)

```typescript
import * as ss from "simple-statistics";

export function calculateGrowthStats(current: number[], previous: number[]) {
	const currentMean = ss.mean(current);
	const previousMean = ss.mean(previous);

	const growth = ((currentMean - previousMean) / previousMean) * 100;
	const isSignificant = ss.tTestTwoSample(current, previous) < 0.05;

	return {
		growthPercent: growth.toFixed(2),
		currentMean,
		isSignificant,
	};
}
```

## Recommended libraries

### Visualization

- **recharts**: Primary charting library for React.
- **lucide-react**: Icons for dashboards.

### Data manipulation

- **date-fns**: Date formatting and manipulation.
- **lodash**: Utility functions (optional).
- **danfojs-node**: Advanced dataframe operations (if needed).

### Statistical analysis

- **simple-statistics**: Lightweight statistical methods.

### Validation

- **zod**: Schema validation.
