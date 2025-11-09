"use client";

import React from "react";
import { Input, SimpleInput } from "~/components/ds/input";

interface TouchInputProps {
	label: string;
	placeholder?: string;
	value?: string;
	onChange?: (value: string) => void;
	type?: "text" | "number" | "password" | "email" | "tel";
	error?: string;
	disabled?: boolean;
	required?: boolean;
	autoComplete?: string;
	autoFocus?: boolean;
	maxLength?: number;
	pattern?: string;
	className?: string;
	icon?: React.ReactNode;
	showPasswordToggle?: boolean;
	keyboardType?: "default" | "numeric" | "decimal" | "email" | "url" | "search";
	returnKeyType?: "default" | "done" | "go" | "next" | "search" | "send";
	onSubmit?: () => void;
}

export function TouchInput({
	label,
	placeholder,
	value,
	onChange,
	type = "text",
	error,
	disabled = false,
	required = false,
	autoComplete,
	autoFocus = false,
	maxLength,
	pattern,
	className = "",
	icon,
	showPasswordToggle = false,
	keyboardType: _keyboardType = "default",
	returnKeyType: _returnKeyType = "done",
	onSubmit,
}: TouchInputProps) {
	const [showPassword, setShowPassword] = React.useState(false);
	const [isFocused, setIsFocused] = React.useState(false);
	const inputRef = React.useRef<HTMLInputElement>(null);

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && onSubmit) {
			e.preventDefault();
			onSubmit();
		}
	};

	const inputMode = {
		default: "text",
		numeric: "numeric",
		decimal: "decimal",
		email: "email",
		url: "url",
		search: "search",
	} as const;

	const actualType = type === "password" && showPassword ? "text" : type;

	return (
		<div className={`relative ${className}`}>
			<label className="block text-base font-bold text-gray-700 mb-2">
				{label}
				{required && <span className="text-error ml-1">*</span>}
			</label>

			<div className="relative">
				{icon && (
					<div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
						{icon}
					</div>
				)}

				<SimpleInput
					ref={inputRef}
					type={actualType}
					value={value}
					onChange={(e) => onChange?.(e.target.value)}
					placeholder={placeholder}
					disabled={disabled}
					required={required}
					autoComplete={autoComplete}
					autoFocus={autoFocus}
					maxLength={maxLength}
					pattern={pattern}
					inputMode={inputMode[keyTypeInput]}
					className={`
            ${icon ? "pl-12" : "pl-4"}
            ${showPasswordToggle ? "pr-12" : "pr-4"}
            min-h-[56px] text-base
            border-2 rounded-lg
            ${isFocused ? "border-blue-500 ring-2 ring-blue-200" : "border-gray-300"}
            ${error ? "border-error ring-2 ring-red-200" : ""}
            ${disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white"}
            transition-all duration-200
            focus:outline-none
            ${className}
          `}
					onFocus={() => setIsFocused(true)}
					onBlur={() => setIsFocused(false)}
					onKeyDown={handleKeyDown}
				/>

				{showPasswordToggle && type === "password" && (
					<button
						type="button"
						onClick={() => setShowPassword(!showPassword)}
						className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
					>
						{showPassword ? (
							<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
								/>
							</svg>
						) : (
							<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
								/>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
								/>
							</svg>
						)}
					</button>
				)}
			</div>

			{error && <p className="mt-2 text-sm text-error font-medium">{error}</p>}
		</div>
	);
}

interface TouchSelectProps {
	label: string;
	placeholder?: string;
	value?: string;
	onChange?: (value: string) => void;
	options: Array<{ value: string; label: string; disabled?: boolean }>;
	disabled?: boolean;
	required?: boolean;
	error?: string;
	className?: string;
	icon?: React.ReactNode;
	searchable?: boolean;
}

export function TouchSelect({
	label,
	placeholder,
	value,
	onChange,
	options,
	disabled = false,
	required = false,
	error,
	className = "",
	icon,
}: TouchSelectProps) {
	const [isOpen, setIsOpen] = React.useState(false);
	const [searchTerm, setSearchTerm] = React.useState("");
	const selectRef = React.useRef<HTMLDivElement>(null);

	const filteredOptions = options.filter((option) =>
		option.label.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const selectedOption = options.find((option) => option.value === value);

	const handleSelect = (option: (typeof options)[0]) => {
		if (!option.disabled) {
			onChange?.(option.value);
			setIsOpen(false);
			setSearchTerm("");
		}
	};

	// Close dropdown when clicking outside
	React.useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	return (
		<div className={`relative ${className}`} ref={selectRef}>
			<label className="block text-base font-bold text-gray-700 mb-2">
				{label}
				{required && <span className="text-error ml-1">*</span>}
			</label>

			<div className="relative">
				{icon && (
					<div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 z-10">
						{icon}
					</div>
				)}

				<button
					type="button"
					onClick={() => !disabled && setIsOpen(!isOpen)}
					disabled={disabled}
					className={`
            ${icon ? "pl-12" : "pl-4"}
            pr-12
            min-h-[56px] text-base
            w-full text-left
            border-2 rounded-lg
            ${isOpen ? "border-blue-500 ring-2 ring-blue-200" : "border-gray-300"}
            ${error ? "border-error ring-2 ring-red-200" : ""}
            ${disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white hover:border-gray-400"}
            transition-all duration-200
            focus:outline-none
          `}
				>
					<span className={selectedOption ? "text-gray-900" : "text-gray-500"}>
						{selectedOption ? selectedOption.label : placeholder}
					</span>

					<div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
						<svg
							className={`w-6 h-6 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M19 9l-7 7-7-7"
							/>
						</svg>
					</div>
				</button>

				{isOpen && (
					<div className="absolute z-50 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-xl max-h-64 overflow-y-auto">
						<div className="p-3 border-b border-gray-200">
							<Input
								type="search"
								placeholder="Search..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="text-sm"
							/>
						</div>

						{filteredOptions.length === 0 ? (
							<div className="p-4 text-center text-gray-500 text-sm">No options found</div>
						) : (
							filteredOptions.map((option) => (
								<button
									key={option.value}
									type="button"
									onClick={() => handleSelect(option)}
									disabled={option.disabled}
									className={`
                    w-full px-4 py-3 text-left border-b border-gray-100 last:border-b-0
                    hover:bg-gray-50 active:bg-gray-100
                    transition-colors duration-150
                    ${option.disabled ? "text-gray-400 cursor-not-allowed" : "text-gray-900"}
                    ${option.value === value ? "bg-blue-50 text-blue-600 font-semibold" : ""}
                  `}
								>
									{option.label}
								</button>
							))
						)}
					</div>
				)}
			</div>

			{error && <p className="mt-2 text-sm text-error font-medium">{error}</p>}
		</div>
	);
}

const keyTypeInput = "default" as const;
