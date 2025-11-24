---
name: api-developer
description: Expert guide for building REST APIs using Hono, Zod, and Prisma with OpenAPI compliance.
license: Complete terms in LICENSE.txt
---

This skill guides the implementation of backend services and APIs.

## Tech Stack & Architecture
- **Framework**: Hono (REST API).
- **Validation**: Zod.
- **ORM**: Prisma.
- **Documentation**: Swagger UI / OpenAPI.

## Core Principles
- **OpenAPI First**: Adhere strictly to the OpenAPI specification.
- **Type Safety**: Use Zod for runtime validation and type inference.
- **RESTful Design**: Follow standard REST patterns for resource management.

## Implementation Guidelines

### API Design
- **Hono**: Use Hono for defining routes and middleware.
- **Zod Validator**: Use `@hono/zod-validator` for request validation.
- **OpenAPI**: Define schemas and routes using Hono's OpenAPI middleware or helpers to generate the spec automatically.

### Data Access
- **Prisma**: Use Prisma Client for database interactions.
- **Schema**: Maintain `schema.prisma` as the source of truth for the data model.

### Documentation
- **Swagger UI**: Expose a Swagger UI endpoint to visualize and test the API.
- **Spec**: Ensure the OpenAPI JSON/YAML spec is available and up-to-date.

### Best Practices
- **Error Handling**: Implement global error handling in Hono.
- **Middleware**: Use Hono middleware for logging, auth, and cors.
