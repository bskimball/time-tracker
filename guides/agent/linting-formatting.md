# Linting & Formatting (Agent Guide)

## What’s enforced

- ESLint + Prettier
- Tabs indentation (project convention)
- Double quotes
- Semicolons

## Commands

From repo root:

- Lint: `npm run lint`
- Typecheck: `npm run typecheck`

In `apps/web`:

- Format: `npm run format`
- Lint: `npm run lint`
- Fix lint: `npm run lint:fix`
- Typecheck: `npm run typecheck`
- Full check: `npm run check`

## RSC-specific lint gotcha

- `"use client"` / `"use server"` must be the very first line in the file.
