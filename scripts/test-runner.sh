#!/bin/bash

# Test runner script for different test types
# Usage: ./scripts/test-runner.sh [test-type]

set -e

TEST_TYPE=${1:-"all"}

echo "🧪 Running $TEST_TYPE tests..."

case $TEST_TYPE in
  "unit")
    echo "Running unit tests only..."
    npx vitest run --reporter=verbose src/__tests__/routes/time-clock/actions.test.ts src/__tests__/routes/time-clock.service.test.ts
    ;;
  "components")
    echo "Running component tests only..."
    npx vitest run --reporter=verbose src/__tests__/routes/dashboard.test.tsx src/__tests__/routes/time-clock/clients.test.tsx
    ;;
  "api")
    echo "Running API tests only..."
    npx vitest run --reporter=verbose src/__tests__/routes/api.test.ts
    ;;
  "integration")
    echo "Running integration tests only..."
    npx vitest run --reporter=verbose src/__tests__/integration/
    ;;
  "coverage")
    echo "Running tests with coverage report..."
    npx vitest run --coverage
    echo "📊 Coverage report generated in coverage/"
    ;;
  "watch")
    echo "Running tests in watch mode..."
    npx vitest watch
    ;;
  "all"|"")
    echo "Running all tests..."
    npx vitest run --reporter=verbose
    ;;
  *)
    echo "❌ Unknown test type: $TEST_TYPE"
    echo "Available options: unit, components, api, integration, coverage, watch, all"
    exit 1
    ;;
esac

echo "✅ Tests completed!"
