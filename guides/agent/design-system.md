# Design System: Precision Industrial (Braun/Rams Aesthetic)

The Time Tracker application uses a shared design system located in `packages/design-system`. It follows a **"Precision Industrial"** aesthetic—inspired by Dieter Rams, Braun, and high-end engineering tools.

## Core Principles

1. **Sharp & Machined**: No large rounded corners. Use `rounded-[2px]` for cards, buttons, and inputs.
2. **Depth without Float**: Avoid soft drop shadows. Use hard borders (`border-border/50`) and inner shadows/hard elevations (`shadow-industrial`).
3. **Data Density**: UI should feel like a technical instrument. Use tight spacing and high contrast for metadata.
4. **Signal Colors**: Neutrals are cool Zinc grays. Color is used primarily for status ("Signals"). Safety Orange is the primary action color.

## CSS Architecture (Source of Truth)

The `packages/design-system` is the **single source of truth** for all styles. Both the Web App and Marketing site import these styles directly from the package.

### Modular CSS Entrypoints
The design system splits styles into opt-in modules to minimize payload:
- `@monorepo/design-system/styles`: Core tokens, base layer, typography, and standard effects.
- `@monorepo/design-system/styles/fonts`: Google Font loading (must be imported before Tailwind).
- `@monorepo/design-system/styles/patterns`: Grids (`bg-grid-pattern`), noise (`bg-noise`), and stripes (`safety-stripes`).
- `@monorepo/design-system/styles/animations`: Technical keyframes and `animate-*` utilities.
- `@monorepo/design-system/styles/panels`: The `.industrial-panel` wrapper styles.
- `@monorepo/design-system/styles/indicators`: The `.led-indicator` styles.
- `@monorepo/design-system/styles/mechanical`: Interactive "mechanical" button/card hover effects.

### Proper Import Order
In app global CSS files, fonts **must** come before Tailwind:
```css
@import "@monorepo/design-system/styles/fonts";
@import "tailwindcss";
@import "@monorepo/design-system/styles";
/* optional modules */
@import "@monorepo/design-system/styles/patterns";
```

## Design Tokens

### Typography
- **Headings/Labels**: `font-industrial` (`Space Grotesk`). Use tight tracking (`-0.03em`) and uppercase for technical labels.
- **Body**: `IBM Plex Sans`.
- **Data/Inputs**: `font-mono` (`JetBrains Mono`). Enforce `tabular-nums`.

### Colors (Oklch)
- **Primary**: `var(--color-primary)` (Signal Orange).
- **Neutrals**: Zinc scale (Zinc-50 to Zinc-950).
- **Status**: 
  - Success: `var(--color-success)` (Technical Green).
  - Warning: `var(--color-warning)` (Industrial Amber).
  - Error: `var(--color-destructive)` (Crimson).

## Key Components

### 1. Card
Standard container for all modules.
```tsx
<Card>
  <CardHeader>
    <CardTitle uppercase>System_Log</CardTitle>
  </CardHeader>
  <CardBody>...</CardBody>
</Card>
```

### 2. Metric
Use for big numbers and dashboard data.
```tsx
<Metric 
  label="THROUGHPUT" 
  value="1,024 u/h" 
  trend="+12%" 
  trendDirection="up" 
/>
```

### 3. Badge
Rectangular status stickers.
```tsx
<Badge variant="success">ONLINE</Badge>
<Badge variant="secondary">SYS_01</Badge>
```

### 4. Alert (Status Card)
Never use tinted backgrounds. Use the **Left Border Strip** pattern.
```tsx
<Alert variant="error" title="CRITICAL_FAILURE">
  Sensor calibration required.
</Alert>
```

## CSS Utilities
- `bg-noise`: Subtle aluminum/paper texture.
- `bg-tactical-grid`: Fine alignment grid.
- `shadow-industrial`: Hard 1px/2px elevation.
- `safety-stripes`: Signal boundary pattern.

## Rules for Agents
- **NEVER** use `rounded-xl`, `rounded-lg`, or standard `shadow-md`.
- **ALWAYS** use `font-mono` for numbers and technical data.
- **PREFER** uppercase for short technical labels with wide tracking.
- **REUSE** the `@monorepo/design-system` components; do not build local versions of buttons or cards.
- **NO CORNERS**: The legacy `corner-machined` or `corner-accent` DIV elements have been removed. Do not add them back.
