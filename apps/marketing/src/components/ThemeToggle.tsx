import { useEffect, useState } from "react";
import { LiaSunSolid, LiaMoonSolid } from "react-icons/lia";

export default function ThemeToggle() {
	const [theme, setTheme] = useState<"light" | "dark">("light");
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
		const isDark = document.documentElement.classList.contains("dark");
		setTheme(isDark ? "dark" : "light");
	}, []);

	const toggleTheme = () => {
		// Mechanical power cycle effect
		document.documentElement.classList.add("animate-power-cycle");
		setTimeout(() => {
			document.documentElement.classList.remove("animate-power-cycle");
		}, 400);

		const newTheme = theme === "light" ? "dark" : "light";
		setTheme(newTheme);
		if (newTheme === "dark") {
			document.documentElement.classList.add("dark");
			localStorage.setItem("theme", "dark");
		} else {
			document.documentElement.classList.remove("dark");
			localStorage.setItem("theme", "light");
		}
	};

	if (!mounted) {
		return <div className="w-9 h-9" />; // Placeholder to prevent hydration mismatch
	}

	return (
		<button
			onClick={toggleTheme}
			className="p-2 rounded-sm hover:bg-accent hover:text-accent-foreground transition-colors text-muted-foreground"
			aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
		>
			{theme === "light" ? (
				<LiaMoonSolid className="w-5 h-5" />
			) : (
				<LiaSunSolid className="w-5 h-5" />
			)}
		</button>
	);
}
