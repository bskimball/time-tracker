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

let audioContext: any = null;

function playChime(type: NotificationType) {
	if (typeof window === "undefined") return;
	if (typeof (window as any).AudioContext === "undefined") return;
	if (!audioContext) {
		try {
			audioContext = new ((window as any).AudioContext || (window as any).webkitAudioContext)();
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
