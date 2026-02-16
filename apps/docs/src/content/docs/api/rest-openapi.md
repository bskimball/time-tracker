---
title: REST API and OpenAPI
description: Integrate with Time Tracker using the OpenAPI-compliant REST API.
---

Time Tracker provides an OpenAPI 3.0-compliant REST API for integrations, automation, and reporting.

## Base API surface

- Base path: `/api`
- OpenAPI document: `/api/doc`
- Swagger UI: `/api/ui`
- Health endpoint: `/api/health`

## Accessing OpenAPI docs with API-key auth

- `/api/doc` and `/api/ui` are API-key protected.
- Some environments may not inject `x-api-key` automatically from Swagger UI when requesting `/api/doc`.
- Reliable workflow: fetch the spec with `curl` and open it in your preferred OpenAPI viewer.

```bash
curl -H "x-api-key: YOUR_API_KEY" https://your-domain.example/api/doc
```

## Authentication

- API key header: `x-api-key`
- Most API routes require a valid key.
- Use [API Authentication](/api/authentication) for setup and key handling.

## API capabilities

- Employees and stations lookup
- Time logs querying with filters
- Task type and task assignment lifecycle operations
- Performance metrics retrieval and upsert-style integration flows
- User and todo resources for operational extensions

## Realtime behavior

- Manager realtime stream is available at `/api/realtime/manager-stream`.
- This endpoint uses authenticated manager/admin user context and is not API-key gated.
- See [Realtime Streaming](/api/realtime-streaming) for details.

## Important current limitation

- `/api/time-clock` is currently a placeholder route and does not expose clock actions.
- Clock in/out and break flows are handled through web app workflows.

## Continue with API docs

- [API Authentication](/api/authentication)
- [Endpoint Reference](/api/endpoint-reference)
- [Realtime Streaming](/api/realtime-streaming)
