import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { IndustrialSidebar } from "~/components/industrial-sidebar";
import { ThemeProvider } from "~/components/theme-provider";
import { ThemeToggle } from "~/components/theme-toggle";

const renderSidebar = () => {
	return render(
		<MemoryRouter initialEntries={["/manager"]}>
			<IndustrialSidebar
				title="Manager Portal"
				navLinks={[
					{ to: "/manager", label: "Dashboard" },
					{ to: "/manager/employees", label: "Employees" },
				]}
				userSection={<div>user</div>}
			>
				<div>content</div>
			</IndustrialSidebar>
		</MemoryRouter>
	);
};

describe("IndustrialSidebar", () => {
	beforeEach(() => {
		document.documentElement.className = "";
		document.documentElement.removeAttribute("data-theme");
		document.documentElement.style.colorScheme = "";

		Object.defineProperty(window, "matchMedia", {
			writable: true,
			value: vi.fn().mockImplementation((query: string) => ({
				matches: query.includes("dark") ? false : false,
				media: query,
				onchange: null,
				addListener: () => {},
				removeListener: () => {},
				addEventListener: () => {},
				removeEventListener: () => {},
				dispatchEvent: () => false,
			})),
		});
	});

	it("toggles the collapsed state", async () => {
		renderSidebar();
		const toggle = screen.getByRole("button", { name: /collapse sidebar/i });
		const user = userEvent.setup();

		expect(toggle).toHaveAttribute("aria-expanded", "true");

		await user.click(toggle);

		expect(toggle).toHaveAttribute("aria-expanded", "false");
	});

	it("toggles between light and dark themes", async () => {
		render(
			<ThemeProvider defaultTheme="light">
				<ThemeToggle />
			</ThemeProvider>
		);

		const button = screen.getByRole("button", { name: /toggle theme/i });
		const user = userEvent.setup();

		expect(document.documentElement.classList.contains("dark")).toBe(false);

		await user.click(button);

		expect(document.documentElement.classList.contains("dark")).toBe(true);
	});
});
