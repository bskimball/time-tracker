"use client";

import { Button as AriaButton, DialogTrigger, Popover, Dialog } from "react-aria-components";
import { Badge } from "@monorepo/design-system";
import { LiaCircleNotchSolid, LiaExclamationTriangleSolid, LiaInfoCircleSolid, LiaCheckCircleSolid } from "react-icons/lia";

interface AlertItem {
	id: string;
	type: "success" | "error" | "warning" | "info";
	title: string;
	message: string;
	priority: "high" | "medium" | "low";
}

interface AlertsPopoverProps {
	alerts: AlertItem[];
}

const priorityColor = {
	high: "bg-destructive",
	medium: "bg-warning",
	low: "bg-muted-foreground",
} as const;

const typeIcon = {
	error: LiaCircleNotchSolid,
	warning: LiaExclamationTriangleSolid,
	info: LiaInfoCircleSolid,
	success: LiaCheckCircleSolid,
} as const;

export function AlertsPopover({ alerts }: AlertsPopoverProps) {
	if (alerts.length === 0) {
		return (
			<div className="flex items-center gap-2 px-3 py-1.5 rounded-[2px] border border-border/40 bg-muted/20 text-xs font-mono text-muted-foreground uppercase tracking-wide select-none">
				<span className="relative flex h-2 w-2">
					<span className="relative inline-flex rounded-full h-2 w-2 bg-chart-3" />
				</span>
				Systems_Nominal
			</div>
		);
	}

	return (
		<DialogTrigger>
			<AriaButton className="flex items-center gap-2 px-3 py-1.5 rounded-[2px] border border-destructive/40 bg-destructive/10 text-destructive text-xs font-mono cursor-pointer outline-none transition-colors duration-150 hover:bg-destructive/20 data-[focus-visible]:ring-2 data-[focus-visible]:ring-ring data-[focus-visible]:ring-offset-1">
				<span className="relative flex h-2 w-2">
					<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75" />
					<span className="relative inline-flex rounded-full h-2 w-2 bg-destructive" />
				</span>
				{alerts.length} alert{alerts.length !== 1 ? "s" : ""}
			</AriaButton>

			<Popover
				placement="bottom end"
				className="rounded-[2px] border border-border bg-card shadow-industrial w-[360px] max-h-[420px] overflow-hidden"
			>
				<Dialog className="outline-none">
					<div className="border-b border-border px-4 py-3 flex items-center justify-between bg-muted/30">
						<h3 className="font-industrial text-xs tracking-widest uppercase text-foreground">
							Active Alerts
						</h3>
						<Badge variant="destructive">{alerts.length}</Badge>
					</div>

				<div className="overflow-y-auto max-h-[340px] divide-y divide-border/50">
					{alerts.map((alert) => {
						const Icon = typeIcon[alert.type];
						return (
							<div
								key={alert.id}
								className="px-4 py-3 flex gap-3 items-start hover:bg-muted/20 transition-colors duration-100"
							>
								<Icon className="w-5 h-5 mt-0.5 flex-shrink-0 text-current" aria-hidden="true" />
								<div className="flex-1 min-w-0">
									<div className="flex items-center gap-2">
										<h4 className="font-heading font-bold text-sm tracking-tight text-foreground truncate">
											{alert.title}
										</h4>
										<div
											className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${priorityColor[alert.priority]}`}
										/>
									</div>
									<p className="text-xs font-mono text-muted-foreground mt-0.5 leading-relaxed">
										{alert.message}
									</p>
								</div>
							</div>
						);
					})}
				</div>
				</Dialog>
			</Popover>
		</DialogTrigger>
	);
}
