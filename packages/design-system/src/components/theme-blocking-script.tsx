import { THEME_STORAGE_KEY, getThemeBlockingScriptContent } from "../theme";

interface ThemeBlockingScriptProps {
	storageKey?: string;
}

export function ThemeBlockingScript({ storageKey = THEME_STORAGE_KEY }: ThemeBlockingScriptProps) {
	return (
		<script
			dangerouslySetInnerHTML={{ __html: getThemeBlockingScriptContent(storageKey) }}
			suppressHydrationWarning
		/>
	);
}
