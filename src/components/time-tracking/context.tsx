"use client";

import React from "react";
import type { OfflineEndpoint } from "./offline-queue";

export type KioskContextValue = {
	kioskEnabled: boolean;
	setKioskEnabled: (value: boolean) => void;
	focusPinInput: () => void;
	actionQueueSize: number;
	isSyncing: boolean;
	syncOfflineActions: () => void;
	enqueueOfflineAction: (endpoint: OfflineEndpoint, body: Record<string, unknown>) => void;
	apiKey: string;
	saveApiKey: (value: string) => void;
};

export const KioskContext = React.createContext<KioskContextValue | null>(null);

export function useKioskContext() {
	const context = React.useContext(KioskContext);
	if (!context) {
		throw new Error("Kiosk context is unavailable");
	}
	return context;
}
