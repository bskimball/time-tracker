import { db } from "../../../lib/db";
import { EmployeeManagement } from "./client";

export default async function Component() {
	const employees = await db.employee.findMany({ orderBy: { name: "asc" } });

	return <EmployeeManagement employees={employees} />;
}
