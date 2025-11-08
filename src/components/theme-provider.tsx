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
	const [theme, setTheme] = useState<Theme>(() => {
		if (typeof window === "undefined") return defaultTheme;
		return (localStorage.getItem(storageKey) as Theme) || defaultTheme;
	});

	useEffect(() => {
		const root = window.document.documentElement;

		let effectiveTheme: "light" | "dark";

		if (theme === "system") {
			effectiveTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
		} else {
			effectiveTheme = theme;
		}

		root.classList.remove("light", "dark");
		root.classList.add(effectiveTheme);
		root.setAttribute("data-theme", effectiveTheme);
	}, [theme]);

	const value = useMemo(
		() => ({
			theme,
			setTheme: (theme: Theme) => {
				localStorage.setItem(storageKey, theme);
				setTheme(theme);
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
