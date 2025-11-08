/**
 * Utility function for merging className strings conditionally.
 * Handles undefined, null, false, and empty strings.
 * Works similarly to clsx/classnames but with better type inference.
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
	return classes
		.filter((item): item is string => Boolean(item) && typeof item === "string")
		.join(" ");
}
