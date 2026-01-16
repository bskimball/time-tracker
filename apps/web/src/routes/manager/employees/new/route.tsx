import { validateRequest } from "~/lib/auth";
import { getStations } from "../actions";
import { EmployeeForm } from "./client";

export default async function Component() {
	const { user } = await validateRequest();
	if (!user) {
		throw new Error("Not authenticated");
	}

	const stations = await getStations();

	const defaultEmployee = {
		name: "",
		email: "",
		phoneNumber: "",
		pin: "",
		defaultStationId: "",
		dailyHoursLimit: 8.0,
		weeklyHoursLimit: 40.0,
		status: "ACTIVE" as const,
		employeeCode: "",
	};

	return <EmployeeForm employee={defaultEmployee} stations={stations} isEdit={false} />;
}
