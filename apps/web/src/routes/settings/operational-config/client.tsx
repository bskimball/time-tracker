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
	bounds: {
		min: number;
		max: number;
		step: string;
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
		return { ...entry, value: updated.value, description: updated.description };
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
									Value ({entry.bounds.unit || "numeric"})
								</label>
								<div className="flex items-center gap-2 mt-1">
									<SimpleInput
										name="value"
										type="number"
										defaultValue={entry.value}
										min={entry.bounds.min}
										max={entry.bounds.max}
										step={entry.bounds.step}
										className="flex-1"
									/>
									<SaveButton />
								</div>
								<div className="text-[11px] text-muted-foreground mt-1">
									Allowed range: {entry.bounds.min} - {entry.bounds.max}
								</div>
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
