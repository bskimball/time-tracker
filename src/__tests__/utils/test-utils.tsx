import React from "react";
import { render } from "@testing-library/react";
import type { RenderOptions } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

// Custom render function for testing
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
	return <>{children}</>;
};

const customRender = (ui: React.ReactElement, options?: Omit<RenderOptions, "wrapper">) =>
	render(ui, { wrapper: AllTheProviders, ...options });

// Custom user event setup
const setupUserEvent = () => {
	return userEvent.setup();
};

export * from "@testing-library/react";
export { customRender as render, setupUserEvent as userEvent };

// Mock functions for testing
export const mockRouter = {
	navigate: vi.fn(),
	goBack: vi.fn(),
	forward: vi.fn(),
	refresh: vi.fn(),
};

// Mock server context for RSC
export const mockServerContext = {
	request: new Request("http://localhost:3000"),
	cookies: new Map(),
	params: new Map(),
};
