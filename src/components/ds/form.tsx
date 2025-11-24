"use client";

import React from "react";
import { Form as AriaForm } from "react-aria-components";
import { cn } from "~/lib/cn";

type AriaFormProps = React.ComponentProps<typeof AriaForm>;

export interface FormProps extends Omit<AriaFormProps, "className"> {
	className?: string;
}

/**
 * Design system wrapper around react-aria-components Form.
 *
 * This is a client component that can be used anywhere we need a form with
 * React 19/React Aria semantics. Styling matches the rest of the DS.
 */
export function Form({ className = "", children, ...props }: FormProps) {
	return (
		<AriaForm {...props} className={cn("flex flex-col gap-4", className)}>
			{children}
		</AriaForm>
	);
}
