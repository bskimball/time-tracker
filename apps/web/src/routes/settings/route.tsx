import { Link } from "react-router";
import { Card } from "@monorepo/design-system";
import { Button } from "@monorepo/design-system";
import { LiaWarehouseSolid, LiaUsersSolid, LiaUserShieldSolid, LiaKeySolid } from "react-icons/lia";

export default function SettingsIndex() {
	const settingsOptions = [
		{
			title: "Stations",
			description: "Manage workstation configurations and assignments.",
			href: "/settings/stations",
			icon: <LiaWarehouseSolid className="h-6 w-6" />,
		},
		{
			title: "Employees",
			description: "Manage employee profiles, roles, and access.",
			href: "/settings/employees",
			icon: <LiaUsersSolid className="h-6 w-6" />,
		},
		{
			title: "Users",
			description: "Manage system users and administrative access.",
			href: "/settings/users",
			icon: <LiaUserShieldSolid className="h-6 w-6" />,
		},
		{
			title: "API Keys",
			description: "Manage API keys for external integrations.",
			href: "/settings/api-keys",
			icon: <LiaKeySolid className="h-6 w-6" />,
		},
	];

	return (
		<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
			{settingsOptions.map((option) => (
				<Link key={option.href} to={option.href} className="block h-full">
					<Card className="h-full transition-colors hover:bg-muted/50">
						<div className="p-6 flex flex-col h-full">
							<div className="flex items-center gap-4 mb-4">
								<div className="p-2 rounded-[2px] bg-primary/10 text-primary border border-primary/20">{option.icon}</div>
								<h3 className="font-semibold text-lg">{option.title}</h3>
							</div>
							<p className="text-muted-foreground mb-6 grow">{option.description}</p>
							<div className="mt-auto">
								<Button variant="outline" className="w-full">
									Manage {option.title}
								</Button>
							</div>
						</div>
					</Card>
				</Link>
			))}
		</div>
	);
}
