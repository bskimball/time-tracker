"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

const KIOSK_STORAGE_KEY = "timeClock:kioskMode";

export function useKioskMode(): [boolean, (enabled: boolean) => void] {
	const [enabled, setEnabled] = useState(false);

	useEffect(() => {
		if (typeof window === "undefined") return;
		const stored = window.localStorage.getItem(KIOSK_STORAGE_KEY);
		if (stored !== null) {
			window.setTimeout(() => setEnabled(stored === "true"), 0);
		}
	}, []);

	const update = useCallback((next: boolean) => {
		setEnabled(next);
		if (typeof window !== "undefined") {
			window.localStorage.setItem(KIOSK_STORAGE_KEY, String(next));
		}
	}, []);

	return useMemo(() => [enabled, update], [enabled, update]);
}

export function useAutoRefresh(enabled: boolean, interval = 60000) {
	useEffect(() => {
		if (typeof window === "undefined") return;

		if (!enabled) {
			return;
		}

		const tick = () => {
			if (typeof navigator !== "undefined" && !navigator.onLine) return;
			const router = (window as { __router?: { revalidate?: () => void } }).__router;
			if (router?.revalidate) {
				router.revalidate();
			} else {
				window.location.reload();
			}
		};

		const id = window.setInterval(tick, interval);
		return () => window.clearInterval(id);
	}, [enabled, interval]);
}
