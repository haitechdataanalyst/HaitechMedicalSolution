"use client";

import { useId, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface PasswordInputProps {
    id?: string;
    name: string;
    label: string;
    autoComplete?: string;
    required?: boolean;
    minLength?: number;
    placeholder?: string;
    value?: string;
    onChange?: (value: string) => void;
    error?: string;
    labelExtra?: React.ReactNode;
}

export default function PasswordInput({
    id,
    name,
    label,
    autoComplete = "current-password",
    required,
    minLength,
    placeholder,
    value,
    onChange,
    error,
    labelExtra,
}: PasswordInputProps) {
    const autoId = useId();
    const inputId = id ?? autoId;
    const [visible, setVisible] = useState(false);

    return (
        <div>
            <div className="mb-1.5 flex items-center justify-between">
                <label htmlFor={inputId} className="form-label mb-0">
                    {label}
                </label>
                {labelExtra}
            </div>
            <div className="relative">
                <input
                    id={inputId}
                    name={name}
                    type={visible ? "text" : "password"}
                    autoComplete={autoComplete}
                    required={required}
                    minLength={minLength}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange ? (e) => onChange(e.target.value) : undefined}
                    className={`form-input pr-11 ${error ? "form-input-error" : ""}`}
                />
                <button
                    type="button"
                    onClick={() => setVisible((v) => !v)}
                    tabIndex={-1}
                    className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-neutral-400 transition-colors hover:text-neutral-600"
                    aria-label={visible ? "Hide password" : "Show password"}
                >
                    {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
            </div>
            {error && <p className="form-error">{error}</p>}
        </div>
    );
}
