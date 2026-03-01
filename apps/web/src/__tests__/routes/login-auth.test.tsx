import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { LoginClient } from "~/routes/login/client";
import GoogleStartRoute from "~/routes/auth/google/start";
import MicrosoftStartRoute from "~/routes/auth/microsoft/start";

const { mockCreateGoogleAuthorizationURL, mockCreateMicrosoftAuthorizationURL } = vi.hoisted(
	() => ({
		mockCreateGoogleAuthorizationURL: vi.fn(),
		mockCreateMicrosoftAuthorizationURL: vi.fn(),
	})
);

vi.mock("arctic", () => ({
	generateState: vi.fn(() => "state-123"),
	generateCodeVerifier: vi.fn(() => "code-verifier-123"),
}));

vi.mock("~/lib/oauth", () => ({
	google: {
		createAuthorizationURL: mockCreateGoogleAuthorizationURL,
	},
	microsoft: {
		createAuthorizationURL: mockCreateMicrosoftAuthorizationURL,
	},
}));

async function consumeRedirect(fn: () => Promise<never>): Promise<Response> {
	try {
		await fn();
		throw new Error("Expected route to throw a redirect response");
	} catch (error) {
		if (error instanceof Response) {
			return error;
		}
		throw error;
	}
}

describe("login/auth routes", () => {
	it("renders login links for Google, Microsoft, and Floor kiosk", () => {
		render(
			<MemoryRouter>
				<LoginClient />
			</MemoryRouter>
		);

		expect(screen.getByRole("link", { name: /google workspace/i })).toHaveAttribute(
			"href",
			"/auth/google/start"
		);
		expect(screen.getByRole("link", { name: /microsoft entra/i })).toHaveAttribute(
			"href",
			"/auth/microsoft/start"
		);
		expect(screen.getByRole("link", { name: /floor kiosk terminal/i })).toHaveAttribute(
			"href",
			"/floor"
		);
	});

	it("redirects Google auth start with oauth cookies", async () => {
		mockCreateGoogleAuthorizationURL.mockResolvedValue(
			new URL("https://accounts.google.test/oauth/authorize")
		);

		const response = await consumeRedirect(() => GoogleStartRoute());

		expect(response.status).toBe(302);
		expect(response.headers.get("Location")).toBe("https://accounts.google.test/oauth/authorize");
		expect(mockCreateGoogleAuthorizationURL).toHaveBeenCalledWith(
			"state-123",
			"code-verifier-123",
			["openid", "profile", "email"]
		);
	});

	it("redirects Microsoft auth start with oauth cookies", async () => {
		mockCreateMicrosoftAuthorizationURL.mockResolvedValue(
			new URL("https://login.microsoftonline.test/oauth2/v2.0/authorize")
		);

		const response = await consumeRedirect(() => MicrosoftStartRoute());

		expect(response.status).toBe(302);
		expect(response.headers.get("Location")).toBe(
			"https://login.microsoftonline.test/oauth2/v2.0/authorize"
		);
		expect(mockCreateMicrosoftAuthorizationURL).toHaveBeenCalledWith(
			"state-123",
			"code-verifier-123",
			["openid", "profile", "email"]
		);
	});
});
