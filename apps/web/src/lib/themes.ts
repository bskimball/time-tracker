export type Theme = "dark" | "light" | "system";

export const THEME_STORAGE_KEY = "ui-theme";

export function getSystemTheme(): "dark" | "light" {
	if (typeof window === "undefined") return "light";
	return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function getStoredTheme(): Theme | null {
	if (typeof window === "undefined") return null;
	return localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
}

export function setStoredTheme(theme: Theme): void {
	if (typeof window === "undefined") return;
	localStorage.setItem(THEME_STORAGE_KEY, theme);
}

export function getEffectiveTheme(theme?: Theme): "dark" | "light" {
	if (theme === "system" || !theme) {
		return getSystemTheme();
	}
	return theme;
}

export function applyTheme(theme: "dark" | "light"): void {
	if (typeof window === "undefined") return;
	const root = document.documentElement;
	root.classList.remove("light", "dark");
	root.classList.add(theme);
	root.setAttribute("data-theme", theme);
}
