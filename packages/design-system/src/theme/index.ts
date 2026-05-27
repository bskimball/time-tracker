export type Theme = "dark" | "light" | "system";
export type ResolvedTheme = "dark" | "light";

export const THEME_STORAGE_KEY = "ui-theme";

export function getSystemTheme(): ResolvedTheme {
	if (typeof window === "undefined") return "light";
	return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function isTheme(value: string | null): value is Theme {
	return value === "dark" || value === "light" || value === "system";
}

export function getStoredTheme(storageKey = THEME_STORAGE_KEY): Theme | null {
	if (typeof window === "undefined") return null;
	const storedTheme = localStorage.getItem(storageKey);
	return isTheme(storedTheme) ? storedTheme : null;
}

export function setStoredTheme(theme: Theme, storageKey = THEME_STORAGE_KEY): void {
	if (typeof window === "undefined") return;
	localStorage.setItem(storageKey, theme);
}

export function getEffectiveTheme(theme?: Theme): ResolvedTheme {
	if (theme === "system" || !theme) {
		return getSystemTheme();
	}
	return theme;
}

export function applyTheme(theme: ResolvedTheme): void {
	if (typeof window === "undefined") return;
	const root = document.documentElement;
	root.classList.remove("light", "dark");
	root.classList.add(theme);
	root.setAttribute("data-theme", theme);
	root.style.colorScheme = theme;
}

export function getThemeBlockingScriptContent(storageKey = THEME_STORAGE_KEY) {
	return `
(function() {
  try {
    const storageKey = '${storageKey}';
    const stored = localStorage.getItem(storageKey);
    let effectiveTheme = 'light';
    if (stored === 'dark' || stored === 'light') {
      effectiveTheme = stored;
    } else if (!stored || stored === 'system') {
      effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(effectiveTheme);
    root.setAttribute('data-theme', effectiveTheme);
    root.style.colorScheme = effectiveTheme;
  } catch (e) {
    document.documentElement.classList.add('light');
  }
})();
`;
}
