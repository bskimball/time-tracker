"use client";

import React from "react";

interface MobileLayoutProps {
	children: React.ReactNode;
	header?: React.ReactNode;
	footer?: React.ReactNode;
	className?: string;
	fullHeight?: boolean;
	preventZoom?: boolean;
}

export function MobileLayout({
	children,
	header,
	footer,
	className = "",
	fullHeight = true,
	preventZoom = true,
}: MobileLayoutProps) {
	return (
		<div
			className={`
        ${fullHeight ? "min-h-screen" : ""}
        ${preventZoom ? "max-w-full overflow-x-hidden" : ""}
        ${className}
      `}
			style={{
				// Prevent zoom on mobile
				...(preventZoom && {
					touchAction: "manipulation",
					userSelect: "text",
				}),
			}}
		>
			{/* Header */}
			{header && (
				<header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
					{header}
				</header>
			)}

			{/* Main Content */}
			<main className="flex-1 pb-safe-area">{children}</main>

			{/* Footer */}
			{footer && (
				<footer className="sticky bottom-0 z-40 bg-white border-t border-gray-200 shadow-lg">
					{footer}
				</footer>
			)}
		</div>
	);
}

interface MobileNavigationProps {
	currentRoute?: string;
	className?: string;
}

export function MobileNavigation({ currentRoute, className = "" }: MobileNavigationProps) {
	const navItems = [
		{ route: "/floor", label: "Time Clock", icon: clockIcon },
		{ route: "/floor/tasks", label: "Tasks", icon: taskIcon },
		{ route: "/floor/stations", label: "Stations", icon: stationIcon },
		{ route: "/floor/reports", label: "Reports", icon: reportIcon },
	];

	return (
		<nav className={`grid grid-cols-4 gap-1 p-2 ${className}`}>
			{navItems.map((item) => (
				<button
					key={item.route}
					className={`
            flex flex-col items-center justify-center py-3 px-2 rounded-lg
            text-xs font-medium transition-all duration-200
            ${
							currentRoute === item.route
								? "text-blue-600 bg-blue-50"
								: "text-gray-600 hover:bg-gray-50 active:bg-gray-100"
						}
          `}
				>
					<span className="w-6 h-6 mb-1">{item.icon}</span>
					<span className="text-center">{item.label}</span>
				</button>
			))}
		</nav>
	);
}

interface MobileCardProps {
	children: React.ReactNode;
	title?: string;
	subtitle?: string;
	className?: string;
	padding?: "sm" | "md" | "lg" | "xl";
	rounded?: boolean;
	shadow?: boolean;
	onClick?: () => void;
	variant?: "default" | "warning" | "error" | "success";
}

export function MobileCard({
	children,
	title,
	subtitle,
	className = "",
	padding = "lg",
	rounded = true,
	shadow = true,
	onClick,
	variant = "default",
}: MobileCardProps) {
	const paddingClasses = {
		sm: "p-3",
		md: "p-4",
		lg: "p-6",
		xl: "p-8",
	};

	const variantClasses = {
		default: "bg-white",
		warning: "bg-yellow-50 border border-yellow-200",
		error: "bg-red-50 border border-red-200",
		success: "bg-green-50 border border-green-200",
	};

	return (
		<div
			className={`
        ${paddingClasses[padding]}
        ${rounded ? "rounded-xl" : ""}
        ${shadow ? "shadow-lg" : ""}
        ${onClick ? "cursor-pointer active:scale-95" : ""}
        ${onClick ? "hover:shadow-xl" : ""}
        ${variantClasses[variant]} transition-all duration-200
        ${className}
      `}
			onClick={onClick}
		>
			{(title || subtitle) && (
				<div className="mb-4">
					{title && <h3 className="text-lg font-bold text-gray-900">{title}</h3>}
					{subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
				</div>
			)}

			<div className="space-y-4">{children}</div>
		</div>
	);
}

interface MobileGridProps {
	children: React.ReactNode;
	cols?: 1 | 2 | 3;
	gap?: "sm" | "md" | "lg";
	className?: string;
}

export function MobileGrid({ children, cols = 1, gap = "md", className = "" }: MobileGridProps) {
	const gridCols = {
		1: "grid-cols-1",
		2: "grid-cols-2",
		3: "grid-cols-3",
	};

	const gapClasses = {
		sm: "gap-3",
		md: "gap-4",
		lg: "gap-6",
	};

	return <div className={`grid ${gridCols[cols]} ${gapClasses[gap]} ${className}`}>{children}</div>;
}

interface MobileSectionProps {
	title?: string;
	subtitle?: string;
	action?: React.ReactNode;
	children: React.ReactNode;
	className?: string;
	showBorder?: boolean;
}

export function MobileSection({
	title,
	subtitle,
	action,
	children,
	className = "",
	showBorder = true,
}: MobileSectionProps) {
	return (
		<section className={className}>
			{(title || subtitle || action) && (
				<div className="flex items-center justify-between mb-6">
					<div>
						{title && <h2 className="text-xl font-bold text-gray-900">{title}</h2>}
						{subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
					</div>
					{action && <div>{action}</div>}
				</div>
			)}

			{showBorder && <div className="border-b border-gray-200 mb-6"></div>}

			<div className="space-y-4">{children}</div>
		</section>
	);
}

interface MobileHeaderProps {
	title: string;
	subtitle?: string;
	showBack?: boolean;
	onBack?: () => void;
	action?: React.ReactNode;
	className?: string;
}

export function MobileHeader({
	title,
	subtitle,
	showBack = false,
	onBack,
	action,
	className = "",
}: MobileHeaderProps) {
	return (
		<div className={`px-4 py-4 ${className}`}>
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-3">
					{showBack && onBack && (
						<button
							onClick={onBack}
							className="p-2 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-colors"
						>
							<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M15 19l-7-7 7-7"
								/>
							</svg>
						</button>
					)}
					<div>
						<h1 className="text-xl font-bold text-gray-900">{title}</h1>
						{subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
					</div>
				</div>
				{action && <div>{action}</div>}
			</div>
		</div>
	);
}

// Icons for navigation
const clockIcon = (
	<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
		/>
	</svg>
);

const taskIcon = (
	<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
		/>
	</svg>
);

const stationIcon = (
	<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
		/>
	</svg>
);

const reportIcon = (
	<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M9 17v1a1 1 0 001 1h4a1 1 0 001-1v-1m3-2V8a2 2 0 00-2-2H8a2 2 0 00-2 2v8m5 4h.01"
		/>
	</svg>
);

// Gesture helpers
export const useSwipeGestures = (
	elementRef: React.RefObject<HTMLElement>,
	callbacks: {
		onSwipeLeft?: () => void;
		onSwipeRight?: () => void;
		onSwipeUp?: () => void;
		onSwipeDown?: () => void;
		threshold?: number;
	}
) => {
	const threshold = callbacks.threshold || 50;

	React.useEffect(() => {
		const element = elementRef.current;
		if (!element) return;

		let startX = 0;
		let startY = 0;

		const handleStart = (e: TouchEvent) => {
			startX = e.touches[0].clientX;
			startY = e.touches[0].clientY;
		};

		const handleEnd = (e: TouchEvent) => {
			if (!startX || !startY) return;

			const endX = e.changedTouches[0].clientX;
			const endY = e.changedTouches[0].clientY;

			const deltaX = endX - startX;
			const deltaY = endY - startY;

			const absDeltaX = Math.abs(deltaX);
			const absDeltaY = Math.abs(deltaY);

			if (Math.max(absDeltaX, absDeltaY) > threshold) {
				if (absDeltaX > absDeltaY) {
					// Horizontal swipe
					if (deltaX > 0 && callbacks.onSwipeRight) callbacks.onSwipeRight();
					else if (deltaX < 0 && callbacks.onSwipeLeft) callbacks.onSwipeLeft();
				} else {
					// Vertical swipe
					if (deltaY > 0 && callbacks.onSwipeDown) callbacks.onSwipeDown();
					else if (deltaY < 0 && callbacks.onSwipeUp) callbacks.onSwipeUp();
				}
			}

			startX = 0;
			startY = 0;
		};

		element.addEventListener("touchstart", handleStart);
		element.addEventListener("touchend", handleEnd);

		return () => {
			element.removeEventListener("touchstart", handleStart);
			element.removeEventListener("touchend", handleEnd);
		};
	}, [elementRef, callbacks, threshold]);
};
