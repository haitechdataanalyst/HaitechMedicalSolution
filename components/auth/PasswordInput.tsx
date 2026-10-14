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

export default function PasswordInput({ id, name, label, autoComplete = "current-password", required, minLength, placeholder, value, onChange, error, labelExtra }: PasswordInputProps) {
    const autoId = useId();
    const inputId = id ?? autoId;
    const errorId = `${inputId}-error`;
    const [visible, setVisible] = useState(false);

    return (
        <div>
            <div className="mb-1.5 flex items-center justify-between gap-3">
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
                    aria-invalid={error ? true : undefined}
                    aria-describedby={error ? errorId : undefined}
                    className={`form-input pr-12 ${error ? "form-input-error" : ""}`}
                />
                <button
                    type="button"
                    onClick={() => setVisible((v) => !v)}
                    className="focus-visible:outline-primary-500 absolute top-1/2 right-0.5 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-neutral-500 transition-colors duration-200 ease-out hover:text-neutral-800 focus-visible:outline-2 focus-visible:outline-offset-[-2px]"
                    aria-label={visible ? "Hide password" : "Show password"}
                    aria-pressed={visible}
                >
                    {visible ? <EyeOff className="h-[18px] w-[18px]" aria-hidden="true" /> : <Eye className="h-[18px] w-[18px]" aria-hidden="true" />}
                </button>
            </div>
            {error && (
                <p id={errorId} className="form-error" role="alert">
                    {error}
                </p>
            )}
        </div>
    );
}
