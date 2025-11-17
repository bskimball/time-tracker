# Forms Quick Reference

Quick copy-paste examples for common form scenarios.

## Table of Contents

1. [Basic Form](#basic-form)
2. [Form with Validation](#form-with-validation)
3. [Search Form](#search-form)
4. [Delete Confirmation](#delete-confirmation)
5. [Bulk Actions](#bulk-actions)
6. [Filter Form](#filter-form)
7. [File Upload](#file-upload)
8. [Dynamic Fields](#dynamic-fields)

---

## Basic Form

### Server Action

```typescript
// actions.ts
"use server";

import { db } from "~/lib/db";
import { getLogger, logError } from "~/lib/logging-helpers";

export async function createEmployee(prevState: any, formData: FormData) {
	const logger = getLogger();

	const name = formData.get("name") as string;
	const email = formData.get("email") as string;

	logger.info({ name, email }, "Creating employee");

	try {
		const employee = await db.employee.create({
			data: { name, email, status: "ACTIVE" },
		});

		logger.info({ employeeId: employee.id }, "Employee created");
		return { success: true, employee };
	} catch (error) {
		logError(error as Error, { operation: "create-employee" });
		return { error: "Failed to create employee" };
	}
}
```

### Client Component

```typescript
// client.tsx
"use client";

import { useActionState } from "react";
import { Button, Input, Card, CardBody, Alert, Form } from "~/components/ds";
import { createEmployee } from "./actions";

export function CreateEmployeeForm() {
  const [state, action, isPending] = useActionState(createEmployee, null);

  return (
    <Card>
      <CardBody>
        <Form action={action} className="space-y-4">
          <Input
            name="name"
            label="Name"
            required
          />
          <Input
            name="email"
            label="Email"
            type="email"
            required
          />

          {state?.error && (
            <Alert variant="error">{state.error}</Alert>
          )}

          {state?.success && (
            <Alert variant="success">Employee created successfully!</Alert>
          )}

          <Button type="submit" variant="primary" disabled={isPending}>
            {isPending ? "Creating..." : "Create Employee"}
          </Button>
        </Form>
      </CardBody>
    </Card>
  );
}
```

---

## Form with Validation

### Server Action with Validation

```typescript
// actions.ts
"use server";

import { db } from "~/lib/db";
import { getLogger, logError } from "~/lib/logging-helpers";

interface ValidationErrors {
	name?: string;
	email?: string;
	pin?: string;
}

export async function createEmployeeWithValidation(prevState: any, formData: FormData) {
	const logger = getLogger();

	const name = formData.get("name") as string;
	const email = formData.get("email") as string;
	const pin = formData.get("pin") as string;

	// Validation
	const errors: ValidationErrors = {};

	if (!name || name.trim().length < 2) {
		errors.name = "Name must be at least 2 characters";
	}

	if (!email || !email.includes("@")) {
		errors.email = "Valid email is required";
	}

	if (!pin || !/^\d{4}$/.test(pin)) {
		errors.pin = "PIN must be exactly 4 digits";
	}

	// Check if email already exists
	if (email) {
		const existing = await db.employee.findFirst({
			where: { email },
		});

		if (existing) {
			errors.email = "Email already in use";
		}
	}

	if (Object.keys(errors).length > 0) {
		logger.warn({ errors }, "Validation failed");
		return { errors };
	}

	// Create employee
	try {
		const employee = await db.employee.create({
			data: {
				name: name.trim(),
				email: email.toLowerCase(),
				pinHash: await hashPin(pin),
				status: "ACTIVE",
			},
		});

		logger.info({ employeeId: employee.id }, "Employee created");
		return { success: true, employee };
	} catch (error) {
		logError(error as Error, { operation: "create-employee" });
		return { error: "Failed to create employee" };
	}
}

async function hashPin(pin: string): Promise<string> {
	const bcrypt = await import("bcrypt");
	return bcrypt.hash(pin, 10);
}
```

### Client Component with Field Errors

```typescript
// client.tsx
"use client";

import { useActionState } from "react";
import { Button, Input, Alert, Form } from "~/components/ds";
import { createEmployeeWithValidation } from "./actions";

export function ValidatedEmployeeForm() {
  const [state, action, isPending] = useActionState(
    createEmployeeWithValidation,
    null
  );

  return (
    <Form action={action} className="space-y-4">
      <Input
        name="name"
        label="Full Name"
        error={state?.errors?.name}
        required
      />

      <Input
        name="email"
        label="Email"
        type="email"
        error={state?.errors?.email}
        required
      />

      <Input
        name="pin"
        label="4-Digit PIN"
        type="password"
        maxLength={4}
        pattern="\d{4}"
        error={state?.errors?.pin}
        description="Used for time clock authentication"
        required
      />

      {state?.error && (
        <Alert variant="error">{state.error}</Alert>
      )}

      {state?.success && (
        <Alert variant="success">Employee created successfully!</Alert>
      )}

      <Button type="submit" variant="primary" disabled={isPending}>
        {isPending ? "Creating..." : "Create Employee"}
      </Button>
    </Form>
  );
}
```

---

## Search Form

### Server Action

```typescript
// actions.ts
"use server";

import { db } from "~/lib/db";
import { getLogger } from "~/lib/logging-helpers";

export async function searchEmployees(prevState: any, formData: FormData) {
	const logger = getLogger();

	const query = formData.get("query") as string;
	const status = formData.get("status") as string;

	logger.debug({ query, status }, "Searching employees");

	const results = await db.employee.findMany({
		where: {
			AND: [
				query
					? {
							OR: [
								{ name: { contains: query, mode: "insensitive" } },
								{ email: { contains: query, mode: "insensitive" } },
							],
						}
					: {},
				status ? { status: status as any } : {},
			],
		},
		orderBy: { name: "asc" },
		take: 50,
	});

	logger.debug({ count: results.length }, "Search results");
	return { results };
}
```

### Client Component

```typescript
// client.tsx
"use client";

import { useActionState, useEffect, useRef } from "react";
import { Button, Input, Card, CardBody } from "~/components/ds";
import { searchEmployees } from "./actions";

export function EmployeeSearch() {
  const [state, action, isPending] = useActionState(searchEmployees, null);
  const formRef = useRef<HTMLFormElement>(null);

  // Auto-submit on status change
  useEffect(() => {
    if (formRef.current) {
      const statusSelect = formRef.current.querySelector('select[name="status"]');
      if (statusSelect) {
        statusSelect.addEventListener("change", () => {
          formRef.current?.requestSubmit();
        });
      }
    }
  }, []);

  return (
    <div className="space-y-4">
      <form ref={formRef} action={action} className="flex gap-2">
        <Input
          name="query"
          placeholder="Search by name or email..."
          className="flex-1"
        />

        <select
          name="status"
          className="px-3 py-2 border rounded focus:ring-2 focus:ring-primary"
        >
          <option value="">All Statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
          <option value="ON_LEAVE">On Leave</option>
        </select>

        <Button type="submit" disabled={isPending}>
          {isPending ? "Searching..." : "Search"}
        </Button>
      </form>

      {state?.results && (
        <Card>
          <CardBody>
            <p className="text-sm text-gray-600 mb-4">
              Found {state.results.length} employee(s)
            </p>
            <div className="space-y-2">
              {state.results.map((employee) => (
                <div
                  key={employee.id}
                  className="p-3 border rounded hover:bg-gray-50"
                >
                  <p className="font-medium">{employee.name}</p>
                  <p className="text-sm text-gray-600">{employee.email}</p>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
```

---

## Delete Confirmation

### Server Action

```typescript
// actions.ts
"use server";

import { db } from "~/lib/db";
import { getLogger, logError } from "~/lib/logging-helpers";

export async function deleteEmployee(prevState: any, formData: FormData) {
	const logger = getLogger();
	const employeeId = formData.get("employeeId") as string;

	logger.warn({ employeeId }, "Deleting employee");

	try {
		// Soft delete - set status to TERMINATED
		await db.employee.update({
			where: { id: employeeId },
			data: { status: "TERMINATED" },
		});

		logger.info({ employeeId }, "Employee deleted");
		return { success: true };
	} catch (error) {
		logError(error as Error, { operation: "delete-employee", employeeId });
		return { error: "Failed to delete employee" };
	}
}
```

### Client Component

```typescript
// client.tsx
"use client";

import { useActionState, useState } from "react";
import { Button, Card, CardBody, Alert } from "~/components/ds";
import { deleteEmployee } from "./actions";

interface DeleteEmployeeButtonProps {
  employeeId: string;
  employeeName: string;
}

export function DeleteEmployeeButton({
  employeeId,
  employeeName,
}: DeleteEmployeeButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [state, action, isPending] = useActionState(deleteEmployee, null);

  if (!showConfirm) {
    return (
      <Button
        variant="error"
        size="sm"
        onClick={() => setShowConfirm(true)}
      >
        Delete
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md">
        <CardBody>
          <h3 className="text-lg font-semibold mb-2">Confirm Deletion</h3>
          <p className="text-gray-600 mb-4">
            Are you sure you want to delete <strong>{employeeName}</strong>?
            This action cannot be undone.
          </p>

          {state?.error && (
            <Alert variant="error" className="mb-4">
              {state.error}
            </Alert>
          )}

          <form action={action}>
            <input type="hidden" name="employeeId" value={employeeId} />

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="error"
                disabled={isPending}
              >
                {isPending ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
```

---

## Bulk Actions

### Server Action

```typescript
// actions.ts
"use server";

import { db } from "~/lib/db";
import { getLogger, logError } from "~/lib/logging-helpers";

export async function bulkUpdateStatus(prevState: any, formData: FormData) {
	const logger = getLogger();

	const employeeIds = formData.getAll("employeeIds") as string[];
	const status = formData.get("status") as string;

	logger.info({ count: employeeIds.length, status }, "Bulk status update");

	try {
		const result = await db.employee.updateMany({
			where: { id: { in: employeeIds } },
			data: { status: status as any },
		});

		logger.info({ updated: result.count }, "Bulk update complete");
		return { success: true, count: result.count };
	} catch (error) {
		logError(error as Error, { operation: "bulk-update-status" });
		return { error: "Failed to update employees" };
	}
}
```

### Client Component

```typescript
// client.tsx
"use client";

import { useActionState, useState } from "react";
import { Button, Alert } from "~/components/ds";
import { bulkUpdateStatus } from "./actions";

export function BulkActionsBar({ employees }) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [state, action, isPending] = useActionState(bulkUpdateStatus, null);

  const toggleSelection = (id: string) => {
    const newSelected = new Set(selected);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelected(newSelected);
  };

  const selectAll = () => {
    setSelected(new Set(employees.map(e => e.id)));
  };

  const clearSelection = () => {
    setSelected(new Set());
  };

  return (
    <div className="space-y-4">
      {/* Selection controls */}
      <div className="flex items-center gap-2">
        <Button size="sm" variant="outline" onClick={selectAll}>
          Select All
        </Button>
        <Button size="sm" variant="outline" onClick={clearSelection}>
          Clear
        </Button>
        <span className="text-sm text-gray-600">
          {selected.size} selected
        </span>
      </div>

      {/* Bulk actions form */}
      {selected.size > 0 && (
        <form action={action} className="flex gap-2 items-center p-3 bg-gray-50 rounded">
          {Array.from(selected).map(id => (
            <input key={id} type="hidden" name="employeeIds" value={id} />
          ))}

          <select
            name="status"
            className="px-3 py-2 border rounded"
            required
          >
            <option value="">Select status...</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="ON_LEAVE">On Leave</option>
          </select>

          <Button type="submit" disabled={isPending}>
            {isPending ? "Updating..." : "Update Status"}
          </Button>
        </form>
      )}

      {state?.success && (
        <Alert variant="success">
          Updated {state.count} employee(s) successfully!
        </Alert>
      )}

      {state?.error && (
        <Alert variant="error">{state.error}</Alert>
      )}

      {/* Employee list with checkboxes */}
      <div className="space-y-2">
        {employees.map(employee => (
          <label
            key={employee.id}
            className="flex items-center gap-3 p-3 border rounded cursor-pointer hover:bg-gray-50"
          >
            <input
              type="checkbox"
              checked={selected.has(employee.id)}
              onChange={() => toggleSelection(employee.id)}
              className="w-4 h-4"
            />
            <div className="flex-1">
              <p className="font-medium">{employee.name}</p>
              <p className="text-sm text-gray-600">{employee.status}</p>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}
```

---

## Filter Form

### Server Component with Search Params

```typescript
// route.tsx
import { db } from "~/lib/db";
import { EmployeeFilters } from "./client";

interface SearchParams {
  status?: string;
  station?: string;
  search?: string;
}

export default async function EmployeesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { status, station, search } = searchParams;

  const employees = await db.employee.findMany({
    where: {
      AND: [
        status ? { status: status as any } : {},
        station ? { defaultStationId: station } : {},
        search
          ? {
              OR: [
                { name: { contains: search, mode: "insensitive" } },
                { email: { contains: search, mode: "insensitive" } },
              ],
            }
          : {},
      ],
    },
    include: { defaultStation: true },
  });

  const stations = await db.station.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <EmployeeFilters stations={stations} />

      <div className="mt-6">
        {/* Display employees */}
        {employees.map(emp => (
          <div key={emp.id}>{emp.name}</div>
        ))}
      </div>
    </div>
  );
}
```

### Client Component (URL-based filters)

```typescript
// client.tsx
"use client";

import { useRouter, useSearchParams } from "react-router";
import { Button, Input } from "~/components/ds";

export function EmployeeFilters({ stations }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const params = new URLSearchParams();

    const search = formData.get("search") as string;
    const status = formData.get("status") as string;
    const station = formData.get("station") as string;

    if (search) params.set("search", search);
    if (status) params.set("status", status);
    if (station) params.set("station", station);

    router.push(`?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push(window.location.pathname);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          name="search"
          placeholder="Search..."
          defaultValue={searchParams.get("search") || ""}
        />

        <select
          name="status"
          className="px-3 py-2 border rounded"
          defaultValue={searchParams.get("status") || ""}
        >
          <option value="">All Statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>

        <select
          name="station"
          className="px-3 py-2 border rounded"
          defaultValue={searchParams.get("station") || ""}
        >
          <option value="">All Stations</option>
          {stations.map(station => (
            <option key={station.id} value={station.id}>
              {station.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-2">
        <Button type="submit" variant="primary">
          Apply Filters
        </Button>
        <Button type="button" variant="outline" onClick={clearFilters}>
          Clear
        </Button>
      </div>
    </form>
  );
}
```

---

## File Upload

### Server Action

```typescript
// actions.ts
"use server";

import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { db } from "~/lib/db";
import { getLogger, logError } from "~/lib/logging-helpers";

export async function uploadEmployeePhoto(prevState: any, formData: FormData) {
	const logger = getLogger();

	const employeeId = formData.get("employeeId") as string;
	const file = formData.get("photo") as File;

	if (!file || file.size === 0) {
		return { error: "Please select a photo" };
	}

	// Validate file type
	if (!file.type.startsWith("image/")) {
		return { error: "File must be an image" };
	}

	// Validate file size (5MB max)
	if (file.size > 5 * 1024 * 1024) {
		return { error: "File size must be less than 5MB" };
	}

	logger.info(
		{
			employeeId,
			fileName: file.name,
			fileSize: file.size,
			fileType: file.type,
		},
		"Uploading photo"
	);

	try {
		// Convert to buffer
		const bytes = await file.arrayBuffer();
		const buffer = Buffer.from(bytes);

		// Generate unique filename
		const ext = file.name.split(".").pop();
		const filename = `${employeeId}-${Date.now()}.${ext}`;
		const filepath = join(process.cwd(), "public", "uploads", filename);

		// Save file
		await writeFile(filepath, buffer);

		// Update database
		await db.employee.update({
			where: { id: employeeId },
			data: { photoUrl: `/uploads/${filename}` },
		});

		logger.info({ employeeId, filename }, "Photo uploaded");
		return { success: true, photoUrl: `/uploads/${filename}` };
	} catch (error) {
		logError(error as Error, { operation: "upload-photo", employeeId });
		return { error: "Failed to upload photo" };
	}
}
```

### Client Component

```typescript
// client.tsx
"use client";

import { useActionState, useState } from "react";
import { Button, Alert } from "~/components/ds";
import { uploadEmployeePhoto } from "./actions";

export function PhotoUploadForm({ employeeId, currentPhotoUrl }) {
  const [preview, setPreview] = useState<string | null>(currentPhotoUrl);
  const [state, action, isPending] = useActionState(uploadEmployeePhoto, null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="employeeId" value={employeeId} />

      {/* Photo preview */}
      {preview && (
        <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* File input */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Employee Photo
        </label>
        <input
          type="file"
          name="photo"
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded file:border-0
            file:text-sm file:font-semibold
            file:bg-primary file:text-white
            hover:file:bg-primary/90"
          required
        />
        <p className="text-xs text-gray-500 mt-1">
          Max file size: 5MB. Accepted formats: JPG, PNG, GIF
        </p>
      </div>

      {state?.error && (
        <Alert variant="error">{state.error}</Alert>
      )}

      {state?.success && (
        <Alert variant="success">Photo uploaded successfully!</Alert>
      )}

      <Button type="submit" disabled={isPending}>
        {isPending ? "Uploading..." : "Upload Photo"}
      </Button>
    </form>
  );
}
```

---

## Dynamic Fields

### Client Component with Add/Remove Fields

```typescript
// client.tsx
"use client";

import { useActionState, useState } from "react";
import { Button, Input, Alert } from "~/components/ds";
import { createTaskType } from "./actions";

export function TaskTypeForm() {
  const [state, action, isPending] = useActionState(createTaskType, null);
  const [requirements, setRequirements] = useState([""]);

  const addRequirement = () => {
    setRequirements([...requirements, ""]);
  };

  const removeRequirement = (index: number) => {
    setRequirements(requirements.filter((_, i) => i !== index));
  };

  const updateRequirement = (index: number, value: string) => {
    const updated = [...requirements];
    updated[index] = value;
    setRequirements(updated);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    // Add all requirements
    requirements.forEach((req, index) => {
      if (req.trim()) {
        formData.append(`requirement_${index}`, req);
      }
    });

    action(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        name="name"
        label="Task Type Name"
        required
      />

      <div>
        <label className="block text-sm font-medium mb-2">
          Requirements
        </label>

        <div className="space-y-2">
          {requirements.map((req, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={req}
                onChange={(e) => updateRequirement(index, e.target.value)}
                placeholder={`Requirement ${index + 1}`}
                className="flex-1"
              />
              {requirements.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeRequirement(index)}
                >
                  Remove
                </Button>
              )}
            </div>
          ))}
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addRequirement}
          className="mt-2"
        >
          + Add Requirement
        </Button>
      </div>

      {state?.error && (
        <Alert variant="error">{state.error}</Alert>
      )}

      <Button type="submit" variant="primary" disabled={isPending}>
        {isPending ? "Creating..." : "Create Task Type"}
      </Button>
    </form>
  );
}
```

---

## Quick Tips

### 1. Always Use FormData

```typescript
// ✅ CORRECT
const name = formData.get("name") as string;

// ❌ WRONG - Don't destructure from event
const handleSubmit = (e) => {
	const { name } = e.target; // Don't do this
};
```

### 2. Reset Form on Success

```typescript
useEffect(() => {
	if (state?.success) {
		formRef.current?.reset();
	}
}, [state?.success]);
```

### 3. Disable Submit While Pending

```typescript
<Button type="submit" disabled={isPending}>
  {isPending ? "Saving..." : "Save"}
</Button>
```

### 4. Show Field-Level Errors

```typescript
<Input
  name="email"
  error={state?.errors?.email}
  // Error will show below the input
/>
```

### 5. Log All Actions

```typescript
"use server";
import { getLogger, logError } from "~/lib/logging-helpers";

export async function myAction(prevState, formData) {
	const logger = getLogger();
	logger.info({ ...data }, "Action started");

	try {
		// ... action logic
		logger.info({ result }, "Action completed");
	} catch (error) {
		logError(error as Error, { operation: "my-action" });
	}
}
```

---

## Summary

All forms follow the same pattern:

1. **Server Action** (`"use server"`) - Handle mutations
2. **useActionState** - Manage action state
3. **FormData** - Extract form values
4. **Design System** - Use Button, Input, etc.
5. **Logging** - Log all operations
6. **Error Handling** - Display errors from server

Copy any example above and adapt to your needs!
