---
title: API Authentication
description: How to authenticate requests to the Time Tracker REST API.
---

## Authentication method

- Header name: `x-api-key`
- API key source: administrator-generated key from `/settings/api-keys`
- Environment binding used by the API service: `TIME_CLOCK_API_KEY`

## Which routes require API keys

- Required for almost all `/api/*` endpoints.
- `/api/health` is intentionally open for health checks.
- `/api/realtime/manager-stream` uses signed-in manager/admin identity instead of API key auth.

## Request example

```bash
curl -X GET "https://your-domain.example/api/employees" \
  -H "x-api-key: YOUR_API_KEY"
```

## Failure behavior

- Missing key: `401 Unauthorized`
- Invalid key: `401 Unauthorized`
- Forbidden role on manager stream: `403 Forbidden`

## Key management best practices

- Use separate keys per integration system.
- Store keys in your secret manager, never in client-side code.
- Rotate keys during incident response and scheduled security reviews.
- Revoke unused keys in `/settings/api-keys`.

## Related docs

- [REST API and OpenAPI](/api/rest-openapi)
- [Endpoint Reference](/api/endpoint-reference)
