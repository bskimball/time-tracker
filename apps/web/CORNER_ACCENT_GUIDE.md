# Corner Accent Design System - Web App

## Design Philosophy

The web app uses a **refined, functional** corner accent system that establishes visual hierarchy without overwhelming users. Unlike the marketing site's bold accents, the web app prioritizes:

- **Subtlety**: 15% opacity (vs marketing's 25%)
- **Function over form**: Accents guide attention, not decorate
- **Micro-scale**: Smaller sizes for data-dense interfaces
- **Strategic placement**: Used sparingly on key UI elements

## Size Scale

```css
XS: 8px  → Micro indicators, inline badges
SM: 12px → Small cards, compact panels
MD: 18px → Standard cards, modals, auth screens
```

## Position Classes

### Card-Level (12px from edge)
```tsx
.corner-card-tl  // Top-left
.corner-card-tr  // Top-right
.corner-card-bl  // Bottom-left (use sparingly)
.corner-card-br  // Bottom-right (use sparingly)
```

### Panel-Level (16px from edge)
```tsx
.corner-panel-tl  // Top-left - section containers
.corner-panel-tr  // Top-right - section containers
```

## Color Variants

### Brand Colors
- `.corner-primary` - Safety Orange (15% opacity)
- `.corner-secondary` - Steel Blue (15% opacity)

### Status-Aware (Context signals)
- `.corner-success` - Green (for positive KPIs, success states)
- `.corner-warning` - Yellow (for caution, attention needed)
- `.corner-destructive` - Red (for errors, critical alerts)
- `.corner-muted` - Gray (for inactive, secondary elements)

### Special States
- `.corner-active` - Brighter (40% opacity for focused elements)

## Usage Guidelines

### ✓ DO Use Corner Accents On:

1. **Authentication Screens** (Medium prominence)
   ```tsx
   <IndustrialPanel className="relative">
     <div className="corner-card-tl corner-accent-md corner-primary" />
     <div className="corner-card-tr corner-accent-md corner-secondary" />
     {/* Login content */}
   </IndustrialPanel>
   ```

2. **KPI Cards** (Micro accents with status colors)
   ```tsx
   <Card className="relative group">
     <div className="corner-card-tl corner-accent-xs corner-success" />
     <div className="corner-card-tr corner-accent-xs corner-success" />
     {/* KPI content */}
   </Card>
   ```

3. **Modal Dialogs** (Medium accents for hierarchy)
   ```tsx
   <Dialog>
     <div className="corner-card-tl corner-accent-md corner-primary" />
     <div className="corner-card-tr corner-accent-md corner-secondary" />
     {/* Modal content */}
   </Dialog>
   ```

4. **Section Panels** (Panel-level, single corner)
   ```tsx
   <IndustrialPanel className="relative">
     <div className="corner-panel-tl corner-accent-sm corner-primary" />
     {/* Section content */}
   </IndustrialPanel>
   ```

5. **Alert Components** (Status-aware colors)
   ```tsx
   <Alert className="relative">
     <div className="corner-card-tl corner-accent-sm corner-destructive" />
     <div className="corner-card-tr corner-accent-sm corner-destructive" />
     {/* Alert content */}
   </Alert>
   ```

### ✗ DON'T Use Corner Accents On:

- **Buttons** - Would be distracting in interactive elements
- **Form Inputs** - Interferes with user focus during data entry
- **Table Rows** - Creates visual noise in data grids
- **List Items** - Overwhelming when repeated many times
- **Navigation Links** - Too busy for repeated nav elements
- **Small UI Controls** - Badges, chips, tags are too small

## Best Practices

### 1. Limit to Top Corners
In most cases, use only top corners (TL + TR). This provides visual anchor without overwhelming:

```tsx
// Good - Clean and focused
<Card className="relative">
  <div className="corner-card-tl corner-accent-xs corner-primary" />
  <div className="corner-card-tr corner-accent-xs corner-secondary" />
</Card>

// Too much - All four corners
<Card className="relative">
  <div className="corner-card-tl corner-accent-xs corner-primary" />
  <div className="corner-card-tr corner-accent-xs corner-secondary" />
  <div className="corner-card-bl corner-accent-xs corner-primary" />
  <div className="corner-card-br corner-accent-xs corner-secondary" />
</Card>
```

### 2. Match Size to Context

```tsx
// XS - Repeated cards (dashboards)
<div className="corner-card-tl corner-accent-xs corner-primary" />

// SM - Secondary panels
<div className="corner-card-tl corner-accent-sm corner-primary" />

// MD - Primary focus areas (modals, auth)
<div className="corner-card-tl corner-accent-md corner-primary" />
```

### 3. Use Status Colors Meaningfully

```tsx
// KPI Card - Success state
<div className="corner-card-tl corner-accent-xs corner-success" />

// Alert - Warning state
<div className="corner-card-tl corner-accent-sm corner-warning" />

// Critical notification
<div className="corner-card-tl corner-accent-sm corner-destructive" />

// Default/neutral
<div className="corner-card-tl corner-accent-xs corner-primary" />
```

### 4. Add to Hover Groups

Corner accents subtly brighten on hover when part of a `.group`:

```tsx
<Card className="relative group hover:shadow-lg transition-all">
  <div className="corner-card-tl corner-accent-xs corner-primary" />
  <div className="corner-card-tr corner-accent-xs corner-secondary" />
  {/* Accents brighten from 15% to 25% on hover */}
</Card>
```

## Examples in the Codebase

### Login Screen
`/apps/web/src/routes/login/client.tsx`
- Medium accents (MD size)
- Brand colors (primary + secondary)
- Establishes brand identity at entry point

### KPI Cards
`/apps/web/src/routes/executive/kpi-card.tsx`
- Micro accents (XS size)
- Status-aware colors (success/warning/destructive)
- Subtle hierarchy for repeated dashboard elements

## Dark Mode Support

All corner accent colors automatically adjust for dark mode with appropriate opacity and brightness:

```css
/* Light mode */
.corner-primary { border-color: oklch(0.62 0.18 45 / 0.15); }

/* Dark mode */
.dark .corner-primary { border-color: oklch(0.68 0.18 45 / 0.15); }
```

## Accessibility Notes

- Corner accents are **decorative only** - no semantic meaning
- Do not rely on color alone for status indication
- Always include text/icons for important status information
- Accents enhance, they don't replace clear labeling

## Migration from Marketing Site

Marketing site accents are **bolder** for brand impact:
- Opacity: 25% (vs web app's 15%)
- Sizes: XL/LG common (vs web app's XS/SM)
- Placement: All four corners common (vs web app's top only)
- Spacing: 32px section-level (vs web app's 12px card-level)

When adapting marketing components for the web app, **reduce** accent prominence:
```tsx
// Marketing site
<div className="corner-section-tl corner-accent-xl corner-primary" />

// Web app adaptation
<div className="corner-card-tl corner-accent-sm corner-primary" />
```

---

**Last Updated**: December 2025
**Maintainer**: Design & Engineering Team
