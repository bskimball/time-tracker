---
title: API Authentication
description: How to authenticate requests to the Time Tracker REST API.
---

## Authentication method

- Header name: `x-api-key`
- Current validation source: server environment variable `TIME_CLOCK_API_KEY`
- Note: `/settings/api-keys` currently manages app integration keys, but API middleware checks `TIME_CLOCK_API_KEY`

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

- Treat `TIME_CLOCK_API_KEY` as a shared integration secret and store it in a secret manager.
- Store keys in your secret manager, never in client-side code.
- Rotate the environment key during incident response and scheduled security reviews.
- Restart or redeploy services after key rotation so all API instances load the new value.

## Related docs

- [REST API and OpenAPI](/api/rest-openapi)
- [Endpoint Reference](/api/endpoint-reference)
