# Design Tokens Reference

Quick reference guide for all design tokens in the Industrial Professional Design System.

## Color Tokens

### Light Mode

```css
/* Primary Colors */
--primary: oklch(0.62 0.18 45);              /* Safety Orange #E07426 */
--primary-foreground: oklch(0.98 0.002 264); /* White */
--primary-hover: oklch(0.58 0.18 45);        /* Darker Orange */
--primary-active: oklch(0.54 0.18 45);       /* Darkest Orange */

/* Secondary Colors */
--secondary: oklch(0.52 0.12 245);           /* Steel Blue #3F6B9E */
--secondary-foreground: oklch(0.98 0.002 264); /* White */

/* Destructive/Error */
--destructive: oklch(0.55 0.22 30);          /* Warning Red #D85050 */
--destructive-foreground: oklch(0.98 0.002 264); /* White */

/* Neutral Colors */
--background: oklch(0.97 0.003 264);         /* Light Gray #F7F7F8 */
--foreground: oklch(0.22 0.01 264);          /* Dark Gray #383839 */
--card: oklch(0.99 0.002 264);               /* Near White #FCFCFD */
--card-foreground: oklch(0.22 0.01 264);     /* Dark Gray */
--muted: oklch(0.93 0.005 264);              /* Muted Gray #EDEDED */
--muted-foreground: oklch(0.48 0.01 264);    /* Medium Gray #7A7A7B */
--accent: oklch(0.9 0.008 264);              /* Light Gray #E6E6E7 */
--accent-foreground: oklch(0.25 0.01 264);   /* Dark */

/* Borders & Inputs */
--border: oklch(0.85 0.005 264);             /* Light Border #D9D9DA */
--input: oklch(0.87 0.005 264);              /* Input Border #DEDEDE */
--ring: oklch(0.62 0.18 45);                 /* Focus Ring (Primary) */

/* Chart Colors */
--chart-1: oklch(0.62 0.18 45);              /* Orange */
--chart-2: oklch(0.52 0.12 245);             /* Blue */
--chart-3: oklch(0.58 0.15 150);             /* Green */
--chart-4: oklch(0.55 0.18 300);             /* Purple */
--chart-5: oklch(0.48 0.12 264);             /* Navy */
```

### Dark Mode

```css
/* Primary Colors */
--primary: oklch(0.68 0.18 45);              /* Brighter Orange */
--primary-hover: oklch(0.72 0.18 45);
--primary-active: oklch(0.64 0.18 45);

/* Secondary Colors */
--secondary: oklch(0.6 0.12 245);            /* Brighter Blue */

/* Destructive/Error */
--destructive: oklch(0.62 0.22 30);          /* Brighter Red */

/* Neutral Colors */
--background: oklch(0.16 0.01 264);          /* Dark #282829 */
--foreground: oklch(0.94 0.005 264);         /* Light #F0F0F1 */
--card: oklch(0.19 0.01 264);                /* Card Dark #303031 */
--muted: oklch(0.26 0.01 264);               /* Muted Dark #424243 */
--muted-foreground: oklch(0.63 0.005 264);   /* Muted Light #A0A0A1 */
--accent: oklch(0.28 0.01 264);              /* Accent Dark #474748 */
--border: oklch(0.32 0.01 264);              /* Border Dark #515152 */
--input: oklch(0.3 0.01 264);                /* Input Border Dark */
--ring: oklch(0.68 0.18 45);                 /* Focus Ring */
```

## Typography Tokens

### Font Families

```css
/* Body Font */
font-family: "IBM Plex Sans", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
font-weight: 400;
letter-spacing: -0.011em;

/* Heading Font (.font-heading) */
font-family: "Space Grotesk", sans-serif;
font-weight: 600;
letter-spacing: -0.02em;

/* Display Font (.font-display) */
font-family: "Space Grotesk", sans-serif;
font-weight: 700;
letter-spacing: -0.03em;

/* Mono Font (.font-mono) */
font-family: "JetBrains Mono", monospace;
font-weight: 500;
letter-spacing: -0.01em;

/* Data Font (.font-data) */
font-family: "JetBrains Mono", monospace;
font-weight: 400;
font-variant-numeric: tabular-nums;
letter-spacing: 0;

/* Industrial Font (.font-industrial) */
font-family: "Space Grotesk", sans-serif;
font-weight: 600;
letter-spacing: -0.02em;
text-transform: uppercase;

/* Industrial Mono (.font-mono-industrial) */
font-family: "JetBrains Mono", monospace;
font-weight: 600;
font-variant-numeric: tabular-nums;
letter-spacing: 0;
```

### Font Sizes

| Token | Size | Line Height | Use Case |
|-------|------|-------------|----------|
| `text-xs` | 12px (0.75rem) | 16px (1rem) | Labels, fine print |
| `text-sm` | 14px (0.875rem) | 20px (1.25rem) | Supporting text |
| `text-base` | 16px (1rem) | 24px (1.5rem) | Body text |
| `text-lg` | 18px (1.125rem) | 28px (1.75rem) | Card titles |
| `text-xl` | 20px (1.25rem) | 28px (1.75rem) | Subsections |
| `text-2xl` | 24px (1.5rem) | 32px (2rem) | Section headings |
| `text-3xl` | 30px (1.875rem) | 36px (2.25rem) | Large sections |
| `text-4xl` | 36px (2.25rem) | 40px (2.5rem) | Page titles ⭐ |
| `text-5xl` | 48px (3rem) | 1 | Hero displays |

### Font Weights

| Token | Weight | Use Case |
|-------|--------|----------|
| `font-normal` | 400 | Body text |
| `font-medium` | 500 | Emphasis |
| `font-semibold` | 600 | Headings |
| `font-bold` | 700 | Strong emphasis |

## Spacing Tokens

### Padding & Margin Scale

| Token | Size | Use Case |
|-------|------|----------|
| `p-1` / `m-1` | 4px | Tight spacing |
| `p-2` / `m-2` | 8px | Small spacing |
| `p-3` / `m-3` | 12px | Medium-small |
| `p-4` / `m-4` | 16px | Standard spacing |
| `p-6` / `m-6` | 24px | Section spacing |
| `p-8` / `m-8` | 32px | Large spacing |
| `p-12` / `m-12` | 48px | Extra large |

### Gap Scale

| Token | Size | Use Case |
|-------|------|----------|
| `gap-1` | 4px | Very tight |
| `gap-2` | 8px | Inline elements |
| `gap-3` | 12px | List items |
| `gap-4` | 16px | Form fields |
| `gap-6` | 24px | Cards |
| `gap-8` | 32px | Page sections |

## Border Radius Tokens

| Token | Size | Use Case |
|-------|------|----------|
| `rounded-none` | 0 | No rounding |
| `rounded-sm` | 0.375rem (6px) | **Standard** - Cards, buttons |
| `rounded` | 0.5rem (8px) | Moderate rounding |
| `rounded-full` | 9999px | Pills, avatars |

**Default:** Use `rounded-sm` for industrial aesthetic.

## Shadow Tokens

### Panel Shadow
```css
box-shadow:
  0 1px 3px rgba(0, 0, 0, 0.08),
  0 1px 2px rgba(0, 0, 0, 0.06);
```

**Usage:** `.panel-shadow` class

### Focus Ring
```css
box-shadow:
  0 0 0 2px var(--background),  /* Offset */
  0 0 0 4px var(--ring);         /* Ring */
```

**Usage:** `focus:ring-2 ring-ring ring-offset-2`

## Animation Tokens

### Timing Functions

```css
/* Snappy (Default) */
cubic-bezier(0.16, 1, 0.3, 1)

/* Fast */
cubic-bezier(0.4, 0, 0.2, 1)

/* Smooth */
cubic-bezier(0.4, 0, 1, 1)
```

### Durations

| Token | Duration | Use Case |
|-------|----------|----------|
| `duration-150` | 150ms | Fast interactions |
| `duration-200` | 200ms | **Standard** - Hovers |
| `duration-300` | 300ms | Transitions |
| `duration-500` | 500ms | Animations |

### Keyframes

```css
@keyframes scale-in {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

@keyframes slide-up {
  from { transform: translateY(12px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 8px var(--primary); }
  50% { box-shadow: 0 0 16px var(--primary); }
}
```

**Usage:**
- `.animate-scale-in` - Modal/dialog entrance
- `.animate-slide-up` - Content reveal
- `.animate-fade-in` - Subtle transitions
- `.animate-pulse-glow` - Active states, alerts

## Z-Index Scale

| Token | Value | Use Case |
|-------|-------|----------|
| Base | 0 | Default content |
| Sticky | 10 | Sticky headers |
| Dropdown | 50 | Dropdowns, tooltips |
| Modal | 100 | Modals, dialogs |
| Popover | 150 | Popovers |
| Toast | 200 | Toast notifications |

## Quick Copy-Paste Snippets

### Standard Page Title
```tsx
<h1 className="text-4xl font-bold uppercase tracking-tight font-heading text-foreground">
  Page Title
</h1>
```

### Section Heading
```tsx
<h2 className="text-2xl font-heading uppercase tracking-wide">
  Section Title
</h2>
```

### Data Display
```tsx
<div className="font-data text-2xl font-bold">1,234.56</div>
```

### Industrial Label
```tsx
<span className="font-industrial text-xs">STATION A</span>
```

### Card with Stats
```tsx
<Card>
  <CardBody className="p-6">
    <div className="font-heading text-sm text-muted-foreground">Metric Name</div>
    <div className="font-data text-3xl font-bold mt-2">1,234</div>
    <p className="text-sm text-muted-foreground mt-1">Description</p>
  </CardBody>
</Card>
```

### Form Field
```tsx
<div className="space-y-4">
  <Input label="Field Name" name="fieldName" required />
  <Select label="Options" name="option">
    <SelectItem value="a">Option A</SelectItem>
  </Select>
</div>
```

### Action Buttons
```tsx
<div className="flex gap-2 justify-end">
  <Button variant="outline">Cancel</Button>
  <Button variant="primary">Save</Button>
</div>
```

---

**See Also:**
- [Complete Design System Guide](/guides/DESIGN_SYSTEM.md)
- [Component Documentation](/guides/COMPONENT_USAGE.md)
- [Accessibility Checklist](/guides/ACCESSIBILITY.md)
