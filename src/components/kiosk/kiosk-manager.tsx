"use client";

import React from "react";

interface KioskConfig {
	autoLogoutMinutes: number;
	allowExit: boolean;
	showClock: boolean;
	showBattery: boolean;
	soundEnabled: boolean;
	vibrationEnabled: boolean;
	brightness: number;
	theme: "light" | "dark" | "auto";
	deviceId: string;
	deviceName: string;
	stationId?: string;
	defaultLanguage: string;
	showHelp: boolean;
	enableBarcodeScanner: boolean;
	enablePinPad: boolean;
	sessionTimeout: number; // seconds
	maxSessionsPerDay: number;
}

interface KioskSession {
	id: string;
	deviceId: string;
	startTime: Date;
	lastActivity: Date;
	currentUserId?: string;
	activeTime: number; // milliseconds
	sessionCount: number;
	isIdle: boolean;
}

interface KioskDevice {
	id: string;
	name: string;
	type: "tablet" | "phone" | "kiosk" | "desktop";
	model?: string;
	os?: string;
	browser?: string;
	screenResolution: { width: number; height: number };
	capabilities: string[];
	lastSeen: Date;
	isOnline: boolean;
	stationId?: string;
	config: Partial<KioskConfig>;
}

interface KioskContextValue {
	isKioskMode: boolean;
	config: KioskConfig;
	session: KioskSession | null;
	device: KioskDevice | null;
	enterKioskMode: (config?: Partial<KioskConfig>) => void;
	exitKioskMode: () => void;
	updateConfig: (config: Partial<KioskConfig>) => void;
	registerDevice: (device: Partial<KioskDevice>) => Promise<void>;
	updateActivity: () => void;
	isFullscreen: boolean;
	requestFullscreen: () => Promise<void>;
	exitFullscreen: () => void;
	batteryLevel?: number;
	isCharging?: boolean;
}

const KioskContext = React.createContext<KioskContextValue | null>(null);

export function KioskProvider({ children }: { children: React.ReactNode }) {
	const [isKioskMode, setIsKioskMode] = React.useState(false);
	const [isFullscreen, setIsFullscreen] = React.useState(false);
	const [batteryLevel, setBatteryLevel] = React.useState<number>();
	const [isCharging, setIsCharging] = React.useState<boolean>();
	const [config, setConfig] = React.useState<KioskConfig>(() => getDefaultConfig());
	const [session, setSession] = React.useState<KioskSession | null>(null);
	const [device, setDevice] = React.useState<KioskDevice | null>(null);

	const activityTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

	// Initialize device information
	React.useEffect(() => {
		const initializeDevice = async () => {
			const deviceInfo = await detectDevice();
			setDevice(deviceInfo);

			// Load saved device config
			const savedConfig = getSavedConfig(deviceInfo.id);
			if (savedConfig) {
				setConfig((prev) => ({ ...prev, ...savedConfig }));
			}

			// Monitor battery
			if ("getBattery" in navigator) {
				const battery = await (navigator as any).getBattery();
				setBatteryLevel(battery.level * 100);
				setIsCharging(battery.charging);

				battery.addEventListener("levelchange", () => {
					setBatteryLevel(battery.level * 100);
				});

				battery.addEventListener("chargingchange", () => {
					setIsCharging(battery.charging);
				});
			}

			// Monitor fullscreen changes
			document.addEventListener("fullscreenchange", () => {
				setIsFullscreen(!!document.fullscreenElement);
			});
		};

		initializeDevice();
	}, []);

	const showIdleScreen = () => {
		if (session) {
			setSession((prev) => (prev ? { ...prev, isIdle: true } : null));
		}
		// Show idle screen overlay or trigger screensaver
	};

	// Activity monitoring for auto-logout
	React.useEffect(() => {
		if (!isKioskMode || !config.autoLogoutMinutes) return;

		const resetTimeout = () => {
			if (activityTimeoutRef.current) {
				clearTimeout(activityTimeoutRef.current);
			}

			activityTimeoutRef.current = setTimeout(
				() => {
					showIdleScreen();
				},
				config.autoLogoutMinutes * 60 * 1000
			);
		};

		resetTimeout();

		// Activity events
		const events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart", "click"];
		events.forEach((event) => {
			document.addEventListener(event, resetTimeout, { passive: true });
		});

		return () => {
			events.forEach((event) => {
				document.removeEventListener(event, resetTimeout);
			});
			if (activityTimeoutRef.current) {
				clearTimeout(activityTimeoutRef.current);
			}
		};
	}, [isKioskMode, config.autoLogoutMinutes]);

	const requestFullscreen = React.useCallback(async () => {
		try {
			if (document.documentElement.requestFullscreen) {
				await document.documentElement.requestFullscreen();
			} else if ((document.documentElement as any).webkitRequestFullscreen) {
				await (document.documentElement as any).webkitRequestFullscreen();
			} else if ((document.documentElement as any).msRequestFullscreen) {
				await (document.documentElement as any).msRequestFullscreen();
			}
		} catch (error) {
			console.warn("Failed to enter fullscreen:", error);
		}
	}, []);

	const enterKioskMode = React.useCallback(
		async (customConfig?: Partial<KioskConfig>) => {
			const newConfig = { ...config, ...customConfig };
			setConfig(newConfig);

			// Request fullscreen if not already in fullscreen
			if (!document.fullscreenElement && newConfig.autoLogoutMinutes > 0) {
				await requestFullscreen();
			}

			// Create new session
			const newSession: KioskSession = {
				id: generateSessionId(),
				deviceId: device?.id || "unknown",
				startTime: new Date(),
				lastActivity: new Date(),
				activeTime: 0,
				sessionCount: 0,
				isIdle: false,
			};

			setSession(newSession);
			setIsKioskMode(true);
			saveConfig(newConfig);
		},
		[config, device]
	);

	const exitKioskMode = React.useCallback(() => {
		if (document.fullscreenElement) {
			document.exitFullscreen();
		}

		setIsKioskMode(false);
		setSession(null);

		if (activityTimeoutRef.current) {
			clearTimeout(activityTimeoutRef.current);
		}
	}, []);

	const updateConfig = React.useCallback(
		(newConfig: Partial<KioskConfig>) => {
			const updated = { ...config, ...newConfig };
			setConfig(updated);
			saveConfig(updated);
		},
		[config]
	);

	const exitFullscreen = React.useCallback(() => {
		if (document.exitFullscreen) {
			document.exitFullscreen();
		} else if ((document as any).webkitExitFullscreen) {
			(document as any).webkitExitFullscreen();
		} else if ((document as any).msExitFullscreen) {
			(document as any).msExitFullscreen();
		}
	}, []);

	const updateActivity = React.useCallback(() => {
		if (session) {
			setSession((prev) =>
				prev
					? {
							...prev,
							lastActivity: new Date(),
							activeTime: Date.now() - prev.startTime.getTime(),
							isIdle: false,
						}
					: null
			);
		}
	}, [session]);

	const contextValue = React.useMemo<KioskContextValue>(
		() => ({
			isKioskMode,
			config,
			session,
			device,
			enterKioskMode,
			exitKioskMode,
			updateConfig,
			registerDevice: async (deviceInfo: Partial<KioskDevice>) => {
				const newDevice: KioskDevice = {
					id: deviceInfo.id || generateDeviceId(),
					name: deviceInfo.name || "Unknown Device",
					type: deviceInfo.type || "kiosk",
					model: deviceInfo.model,
					os: deviceInfo.os,
					browser: deviceInfo.browser,
					screenResolution: deviceInfo.screenResolution || { width: 1920, height: 1080 },
					capabilities: deviceInfo.capabilities || [],
					lastSeen: new Date(),
					isOnline: true,
					config: {},
				};

				setDevice(newDevice);
				// Sync with server
				await syncDeviceToServer(newDevice);
			},
			updateActivity,
			isFullscreen,
			requestFullscreen,
			exitFullscreen,
			batteryLevel,
			isCharging,
		}),
		[
			isKioskMode,
			config,
			session,
			device,
			enterKioskMode,
			exitKioskMode,
			updateConfig,
			updateActivity,
			isFullscreen,
			requestFullscreen,
			exitFullscreen,
			batteryLevel,
			isCharging,
		]
	);

	return <KioskContext.Provider value={contextValue}>{children}</KioskContext.Provider>;
}

// Stub components for kiosk functionality
export function KioskBatteryWarning({
	level: _level,
	isCharging: _isCharging,
}: {
	level?: number;
	isCharging?: boolean;
}) {
	return null;
}

export function KioskOverlay({ show: _show, type: _type }: { show?: boolean; type?: string }) {
	return null;
}

export function KioskMonitor({ showExitButton: _showExitButton }: { showExitButton?: boolean }) {
	return null;
}

export function useKioskMode() {
	const context = React.useContext(KioskContext);
	if (!context) {
		throw new Error("useKioskMode must be used within a KioskProvider");
	}
	return context;
}

// Helper functions
function getDefaultConfig(): KioskConfig {
	return {
		autoLogoutMinutes: 10,
		allowExit: true,
		showClock: true,
		showBattery: true,
		soundEnabled: true,
		vibrationEnabled: true,
		brightness: 100,
		theme: "light",
		deviceId: generateDeviceId(),
		deviceName: "Warehouse Kiosk",
		sessionTimeout: 30, // 30 seconds
		maxSessionsPerDay: 1000,
		defaultLanguage: "en",
		showHelp: true,
		enableBarcodeScanner: false,
		enablePinPad: true,
	};
}

async function detectDevice(): Promise<KioskDevice> {
	const screenResolution = {
		width: window.screen.width,
		height: window.screen.height,
	};

	const capabilities = [];
	if ("getBattery" in navigator) capabilities.push("battery");
	if ("vibrate" in navigator) capabilities.push("vibration");
	if (" BarcodeDetector" in window) capabilities.push("barcode-scanner");

	return {
		id: generateDeviceId(),
		name: `${getDeviceType()} - ${navigator.platform}`,
		type: getDeviceType(),
		os: navigator.platform,
		browser: getBrowserName(),
		screenResolution,
		capabilities,
		lastSeen: new Date(),
		isOnline: navigator.onLine,
		config: {},
	};
}

function getDeviceType(): "tablet" | "phone" | "kiosk" | "desktop" {
	const userAgent = navigator.userAgent;
	if (/iPad/i.test(userAgent)) return "tablet";
	if (/Mobile|Android|iPhone|iPod/i.test(userAgent)) return "phone";
	if (/Kiosk|Terminal/i.test(userAgent)) return "kiosk";
	return "desktop";
}

function getBrowserName(): string {
	const userAgent = navigator.userAgent;
	if (userAgent.includes("Chrome")) return "Chrome";
	if (userAgent.includes("Firefox")) return "Firefox";
	if (userAgent.includes("Safari")) return "Safari";
	if (userAgent.includes("Edge")) return "Edge";
	return "Unknown";
}

function generateDeviceId(): string {
	return `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function generateSessionId(): string {
	return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function saveConfig(config: KioskConfig) {
	try {
		localStorage.setItem("kioskConfig", JSON.stringify(config));
	} catch (error) {
		console.warn("Failed to save kiosk config:", error);
	}
}

function getSavedConfig(deviceId: string): Partial<KioskConfig> | null {
	try {
		const saved = localStorage.getItem(`kioskConfig_${deviceId}`);
		return saved ? JSON.parse(saved) : null;
	} catch (error) {
		console.warn("Failed to load saved config:", error);
		return null;
	}
}

async function syncDeviceToServer(device: KioskDevice) {
	try {
		await fetch("/api/kiosk/device", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(device),
		});
	} catch (error) {
		console.warn("Failed to sync device to server:", error);
	}
}
