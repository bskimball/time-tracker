"use client";

import { useEffect } from "react";
import { useNavigate } from "react-router";

const KIOSK_STORAGE_KEY = "timeClock:kioskMode";

export function KioskRedirect() {
	const navigate = useNavigate();

	useEffect(() => {
		// Check if kiosk mode is enabled and redirect if so
		if (typeof window !== "undefined") {
			const stored = window.localStorage.getItem(KIOSK_STORAGE_KEY);
			if (stored === "true") {
				navigate("/floor/kiosk");
			}
		}
	}, [navigate]);

	// This component doesn't render anything, it just handles the redirect
	return null;
}
