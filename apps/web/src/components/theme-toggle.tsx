"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@monorepo/design-system";
import { useTheme } from "./theme-provider";

type ResolvedTheme = "light" | "dark";

export function ThemeToggle() {
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);
	const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>("light");

	// Set mounted state after hydration
	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setMounted(true);
	}, []);

	useEffect(() => {
		if (theme === "system") {
			const media =
				typeof window !== "undefined" ? window.matchMedia("(prefers-color-scheme: dark)") : null;

			if (!media) {
				// eslint-disable-next-line react-hooks/set-state-in-effect
				setResolvedTheme("light");
				return;
			}

			const updateFromSystem = () => setResolvedTheme(media.matches ? "dark" : "light");

			updateFromSystem();

			if (typeof media.addEventListener === "function") {
				media.addEventListener("change", updateFromSystem);
				return () => media.removeEventListener("change", updateFromSystem);
			}

			if (typeof media.addListener === "function") {
				media.addListener(updateFromSystem);
				return () => media.removeListener(updateFromSystem);
			}

			return;
		}

		setResolvedTheme(theme === "dark" ? "dark" : "light");
	}, [theme]);

	const toggleTheme = () => {
		const next = resolvedTheme === "light" ? "dark" : "light";
		setTheme(next);
		setResolvedTheme(next);
	};

	// During SSR and initial hydration, always render light mode to match server
	const showSun = mounted && resolvedTheme === "dark";
	const isDark = mounted && resolvedTheme === "dark";

	return (
		<Button
			variant="ghost"
			size="sm"
			onPress={toggleTheme}
			className="w-9 px-0 relative z-50 text-muted-foreground hover:text-foreground border border-transparent"
			aria-pressed={isDark}
			aria-label="Toggle theme"
		>
			{showSun ? (
				<Sun className="h-[1.2rem] w-[1.2rem] pointer-events-none" />
			) : (
				<Moon className="h-[1.2rem] w-[1.2rem] pointer-events-none" />
			)}
		</Button>
	);
}
