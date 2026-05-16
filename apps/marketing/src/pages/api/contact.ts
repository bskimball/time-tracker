/* global Response, console */
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
	try {
		const data = await request.json();

		// Basic validation
		if (!data.name || !data.email || !data.company) {
			return new Response(JSON.stringify({ error: "Missing required fields" }), {
				status: 400,
				headers: { "Content-Type": "application/json" },
			});
		}

		// In production, this would send an email via Resend/SendGrid or create a CRM record.
		// For now we log to the server console so the team can follow up.
		console.log("[Contact Form Submission]", {
			timestamp: new Date().toISOString(),
			name: data.name,
			email: data.email,
			company: data.company,
			employees: data.employees,
			message: data.message,
		});

		return new Response(JSON.stringify({ success: true }), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		});
	} catch (error) {
		console.error("[Contact API Error]", error);
		return new Response(JSON.stringify({ error: "Internal server error" }), {
			status: 500,
			headers: { "Content-Type": "application/json" },
		});
	}
};
