"use client";

import { TouchButton } from "~/components/mobile/touch-button";
import { useKioskMode } from "./kiosk-manager";

interface KioskMonitorProps {
	showExitButton?: boolean;
	position?: "bottom-center" | "top-right" | "bottom-right" | "top-left";
	className?: string;
}

export function KioskMonitor({
	showExitButton = false,
	position = "bottom-center",
	className = "",
}: KioskMonitorProps) {
	const { isKioskMode, config, session, device, batteryLevel, isCharging, exitKioskMode } =
		useKioskMode();

	const formatTime = (date: Date) => {
		return date.toLocaleTimeString("en-US", {
			hour: "2-digit",
			minute: "2-digit",
			hour12: false,
		});
	};

	const formatDuration = (ms: number) => {
		const hours = Math.floor(ms / (1000 * 60 * 60));
		const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
		const seconds = Math.floor((ms % (1000 * 60)) / 1000);

		if (hours > 0) return `${hours}h ${minutes}m`;
		if (minutes > 0) return `${minutes}m ${seconds}s`;
		return `${seconds}s`;
	};

	const getPositionClasses = () => {
		switch (position) {
			case "top-right":
				return "top-4 right-4";
			case "bottom-right":
				return "bottom-4 right-4";
			case "top-left":
				return "top-4 left-4";
			case "bottom-center":
			default:
				return "bottom-4 left-1/2 transform -translate-x-1/2";
		}
	};

	if (!isKioskMode) {
		return null;
	}

	return (
		<div className={`fixed z-50 ${getPositionClasses()} ${className}`}>
			<div className="bg-gray-900 bg-opacity-95 backdrop-blur-sm rounded-lg shadow-2xl p-3 border border-gray-700">
				<div className="flex items-center gap-4 text-white text-sm">
					{/* Clock */}
					{config.showClock && (
						<div className="flex flex-col items-center min-w-[80px]">
							<div className="font-bold text-lg">{formatTime(new Date())}</div>
							{session && (
								<div className="text-xs text-gray-400">{formatDuration(session.activeTime)}</div>
							)}
						</div>
					)}

					{/* Battery */}
					{config.showBattery && batteryLevel !== undefined && (
						<div className="flex items-center gap-2 min-w-[100px]">
							<div
								className={`w-8 h-4 border-2 border-gray-600 rounded-sm flex items-center overflow-hidden ${
									isCharging ? "bg-green-600" : batteryLevel > 20 ? "bg-gray-600" : "bg-red-600"
								}`}
							>
								<div
									className={`h-full ${isCharging ? "bg-green-400" : batteryLevel > 20 ? "bg-blue-400" : "bg-red-400"}`}
									style={{ width: `${batteryLevel}%` }}
								/>
							</div>
							<div className="text-xs">
								{Math.round(batteryLevel)}%{isCharging && <span className="ml-1">⚡</span>}
							</div>
						</div>
					)}

					{/* Device Info */}
					{device && (
						<div className="text-xs text-gray-400 min-w-[150px]">
							<div>{device.name}</div>
							<div className="text-gray-500">{device.type}</div>
						</div>
					)}

					{/* Session Status */}
					{session && (
						<div className="flex items-center gap-2">
							<div
								className={`w-2 h-2 rounded-full ${
									session.isIdle ? "bg-yellow-400" : "bg-green-400 animate-pulse"
								}`}
							/>
							<div className="text-xs text-gray-400">Session: {session.id.slice(-6)}</div>
						</div>
					)}

					{/* Exit Button */}
					{showExitButton && config.allowExit && (
						<div className="ml-4">
							<TouchButton onPress={exitKioskMode} variant="error" size="sm" className="text-xs">
								Exit
							</TouchButton>
						</div>
					)}
				</div>

				{/* Auto-logout warning */}
				{config.autoLogoutMinutes > 0 && session?.isIdle && (
					<div className="mt-2 p-2 bg-yellow-900 bg-opacity-50 rounded text-yellow-200 text-xs">
						<div>Idle timeout detected</div>
						<div>Touch to continue...</div>
					</div>
				)}

				{/* Session metrics for admin */}
				{session && (
					<div className="mt-2 pt-2 border-t border-gray-700 text-xs text-gray-400">
						<div className="flex justify-between gap-4">
							<span>Active: {session.sessionCount} sessions</span>
							<span>Device: {device?.id.slice(-6)}</span>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

interface KioskOverlayProps {
	show?: boolean;
	type?: "idle" | "warning" | "error" | "loading";
	message?: string;
	action?: {
		label: string;
		onPress: () => void;
	};
}

export function KioskOverlay({ show = false, type = "idle", message, action }: KioskOverlayProps) {
	const { updateActivity } = useKioskMode();

	const handleOverlayClick = () => {
		updateActivity();
	};

	if (!show) return null;

	const getTypeClasses = () => {
		switch (type) {
			case "warning":
				return "bg-yellow-900 bg-opacity-90";
			case "error":
				return "bg-red-900 bg-opacity-90";
			case "loading":
				return "bg-blue-900 bg-opacity-90";
			case "idle":
			default:
				return "bg-gray-900 bg-opacity-90";
		}
	};

	return (
		<div
			className="fixed inset-0 z-40 flex items-center justify-center"
			onClick={handleOverlayClick}
		>
			<div
				className={`${getTypeClasses()} backdrop-blur-md min-h-screen flex flex-col items-center justify-center p-8`}
			>
				{/* Content */}
				<div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full shadow-2xl">
					<div className="text-center">
						{/* Icon based on type */}
						<div className="mx-auto w-16 h-16 mb-4 flex items-center justify-center">
							{type === "idle" && (
								<svg
									className="w-8 h-8 text-gray-400 animate-pulse"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
									/>
								</svg>
							)}
							{type === "warning" && (
								<svg
									className="w-8 h-8 text-yellow-600"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
									/>
								</svg>
							)}
							{type === "error" && (
								<svg
									className="w-8 h-8 text-red-600"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
							)}
							{type === "loading" && (
								<svg
									className="w-8 h-8 text-blue-600 animate-spin"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<circle
										className="opacity-25"
										cx="12"
										cy="12"
										r="10"
										stroke="currentColor"
										strokeWidth={4}
									/>
									<path
										className="opacity-75"
										fill="currentColor"
										d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
									/>
								</svg>
							)}
						</div>

						<h2 className="text-2xl font-bold mb-2">
							{type === "idle" && "System Idle"}
							{type === "warning" && "Attention Required"}
							{type === "error" && "System Error"}
							{type === "loading" && "Processing..."}
						</h2>

						<p className="text-gray-600 mb-6">
							{message ||
								(type === "idle" && "Touch anywhere to continue") ||
								(type === "warning" && "Please review the information below") ||
								(type === "error" && "An error has occurred. Please contact support.") ||
								(type === "loading" && "Please wait while we process your request")}
						</p>

						{action && (
							<TouchButton onPress={action.onPress} variant="primary" className="w-full" size="lg">
								{action.label}
							</TouchButton>
						)}

						{type === "idle" && (
							<p className="text-sm text-gray-500 mt-4">Tap anywhere to continue using the kiosk</p>
						)}
					</div>
				</div>

				{/* Kiosk monitor should still be visible */}
				<KioskMonitor showExitButton={false} className="pointer-events-none" />
			</div>
		</div>
	);
}

interface KioskBatteryWarningProps {
	show?: boolean;
	level?: number;
	isCharging?: boolean;
}

export function KioskBatteryWarning({ show = true, level, isCharging }: KioskBatteryWarningProps) {
	const shouldShow = show && level !== undefined && level < 20 && !isCharging;

	if (!shouldShow) return null;

	return (
		<div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
			<div className="bg-red-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 max-w-sm">
				<svg
					className="w-6 h-6 flex-shrink-0"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
					/>
				</svg>
				<div>
					<div className="font-semibold">Low Battery</div>
					<div className="text-sm">Battery at {Math.round(level)}%. Please connect charger.</div>
				</div>
			</div>
		</div>
	);
}
