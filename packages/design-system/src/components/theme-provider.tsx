"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
	THEME_STORAGE_KEY,
	applyTheme,
	getEffectiveTheme,
	getStoredTheme,
	setStoredTheme,
	type ResolvedTheme,
	type Theme,
} from "../theme";

type ThemeProviderProps = {
	children: React.ReactNode;
	defaultTheme?: Theme;
	storageKey?: string;
};

type ThemeProviderState = {
	theme: Theme;
	resolvedTheme: ResolvedTheme;
	setTheme: (theme: Theme) => void;
};

const ThemeProviderContext = createContext<ThemeProviderState | undefined>(undefined);

export function ThemeProvider({
	children,
	defaultTheme = "system",
	storageKey = THEME_STORAGE_KEY,
	...props
}: ThemeProviderProps) {
	const [theme, setThemeState] = useState<Theme>(() => getStoredTheme(storageKey) || defaultTheme);
	const resolvedTheme = getEffectiveTheme(theme);

	useEffect(() => {
		applyTheme(resolvedTheme);
	}, [resolvedTheme]);

	useEffect(() => {
		if (theme !== "system" || typeof window === "undefined") return;

		const media = window.matchMedia("(prefers-color-scheme: dark)");
		const updateFromSystem = () => applyTheme(media.matches ? "dark" : "light");
		media.addEventListener("change", updateFromSystem);
		return () => media.removeEventListener("change", updateFromSystem);
	}, [theme]);

	const value = useMemo(
		() => ({
			theme,
			resolvedTheme,
			setTheme: (nextTheme: Theme) => {
				try {
					setStoredTheme(nextTheme, storageKey);
				} catch {
					// Ignore localStorage errors, for example in private browsing mode.
				}
				setThemeState(nextTheme);
			},
		}),
		[theme, resolvedTheme, storageKey]
	);

	return (
		<ThemeProviderContext.Provider {...props} value={value}>
			{children}
		</ThemeProviderContext.Provider>
	);
}

export function useTheme() {
	const context = useContext(ThemeProviderContext);
	if (context === undefined) throw new Error("useTheme must be used within a ThemeProvider");
	return context;
}

export function useOptionalTheme() {
	return useContext(ThemeProviderContext);
}
