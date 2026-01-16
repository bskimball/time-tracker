/**
 * Home route ("/") - Redirects handled in entry.rsc.tsx
 *
 * This component should never actually render because the redirect
 * is handled in the main handler before RSC rendering begins.
 * See entry.rsc.tsx for the redirect logic.
 */
export default function Component() {
	return (
		<div className="mx-auto max-w-7xl px-4 py-8 lg:py-12">
			<article className="prose mx-auto">
				<h1>Redirecting...</h1>
				<p>If you see this, there's a bug in the routing logic.</p>
			</article>
		</div>
	);
}
