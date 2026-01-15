// Shared types for the design system
export type Theme = "dark" | "light" | "system";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "error";
export type ButtonSize = "xs" | "sm" | "md" | "lg";

export type InputVariant = "default" | "error";
export type InputSize = "sm" | "md" | "lg";

export type AlertVariant = "success" | "error" | "warning" | "info";

export type IndustrialPanelVariant = "default" | "destructive";

export interface SelectOption {
	value: string;
	label: string;
	isDisabled?: boolean;
}
