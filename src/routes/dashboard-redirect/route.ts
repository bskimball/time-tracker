/**
 * Dashboard redirect route ("/dashboard") - Redirects handled in entry.rsc.tsx
 *
 * This component should never actually render because the redirect
 * is handled in the main handler before RSC rendering begins.
 * See entry.rsc.tsx for the redirect logic.
 */
export default function Component() {
	// This should never be reached
	throw new Error("Dashboard redirect should be handled in entry.rsc.tsx");
}
