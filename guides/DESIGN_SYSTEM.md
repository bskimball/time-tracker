# Design System Updates

## Overview

The design system has been improved with better color choices, more subtle borders, and consistent component styling.

## Key Changes

### 1. Primary Color

- **New Primary**: Modern indigo-blue (`oklch(0.55 0.22 264)`)
- **Light mode**: Darker, more saturated for better contrast
- **Dark mode**: Lighter variant (`oklch(0.65 0.22 264)`) for better visibility
- **Hover states**: Dedicated CSS variables (`--primary-hover`, `--primary-active`)

### 2. Focus Ring Fix

The focus ring now works properly on all inputs and interactive elements:

- **CSS Variable**: `--ring` uses proper OKLCH color with 50% opacity
- **Light mode**: `oklch(0.55 0.22 264 / 0.5)`
- **Dark mode**: `oklch(0.65 0.22 264 / 0.5)`
- **Usage**: `focus:ring-ring` instead of `focus:ring-primary`

### 3. Subtle Borders

Borders are now more refined with better opacity:

- **Light mode**: `oklch(0.145 0 0 / 0.1)` - 10% opacity black
- **Dark mode**: `oklch(1 0 0 / 0.1)` - 10% opacity white
- **Usage**: `border-border` for consistent border colors

### 4. Tab Component

New reusable Tab components for consistent tab styling:

```tsx
import { Tabs, TabList, Tab, TabPanel } from "~/components/ds";

function MyComponent() {
	const [activeTab, setActiveTab] = useState("tab1");

	return (
		<Tabs>
			<TabList>
				<Tab isActive={activeTab === "tab1"} onClick={() => setActiveTab("tab1")}>
					First Tab
				</Tab>
				<Tab isActive={activeTab === "tab2"} onClick={() => setActiveTab("tab2")}>
					Second Tab
				</Tab>
			</TabList>

			<TabPanel isActive={activeTab === "tab1"}>Content for tab 1</TabPanel>

			<TabPanel isActive={activeTab === "tab2"}>Content for tab 2</TabPanel>
		</Tabs>
	);
}
```

## Component Updates

### Button

- Uses new primary color with proper hover states
- Focus ring now uses `ring-ring` for consistent styling
- Outline variant uses single border instead of `border-2` for subtlety

### Input

- Border uses `border-input` for subtle appearance
- Focus ring properly shows the primary color
- Consistent styling between `Input` and `SimpleInput`

### Card

- Explicit border color with `border-border`
- CardHeader uses `border-border` for separator

### Navigation

- Updated to use new focus ring utilities
- Consistent with other interactive elements

## CSS Variables Reference

### Colors

```css
/* Light Mode */
--primary: oklch(0.55 0.22 264);
--primary-hover: oklch(0.5 0.22 264);
--primary-active: oklch(0.45 0.22 264);
--ring: oklch(0.55 0.22 264 / 0.5);
--border: oklch(0.145 0 0 / 0.1);
--input: oklch(0.145 0 0 / 0.15);

/* Dark Mode */
--primary: oklch(0.65 0.22 264);
--primary-hover: oklch(0.7 0.22 264);
--primary-active: oklch(0.6 0.22 264);
--ring: oklch(0.65 0.22 264 / 0.5);
--border: oklch(1 0 0 / 0.1);
--input: oklch(1 0 0 / 0.15);
```

### Utility Classes

- `bg-primary` - Primary background color
- `bg-primary-hover` - Hover state background
- `bg-primary-active` - Active state background
- `text-primary` - Primary text color
- `border-border` - Subtle border color
- `border-input` - Input border color
- `ring-ring` - Focus ring color

## Migration Guide

If you have custom components using the old styles:

1. **Focus rings**: Change `focus:ring-primary` to `focus:ring-ring`
2. **Borders**: Add explicit `border-border` or `border-input` to elements with borders
3. **Tabs**: Use the new `Tabs`, `TabList`, `Tab`, `TabPanel` components
4. **Hover states**: Primary buttons automatically use proper hover colors

## Accessibility

All changes maintain WCAG AA contrast ratios:

- Primary color has 4.5:1 contrast against white in light mode
- Primary color has 4.5:1 contrast against dark background in dark mode
- Focus rings have sufficient visibility with 50% opacity

## Industrial Theme

The application features a specialized "Industrial" theme for system status, errors, and warehouse-related interfaces.

### Components

Import these from `~/components/ds/industrial`:

#### SafetyStripes
Decorative hazard stripes used at the top/bottom of panels.
```tsx
<SafetyStripes position="top" />
```

#### LedIndicator
Status light with active/inactive states.
```tsx
<LedIndicator active={true} />
```

#### IndustrialPanel
Main container with heavy borders and shadows.
```tsx
<IndustrialPanel variant="destructive">
  {/* content */}
</IndustrialPanel>
```

#### IndustrialHeader
Header with diagonal grid background and LED indicator.
```tsx
<IndustrialHeader
  title="404"
  subtitle="System Malfunction"
  badge="Error"
  active={true}
/>
```

### Utility Classes

- `bg-grid-pattern`: Standard grid background
- `bg-grid-pattern-diagonal`: Diagonal lines for headers
- `safety-stripes`: The hazard stripe gradient
- `font-industrial`: Rajdhani font for headings
- `font-mono-industrial`: IBM Plex Mono for technical data
