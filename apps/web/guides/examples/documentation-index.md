# Documentation Index

This document provides a quick reference to all documentation in this project.

## Core Documentation Files

### CLAUDE.md

**Location:** `/CLAUDE.md`
**Purpose:** Context file for Claude Code assistant
**Audience:** AI assistants working on the codebase

**Contents:**

- RSC Data Mode architecture overview
- Critical entry points (entry.rsc.tsx, entry.ssr.tsx, entry.browser.tsx)
- fetchServer requirements and patterns
- Server Components vs Client Components
- Common patterns (data fetching, server actions)
- Logging system overview
- Design system guidelines
- Development guidelines
- Code quality and formatting

### AGENTS.md

**Location:** `/AGENTS.md`
**Purpose:** AI agent context and project overview
**Audience:** AI coding assistants and automation tools

**Contents:**

- Project overview and tech stack
- RSC Data Mode detailed explanation
- Server vs Client component patterns
- Request access patterns (AsyncLocalStorage)
- Authentication patterns and middleware
- fetchServer requirements
- Logging system quick reference
- Documentation guides index
- Project structure
- Code style and formatting
- Commands and Docker Compose usage
- Prisma database information
- Design system (TailwindCSS + React Aria)
- Forms, server actions, and optimistic UI patterns

## Comprehensive Guides

Web-app guides live in `apps/web/guides/`.

Monorepo-wide progressive-disclosure agent docs live in `guides/agent/`.

### Architecture & Technical

#### apps/web/guides/ARCHITECTURE.md

**Complete application architecture reference**

- Application overview and key features
- Technical stack (React Router, Hono, Prisma, etc.)
- Architecture patterns (RSC Data mode, request flow)
- Application structure and file organization
- Routing architecture (role-based routes, redirects)
- Data model and relationships
- Authentication and authorization
- Development workflow
- Deployment and scaling
- Performance optimizations
- Security best practices
- Troubleshooting guide

### Logging

#### guides/LOGGING_GUIDE.md

**Comprehensive logging documentation (35+ sections)**

- Logging overview and features
- Configuration (environment variables, log levels)
- Usage patterns (8 different scenarios)
- Log rotation (development and production)
- Helper functions reference
- Best practices and anti-patterns
- Advanced usage (custom loggers, correlation IDs, sampling)
- Troubleshooting
- Integration with log aggregators (Datadog, Elasticsearch, CloudWatch)
- Quick reference table

#### guides/examples/dev-logging-example.md

**Development logging examples**

- Console vs file output comparison
- Common use cases
- Managing development logs
- Searching and filtering logs
- Example session walkthrough

#### guides/examples/logging-examples.tsx

**Code examples for logging**

- 8 complete code examples
- Server components, server actions, API routes
- Performance monitoring
- Multi-step operations
- Background jobs
- Conditional logging
- Structured logging patterns

### Routing

#### apps/web/guides/ROUTING_GUIDE.md

**Time clock routing and navigation**

- Route configuration
- Role-based access control
- Time clock interfaces (floor, kiosk, mobile)
- Device detection and redirects
- Route protection patterns

### Authentication

#### guides/AUTHENTICATION_GUIDE.md

**Authentication patterns in RSC Data mode**

- Middleware-based authentication
- Request context patterns
- Protecting routes
- Common pitfalls and solutions

### Testing

#### apps/web/guides/TESTING_GUIDE.md

**Testing strategies and examples**

- Server component testing
- Client component testing
- Database mocking
- Request helper utilities

### Code Quality

#### apps/web/guides/LINTING_GUIDE.md

**Code quality and formatting standards**

- ESLint configuration
- Prettier settings
- RSC-aware linting
- Design system awareness
- Editor integration

## Log Files

### Development

**Location:** `logs/dev.log`
**Format:** JSON
**Rotation:** None (manual cleanup)
**Contents:** All development logs (debug level)

### Production

**Location:** `logs/app.log`, `logs/error.log`
**Format:** JSON
**Rotation:** Daily and 10MB size limits
**Contents:** Application logs (info+) and errors only

### Viewing Logs

```bash
# Development
tail -f logs/dev.log

# Production
tail -f logs/app.log        # All logs
tail -f logs/error.log      # Errors only

# Search logs
cat logs/dev.log | grep '"level":"error"'
cat logs/dev.log | grep '"requestId":"abc-123"'
```

## Project Structure Reference

```
time-tracker/
├── apps/
│   ├── web/                   # React Router RSC application
│   │   ├── src/               # Application source code
│   │   │   ├── lib/
│   │   │   │   ├── logger.ts          # Logger configuration
│   │   │   │   ├── request-context.ts # Request-scoped logger
│   │   │   │   └── logging-helpers.ts # Logging utilities
│   │   │   ├── entry.rsc.tsx          # RSC entry point
│   │   │   ├── entry.ssr.tsx          # SSR entry point
│   │   │   └── entry.browser.tsx      # Client entry point
│   │   ├── prisma/            # Database schema and migrations
│   │   ├── guides/            # Documentation directory
│   │   │   ├── ARCHITECTURE.md        # Complete architecture
│   │   │   ├── LOGGING_GUIDE.md       # Logging documentation
│   │   │   ├── ROUTING_GUIDE.md       # Routing guide
│   │   │   ├── AUTHENTICATION_GUIDE.md       # Auth patterns
│   │   │   ├── TESTING_GUIDE.md       # Testing guide
│   │   │   ├── LINTING_GUIDE.md       # Code quality
│   │   │   └── examples/              # Code examples
│   │   ├── logs/              # Application logs
│   │   │   ├── dev.log                # Development logs
│   │   │   ├── app.log                # Production logs
│   │   │   └── error.log              # Production errors
│   │   └── server.js          # Production server
│   └── marketing/             # Astro marketing site
│       ├── src/               # Marketing site source
│       └── package.json       # Marketing dependencies
├── packages/
│   ├── design-system/         # Shared UI components
│   └── config/                # Shared configurations (planned)
├── guides/                    # Monorepo documentation
│   └── agent/README.md           # Progressive-disclosure agent docs
├── CLAUDE.md                  # AI assistant context
├── AGENTS.md                  # AI agent context
└── package.json               # Root workspace configuration
```

## Quick Links

### For AI Assistants

- Start with: `CLAUDE.md` or `AGENTS.md`
- Monorepo agent docs: `guides/agent/README.md`
- Web architecture: `apps/web/guides/ARCHITECTURE.md`
- Logging: `guides/LOGGING_GUIDE.md`

### For Developers

- Getting started: `guides/agent/README.md`
- Logging patterns: `guides/LOGGING_GUIDE.md`
- Testing: `apps/web/guides/TESTING_GUIDE.md`
- Code style: `apps/web/guides/LINTING_GUIDE.md`

### For Operations

- Deployment: `guides/agent/deployment.md`
- Logging: `guides/LOGGING_GUIDE.md` (Log rotation, aggregation)
- Troubleshooting: `guides/agent/troubleshooting.md`

## Environment Variables Reference

### Logging

```bash
LOG_LEVEL=debug              # debug, info, warn, error
LOG_DB_QUERIES=true          # Enable database query logging
```

### Application

```bash
PORT=3000                    # Server port
NODE_ENV=development         # development, production, test
DATABASE_URL=...             # Database connection string
```

## Common Tasks

### View Documentation

```bash
# Monorepo agent docs
cat guides/agent/README.md

# Logging guide
cat guides/LOGGING_GUIDE.md

# All guides
ls -la guides/
```

### View Logs

```bash
# Development logs
tail -f logs/dev.log

# Production logs
tail -f logs/app.log

# Search for errors
grep '"level":"error"' logs/dev.log
```

### Code Examples

```bash
# Logging examples
cat guides/examples/logging-examples.tsx

# Development logging
cat guides/examples/dev-logging-example.md
```

---

**Note:** All documentation files use Markdown format and are kept in sync with the actual implementation. When making architectural changes, update the relevant guide(s) and the AI context files (CLAUDE.md, AGENTS.md).
