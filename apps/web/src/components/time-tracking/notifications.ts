"use client";

type NotificationType = "success" | "error" | "warning";

type Listener = (message: string, type: NotificationType) => void;

const listeners = new Set<Listener>();

export function notify(message: string, type: NotificationType) {
	for (const listener of listeners) {
		listener(message, type);
	}

	if (typeof window !== "undefined" && type !== "warning") {
		const audioEnabled = window.localStorage.getItem("timeClock:audio") !== "off";
		if (audioEnabled) {
			playChime(type);
		}
	}
}

export function subscribe(listener: Listener) {
	listeners.add(listener);
	return () => listeners.delete(listener);
}

// Use a minimal structural type so we don't depend on DOM lib globals
type BrowserAudioContext = {
	createOscillator: () => {
		frequency: {
			setValueAtTime(value: number, startTime: number): void;
			exponentialRampToValueAtTime(value: number, endTime: number): void;
		};
		start: (when?: number) => void;
		stop: (when?: number) => void;
		connect: (destination: { connect?: (node: unknown) => void } | Record<string, unknown>) => void;
	};
	createGain: () => {
		gain: {
			setValueAtTime(value: number, startTime: number): void;
			exponentialRampToValueAtTime(value: number, endTime: number): void;
		};
		connect: (destination: unknown) => void;
	};
	readonly currentTime: number;
	readonly destination: unknown;
};

declare global {
	// For older WebKit-based browsers that still expose webkitAudioContext
	interface Window {
		AudioContext?: new () => BrowserAudioContext;
		webkitAudioContext?: new () => BrowserAudioContext;
	}
}

let audioContext: BrowserAudioContext | null = null;

function playChime(type: NotificationType) {
	if (typeof window === "undefined") return;
	if (
		typeof window.AudioContext === "undefined" &&
		typeof window.webkitAudioContext === "undefined"
	) {
		return;
	}
	if (!audioContext) {
		try {
			const Ctor = window.AudioContext || window.webkitAudioContext;
			if (!Ctor) return;
			audioContext = new Ctor() as BrowserAudioContext;
		} catch {
			return;
		}
	}

	const duration = 0.2;
	const oscillator = audioContext.createOscillator();
	const gain = audioContext.createGain();
	const now = audioContext.currentTime;

	const baseFreq = type === "success" ? 880 : type === "warning" ? 660 : 440;
	oscillator.frequency.setValueAtTime(baseFreq, now);
	oscillator.frequency.exponentialRampToValueAtTime(baseFreq / 2, now + duration);

	gain.gain.setValueAtTime(0.0001, now);
	gain.gain.exponentialRampToValueAtTime(0.2, now + 0.02);
	gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

	oscillator.connect(gain);
	gain.connect(audioContext.destination);

	oscillator.start(now);
	oscillator.stop(now + duration);
}
