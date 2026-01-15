---
name: frontend-developer
description: Expert guide for building app logic, forms, and routing using React Server Components, React Router, and Hono.
license: Complete terms in LICENSE.txt
---

This skill guides the implementation of application logic, routing, and data handling.

## Tech Stack & Architecture

- **Framework**: React Server Components (RSC) in data mode.
- **Routing**: React Router.
- **Server**: Hono (for API and server-side logic).
- **React Version**: React 19 (latest).

## Core Principles

- **Use the Platform**: Leverage React 19 features (`useActionState`, `useOptimistic`, `actions`) before reaching for external libraries.
- **Server-First**: Prefer server-side logic where possible, utilizing RSCs for data fetching and rendering.

## Implementation Guidelines

### Forms & Data Mutation

- **Actions**: Use Server Actions for form submissions and data mutations.
- **State Management**:
  - `useActionState`: For managing form state and validation errors.
  - `useOptimistic`: For immediate UI updates before the server responds.
- **Validation**: Validate data on the server (Hono) and client.

### Routing & Navigation

- **React Router**: Use standard React Router patterns adapted for RSC.
- **Data Loading**: Fetch data in Server Components and pass down to Client Components as needed.

### Design System Integration

- **Components**: STRICTLY use the design system located in `/src/components/ds`.
- **Foundation**: These components are built on `react-aria-components` and `tailwind v4`.
- **Styling**: Do not write custom CSS unless absolutely necessary; use the design system's utility classes and components.

### Best Practices

- **Performance**: Minimize client-side JavaScript by maximizing Server Components usage.
- **Type Safety**: Ensure end-to-end type safety from Hono routes to React components.
