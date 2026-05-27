import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "./badge";

const meta = {
	title: "Components/Badge",
	component: Badge,
	tags: ["autodocs"],
	args: {
		children: "ONLINE",
		variant: "primary",
	},
	argTypes: {
		variant: {
			control: "select",
			options: ["primary", "secondary", "outline", "destructive", "success"],
		},
	},
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
	render: () => (
		<div className="flex flex-wrap gap-2">
			<Badge variant="primary">PRIMARY</Badge>
			<Badge variant="secondary">SECONDARY</Badge>
			<Badge variant="outline">OUTLINE</Badge>
			<Badge variant="destructive">FAULT</Badge>
			<Badge variant="success">ONLINE</Badge>
		</div>
	),
};
