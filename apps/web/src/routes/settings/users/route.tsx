import { db } from "../../../lib/db";
import { UserManagement } from "./client";

export default async function Component() {
	const users = await db.user.findMany({ orderBy: { email: "asc" } });

	return <UserManagement users={users} />;
}
