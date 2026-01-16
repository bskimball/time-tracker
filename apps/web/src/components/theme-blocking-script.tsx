/**
 * ThemeBlockingScript - Synchronous blocking script to prevent dark mode flash
 *
 * This script runs BEFORE React hydration to immediately apply the correct theme.
 * It prevents the flash of light mode that would occur if theme was applied in useEffect.
 *
 * The script:
 * 1. Checks localStorage for stored theme preference (key: 'ui-theme')
 * 2. Falls back to system preference if not stored
 * 3. Applies the correct class and attributes to <html> element
 * 4. Sets color-scheme property
 *
 * This must be inline, synchronous (no async/defer), and in the <head> to work correctly.
 */

const THEME_STORAGE_KEY = "ui-theme";

const themeBlockingScriptContent = `
(function() {
  try {
    const storageKey = '${THEME_STORAGE_KEY}';
    const stored = localStorage.getItem(storageKey);
    
    let effectiveTheme = 'light';
    
    // If stored is 'dark' or 'light', use it directly
    if (stored === 'dark' || stored === 'light') {
      effectiveTheme = stored;
    }
    // If stored is 'system' or not set, detect system preference
    else if (!stored || stored === 'system') {
      effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(effectiveTheme);
    root.style.colorScheme = effectiveTheme;
  } catch (e) {
    // Silently fail if localStorage is not available (e.g., in private browsing)
    // Default to light mode
    document.documentElement.classList.add('light');
  }
})();
`;

export function ThemeBlockingScript() {
	return (
		<script
			dangerouslySetInnerHTML={{ __html: themeBlockingScriptContent }}
			suppressHydrationWarning
		/>
	);
}
