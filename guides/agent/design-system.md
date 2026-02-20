# Design System: Precision Industrial (Braun/Rams Aesthetic)

Shift Pulse uses a shared design system located in `packages/design-system` across `apps/web`, `apps/marketing`, and `apps/docs`. It follows a **"Precision Industrial"** aesthetic inspired by Dieter Rams, Braun, and high-end engineering tools.

## Core Principles

1. **Sharp & Machined**: No large rounded corners. Use `rounded-[2px]` for cards, buttons, and inputs.
2. **Depth without Float**: Avoid soft drop shadows. Use hard borders (`border-border/50`) and inner shadows/hard elevations (`shadow-industrial`).
3. **Data Density**: UI should feel like a technical instrument. Use tight spacing and high contrast for metadata.
4. **Signal Colors**: Neutrals are cool Zinc grays. Color is used primarily for status ("Signals"). Safety Orange is the primary action color.

## CSS Architecture (Source of Truth)

The `packages/design-system` is the **single source of truth** for all styles, built on **TailwindCSS v4**.

### Tailwind v4 Configuration
The design system uses the new CSS-first configuration:
- **No Config Files**: There are **NO** `tailwind.config.js` or `tailwind.config.ts` files in this project.
- **Tokens**: Defined in `packages/design-system/src/styles/theme.css` using the `@theme` block.
- **Variables**: All tokens (colors, spacing, radius) are native CSS variables (e.g., `--color-primary`).
- **JIT Compilation**: Apps must explicitly point Tailwind to the design system source files.

### Integration Requirements
In each app's global CSS file (`apps/web`, `apps/marketing`, `apps/docs`), you **must** include the `@source` directive to ensure JIT compilation works for shared components:

```css
@import "@monorepo/design-system/styles/fonts";
@import "tailwindcss";

/* CRITICAL: Tell Tailwind to scan the design system */
@source "../../../path/to/packages/design-system/src";

@import "@monorepo/design-system/styles/full";
```

### Modular CSS Entrypoints
The design system splits styles into opt-in modules to minimize payload:
- `@monorepo/design-system/styles`: Core tokens, base layer, typography, and standard effects.
- `@monorepo/design-system/styles/fonts`: Google Font loading (must be imported before Tailwind).
- `@monorepo/design-system/styles/patterns`: Line grids (`bg-grid-pattern`), dot grids (`bg-dot-grid-pattern`), subtle dots (`bg-grid-pattern-subtle`), optional industrial gradients (`bg-industrial-gradient`, `bg-industrial-card-gradient`), noise (`bg-noise`), and stripes (`safety-stripes`).
- `@monorepo/design-system/styles/animations`: Technical keyframes and `animate-*` utilities.
- `@monorepo/design-system/styles/panels`: The `.industrial-panel` wrapper styles.
- `@monorepo/design-system/styles/indicators`: The `.led-indicator` styles.
- `@monorepo/design-system/styles/mechanical`: Interactive "mechanical" button/card hover effects.

### Override Pattern
To customize the theme in a specific app (e.g., Marketing site needs a different primary color), **do not** edit the Tailwind config. Instead, override the CSS variable in the app's global CSS:

```css
/* In apps/marketing/src/styles/global.css */
@layer base {
  :root {
    /* Overrides the default Signal Orange */
    --color-primary: oklch(0.5 0.5 250); 
  }
}
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

## Component Guidelines

### Background Patterns
- **Dot Grid (Preferred default)**: Use `bg-dot-grid-pattern` for app surfaces where you want the Precision Industrial drafting-board feel without heavy line interference.
- **Line Grid (Use intentionally)**: Use `bg-grid-pattern` only when hard alignment lines are part of the UX narrative (kiosk/ops views, dense technical dashboards).
- **Subtle Dot Grid**: Use `bg-grid-pattern-subtle` for low-contrast sections where texture should be barely visible.

### Surface Gradients
- **Optional Treatment**: `bg-industrial-gradient` and `bg-industrial-card-gradient` are available for experimentation, but not required for core surfaces.
- **Default Surface Rule**: Prefer flat `bg-background` or `bg-card` for the baseline Precision Industrial look unless a specific screen needs extra depth.

### Controls Sizing (Inputs & Buttons)
Controls must strictly adhere to the **40px (`h-10`)** standard height to ensure perfect alignment in grid rows.

- **Standard Height**: `h-10` (40px).
- **Padding**: Use `px-3` or `px-4`. **Avoid** `py-*` on fixed-height inputs as it conflicts with border sizing.
- **Alignment**: Use `flex items-center` containers for alignment, not padding.

### Key Components

#### 1. Card
Standard container for all modules.
```tsx
<Card>
  <CardHeader>
    <CardTitle uppercase>System_Log</CardTitle>
  </CardHeader>
  <CardBody>...</CardBody>
</Card>
```

#### 2. Metric
Use for big numbers and dashboard data.
```tsx
<Metric 
  label="THROUGHPUT" 
  value="1,024 u/h" 
  trend="+12%" 
  trendDirection="up" 
/>
```

#### 3. Badge
Rectangular status stickers.
```tsx
<Badge variant="success">ONLINE</Badge>
<Badge variant="secondary">SYS_01</Badge>
```

#### 4. Alert (Status Card)
Never use tinted backgrounds. Use the **Left Border Strip** pattern.
```tsx
<Alert variant="error" title="CRITICAL_FAILURE">
  Sensor calibration required.
</Alert>
```

## Rules for Agents
- **NEVER** use `rounded-xl`, `rounded-lg`, or standard `shadow-md`.
- **ALWAYS** use `font-mono` for numbers and technical data.
- **PREFER** uppercase for short technical labels with wide tracking.
- **REUSE** the `@monorepo/design-system` components; do not build local versions of buttons or cards.
- **NO CORNERS**: The legacy `corner-machined` or `corner-accent` DIV elements have been removed. Do not add them back.
- **STRICT HEIGHTS**: Ensure all form inputs and buttons share the `h-10` class and align perfectly.
