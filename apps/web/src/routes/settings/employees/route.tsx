import { db } from "../../../lib/db";
import { backfillLegacyEmployeeCodes } from "../../../lib/employee-codes";
import { EmployeeManagement } from "./client";

export default async function Component() {
	await backfillLegacyEmployeeCodes();
	const employees = await db.employee.findMany({ orderBy: { name: "asc" } });

	return <EmployeeManagement employees={employees} />;
}
