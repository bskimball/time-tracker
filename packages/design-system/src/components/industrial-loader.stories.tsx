import type { Meta, StoryObj } from "@storybook/react-vite";
import { IndustrialLoader } from "./industrial-loader";

const meta = {
	title: "Components/IndustrialLoader",
	component: IndustrialLoader,
	tags: ["autodocs"],
	args: {
		variant: "processing",
		color: "primary",
		isAnimated: true,
	},
	argTypes: {
		variant: {
			control: "select",
			options: ["processing", "standby", "scanning"],
		},
		color: {
			control: "select",
			options: ["primary", "secondary", "success", "warning", "destructive"],
		},
	},
} satisfies Meta<typeof IndustrialLoader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
	render: () => (
		<div className="grid gap-6 text-primary">
			<IndustrialLoader variant="processing" />
			<IndustrialLoader variant="standby" />
			<IndustrialLoader variant="scanning" />
		</div>
	),
};
