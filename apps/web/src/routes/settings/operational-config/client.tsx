"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
	Alert,
	Button,
	Card,
	CardBody,
	CardHeader,
	CardTitle,
	SimpleInput,
} from "@monorepo/design-system";
import { updateOperationalConfig, type OperationalConfigState } from "./actions";

type ConfigEntry = {
	key: string;
	value: string;
	description: string;
	validation:
		| {
			type: "number";
			min: number;
			max: number;
			step: string;
			unit: string;
		  }
		| {
			type: "enum";
			options: readonly string[];
			defaultValue: string;
			unit: string;
		  };
};

function SaveButton() {
	const { pending } = useFormStatus();
	return (
		<Button type="submit" variant="primary" size="md" disabled={pending}>
			{pending ? "Saving..." : "Save"}
		</Button>
	);
}

export function OperationalConfigManager({ initialEntries }: { initialEntries: ConfigEntry[] }) {
	const [state, action] = useActionState<OperationalConfigState, FormData>(updateOperationalConfig, null);

	const activeEntries = initialEntries.map((entry) => {
		const updated = state?.entries?.find((item) => item.key === entry.key);
		if (!updated) {
			return entry;
		}
		return {
			...entry,
			value: updated.value,
			description: updated.description,
			validation: updated.validation,
		};
	});

	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>Operational Configuration</CardTitle>
				</CardHeader>
				<CardBody className="space-y-2 text-sm text-muted-foreground">
					<p>
						These values drive cost calculations, utilization targets, and KPI threshold behavior across
						the executive and manager dashboards.
					</p>
					<p>
						Changes take effect immediately for new requests. Keep values aligned with your finance and
						operations policy.
					</p>
				</CardBody>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Editable Values</CardTitle>
				</CardHeader>
				<CardBody className="space-y-4">
					{activeEntries.map((entry) => (
						<form
							key={entry.key}
							action={action}
							className="grid gap-3 border border-border rounded-[2px] bg-muted/50 dark:bg-accent/40 shadow-industrial p-4 md:grid-cols-[1.4fr_1fr]"
						>
							<input type="hidden" name="key" value={entry.key} />
							<div>
								<div className="text-xs font-mono text-muted-foreground mb-1">{entry.key}</div>
								<div className="text-sm">{entry.description}</div>
							</div>
							<div>
								<label className="text-xs font-industrial uppercase tracking-wider text-muted-foreground">
									Value ({entry.validation.unit || "configured"})
								</label>
								<div className="flex items-center gap-2 mt-1">
									{entry.validation.type === "number" ? (
										<SimpleInput
											name="value"
											type="number"
											defaultValue={entry.value}
											min={entry.validation.min}
											max={entry.validation.max}
											step={entry.validation.step}
											className="flex-1"
										/>
									) : (
										<select
											name="value"
											defaultValue={entry.value || entry.validation.defaultValue}
											className="h-10 w-full rounded-[2px] border border-border bg-background px-3 py-2 text-sm"
										>
											{entry.validation.options.map((option) => (
												<option key={option} value={option}>
													{option}
												</option>
											))}
										</select>
									)}
									<SaveButton />
								</div>
								{entry.validation.type === "number" ? (
									<div className="text-[11px] text-muted-foreground mt-1">
										Allowed range: {entry.validation.min} - {entry.validation.max}
									</div>
								) : (
									<div className="text-[11px] text-muted-foreground mt-1">
										Allowed values: {entry.validation.options.join(", ")}
									</div>
								)}
							</div>
						</form>
					))}

					{state?.error && <Alert variant="error">{state.error}</Alert>}
					{state?.success && <Alert variant="success">Operational config updated.</Alert>}
				</CardBody>
			</Card>
		</div>
	);
}
