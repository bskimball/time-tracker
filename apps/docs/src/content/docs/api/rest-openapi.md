---
title: REST API and OpenAPI
description: Integrate with Time Tracker using the OpenAPI-compliant REST API.
---

Time Tracker provides an OpenAPI-compliant REST API for integrations, automation, and reporting pipelines.

## API capabilities

- Manage users, teams, and assignments
- Read and update time entries
- Access operational data for reporting

## Authentication

- Use organization-issued API credentials
- Send authorization headers on every request
- Scope credentials to the minimum required permissions

## OpenAPI specification

- The API contract is published as an OpenAPI document
- Use the spec to generate SDKs and typed clients
- Validate requests and responses against the schema

## Integration tips

- Treat API operations as idempotent where possible
- Implement retries with exponential backoff for transient failures
- Log request IDs for faster support troubleshooting
