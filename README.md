# Time Tracker Monorepo

A modern time tracking application built with React Server Components, featuring a web app and marketing site in a monorepo structure.

## Overview

This monorepo contains:

- **apps/web**: Main time tracking application built with React Router 7 and React Server Components
- **apps/marketing**: Marketing website built with Astro
- **packages/design-system**: Shared UI components and styling

## Tech Stack

- **Frontend**: React 19, React Router 7 (RSC), Astro
- **Backend**: Hono, Node.js 22.6+, Prisma
- **Database**: PostgreSQL
- **Styling**: TailwindCSS v4, React Aria Components
- **DevOps**: Docker, Docker Compose
- **Quality**: TypeScript, ESLint, Prettier

## Getting Started

### Prerequisites

- Node.js 22.6+
- Docker and Docker Compose
- PostgreSQL (via Docker)

### Setup

1. Clone the repository
2. Set environment variables (see Environment Variables section)
3. Start development environment: `docker compose --profile dev up`
4. The web app will be available at `http://localhost:5173`
5. The marketing site will be available at `http://localhost:4321`

### Development Commands

- `docker compose --profile dev up` - Start all dev services
- `docker compose --profile dev up postgres` - Start only database
- `docker compose down` - Stop all services

### Apps

#### Web App (`apps/web`)

Time tracking application with user management, task assignments, and reporting.

- **Dev server**: `http://localhost:5173`
- **Commands**: `cd apps/web && npm run dev`
- **Build**: `cd apps/web && npm run build`

#### Marketing Site (`apps/marketing`)

Public marketing website for the time tracker.

- **Dev server**: `http://localhost:4321`
- **Commands**: `cd apps/marketing && npm run dev`
- **Build**: `cd apps/marketing && npm run build`
- **Lint**: `cd apps/marketing && npm run lint`

### Packages

#### Design System (`packages/design-system`)

Shared UI components built with TailwindCSS and React Aria Components.

- **Build**: `cd packages/design-system && npm run build`
- **Publish**: `cd packages/design-system && npm publish`

## Project Structure

```
├── apps/
│   ├── web/           # Main time tracking app
│   └── marketing/     # Marketing website
├── packages/
│   └── design-system/ # Shared UI components
├── docker-compose.yml # Docker services
├── package.json       # Root dependencies
└── README.md          # This file
```

## Deployment

### Production

1. Build all apps: `npm run build` (from root)
2. Start production services: `docker compose --profile prod up`

### Environment Variables

**For Docker (optional, defaults provided):**
Set these in your shell or `.bashrc` for Docker Compose:

```bash
export POSTGRES_USER=your_db_user
export POSTGRES_PASSWORD=your_db_password
export POSTGRES_DB=time_tracker
```

**For Local Development:**
- `apps/web/.env`: Contains `DATABASE_URL` for local database connection
- `apps/marketing/.env`: Contains marketing-specific variables (if any)

**Defaults (if not set):**
- POSTGRES_USER: postgres
- POSTGRES_PASSWORD: password
- POSTGRES_DB: time_tracker

## Contributing

1. Follow the existing code style and patterns
2. Use the shared design system for UI components
3. Test changes in both apps
4. Update documentation as needed

## Documentation

- `apps/web/guides/` - Web app specific guides
- `guides/` - Monorepo-level documentation