import type { Preview } from "@storybook/react-vite";
import "./preview.css";

const preview: Preview = {
	parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
		backgrounds: {
			default: "surface",
			values: [
				{ name: "surface", value: "#fafafa" },
				{ name: "dark", value: "#18181b" },
			],
		},
		layout: "centered",
	},
	decorators: [
		(Story) => (
			<div className="min-h-screen w-full bg-background p-8 text-foreground antialiased">
				<Story />
			</div>
		),
	],
};

export default preview;
