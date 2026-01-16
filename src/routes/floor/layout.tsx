import { Outlet } from "react-router";
import { AppLayout } from "~/components/app-layout";
import { floorNavLinks } from "./nav";

export default async function Component() {
	return (
		<AppLayout title="Floor Operations" brandHref="/floor" navLinks={floorNavLinks}>
			<Outlet />
		</AppLayout>
	);
}
