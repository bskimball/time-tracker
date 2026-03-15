---
title: Executive Guide
description: Strategic monitoring workflows for the Executive Dashboard and Analytics sections.
---

This guide describes the executive portal feature set for `EXECUTIVE` and `ADMIN` users.

## Executive workspace

Primary executive routes:

- `/executive`
- `/executive/analytics`

## Access note

- Route access is available to `EXECUTIVE` and `ADMIN`.
- Use `EXECUTIVE` for reporting and analytics access, and `ADMIN` for settings and system ownership.

## Executive Dashboard (`/executive`)

Use this page for high-level status checks and fast drill-in to analytics.

### Key components

- **Primary Focus card**: headline productivity KPI with trend context and quick link to full trend analysis.
- **Secondary Metrics cards**: active employees, overtime percentage, and occupancy level.
- **Operations Overview**: station performance chart and financial health card with cost breakdown.
- **Quick Actions**: deep-links into analytics sections (Productivity, Cost Analysis, Trend Analysis, Capacity Planning).
- **Time Range tabs**: switch between `today`, `week`, and `month`.

### Charts on this page

- Productivity trend line chart.
- Station performance chart.
- Cost comparison chart.

## Analytics and Reporting (`/executive/analytics`)

Use this page for section-based analysis with period and comparison controls.

### Global controls

- **Section tabs**: `Productivity`, `Labor Costs`, `Trends`, `Capacity`, `Benchmarks`.
- **Period tabs**: `today`, `week`, `month`, `quarter`.
- **Comparison tabs**: `previous-period`, `last-year`, and (for `month`) `rolling-30d`.
- Comparison options are normalized by period compatibility.

### Section breakdown

#### Productivity

- KPI row for units/hour, top performer threshold, completion rate, and bottleneck alert.
- Four charts: productivity trend, station efficiency, task type efficiency, shift productivity.
- Station performance cards and employee productivity rankings table.

#### Labor Costs

- KPI row for regular cost, overtime cost, total cost, and budget variance.
- Charts for labor cost trend, shift productivity vs cost, and cost breakdown pie chart.
- Station cost analysis table.

#### Trends

- Productivity, cost, and quality trend KPIs.
- Dual line charts for momentum and cost efficiency.
- Anomaly table for exception-level signals.

#### Capacity

- KPI row for utilization, shortage, cost impact, and bottleneck count.
- Live floor visualization and station staffing recommendation cards.

#### Benchmarks

- KPI row for productivity, cost, and quality positions versus industry benchmarks.
- Benchmark ladder charts and station benchmark positioning table.

## Chat and assistant capabilities

There is currently no executive chat or conversational assistant UI in `/executive` or `/executive/analytics`.

## Recommended executive cadence

- **Daily**: review dashboard alerts and trend deltas.
- **Weekly**: review labor cost and benchmark sections with period-over-period comparison.
- **Monthly**: use capacity and benchmark sections for staffing and target calibration.

## Known issue

- Capacity section can show a `Staff Shortage` value of 0 while labeling severity as Critical. Track: https://github.com/bskimball/time-tracker/issues/40
