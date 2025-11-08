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
				"px-3 py-2 border border-gray-300 rounded transition-colors",
				"focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
				"w-full text-center text-2xl font-mono text-lg"
			)}
			inputMode="numeric"
			autoComplete="off"
			maxLength={maxLength}
			pattern="\d{4,6}"
			required
		/>
	);
}
