# AI Agent Context - Marketing Site

This file helps AI coding assistants understand the marketing site project.

## Project Overview

The marketing website for the ShiftPulse application, built with Astro for fast static generation and optimal performance.

## Tech Stack

- **Astro 5.16.4** - Static site generator with component islands
- **React 19.2.1** - For interactive components
- **TailwindCSS v4** - Utility-first CSS framework
- **Node.js 24+** - Runtime environment
- **TypeScript** - Type safety

## Architecture

### Astro Framework

- **Static Generation**: Pages are pre-built at build time for optimal performance
- **Component Islands**: React components for interactivity, Astro components for static content
- **File-based Routing**: Pages in `src/pages/` automatically become routes
- **Content Collections**: Type-safe content management (if used)

### Project Structure

```
src/
├── layouts/
│   └── Layout.astro     # Main layout with shared HTML structure
├── pages/
│   ├── index.astro      # Homepage
│   ├── features.astro   # Features page
│   └── pricing.astro    # Pricing page
└── styles/
    └── global.css       # Global styles and Tailwind imports
```

## Key Patterns

### Component Usage

- **Astro Components**: Use `.astro` files for static content and layout
- **React Components**: Use `.tsx` files for interactive elements
- **Shared Design System**: Import components from `@monorepo/design-system`

### Styling

- **TailwindCSS v4**: All styling done with utility classes
- **Global Styles**: Base styles in `src/styles/global.css`
- **Component Styling**: Inline classes or scoped styles

### Development

- **Dev Server**: `npm run dev` starts on port 4321
- **Build**: `npm run build` creates static files in `dist/`
- **Preview**: `npm run preview` serves built site locally

## Important Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run astro` - Access Astro CLI commands

## Content Management

### Pages

- **index.astro**: Landing page with hero, features overview, CTA
- **features.astro**: Detailed feature descriptions
- **pricing.astro**: Pricing plans and comparison

### Layout

- **Layout.astro**: Shared layout with header, footer, meta tags
- Uses design system components for consistency

## Integration with Monorepo

- **Design System**: Uses shared components from `packages/design-system`
- **Docker**: Configured in root `docker-compose.yml` for dev/prod
- **Build Process**: Integrated with monorepo build scripts

## Deployment

- **Static Hosting**: Built files in `dist/` can be deployed to any static host
- **Docker**: Production container serves the built site
- **CDN Ready**: Optimized assets for fast global delivery

## AI Agent Skills Utilized

- **Frontend Developer**: Astro components, React integration
- **Frontend Design**: TailwindCSS styling, responsive design
- **Content Creator**: Marketing copy, page layouts
- **DevOps**: Docker configuration, build optimization

## How to work

- Use the skills above intentionally: pick the smallest set that fits the task.
- Prefer repo conventions over inventing new patterns; check `guides/agent/*` and existing pages/components first.
- If you discover a missing/unclear rule or recurring pitfall, update an existing guide or add a new one, then link it from `guides/agent/README.md`.

See: [../../guides/agent/agent-skills-and-docs.md](../../guides/agent/agent-skills-and-docs.md)
