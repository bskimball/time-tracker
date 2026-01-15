# AI Agent Context - Time Tracker Monorepo

This file helps AI coding assistants understand this monorepo project.

## Project Overview

A modern time tracking application monorepo with:

- **apps/web**: Main time tracking web app using React Router 7 with React Server Components (RSC) in Data mode
- **apps/marketing**: Marketing website built with Astro
- **packages/design-system**: Shared UI components using TailwindCSS v4 and React Aria Components

## Monorepo Structure

### Apps

#### Web App (`apps/web`)

**Tech Stack:**
- React Router 7.9.4 with React Server Components (RSC) in Data mode
- React 19.2.0 with Server Components support
- Hono web framework
- Node.js 22.6+ with native TypeScript support
- Vite build tool
- Prisma ORM with PostgreSQL
- TailwindCSS v4 + React Aria Components design system

**Key Features:**
- User authentication and authorization
- Task management and time tracking
- Employee management
- Reporting and analytics
- Optimistic UI updates
- Request-scoped logging with Pino

**Architecture Notes:**
- Uses RSC Data mode (experimental) - React Router acts as client to React Server
- Server components run on server, client components hydrate in browser
- Data fetching happens directly in async Server Components
- Authentication via React Router middleware (not in components)
- Server actions for form submissions with optimistic updates

**Critical Patterns:**
- DO NOT use `loader` functions (causes hanging in RSC Data mode)
- DO NOT return redirects from `fetchServer` (use middleware instead)
- DO NOT throw redirects in Server Components
- Fetch data directly in async Server Components using `await`
- Use middleware for authentication/authorization

#### Marketing Site (`apps/marketing`)

**Tech Stack:**
- Astro 5.16.4
- React 19.2.1 (for interactive components)
- TailwindCSS v4
- Node.js 24+

**Features:**
- Static marketing pages (features, pricing, index)
- Built with Astro for fast static generation
- Uses shared design system components

### Packages

#### Design System (`packages/design-system`)

**Tech Stack:**
- TypeScript
- TailwindCSS v4
- React Aria Components
- Tsup for building

**Components:**
- Button (variants: primary, secondary, outline, ghost, error)
- Input/TextField with validation
- Card components
- Alert components
- Built for RSC compatibility

## Development Setup

### Docker Compose

- `docker compose --profile dev up` - Start all development services
- `docker compose --profile prod up` - Start production services
- Services: postgres, app-dev, app-prod, marketing-dev, marketing-prod

### Environment

- Node.js 22.6+ required for native TypeScript
- PostgreSQL via Docker
- Environment variables: POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB (with defaults)
- App-specific `.env` files in each app directory for local development

## Important Commands

### Root Level
- `npm run build` - Build all packages and apps
- `docker compose --profile dev up` - Start dev environment

### Web App (`apps/web`)
- `npm run dev` - Start dev server (port 5173)
- `npm run build` - Build for production
- `npm start` - Run production server (port 3000)
- `npm run typecheck` - TypeScript checking
- `npm run lint` - ESLint
- `npm run format` - Prettier formatting
- `npm run check` - Full quality check

### Marketing (`apps/marketing`)
- `npm run dev` - Start dev server (port 4321)
- `npm run build` - Build static site
- `npm run preview` - Preview built site
- `npm run lint` - Lint code with ESLint

### Design System (`packages/design-system`)
- `npm run build` - Build package
- `npm run dev` - Watch mode

## Code Quality

### Linting & Formatting
- ESLint with RSC-aware rules
- Prettier with tab indentation
- TypeScript strict mode
- Special rules for design system components

### Testing
- Follow testing patterns in `apps/web/guides/TESTING_GUIDE.md`

## Database

- **Prisma** for ORM and migrations
- **PostgreSQL** database
- Schema in `apps/web/prisma/schema.prisma`
- Commands: `npx prisma db push`, `npx prisma generate`, `npx prisma studio`

## Deployment

- Docker Compose for both dev and prod
- Multi-stage Dockerfiles for optimized images
- Production builds use Node.js native TypeScript

## Key Patterns

### RSC Data Mode (Web App)
- Server components for data fetching and static content
- Client components only for interactivity
- Request context via AsyncLocalStorage
- Middleware for auth, not components
- Server actions with `useActionState` and `useOptimistic`

### Shared Design System
- Pure TailwindCSS + React Aria Components
- RSC-compatible components
- Type-safe APIs
- Accessible by default

### Monorepo Management
- Root `package.json` for shared scripts
- Docker Compose at root for all services
- Shared environment variables
- Cross-app consistency

## Documentation

- `apps/web/guides/` - Web app specific guides
- `guides/` - Monorepo-level docs
- `AGENTS.md` - This file (AI context)
- `README.md` - General overview

## AI Agent Skills Utilized

- **Data Analyst**: Database schema analysis, query optimization
- **Product Management**: Feature planning, user stories
- **Database Engineer**: Prisma schema design, migrations
- **API Developer**: Hono routes, type-safe APIs
- **Frontend Developer**: RSC components, client interactions
- **Frontend Design**: TailwindCSS styling, design system usage

## Important Notes

- Experimental RSC technology - monitor React Router updates
- Node.js 22.6+ required for native TypeScript
- PostgreSQL required for full functionality
- Design system must be built before web app
- Docker Compose profiles: `dev` and `prod`