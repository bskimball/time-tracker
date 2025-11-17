# Industrial Fulfillment Center Design System

This document describes the industrial aesthetic design system for the fulfillment center application.

## Design Philosophy

The interface is designed to evoke a **warehouse/factory environment** with:

- Heavy, utilitarian, functional aesthetics
- High contrast for readability in industrial settings
- Safety-focused color scheme
- Metal textures and industrial materials
- Bold, geometric typography

## Color Palette

### Primary Colors

**Industrial Yellow (Safety/Warning Color)**

- Light mode: `oklch(0.75 0.15 85)`
- Dark mode: `oklch(0.8 0.15 85)`
- Usage: Primary actions, warnings, active states, safety indicators

**Electric Blue (Digital Displays)**

- Light mode: `oklch(0.65 0.19 230)`
- Dark mode: `oklch(0.7 0.19 230)`
- Usage: Secondary actions, focus states, digital indicators

**Safety Orange (Destructive/Critical)**

- Light mode: `oklch(0.6 0.22 40)`
- Dark mode: `oklch(0.65 0.22 40)`
- Usage: Destructive actions, critical alerts, error states

### Surface Colors

**Light Mode (Warehouse Bright)**

- Background: `oklch(0.96 0.005 264)` - Bright warehouse floor
- Card: `oklch(0.98 0.005 264)` - Clean surfaces
- Muted: `oklch(0.88 0.01 264)` - Industrial gray

**Dark Mode (Night Shift)**

- Background: `oklch(0.18 0.015 264)` - Dark warehouse
- Card: `oklch(0.22 0.015 264)` - Metal panels
- Muted: `oklch(0.28 0.015 264)` - Darker surfaces

### Industrial Materials

**Metal Textures**

- Dark metal: `var(--metal-dark)`
- Light metal: `var(--metal-light)`
- Rivet: `var(--rivet)`

**LED Indicators**

- LED on: `var(--led-on)` - Glowing yellow
- LED off: `var(--led-off)` - Dim gray

## Typography

### Font Families

**Rajdhani** (Headers & Navigation)

```css
font-family: "Rajdhani", sans-serif;
```

- Bold, geometric, industrial aesthetic
- Used for all headings (h1-h6)
- Navigation labels
- Button text
- Uppercase with letter-spacing: `0.02em`

**IBM Plex Mono** (Data & Numbers)

```css
font-family: "IBM Plex Mono", monospace;
```

- Monospaced industrial data display
- Used for timestamps, IDs, metrics
- Status codes and technical information

**Inter** (Body Text)

```css
font-family: "Inter", sans-serif;
```

- Clean, readable body text
- Form inputs and descriptions

### Typography Classes

```tsx
<h1>Industrial Header</h1> // Automatically uses Rajdhani

<div className="font-industrial">Custom Industrial Text</div>
<div className="font-mono-industrial">12:34:56 | ID-00123</div>
```

## Layout Components

### Industrial Sidebar

The collapsible sidebar features:

**Visual Elements:**

- Metal texture background (`bg-metal`)
- Decorative rivets at corners
- LED status indicators (active/inactive)
- Panel shadows for depth
- Sharp, angular borders

**Behavior:**

- Collapsible (264px → 64px)
- Active route highlighting
- Hover states with industrial yellow
- Smooth transitions (300ms)

**Usage:**

```tsx
import { IndustrialSidebar } from "~/components/industrial-sidebar";

<IndustrialSidebar
	title="Manager Portal"
	brandHref="/manager"
	navLinks={navLinks}
	userSection={<UserControls />}
>
	{children}
</IndustrialSidebar>;
```

### Navigation Structure

**Floor Section** (Public - PIN auth)

- Clock
- Kiosk

**Manager Section** (MANAGER, ADMIN roles)

- Dashboard
- Floor Monitor
- Employees
- Timesheets
- Reports
- Schedule
- Tasks

**Executive Section** (ADMIN role)

- Dashboard
- Analytics
- Settings

## Industrial UI Utilities

### Background Patterns

**Warehouse Floor Pattern**

```tsx
<div className="bg-warehouse-floor">{/* Grid pattern with diagonal safety stripes */}</div>
```

**Metal Texture**

```tsx
<div className="bg-metal">{/* Brushed metal gradient with subtle lines */}</div>
```

### Industrial Components

**LED Indicator**

```tsx
<div className="led-indicator" /> {/* Off state */}
<div className="led-indicator active" /> {/* On state with glow */}
```

**Rivet Decoration**

```tsx
<div className="rivet" /> {/* Metallic rivet decoration */}
```

**Safety Stripes**

```tsx
<div className="safety-stripes h-4" />;
{
	/* Yellow and black diagonal stripes */
}
```

**Panel Shadow**

```tsx
<div className="panel-shadow">{/* Industrial panel with inset lighting and depth */}</div>
```

## Design Patterns

### High Contrast

All text maintains WCAG AA contrast ratios:

- Light mode: Dark text on bright backgrounds
- Dark mode: Bright text on dark backgrounds
- Primary yellow: High visibility for critical actions

### Sharp Corners

Industrial aesthetic uses minimal border radius:

- Default radius: `0.125rem` (very sharp)
- Creates angular, mechanical appearance
- Consistent with metal panels and industrial equipment

### Functional Animation

**LED Glow Effect**

```css
.led-indicator.active {
	box-shadow:
		inset 0 1px 2px rgba(0, 0, 0, 0.3),
		0 0 8px var(--led-on),
		0 0 16px var(--led-on);
}
```

**Sidebar Transition**

```css
transition: all 0.3s ease;
```

### Status Visualization

**Active States**

- LED indicator glows yellow
- Background changes to industrial yellow
- Text becomes dark for contrast

**Inactive States**

- LED indicator dims
- Muted gray backgrounds
- Subtle borders

## Accessibility

### Color Blindness

- Primary actions use yellow (high luminance)
- Secondary actions use blue (different hue)
- Destructive actions use orange/red
- Always paired with icons or text labels

### Keyboard Navigation

- All interactive elements focusable
- Visible focus rings (electric blue)
- Logical tab order

### Screen Readers

- Proper ARIA labels on buttons
- Semantic HTML structure
- Alternative text for visual indicators

## Component Examples

### Industrial Card

```tsx
<Card className="panel-shadow border-sidebar-border">
	<CardHeader className="border-b-2 border-sidebar-border bg-muted">
		<CardTitle className="font-industrial uppercase">Shift Status</CardTitle>
	</CardHeader>
	<CardBody className="font-mono-industrial">12:34:56 | 8.5 HRS</CardBody>
</Card>
```

### Status Indicator

```tsx
<div className="flex items-center gap-2">
	<div className="led-indicator active" />
	<span className="font-industrial text-sm">ONLINE</span>
</div>
```

### Data Display

```tsx
<div className="font-mono-industrial text-lg">STATION-042 | ACTIVE</div>
```

## Migration from Old Design

1. **Headers**: Automatically styled with Rajdhani (uppercase, bold)
2. **Navigation**: Uses new IndustrialSidebar component
3. **Colors**: Industrial yellow primary, electric blue secondary
4. **Patterns**: Warehouse floor backgrounds, metal textures
5. **Typography**: Data uses monospace, headers use Rajdhani

## Browser Support

- Modern browsers with OKLCH color support
- Graceful fallback for older browsers
- CSS custom properties required
- Backdrop blur support recommended

## Performance

- CSS-only animations
- Minimal JavaScript for sidebar toggle
- SVG icons (scalable, small)
- Font loading optimized with display=swap

## Future Enhancements

- **Sound effects**: Industrial beeps for actions
- **Loading animations**: Scanning line effects
- **Data visualizations**: Industrial-style charts
- **Kiosk mode**: Larger touch targets, simplified UI
- **Print styles**: Barcode-friendly layouts
