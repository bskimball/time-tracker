import { db } from "../../../lib/db";
import { validateRequest } from "../../../lib/auth";
import { ApiKeyManagement } from "./client";

export default async function Component() {
	const { user } = await validateRequest();
	const apiKeys = user
		? await db.apiKey.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" } })
		: [];

	return <ApiKeyManagement apiKeys={apiKeys} />;
}
