import type { Meta, StoryObj } from "@storybook/react-vite";
import { Metric } from "./metric";

const meta = {
	title: "Components/Metric",
	component: Metric,
	tags: ["autodocs"],
	args: {
		label: "Throughput",
		value: "1,024 u/h",
		trend: "+12%",
		trendDirection: "up",
	},
	argTypes: {
		trendDirection: {
			control: "select",
			options: ["up", "down", "neutral"],
		},
	},
} satisfies Meta<typeof Metric>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const TrendStates: Story = {
	render: () => (
		<div className="grid gap-6 sm:grid-cols-3">
			<Metric label="Output" value="98%" trend="4%" trendDirection="up" />
			<Metric label="Cycle" value="42s" trend="2s" trendDirection="down" />
			<Metric label="Queue" value="12" trend="stable" trendDirection="neutral" />
		</div>
	),
};
