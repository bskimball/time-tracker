"use client";

/* global HTMLInputElement, HTMLTextAreaElement, fetch */

import { useState, type ChangeEvent, type FormEvent } from "react";
import { Button, Input, Alert, Card, CardBody, CardHeader, CardTitle } from "@monorepo/design-system";

interface FormState {
	name: string;
	email: string;
	company: string;
	employees: string;
	message: string;
}

const initialState: FormState = {
	name: "",
	email: "",
	company: "",
	employees: "",
	message: "",
};

export default function ContactForm() {
	const [form, setForm] = useState<FormState>(initialState);
	const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
	const [errorMessage, setErrorMessage] = useState("");

	const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setStatus("submitting");
		setErrorMessage("");

		try {
			const res = await fetch("/api/contact", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(form),
			});

			if (!res.ok) {
				throw new Error("Submission failed");
			}

			setStatus("success");
			setForm(initialState);
		} catch {
			setStatus("error");
			setErrorMessage("Something went wrong. Please try again or email hello@shiftpulse.com.");
		}
	};

	if (status === "success") {
		return (
			<Card className="border-2 border-success/40 bg-success/5">
				<CardBody className="py-12 text-center">
					<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
						<svg className="h-8 w-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7" />
						</svg>
					</div>
					<h3 className="font-display text-2xl font-bold tracking-tight text-foreground">Request Received</h3>
					<p className="mt-3 max-w-md mx-auto text-foreground/70">
						Thank you. Our team will contact you within 1 business day to schedule your demo.
					</p>
				</CardBody>
			</Card>
		);
	}

	return (
		<Card className="border-2 border-border/80">
			<CardHeader className="border-b-2 border-border/80 bg-muted/30 px-6 py-5">
				<CardTitle className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
					Demo Request
				</CardTitle>
			</CardHeader>
			<CardBody className="p-6">
				{status === "error" && (
					<Alert variant="error" className="mb-6">
						{errorMessage}
					</Alert>
				)}

				<form onSubmit={handleSubmit} className="space-y-5">
					<div className="grid gap-5 md:grid-cols-2">
						<Input
							label="Full Name"
							name="name"
							value={form.name}
							onChange={handleChange}
							required
							placeholder="Alex Rivera"
						/>
						<Input
							label="Work Email"
							name="email"
							type="email"
							value={form.email}
							onChange={handleChange}
							required
							placeholder="you@company.com"
						/>
					</div>

					<div className="grid gap-5 md:grid-cols-2">
						<Input
							label="Company / Facility"
							name="company"
							value={form.company}
							onChange={handleChange}
							required
							placeholder="Acme Fulfillment"
						/>
						<Input
							label="Team Size"
							name="employees"
							value={form.employees}
							onChange={handleChange}
							placeholder="50-200"
						/>
					</div>

					<div>
						<label className="mb-1.5 block text-xs font-mono uppercase tracking-wider text-muted-foreground">
							What are you looking to solve?
						</label>
						<textarea
							name="message"
							value={form.message}
							onChange={handleChange}
							rows={4}
							className="w-full rounded-[2px] border-2 border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground/60 focus-visible:border-primary focus-visible:outline-none"
							placeholder="We need better visibility into floor productivity and want to reduce overtime spend..."
						/>
					</div>

					<Button
						type="submit"
						size="lg"
						disabled={status === "submitting"}
						className="w-full uppercase tracking-widest font-bold py-6"
					>
						{status === "submitting" ? "Submitting Request..." : "Request Demo"}
					</Button>

					<p className="text-center text-[10px] text-muted-foreground font-mono tracking-wider">
						We typically respond within 4 business hours. No spam, ever.
					</p>
				</form>
			</CardBody>
		</Card>
	);
}
