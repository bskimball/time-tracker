import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "./badge";
import { IndustrialHeader, IndustrialPanel, IndustrialSection, SafetyStripes } from "./industrial";

const meta = {
	title: "Components/Industrial",
	component: IndustrialPanel,
	tags: ["autodocs"],
} satisfies Meta<typeof IndustrialPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Panel: Story = {
	render: () => (
		<IndustrialPanel className="w-[420px]">
			<SafetyStripes />
			<IndustrialSection title="Station Health">
				<p className="font-mono text-sm text-muted-foreground">All monitored inputs are within range.</p>
			</IndustrialSection>
		</IndustrialPanel>
	),
};

export const Header: Story = {
	render: () => (
		<IndustrialHeader
			className="w-[520px]"
			title="Line Operations"
			subtitle="Shift Pulse"
			badge={<Badge variant="success">ONLINE</Badge>}
		>
			<p className="max-w-md font-mono text-sm text-zinc-300">
				Monitor shift progress, handoffs, and station readiness from a single surface.
			</p>
		</IndustrialHeader>
	),
};
