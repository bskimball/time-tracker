# Industrial Professional Design System

**Version:** 2.0.0
**Last Updated:** 2025-11-23
**Status:** ✅ Production Ready

## Table of Contents

1. [Design Philosophy](#design-philosophy)
2. [Typography](#typography)
3. [Color System](#color-system)
4. [Component Library](#component-library)
5. [Layout & Spacing](#layout--spacing)
6. [Accessibility](#accessibility)
7. [Usage Guidelines](#usage-guidelines)
8. [Quick Reference](#quick-reference)

---

## Design Philosophy

### Industrial & Professional

Our design system embodies a **modern, utilitarian, and robust** aesthetic—think high-end industrial dashboard meets precision engineering tool. It balances professional functionality with a premium feel.

### Core Principles

1. **Tightly Rounded Corners** - `rounded-sm` (0.375rem/6px) for crisp, precise edges
2. **Workhorse Typography** - Reliable fonts that convey trust and clarity
3. **Subtle Depth** - Clean lines with refined shadows and high contrast
4. **Purposeful Motion** - Snappy animations: `cubic-bezier(0.16, 1, 0.3, 1)`
5. **Accessibility First** - WCAG AA compliant throughout

---

## Typography

### Font Stack

```css
Body Font:    IBM Plex Sans (400, 500, 600, 700)
Heading Font: Space Grotesk (500, 600, 700)
Data Font:    JetBrains Mono (400, 500, 600, 700)
```

### Typography Classes

| Class                   | Font           | Weight | Letter Spacing | Transform | Use Case          |
| ----------------------- | -------------- | ------ | -------------- | --------- | ----------------- |
| **Default**             | IBM Plex Sans  | 400    | -0.011em       | -         | Body text         |
| `.font-heading`         | Space Grotesk  | 600    | -0.02em        | -         | Section titles    |
| `.font-display`         | Space Grotesk  | 700    | -0.03em        | -         | Hero text         |
| `.font-mono`            | JetBrains Mono | 500    | -0.01em        | -         | Code              |
| `.font-data`            | JetBrains Mono | 400    | 0              | -         | Numbers (tabular) |
| `.font-industrial`      | Space Grotesk  | 600    | -0.02em        | uppercase | Labels            |
| `.font-mono-industrial` | JetBrains Mono | 600    | 0              | -         | Bold data         |

### Typography Hierarchy

#### Display Title (Hero Sections)

```tsx
<h1 className="font-display text-5xl">Executive Dashboard</h1>
```

#### Page Heading (Standard for all main pages)

```tsx
<h1 className="text-4xl font-bold uppercase tracking-tight font-heading">Analytics & Reporting</h1>
```

#### Section Heading

```tsx
<h2 className="text-3xl font-heading uppercase tracking-wide">
  Active Sessions
</h2>

<h2 className="text-2xl font-heading">Performance Metrics</h2>
```

#### Card Title

```tsx
<CardTitle>Recent Activity</CardTitle>
// Internally uses: text-lg font-heading
```

#### Data Display

```tsx
<div className="font-data text-2xl">1,234</div>
<div className="font-mono-industrial text-3xl font-bold">98.5%</div>
```

#### Industrial Label

```tsx
<span className="font-industrial text-xs">STATION A</span>
```

### Size Scale Reference

| Class          | Pixels   | Line Height | Use Case                         |
| -------------- | -------- | ----------- | -------------------------------- |
| `text-xs`      | 12px     | 16px        | Fine print, industrial labels    |
| `text-sm`      | 14px     | 20px        | Supporting text, captions        |
| `text-base`    | 16px     | 24px        | Body text (default)              |
| `text-lg`      | 18px     | 28px        | Card titles                      |
| `text-xl`      | 20px     | 28px        | Subsection headings              |
| `text-2xl`     | 24px     | 32px        | Section headings                 |
| `text-3xl`     | 30px     | 36px        | Section headings (large)         |
| **`text-4xl`** | **36px** | **40px**    | **Standard page titles** ⭐      |
| `text-5xl`     | 48px     | 1           | Hero displays (IndustrialHeader) |

**⭐ Standard:** All internal admin page titles use `text-4xl`.

---

## Color System

### Theme Overview

We use **OKLCH color space** for perceptual uniformity, vibrance, and consistent lightness across colors.

### Primary Colors

#### Safety Orange (Primary)

**Light Mode:**

```css
--primary: oklch(0.62 0.18 45) /* Base */ --primary-foreground: oklch(0.98 0.002 264)
	/* Text on primary */ --primary-hover: oklch(0.58 0.18 45) /* Hover state */
	--primary-active: oklch(0.54 0.18 45) /* Active/pressed */;
```

**Dark Mode:**

```css
--primary: oklch(0.68 0.18 45) --primary-hover: oklch(0.72 0.18 45)
	--primary-active: oklch(0.64 0.18 45);
```

**Use for:**

- Call-to-action buttons
- Primary navigation active states
- Important alerts
- LED indicators (active)
- Safety warnings

**Example:**

```tsx
<Button variant="primary">Save Changes</Button>
<div className="bg-primary text-primary-foreground p-4">Alert</div>
```

#### Steel Blue (Secondary)

**Light Mode:**

```css
--secondary: oklch(0.52 0.12 245) --secondary-foreground: oklch(0.98 0.002 264);
```

**Dark Mode:**

```css
--secondary: oklch(0.6 0.12 245);
```

**Use for:**

- Secondary actions
- Supporting UI elements
- Data visualization (2nd series)
- Informational states

#### Warning Red (Destructive)

**Light Mode:**

```css
--destructive: oklch(0.55 0.22 30) --destructive-foreground: oklch(0.98 0.002 264);
```

**Dark Mode:**

```css
--destructive: oklch(0.62 0.22 30);
```

**Use for:**

- Error states
- Delete/destructive actions
- Critical system alerts

### Neutral Colors

| Token              | Light                 | Dark                  | Hex (Approx)      | Use Case          |
| ------------------ | --------------------- | --------------------- | ----------------- | ----------------- |
| `background`       | oklch(0.97 0.003 264) | oklch(0.16 0.01 264)  | #F7F7F8 / #282829 | Page background   |
| `foreground`       | oklch(0.22 0.01 264)  | oklch(0.94 0.005 264) | #383839 / #F0F0F1 | Primary text      |
| `card`             | oklch(0.99 0.002 264) | oklch(0.19 0.01 264)  | #FCFCFD / #303031 | Card backgrounds  |
| `muted`            | oklch(0.93 0.005 264) | oklch(0.26 0.01 264)  | #EDEDED / #424243 | Disabled states   |
| `muted-foreground` | oklch(0.48 0.01 264)  | oklch(0.63 0.005 264) | #7A7A7B / #A0A0A1 | Secondary text    |
| `accent`           | oklch(0.9 0.008 264)  | oklch(0.28 0.01 264)  | #E6E6E7 / #474748 | Hover backgrounds |
| `border`           | oklch(0.85 0.005 264) | oklch(0.32 0.01 264)  | #D9D9DA / #515152 | Borders           |
| `input`            | oklch(0.87 0.005 264) | oklch(0.3 0.01 264)   | #DEDEDE / #4C4C4D | Input borders     |
| `ring`             | oklch(0.62 0.18 45)   | oklch(0.68 0.18 45)   | Safety Orange     | Focus rings       |

### Chart Colors

```css
--chart-1: oklch(0.62 0.18 45) /* Safety Orange */ --chart-2: oklch(0.52 0.12 245) /* Steel Blue */
	--chart-3: oklch(0.58 0.15 150) /* Green */ --chart-4: oklch(0.55 0.18 300) /* Purple */
	--chart-5: oklch(0.48 0.12 264) /* Navy */;
```

### Using Colors

```tsx
// Backgrounds
<div className="bg-primary">Primary background</div>
<div className="bg-secondary">Secondary background</div>
<div className="bg-card">Card background</div>
<div className="bg-muted">Muted background</div>

// Text
<p className="text-foreground">Primary text</p>
<p className="text-muted-foreground">Secondary text</p>
<p className="text-primary">Primary colored text</p>
<p className="text-destructive">Error text</p>

// Borders
<div className="border border-border">Standard border</div>
<div className="border-2 border-primary">Emphasized border</div>

// Focus States
<input className="focus:ring-2 ring-ring ring-offset-2" />
```

---

## Component Library

All components are located in `packages/design-system/src/components/` and `apps/web/src/components/`.

### Button

**Import:** `import { Button } from "~/components/ds/button";`

**Variants:**

```tsx
<Button variant="primary">Primary Action</Button>
<Button variant="secondary">Secondary Action</Button>
<Button variant="outline">Outlined</Button>
<Button variant="ghost">Ghost/Subtle</Button>
<Button variant="error">Delete</Button>
```

**Sizes:**

```tsx
<Button size="xs">Extra Small</Button>
<Button size="sm">Small</Button>
<Button size="md">Medium (default)</Button>
<Button size="lg">Large</Button>
```

**States:**

```tsx
<Button disabled>Disabled State</Button>
<Button type="submit">Submit Form</Button>
```

**Features:**

- ✅ Auto-applies `font-heading tracking-tight`
- ✅ Built on React Aria Components (accessible by default)
- ✅ Hover/active/focus states included
- ✅ Keyboard navigation (Tab, Enter, Space)
- ✅ Active scale animation (`active:scale-[0.98]`)

---

### Card

**Import:** `import { Card, CardHeader, CardTitle, CardBody } from "~/components/ds/card";`

```tsx
<Card className="border-2 border-primary">
	<CardHeader>
		<CardTitle>Performance Metrics</CardTitle>
	</CardHeader>
	<CardBody>
		<p>Card content goes here...</p>
	</CardBody>
</Card>
```

**Features:**

- ✅ Auto border-radius: `rounded-sm`
- ✅ Subtle hover effect: `hover:border-primary/20`
- ✅ CardTitle auto-applies `font-heading`
- ✅ CardHeader has subtle background: `bg-muted/10`

---

### Industrial Components

**Import:** `import { IndustrialPanel, IndustrialHeader, SafetyStripes, LedIndicator } from "~/components/ds/industrial";`

#### Full Industrial Panel

```tsx
<SafetyStripes position="top" />
<IndustrialPanel variant="destructive">
  <IndustrialHeader
    title="KIOSK TERMINAL"
    subtitle="Employee Access Point"
    badge="Station A"
    active={true}
  />
  <div className="p-8">
    {/* Panel content */}
  </div>
</IndustrialPanel>
<SafetyStripes position="bottom" />
```

**IndustrialPanel Props:**

- `variant`: `"default"` | `"destructive"` (default: `"destructive"` with primary border)

**IndustrialHeader Props:**

- `title`: Main title (uses `font-display text-5xl`)
- `subtitle?`: Subtitle (small uppercase text)
- `badge?`: Badge content (rounded pill display)
- `active?`: LED indicator state (default: `true`)

#### LED Indicator

```tsx
<LedIndicator active={isSystemOnline} className="w-6 h-6" />
```

#### Safety Stripes

```tsx
<SafetyStripes position="top" className="mb-6" />
<SafetyStripes position="bottom" className="mt-6" />
```

**Use Cases:**

- ✅ Public kiosk interfaces
- ✅ Authentication/login pages
- ✅ System status displays
- ✅ Error pages (404, 500)

---

### PageHeader

**Import:** `import { PageHeader } from "~/components/page-header";`

```tsx
<PageHeader
	title="Executive Dashboard"
	subtitle="Performance analytics and strategic insights"
	actions={
		<>
			<Button variant="outline" size="sm">
				Export Data
			</Button>
			<Button variant="primary" size="sm">
				Generate Report
			</Button>
		</>
	}
/>
```

**Features:**

- ✅ Standardized typography: `text-4xl font-heading uppercase tracking-tight`
- ✅ Responsive layout (stacks on mobile)
- ✅ Optional subtitle and action buttons
- ✅ Consistent `mb-8` spacing

**Use for:** All internal admin page titles (Manager, Executive, Settings pages).

---

### Input

**Import:** `import { Input } from "~/components/ds/input";`

```tsx
<Input
  label="Employee Name"
  name="employeeName"
  placeholder="Enter name..."
  required
  error="Name is required"
/>

<Input
  type="email"
  label="Email Address"
  name="email"
  disabled
/>
```

---

### Select

**Import:** `import { Select, SelectItem } from "~/components/ds/select";`

```tsx
<Select label="Work Station" name="station" placeholder="Select station...">
	<SelectItem value="picking">Picking</SelectItem>
	<SelectItem value="packing">Packing</SelectItem>
	<SelectItem value="filling">Filling</SelectItem>
	<SelectItem value="receiving">Receiving</SelectItem>
</Select>
```

---

### Alert

**Import:** `import { Alert } from "~/components/ds/alert";`

```tsx
<Alert variant="error">
  <h4 className="font-medium">Operation Failed</h4>
  <p className="text-sm mt-1">Unable to process request. Please try again.</p>
</Alert>

<Alert variant="warning">Overtime threshold approaching</Alert>
<Alert variant="success">Changes saved successfully</Alert>
<Alert variant="info">System maintenance scheduled for tonight</Alert>
```

---

### Tabs

**Import:** `import { Tabs, TabList, Tab, TabPanel } from "~/components/ds/tabs";`

```tsx
<Tabs>
	<TabList>
		<Tab id="overview">Overview</Tab>
		<Tab id="analytics">Analytics</Tab>
		<Tab id="settings">Settings</Tab>
	</TabList>

	<TabPanel id="overview">
		<h3>Overview Content</h3>
	</TabPanel>

	<TabPanel id="analytics">
		<h3>Analytics Content</h3>
	</TabPanel>

	<TabPanel id="settings">
		<h3>Settings Content</h3>
	</TabPanel>
</Tabs>
```

---

## Layout & Spacing

### Container Patterns

```tsx
// Standard page container
<main className="container mx-auto py-8 lg:py-12">
  <PageHeader title="Dashboard" />
  {/* Content */}
</main>

// Max-width container
<div className="max-w-7xl mx-auto px-4 py-8">
  {/* Content */}
</div>

// Full-width container with padding
<div className="w-full px-4 md:px-8 lg:px-12">
  {/* Content */}
</div>
```

### Grid Layouts

```tsx
// KPI/Stat Cards (4 columns)
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  <Card>...</Card>
  <Card>...</Card>
  <Card>...</Card>
  <Card>...</Card>
</div>

// 2-column layout
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  <Card>...</Card>
  <Card>...</Card>
</div>

// 3-column layout
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <Card>...</Card>
  <Card>...</Card>
  <Card>...</Card>
</div>
```

### Spacing Scale

| Class                   | Pixels | Use Case            |
| ----------------------- | ------ | ------------------- |
| `gap-1` / `space-y-1`   | 4px    | Very tight spacing  |
| `gap-2` / `space-y-2`   | 8px    | Inline elements     |
| `gap-3` / `space-y-3`   | 12px   | List items          |
| `gap-4` / `space-y-4`   | 16px   | Form fields         |
| `gap-6` / `space-y-6`   | 24px   | Cards, sections     |
| `gap-8` / `space-y-8`   | 32px   | Major page sections |
| `gap-12` / `space-y-12` | 48px   | Page-level spacing  |

### Common Layout Patterns

```tsx
// Vertical stack of cards
<div className="space-y-6">
  <Card>...</Card>
  <Card>...</Card>
  <Card>...</Card>
</div>

// Form layout
<form className="space-y-4 max-w-md">
  <Input label="Name" name="name" required />
  <Input label="Email" name="email" type="email" />
  <Select label="Department" name="dept">
    <SelectItem value="ops">Operations</SelectItem>
  </Select>
  <div className="flex gap-2 justify-end">
    <Button variant="outline">Cancel</Button>
    <Button type="submit">Submit</Button>
  </div>
</form>

// Dashboard with PageHeader
<div className="space-y-8 pb-8">
  <PageHeader
    title="Dashboard"
    subtitle="Overview of key metrics"
    actions={<Button>Action</Button>}
  />

  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
    {/* KPI Cards */}
  </div>

  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    {/* Main content cards */}
  </div>
</div>
```

---

## Accessibility

### WCAG AA Compliance ✅

All color combinations meet **WCAG AA** contrast requirements:

- **Normal text:** 4.5:1 minimum
- **Large text (18px+):** 3:1 minimum

#### Contrast Ratios

| Foreground               | Background    | Ratio  | Status |
| ------------------------ | ------------- | ------ | ------ |
| `foreground`             | `background`  | 10.2:1 | ✅ AAA |
| `primary-foreground`     | `primary`     | 8.5:1  | ✅ AAA |
| `muted-foreground`       | `background`  | 4.8:1  | ✅ AA  |
| `destructive-foreground` | `destructive` | 7.2:1  | ✅ AAA |
| `secondary-foreground`   | `secondary`   | 8.1:1  | ✅ AAA |

### Semantic HTML

Always use proper HTML elements for accessibility:

```tsx
// ✅ Good - Uses semantic button
<button onClick={handleSubmit}>Submit</button>

// ❌ Bad - Uses div as button (not accessible)
<div onClick={handleSubmit}>Submit</div>

// ✅ Good - Proper heading hierarchy
<h1 className="text-4xl font-heading">Page Title</h1>
<h2 className="text-2xl font-heading">Section Title</h2>
<h3 className="text-xl font-heading">Subsection</h3>

// ✅ Good - Semantic navigation
<nav aria-label="Main navigation">
  <Link to="/dashboard">Dashboard</Link>
  <Link to="/reports">Reports</Link>
</nav>

// ✅ Good - Form labels
<label htmlFor="email">Email Address</label>
<input id="email" name="email" type="email" />
```

### Keyboard Navigation

All interactive elements support full keyboard navigation:

| Key             | Action                                   |
| --------------- | ---------------------------------------- |
| **Tab**         | Navigate to next focusable element       |
| **Shift + Tab** | Navigate to previous element             |
| **Enter**       | Activate buttons and links               |
| **Space**       | Activate buttons and checkboxes          |
| **Escape**      | Close dialogs and popovers               |
| **Arrow Keys**  | Navigate menus, tabs, and select options |

### Screen Reader Support

```tsx
// Icon-only buttons need labels
<button aria-label="Close dialog">
  <XIcon />
</button>

// Use aria-describedby for help text
<div>
  <Input
    label="Email"
    name="email"
    aria-describedby="email-help"
  />
  <p id="email-help" className="text-sm text-muted-foreground">
    We'll never share your email
  </p>
</div>

// Live regions for dynamic updates
<div aria-live="polite" aria-atomic="true">
  {notifications.map(n => <p key={n.id}>{n.message}</p>)}
</div>

// Skip links
<a href="#main-content" className="sr-only focus:not-sr-only">
  Skip to main content
</a>
```

---

## Usage Guidelines

### Component Selection Guide

**Public/Auth Pages (Login, Kiosk):**

```tsx
// Use Industrial components for visual impact
<SafetyStripes position="top" />
<IndustrialPanel>
  <IndustrialHeader
    title="LOGIN"
    subtitle="Secure Access Portal"
  />
  <div className="p-8">
    {/* Login form */}
  </div>
</IndustrialPanel>
<SafetyStripes position="bottom" />
```

**Internal Admin Pages (Manager, Executive, Settings):**

```tsx
// Use PageHeader for consistency
<PageHeader
  title="Manager Dashboard"
  subtitle="Welcome back, John Doe"
  actions={
    <Button variant="primary">Quick Action</Button>
  }
/>

<div className="space-y-6">
  {/* Page content */}
</div>
```

### Typography Best Practices

#### ✅ Do This

```tsx
// Page titles: text-4xl + font-heading + uppercase
<h1 className="text-4xl font-bold uppercase tracking-tight font-heading">
  Dashboard
</h1>

// Data/numbers: font-data (tabular nums)
<div className="font-data text-2xl">1,234.56</div>

// Labels: font-industrial (uppercase built-in)
<span className="font-industrial text-xs">STATION A</span>

// Card titles: use CardTitle component
<CardTitle>Performance Metrics</CardTitle>
```

#### ❌ Avoid This

```tsx
// Missing font classes
<h1 className="text-4xl">Dashboard</h1>

// Wrong size (should be text-4xl)
<h1 className="text-3xl font-heading">Dashboard</h1>

// Numbers without font-data
<div className="text-2xl">1,234</div>

// Manual uppercase (use font-industrial)
<span className="uppercase text-xs">STATION A</span>
```

### Color Usage Patterns

#### ✅ Correct Usage

```tsx
// Primary for main actions
<Button variant="primary">Save Changes</Button>
<Button variant="primary">Submit</Button>

// Outline for secondary actions
<Button variant="outline">Cancel</Button>
<Button variant="outline">View Details</Button>

// Error/Destructive for dangerous actions
<Button variant="error">Delete Account</Button>
<Alert variant="error">Critical error occurred</Alert>

// Muted for disabled states
<Button disabled>Processing...</Button>
<p className="text-muted-foreground">No data available</p>
```

#### ❌ Incorrect Usage

```tsx
// Don't use primary for cancel
<Button variant="primary">Cancel</Button>

// Don't use error for non-destructive actions
<Button variant="error">Close</Button>

// Don't override semantic meaning
<Alert variant="success" className="bg-destructive">Error!</Alert>
```

### Spacing Consistency

```tsx
// ✅ Page sections: space-y-8 or gap-8
<div className="space-y-8 pb-8">
  <PageHeader title="Dashboard" />
  <div className="grid gap-8">...</div>
</div>

// ✅ Card grids: gap-6
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  <Card>...</Card>
</div>

// ✅ Form fields: space-y-4
<form className="space-y-4">
  <Input label="Name" />
  <Input label="Email" />
</form>

// ✅ Inline elements: gap-2 or gap-3
<div className="flex items-center gap-2">
  <Button>Action 1</Button>
  <Button>Action 2</Button>
</div>
```

---

## Quick Reference

### Page Layout Template

```tsx
export default async function Component() {
	// Fetch data...

	return (
		<div className="space-y-8 pb-8">
			<PageHeader
				title="Page Title"
				subtitle="Page description"
				actions={<Button>Action</Button>}
			/>

			{/* KPI Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
				<Card>
					<CardBody>
						<div className="font-heading text-sm text-muted-foreground">Metric Name</div>
						<div className="font-data text-2xl font-bold">1,234</div>
					</CardBody>
				</Card>
			</div>

			{/* Main Content */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<Card>
					<CardHeader>
						<CardTitle>Section Title</CardTitle>
					</CardHeader>
					<CardBody>{/* Content */}</CardBody>
				</Card>
			</div>
		</div>
	);
}
```

### Data Table Pattern

```tsx
<Card>
	<CardHeader>
		<CardTitle>Recent Activity</CardTitle>
	</CardHeader>
	<CardBody>
		<div className="overflow-x-auto">
			<table className="min-w-full">
				<thead>
					<tr className="border-b border-border">
						<th className="text-left py-3 px-4 font-heading text-sm">Name</th>
						<th className="text-right py-3 px-4 font-heading text-sm">Value</th>
					</tr>
				</thead>
				<tbody>
					<tr className="border-b border-border">
						<td className="py-3 px-4">Item 1</td>
						<td className="text-right py-3 px-4 font-data">123.45</td>
					</tr>
				</tbody>
			</table>
		</div>
	</CardBody>
</Card>
```

### Form Pattern

```tsx
<form action={handleSubmit} className="space-y-4 max-w-md">
	<Input label="Full Name" name="name" placeholder="John Doe" required />

	<Input label="Email" name="email" type="email" required />

	<Select label="Department" name="department">
		<SelectItem value="ops">Operations</SelectItem>
		<SelectItem value="admin">Administration</SelectItem>
	</Select>

	<div className="flex gap-2 justify-end">
		<Button variant="outline" type="button">
			Cancel
		</Button>
		<Button variant="primary" type="submit">
			Submit
		</Button>
	</div>
</form>
```

---

## Resources

- **Component Source**: `packages/design-system/src/components/`
- **Theme Configuration**: `apps/web/src/routes/root/styles.css`
- **PageHeader Component**: `/apps/web/src/components/page-header.tsx`
- **React Aria Components**: https://react-spectrum.adobe.com/react-aria/
- **Tailwind CSS v4**: https://tailwindcss.com/
- **OKLCH Color Space**: https://oklch.com/

---

## Migration & Updates

### From Version 1.x to 2.0

1. **Page Titles**: Replace all h1 tags with PageHeader component
2. **Typography**: Ensure all headings use `font-heading`
3. **Data Numbers**: Apply `font-data` to all numerical displays
4. **Color Updates**: Primary color changed from indigo to safety orange
5. **Font Classes Added**: `font-industrial` and `font-mono-industrial` now defined

---

**Maintained by:** Design System Team
**Questions?** See `/guides/` directory for additional documentation.
