"use client";

import { useEffect, useState } from "react";
import { Button } from "./button";
import { useOptionalTheme } from "./theme-provider";
import {
	THEME_STORAGE_KEY,
	applyTheme,
	getEffectiveTheme,
	getStoredTheme,
	setStoredTheme,
	type ResolvedTheme,
	type Theme,
} from "../theme";
import { cn } from "../utils/cn";

interface ThemeToggleProps {
	className?: string;
	defaultTheme?: Theme;
	hideUntilMounted?: boolean;
	storageKey?: string;
	withPowerCycle?: boolean;
}

function SunIcon({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
			<path d="M12 4V2" strokeWidth="1.8" strokeLinecap="square" />
			<path d="M12 22v-2" strokeWidth="1.8" strokeLinecap="square" />
			<path d="m4.93 4.93-1.41-1.41" strokeWidth="1.8" strokeLinecap="square" />
			<path d="m20.48 20.48-1.41-1.41" strokeWidth="1.8" strokeLinecap="square" />
			<path d="M4 12H2" strokeWidth="1.8" strokeLinecap="square" />
			<path d="M22 12h-2" strokeWidth="1.8" strokeLinecap="square" />
			<path d="m4.93 19.07-1.41 1.41" strokeWidth="1.8" strokeLinecap="square" />
			<path d="m20.48 3.52-1.41 1.41" strokeWidth="1.8" strokeLinecap="square" />
			<circle cx="12" cy="12" r="4" strokeWidth="1.8" />
		</svg>
	);
}

function MoonIcon({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
			<path
				d="M20 15.3A8.5 8.5 0 0 1 8.7 4 7 7 0 1 0 20 15.3Z"
				strokeWidth="1.8"
				strokeLinecap="square"
				strokeLinejoin="miter"
			/>
		</svg>
	);
}

export function ThemeToggle({
	className,
	defaultTheme = "system",
	hideUntilMounted = false,
	storageKey = THEME_STORAGE_KEY,
	withPowerCycle = false,
}: ThemeToggleProps) {
	const context = useOptionalTheme();
	const [mounted, setMounted] = useState(false);
	const [standaloneTheme, setStandaloneTheme] = useState<Theme>(() => defaultTheme);
	const theme = context?.theme ?? standaloneTheme;
	const resolvedTheme = context?.resolvedTheme ?? getEffectiveTheme(theme);

	useEffect(() => {
		// Initial client-only state avoids SSR theme mismatches for app and Astro consumers.
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setMounted(true);
		if (context) return;

		const storedTheme = getStoredTheme(storageKey) || defaultTheme;
		setStandaloneTheme(storedTheme);
		applyTheme(getEffectiveTheme(storedTheme));
	}, [context, defaultTheme, storageKey]);

	useEffect(() => {
		if (context || theme !== "system" || typeof window === "undefined") return;

		const media = window.matchMedia("(prefers-color-scheme: dark)");
		const updateFromSystem = () => applyTheme(media.matches ? "dark" : "light");
		media.addEventListener("change", updateFromSystem);
		return () => media.removeEventListener("change", updateFromSystem);
	}, [context, theme]);

	const setTheme = (nextTheme: Theme) => {
		if (withPowerCycle && typeof document !== "undefined") {
			document.documentElement.classList.add("animate-power-cycle");
			window.setTimeout(() => {
				document.documentElement.classList.remove("animate-power-cycle");
			}, 400);
		}

		if (context) {
			context.setTheme(nextTheme);
			return;
		}

		try {
			setStoredTheme(nextTheme, storageKey);
		} catch {
			// Ignore localStorage errors, for example in private browsing mode.
		}
		setStandaloneTheme(nextTheme);
		applyTheme(getEffectiveTheme(nextTheme));
	};

	const isDark = mounted && resolvedTheme === "dark";
	const nextTheme: ResolvedTheme = isDark ? "light" : "dark";

	if (!mounted && hideUntilMounted) {
		return <div className={cn("h-9 w-9", className)} aria-hidden="true" />;
	}

	return (
		<Button
			variant="ghost"
			size="sm"
			onPress={() => setTheme(nextTheme)}
			className={cn(
				"relative z-50 w-9 border border-transparent px-0 text-foreground/72 hover:text-foreground dark:text-muted-foreground",
				className
			)}
			aria-pressed={isDark}
			aria-label={`Switch to ${nextTheme} mode`}
		>
			{isDark ? (
				<SunIcon className="h-[1.2rem] w-[1.2rem] pointer-events-none" />
			) : (
				<MoonIcon className="h-[1.2rem] w-[1.2rem] pointer-events-none" />
			)}
		</Button>
	);
}
