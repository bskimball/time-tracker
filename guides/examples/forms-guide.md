# Forms Guide: React Server Components + Server Actions

This guide demonstrates the complete pattern for building forms in this application using React Server Components, Server Actions, React Aria Components, and the Design System.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Complete Example: Task Assignment Form](#complete-example-task-assignment-form)
3. [Pattern Breakdown](#pattern-breakdown)
4. [Design System Components](#design-system-components)
5. [Best Practices](#best-practices)
6. [Common Patterns](#common-patterns)

## Architecture Overview

Our form architecture follows a clean separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│  Server Component (route.tsx)                               │
│  - Fetches data (employees, task types, etc.)               │
│  - Passes data to Client Shell                              │
│  - Zero client JavaScript for data fetching                 │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│  Server Action (actions.ts)                                 │
│  - "use server" directive                                   │
│  - Handles form submission                                  │
│  - Database operations                                      │
│  - Returns serializable state                               │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│  Client Shell (client.tsx)                                  │
│  - "use client" directive                                   │
│  - Manages form state with useActionState                   │
│  - Handles optimistic updates with useOptimistic            │
│  - Coordinates between form and action                      │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│  Form Component (form-component.tsx)                        │
│  - "use client" directive                                   │
│  - Renders form UI with Design System components            │
│  - Controlled inputs with local state                       │
│  - Calls onSubmit callback from shell                       │
└─────────────────────────────────────────────────────────────┘
```

## Complete Example: Task Assignment Form

### 1. Server Component (route.tsx)

The Server Component fetches all data needed for the form and page.

```typescript
// src/routes/manager/tasks/route.tsx
import { db } from "~/lib/db";
import { getLogger } from "~/lib/request-context";
import { TaskManagerShell } from "./client";

export default async function TasksPage() {
  const logger = getLogger();

  logger.info("Loading tasks page");

  // Fetch all data in parallel
  const [employees, taskTypes, activeAssignments] = await Promise.all([
    db.employee.findMany({
      where: { status: "ACTIVE" },
      orderBy: { name: "asc" },
    }),
    db.taskType.findMany({
      include: { Station: true },
      orderBy: { name: "asc" },
    }),
    db.taskAssignment.findMany({
      where: { endTime: null },
      include: {
        Employee: true,
        TaskType: { include: { Station: true } },
      },
      orderBy: { startTime: "desc" },
    }),
  ]);

  logger.debug({
    employeesCount: employees.length,
    taskTypesCount: taskTypes.length,
    activeCount: activeAssignments.length,
  }, "Data loaded for tasks page");

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Task Management</h1>

      {/* Pass data to client shell */}
      <TaskManagerShell
        employees={employees}
        taskTypes={taskTypes}
        activeAssignments={activeAssignments}
      />
    </div>
  );
}
```

### 2. Server Action (actions.ts)

Server Actions handle all mutations and return serializable state.

```typescript
// src/routes/manager/tasks/actions.ts
"use server";

import { z } from "zod";
import { db } from "~/lib/db";
import { getLogger, logError, logPerformance } from "~/lib/logging-helpers";
import type { TaskAssignment } from "./types";

interface AssignTaskState {
	error?: string | null;
	success?: boolean;
	activeAssignments?: TaskAssignment[];
}

// Zod schema for validation
const assignTaskSchema = z.object({
	employeeId: z.string().min(1, "Employee is required"),
	taskTypeId: z.string().min(1, "Task type is required"),
	priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
	notes: z.string().optional().nullable(),
});

export async function assignTaskAction(
	prevState: AssignTaskState | null,
	formData: FormData
): Promise<AssignTaskState> {
	const logger = getLogger();

	// Parse and validate with Zod
	const parse = assignTaskSchema.safeParse({
		employeeId: formData.get("employeeId"),
		taskTypeId: formData.get("taskTypeId"),
		priority: formData.get("priority"),
		notes: formData.get("notes"),
	});

	if (!parse.success) {
		logger.warn("Validation failed", { errors: parse.error.format() });
		return { error: parse.error.issues[0].message };
	}

	const { employeeId, taskTypeId, priority, notes } = parse.data;

	logger.info(
		{
			employeeId,
			taskTypeId,
			priority,
		},
		"Assigning task"
	);

	try {
		// Check for existing active assignment
		const existingAssignment = await db.taskAssignment.findFirst({
			where: {
				employeeId,
				endTime: null,
			},
		});

		if (existingAssignment) {
			logger.warn({ employeeId }, "Employee already has active assignment");
			return { error: "Employee already has an active task assignment" };
		}

		// Create the assignment with performance logging
		const assignment = await logPerformance("create-task-assignment", () =>
			db.taskAssignment.create({
				data: {
					employeeId,
					taskTypeId,
					priority,
					notes,
					startTime: new Date(),
				},
				include: {
					Employee: true,
					TaskType: { include: { Station: true } },
				},
			})
		);


	try {
		// Check for existing active assignment
		const existingAssignment = await db.taskAssignment.findFirst({
			where: {
				employeeId,
				endTime: null,
			},
		});

		if (existingAssignment) {
			logger.warn({ employeeId }, "Employee already has active assignment");
			return { error: "Employee already has an active task assignment" };
		}

		// Create the assignment with performance logging
		const assignment = await logPerformance("create-task-assignment", () =>
			db.taskAssignment.create({
				data: {
					employeeId,
					taskTypeId,
					priority,
					notes,
					startTime: new Date(),
				},
				include: {
					Employee: true,
					TaskType: { include: { Station: true } },
				},
			})
		);


	try {
		// Check for existing active assignment
		const existingAssignment = await db.taskAssignment.findFirst({
			where: {
				employeeId,
				endTime: null,
			},
		});

		if (existingAssignment) {
			logger.warn({ employeeId }, "Employee already has active assignment");
			return { error: "Employee already has an active task assignment" };
		}

		// Create the assignment with performance logging
		const assignment = await logPerformance("create-task-assignment", () =>
			db.taskAssignment.create({
				data: {
					employeeId,
					taskTypeId,
					priority,
					notes,
					startTime: new Date(),
				},
				include: {
					Employee: true,
					TaskType: { include: { Station: true } },
				},
			})
		);

		logger.info(
			{
				assignmentId: assignment.id,
				employeeId,
				taskTypeId,
			},
			"Task assigned successfully"
		);

		// Fetch updated list to return
		const activeAssignments = await db.taskAssignment.findMany({
			where: { endTime: null },
			include: {
				Employee: true,
				TaskType: { include: { Station: true } },
			},
			orderBy: { startTime: "desc" },
		});

		return {
			success: true,
			activeAssignments,
		};
	} catch (error) {
		logError(error as Error, {
			operation: "assign-task",
			employeeId,
			taskTypeId,
		});

		return {
			error: "Failed to assign task. Please try again.",
		};
	}
}

export async function completeTaskAction(
	prevState: AssignTaskState | null,
	formData: FormData
): Promise<AssignTaskState> {
	const logger = getLogger();
	const assignmentId = formData.get("assignmentId") as string;
	const unitsCompleted = Number.parseInt(formData.get("unitsCompleted") as string, 10);

	logger.info({ assignmentId, unitsCompleted }, "Completing task assignment");

	try {
		await logPerformance("complete-task-assignment", () =>
			db.taskAssignment.update({
				where: { id: assignmentId },
				data: {
					endTime: new Date(),
					unitsCompleted: unitsCompleted || null,
				},
			})
		);

		logger.info({ assignmentId }, "Task completed successfully");

		// Fetch updated list
		const activeAssignments = await db.taskAssignment.findMany({
			where: { endTime: null },
			include: {
				Employee: true,
				TaskType: { include: { Station: true } },
			},
			orderBy: { startTime: "desc" },
		});

		return {
			success: true,
			activeAssignments,
		};
	} catch (error) {
		logError(error as Error, {
			operation: "complete-task",
			assignmentId,
		});

		return {
			error: "Failed to complete task. Please try again.",
		};
	}
}
```

### 3. Client Shell (client.tsx)

The Client Shell manages form state and optimistic updates.

```typescript
// src/routes/manager/tasks/client.tsx
"use client";

import { useActionState, useOptimistic, useState } from "react";
import { Button, Card, CardHeader, CardTitle, CardBody } from "~/components/ds";
import { TaskAssignmentForm } from "./task-assignment-form";
import { assignTaskAction, completeTaskAction } from "./actions";
import type { Employee, TaskType, TaskAssignment } from "./types";

interface TaskManagerShellProps {
  employees: Employee[];
  taskTypes: TaskType[];
  activeAssignments: TaskAssignment[];
}

export function TaskManagerShell({
  employees,
  taskTypes,
  activeAssignments: initialAssignments,
}: TaskManagerShellProps) {
  const [showForm, setShowForm] = useState(false);

  // Assign task action state
  const [assignState, assignAction, isAssignPending] = useActionState(
    assignTaskAction,
    null
  );

  // Complete task action state
  const [completeState, completeAction, isCompletePending] = useActionState(
    completeTaskAction,
    null
  );

  // Optimistic updates for immediate UI feedback
  const [optimisticAssignments, addOptimisticAssignment] = useOptimistic<
    TaskAssignment[],
    { employeeId: string; taskTypeId: string; priority: "LOW" | "MEDIUM" | "HIGH"; notes?: string }
  >(
    // Use server response if available, otherwise initial data
    assignState?.activeAssignments ?? completeState?.activeAssignments ?? initialAssignments,
    (currentAssignments, newAssignment) => {
      // Find the employee and task type from props to build optimistic assignment
      const employee = employees.find(e => e.id === newAssignment.employeeId);
      const taskType = taskTypes.find(t => t.id === newAssignment.taskTypeId);

      if (!employee || !taskType) return currentAssignments;

      // Create optimistic assignment
      const optimistic: TaskAssignment = {
        id: `optimistic-${Date.now()}`,
        employeeId: newAssignment.employeeId,
        taskTypeId: newAssignment.taskTypeId,
        priority: newAssignment.priority,
        notes: newAssignment.notes ?? null,
        startTime: new Date(),
        endTime: null,
        unitsCompleted: null,
        Employee: employee,
        TaskType: taskType,
      };

      // Add to beginning of list
      return [optimistic, ...currentAssignments];
    }
  );

  return (
    <div className="space-y-6">
      {/* Header with action button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Active Assignments</h2>
        <Button
          variant="primary"
          onClick={() => setShowForm(true)}
          disabled={isAssignPending}
        >
          Assign Task
        </Button>
      </div>

      {/* Active assignments list */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {optimisticAssignments.length === 0 ? (
          <Card className="col-span-full">
            <CardBody>
              <p className="text-center text-gray-500 py-8">
                No active task assignments
              </p>
            </CardBody>
          </Card>
        ) : (
          optimisticAssignments.map((assignment) => (
            <Card key={assignment.id}>
              <CardHeader>
                <CardTitle>{assignment.Employee.name}</CardTitle>
              </CardHeader>
              <CardBody>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">Task:</span> {assignment.TaskType.name}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Station:</span> {assignment.TaskType.Station.name}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Priority:</span>{" "}
                    <span
                      className={
                        assignment.priority === "HIGH"
                          ? "text-error"
                          : assignment.priority === "MEDIUM"
                            ? "text-warning"
                            : "text-gray-600"
                      }
                    >
                      {assignment.priority}
                    </span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Started: {new Date(assignment.startTime).toLocaleTimeString()}
                  </p>
                  {assignment.notes && (
                    <p className="text-sm text-gray-600 italic">{assignment.notes}</p>
                  )}

                  {/* Complete button */}
                  {!assignment.id.startsWith("optimistic") && (
                    <form
                      action={(formData) => {
                        formData.append("assignmentId", assignment.id);
                        completeAction(formData);
                      }}
                      className="pt-2"
                    >
                      <input
                        type="number"
                        name="unitsCompleted"
                        placeholder="Units completed"
                        className="w-full px-2 py-1 text-sm border rounded mb-2"
                        min="0"
                      />
                      <Button
                        type="submit"
                        variant="outline"
                        size="sm"
                        disabled={isCompletePending}
                        className="w-full"
                      >
                        {isCompletePending ? "Completing..." : "Complete Task"}
                      </Button>
                    </form>
                  )}
                </div>
              </CardBody>
            </Card>
          ))
        )}
      </div>

      {/* Assignment form modal */}
      {showForm && (
        <TaskAssignmentForm
          employees={employees}
          taskTypes={taskTypes}
          activeAssignments={optimisticAssignments}
          onClose={() => setShowForm(false)}
          onSubmit={assignAction}
          onOptimisticAssign={addOptimisticAssignment}
          isPending={isAssignPending}
          state={assignState}
        />
      )}
    </div>
  );
}
```

### 4. Form Component (task-assignment-form.tsx)

The Form Component is a controlled component that renders the UI.

```typescript
// src/routes/manager/tasks/task-assignment-form.tsx
"use client";

import { useEffect, useState } from "react";
import { Button, Input, Card, CardHeader, CardTitle, CardBody, Form } from "~/components/ds";
import type { Employee, TaskType, TaskAssignment } from "./types";

interface TaskAssignmentFormProps {
  employees: Employee[];
  taskTypes: TaskType[];
  activeAssignments: TaskAssignment[];
  onClose: () => void;
  onSubmit: (formData: FormData) => void;
  onOptimisticAssign?: (data: {
    employeeId: string;
    taskTypeId: string;
    priority: "LOW" | "MEDIUM" | "HIGH";
    notes?: string;
  }) => void;
  isPending?: boolean;
  state?: { error?: string | null; success?: boolean } | null;
}

export function TaskAssignmentForm({
  employees,
  taskTypes,
  activeAssignments,
  onClose,
  onSubmit,
  onOptimisticAssign,
  isPending = false,
  state,
}: TaskAssignmentFormProps) {
  // Local form state
  const [formData, setFormData] = useState({
    employeeId: "",
    taskTypeId: "",
    priority: "MEDIUM" as "LOW" | "MEDIUM" | "HIGH",
    notes: "",
  });

  // Reset and close on success
  useEffect(() => {
    if (!state?.success) return;

    const id = window.setTimeout(() => {
      setFormData({
        employeeId: "",
        taskTypeId: "",
        priority: "MEDIUM",
        notes: "",
      });
      onClose();
    }, 0);

    return () => window.clearTimeout(id);
  }, [state?.success, onClose]);

  const handleSubmit = () => {
    // Build FormData
    const fd = new FormData();
    fd.append("employeeId", formData.employeeId);
    fd.append("taskTypeId", formData.taskTypeId);
    fd.append("priority", formData.priority);
    if (formData.notes) {
      fd.append("notes", formData.notes);
    }

    // Trigger optimistic update
    onOptimisticAssign?.({
      employeeId: formData.employeeId,
      taskTypeId: formData.taskTypeId,
      priority: formData.priority,
      notes: formData.notes || undefined,
    });

    // Submit to server action
    onSubmit(fd);
  };

  // Filter out employees who already have active assignments
  const availableEmployees = employees.filter(
    (emp) => !activeAssignments.some((a) => a.employeeId === emp.id && !a.endTime)
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle>Assign Task</CardTitle>
        </CardHeader>
        <CardBody>
          <Form onSubmit={handleSubmit} className="space-y-4">
            {/* Employee Select */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Employee
              </label>
              <select
                className="w-full px-3 py-2 bg-background text-foreground border rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                value={formData.employeeId}
                onChange={(e) => setFormData((prev) => ({ ...prev, employeeId: e.target.value }))}
                required
              >
                <option value="">Select an employee</option>
                {availableEmployees.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Task Type Select */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Task Type
              </label>
              <select
                className="w-full px-3 py-2 bg-background text-foreground border rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                value={formData.taskTypeId}
                onChange={(e) => setFormData((prev) => ({ ...prev, taskTypeId: e.target.value }))}
                required
              >
                <option value="">Select a task type</option>
                {taskTypes.map((taskType) => (
                  <option key={taskType.id} value={taskType.id}>
                    {taskType.name} - {taskType.Station.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority Select */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Priority
              </label>
              <select
                className="w-full px-3 py-2 bg-background text-foreground border rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                value={formData.priority}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    priority: e.target.value as "LOW" | "MEDIUM" | "HIGH",
                  }))
                }
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>

            {/* Notes Input */}
            <div>
              <Input
                label="Notes (optional)"
                value={formData.notes}
                onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                placeholder="Additional instructions or context"
              />
            </div>

            {/* Error Display */}
            {state?.error && (
              <p className="text-sm text-error mt-2">{state.error}</p>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={isPending}>
                {isPending ? "Assigning..." : "Assign Task"}
              </Button>
            </div>
          </Form>
        </CardBody>
      </Card>
    </div>
  );
}
```

### 5. Type Definitions (types.ts)

```typescript
// src/routes/manager/tasks/types.ts
import type {
	Employee as PrismaEmployee,
	TaskType as PrismaTaskType,
	Station,
	TaskAssignment as PrismaTaskAssignment,
} from "@prisma/client";

export type Employee = PrismaEmployee;

export type TaskType = PrismaTaskType & {
	Station: Station;
};

export type TaskAssignment = PrismaTaskAssignment & {
	Employee: Employee;
	TaskType: TaskType;
};
```

## Pattern Breakdown

### 1. Data Fetching (Server Component)

**Why:**

- Zero client JavaScript for data fetching
- Automatic code splitting
- Direct database access
- SEO-friendly

**Pattern:**

```typescript
export default async function Page() {
  // Fetch data directly
  const data = await db.table.findMany();

  // Pass to client shell
  return <ClientShell data={data} />;
}
```

### 2. Server Actions

**Why:**

- Type-safe mutations
- Automatic error handling
- Progressive enhancement
- Security (server-only code)

**Pattern:**

```typescript
"use server";

export async function myAction(prevState: State | null, formData: FormData): Promise<State> {
	// Validate
	// Mutate database
	// Return serializable state
	return { success: true };
}
```

### 3. Client Shell with useActionState

**Why:**

- Manages server action state
- Handles pending states
- Error handling
- Type-safe

**Pattern:**

```typescript
"use client";

export function Shell() {
  const [state, action, isPending] = useActionState(serverAction, null);

  return (
    <Form onSubmit={action}>
      {state?.error && <Error>{state.error}</Error>}
      <Button disabled={isPending}>Submit</Button>
    </Form>
  );
}
```

### 4. Optimistic Updates with useOptimistic

**Why:**

- Instant UI feedback
- Better UX
- Automatic rollback on errors

**Pattern:**

```typescript
const [optimisticData, addOptimistic] = useOptimistic(serverData, (current, update) => {
	// Build optimistic item
	return [optimistic, ...current];
});

// Trigger before server action
addOptimistic(newItem);
action(formData);
```

## Design System Components

### Available Components

```typescript
import { Button, Input, Card, CardHeader, CardTitle, CardBody, Alert, Form } from "~/components/ds";
```

### Button Component

```typescript
<Button
  variant="primary" // primary, secondary, outline, ghost, error
  size="md"         // xs, sm, md, lg
  disabled={isPending}
  type="submit"     // submit, button, reset
>
  Submit
</Button>
```

### Input Component

```typescript
<Input
  label="Email"
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error={errors.email}
  description="We'll never share your email"
  required
/>
```

### Card Components

```typescript
<Card className="custom-class">
  <CardHeader>
    <CardTitle>Title Here</CardTitle>
  </CardHeader>
  <CardBody>
    Content goes here
  </CardBody>
</Card>
```

### Form Component

```typescript
<Form onSubmit={handleSubmit} className="space-y-4">
  {/* Form fields */}
  <Button type="submit">Submit</Button>
</Form>
```

### Alert Component

```typescript
<Alert variant="error">   {/* success, error, warning, info */}
  Error message here
</Alert>
```

## Best Practices

### ✅ DO: Use Server Components for Data

```typescript
export default async function Page() {
  const data = await db.table.findMany();
  return <ClientShell data={data} />;
}
```

### ✅ DO: Use Server Actions for Mutations

```typescript
"use server";

export async function createItem(prevState, formData) {
  await db.item.create({ data: {...} });
  return { success: true };
}
```

### ✅ DO: Use Controlled Components

```typescript
const [value, setValue] = useState("");

<Input
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>
```

### ✅ DO: Add Optimistic Updates for Better UX

```typescript
const [optimisticItems, addOptimistic] = useOptimistic(items, reducer);

addOptimistic(newItem); // Instant UI update
action(formData); // Then server update
```

### ✅ DO: Handle Errors Gracefully

```typescript
{state?.error && (
  <Alert variant="error">{state.error}</Alert>
)}
```

### ✅ DO: Add Loading States

```typescript
<Button disabled={isPending}>
  {isPending ? "Saving..." : "Save"}
</Button>
```

### ❌ DON'T: Use Loaders (They Hang)

```typescript
// ❌ WRONG
export async function loader() {
  return { data: await fetchData() };
}

// ✅ CORRECT
export default async function Component() {
  const data = await fetchData();
  return <div>{data}</div>;
}
```

### ❌ DON'T: Fetch Data in Client Components

```typescript
// ❌ WRONG
"use client";
export function Component() {
  useEffect(() => {
    fetch('/api/data').then(...);
  }, []);
}

// ✅ CORRECT
// Server Component
export default async function Component() {
  const data = await db.table.findMany();
  return <ClientComponent data={data} />;
}
```

### ❌ DON'T: Mutate in Server Components

```typescript
// ❌ WRONG
export default async function Component() {
  await db.item.create({ data: {...} }); // Don't do this!
  return <div>Created</div>;
}

// ✅ CORRECT
// Use server action in client component
"use server";
export async function createItem(prevState, formData) {
  await db.item.create({ data: {...} });
  return { success: true };
}
```

## Common Patterns

### Pattern 1: Simple Form (No Optimistic Updates)

```typescript
// action.ts
"use server";
export async function submitForm(prevState, formData) {
  const name = formData.get("name");
  await db.item.create({ data: { name } });
  return { success: true };
}

// client.tsx
"use client";
export function SimpleForm() {
  const [state, action, isPending] = useActionState(submitForm, null);

  return (
    <Form action={action}>
      <Input name="name" label="Name" required />
      {state?.error && <Alert variant="error">{state.error}</Alert>}
      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving..." : "Save"}
      </Button>
    </Form>
  );
}
```

### Pattern 2: Modal Form

```typescript
"use client";
export function ModalForm({ onClose, onSubmit, isPending, state }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Add Item</CardTitle>
        </CardHeader>
        <CardBody>
          <Form onSubmit={onSubmit}>
            {/* Fields */}
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit" disabled={isPending}>Save</Button>
            </div>
          </Form>
        </CardBody>
      </Card>
    </div>
  );
}
```

### Pattern 3: Multi-Step Form

```typescript
"use client";
export function MultiStepForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [state, action, isPending] = useActionState(submitForm, null);

  const handleNext = (data) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setStep((s) => s + 1);
  };

  return (
    <Card>
      <CardBody>
        {step === 1 && <Step1 onNext={handleNext} />}
        {step === 2 && <Step2 onNext={handleNext} />}
        {step === 3 && (
          <Step3
            data={formData}
            onSubmit={action}
            isPending={isPending}
            state={state}
          />
        )}
      </CardBody>
    </Card>
  );
}
```

### Pattern 4: Inline Edit

```typescript
"use client";
export function InlineEdit({ item }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(item.name);
  const [state, action, isPending] = useActionState(updateItem, null);

  if (!editing) {
    return (
      <div>
        <span>{item.name}</span>
        <Button size="xs" onClick={() => setEditing(true)}>
          Edit
        </Button>
      </div>
    );
  }

  return (
    <Form
      onSubmit={(formData) => {
        formData.append("id", item.id);
        action(formData);
        setEditing(false);
      }}
    >
      <Input
        name="name"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        autoFocus
      />
      <Button size="xs" type="submit" disabled={isPending}>
        Save
      </Button>
      <Button size="xs" variant="outline" onClick={() => setEditing(false)}>
        Cancel
      </Button>
    </Form>
  );
}
```

## Summary

### Form Architecture Checklist

- [ ] **Server Component** fetches data
- [ ] **Server Action** handles mutations (with logging)
- [ ] **Client Shell** manages state with `useActionState`
- [ ] **Optimistic Updates** with `useOptimistic` for instant feedback
- [ ] **Form Component** renders UI with Design System components
- [ ] **Error Handling** displays errors from server action
- [ ] **Loading States** disables buttons and shows pending text
- [ ] **Type Safety** throughout with TypeScript

### Quick Reference

| Layer    | File         | Directive      | Purpose                 |
| -------- | ------------ | -------------- | ----------------------- |
| Data     | `route.tsx`  | None (Server)  | Fetch data with Prisma  |
| Mutation | `actions.ts` | `"use server"` | Handle form submissions |
| State    | `client.tsx` | `"use client"` | Manage form state       |
| UI       | `form.tsx`   | `"use client"` | Render form components  |

This pattern provides the best balance of performance, UX, and maintainability in React Server Components architecture.
