"use client";

import { cn } from "~/lib/cn";

interface IndustrialSpinnerProps {
	className?: string;
	size?: "sm" | "md" | "lg";
}

export function IndustrialSpinner({ className, size = "sm" }: IndustrialSpinnerProps) {
	const sizeClasses = {
		sm: "gap-0.5",
		md: "gap-1",
		lg: "gap-1.5",
	};

	const squareClasses = {
		sm: "w-1.5 h-1.5 rounded-[0.5px]",
		md: "w-2 h-2 rounded-[1px]",
		lg: "w-3 h-3 rounded-[1px]",
	};

	// DOM order: TopLeft, TopRight, BottomLeft, BottomRight
	// Desired animation sequence (Clockwise): TL(0) -> TR(1) -> BR(2) -> BL(3)
	// Delays:
	// TL (index 0): 0 * step
	// TR (index 1): 1 * step
	// BL (index 2): 3 * step
	// BR (index 3): 2 * step
	const delays = [0, 1, 3, 2];

	return (
		<div
			className={cn("grid grid-cols-2 inline-grid", sizeClasses[size], className)}
			role="status"
			aria-label="Loading"
		>
			{[0, 1, 2, 3].map((i) => (
				<div
					key={i}
					className={cn("bg-current opacity-30 animate-sequence-pulse", squareClasses[size])}
					style={{
						animationDelay: `${delays[i] * 150}ms`,
						animationDuration: "1s",
					}}
				/>
			))}
		</div>
	);
}
