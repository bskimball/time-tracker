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

type AudioContextLike = {
	createOscillator: () => {
		frequency: {
			setValueAtTime: (value: number, startTime: number) => void;
			exponentialRampToValueAtTime: (value: number, endTime: number) => void;
		};
		start: (when?: number) => void;
		stop: (when?: number) => void;
		connect: (destination: unknown) => void;
	};
	createGain: () => {
		gain: {
			setValueAtTime: (value: number, startTime: number) => void;
			exponentialRampToValueAtTime: (value: number, endTime: number) => void;
		};
		connect: (destination: unknown) => void;
	};
	currentTime: number;
	destination: unknown;
};

type AudioContextCtor = new () => AudioContextLike;

function getAudioContextConstructor(): AudioContextCtor | null {
	const win = window as { webkitAudioContext?: unknown; AudioContext?: unknown };
	const ctor = win.AudioContext ?? win.webkitAudioContext;
	if (!ctor) return null;
	return ctor as unknown as AudioContextCtor;
}

let audioContext: AudioContextLike | null = null;

function playChime(type: NotificationType) {
	if (typeof window === "undefined") return;
	const AudioContextCtor = getAudioContextConstructor();
	if (!AudioContextCtor) return;
	if (!audioContext) {
		try {
			audioContext = new AudioContextCtor();
		} catch {
			return;
		}
	}

	const duration = 0.2;
	if (!audioContext) return;
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
