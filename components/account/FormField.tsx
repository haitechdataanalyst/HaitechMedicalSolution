import { useId } from "react";
import { cn } from "@/lib/utils";

interface FormFieldProps {
    label: string;
    value: string;
    type?: string;
    placeholder?: string;
    onChange?: (value: string) => void;
    readOnly?: boolean;
    hint?: string;
    className?: string;
}

export function FormField({ label, value, type = "text", placeholder, onChange, readOnly, hint, className }: FormFieldProps) {
    const id = useId();
    const hintId = hint ? `${id}-hint` : undefined;

    return (
        <div className={className}>
            <label htmlFor={id} className="form-label">
                {label}
            </label>
            <input
                id={id}
                type={type}
                value={value}
                placeholder={placeholder}
                readOnly={readOnly}
                aria-describedby={hintId}
                onChange={(e) => onChange?.(e.target.value)}
                className={cn("form-input", readOnly && "cursor-default border-transparent bg-neutral-50 text-neutral-600 hover:border-transparent focus:shadow-none")}
            />
            {hint && (
                <p id={hintId} className="mt-1.5 text-[13px] text-neutral-500">
                    {hint}
                </p>
            )}
        </div>
    );
}
