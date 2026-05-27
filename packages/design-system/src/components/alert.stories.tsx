import type { Meta, StoryObj } from "@storybook/react-vite";
import { Alert } from "./alert";

const meta = {
	title: "Components/Alert",
	component: Alert,
	tags: ["autodocs"],
	args: {
		variant: "info",
		title: "Shift Note",
		children: "Station B is running a short calibration cycle.",
	},
	argTypes: {
		variant: {
			control: "select",
			options: ["success", "error", "warning", "info"],
		},
	},
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
	render: () => (
		<div className="grid w-[420px] gap-3">
			<Alert variant="success" title="Online">Station is ready.</Alert>
			<Alert variant="warning" title="Attention">Throughput dropped below target.</Alert>
			<Alert variant="error" title="Fault">Sensor calibration required.</Alert>
			<Alert variant="info" title="Notice">Break rotation starts in 15 minutes.</Alert>
		</div>
	),
};
