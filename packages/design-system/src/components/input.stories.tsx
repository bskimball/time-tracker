import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input, SimpleInput } from "./input";

const meta = {
	title: "Components/Input",
	component: Input,
	tags: ["autodocs"],
	args: {
		label: "Employee Code",
		placeholder: "EMP-1042",
		description: "Use the badge code printed on the station card.",
	},
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithError: Story = {
	args: {
		error: "Code does not match an active operator.",
	},
};

export const Simple: Story = {
	render: () => <SimpleInput aria-label="Station" placeholder="Station ID" />,
};
