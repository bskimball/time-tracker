import { OperationalConfigManager } from "./client";
import { getEditableOperationalConfigEntries } from "./actions";

export default async function Component() {
	const entries = await getEditableOperationalConfigEntries();
	return <OperationalConfigManager initialEntries={entries} />;
}
