# Time Clock Routing Guide

This guide explains the time clock routing structure in the application after consolidation.

## Route Overview

The application now uses a simplified, consolidated routing structure for time tracking:

### Primary Routes

#### 1. `/floor` - Primary Time Clock Interface
**Location:** `src/routes/floor/index/route.tsx`

**Purpose:** Main entry point for floor time tracking

**Features:**
- Device-aware (auto-redirects mobile devices to `/floor/time-clock/mobile`)
- Clean interface without header/footer
- Uses shared `TimeTracking` component from `src/routes/time-clock/client.tsx`
- Includes `KioskRedirect` for automatic kiosk mode detection
- Seeds demo data (employees & stations) if database is empty
- Public access (no authentication required)

**When to use:**
- Primary link from login page ("Continue as Guest")
- Floor workers accessing from any device
- Clean, focused time tracking experience

**Data fetched:**
- All employees (ordered by name)
- All stations (ordered by name)
- Active work sessions
- Active breaks
- Completed time logs (last 30 days)

#### 2. `/time-clock/kiosk` - Dedicated Kiosk Mode
**Location:** `src/routes/time-clock/kiosk/route.tsx`

**Purpose:** Full-screen kiosk interface for dedicated time-clock terminals

**Features:**
- Uses specialized `KioskTimeClock` component from `src/routes/time-clock/kiosk/client.tsx`
- Optimized for kiosk mode workflow
- Auto-redirects from `/floor` when kiosk mode is enabled in localStorage
- PIN-based employee identification
- Offline support with action queue
- No header/footer (full-screen experience)
- Public access (no authentication required)

**When to use:**
- Dedicated kiosk terminals
- Auto-activated when user enables "Kiosk Mode" on `/floor`
- Touch-friendly interface for shared devices

**Key Features:**
- PIN authentication for employees
- Offline action queue (syncs when online)
- Auto-refresh every 60 seconds
- Battery monitoring for mobile devices
- Simplified, large-button interface

#### 3. `/time-clock` - Legacy Redirect
**Location:** `src/routes/time-clock/route.tsx`

**Purpose:** Maintains backward compatibility with old URLs

**Behavior:** Permanently redirects (301) to `/floor`

**Why:**
- Ensures old bookmarks/links continue to work
- Clean URL consolidation
- Prevents confusion from duplicate routes

### Supporting Routes

#### `/floor/time-clock/mobile`
**Purpose:** Mobile-optimized time tracking interface

**Access:** Auto-redirect from `/floor` when mobile device is detected

**Features:**
- Touch-optimized UI
- Mobile-specific components
- Responsive design for small screens

## Route Architecture

### Server Component Pattern

All routes follow the RSC (React Server Components) Data mode pattern:

```typescript
// ✅ CORRECT - Async Server Component
export default async function Component() {
  // Fetch data directly
  const employees = await db.employee.findMany({...});

  // Return JSX with data
  return <ClientComponent data={employees} />;
}

// ❌ WRONG - Loader pattern (causes hanging in RSC Data mode)
export async function loader() {
  return { data: await fetchData() };
}
```

### Client Component Separation

Client components are separated into dedicated files:

- **Server Components:** `route.tsx` files (data fetching, server-only logic)
- **Client Components:** `client.tsx` files (interactivity, hooks, browser APIs)
- **Server Actions:** `actions.ts` files (mutations, form handling)

### Shared Components

The time clock interface uses shared components:

```
src/routes/time-clock/
├── actions.ts           # Shared server actions (clockIn, clockOut, etc.)
├── client.tsx           # Shared TimeTracking client component
├── context.tsx          # Kiosk context provider
├── hooks.ts             # Shared hooks (useKioskMode, useAutoRefresh)
├── notifications.ts     # Toast notification system
├── offline-queue.ts     # Offline action queue
├── utils.ts             # Utility functions
└── kiosk-redirect.tsx   # Kiosk mode redirect logic
```

## Request Flow

### Standard Flow (Desktop)

```
1. User clicks "Continue as Guest" on /login
2. Router navigates to /floor
3. Server Component:
   - Checks if mobile device (User-Agent) → redirects if yes
   - Checks localStorage for kiosk mode → redirects if enabled
   - Fetches employees, stations, time logs from database
   - Seeds demo data if database is empty
4. Returns TimeTracking client component with data
5. Client component hydrates with interactivity
```

### Mobile Flow

```
1. User navigates to /floor
2. Server detects mobile User-Agent
3. Throws redirect Response to /floor/time-clock/mobile
4. Mobile-optimized interface loads
```

### Kiosk Mode Flow

```
1. User navigates to /floor
2. Client component checks localStorage for 'timeClock:kioskMode'
3. If enabled, KioskRedirect component navigates to /time-clock/kiosk
4. Dedicated kiosk interface loads
5. PIN-based employee authentication active
```

## Key Differences Between Routes

| Feature | `/floor` | `/time-clock/kiosk` |
|---------|----------|---------------------|
| Layout | Container with heading | Full-screen, no chrome |
| Navigation | Standard | None (kiosk mode) |
| Auth Method | Select employee | PIN entry |
| Auto-refresh | 60s (if kiosk enabled) | Always (60s) |
| Offline Support | Yes | Enhanced (action queue) |
| Device Detection | Yes (mobile redirect) | No |
| Primary Use | General floor access | Dedicated terminals |

## URL Structure

```
/floor                          # Primary time clock interface
/floor/time-clock/mobile        # Mobile-optimized interface
/time-clock                     # Redirects to /floor
/time-clock/kiosk               # Dedicated kiosk mode
/time-clock/reports             # Time tracking reports (separate feature)
```

## Migration Notes

### Before Consolidation

The application had **four overlapping routes**:

1. `/time-clock` - Full layout with header/footer
2. `/time-clock/kiosk` - Kiosk interface
3. `/floor` - Clean interface without header/footer
4. `/floor/kiosk` - **BROKEN** (used loader pattern)

**Problems:**
- `/floor/kiosk` violated RSC architecture (loader caused hanging)
- Duplication between `/time-clock` and `/floor`
- Two different `KioskTimeClock` components
- Confusion about which route to use

### After Consolidation

**Simplified to two active routes:**

1. `/floor` - Primary interface (clean, device-aware)
2. `/time-clock/kiosk` - Dedicated kiosk mode

**Benefits:**
- No loader violations
- Single source of truth for components
- Clear purpose for each route
- Backward compatibility maintained via redirect

## Development Guidelines

### Adding New Time Clock Features

1. **Server-side logic:** Add to `src/routes/floor/index/route.tsx`
2. **Client-side interactivity:** Add to `src/routes/time-clock/client.tsx`
3. **Mutations:** Add to `src/routes/time-clock/actions.ts`
4. **Utilities:** Add to `src/routes/time-clock/utils.ts`

### Testing Routes

```bash
# Test primary route
npm run dev
# Visit http://localhost:5173/floor

# Test kiosk mode
# Visit http://localhost:5173/floor
# Enable kiosk mode in UI
# Should auto-redirect to /time-clock/kiosk

# Test mobile detection
# Visit http://localhost:5173/floor with mobile User-Agent
# Should redirect to /floor/time-clock/mobile

# Test backward compatibility
# Visit http://localhost:5173/time-clock
# Should redirect (301) to /floor
```

### Common Patterns

#### Adding a new action

```typescript
// src/routes/time-clock/actions.ts
"use server";

export async function newAction(prevState: any, formData: FormData) {
  const employeeId = formData.get("employeeId") as string;

  try {
    await db.someOperation({ data: { employeeId } });
    return { success: true, message: "Success!" };
  } catch (error) {
    return { error: "Failed to perform action" };
  }
}
```

#### Using the action in client component

```typescript
// src/routes/time-clock/client.tsx
"use client";

import { newAction } from "./actions";
import { useActionState } from "react";

function MyComponent() {
  const [state, formAction] = useActionState(newAction, null);

  return (
    <form action={formAction}>
      <input name="employeeId" required />
      <button type="submit">Submit</button>
    </form>
  );
}
```

## Troubleshooting

### Route not redirecting

**Issue:** `/time-clock` not redirecting to `/floor`

**Solution:** Check that the Response throw is not being caught. RSC uses thrown Responses for redirects.

### Kiosk mode not activating

**Issue:** Enabling kiosk mode doesn't redirect

**Solution:**
- Check localStorage: `window.localStorage.getItem('timeClock:kioskMode')`
- Ensure `KioskRedirect` component is rendered
- Check browser console for errors

### Mobile detection not working

**Issue:** Mobile devices not redirecting to mobile view

**Solution:**
- Verify User-Agent header is being sent
- Check server-side `isMobileDevice()` function
- Test with real mobile device or mobile User-Agent string

### Data not loading

**Issue:** Employees or stations not appearing

**Solution:**
- Check database connection
- Verify demo data seeding logic runs
- Check browser console for errors
- Verify network requests complete successfully

## Future Improvements

1. **Add route-level caching** - Cache employee/station data for better performance
2. **Add loading states** - Show loading indicators during data fetching
3. **Add error boundaries** - Graceful error handling at route level
4. **Add route-based permissions** - Fine-grained access control per route
5. **Add route analytics** - Track which routes are most used

## Related Documentation

- `CLAUDE.md` - Main architecture guide
- `RSC_AUTH_FIX.md` - Authentication patterns in RSC
- `TESTING_GUIDE.md` - Testing routes and components
