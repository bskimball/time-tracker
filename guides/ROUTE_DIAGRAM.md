# Route Diagram

This document shows a high-level diagram of the main app routes and layouts.

```mermaid
flowchart TD
  Root["/"] --> Home["/ (home, public)"]
  Root --> DashboardRedirect["/dashboard → /manager (redirect)"]
  Root --> Login["/login (public)"]
  Root --> DevLogin["/dev-login (public)"]
  Root --> Logout["/logout (auth)"]

  %% Third-party auth flows
  subgraph Auth["Third-Party Auth"]
    AuthGoogleStart["/auth/google/start (public)"]
    AuthGoogleCallback["/auth/google/callback (public)"]
    AuthMicrosoftStart["/auth/microsoft/start (public)"]
    AuthMicrosoftCallback["/auth/microsoft/callback (public)"]
  end

  Root --> Auth

  %% Floor experience
  subgraph FloorExperience["Floor experience"]
    FloorLayout["/floor (layout, public)"]
    FloorLayout --> FloorIndex["/floor (index)"]
    FloorLayout --> FloorKiosk["/floor/kiosk"]
  end

  Root --> FloorExperience

  %% Manager experience (auth + roles: MANAGER, ADMIN)
  subgraph ManagerExperience["Manager experience (auth: MANAGER|ADMIN)"]
    ManagerLayout["/manager (layout)"]
    ManagerLayout --> ManagerDashboard["/manager (index)"]
    ManagerLayout --> ManagerMonitor["/manager/monitor"]
    ManagerLayout --> ManagerEmployees["/manager/employees"]
    ManagerEmployees --> ManagerEmployeesDetail["/manager/employees/:id"]
    ManagerEmployees --> ManagerEmployeesEdit["/manager/employees/:id/edit"]
    ManagerEmployees --> ManagerEmployeesNew["/manager/employees/new"]
    ManagerLayout --> ManagerTimesheets["/manager/timesheets"]
    ManagerLayout --> ManagerSchedule["/manager/schedule"]
    ManagerLayout --> ManagerTasks["/manager/tasks"]
    ManagerLayout --> ManagerReports["/manager/reports"]
  end

  Root --> ManagerExperience

  %% Executive experience (auth + role: ADMIN)
  subgraph ExecutiveExperience["Executive experience (auth: ADMIN)"]
    ExecutiveLayout["/executive (layout)"]
    ExecutiveLayout --> ExecutiveDashboard["/executive (index)"]
    ExecutiveLayout --> ExecutiveAnalytics["/executive/analytics"]
  end

  Root --> ExecutiveExperience

  %% Authenticated utilities
  Root --> Settings["/settings (auth)"]
  Root --> Todo["/todo (auth)"]
```

## Notes

- All routes are children of the `root` layout defined in `src/routes/config.ts`.
- `manager` routes require `authMiddleware` and `roleMiddleware(["MANAGER", "ADMIN"])`.
- `executive` routes require `authMiddleware` and `roleMiddleware(["ADMIN"])`.
- `settings` and `todo` require `authMiddleware` only.

**Legend**

- `(public)` – no auth required
- `(auth)` – any authenticated user
- `(auth: ROLE)` – specific roles

> This diagram is a high-level view derived from `src/routes/config.ts`. For exact middleware
> and route options, see `src/routes/config.ts`.
