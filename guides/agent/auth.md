# Auth & Request Context (Agent Guide)

## Core idea

In React Router RSC Data mode, route components don’t reliably receive a `request` prop. This repo uses **request-scoped context** so server-side code can access the current request without threading it through props.

## Pattern used here

- Request context implemented with Node.js `AsyncLocalStorage`
- Auth helpers attempt to read the request from context when one isn’t passed explicitly

## Practical guidance

- Prefer calling auth helpers without manually passing `request` unless you’re in a low-level entry point.
- If you see failures like “request not available”, check that the RSC render is wrapped in the request context boundary.

## Related

- RSC rules: [web-rsc-data-mode.md](./web-rsc-data-mode.md)
