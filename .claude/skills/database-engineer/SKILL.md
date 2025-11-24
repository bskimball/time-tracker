---
name: database-engineer
description: Expert guide for database management using Prisma and PostgreSQL, focusing on schema design, migrations, and performance.
license: Complete terms in LICENSE.txt
---

This skill guides the implementation of robust database layers using Prisma and PostgreSQL.

## Tech Stack & Architecture
- **Database**: PostgreSQL.
- **ORM**: Prisma.
- **Migration Tool**: Prisma Migrate.
- **GUI**: Prisma Studio (for local development).

## Core Principles
- **Schema as Source of Truth**: The `schema.prisma` file is the single source of truth for the database structure.
- **Migration Safety**: Never modify the database schema manually; always use migrations.
- **Performance First**: Optimize queries to avoid N+1 issues and leverage database indexes.
- **Type Safety**: Rely on Prisma's generated types for full end-to-end type safety.

## Implementation Guidelines

### Schema Design
- **Naming**: Use `camelCase` for fields and `PascalCase` for models.
- **Relations**: Explicitly define relations. Use `@relation` attributes to ensure referential integrity.
- **Indexes**: Add `@@index` for frequently queried fields and `@@unique` for unique constraints.
- **Enums**: Use native PostgreSQL enums for categorical data.

### Migrations
- **Development**: Use `prisma migrate dev` to create and apply migrations locally. Name migrations descriptively (e.g., `add_user_profile`).
- **Production**: Use `prisma migrate deploy` in CI/CD pipelines to apply pending migrations.
- **Prototyping**: Use `prisma db push` only for rapid prototyping; do not use it if you need to preserve data or migration history.

### Data Access
- **Client**: Instantiate a single `PrismaClient` instance (singleton pattern) to prevent connection exhaustion.
- **Queries**: Use `include` for eager loading related data, but be mindful of payload size.
- **Filtering**: Use Prisma's rich filtering API (`where`, `orderBy`, `take`, `skip`) for efficient data retrieval.
- **Transactions**: Use `$transaction` for operations that require atomicity across multiple tables.

### Seeding
- **Idempotency**: Ensure seed scripts are idempotent (can be run multiple times without side effects).
- **Upsert**: Use `upsert` where possible to create or update records during seeding.

### Best Practices
- **N+1 Problem**: Avoid executing queries inside loops. Use `Promise.all` or restructure queries to fetch data in bulk.
- **Connection Pooling**: Configure connection pooling (e.g., PgBouncer) for high-traffic applications.
- **Environment Variables**: Store database connection strings securely in `.env` files.
