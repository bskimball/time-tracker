import type { Meta, StoryObj } from "@storybook/react-vite";
import { ThemeProvider } from "./theme-provider";
import { ThemeToggle } from "./theme-toggle";

const meta = {
	title: "Components/ThemeToggle",
	component: ThemeToggle,
	tags: ["autodocs"],
	args: {
		defaultTheme: "system",
	},
	argTypes: {
		defaultTheme: {
			control: "select",
			options: ["light", "dark", "system"],
		},
	},
} satisfies Meta<typeof ThemeToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Standalone: Story = {};

export const WithProvider: Story = {
	render: () => (
		<ThemeProvider defaultTheme="system" storageKey="storybook-theme">
			<ThemeToggle storageKey="storybook-theme" />
		</ThemeProvider>
	),
};
