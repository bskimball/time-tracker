import { cn } from "~/lib/cn";

interface BinaryPinInputProps {
	value: string;
	onChange: (value: string) => void;
	onSubmit: () => void;
	maxLength?: number;
	placeholder?: string;
}

export function BinaryPinInput({
	value,
	onChange,
	onSubmit,
	maxLength = 6,
	placeholder = "Enter PIN",
}: BinaryPinInputProps) {
	return (
		<input
			type="password"
			value={value}
			onChange={(e) => {
				const newValue = e.target.value.replace(/\D/g, "");
				if (newValue.length <= maxLength) {
					onChange(newValue);
				}
			}}
			onKeyDown={(e) => {
				if (e.key === "Enter") {
					onSubmit();
				}
			}}
			placeholder={placeholder}
			className={cn(
				"h-10 px-3 py-2 bg-background text-foreground border border-input rounded-md transition-all",
				"focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:border-primary",
				"w-full text-center text-2xl font-mono"
			)}
			inputMode="numeric"
			autoComplete="off"
			maxLength={maxLength}
			pattern="\d{4,6}"
			required
		/>
	);
}
