# Testing (Agent Guide)

## Stack

- Runner: Vitest
- DOM environment: happy-dom
- Component testing: React Testing Library

## What to test

- **Server Components**: call them as async functions; assert database calls and branching.
- **Client Components**: use React Testing Library for interactions.
- **Server Actions**: call actions with `FormData` like production usage.
- **API routes**: test request/response behavior.

## Key RSC testing rule

- Don’t test Server Components by “rendering” them like client components.

## Running tests

- Repo root (if wired): `npm test` or `npm run test --workspace=web`
- Web app: `cd apps/web && npm run test`

## Mocking guidance

- Mock external dependencies (db/auth) consistently.
- Reset mocks between tests.
