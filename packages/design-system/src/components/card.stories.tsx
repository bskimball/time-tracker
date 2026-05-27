import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./button";
import { Card, CardBody, CardFooter, CardHeader, CardTitle } from "./card";

const meta = {
	title: "Components/Card",
	component: Card,
	tags: ["autodocs"],
	args: {
		children: null,
	},
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<Card className="w-[360px]">
			<CardHeader>
				<CardTitle>Station Output</CardTitle>
			</CardHeader>
			<CardBody>
				<p className="font-mono text-sm text-muted-foreground">
					Line A is tracking 8% above target for the current shift.
				</p>
			</CardBody>
			<CardFooter>
				<Button size="sm" variant="outline">
					Inspect
				</Button>
			</CardFooter>
		</Card>
	),
};
