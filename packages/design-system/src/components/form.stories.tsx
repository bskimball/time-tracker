import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./button";
import { Form } from "./form";
import { Input } from "./input";
import { Select } from "./select";

const meta = {
	title: "Components/Form",
	component: Form,
	tags: ["autodocs"],
} satisfies Meta<typeof Form>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<Form className="w-[360px]" onSubmit={(event) => event.preventDefault()}>
			<Input label="Employee Code" name="employee" placeholder="EMP-1042" />
			<Select
				label="Work Area"
				name="area"
				options={[
					{ value: "line-a", label: "Line A" },
					{ value: "line-b", label: "Line B" },
				]}
			/>
			<Button type="submit">Submit</Button>
		</Form>
	),
};
