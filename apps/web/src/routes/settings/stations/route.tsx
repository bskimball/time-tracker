import { db } from "../../../lib/db";
import { StationManagement } from "./client";

export default async function Component() {
	const stations = await db.station.findMany({ orderBy: { name: "asc" } });

	return <StationManagement stations={stations} />;
}
