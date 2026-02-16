---
title: Realtime Streaming
description: Use the manager realtime SSE stream for live operational views.
---

Time Tracker exposes a Server-Sent Events (SSE) endpoint for manager-facing live updates.

## Endpoint

- `GET /api/realtime/manager-stream`

## Access and authorization

- Requires authenticated user session context.
- Allowed roles: `MANAGER` or `ADMIN`.
- Returns `401` when not authenticated.
- Returns `403` when authenticated but not authorized.

## Scopes

Optional query parameter:

- `scopes=tasks,monitor,all`

Behavior:

- If omitted, defaults to `all`.
- Invalid or unknown scopes are ignored.
- Scope filtering applies per event.

## Event stream behavior

- Content type: `text/event-stream`
- Includes retry hint (`retry: 2000`).
- Emits event IDs for client-side logging, ordering, or deduplication. The server does not currently use `Last-Event-ID` to replay missed events.
- Intended for manager portal live indicators and floor monitoring.

## Minimal JavaScript example

```js
const stream = new EventSource('/api/realtime/manager-stream?scopes=monitor,tasks');

stream.addEventListener('task_assignment_changed', (event) => {
  const payload = JSON.parse(event.data);
  console.log('Task assignment changed:', payload);
});

stream.addEventListener('heartbeat', (event) => {
  const payload = JSON.parse(event.data);
  console.log('Heartbeat:', payload);
});

stream.onerror = () => {
  console.warn('Realtime stream disconnected; browser will retry automatically.');
};
```

## Integration guidance

- Use SSE for operational dashboards where low-latency state updates matter.
- Keep REST API polling as a fallback in restricted network environments.
- Avoid opening redundant streams per browser tab unless required.

## Related docs

- [REST API and OpenAPI](/api/rest-openapi)
- [Endpoint Reference](/api/endpoint-reference)
