# Authentication Guide

**RSC Data Mode Authentication Patterns**

## Problem

The application was getting a 500 error: `TypeError: Cannot read properties of undefined (reading 'headers')` when trying to access the request object in Server Components.

## Root Cause

In **React Router RSC Data Mode**, route components **do not automatically receive a `request` prop**. This is different from traditional React Router patterns. The templates and documentation show that Server Components in RSC Data Mode just render without explicit request props.

## Solution

Implemented a **Request Context** pattern using Node.js `AsyncLocalStorage` to make the request object available throughout the component tree without explicitly passing it as props.

### Changes Made

1. **Created Request Context** (`apps/web/src/lib/request-context.ts`):
   - Uses Node.js `AsyncLocalStorage` to store request in async context
   - Provides `getRequest()` to access the current request
   - Provides `runWithRequest()` to wrap execution with request context

2. **Updated Auth Library** (`apps/web/src/lib/auth.ts`):
   - Made `request` parameter optional in auth functions
   - Functions now try to get request from context if not explicitly provided
   - Maintains backward compatibility with explicit request parameter

3. **Updated RSC Entry Point** (`src/entry.rsc.tsx`):
   - Wrapped `matchRSCServerRequest` call in `runWithRequest()`
   - This ensures the request is available in AsyncLocalStorage for all Server Components

4. **Updated Route Components**:
   - Removed `{ request }: { request: Request }` props from:
     - `apps/web/src/routes/dashboard/route.tsx`
     - `apps/web/src/routes/settings/route.tsx`
     - `apps/web/src/routes/time-clock/route.tsx`
     - `apps/web/src/routes/todo/route.tsx`
   - Now call `validateRequest()` without passing request parameter

## How It Works

```
Request Flow:
1. Request arrives at entry.rsc.tsx
2. fetchServer() wraps the RSC rendering with runWithRequest(request, ...)
3. All async operations within that context can access request via getRequest()
4. Server Components call validateRequest() which internally uses getRequest()
5. Session validation works without explicit prop passing
```

## Benefits

- ✅ Fixes the immediate error
- ✅ Follows RSC Data Mode patterns more closely
- ✅ Cleaner component signatures (no request prop needed)
- ✅ Backward compatible (can still pass request explicitly if needed)
- ✅ TypeScript safe

## Alternative Approaches Considered

1. **React's experimental `headers()` API**: Not yet stable enough
2. **Middleware pattern**: Would require restructuring the entire app
3. **Passing request through props**: Not the RSC Data Mode pattern

## Future Improvements

Consider implementing proper middleware or moving authentication checks to a higher level in the RSC pipeline, potentially at the route configuration level.
