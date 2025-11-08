import { Google, MicrosoftEntraId } from "arctic";

const APP_URL = process.env.APP_URL || "http://localhost:5173";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "placeholder-id";
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "placeholder-secret";
const MICROSOFT_CLIENT_ID = process.env.MICROSOFT_CLIENT_ID || "placeholder-id";
const MICROSOFT_CLIENT_SECRET = process.env.MICROSOFT_CLIENT_SECRET || "placeholder-secret";

export const google = new Google(
	GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET,
	`${APP_URL}/auth/google/callback`
);

export const microsoft = new MicrosoftEntraId(
	"common",
	MICROSOFT_CLIENT_ID,
	MICROSOFT_CLIENT_SECRET,
	`${APP_URL}/auth/microsoft/callback`
);

export interface GoogleUser {
	sub: string;
	name: string;
	email: string;
	picture?: string;
	email_verified: boolean;
}

export interface MicrosoftUser {
	id: string;
	displayName: string;
	mail: string;
	userPrincipalName: string;
}
