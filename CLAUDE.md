# Claude Code Assistant Context

This file provides context for Claude Code when working with this React Server Components project.

## Architecture Overview

This project uses **React Router 7.9.4** with **React Server Components in Data mode**. This is an experimental architecture documented at: https://reactrouter.com/how-to/react-server-components#rsc-data-mode

### What is RSC Data Mode?

In Data mode, React Router acts as the **client** to the React Server:

- The React Server renders components and streams RSC payload
- React Router receives the payload and handles client-side routing
- Server components run only on the server
- Client components hydrate and run in the browser

This differs from traditional SSR where the server just renders HTML strings.

## Critical Entry Points

When modifying the application architecture, understand these three entry points:

### 1. `src/entry.rsc.tsx` - React Server Entry

```typescript
import { unstable_matchRSCServerRequest as matchRSCServerRequest } from "react-router";
```

- Uses `matchRSCServerRequest` to handle RSC server requests
- Matches routes and renders server components to RSC payload
- Provides React Server touchpoints (decodeAction, decodeReply, etc.)
- Returns Response with RSC stream

### 2. `src/entry.ssr.tsx` - SSR Entry

```typescript
import {
	unstable_routeRSCServerRequest as routeRSCServerRequest,
	unstable_RSCStaticRouter as RSCStaticRouter,
} from "react-router";
```

- Uses `routeRSCServerRequest` to coordinate RSC + SSR
- Calls `fetchServer` function to get RSC payload from React Server
- Renders `RSCStaticRouter` to HTML with embedded RSC payload
- Returns complete HTML Response

### 3. `src/entry.browser.tsx` - Client Entry

- Hydrates the application in the browser
- Handles client-side routing and interactivity
- Receives and processes RSC payload from server

## Request Flow

```
1. User requests page → Hono server (server.ts)
2. Server calls handler in entry.rsc.tsx
3. entry.rsc.tsx imports entry.ssr.tsx dynamically
4. entry.ssr.tsx calls routeRSCServerRequest with:
   - request: incoming Request
   - fetchServer: function that calls matchRSCServerRequest
   - createFromReadableStream: React Server touchpoint
   - renderHTML: async function that renders RSCStaticRouter to HTML
5. matchRSCServerRequest matches routes and renders Server Components
6. Server Components rendered to RSC payload stream
7. RSCStaticRouter renders HTML with RSC payload embedded
8. Complete HTML Response sent to browser
9. Browser hydrates with entry.browser.tsx
```

## CRITICAL: fetchServer Requirements

**The `fetchServer` function MUST always return a Response with an RSC payload body.**

**❌ NEVER do this inside `fetchServer`:**

```typescript
async function fetchServer(request: Request) {
	// ❌ WRONG - Returning redirect from fetchServer causes "Missing body" error
	if (needsAuth) {
		return Response.redirect(url, 302); // Has no RSC payload body!
	}
	return matchRSCServerRequest({...});
}
```

**✅ ALWAYS do this instead:**

```typescript
// ✅ CORRECT - Handle redirects in the main handler BEFORE calling generateHTML
export default async function handler(request: Request) {
	// Check auth/conditions and redirect early
	if (needsAuth) {
		return Response.redirect(url, 302);
	}

	// Only call generateHTML (which uses fetchServer) when ready to render RSC
	const ssr = await import.meta.viteRsc.loadModule<typeof import("./entry.ssr")>("ssr", "index");
	return ssr.generateHTML(request, fetchServer);
}

async function fetchServer(request: Request) {
	// Only RSC rendering here - always returns Response with payload body
	return matchRSCServerRequest({...});
}
```

**Why this matters:**

- `routeRSCServerRequest` expects `fetchServer` to return RSC payload data
- Redirects, 404s, or other non-RSC responses cause "Missing body in server response" errors
- Handle all routing logic (auth checks, redirects, etc.) in the main handler
- Keep `fetchServer` purely for RSC rendering

## Server Components vs Client Components

### Server Components (Default)

**Identification:** No `"use client"` directive

**Capabilities:**

- Direct database access (Prisma)
- File system access
- Environment variables and secrets
- Server-only APIs
- Async/await for data fetching
- Zero JavaScript bundle impact

**Restrictions:**

- No React hooks (useState, useEffect, etc.)
- No browser APIs (window, document, localStorage, etc.)
- No event handlers (onClick, onChange, etc.)
- Cannot use context providers/consumers

**Example:**

```typescript
// app/routes/dashboard.tsx
import { db } from "~/lib/db"; // Server-only module

export default async function Dashboard() {
  const users = await db.user.findMany(); // Direct DB access
  return <UserList users={users} />;
}
```

### Client Components

**Identification:** `"use client"` directive at the top

**Capabilities:**

- React hooks (useState, useEffect, useContext, etc.)
- Browser APIs
- Event handlers
- Interactivity
- Context providers/consumers

**Restrictions:**

- Cannot directly import Server Components
- Cannot directly access server APIs
- Contributes to JavaScript bundle size
- Cannot use async components

**Example:**

```typescript
"use client";
import { useState } from "react";

export function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

## Common Patterns

### Pattern 1: Server Component fetches data directly (NO LOADERS)

**IMPORTANT:** In this RSC Data mode setup, `loader` functions cause the app to hang.
Always fetch data directly in async Server Components.

```typescript
// src/routes/dashboard/route.tsx (Server Component)
import { db } from "../../lib/db";
import { UserTable } from "./client";

// ❌ DO NOT USE LOADERS - They cause hanging
// export async function loader() {
//   const users = await db.user.findMany();
//   return { users };
// }

// ✅ DO THIS - Fetch data directly in Component
export default async function Component() {
  const users = await db.user.findMany();
  return <UserTable users={users} />;
}

// components/UserTable.tsx (Client Component)
"use client";
import { useState } from "react";

export function UserTable({ users }) {
  const [sortBy, setSortBy] = useState("name");
  // Interactive sorting logic
  return <table>{/* ... */}</table>;
}
```

### Pattern 2: Server Actions for mutations

Server Actions work correctly and should be placed in separate `actions.ts` files:

```typescript
// src/routes/users/actions.ts
"use server";

import { db } from "../../lib/db";

export async function createUser(formData: FormData) {
	const name = formData.get("name") as string;
	await db.user.create({ data: { name } });
	return { success: true };
}
```

```typescript
// src/routes/users/client.tsx
"use client";

import { createUser } from "./actions";

export function NewUserForm() {
  return (
    <form action={createUser}>
      <input name="name" />
      <button type="submit">Create</button>
    </form>
  );
}
```

## Key Dependencies

- **react@19.2.0** - React 19 with Server Components support
- **react-router@7.9.4** - Routing with RSC Data mode
- **@vitejs/plugin-rsc@0.5.0** - Vite plugin for RSC
- **hono@4.9.11** - Server framework
- **prisma@6.17.1** - Database ORM (use in Server Components only)

## Styling Guidelines

This project uses **pure TailwindCSS v4 + React Aria Components** for all UI styling.

### Design System Components

- Use components from `src/components/ds/` for consistent styling:
  - `Button` - Button with variants and sizes
  - `Input` - TextField with labels and error states
  - `SimpleInput` - Basic input (works in server/client)
  - `Card` - Layout components
  - `Alert` - Alert with variant states

### Styling Approach

- **Utility-first**: Use TailwindCSS classes directly
- **Component library**: Wrap React Aria components with styled variants
- **No pre-styled frameworks**: We don't use daisyUI or similar component libraries
- **RSC compatible**: Design system works in both server and client components

### Pattern Examples

```typescript
// ✅ Use design system components
import { Button, Input, Card, Alert } from "~/components/ds";

// ✅ Proper styling approach
<Button variant="primary" size="md">Submit</Button>
<Input label="Name" error="Required" />
<Card><CardBody>Content</CardBody></Card>
<Alert variant="error">Error message</Alert>

// ❌ Don't use pre-styled classes like "btn btn-primary"
// ❌ Don't mix different styling systems
```

## Logging

This project uses **Pino** for high-performance structured logging with the following features:

- **Request-scoped logging** - Automatic request ID tracking across all logs
- **Dual output in development** - Pretty console + JSON file (`logs/dev.log`)
- **Log rotation in production** - Daily rotation and 10MB size limits (`logs/app.log`, `logs/error.log`)
- **Database query logging** - Automatic Prisma query logging (debug level)
- **Security** - Automatic redaction of sensitive fields (passwords, tokens, cookies)

### Usage in Server Components

```typescript
import { getLogger } from "~/lib/request-context";

export default async function Dashboard() {
  const logger = getLogger();

  logger.info("Loading dashboard");
  const users = await db.user.findMany();
  logger.debug({ count: users.length }, "Users loaded");

  return <div>...</div>;
}
```

### Usage in Server Actions

```typescript
"use server";
import { logPerformance, logError } from "~/lib/logging-helpers";

export async function createUser(formData: FormData) {
  try {
    const user = await logPerformance(
      "create-user",
      () => db.user.create({ data: {...} })
    );
    return { success: true };
  } catch (error) {
    logError(error as Error, { operation: "create-user" });
    return { success: false };
  }
}
```

### Usage in API Routes (Hono)

```typescript
app.get("/users", async (c) => {
	const logger = c.var.logger; // From hono-pino middleware
	logger.info("Fetching users");
	return c.json({ users });
});
```

### Log Files

- **Development**: `logs/dev.log` (JSON, no rotation)
- **Production**: `logs/app.log` (JSON, rotated daily/10MB), `logs/error.log` (errors only)

### Environment Variables

```bash
LOG_LEVEL=debug        # debug, info, warn, error
LOG_DB_QUERIES=true    # Enable database query logging
```

**For complete documentation**, see `guides/LOGGING_GUIDE.md`.

## Documentation

All comprehensive guides are located in the `guides/` directory:

- **`guides/ARCHITECTURE.md`** - Complete application architecture, tech stack, and deployment
- **`guides/LOGGING_GUIDE.md`** - Comprehensive logging patterns and best practices
- **`guides/ROUTING_GUIDE.md`** - Time clock routing and navigation details
- **`guides/RSC_AUTH_FIX.md`** - Authentication patterns in RSC Data mode
- **`guides/TESTING_GUIDE.md`** - Testing strategies and examples
- **`guides/LINTING_GUIDE.md`** - Code quality and formatting standards
- **`guides/examples/`** - Code examples and usage patterns

## Development Guidelines

1. **DO NOT use loader functions:** They cause the app to hang in this RSC setup. Always fetch data directly in async Server Components
2. **DO NOT return redirects from fetchServer:** The `fetchServer` function must ALWAYS return a Response with an RSC payload body. Handle redirects in the main handler before calling `generateHTML`. Returning redirects from `fetchServer` causes "Missing body in server response" errors
3. **Default to Server Components:** Unless you need interactivity or hooks, use Server Components
4. **Keep Client Components small:** Extract only the interactive parts into Client Components
5. **Data fetching in Server Components:** Fetch data directly with `await` in async Component functions
6. **Use Prisma in Server Components only:** Database access should only happen on the server
7. **Environment variables:** Access in Server Components only (never expose secrets to client)
8. **Use design system components:** Import from `~/components/ds/` for consistent, accessible UI
9. **Use structured logging:** Import `getLogger()` from `~/lib/request-context` for request-scoped logging
10. **File structure:**
    - `route.tsx` - Server Component (async function Component)
    - `client.tsx` - Client Components (with "use client")
    - `actions.ts` - Server Actions (with "use server")

## Important Notes

- This is **experimental technology** - APIs are prefixed with `unstable_`
- React Router APIs may change between versions
- Not recommended for production use
- Node.js 22.6+ required for native TypeScript support
- The server uses Hono instead of Express for better performance
- Vite is used for both development and production builds

## When Making Changes

1. **Modifying entry points:** Be extremely careful - these are the foundation of the RSC architecture
2. **Adding new routes:** Follow the existing pattern in `src/routes/`
3. **Adding interactivity:** Use `"use client"` directive and keep components focused
4. **Database operations:** Always use Prisma in Server Components, never in Client Components
5. **Styling:** Use components from `~/components/ds/` - pure TailwindCSS + React Aria Components
6. **Type safety:** TypeScript is configured; always maintain type safety

## Testing and Development

- `npm run dev` - Start dev server on port 5173 with HMR
- `npm run build` - Build for production
- `npm start` - Run production server
- `npm run typecheck` - Check TypeScript types
- `npm run lint` - Lint code with ESLint (RSC-aware, design system compatible)
- `npm run lint:fix` - Auto-fix ESLint issues
- `npm run format` - Format code with Prettier (100 char width, tab indentation)
- `npm run check` - Run all quality checks (format + lint + typecheck)

## Code Quality & Formatting

This project uses **RSC-aware linting and formatting** with special support for the TailwindCSS + React Aria Components design system:

### Linting Features

- **RSC Pattern Recognition**: Understands server/client component boundaries
- **Design System Awareness**: Allows permissive types in `src/components/ds/` for React Aria props
- **Test File Flexibility**: Lenient rules for test files (mocking compatibility)
- **Accessibility Enforcement**: Promotes React Aria Components best practices

### Formatting Standards

- **Tab Indentation**: 2 spaces width (consistent with RSC patterns)
- **Double Quotes**: Preferred for JSX strings and TypeScript
- **Line Length**: 100 characters (optimized for modern displays)
- **Semicolons**: Required for code clarity

### Editor Integration

- **Auto-format on Save**: VSCode configured for automatic Prettier formatting
- **ESLint Fixes**: Auto-fixable issues corrected on save
- **Team Consistency**: `.editorconfig` ensures universal settings across all editors

For detailed configuration information, see `LINTING_GUIDE.md`.

## Troubleshooting

**"Cannot use hooks in Server Component":**

- Add `"use client"` directive to the component

**"Cannot import Server Component into Client Component":**

- Pass Server Component as children prop or restructure your component tree

**"Module not found" errors with Prisma:**

- Ensure you're only importing Prisma in Server Components
- Check that the import path is correct

**Build errors with unstable APIs:**

- These APIs are experimental and may have type issues
- Use `@ts-expect-error` or `@ts-ignore` only when necessary and document why
