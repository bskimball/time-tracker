# AI Agent Context

This file helps AI coding assistants understand this project.

## Project Overview

React Router RSC template using React Server Components (experimental) in **Data mode**, powered by Vite and served with Hono on Node.js.

## React Server Components Architecture

This project uses **React Router 7** with React Server Components in **Data mode** as documented at https://reactrouter.com/how-to/react-server-components#rsc-data-mode

### RSC Data Mode

In Data mode, React Router acts as the client to the React Server. The React Server renders the component tree and sends it to React Router, which then handles routing and rendering in the browser.

**Key characteristics:**

- Server components run on the server and stream RSC payload to the client
- Client components hydrate in the browser with interactivity
- Data fetching happens on the server during RSC rendering
- React Router manages routing and coordinates between server and client

**Entry points:**

- `src/entry.rsc.tsx` - React Server entry using `unstable_matchRSCServerRequest`
- `src/entry.ssr.tsx` - SSR entry using `unstable_routeRSCServerRequest` and `RSCStaticRouter`
- `src/entry.browser.tsx` - Client-side hydration entry point

The architecture follows this flow:

1. Request comes to the server (Hono)
2. SSR entry (`entry.ssr.tsx`) calls `routeRSCServerRequest` which coordinates the rendering
3. RSC entry (`entry.rsc.tsx`) uses `matchRSCServerRequest` to match routes and render server components
4. Server components are rendered to an RSC payload stream
5. SSR renders HTML with `RSCStaticRouter` that includes the RSC payload
6. Client receives HTML and hydrates with the browser entry point

### Server Components vs Client Components

**Server Components** (default):

- Files without `"use client"` directive
- Run only on the server
- Can directly access databases, file systems, and server-only APIs
- Cannot use React hooks like `useState`, `useEffect`, or browser APIs
- Can import and use Client Components
- Keep server-only code and secrets secure
- Reduce JavaScript bundle size sent to the client

**Client Components**:

- Files with `"use client"` directive at the top
- Hydrate and run in the browser
- Can use React hooks and browser APIs
- Enable interactivity (onClick, onChange, etc.)
- Cannot directly import Server Components
- Contribute to the JavaScript bundle size

**Best practices:**

- **DO NOT use `loader` functions** - They cause hanging in this RSC Data mode setup
- **DO NOT return redirects from `fetchServer`** - The `fetchServer` function must ONLY return RSC payload. All redirects happen via middleware during route matching
- **DO NOT throw redirects in Server Components** - Use middleware for authentication/authorization. Components should use `validateRequest()` to access user data
- Fetch data directly in async Server Components using `await`
- Use Server Components by default for data fetching and static content
- Use Client Components only for interactive UI elements
- Keep Client Components small and focused on interactivity
- Pass data from Server Components to Client Components via props

**Data Fetching Pattern:**

```typescript
// ❌ WRONG - Do not use loaders
export async function loader() {
  const data = await db.table.findMany();
  return { data };
}

// ✅ CORRECT - Fetch data directly in Component
export default async function Component() {
  const data = await db.table.findMany();
  return <div>{/* render data */}</div>;
}
```

**Request Access Pattern:**

In RSC Data Mode, components do NOT receive a `request` prop automatically. Instead, we use AsyncLocalStorage:

```typescript
// ❌ WRONG - Request is not automatically passed as prop
export default async function Component({ request }: { request: Request }) {
	const { user } = await validateRequest(request);
	// ...
}

// ✅ CORRECT - Use request context (AsyncLocalStorage)
export default async function Component() {
	// validateRequest() internally uses getRequest() from AsyncLocalStorage
	const { user } = await validateRequest();
	// ...
}
```

The request context is set up in `src/entry.rsc.tsx` using `runWithRequest()` which wraps the RSC rendering. The `getRequest()` function in `src/lib/request-context.ts` retrieves the request from AsyncLocalStorage.

**Authentication Pattern:**

Authentication is handled using React Router middleware, NOT in Server Components:

```typescript
// ✅ CORRECT - Define middleware in route config (src/routes/config.ts)
{
	id: "dashboard",
	path: "dashboard",
	middleware: [authMiddleware], // Auth happens during route matching
	lazy: () => import("./dashboard/route.tsx"),
}

// ✅ CORRECT - Access user in protected Server Component
export default async function Component() {
	// Middleware ensures user exists, component just reads it
	const { user } = await validateRequest();
	// user is guaranteed to exist here due to middleware
	// ...
}

// ❌ WRONG - Do NOT throw redirects in Server Components
export default async function Component() {
	const user = await requireAuth(); // Throws redirect during RSC rendering
	// This causes "Missing body in server response" errors
}
```

**Why middleware for auth:**

- Redirects happen BEFORE RSC rendering (no "missing body" errors)
- Follows React Router's recommended pattern
- Proper separation of concerns (auth at router level, not component level)
- Better performance (auth check happens once during route matching)
- RSC compatible (no redirects during component rendering)

### CRITICAL: fetchServer Requirements

**The `fetchServer` function in `entry.rsc.tsx` MUST always return a Response with an RSC payload body.**

**❌ NEVER return redirects or other responses from `fetchServer`:**

```typescript
async function fetchServer(request: Request) {
	// ❌ WRONG - Causes "Missing body in server response" error
	if (needsAuth) {
		return Response.redirect(url, 302);
	}
	return matchRSCServerRequest({...});
}
```

**✅ The `fetchServer` function should ONLY handle RSC rendering:**

```typescript
async function fetchServer(request: Request) {
	// Wrap the RSC rendering in the request context
	return runWithRequest(request, async () => {
		return matchRSCServerRequest({
			createTemporaryReferenceSet,
			decodeAction,
			decodeFormState,
			decodeReply,
			loadServerAction,
			request,
			routes: routes(),
			generateResponse(match, options) {
				return new Response(renderToReadableStream(match.payload, options), {
					status: match.statusCode,
					headers: match.headers,
				});
			},
		});
	});
}

export default async function handler(request: Request) {
	// Import the generateHTML function from the client environment
	const ssr = await import.meta.viteRsc.loadModule<typeof import("./entry.ssr")>("ssr", "index");

	return ssr.generateHTML(request, fetchServer);
}
```

**Why this is critical:**

- `routeRSCServerRequest` expects `fetchServer` to return RSC payload data
- Redirects have no body, causing "Missing body in server response" errors
- All routing logic (auth, redirects, 404s) is handled by React Router middleware
- `fetchServer` stays purely focused on RSC rendering
- Middleware in route config handles authentication BEFORE RSC rendering begins

## Tech Stack

- **React Router 7.9.4** with React Server Components (RSC) in Data mode
- **React 19.2.0** - With Server Components support
- **Hono** - Web framework for the server
- **Node.js 22.6+** - Native TypeScript support (type stripping enabled by default)
- **Vite** - Build tool and dev server
- **@vitejs/plugin-rsc** - Vite plugin for React Server Components
- **Prettier** - Code formatter
- **ESLint** - Linter
- **TailwindCSS v4** - Utility-first CSS framework
- **tailwindcss-react-aria-components** - Official Tailwind plugin for React Aria Components
- **Prisma** - Database ORM
- **React Aria Components** - Accessible UI components (unstyled)

## Important Commands

- `npm run dev` - Start development server (runs on port 5173)
- `npm run build` - Build for production
- `npm start` - Run production server (default port 3000, configurable via PORT env var)
- `npm run typecheck` - Type check with TypeScript
- `npm run format` - Format code with Prettier
- `npm run lint` - Lint code with ESLint
- `npm run check` - Run Prettier check, ESLint, and TypeScript type check

### Docker Compose Commands

- `docker compose --profile dev up` - Start development environment with MySQL
- `docker compose --profile prod up` - Start production environment with MySQL
- `docker compose down` - Stop and remove containers
- `docker compose down -v` - Stop and remove containers with volumes
- `docker exec -it app-dev npx prisma db push` - Run Prisma commands in running dev container

## Project Structure

- `server.ts` - Production server using Hono and @hono/node-server
- `src/entry.rsc.tsx` - React Server Components entry point
- `src/entry.ssr.tsx` - Server-side rendering entry point
- `src/entry.browser.tsx` - Client-side hydration entry point
- `src/components/ds/` - Design system components (Button, Input, Card, Alert)
- `dist/rsc/` - Built RSC output
- `dist/client/` - Built client assets
- `prisma/` - Prisma schema and migrations
- `eslint.config.js` - ESLint configuration with RSC and design system awareness
- `.prettierrc` - Prettier formatting configuration
- `.editorconfig` - Cross-editor configuration
- `LINTING_GUIDE.md` - Comprehensive linting and formatting guide

## Code Style

This project has a comprehensive code quality setup with **RSC-aware linting and formatting**:

### Prettier Configuration (`.prettierrc`)

- **Double quotes** for strings
- **Tab indentation** (2 width)
- **Semicolons** required
- **ES5 trailing commas**
- **Print width**: 100 characters (optimized for modern displays)
- **Line endings**: LF (cross-platform compatibility)

### ESLint Configuration (`eslint.config.js`)

- **TypeScript support** with strict mode
- **React 19+** and React Hooks rules
- **RSC-aware patterns**: Understands server/client component boundaries
- **Design system awareness**: Special rules for `src/components/ds/` components
- **Test file permissiveness**: Lenient rules for test files
- **Accessibility focus**: Enforces best practices for React Aria Components

### Editor Support

- **VSCode settings**: Auto-format on save, ESLint fixes, tab configuration
- **EditorConfig**: Universal settings for all editors
- **Comprehensive documentation**: `LINTING_GUIDE.md` with full configuration guide

### Linting Rules Highlights

- **No `var` declarations**: Modern JavaScript practices only
- **Prefer const**: Encourages good variable practices
- **React patterns**: Modern React 19+ conventions
- **Design system exceptions**: Allows `any` types in `src/components/ds/` for React Aria props
- **Test flexibility**: Permissive typing in test files for mocking compatibility

### Quality Commands

- `npm run check` - Full quality check (format + lint + typecheck)
- `npm run format` - Apply Prettier formatting
- `npm run lint` - ESLint checks (warnings only)
- `npm run lint:fix` - Auto-fix ESLint issues

This configuration ensures consistent code quality across the team while respecting the unique needs of React Server Components and the TailwindCSS + React Aria Components design system.

## Node.js Requirements

Requires **Node.js 22.6+** for native TypeScript support. The server runs TypeScript files directly without a transpiler - Node's built-in type stripping handles the conversion.

## Important Notes

- This is **experimental** technology - not recommended for production
- Server uses top-level await for dynamic imports
- Environment variables: `PORT` (default: 3000), `NODE_ENV`
- Create `.env` file from `.env.example` before running Docker Compose
- Docker Compose uses profiles: `dev` for development, `prod` for production
- The dev container automatically runs `npm install` and `npx prisma db push` on startup

## Prisma

- **Database ORM** - Use Prisma for all database operations
- Schema located in `prisma/schema.prisma`
- Generate Prisma Client after schema changes: `npx prisma generate`
- Create migrations: `npx prisma migrate dev --name migration_name`
- Push schema changes without migrations: `npx prisma db push`
- Open Prisma Studio: `npx prisma studio`
- Import Prisma Client: `import { PrismaClient } from "@prisma/client"`

## Design System (TailwindCSS + React Aria Components)

This project uses pure **TailwindCSS v4** with **React Aria Components** for a clean, accessible design system.

### Component Library

Located in `src/components/ds/`:

- **Button** - Styled React Aria Button with variants (primary, secondary, outline, ghost, error) and sizes (xs, sm, md, lg)
- **Input** - TextField component with label, error states, and description support
- **SimpleInput** - Basic input for server/client compatibility
- **Card** - Layout components (Card, CardHeader, CardTitle, CardBody)
- **Alert** - Alert components with variant states (success, error, warning, info)

### Usage Pattern

```typescript
// Import from design system
import { Button, Input, Card, Alert } from "~/components/ds";

// Use with clean APIs
<Button variant="primary" size="md" disabled={loading}>
  Submit
</Button>

<Input
  label="Email"
  type="email"
  error={error}
  description="We'll never share your email"
/>

<Card>
  <CardHeader>
    <CardTitle>Dashboard</CardTitle>
  </CardHeader>
  <CardBody>
    {/* Content */}
  </CardBody>
</Card>

<Alert variant="error">
  Something went wrong
</Alert>
```

### Styling Philosophy

- **Utility-first**: All styling done with TailwindCSS classes
- **Component-based**: Styled wrappers around React Aria components
- **Accessible**: Full accessibility support from React Aria
- **RSC compatible**: Components work in both server and client contexts
- **TypeScript**: Full type safety with proper interfaces

### Why This Approach?

- **No design conflicts**: Pure utility-first styling eliminates competing systems
- **Better accessibility**: No conflicts between different accessibility approaches
- **Full control**: Style everything exactly as needed
- **RSC native**: Works seamlessly with Server Components
- **Maintainable**: Single styling paradigm throughout the codebase

## React Aria Components

- **Accessible UI foundation** - React Aria Components provide the behavior and accessibility
- **Unstyled by default** - We style them with TailwindCSS for complete control
- **Official Tailwind plugin** - `tailwindcss-react-aria-components` integrates seamlessly
- **WAI-ARIA compliant** - Full accessibility support out of the box
- **Import from `react-aria-components`**: `import { Button, TextField, Dialog } from "react-aria-components"`
- **Focus on composition** - Combine behavior (RAC) with styling (Tailwind)
- **Examples**: Button, TextField, Select, Dialog, Modal, Popover, Menu, Table, etc.
