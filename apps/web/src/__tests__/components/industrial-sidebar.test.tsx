import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryRouter, RouterProvider } from "react-router";
import { IndustrialSidebar } from "~/components/industrial-sidebar";
import { ThemeProvider } from "~/components/theme-provider";
import { ThemeToggle } from "~/components/theme-toggle";

const renderSidebar = () => {
	const router = createMemoryRouter(
		[
			{
				path: "*",
				element: (
					<IndustrialSidebar>
						<IndustrialSidebar.Sidebar>
							<IndustrialSidebar.Header title="Manager Portal" />
							<IndustrialSidebar.Nav>
								<IndustrialSidebar.Item to="/manager" label="Dashboard" />
								<IndustrialSidebar.Item to="/manager/employees" label="Employees" />
							</IndustrialSidebar.Nav>
							<IndustrialSidebar.Footer>
								<div>user</div>
								<IndustrialSidebar.CollapseButton />
							</IndustrialSidebar.Footer>
						</IndustrialSidebar.Sidebar>
						<IndustrialSidebar.Main>
							<IndustrialSidebar.StatusBar />
							<div>content</div>
						</IndustrialSidebar.Main>
					</IndustrialSidebar>
				),
			},
		],
		{ initialEntries: ["/manager"] }
	);

	return render(
		<RouterProvider router={router} />
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
