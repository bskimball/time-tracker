import type { Meta, StoryObj } from "@storybook/react-vite";
import { Select, SimpleSelect } from "./select";

const options = [
	{ value: "line-a", label: "Line A" },
	{ value: "line-b", label: "Line B" },
	{ value: "maintenance", label: "Maintenance", isDisabled: true },
];

const meta = {
	title: "Components/Select",
	component: Select,
	tags: ["autodocs"],
	args: {
		label: "Work Area",
		placeholder: "Select area",
		options,
		description: "Disabled options remain visible for scheduling context.",
	},
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithError: Story = {
	args: {
		error: "Choose an available work area.",
	},
};

export const Simple: Story = {
	render: () => <SimpleSelect label="Station" options={options} defaultValue="line-a" />,
};
