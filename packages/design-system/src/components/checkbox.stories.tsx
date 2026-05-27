import type { Meta, StoryObj } from "@storybook/react-vite";
import { Checkbox } from "./checkbox";

const meta = {
	title: "Components/Checkbox",
	component: Checkbox,
	tags: ["autodocs"],
	args: {
		label: "Acknowledge handoff",
		description: "Confirm the previous operator completed the station checklist.",
	},
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Selected: Story = {
	args: {
		isSelected: true,
	},
};

export const WithError: Story = {
	args: {
		error: "Acknowledgement is required before clock-in.",
	},
};
