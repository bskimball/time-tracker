# Application Architecture Guide

This guide provides a comprehensive overview of the Time Tracker application architecture, including its technical stack, routing structure, data model, and deployment patterns.

## Table of Contents

1. [Overview](#overview)
2. [Technical Stack](#technical-stack)
3. [Architecture Patterns](#architecture-patterns)
4. [Application Structure](#application-structure)
5. [Routing Architecture](#routing-architecture)
6. [Data Model](#data-model)
7. [Authentication & Authorization](#authentication--authorization)
8. [Development Workflow](#development-workflow)
9. [Deployment](#deployment)

## Overview

Time Tracker is a **fulfillment warehouse time tracking and management system** built with React Server Components (RSC) in Data mode. It provides role-based dashboards for different user types:

**Upstream Starting Point:** [https://github.com/bskimball/react-router-rsc-hono/tree/master/src](https://github.com/bskimball/react-router-rsc-hono/tree/master/src)

- **Workers** - Time clock interface for clocking in/out
- **Managers** - Employee monitoring, reports, and task management
- **Admins/Executives** - Analytics, capacity planning, and system settings

### Key Features

- PIN-based employee time tracking
- Kiosk mode for dedicated terminals
- Real-time employee monitoring
- Comprehensive reporting and analytics
- Task and performance tracking
- Multi-station warehouse support
- Mobile and desktop interfaces

## Technical Stack

### Core Framework

- **React 19.2.0** - React Server Components support
- **React Router 7.9.5** - RSC Data mode routing
- **Vite 7.2.2** - Build tool and dev server
- **@vitejs/plugin-rsc 0.5.1** - Vite RSC plugin

### Server

- **Hono 4.10.4** - Fast, lightweight server framework
- **Node.js 22.6+** - Required for native TypeScript support
- **@hono/node-server** - Node.js adapter for Hono

### Database

- **Prisma 6.19.0** - Type-safe ORM
- **MySQL** - Relational database
- **Redis (ioredis)** - Session storage and caching

### Authentication

- **Lucia 3.2.2** - Session-based authentication
- **Arctic 3.7.0** - OAuth provider integration
- **bcrypt 6.0.0** - Password hashing (for PINs)

### UI/Styling

- **TailwindCSS 4.1.14** - Utility-first CSS framework
- **React Aria Components 1.13.0** - Accessible component primitives
- **Recharts 3.3.0** - Data visualization
- **Lucide React** - Icon library

### Development Tools

- **TypeScript 5.9.3** - Type safety
- **Vitest 4.0.7** - Unit testing
- **ESLint 9.39.1** - Linting with RSC awareness
- **Prettier 3.6.2** - Code formatting

## Architecture Patterns

### React Server Components (RSC) Data Mode

This application uses React Router's **RSC Data mode**, an experimental architecture where React Router acts as the client to a React Server.

#### Key Characteristics

1. **No Loaders** - Data fetching happens directly in async Server Components
2. **Server Actions** - Mutations handled via "use server" functions
3. **Streaming** - RSC payload streamed to client for progressive rendering
4. **Automatic Code Splitting** - Server/client boundary defined by "use client"

#### Request Flow

```
User Request
    ↓
Hono Server (server.js)
    ↓
entry.rsc.tsx → handler()
    ├─ Authentication check
    ├─ Role-based redirects
    └─ generateHTML()
        ↓
entry.ssr.tsx → routeRSCServerRequest()
    ├─ fetchServer() → matchRSCServerRequest()
    │   └─ Render Server Components to RSC payload
    └─ renderHTML() → RSCStaticRouter
        └─ Render HTML with embedded RSC payload
            ↓
Client (entry.browser.tsx)
    └─ Hydrate and handle client-side routing
```

### Critical Rule: fetchServer Must Return RSC Payload

**The `fetchServer` function in `entry.rsc.tsx` MUST always return a Response with an RSC payload body.**

❌ **NEVER do this:**

```typescript
async function fetchServer(request: Request) {
  if (needsAuth) {
    return Response.redirect(url, 302); // Has no RSC payload!
  }
  return matchRSCServerRequest({...});
}
```

✅ **ALWAYS do this:**

```typescript
export default async function handler(request: Request) {
  // Handle redirects BEFORE calling generateHTML
  if (needsAuth) {
    return Response.redirect(url, 302);
  }

  // Only call generateHTML when ready to render RSC
  const ssr = await import.meta.viteRsc.loadModule(...);
  return ssr.generateHTML(request, fetchServer);
}

async function fetchServer(request: Request) {
  // Always returns RSC payload
  return matchRSCServerRequest({...});
}
```

### File Organization Pattern

```
apps/web/src/routes/[route-name]/
├── route.tsx      # Server Component (async, data fetching)
├── client.tsx     # Client Components ("use client", interactivity)
└── actions.ts     # Server Actions ("use server", mutations)
```

**Server Components** (route.tsx):

- Async functions that fetch data directly
- Access to database, file system, env variables
- No React hooks, event handlers, or browser APIs
- Zero JavaScript bundle impact

**Client Components** (client.tsx):

- Interactive UI with React hooks
- Event handlers and browser APIs
- Context providers/consumers
- Adds to JavaScript bundle

**Server Actions** (actions.ts):

- Form submissions and mutations
- Database writes
- Return serializable data
- Called from Client Components

## Application Structure

```
rsc-hono-app/
├── prisma/
│   └── ../../prisma/schema.prisma           # Database schema (repo root)
├── src/
│   ├── components/
│   │   ├── ds/                 # Design system components
│   │   ├── mobile/             # Mobile-specific components
│   │   ├── header.tsx          # App header (with Nav)
│   │   ├── nav.tsx             # Role-based navigation
│   │   └── footer.tsx          # App footer
│   ├── layouts/
│   │   └── app-layout.tsx      # Shared layout wrapper
│   ├── lib/
│   │   ├── auth.ts             # Lucia authentication
│   │   ├── db.ts               # Prisma client
│   │   ├── middleware.ts       # Auth/role middleware
│   │   └── request-context.ts  # AsyncLocalStorage for requests
│   ├── routes/
│   │   ├── config.ts           # Route configuration
│   │   ├── auth/               # OAuth callbacks
│   │   ├── executive/          # Executive dashboard (ADMIN)
│   │   ├── manager/            # Manager dashboard (MANAGER)
│   │   ├── floor/              # Floor time clock (public)
│   │   ├── time-clock/         # Time clock shared components
│   │   ├── settings/           # Settings page (ADMIN)
│   │   ├── todo/               # Todo list
│   │   ├── login/              # Login page
│   │   └── logout/             # Logout handler
│   ├── entry.rsc.tsx           # React Server entry point
│   ├── entry.ssr.tsx           # SSR entry point
│   └── entry.browser.tsx       # Client hydration entry
├── guides/                     # Documentation
├── server.js                   # Hono production server
└── vite.config.ts              # Vite configuration
```

## Routing Architecture

### Route Configuration

Routes are defined in `apps/web/src/routes/config.ts` using React Router's configuration format with custom middleware support.

### Role-Based Routes

| Route               | Access Level   | Purpose                      |
| ------------------- | -------------- | ---------------------------- |
| `/`                 | Public         | Redirects based on auth/role |
| `/login`            | Public         | OAuth login page             |
| `/dev-login`        | Development    | Quick login for testing      |
| `/floor`            | Public         | Primary time clock interface |
| `/time-clock/kiosk` | Public         | Dedicated kiosk mode         |
| `/settings`         | ADMIN          | Station/employee management  |
| `/todo`             | Authenticated  | Todo list                    |
| `/manager/*`        | MANAGER, ADMIN | Management dashboard         |
| `/executive/*`      | ADMIN          | Executive analytics          |

### Home Route Redirects

The `/` route redirects users based on authentication and role (handled in `entry.rsc.tsx`):

```typescript
/ → Not authenticated → /login
/ → ADMIN → /executive
/ → MANAGER → /manager
/ → WORKER → /floor
```

### Manager Routes

All under `/manager` path, require MANAGER or ADMIN role:

- `/manager` - Dashboard with employee overview
- `/manager/monitor` - Real-time employee monitoring
- `/manager/employees` - Employee management
- `/manager/employees/:id` - Employee detail
- `/manager/employees/:id/edit` - Edit employee
- `/manager/employees/new` - Create employee
- `/manager/timesheets` - Timesheet management
- `/manager/tasks` - Task assignments
- `/manager/reports` - Comprehensive reporting

### Executive Routes

All under `/executive` path, require ADMIN role:

- `/executive` - Executive dashboard
- `/executive/analytics` - Advanced analytics and capacity planning

### Time Clock Routes

- `/floor` - Primary interface (device-aware, auto-redirects mobile)
- `/floor/time-clock/mobile` - Mobile-optimized interface
- `/time-clock` - Redirects to `/floor` (legacy compatibility)
- `/time-clock/kiosk` - Full-screen kiosk interface

**Key Differences:**

| Feature          | `/floor`               | `/time-clock/kiosk` |
| ---------------- | ---------------------- | ------------------- |
| Layout           | Container with heading | Full-screen         |
| Auth             | Employee selection     | PIN entry           |
| Auto-refresh     | Optional (60s)         | Always (60s)        |
| Device Detection | Yes                    | No                  |
| Use Case         | General access         | Dedicated terminals |

See `apps/web/guides/ROUTING_GUIDE.md` for detailed time clock routing information.

## Data Model

### Core Entities

#### User

- OAuth-based authentication
- Role-based access (ADMIN, MANAGER, WORKER)
- Optional link to Employee record

#### Employee

- Name, email, PIN hash
- Status (ACTIVE, INACTIVE, ON_LEAVE, TERMINATED)
- Station assignments (last, default)
- Performance metrics
- Time logs and task assignments

#### Station

- Predefined types (PICKING, PACKING, FILLING, RECEIVING, SHIPPING, QUALITY, INVENTORY)
- Zone and capacity tracking
- Associated tasks and employees

#### TimeLog

- Work sessions and breaks
- Employee and station tracking
- Clock method (PIN, CARD, BIOMETRIC, MANUAL)
- Soft delete for corrections
- Task linking

#### TaskAssignment

- Links employees to task types
- Assignment source metadata (`MANAGER` or `WORKER`) is stored in `source`
- Manager-created assignments store `assignedByUserId`; worker self-assignments leave it null
- Tracks units completed
- Performance calculations

### Task Assignment Policy (Operational Config)

`TASK_ASSIGNMENT_MODE` controls worker self-task actions from the floor UI and APIs.

| Mode                   | Worker behavior                                                            | Manager behavior                                                        |
| ---------------------- | -------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `MANAGER_ONLY`         | Workers cannot start/switch/end their own tasks.                           | Managers/admins can assign/switch/complete tasks from `/manager/tasks`. |
| `SELF_ASSIGN_ALLOWED`  | Workers can start/switch/end their own tasks after clock-in.               | Managers/admins can still assign/switch/complete tasks.                 |
| `SELF_ASSIGN_REQUIRED` | Workers can self-assign and are prompted to start a task while clocked in. | Managers/admins can still assign/switch/complete tasks for overrides.   |

### Activity Terminology (Manager Surfaces)

- **Clocked-in**: employee has an active `WORK` time log (`TimeLog.type = WORK` and `endTime = null`).
- **Floor-active**: employee is either clocked-in, has an active task assignment, or both.
- Use **floor-active** for manager operational visibility (`/manager/monitor`, `/manager/timesheets`), so task-only workers are still visible.

#### PerformanceMetric

- Daily employee metrics
- Hours worked, efficiency scores
- Overtime tracking

### Relationships

```
User 1──0..1 Employee
     │
     └──* OAuthAccount
     └──* Session

Employee ──* TimeLog
         └──* TaskAssignment
         └──* PerformanceMetric
         └──0..1 Station (default)
         └──0..1 Station (last)

Station ──* TimeLog
        └──* TaskType

TaskType ──* TaskAssignment

TaskAssignment ──* TimeLog
```

## Authentication & Authorization

### Authentication Flow

1. **OAuth Login** - Google/Microsoft OAuth via Arctic
2. **Session Creation** - Lucia creates session, stores in Redis
3. **User Record** - User record linked to Employee (optional)
4. **Session Cookie** - HttpOnly cookie sent to browser

### Authorization Middleware

Defined in `apps/web/src/lib/middleware.ts`:

- **authMiddleware** - Ensures user is authenticated
- **roleMiddleware(roles)** - Ensures user has required role

Applied in route config:

```typescript
{
  path: "manager",
  middleware: [authMiddleware, roleMiddleware(["MANAGER", "ADMIN"])],
  lazy: () => import("./manager/layout.tsx")
}
```

### PIN Authentication

Floor workers can use PIN-based authentication:

- PIN hashes stored in Employee table
- No User record required
- Limited access (time clock only)

## Development Workflow

### Commands

```bash
# Development
npm run dev              # Start dev server (port 5173)

# Building
npm run build            # Build for production

# Production
npm start                # Run production server

# Code Quality
npm run format           # Format with Prettier
npm run lint             # Lint with ESLint
npm run lint:fix         # Auto-fix linting issues
npm run typecheck        # Check TypeScript types
npm run check            # Run all checks (format + lint + typecheck)

# Testing
npm test                 # Run tests with Vitest
```

### Environment Variables

Required in `.env`:

```bash
# Database
DATABASE_URL="mysql://user:password@localhost:3306/dbname"

# Redis (Session Storage)
REDIS_HOST="localhost"
REDIS_PORT="6379"

# OAuth (Optional)
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
MICROSOFT_CLIENT_ID="..."
MICROSOFT_CLIENT_SECRET="..."

# Application
NODE_ENV="development"
```

### Development Server

- **Port**: 5173
- **HMR**: Full hot module replacement support
- **RSC Streaming**: Live updates for Server Components
- **Vite Dev Server**: Fast rebuilds with Vite

### Testing

Tests use Vitest with React Testing Library:

- Server Component testing (async)
- Client Component testing (interactive)
- Database mocking via `vi.mock`
- Request helper utilities

See `apps/web/guides/TESTING_GUIDE.md` for detailed testing patterns.

## Deployment

### Build Process

```bash
npm run build
```

Produces:

- `dist/client/` - Client bundle
- `dist/server/` - Server bundle
- `dist/api/` - API server bundle

### Production Server

```bash
npm start
```

Runs `server.js` with:

- Hono server on port 3000 (default)
- Compression enabled
- Static file serving
- RSC streaming

### Environment Checklist

- [ ] `DATABASE_URL` configured
- [ ] `REDIS_HOST` and `REDIS_PORT` configured
- [ ] OAuth credentials (if using OAuth)
- [ ] `NODE_ENV=production`
- [ ] Database migrations run (`npx prisma migrate deploy`)
- [ ] Build completed (`npm run build`)

### Scaling Considerations

- **Stateless Server** - Sessions in Redis, can scale horizontally
- **Database Connection Pooling** - Configure in Prisma
- **Redis Clustering** - For high availability
- **CDN** - Serve static assets from CDN
- **Load Balancer** - Distribute traffic across instances

## Performance Optimizations

### Server Components

- **Zero JS for static content** - Pure HTML for non-interactive parts
- **Parallel data fetching** - Use Promise.all for concurrent queries
- **Streaming** - Progressive rendering with Suspense boundaries

### Background Jobs

- **Performance Scheduler** - Runs every 30 minutes in development
- Calculates employee metrics
- Updates PerformanceMetric table

### Caching

- **Redis Session Cache** - Fast session lookups
- **Database Query Optimization** - Indexed fields, optimized queries
- **Component Memoization** - React Compiler enabled

## Security

### Best Practices

- **No secrets in client** - Environment variables stay on server
- **CSRF Protection** - Built into Lucia sessions
- **SQL Injection** - Prevented by Prisma parameterization
- **XSS Prevention** - React escapes by default
- **Password Hashing** - bcrypt for PINs
- **HttpOnly Cookies** - Session cookies not accessible to JS

### Authentication Security

- OAuth tokens encrypted in database
- Session expiration enforced
- Role-based access control
- PIN rate limiting (recommended to add)

## Related Documentation

- **`CLAUDE.md`** - RSC architecture and development guidelines
- **`apps/web/guides/ROUTING_GUIDE.md`** - Detailed time clock routing
- **`apps/web/guides/AUTHENTICATION_GUIDE.md`** - Authentication patterns in RSC
- **`apps/web/guides/TESTING_GUIDE.md`** - Testing strategies and examples
- **`apps/web/guides/LINTING_GUIDE.md`** - Code quality and formatting

## Future Enhancements

### Planned Features

1. **Real-time Updates** - WebSocket support for live monitoring
2. **Offline Mode** - Service worker for offline time clock
3. **Mobile App** - Native iOS/Android apps
4. **Advanced Analytics** - ML-based productivity predictions
5. **API Gateway** - RESTful API for third-party integrations
6. **Multi-tenant** - Support multiple warehouses
7. **Automated Scheduling** - Employee shift scheduling
8. **Compliance Reports** - OSHA, labor law compliance

### Technical Debt

- Add rate limiting for PIN authentication
- Implement request caching layer
- Add error boundaries at route level
- Improve loading states with Suspense
- Add comprehensive E2E tests
- Document API endpoints
- Add performance monitoring (APM)

## Troubleshooting

### Common Issues

**Build Errors**

- Ensure Node.js 22.6+ is installed
- Clear `node_modules` and reinstall
- Check for TypeScript errors with `npm run typecheck`

**Database Connection Issues**

- Verify `DATABASE_URL` is correct
- Ensure MySQL is running
- Run migrations: `npx prisma migrate deploy`

**Session Issues**

- Check Redis is running
- Verify `REDIS_HOST` and `REDIS_PORT`
- Clear Redis cache if needed

**Route Not Found**

- Check `apps/web/src/routes/config.ts` for route definition
- Verify middleware isn't blocking access
- Check authentication state

**RSC Errors**

- Never return redirects from `fetchServer`
- Handle redirects in main handler before `generateHTML`
- Ensure Server Components are async
- Don't use hooks in Server Components

## Contributing

### Code Style

- **Indentation**: Tabs (2 space width)
- **Quotes**: Double quotes
- **Line Length**: 100 characters
- **Semicolons**: Required

### Pull Request Process

1. Create feature branch
2. Run `npm run check` before committing
3. Write/update tests for new features
4. Update documentation
5. Submit PR with clear description

### Architecture Decisions

When adding features:

- Prefer Server Components for static content
- Use Client Components only for interactivity
- Follow existing file structure patterns
- Use design system components from `~/components/ds`
- Document breaking changes
