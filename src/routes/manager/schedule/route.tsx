import { ScheduleView } from "./client";

export default async function Component() {
	// Manager middleware on the parent route ensures only MANAGER/ADMIN can access.
	return <ScheduleView />;
}
