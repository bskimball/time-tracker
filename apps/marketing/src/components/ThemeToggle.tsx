import { useEffect, useState } from "react";
import { LiaSunSolid, LiaMoonSolid } from "react-icons/lia";

export default function ThemeToggle() {
	const [theme, setTheme] = useState<"light" | "dark">("light");
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
		const storedTheme = localStorage.getItem("theme");
		const currentTheme =
			storedTheme === "dark" || storedTheme === "light"
				? storedTheme
				: document.documentElement.dataset.theme === "dark"
					? "dark"
					: "light";
		setTheme(currentTheme);
		document.documentElement.dataset.theme = currentTheme;
		document.documentElement.classList.toggle("dark", currentTheme === "dark");
	}, []);

	const toggleTheme = () => {
		// Mechanical power cycle effect
		document.documentElement.classList.add("animate-power-cycle");
		setTimeout(() => {
			document.documentElement.classList.remove("animate-power-cycle");
		}, 400);

		const newTheme = theme === "light" ? "dark" : "light";
		setTheme(newTheme);
		document.documentElement.dataset.theme = newTheme;
		document.documentElement.classList.toggle("dark", newTheme === "dark");
		localStorage.setItem("theme", newTheme);
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
