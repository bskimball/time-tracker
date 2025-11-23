import { Link } from "react-router";
import { Card } from "~/components/ds/card";
import { Button } from "~/components/ds/button";

export default function SettingsIndex() {
	const settingsOptions = [
		{
			title: "Stations",
			description: "Manage workstation configurations and assignments.",
			href: "/settings/stations",
			icon: (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					className="h-6 w-6"
				>
					<rect width="18" height="18" x="3" y="3" rx="2" />
					<path d="M7 7h10" />
					<path d="M7 12h10" />
					<path d="M7 17h10" />
				</svg>
			),
		},
		{
			title: "Employees",
			description: "Manage employee profiles, roles, and access.",
			href: "/settings/employees",
			icon: (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					className="h-6 w-6"
				>
					<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
					<circle cx="9" cy="7" r="4" />
					<path d="M22 21v-2a4 4 0 0 0-3-3.87" />
					<path d="M16 3.13a4 4 0 0 1 0 7.75" />
				</svg>
			),
		},
		{
			title: "Users",
			description: "Manage system users and administrative access.",
			href: "/settings/users",
			icon: (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					className="h-6 w-6"
				>
					<path d="M18 21a8 8 0 0 0-16 0" />
					<circle cx="10" cy="8" r="5" />
					<path d="M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3" />
				</svg>
			),
		},
		{
			title: "API Keys",
			description: "Manage API keys for external integrations.",
			href: "/settings/api-keys",
			icon: (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					className="h-6 w-6"
				>
					<path d="m21 2-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0 3 3L22 7l-3-3m-3.5 3.5L19 4" />
				</svg>
			),
		},
	];

	return (
		<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
			{settingsOptions.map((option) => (
				<Link key={option.href} to={option.href} className="block h-full">
					<Card className="h-full transition-colors hover:bg-muted/50">
						<div className="p-6 flex flex-col h-full">
							<div className="flex items-center gap-4 mb-4">
								<div className="p-2 rounded-lg bg-primary/10 text-primary">
									{option.icon}
								</div>
								<h3 className="font-semibold text-lg">{option.title}</h3>
							</div>
							<p className="text-muted-foreground mb-6 grow">
								{option.description}
							</p>
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
