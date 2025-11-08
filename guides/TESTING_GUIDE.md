# Testing Guide for React Router RSC Application

This document provides comprehensive guidance for testing this React Router RSC (React Server Components) application in Data mode.

## Test Setup Overview

The application uses **Vitest** as the testing framework with **React Testing Library** for component testing. The test suite is designed to respect the RSC architecture and covers all critical flows.

### Test Configuration

- **Framework**: Vitest 3.2.4
- **Environment**: happy-dom
- **Test Files**: Located in `src/__tests__/`
- **Coverage**: Reports in text and HTML formats

## Current Test Files

### 1. Service Layer Tests

- `src/__tests__/time-clock.service.test.ts` - Tests business logic for time tracking operations
- Tests all time clock operations (clock in, clock out, breaks, validation)

### 2. Server Component Tests

- `src/__tests__/routes/dashboard.test.tsx` - Tests dashboard server component data fetching
- `src/__tests__/routes/home.test.tsx` - Tests home route redirection logic

### 3. Client Component Tests

- `src/__tests__/routes/time-clock/clients.test.tsx` - Tests TimeTracking client component interactions
- `src/__tests__/routes/time-clock/actions.test.ts` - Tests server actions for mutations

### 4. API Route Tests

- `src/__tests__/routes/api.test.ts` - Tests all Hono API endpoints
- Covers authentication, validation, and error handling

### 5. Integration Tests

- `src/__tests__/integration/rsc-data-flow.test.tsx` - Tests RSC data flow
- `src/__tests__/integration/server-client-interactions.test.tsx` - Tests server-client component interactions

## Test Utilities

### Database Mocking

- `src/__tests__/utils/db-mocks.ts` - Mock Prisma client and test data
- Pre-configured mock data for employees, stations, time logs, etc.

### Authentication Mocks

- `src/__tests__/utils/auth-mocks.ts` - Mock authentication functions
- Mock sessions and users for testing

### Assertion Helpers

- `src/__tests__/utils/assert-helpers.ts` - Custom assertion functions
- Improves test readability and provides meaningful error messages

### Test Factories

- `src/__tests__/utils/factories.ts` - Factory functions for creating test data
- Builder patterns for complex test scenarios

## Testing Strategy

### 1. Server Components Testing

Server components run only on the server and have specific testing requirements:

```typescript
// ✅ Correct: Test data fetching patterns
test("fetches dashboard metrics correctly", async () => {
	// Mock database responses
	mockDb.employee.count.mockResolvedValue(10);
	mockDb.station.count.mockResolvedValue(5);

	// Test component execution
	await Dashboard();

	// Verify database calls
	expect(mockDb.employee.count).toHaveBeenCalled();
});

// ❌ Avoid: Traditional Jest component rendering
// Server components don't render like traditional React components
```

### 2. Client Component Testing

Client components use standard React Testing Library patterns:

```typescript
test("handles form interactions correctly", async () => {
  const user = userEvent.setup();
  render(<TimeTracking {...mockProps} />);

  // Test user interactions
  await user.click(screen.getByText("Select Employee"));
  expect(screen.getByDisplayValue("Select employee")).toBeInTheDocument();
});
```

### 3. Server Action Testing

Test server actions with FormData as they would be used:

```typescript
test("clocks in employee successfully", async () => {
	const formData = new FormData();
	formData.append("employeeId", "emp-1");
	formData.append("stationId", "station-1");

	const result = await clockIn(null, formData);
	expect(result).toEqual({ success: true });
});
```

### 4. API Endpoint Testing

Test Hono routes with proper HTTP request/response:

```typescript
test("handles authentication correctly", async () => {
	const res = await app.request("/employees", {
		method: "GET",
		headers: { "x-api-key": "wrong-key" },
	});

	expect(res.status).toBe(401);
});
```

## Important Testing Notes

### RSC Architecture Considerations

1. **No Loaders**: In RSC Data mode, loader functions cause hanging. Always fetch data directly in async Server Components.

2. **Server vs Client Boundaries**: Test server components differently from client components. Server components are functions that return JSX/JSX elements, not traditional React components.

3. **Data Flow**: Ensure tests respect the RSC data flow pattern: Server components fetch data → pass to client components → handle interactions.

### Mock Setup

Always mock external dependencies properly:

```typescript
// Mock database
vi.mock("~/lib/db", () => ({
  db: createMockDb(),
}));

// Mock authentication
vi.mock("~/lib/auth", () => ({
  validateRequest: vi.fn(() => Promise.resolve({ user: mockUser })),
}));

// Mock components
vi.mock("~/components/header", () => ({
  Header: ({ user }) => <div data-testid="header">{user?.name}</div>,
}));
```

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test -- --watch

# Run tests with coverage
npm run test -- --coverage

# Run specific test file
npm run test -- src/__tests__/routes/time-clock/actions.test.ts
```

## Test File Organization

```
src/__tests__/
├── utils/                 # Test helpers and utilities
│   ├── test-utils.tsx    # Render utilities
│   ├── db-mocks.ts       # Database mocking
│   ├── auth-mocks.ts     # Authentication mocks
│   ├── factories.ts      # Test data factories
│   ├── request-helpers.ts # HTTP request helpers
│   └── assert-helpers.ts # Custom assertions
├── routes/                # Route-specific tests
│   ├── dashboard.test.tsx
│   ├── home.test.tsx
│   ├── time-clock/
│   └── api.test.ts
└── integration/           # Integration tests
    ├── rsc-data-flow.test.tsx
    └── server-client-interactions.test.tsx
```

## Coverage Targets

Aim for comprehensive coverage across all layers:

- **Unit Tests**: Individual functions and components (80%+ coverage)
- **Integration Tests**: RSC data flow and component interactions
- **API Tests**: All endpoints including error cases
- **E2E Tests**: Critical user journeys (if implemented later)

## Best Practices

### 1. Test Structure

- Use AAA pattern (Arrange, Act, Assert)
- Keep tests focused and isolated
- Use descriptive test names
- Test happy paths and error cases

### 2. Mocking Strategy

- Mock external dependencies (database, APIs, auth)
- Keep mocks consistent across test files
- Reset mocks in beforeEach

### 3. Data Management

- Use factories for test data creation
- Use realistic but simple test data
- Maintain data consistency across related test data

### 4. Error Testing

- Test all error paths
- Verify error messages are meaningful
- Test edge cases and boundary conditions

## Known Issues and Workarounds

### React Router Context in Tests

Some React Router components require context setup. Use proper mocking:

```typescript
// Mock React Router context
vi.mock("react-router", async () => {
	const actual = await vi.importActual("react-router");
	return {
		...actual,
		// Add specific mocks as needed
	};
});
```

### Server Component Rendering

Server components have different testing patterns. Don't try to render them like client components.

### Database Connection

Database connections are mocked in tests to avoid requiring actual database setup.

## Future Improvements

1. **E2E Tests**: Add Playwright or Cypress for full user journey testing
2. **Visual Regression**: Add visual testing for UI components
3. **Performance Testing**: Add performance benchmarks for critical paths
4. **Contract Testing**: Add API contract tests for external integrations
5. **Load Testing**: Add load testing for API endpoints

## Troubleshooting

### "Cannot use hooks in Server Component"

This error indicates a client component is being tested as a server component. Verify component boundaries.

### "Request context not available"

RSC components may have access to request context limitations in test environment. Mock appropriately.

### Database connection errors

Ensure database is properly mocked in test setup using the provided utilities.
