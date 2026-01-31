"use client";

import React from "react";
import { Button } from "@monorepo/design-system";

interface TouchButtonProps {
	children: React.ReactNode;
	onPress?: () => void;
	variant?: "primary" | "secondary" | "outline" | "ghost" | "error";
	size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
	disabled?: boolean;
	loading?: boolean;
	badge?: string | number;
	icon?: React.ReactNode;
	className?: string;
	hapticFeedback?: boolean;
	ripple?: boolean;
	longPressDelay?: number;
	onLongPress?: () => void;
	type?: "button" | "submit" | "reset";
}

export function TouchButton({
	children,
	onPress,
	variant = "primary",
	size = "xl", // Default to extra large for touch
	disabled = false,
	loading = false,
	badge,
	icon,
	className = "",
	hapticFeedback = true,
	ripple = true,
	longPressDelay = 500,
	onLongPress,
	type = "button",
}: TouchButtonProps) {
	const [isPressed] = React.useState(false);
	const [rippleOrigin, setRippleOrigin] = React.useState({ x: 0, y: 0 });
	const [showRipple, setShowRipple] = React.useState(false);
	const longPressTimer = React.useRef<NodeJS.Timeout | null>(null);

	const handlePress = (e: React.MouseEvent | React.TouchEvent) => {
		if (disabled || loading) return;

		// Haptic feedback for mobile devices
		if (hapticFeedback && "vibrate" in navigator) {
			navigator.vibrate(25); // Light vibration
		}

		// Ripple effect
		if (ripple) {
			const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
			const x =
				"touches" in e
					? e.touches[0].clientX - rect.left
					: (e as React.MouseEvent).clientX - rect.left;
			const y =
				"touches" in e
					? e.touches[0].clientY - rect.top
					: (e as React.MouseEvent).clientY - rect.top;

			setRippleOrigin({ x, y });
			setShowRipple(true);
			setTimeout(() => setShowRipple(false), 600);
		}

		onPress?.();
	};

	const handleLongPressStart = () => {
		if (onLongPress && !disabled && !loading) {
			longPressTimer.current = setTimeout(() => {
				if (hapticFeedback && "vibrate" in navigator) {
					navigator.vibrate([50, 50, 50]); // Strong vibration for long press
				}
				onLongPress();
			}, longPressDelay);
		}
	};

	const handleLongPressEnd = () => {
		if (longPressTimer.current) {
			clearTimeout(longPressTimer.current);
			longPressTimer.current = null;
		}
	};

	// Touch-friendly size classes
	const touchSizes = {
		xs: "min-h-[44px] min-w-[44px] text-sm", // Minimum touch target
		sm: "min-h-[48px] min-w-[48px] text-base",
		md: "min-h-[52px] min-w-[52px] text-base",
		lg: "min-h-[56px] min-w-[56px] text-lg",
		xl: "min-h-[64px] min-w-[64px] text-xl", // Extra large
		"2xl": "min-h-[72px] min-w-[72px] text-2xl", // Very large
	};

	return (
		<div
			className="relative inline-block"
			onTouchStart={(e) => {
				handleLongPressStart();
				handlePress(e);
			}}
			onTouchEnd={handleLongPressEnd}
			onMouseDown={(e) => {
				handleLongPressStart();
				handlePress(e);
			}}
			onMouseUp={handleLongPressEnd}
			onMouseLeave={handleLongPressEnd}
		>
			<Button
				variant={variant}
				size="lg" // Use Button's large size as base
				disabled={disabled || loading}
				className={`
          ${touchSizes[size]}
          ${isPressed ? "scale-95" : ""}
          ${ripple ? "overflow-hidden" : ""}
          transition-all duration-150 touch-manipulation
          shadow-lg
          [-webkit-tap-highlight-color:transparent]
          ${className}
        `}
				onPress={onPress}
				type={type}
			>
				<span className="flex items-center gap-3 justify-center relative z-10">
					{icon && <span className="flex-shrink-0">{icon}</span>}
					<span className="font-bold">{children}</span>
					{badge && (
						<span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full min-w-[24px] min-h-[24px] flex items-center justify-center text-xs font-bold animate-pulse">
							{badge}
						</span>
					)}
				</span>

				{ripple && showRipple && (
					<span
						className="absolute bg-white opacity-30 rounded-full pointer-events-none"
						style={{
							left: rippleOrigin.x - 10,
							top: rippleOrigin.y - 10,
							width: "20px",
							height: "20px",
							animation: "ripple 0.6s ease-out",
						}}
					/>
				)}
			</Button>

			<style>{`
				@keyframes ripple {
					from {
						transform: scale(0);
						opacity: 0.6;
					}
					to {
						transform: scale(8);
						opacity: 0;
					}
				}
			`}</style>
		</div>
	);
}

interface TouchIconButtonProps {
	icon: React.ReactNode;
	onPress?: () => void;
	variant?: "primary" | "secondary" | "outline" | "ghost" | "error";
	size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
	disabled?: boolean;
	loading?: boolean;
	badge?: string | number;
	label?: string;
	className?: string;
	hapticFeedback?: boolean;
}

export function TouchIconButton({
	icon,
	onPress,
	variant = "primary",
	size = "xl",
	disabled = false,
	loading = false,
	badge,
	label,
	className = "",
	hapticFeedback = true,
}: TouchIconButtonProps) {
	return (
		<TouchButton
			onPress={onPress}
			variant={variant}
			size={size}
			disabled={disabled}
			loading={loading}
			badge={badge}
			icon={icon}
			className={className}
			hapticFeedback={hapticFeedback}
		>
			{label && <span className="sr-only">{label}</span>}
		</TouchButton>
	);
}
