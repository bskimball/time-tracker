import { validateRequest } from "~/lib/auth";
import { getRequest } from "~/lib/request-context";
import { EmployeeRoster } from "./client";
import { getEmployees as getEmployeesFn, getStations } from "./actions";
import { EmployeeStatus } from "@prisma/client";

export default async function Component() {
	const { user } = await validateRequest();
	if (!user) {
		throw new Error("Not authenticated");
	}

	const request = getRequest();
	const query = request ? new URL(request.url).searchParams : new URLSearchParams();

	// Parse search params
	const search = query.get("search") || undefined;
	const statusParam = query.get("status");
	const status =
		statusParam && Object.values(EmployeeStatus).includes(statusParam as EmployeeStatus)
			? (statusParam as EmployeeStatus)
			: undefined;
	const pageParam = query.get("page");
	const parsedPage = pageParam ? parseInt(pageParam, 10) : NaN;
	const page = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;
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
