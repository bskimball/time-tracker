import { ThemeToggle as DesignSystemThemeToggle } from "@monorepo/design-system";

export default function ThemeToggle() {
	return <DesignSystemThemeToggle storageKey="theme" withPowerCycle hideUntilMounted />;
}
