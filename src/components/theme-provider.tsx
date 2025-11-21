"use client";

import { createContext, useContext, useEffect, useState, useMemo } from "react";
import type { Theme } from "~/lib/themes";

type ThemeProviderProps = {
	children: React.ReactNode;
	defaultTheme?: Theme;
	storageKey?: string;
};

type ThemeProviderState = {
	theme: Theme;
	setTheme: (theme: Theme) => void;
};

const ThemeProviderContext = createContext<ThemeProviderState | undefined>(undefined);

export function ThemeProvider({
	children,
	defaultTheme = "system",
	storageKey = "ui-theme",
	...props
}: ThemeProviderProps) {
	const [theme, setThemeState] = useState<Theme>(() => {
		if (typeof window === "undefined") return defaultTheme;
		try {
			return (localStorage.getItem(storageKey) as Theme | null) || defaultTheme;
		} catch {
			return defaultTheme;
		}
	});

	useEffect(() => {
		const root = window.document.documentElement;

		let effectiveTheme: "light" | "dark";

		if (theme === "system") {
			const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
			effectiveTheme = prefersDark ? "dark" : "light";
		} else {
			effectiveTheme = theme;
		}

		root.classList.remove("light", "dark");
		root.classList.add(effectiveTheme);
		root.setAttribute("data-theme", effectiveTheme);
		root.style.colorScheme = effectiveTheme;
	}, [theme]);

	const value = useMemo(
		() => ({
			theme,
			setTheme: (nextTheme: Theme) => {
				try {
					localStorage.setItem(storageKey, nextTheme);
				} catch {}
				setThemeState(nextTheme);
			},
		}),
		[theme, storageKey]
	);

	return (
		<ThemeProviderContext.Provider {...props} value={value}>
			{children}
		</ThemeProviderContext.Provider>
	);
}

export const useTheme = () => {
	const context = useContext(ThemeProviderContext);

	if (context === undefined) throw new Error("useTheme must be used within a ThemeProvider");

	return context;
};
