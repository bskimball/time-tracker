"use client";

import { createContext, useContext, useEffect, useState, useMemo } from "react";
import {
	THEME_STORAGE_KEY,
	applyTheme,
	getEffectiveTheme,
	getStoredTheme,
	setStoredTheme,
	type Theme,
} from "~/lib/themes";

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
	storageKey = THEME_STORAGE_KEY,
	...props
}: ThemeProviderProps) {
	const [theme, setThemeState] = useState<Theme>(() => {
		if (typeof window === "undefined") return defaultTheme;
		try {
			if (storageKey !== THEME_STORAGE_KEY) {
				return (localStorage.getItem(storageKey) as Theme | null) || defaultTheme;
			}

			return getStoredTheme() || defaultTheme;
		} catch {
			return defaultTheme;
		}
	});

	useEffect(() => {
		const effectiveTheme = getEffectiveTheme(theme);
		applyTheme(effectiveTheme);
		window.document.documentElement.style.colorScheme = effectiveTheme;
	}, [theme]);

	const value = useMemo(
		() => ({
			theme,
			setTheme: (nextTheme: Theme) => {
				try {
					if (storageKey === THEME_STORAGE_KEY) {
						setStoredTheme(nextTheme);
					} else {
						localStorage.setItem(storageKey, nextTheme);
					}
				} catch {
					// Ignore localStorage errors (e.g., in private browsing mode)
				}
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
