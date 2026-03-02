import { db } from "../../../lib/db";
import { StationManagement } from "./client";
import { Station_name } from "@prisma/client";

export default async function Component() {
	const stations = await db.station.findMany({ orderBy: { name: "asc" } });
	const availableStationNames = Object.values(Station_name);

	return <StationManagement stations={stations} availableStationNames={availableStationNames} />;
}
