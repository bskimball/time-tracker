import { validateRequest } from "~/lib/auth";
import { EmployeeRoster } from "./client";
import { getEmployees as getEmployeesFn, getStations } from "./actions";
import { EmployeeStatus } from "@prisma/client";

export default async function Component({
	searchParams,
}: {
	searchParams?: { search?: string; status?: string; page?: string };
}) {
	const { user } = await validateRequest();
	if (!user) {
		throw new Error("Not authenticated");
	}

	// Parse search params
	const search = searchParams?.search;
	const status = searchParams?.status as EmployeeStatus | undefined;
	const page = searchParams?.page ? parseInt(searchParams.page) : 1;
	const limit = 25;

	// Fetch employees and stations in parallel
	const [employeesData, stations] = await Promise.all([
		getEmployeesFn(search, status, page, limit),
		getStations(),
	]);

	return (
		<EmployeeRoster
			initialEmployees={employeesData.employees}
			total={employeesData.total}
			totalPages={employeesData.totalPages}
			currentPage={page}
			search={search}
			status={status}
			stations={stations}
		/>
	);
}
