import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tab, TabList, TabPanel, Tabs } from "./tabs";

const meta = {
	title: "Components/Tabs",
	component: Tabs,
	tags: ["autodocs"],
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<Tabs defaultSelectedKey="overview" className="w-[420px]">
			<TabList aria-label="Station views">
				<Tab id="overview">Overview</Tab>
				<Tab id="queue">Queue</Tab>
				<Tab id="events">Events</Tab>
			</TabList>
			<TabPanel id="overview">
				<p className="font-mono text-sm text-muted-foreground">Current shift is on target.</p>
			</TabPanel>
			<TabPanel id="queue">
				<p className="font-mono text-sm text-muted-foreground">Three tasks are queued.</p>
			</TabPanel>
			<TabPanel id="events">
				<p className="font-mono text-sm text-muted-foreground">No unresolved events.</p>
			</TabPanel>
		</Tabs>
	),
};
