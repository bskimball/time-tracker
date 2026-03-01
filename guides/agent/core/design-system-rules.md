# Design System Rules

The project uses a custom "Precision Industrial" aesthetic inspired by Dieter Rams and Braun, built on TailwindCSS v4.

## Non-negotiable constraints

- Source of truth: `packages/design-system` holds tokens (CSS variables), shared styles, and primitives.
- Integration: `apps/web`, `apps/marketing`, and `apps/docs` must use `@source` for design-system-aware JIT compilation.
- Configuration: no `tailwind.config.*` files; use CSS `@theme` blocks.

## Visual language

- Tokens: zinc neutrals, signal orange (`primary`), tabular number usage where data-dense UI is present.
- Shape and depth: sharp corners (`rounded-[2px]`), hard borders, avoid soft shadows.
- Typography: `Space Grotesk` for headings/industrial UI, `JetBrains Mono` for data and inputs.

For detailed implementation patterns, see [../design-system.md](../design-system.md).
