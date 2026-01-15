# Corner Accent System: Marketing vs Web App

## Visual Philosophy Comparison

| Aspect | Marketing Site | Web App |
|--------|---------------|---------|
| **Purpose** | Brand establishment, attention-grabbing | Functional hierarchy, subtle guidance |
| **Opacity** | 25% standard, 50% hover | 15% standard, 25% hover |
| **Primary Sizes** | LG (40px), XL (56px) | XS (8px), SM (12px), MD (18px) |
| **Placement** | All four corners common | Top corners only (TL + TR) |
| **Spacing** | Section-level (32px) | Card-level (12px) |
| **Frequency** | Used generously | Used strategically |
| **Animation** | Staggered fade-ins, delays | Static only |

---

## Side-by-Side Examples

### Example 1: Hero Section vs KPI Card

#### Marketing Site - Hero Section
```tsx
<section className="relative">
  {/* Bold, attention-grabbing */}
  <div className="corner-section-tl corner-accent-xl corner-primary" />
  <div className="corner-section-tr corner-accent-xl corner-secondary" />
  <div className="corner-section-bl corner-accent-lg corner-primary" />
  <div className="corner-section-br corner-accent-lg corner-secondary" />

  <h1>Transform Your Workforce Management</h1>
</section>
```

**Visual Impact**:
- 56px top corners, 40px bottom corners
- All four corners for maximum visual frame
- 32px from edges (breathing room)
- Animated fade-in with staggered delays
- Bold brand statement

#### Web App - KPI Card
```tsx
<Card className="relative group">
  {/* Subtle, functional hierarchy */}
  <div className="corner-card-tl corner-accent-xs corner-success" />
  <div className="corner-card-tr corner-accent-xs corner-success" />

  <CardBody>
    <h3>Productivity Rate</h3>
    <p>18.5 units/hr</p>
  </CardBody>
</Card>
```

**Visual Impact**:
- 8px top corners only
- Two corners for minimal visual weight
- 12px from edges (compact spacing)
- Static (no animation distraction)
- Status-aware color (success = green)
- Repeated element on dashboard

---

### Example 2: Auth Screens

#### Marketing Site - Contact Form
```tsx
<IndustrialPanel className="relative">
  {/* Marketing: Maximum brand presence */}
  <div className="corner-card-tl corner-accent-lg corner-primary animate-fade-in" />
  <div className="corner-card-tr corner-accent-lg corner-secondary animate-fade-in" />
  <div className="corner-card-bl corner-accent-md corner-primary animate-fade-in animate-delay-200" />
  <div className="corner-card-br corner-accent-md corner-secondary animate-fade-in animate-delay-200" />

  {/* Technical labels for brand storytelling */}
  <div className="absolute top-2 left-[52px] font-mono text-[10px]">
    [CONTACT_FORM]
  </div>
</IndustrialPanel>
```

**Details**:
- LG (40px) + MD (24px) combination
- All four corners with animations
- Technical labels add brand flavor
- Tells brand story through design
- One-time visitor interaction

#### Web App - Login Screen
```tsx
<IndustrialPanel className="relative">
  {/* Web App: Refined brand establishment */}
  <div className="corner-card-tl corner-accent-md corner-primary" />
  <div className="corner-card-tr corner-accent-md corner-secondary" />

  <IndustrialHeader title="Login" subtitle="Secure Access" />
  {/* Login form */}
</IndustrialPanel>
```

**Details**:
- MD (18px) top corners only
- Static (users see this daily)
- Clean, professional entry point
- Subtle brand presence
- Focus on functionality

---

## Size Scale Comparison

### Marketing Site Sizes
```css
SM: 16px  → Feature bullets, testimonial details
MD: 24px  → Standard cards, pricing tiers
LG: 40px  → Main content panels, feature sections
XL: 56px  → Hero sections, major page sections
```

### Web App Sizes
```css
XS:  8px  → KPI cards, status indicators, repeated elements
SM: 12px  → Small panels, compact cards, notifications
MD: 18px  → Modals, auth screens, primary focus areas
```

**Note**: Web app intentionally omits LG/XL sizes. The largest size (MD: 18px) is smaller than marketing's smallest (SM: 16px).

---

## Color Opacity Comparison

### Marketing Site
```css
/* Standard */
.corner-primary {
  border-color: oklch(0.62 0.18 45 / 0.25);
}

/* Hover */
.group:hover .corner-primary {
  border-color: oklch(0.62 0.18 45 / 0.5);
}
```

**Effect**: Noticeable presence, brand statement

### Web App
```css
/* Standard */
.corner-primary {
  border-color: oklch(0.62 0.18 45 / 0.15);
}

/* Hover */
.group:hover .corner-primary {
  border-color: oklch(0.62 0.18 45 / 0.25);
}
```

**Effect**: Subtle guidance, doesn't compete with data

---

## Usage Frequency Comparison

### Marketing Site
**Generous Application**:
- ✓ Hero sections (all 4 corners)
- ✓ Feature sections (all 4 corners)
- ✓ Testimonial cards (all 4 corners)
- ✓ Pricing cards (all 4 corners)
- ✓ CTA sections (all 4 corners)
- ✓ About panels (all 4 corners)

**Goal**: Create memorable, distinctive brand experience

### Web App
**Strategic Application**:
- ✓ Auth screens (top 2 corners)
- ✓ KPI cards (top 2 corners, status colors)
- ✓ Modal dialogs (top 2 corners)
- ✓ Section panels (top 1 corner optional)
- ✗ Buttons, inputs, table rows
- ✗ Navigation, small controls
- ✗ Repeated list items

**Goal**: Establish hierarchy without distraction

---

## When to Use Which System

### Use Marketing Site Accents When:
1. Creating **first impressions** (landing pages)
2. Building **brand awareness** (about pages)
3. Driving **conversion** (pricing, CTAs)
4. Telling **brand story** (feature showcases)
5. Visitors see content **once or infrequently**

### Use Web App Accents When:
1. Building **functional tools** (dashboards, forms)
2. Displaying **data-dense interfaces** (tables, analytics)
3. Creating **daily-use interfaces** (management screens)
4. Establishing **visual hierarchy** without distraction
5. Users interact **frequently** with the interface

---

## Migration Checklist

When adapting marketing components for the web app:

- [ ] **Reduce size**: XL/LG → XS/SM/MD
- [ ] **Lower opacity**: 25% → 15%
- [ ] **Limit corners**: 4 corners → 2 top corners
- [ ] **Adjust spacing**: 32px → 12px
- [ ] **Remove animations**: Fade-ins → Static
- [ ] **Remove technical labels**: Brand story → Clean function
- [ ] **Consider status colors**: Brand colors → Status-aware
- [ ] **Evaluate necessity**: Is this accent helping or decorating?

---

## Real-World Examples

### Marketing: Feature Card
```tsx
<IndustrialPanel className="relative group">
  <div className="corner-card-tl corner-accent-md corner-primary" />
  <div className="corner-card-tr corner-accent-md corner-secondary" />
  <div className="corner-card-bl corner-accent-sm corner-primary" />
  <div className="corner-card-br corner-accent-sm corner-secondary" />

  <div className="font-mono text-[9px] text-muted-foreground/30">
    FEAT_01
  </div>
  <h3>Real-Time Analytics</h3>
  <p>Monitor your workforce in real-time...</p>
</IndustrialPanel>
```
**Purpose**: Make feature memorable, tell brand story

### Web App: Analytics Dashboard Panel
```tsx
<IndustrialPanel className="relative">
  <div className="corner-panel-tl corner-accent-sm corner-primary" />

  <h2>Real-Time Analytics</h2>
  <AnalyticsChart data={liveData} />
</IndustrialPanel>
```
**Purpose**: Subtle section delineation, focus on data

---

## Testing Your Implementation

Ask these questions:

1. **Is it distracting?** If users notice accents before content, reduce size/opacity
2. **Does it help hierarchy?** If not establishing clear hierarchy, remove it
3. **Is it repeated?** If element repeats, use XS size or omit
4. **Does color add meaning?** Use status colors (success/warning/destructive) contextually
5. **Would users miss it?** If removed and no impact, it was decorative (probably wrong for web app)

---

**Design Principle**:
> Marketing accents **attract attention**.
> Web app accents **guide attention**.

Both use the same industrial design language, but with radically different intensities appropriate to their contexts.

---

**Last Updated**: December 2025
**Team**: Design & Engineering
