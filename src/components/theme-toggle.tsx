"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "./theme-provider";
import { Button } from "~/components/ds/button";

export function ThemeToggle() {
	const { theme, setTheme } = useTheme();

	const toggleTheme = () => {
		if (theme === "light") {
			setTheme("dark");
		} else if (theme === "dark") {
			setTheme("light");
		} else {
			// system -> toggle to opposite of current system preference
			const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
			setTheme(systemPrefersDark ? "light" : "dark");
		}
	};

	// Simple icon logic - use conditional rendering instead of component creation
	const showSun = theme === "dark";

	return (
		<Button variant="ghost" size="sm" onPress={toggleTheme} className="w-9 px-0">
			{showSun ? (
				<Sun className="h-[1.2rem] w-[1.2rem]" />
			) : (
				<Moon className="h-[1.2rem] w-[1.2rem]" />
			)}
			<span className="sr-only">Toggle theme</span>
		</Button>
	);
}
