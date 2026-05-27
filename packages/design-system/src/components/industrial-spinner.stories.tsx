import type { Meta, StoryObj } from "@storybook/react-vite";
import { IndustrialSpinner } from "./industrial-spinner";

const meta = {
	title: "Components/IndustrialSpinner",
	component: IndustrialSpinner,
	tags: ["autodocs"],
	args: {
		size: "sm",
		className: "text-primary",
	},
	argTypes: {
		size: {
			control: "select",
			options: ["sm", "md", "lg"],
		},
	},
} satisfies Meta<typeof IndustrialSpinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
	render: () => (
		<div className="flex items-center gap-6 text-primary">
			<IndustrialSpinner size="sm" />
			<IndustrialSpinner size="md" />
			<IndustrialSpinner size="lg" />
		</div>
	),
};
