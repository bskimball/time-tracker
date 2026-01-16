import { validateRequest } from "~/lib/auth";
import { getEmployeeById } from "../actions";
import { EmployeeDetail } from "./client";

export default async function Component({ params }: { params: { id: string } }) {
	const { user } = await validateRequest();
	if (!user) {
		throw new Error("Not authenticated");
	}

	const employee = await getEmployeeById(params.id);
	if (!employee) {
		throw new Response("Employee not found", { status: 404 });
	}

	return <EmployeeDetail employee={employee} />;
}
