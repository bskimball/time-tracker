import { validateRequest } from "~/lib/auth";
import { getEmployeeById, getStations } from "../../actions";
import { EmployeeForm } from "../../new/client";

export default async function Component({ params }: { params: { id: string } }) {
	const { user } = await validateRequest();
	if (!user) {
		throw new Error("Not authenticated");
	}

	const [employee, stations] = await Promise.all([getEmployeeById(params.id), getStations()]);

	if (!employee) {
		throw new Response("Employee not found", { status: 404 });
	}

	const employeeData = {
		name: employee.name,
		email: employee.email,
		phoneNumber: employee.phoneNumber || "",
		pin: "", // Don't send existing PIN hash to client
		defaultStationId: employee.defaultStationId || "",
		dailyHoursLimit: employee.dailyHoursLimit || 8.0,
		weeklyHoursLimit: employee.weeklyHoursLimit || 40.0,
		status: employee.status,
		employeeCode: employee.employeeCode || "",
	};

	return (
		<EmployeeForm
			employee={employeeData}
			stations={stations}
			isEdit={true}
			employeeId={params.id}
		/>
	);
}
